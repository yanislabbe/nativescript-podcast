import * as app from 'application';
import {TNSRecordI} from '../common';
import {AudioRecorderOptions} from '../options';

declare var android: any;

let MediaRecorder = android.media.MediaRecorder;

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
        this.recorder = new MediaRecorder();

        this.recorder.setAudioSource(0);
        if (options.format) {
          this.recorder.setOutputFormat(options.format);
        } else {
          this.recorder.setOutputFormat(0);
        }
        if (options.encoder) {
          this.recorder.setAudioEncoder(options.encoder);
        } else {
          this.recorder.setAudioEncoder(0);
        }
        if (options.channels) {
          this.recorder.setAudioChannels(options.channels);
        } 
        if (options.sampleRate) {
          this.recorder.setAudioSamplingRate(options.sampleRate);
        }
        if (options.bitRate) {
          this.recorder.setAudioEncodingBitRate(options.bitRate);
        }

        // recorder.setOutputFile("/sdcard/example.mp4");
        this.recorder.setOutputFile(options.filename);
        

        // Is there any benefit to calling start() before setting listener?

        // On Error
        this.recorder.setOnErrorListener(new android.media.MediaRecorder.OnErrorListener({
          onError: (mr: any, what: number, extra: number) => {
            options.errorCallback({ msg: what, extra: extra });
          }
        }));

        // On Info
        this.recorder.setOnInfoListener(new android.media.MediaRecorder.OnInfoListener({
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

  public getMeters(): number {
    if (this.recorder != null)
      return this.recorder.getMaxAmplitude();
    else
      return 0;

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
