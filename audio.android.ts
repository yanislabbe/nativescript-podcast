import {Common} from './audio.common';
import definition from "./audio";
import app = require("application");

// export class Audio extends Common {
//     private _android: android.media.MediaPlayer;
//     
//     get android(): android.media.MediaPlayer {
//         return this._android;
//     }
//     
//     var startAudio = function (params:type) {
//         
//     }
//     
//     
// }

// let android: any;
let MediaPlayer = android.media.MediaPlayer;
let MediaRecorder = android.media.MediaRecorder;

export var startPlayer = function(options: definition.AudioPlayerOptions): Promise<any> {
    return new Promise((resolve, reject) => {
        try {
            var mediaPlayer = new MediaPlayer();
            mediaPlayer.setAudioStreamType(android.media.AudioManager.STREAM_MUSIC);
            mediaPlayer.setDataSource(options.audioUrl);
            mediaPlayer.prepareAsync();
            
            // On Complete
            mediaPlayer.setOnCompletionListener(new MediaPlayer.OnCompletionListener({
                onCompletion: function(mp) {
                    options.completeCallback();
                }
            }));
            
            // On Error
            mediaPlayer.setOnErrorListener(new MediaPlayer.OnErrorListener({
                onError: function(mp: any, what: number, extra: number) {
                    options.errorCallback();
                }
            }));
            
            // On Info
            mediaPlayer.setOnInfoListener(new MediaPlayer.OnInfoListener({
                onInfo: function(mp: any, what: number, extra: number) {
                    console.log('what: ' + what + ' ' + 'extra: ' + extra);
                    options.infoCallback();
                }
            }))

            // On Prepared
            mediaPlayer.setOnPreparedListener(new MediaPlayer.OnPreparedListener({
                onPrepared: function(mp) {
                    mp.start();
                    resolve(mp);
                }
            }));

        } catch (ex) {
            reject(ex);
        }
    });
}

export var pausePlayer = function(player: any): Promise<any> {
    return new Promise((resolve, reject) => {
        try {
            var isPlaying = player.isPlaying();
            if (isPlaying) {
                console.log('PAUSE');
                player.pause();
                resolve(true);
            }
            resolve(false);
        } catch (ex) {
            reject(ex);
        }
    });
}

export var disposePlayer = function(player: any): Promise<any> {
    return new Promise((resolve, reject) => {
        try {
            player.release();
            resolve();
        } catch (ex) {
            reject(ex);
        }
    });
}

export var isAudioPlaying = function(player: any): boolean {
    if (player.isPlaying() === true) {
        return true;
    } else {
        return false;
    }
}

export var getAudioTrackDuration = function(player: any): Promise<string> {
    return new Promise((resolve, reject) => {
        try {
            var duration = player.getDuration();
            resolve(duration.toString());
        } catch (ex) {
            reject(ex);
        }
    });
}


/**** AUDIO RECORDING ****/

export var canDeviceRecord = function(): boolean {
    var pManager = app.android.context.getPackageManager();
    var canRecord = pManager.hasSystemFeature(android.content.pm.PackageManager.FEATURE_MICROPHONE);
    if (canRecord) {
        return true;
    } else {
        return false;
    }
}

export var startRecorder = function(options: definition.AudioRecorderOptions): Promise<any> {
    return new Promise((resolve, reject) => {
        try {
            var recorder = new MediaRecorder();
            recorder.setAudioSource(0);
            recorder.setOutputFormat(0);
            recorder.setAudioEncoder(0);
            // recorder.setOutputFile("/sdcard/example.mp4");
            recorder.setOutputFile(options.filename);
            recorder.prepare();
            recorder.start();
            
            // Is there any benefit to calling start() before setting listener?
            
            // On Error
            recorder.setOnErrorListener(new MediaRecorder.OnErrorListener({
                onError: function(mr: any, what: number, extra: number) {
                    options.errorCallback();
                }
            }));
            
            // On Info
            recorder.setOnInfoListener(new MediaRecorder.OnInfoListener({
                onInfo: function(mr: any, what: number, extra: number) {
                    options.infoCallback();
                }
            }));

            resolve(recorder);

        } catch (ex) {
            reject(ex);
        }
    });
}

export var stopRecorder = function(recorder: any): Promise<any> {
    return new Promise((resolve, reject) => {
        try {
            recorder.stop();
            resolve();
        } catch (ex) {
            reject(ex);
        }
    });
}

export var disposeRecorder = function(recorder: any): Promise<any> {
    return new Promise((resolve, reject) => {
        try {
            recorder.release();
            resolve();
        } catch (ex) {
            reject(ex);
        }
    });
}