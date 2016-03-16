import * as app from 'application';
import {isString} from 'utils/types';
import {knownFolders, path} from 'file-system';
import {TNSPlayerI} from '../common';
import {AudioPlayerOptions} from '../options';

export class TNSPlayer extends NSObject implements TNSPlayerI {
  public static ObjCProtocols = [AVAudioPlayerDelegate];
  private _player: any;
  private _task: any;

  public playFromFile(options: AudioPlayerOptions): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        let audioPath;

        let fileName = isString(options.audioFile) ? options.audioFile.trim() : "";
        if (fileName.indexOf("~/") === 0) {
          fileName = path.join(knownFolders.currentApp().path, fileName.replace("~/", ""))
        } 

        this._player = AVAudioPlayer.alloc().initWithContentsOfURLError(NSURL.fileURLWithPath(fileName));
        this._player.delegate = this;
        this._player.play();
        resolve();

      } catch (ex) {
        reject(ex);
      }
    });
  }

  public playFromUrl(options: AudioPlayerOptions): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this._task = NSURLSession.sharedSession().dataTaskWithURLCompletionHandler(NSURL.URLWithString(options.audioFile), (data, response, error) => {
          if (error !== null) {
            console.log(error);
            reject();
          }

          this._player = AVAudioPlayer.alloc().initWithDataError(data, null);
          this._player.delegate = this;
          this._player.numberOfLoops = 0;
          this._player.play();
          resolve();
        });

        this._task.resume();        

      } catch (ex) {
        reject(ex);
      }
    });
  }

  public pause(): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        if (this._player && this._player.playing) {
          console.log('PAUSE');
          this._player.pause();
          resolve(true);
        }
      } catch (ex) {
        reject(ex);
      }
    });
  }

  public play(): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        if (!this.isAudioPlaying()) {
          console.log('RESUME');
          this._player.play();
          resolve(true);
        }
      } catch (ex) {
        reject(ex);
      }
    });
  }   

  public dispose(): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        if (this._player && this.isAudioPlaying()) {
          this._player.stop();
        }
        this.reset();
        resolve();
      } catch (ex) {
        reject(ex);
      }
    });
  }

  public isAudioPlaying(): boolean {
    return this._player ? this._player.playing : false;
  }

  public getAudioTrackDuration(): Promise<string> {
    return new Promise((resolve, reject) => {
      try {
        var duration = this._player ? this._player.duration : 0;
        resolve(duration.toString());
      } catch (ex) {
        reject(ex);
      }
    });
  }

  public audioPlayerDidFinishPlayingSuccessfully(player?: any, flag?: boolean) {
    console.log('audioPlayerDidFinishPlayingSuccessfully');
    this.reset();
  }

  private reset() {
    if (this._player) {
      this._player.release();
      this._player = undefined;
    }
    if (this._task) {
      this._task.cancel();
      this._task = undefined;
    }
  }  
}