import {Common} from './audio.common';
import definition = require("audio");

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
 
var MediaPlayer = android.media.MediaPlayer;
var MediaRecorder = android.media.MediaRecorder;

export var playAudio = function(options: definition.AudioPlayerOptions): Promise<any> {
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
                    resolve(mediaPlayer);
                }
            }));

        } catch (ex) {
            reject(ex);
        }
    });
}

export var pauseAudio = function(player: any): Promise<boolean> {
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
            reject(false);
        }
    });
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

export var disposeAudioPlayer = function(player: any): Promise<any> {
    return new Promise((resolve, reject) => {
        try {
            player.release();
        } catch (ex) {
            reject(ex);
        }
    });
}

export var startRecording = function(options: definition.AudioRecorderOptions): Promise<any> {
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
            resolve(recorder);
        } catch (ex) {
            console.log(ex);
        }
    });
}