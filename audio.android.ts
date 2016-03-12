import {Common} from './audio.common';
import types = require("utils/types");
import definition = require("./audio");
import app = require("application");
import * as utilsModule from "utils/utils";
import * as fileSystemModule from "file-system";
import * as enumsModule from "ui/enums";

let MediaPlayer = android.media.MediaPlayer;
let MediaRecorder = android.media.MediaRecorder;

var utils: typeof utilsModule; 
function ensureUtils() {
    if (!utils) {
        utils = require("utils/utils");
    }
}

var fs: typeof fileSystemModule;
function ensureFS() {
    if (!fs) {
        fs = require("file-system");
    }
}

var enums: typeof enumsModule;
function ensureEnums() {
    if (!enums) {
        enums = require("ui/enums");
    }
}

export var playFromFile = function(options: definition.AudioPlayerOptions): Promise<any> {
    return new Promise((resolve, reject) => {
        try {
            var audioPath;

            ensureFS();

            var fileName = types.isString(options.audioFile) ? options.audioFile.trim() : "";
            if (fileName.indexOf("~/") === 0) {
                fileName = fs.path.join(fs.knownFolders.currentApp().path, fileName.replace("~/", ""));
                console.log('fileName: ' + fileName);
                audioPath = fileName;
            }

            var mediaPlayer = new MediaPlayer();
            mediaPlayer.setAudioStreamType(android.media.AudioManager.STREAM_MUSIC);
            mediaPlayer.setDataSource(audioPath);
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

export var playFromUrl = function(options: definition.AudioPlayerOptions): Promise<any> {
    return new Promise((resolve, reject) => {
        try {

            var mediaPlayer = new MediaPlayer();
            mediaPlayer.setAudioStreamType(android.media.AudioManager.STREAM_MUSIC);
            mediaPlayer.setDataSource(options.audioFile);
            mediaPlayer.prepareAsync();

            // On Complete
            if (options.completeCallback) {
                mediaPlayer.setOnCompletionListener(new MediaPlayer.OnCompletionListener({
                    onCompletion: function(mp) {
                        options.completeCallback();
                    }
                }));
            }

            // On Error
            if (options.errorCallback) {
                mediaPlayer.setOnErrorListener(new MediaPlayer.OnErrorListener({
                    onError: function(mp: any, what: number, extra: number) {
                        options.errorCallback();
                    }
                }));
            }

            // On Info
            if (options.infoCallback) {
                mediaPlayer.setOnInfoListener(new MediaPlayer.OnInfoListener({
                    onInfo: function(mp: any, what: number, extra: number) {
                        options.infoCallback();
                    }
                }))
            }

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
                    options.errorCallback({ msg: what, extra: extra });
                }
            }));

            // On Info
            recorder.setOnInfoListener(new MediaRecorder.OnInfoListener({
                onInfo: function(mr: any, what: number, extra: number) {
                    options.infoCallback({ msg: what, extra: extra });
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









// export var playFromResource = function(options: definition.AudioPlayerOptions): Promise<any> {
//     return new Promise((resolve, reject) => {
//         try {
//             var audioPath;

//             ensureUtils();

//             var res = utils.ad.getApplicationContext().getResources();
//             var packageName = utils.ad.getApplication().getPackageName();
//             var identifier = utils.ad.getApplicationContext().getResources().getIdentifier("in_the_night", "raw", packageName);
//             console.log(identifier);
//             console.log(packageName);
//             console.log(res);
//             if (res) {
//                 var resourcePath = "android.resource://" + packageName + "/raw/" + options.audioFile;
//                 audioPath = resourcePath;
//             }

//             var mediaPlayer = new MediaPlayer();
//             mediaPlayer.setAudioStreamType(android.media.AudioManager.STREAM_MUSIC);
//             mediaPlayer.setDataSource(audioPath);
//             mediaPlayer.prepareAsync();

//             // On Complete            
//             if (options.completeCallback) {
//                 mediaPlayer.setOnCompletionListener(new MediaPlayer.OnCompletionListener({
//                     onCompletion: function(mp) {
//                         options.completeCallback();
//                     }
//                 }));
//             }

//             // On Error
//             if (options.errorCallback) {
//                 mediaPlayer.setOnErrorListener(new MediaPlayer.OnErrorListener({
//                     onError: function(mp: any, what: number, extra: number) {
//                         options.errorCallback({ msg: what, extra: extra });
//                     }
//                 }));
//             }

//             // On Info
//             if (options.infoCallback) {
//                 mediaPlayer.setOnInfoListener(new MediaPlayer.OnInfoListener({
//                     onInfo: function(mp: any, what: number, extra: number) {
//                         options.infoCallback({ msg: what, extra: extra });
//                     }
//                 }))
//             }

//             // On Prepared - this resolves and returns the android.media.MediaPlayer;
//             mediaPlayer.setOnPreparedListener(new MediaPlayer.OnPreparedListener({
//                 onPrepared: function(mp) {
//                     mp.start();
//                     resolve(mp);
//                 }
//             }));

//         } catch (ex) {
//             reject(ex);
//         }
//     });
// }