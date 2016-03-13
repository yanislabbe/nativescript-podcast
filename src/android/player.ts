import {isString} from 'utils/types';
import {AudioPlayerOptions} from '../../audio';
import * as app from 'application';
import * as utils from 'utils/utils';
import * as fs from 'file-system';
import * as enums from 'ui/enums';

export class TNSPlayer {
  private player: any;

  constructor() {
    this.player = new android.media.MediaPlayer();
  }  

  public playFromFile(options: AudioPlayerOptions): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        let MediaPlayer = android.media.MediaPlayer;
        let audioPath;

        let fileName = isString(options.audioFile) ? options.audioFile.trim() : "";
        if (fileName.indexOf("~/") === 0) {
          fileName = fs.path.join(fs.knownFolders.currentApp().path, fileName.replace("~/", ""));
          console.log('fileName: ' + fileName);
          audioPath = fileName;
        }

        this.player.setAudioStreamType(android.media.AudioManager.STREAM_MUSIC);
        this.player.setDataSource(audioPath);
        this.player.prepareAsync();

        // On Complete
        this.player.setOnCompletionListener(MediaPlayer.OnCompletionListener({
          onCompletion: (mp) => {
            options.completeCallback();
          }
        }));

        // On Error
        this.player.setOnErrorListener(MediaPlayer.OnErrorListener({
          onError: (mp: any, what: number, extra: number) => {
            options.errorCallback();
          }
        }));

        // On Info
        this.player.setOnInfoListener(MediaPlayer.OnInfoListener({
          onInfo: (mp: any, what: number, extra: number) => {
            options.infoCallback();
          }
        }))

        // On Prepared
        this.player.setOnPreparedListener(MediaPlayer.OnPreparedListener({
          onPrepared: (mp) => {
            mp.start();
            resolve();
          }
        }));

      } catch (ex) {
        reject(ex);
      }
    });
  }

  public playFromUrl(options: AudioPlayerOptions): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        let MediaPlayer = android.media.MediaPlayer;

        this.player.setAudioStreamType(android.media.AudioManager.STREAM_MUSIC);
        this.player.setDataSource(options.audioFile);
        this.player.prepareAsync();

        // On Complete
        if (options.completeCallback) {
          this.player.setOnCompletionListener(MediaPlayer.OnCompletionListener({
            onCompletion: (mp) => {
              options.completeCallback();
            }
          }));
        }

        // On Error
        if (options.errorCallback) {
          this.player.setOnErrorListener(MediaPlayer.OnErrorListener({
            onError: (mp: any, what: number, extra: number) => {
              options.errorCallback();
            }
          }));
        }

        // On Info
        if (options.infoCallback) {
          this.player.setOnInfoListener(MediaPlayer.OnInfoListener({
            onInfo: (mp: any, what: number, extra: number) => {
              options.infoCallback();
            }
          }))
        }

        // On Prepared
        this.player.setOnPreparedListener(MediaPlayer.OnPreparedListener({
          onPrepared: (mp) => {
            mp.start();
            resolve();
          }
        }));

      } catch (ex) {
        reject(ex);
      }
    });
  }

  public pause(): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        var isPlaying = this.player.isPlaying();
        if (isPlaying) {
          console.log('PAUSE');
          this.player.pause();
          resolve(true);
        }
        resolve(false);
      } catch (ex) {
        reject(ex);
      }
    });
  }

  public dispose(): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.player.release();
        resolve();
      } catch (ex) {
        reject(ex);
      }
    });
  }

  public isAudioPlaying(): boolean {
    return this.player.isPlaying();
  }

  public getAudioTrackDuration(): Promise<string> {
    return new Promise((resolve, reject) => {
      try {
        var duration = this.player.getDuration();
        resolve(duration.toString());
      } catch (ex) {
        reject(ex);
      }
    });
  }
}

// TODO: convert this into above

// export var playFromResource = function(options: definition.AudioPlayerOptions): Promise<any> {
//     return new Promise((resolve, reject) => {
//         try {
//             var audioPath;

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