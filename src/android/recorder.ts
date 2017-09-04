import * as app from "tns-core-modules/application";
import { TNSRecordI } from "../common";
import { AudioRecorderOptions } from "../options";

declare var android: any;

const MediaRecorder = android.media.MediaRecorder;

export class TNSRecorder implements TNSRecordI {
  private recorder: any;

  get android() {
    return this.recorder;
  }

  public static CAN_RECORD(): boolean {
    var pManager = app.android.context.getPackageManager();
    var canRecord = pManager.hasSystemFeature(
      android.content.pm.PackageManager.FEATURE_MICROPHONE
    );
    if (canRecord) {
      return true;
    } else {
      return false;
    }
  }

  public start(options: AudioRecorderOptions): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        if (this.recorder) {
          // reset for reuse
          this.recorder.reset();
        } else {
          this.recorder = new MediaRecorder();
        }

        if (options.source) {
          this.recorder.setAudioSource(options.source);
        } else {
          this.recorder.setAudioSource(0);
        }
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
        this.recorder.setOnErrorListener(
          new android.media.MediaRecorder.OnErrorListener({
            onError: (recorder: any, error: number, extra: number) => {
              options.errorCallback({ recorder, error, extra });
            }
          })
        );

        // On Info
        this.recorder.setOnInfoListener(
          new android.media.MediaRecorder.OnInfoListener({
            onInfo: (recorder: any, info: number, extra: number) => {
              options.infoCallback({ recorder, info, extra });
            }
          })
        );

        this.recorder.prepare();
        this.recorder.start();

        resolve();
      } catch (ex) {
        reject(ex);
      }
    });
  }

  public getMeters(): number {
    if (this.recorder != null) return this.recorder.getMaxAmplitude();
    else return 0;
  }

  public pause(): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        if (this.recorder) {
          this.recorder.pause();
        }
        resolve();
      } catch (ex) {
        reject(ex);
      }
    });
  }

  public resume(): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        if (this.recorder) {
          this.recorder.resume();
        }
        resolve();
      } catch (ex) {
        reject(ex);
      }
    });
  }

  public stop(): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        if (this.recorder) {
          this.recorder.stop();
        }
        resolve();
      } catch (ex) {
        reject(ex);
      }
    });
  }

  public dispose(): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        if (this.recorder) {
          this.recorder.release();
        }
        this.recorder = undefined;
        resolve();
      } catch (ex) {
        reject(ex);
      }
    });
  }
}
