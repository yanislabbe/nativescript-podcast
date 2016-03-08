var observable = require('data/observable');
var page = require('ui/page');
var fs = require('file-system');
var audioModule = require("nativescript-audio");
var snackbar = require("nativescript-snackbar");


var MediaRecorder = android.media.MediaRecorder;
var MediaPlayer = android.media.MediaPlayer;

var data = new observable.Observable({
    isPlaying: false
});


var recorder;
var mediaPlayer;


// Event handler for Page "loaded" event attached in main-page.xml
function pageLoaded(args) {
    // Get the event sender
    var page = args.object;
    page.bindingContext = data;
}
exports.pageLoaded = pageLoaded;

function startRecord(args) {

    var canRecord = audioModule.canDeviceRecord();

    if (canRecord) {
        var onInfo = function() {
            console.log('INFO CALLBACK ');
        }

        var onError = function() {
            console.log('ERROR CALLBACK ');
        }

        var options = {
            filename: "sdcard/example.mp4",
            infoCallback: onInfo,
            errorCallback: onError
        }

        audioModule.startRecorder(options).then(function(result) {
            recorder = result;
        }, function(err) {
            alert(err);
        });
    } else {
        alert("This device cannot record audio.");
    }
}
exports.startRecord = startRecord

function stopRecord(args) {
    audioModule.stopRecorder(recorder).then(function(result) {
        console.log(result);
        snackbar.simple("Recorder stopped");
    }, function(ex) {
        console.log(ex);
    });
}
exports.stopRecord = stopRecord;

function getFile(args) {
    try {
        console.log('GET FILE');
        var file = fs.knownFolders.documents().getFile("example.mp4");
        console.log('FILE: ' + JSON.stringify(file));
    } catch (ex) {
        console.log(ex);
    }
}
exports.getFile = getFile;




/***** AUDIO PLAYER *****/

function playAudio(args) {
    //var url = "http://www.noiseaddicts.com/samples_1w72b820/17.mp3";
    var url = "http://www.noiseaddicts.com/samples_1w72b820/2514.mp3";

    var onComplete = function() {
        snackbar.simple("Audio file complete");
    };

    var onError = function() {
        alert('Error callback');
    };

    var onInfo = function() {
        alert('Info callback');
    }

    var options = { audioUrl: url, completeCallback: onComplete, errorCallback: onError, infoCallback: onInfo };

    data.set("isPlaying", true);
    audioModule.startPlayer(options).then(function(result) {
        console.log(result);
        mediaPlayer = result;
        getFileDuration(mediaPlayer);
    }, function(err) {
        alert(err);
        data.set("isPlaying", false);
    });
}
exports.playAudio = playAudio;

function pauseAudio(args) {
    audioModule.pausePlayer(mediaPlayer).then(function(result) {
        console.log(result);
        data.set("isPlaying", false);
    }, function(err) {
        console.log(err);
        data.set("isPlaying", true);
    });
}
exports.pauseAudio = pauseAudio;

function startAudio(args) {
    console.log('START');
    mediaPlayer.start();
}
exports.startAudio = startAudio;

function getFileDuration(args) {
    audioModule.getAudioTrackDuration(args).then(function(result) {
        console.log(result);
        var convertedTime = msToTime(result);
        data.set("trackDuration", convertedTime);
    }, function(err) {
        alert(err);
    });
}
exports.getFileDuration = getFileDuration;



function msToTime(duration) {
    var milliseconds = parseInt((duration % 1000) / 100)
        , seconds = parseInt((duration / 1000) % 60)
        , minutes = parseInt((duration / (1000 * 60)) % 60);
    // , hours = parseInt((duration / (1000 * 60 * 60)) % 24);

    // hours = (hours < 10) ? "0" + hours : hours;
    minutes = (minutes < 10) ? "0" + minutes : minutes;
    seconds = (seconds < 10) ? "0" + seconds : seconds;

    return minutes + ":" + seconds;
}
