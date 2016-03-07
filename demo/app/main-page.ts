var observable = require('data/observable');
var page = require('ui/page');
var fs = require('file-system');
var audio = require("nativescript-audio");
var data = new observable.Observable({});
var MediaRecorder = android.media.MediaRecorder;
var MediaPlayer = android.media.MediaPlayer;
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
    var options = { filename: "sdcard/example.mp4" };
    audio.startRecording(options).then(function(result) {
        recorder = result;
    }, function(err) {
        alert(err);
    });
}
exports.startRecord = startRecord

function stopRecord(args) {
    try {
        recorder.stop();
        console.log('STOP');
    } catch (ex) {
        console.log(ex);
    }
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

function playAudio(args) {
    //var url = "http://www.noiseaddicts.com/samples_1w72b820/17.mp3";
    var url = "http://www.noiseaddicts.com/samples_1w72b820/2514.mp3";

    var onComplete = function() {
        alert('Audio File Completed');
    };

    var onError = function() {
        alert('Error callback');
    };

    var onInfo = function() {
        alert('Info callback');
    }

    var options = { audioUrl: url, completeCallback: onComplete, errorCallback: onError, infoCallback: onInfo };

    audio.playAudio(options).then(function(result) {
        console.log(result);
        mediaPlayer = result;
    }, function(err) {
        alert(err);
    });
}
exports.playAudio = playAudio;

function pauseAudio(args) {
    audio.pauseAudio(mediaPlayer).then(function(result) {
        console.log(result);
    }, function(err) {
        console.log(err);
    });
}
exports.pauseAudio = pauseAudio;

function startAudio(args) {
    console.log('START');
    mediaPlayer.start();
}
exports.startAudio = startAudio;

function getFileDuration(args) {
    audio.getAudioTrackDuration(mediaPlayer).then(function(result) {
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
