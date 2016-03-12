import observable = require('data/observable');
// import page = require('ui/page');
import fs = require('file-system');
import audioModule = require("nativescript-audio");
import snackbar = require("nativescript-snackbar");
import app = require("application");
import color = require("color");
import platform = require("platform");
import types = require("utils/types");

var MediaRecorder = android.media.MediaRecorder;
var MediaPlayer = android.media.MediaPlayer;

var data = new observable.Observable({
    isPlaying: false
});


var recorder;
var mediaPlayer;
var audioSessionId;
var page;

var audioUrls = [
    { name: 'Fight Club', pic: '~/pics/canoe_girl.jpeg', url: 'http://www.noiseaddicts.com/samples_1w72b820/2514.mp3' },
    { name: 'To The Bat Cave!!!', pic: '~/pics/bears.jpeg', url: 'http://www.noiseaddicts.com/samples_1w72b820/17.mp3' },
    { name: 'Marlon Brando', pic: '~/pics/northern_lights.jpeg', url: 'http://www.noiseaddicts.com/samples_1w72b820/47.mp3' }
];

// Event handler for Page "loaded" event attached in main-page.xml
function pageLoaded(args) {
    // Get the event sender
    page = args.object;
    page.bindingContext = data;

    if (app.android && platform.device.sdkVersion >= "21") {
        var window = app.android.startActivity.getWindow();
        window.setNavigationBarColor(new color.Color("#C2185B").android);
    }
}
exports.pageLoaded = pageLoaded;


function startRecord(args) {

    var canRecord = audioModule.canDeviceRecord();

    if (canRecord) {

        var audioFolder = fs.knownFolders.currentApp().getFolder("audio");
        console.log(JSON.stringify(audioFolder));

        var file = "~/audio/recording.mp3";        
        
        var recorderOptions = {

            filename: audioFolder.path + "/recording.mp3",

            infoCallback: function() {
                console.log();
            },

            errorCallback: function() {
                console.log();
                snackbar.simple('Error recording.');
            }
        };

        data.set("isRecording", true);
        audioModule.startRecorder(recorderOptions).then(function(result) {
            recorder = result;
        }, function(err) {
            data.set("isRecording", false);
            alert(err);
        });
    } else {
        alert("This device cannot record audio.");
    }
}
exports.startRecord = startRecord

function stopRecord(args) {
    audioModule.disposeRecorder(recorder).then(function() {
        data.set("isRecording", false);
        snackbar.simple("Recorder stopped");
    }, function(ex) {
        console.log(ex);
        data.set("isRecording", false);
    });
}
exports.stopRecord = stopRecord;

function getFile(args) {
    try {
        var audioFolder = fs.knownFolders.currentApp().getFolder("audio");
        var recordedFile = audioFolder.getFile("recording.mp3");
        console.log(JSON.stringify(recordedFile));
        console.log('recording exists: ' + fs.File.exists(recordedFile.path));
        data.set("recordedAudioFile", recordedFile.path);
    } catch (ex) {
        console.log(ex);
    }
}
exports.getFile = getFile;


function playRecordedFile(args) {

    var audioFolder = fs.knownFolders.currentApp().getFolder("audio");
    var recordedFile = audioFolder.getFile("recording.mp3");
    console.log("RECORDED FILE : " + JSON.stringify(recordedFile));

    var playerOptions = {
        audioFile: "~/audio/recording.mp3",

        completeCallback: function() {
            snackbar.simple("Audio file complete");
            data.set("isPlaying", false);
            audioModule.disposePlayer(mediaPlayer).then(function() {
                console.log('DISPOSED');
            }, function(err) {
                console.log(err);
            });
        },

        errorCallback: function() {
            alert('Error callback');
            data.set("isPlaying", false);
        },

        infoCallback: function() {
            alert('Info callback');
        }
    };

    data.set("isPlaying", true);
    audioModule.playFromFile(playerOptions).then(function(result) {
        console.log(result);
        mediaPlayer = result;
    }, function(err) {
        console.log(err);
        data.set("isPlaying", false);
    });

}
exports.playRecordedFile = playRecordedFile;



/***** AUDIO PLAYER *****/

function playAudio(filepath, fileType) {

    try {
        var playerOptions = {
            audioFile: filepath,

            completeCallback: function() {
                snackbar.simple("Audio file complete");
                data.set("isPlaying", false);
                audioModule.disposePlayer(mediaPlayer).then(function() {
                    console.log('DISPOSED');
                }, function(err) {
                    console.log('ERROR disposePlayer: ' + err);
                });
            },

            errorCallback: function(err) {
                snackbar.simple('Error occurred during playback.');
                console.log(err);
                data.set("isPlaying", false);
            },

            infoCallback: function(info) {
                alert('Info callback: ' + info.msg);
                console.log("what: " + info);
            }
        };

        data.set("isPlaying", true);

        if (fileType === 'localFile') {
            audioModule.playFromFile(playerOptions).then(function(result) {
                console.log(result);
                mediaPlayer = result;
            }, function(err) {
                console.log(err);
                data.set("isPlaying", false);
            });
        } else if (fileType === 'remoteFile') {
            audioModule.playFromUrl(playerOptions).then(function(result) {
                console.log(result);
                mediaPlayer = result;
            }, function(err) {
                console.log(err);
                data.set("isPlaying", false);
            });
        }
    } catch (ex) {
        console.log(ex);
    }

}



///**
//  * PLAY RESOURCES FILE
//  */
// function playResFile(args) {
//     var filepath = 'in_the_night';
//     if (mediaPlayer) {
//         mediaPlayer = null;
//     }

//     playAudio(filepath, 'resFile');

// }
// exports.playResFile = playResFile;

/**
 * PLAY REMOTE AUDIO FILE
 */
function playRemoteFile(args) {
    console.log('playRemoteFile');
    var filepath = 'http://www.noiseaddicts.com/samples_1w72b820/2514.mp3';
    if (mediaPlayer) {
        mediaPlayer = null;
    }

    playAudio(filepath, 'remoteFile');

}
exports.playRemoteFile = playRemoteFile;

/**
 * PLAY LOCAL AUDIO FILE from app folder
 */
function playLocalFile(args) {
    var filepath = '~/audio/angel.mp3';
    if (mediaPlayer) {
        mediaPlayer = null;
    }

    playAudio(filepath, 'localFile');

}
exports.playLocalFile = playLocalFile;






/**
 * PAUSE PLAYING
 */
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





function stopPlaying(args) {
    audioModule.disposePlayer(mediaPlayer).then(function() {
        snackbar.simple("Media Player Disposed");
    }, function(err) {
        console.log(err);
    });
}
exports.stopPlaying = stopPlaying;


/**
 * RESUME PLAYING
 */
function resumePlaying(args) {
    console.log('START');
    mediaPlayer.start();
}
exports.resumePlaying = resumePlaying;