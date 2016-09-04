import {Observable} from 'data/observable';
import * as fs from 'file-system';
import * as snackbar from 'nativescript-snackbar';
import * as app from 'application';
import * as color from 'color';
import * as platform from 'platform';
import {TNSRecorder, TNSPlayer, AudioRecorderOptions} from 'nativescript-audio';

declare var android;

export class AudioDemo extends Observable {
  public isPlaying: boolean;
  public isRecording: boolean;
  public recordedAudioFile: string;
  private recorder;
  private player;
  private audioSessionId;
  private page;
  private audioUrls: Array<any> = [
    { name: 'Fight Club', pic: '~/pics/canoe_girl.jpeg', url: 'http://www.noiseaddicts.com/samples_1w72b820/2514.mp3' },
    { name: 'To The Bat Cave!!!', pic: '~/pics/bears.jpeg', url: 'http://www.noiseaddicts.com/samples_1w72b820/17.mp3' },
    { name: 'Marlon Brando', pic: '~/pics/northern_lights.jpeg', url: 'http://www.noiseaddicts.com/samples_1w72b820/47.mp3' }
  ];
  private meterInterval: any;

  constructor() {
    super();

    this.player = new TNSPlayer();
    this.recorder = new TNSRecorder();
  }

  public startRecord(args) {
    if (TNSRecorder.CAN_RECORD()) {

      var audioFolder = fs.knownFolders.currentApp().getFolder("audio");
      console.log(JSON.stringify(audioFolder));

      let androidFormat;
      let androidEncoder;
      if (platform.isAndroid) {
        // m4a
        if (android.media.MediaRecorder) {
          for (let key in android.media.MediaRecorder) {
            console.log(key);
          }
        }
        // androidFormat = android.media.MediaRecorder.OutputFormat.MPEG_4;
        androidFormat = 2;
        // androidEncoder = android.media.MediaRecorder.AudioEncoder.AAC;
        androidEncoder = 3;
      }

      let recorderOptions: AudioRecorderOptions = {

        filename: `${audioFolder.path}/recording.${this.platformExtension()}`,

        format: androidFormat,

        encoder: androidEncoder,

        metering: true,

        infoCallback: () => {
          console.log();
        },

        errorCallback: () => {
          console.log();
          // snackbar.simple('Error recording.');
        }
      };


      this.recorder.start(recorderOptions).then((result) => {
        this.set("isRecording", true);
        if (recorderOptions.metering) {
          this.initMeter();
        }
      }, (err) => {
        this.set("isRecording", false);
        this.resetMeter();
        alert(err);
      });
    } else {
      alert("This device cannot record audio.");
    }
  }

  public stopRecord(args) {
    this.resetMeter();
    this.recorder.stop().then(() => {
      this.set("isRecording", false);
      snackbar.simple("Recorder stopped");
      this.resetMeter();
    }, (ex) => {
      console.log(ex);
      this.set("isRecording", false);
      this.resetMeter();
    });
  }

  private initMeter() {
    this.resetMeter();
    this.meterInterval = setInterval(() => {
      console.log(this.recorder.getMeters());
    }, 500);
  }

  private resetMeter() {
    if (this.meterInterval) {
      clearInterval(this.meterInterval);
      this.meterInterval = undefined;
    }
  }

  public getFile(args) {
    try {
      var audioFolder = fs.knownFolders.currentApp().getFolder("audio");
      var recordedFile = audioFolder.getFile(`recording.${this.platformExtension()}`);
      console.log(JSON.stringify(recordedFile));
      console.log('recording exists: ' + fs.File.exists(recordedFile.path));
      this.set("recordedAudioFile", recordedFile.path);
    } catch (ex) {
      console.log(ex);
    }
  }


  public playRecordedFile(args) {

    var audioFolder = fs.knownFolders.currentApp().getFolder("audio");
    var recordedFile = audioFolder.getFile(`recording.${this.platformExtension()}`);
    console.log("RECORDED FILE : " + JSON.stringify(recordedFile));

    var playerOptions = {
      audioFile: `~/audio/recording.${this.platformExtension()}`,

      completeCallback: () => {
        snackbar.simple("Audio file complete");
        this.set("isPlaying", false);
        this.player.dispose().then(() => {
          console.log('DISPOSED');
        }, (err) => {
          console.log(err);
        });
      },

      errorCallback: () => {
        alert('Error callback');
        this.set("isPlaying", false);
      },

      infoCallback: () => {
        alert('Info callback');
      }
    };


    this.player.playFromFile(playerOptions).then(() => {
      this.set("isPlaying", true);
    }, (err) => {
      console.log(err);
      this.set("isPlaying", false);
    });

  }



  /***** AUDIO PLAYER *****/

  public playAudio(filepath: string, fileType: string) {

    try {
      var playerOptions = {
        audioFile: filepath,

        completeCallback: () => {
          snackbar.simple("Audio file complete");

          this.player.dispose().then(() => {
            this.set("isPlaying", false);
            console.log('DISPOSED');
          }, (err) => {
            console.log('ERROR disposePlayer: ' + err);
          });
        },

        errorCallback: (err) => {
          snackbar.simple('Error occurred during playback.');
          console.log(err);
          this.set("isPlaying", false);
        },

        infoCallback: (info) => {
          alert('Info callback: ' + info.msg);
          console.log("what: " + info);
        }
      };

      this.set("isPlaying", true);

      if (fileType === 'localFile') {
        this.player.playFromFile(playerOptions).then(() => {
          this.set("isPlaying", true);
        }, (err) => {
          console.log(err);
          this.set("isPlaying", false);
        });
      } else if (fileType === 'remoteFile') {
        this.player.playFromUrl(playerOptions).then(() => {
          this.set("isPlaying", true);
        }, (err) => {
          console.log(err);
          this.set("isPlaying", false);
        });
      }
    } catch (ex) {
      console.log(ex);
    }

  }



  ///**
  //  * PLAY RESOURCES FILE
  //  */
  // public playResFile(args) {
  //     var filepath = 'in_the_night';

  //     this.playAudio(filepath, 'resFile');

  // }

  /**
   * PLAY REMOTE AUDIO FILE
   */
  public playRemoteFile(args) {
    console.log('playRemoteFile');
    var filepath = 'http://www.noiseaddicts.com/samples_1w72b820/2514.mp3';

    this.playAudio(filepath, 'remoteFile');

  }

  /**
   * PLAY LOCAL AUDIO FILE from app folder
   */
  public playLocalFile(args) {
    var filepath = '~/audio/angel.mp3';

    this.playAudio(filepath, 'localFile');

  }






  /**
   * PAUSE PLAYING
   */
  public pauseAudio(args) {
    this.player.pause().then(() => {
      this.set("isPlaying", false);
    }, (err) => {
      console.log(err);
      this.set("isPlaying", true);
    });
  }





  public stopPlaying(args) {
    this.player.dispose().then(() => {
      snackbar.simple("Media Player Disposed");
    }, (err) => {
      console.log(err);
    });
  }


  /**
   * RESUME PLAYING
   */
  public resumePlaying(args) {
    console.log('START');
    this.player.start();
  }

  private platformExtension() {
    //'mp3'
    return `${app.android ? 'm4a' : 'caf'}`;
  }
}
