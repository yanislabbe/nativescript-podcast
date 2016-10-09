[![npm](https://img.shields.io/npm/v/nativescript-audio.svg)](https://www.npmjs.com/package/nativescript-audio)
[![npm](https://img.shields.io/npm/dt/nativescript-audio.svg?label=npm%20downloads)](https://www.npmjs.com/package/nativescript-audio)

# NativeScript-Audio
NativeScript plugin to play and record audio files for Android and iOS.

Uses the following native classes:

#### Android

* [Player](http://developer.android.com/reference/android/media/MediaPlayer.html)
* [Recorder](http://developer.android.com/reference/android/media/MediaRecorder.html)

#### iOS

* [Player](https://developer.apple.com/library/ios/documentation/AVFoundation/Reference/AVAudioPlayerClassReference/)
* [Recorder](https://developer.apple.com/library/ios/documentation/AVFoundation/Reference/AVAudioRecorder_ClassReference/)

## Installation
`npm install nativescript-audio`

## Sample Screen

![AudioExample](screens/audiosample.gif)

## API

#### TNSRecorder

Method |  Description
-------- | ---------
`TNSRecorder.CAN_RECORD()`: `boolean` | Determine if ready to record.
`start({ filename: string, errorCallback?: Function, infoCallback?: Function })`: `Promise` | Start recording file.
`stop()`: `void` | Stop recording.
`dispose()`: `void` | Free up system resources when done with recorder.

#### TNSPlayer

Method |  Description
-------- | ---------
`playFromFile( { audioFile: string, loop: boolean, completeCallback?: Function, errorCallback?: Function, infoCallback?: Function; } )`: `Promise` | Play from a file.
`playFromUrl( { audioFile: string, loop: boolean, completeCallback?: Function, errorCallback?: Function, infoCallback?: Function; } )`: `Promise` | Play from a url.
`pause()`: `void` | Pause playback.
`resume()`: `void` | Resume playback.
`seekTo(time:number)`: `Promise<boolean>` | Seek to position.
`dispose()`: `void` | Free up resources when done playing audio.
`isAudioPlaying()`: `boolean` | Determine if player is playing.
`getAudioTrackDuration()`: `Promise` | duration of media file assigned to mediaPlayer

## Why the TNS prefixed name?

`TNS` stands for **T**elerik **N**ative**S**cript

iOS uses classes prefixed with `NS` (stemming from the [NeXTSTEP](https://en.wikipedia.org/wiki/NeXTSTEP) days of old):
https://developer.apple.com/library/mac/documentation/Cocoa/Reference/Foundation/Classes/NSString_Class/

To avoid confusion with iOS native classes, `TNS` is used instead.

# License

[MIT](/LICENSE)

