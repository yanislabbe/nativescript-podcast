# NativeScript-Audio
NativeScript plugin to play and record audio files.

*Currently Android only, iOS is in the works.*

[Android Media Recorder Docs](http://developer.android.com/reference/android/media/MediaRecorder.html)

## Installation
`npm install nativescript-audio`

## Sample Screen

![AudioExample](screens/audiosample.gif)


## API

#### *Recording*

##### canDeviceRecord() - *Promise*
- retruns:  *boolean*

##### startRecorder( { filename: string, errorCallback?: Function, infoCallback?: Function } ) - *Promise*
- returns: *recorder* (android.media.MediaRecorder)

##### stopRecorder(recorder: recorder object from startRecorder)


##### disposeRecorder(recorder: recorder object from startRecorder)
- *Free up system resources when done with recorder*


#### *Playing* 

##### playFromFile( { audioFile: string, completeCallback?: Function, errorCallback?: Function, infoCallback?: Function; } ) - *Promise*
- returns mediaPlayer (android.media.MediaPlayer)

##### playFromUrl( { audioFile: string, completeCallback?: Function, errorCallback?: Function, infoCallback?: Function; } ) - *Promise*
- returns mediaPlayer (android.media.MediaPlayer)

##### pausePlayer(mediaPlayer) - *Promise*
- return boolean

##### disposePlayer(mediaPlayer)
 -- Free up resources when done playing audio with this instance of your mediaPlayer

##### isAudioPlaying(mediaPlayer) - *Promise*
- returns boolean

##### getAudioTrackDuration(mediaPlayer) - *Promise*
- returns string - duration of media file assigned to mediaPlayer

