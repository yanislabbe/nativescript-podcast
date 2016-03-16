import {Observable} from 'data/observable';
import * as fs from 'file-system';
import * as snackbar from 'nativescript-snackbar';
import * as app from 'application';
import * as color from 'color';
import * as platform from 'platform';
import {TNSRecorder, TNSPlayer} from 'nativescript-audio';

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

  constructor() {
    super();

    this.player = new TNSPlayer();   
    this.recorder = new TNSRecorder();
  }

  public startRecord(args) {
      if (TNSRecorder.CAN_RECORD()) {

          var audioFolder = fs.knownFolders.currentApp().getFolder("audio");
          console.log(JSON.stringify(audioFolder));    
          
          var recorderOptions = {

              filename: `${audioFolder.path}/recording.${app.android ? 'mp3' : 'caf'}`,

              infoCallback: () => {
                  console.log();
              },

              errorCallback: () => {
                  console.log();
                  snackbar.simple('Error recording.');
              }
          };

          
          this.recorder.start(recorderOptions).then((result) => {
              this.set("isRecording", true);
          }, (err) => {
              this.set("isRecording", false);
              alert(err);
          });
      } else {
          alert("This device cannot record audio.");
      }
  }

  public stopRecord(args) {
      this.recorder.stop().then(() => {
          this.set("isRecording", false);
          snackbar.simple("Recorder stopped");
      }, (ex) => {
          console.log(ex);
          this.set("isRecording", false);
      });
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
                  
                  this.player.disposePlayer().then(() => {
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

  public tabChange(e: any) {
    console.log(e);
  }  

  private platformExtension() {
    return `${app.android ? 'mp3' : 'caf'}`;
  }  
}
