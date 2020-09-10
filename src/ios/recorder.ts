import { TNSRecordI } from '../common';
import { AudioRecorderOptions } from '../options';

@NativeClass()
export class TNSRecorder extends NSObject implements TNSRecordI {
  public static ObjCProtocols = [AVAudioRecorderDelegate];
  private _recorder: any;
  private _recordingSession: any;

  public static CAN_RECORD(): boolean {
    return true;
  }

  get ios() {
    return this._recorder;
  }

  public requestRecordPermission() {
    return new Promise((resolve, reject) => {
      this._recordingSession.requestRecordPermission((allowed: boolean) => {
        if (allowed) {
          resolve(true);
        } else {
          reject('Record permissions denied');
        }
      });
    });
  }

  public start(options: AudioRecorderOptions): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this._recordingSession = AVAudioSession.sharedInstance();
        let errorRef = new interop.Reference();
        this._recordingSession.setCategoryError(AVAudioSessionCategoryPlayAndRecord, errorRef);
        if (errorRef) {
          console.error(`setCategoryError: ${errorRef.value}, ${errorRef}`);
        }

        this._recordingSession.setActiveError(true, null);
        this._recordingSession.requestRecordPermission((allowed: boolean) => {
          if (allowed) {
            // var recordSetting = new NSMutableDictionary((<any>[NSNumber.numberWithInt(kAudioFormatMPEG4AAC), NSNumber.numberWithInt((<any>AVAudioQuality).Medium.rawValue), NSNumber.numberWithFloat(16000.0), NSNumber.numberWithInt(1)]),
            //   (<any>["AVFormatIDKey", "AVEncoderAudioQualityKey", "AVSampleRateKey", "AVNumberOfChannelsKey"]));

            const recordSetting = NSMutableDictionary.alloc().init();
            recordSetting.setValueForKey(NSNumber.numberWithInt(kAudioFormatMPEG4AAC), 'AVFormatIDKey');
            // recordSetting.setValueForKey(
            //   NSNumber.numberWithInt((<any>AVAudioQuality).Medium.rawValue),
            //   'AVEncoderAudioQualityKey'
            // );
            recordSetting.setValueForKey(NSNumber.numberWithInt(AVAudioQuality.Medium), 'AVEncoderAudioQualityKey');
            recordSetting.setValueForKey(NSNumber.numberWithFloat(16000.0), 'AVSampleRateKey');
            recordSetting.setValueForKey(NSNumber.numberWithInt(1), 'AVNumberOfChannelsKey');

            errorRef = new interop.Reference();

            const url = NSURL.fileURLWithPath(options.filename);

            this._recorder = (<any>AVAudioRecorder.alloc()).initWithURLSettingsError(url, recordSetting, errorRef);
            if (errorRef && errorRef.value) {
              console.error(`initWithURLSettingsError errorRef: ${errorRef.value}, ${errorRef}`);
            } else {
              this._recorder.delegate = this;
              if (options.metering) {
                this._recorder.meteringEnabled = true;
              }
              this._recorder.prepareToRecord();
              this._recorder.record();
              resolve();
            }
          }
        });
      } catch (ex) {
        reject(ex);
      }
    });
  }

  public pause(): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        if (this._recorder) {
          this._recorder.pause();
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
        if (this._recorder) {
          this._recorder.record();
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
        if (this._recorder) {
          this._recorder.stop();
        }
        // may need this in future
        // this._recordingSession.setActiveError(false, null);
        this._recorder.meteringEnabled = false;
        resolve();
      } catch (ex) {
        reject(ex);
      }
    });
  }

  public dispose(): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        if (this._recorder) {
          this._recorder.stop();
          this._recorder.meteringEnabled = false;
          this._recordingSession.setActiveError(false, null);
          this._recorder.release();
          this._recorder = undefined;
        }
        resolve();
      } catch (ex) {
        reject(ex);
      }
    });
  }

  public isRecording() {
    return this._recorder && this._recorder.recording;
  }

  public getMeters(channel?: number) {
    if (this._recorder) {
      if (!this._recorder.meteringEnabled) {
        this._recorder.meteringEnabled = true;
      }
      this._recorder.updateMeters();
      return this._recorder.averagePowerForChannel(channel);
    }
  }

  public audioRecorderDidFinishRecording(recorder: any, success: boolean) {
    console.log(`audioRecorderDidFinishRecording: ${success}`);
  }
}
