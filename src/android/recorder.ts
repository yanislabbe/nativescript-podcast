import * as app from 'application';
import * as definition from '../../audio';

export class TNSRecorder {
  private recorder: any;

  constructor() {
    this.recorder = new android.media.MediaRecorder();
  }

  public static CAN_RECORD(): boolean {
    var pManager = app.android.context.getPackageManager();
    var canRecord = pManager.hasSystemFeature(android.content.pm.PackageManager.FEATURE_MICROPHONE);
    if (canRecord) {
      return true;
    } else {
      return false;
    }
  }

  public start(options: definition.AudioRecorderOptions): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        let MediaRecorder = android.media.MediaRecorder;

        this.recorder.setAudioSource(0);
        this.recorder.setOutputFormat(0);
        this.recorder.setAudioEncoder(0);
        // recorder.setOutputFile("/sdcard/example.mp4");
        this.recorder.setOutputFile(options.filename);
        this.recorder.prepare();
        this.recorder.start();

        // Is there any benefit to calling start() before setting listener?

        // On Error
        this.recorder.setOnErrorListener(MediaRecorder.OnErrorListener({
          onError: (mr: any, what: number, extra: number) => {
            options.errorCallback({ msg: what, extra: extra });
          }
        }));

        // On Info
        this.recorder.setOnInfoListener(MediaRecorder.OnInfoListener({
          onInfo: (mr: any, what: number, extra: number) => {
            options.infoCallback({ msg: what, extra: extra });
          }
        }));

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
        resolve();
      } catch (ex) {
        reject(ex);
      }
    });
  }
}
