import * as app from 'application';
import {TNSRecordI} from '../common';
import {AudioRecorderOptions} from '../options';

export class TNSRecorder implements TNSRecordI {
  private recorder: any;

  public static CAN_RECORD(): boolean {
    var pManager = app.android.context.getPackageManager();
    var canRecord = pManager.hasSystemFeature(android.content.pm.PackageManager.FEATURE_MICROPHONE);
    if (canRecord) {
      return true;
    } else {
      return false;
    }
  }

  public start(options: AudioRecorderOptions): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.recorder = new android.media.MediaRecorder();

        this.recorder.setAudioSource(0);
        this.recorder.setOutputFormat(0);
        this.recorder.setAudioEncoder(0);
        // recorder.setOutputFile("/sdcard/example.mp4");
        this.recorder.setOutputFile(options.filename);
        

        // Is there any benefit to calling start() before setting listener?

        // On Error
        this.recorder.setOnErrorListener(android.media.MediaRecorder.OnErrorListener({
          onError: (mr: any, what: number, extra: number) => {
            options.errorCallback({ msg: what, extra: extra });
          }
        }));

        // On Info
        this.recorder.setOnInfoListener(android.media.MediaRecorder.OnInfoListener({
          onInfo: (mr: any, what: number, extra: number) => {
            options.infoCallback({ msg: what, extra: extra });
          }
        }));

        this.recorder.prepare();
        this.recorder.start();        

        resolve();

      } catch (ex) {
        reject(ex);
      }
    });
  }

  public stop(): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.recorder.stop();
        resolve();
      } catch (ex) {
        reject(ex);
      }
    });
  }

  public dispose(): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.recorder.release();
        this.recorder = undefined;
        resolve();
      } catch (ex) {
        reject(ex);
      }
    });
  }
}
