/**
* Provides options for the audio player.
*/
export interface AudioPlayerOptions {
  /**
   * Gets or sets the audio file url.
   */
  audioFile: string;

  /**
   * Gets or sets the callback when the currently playing audio file completes.
   */
  completeCallback?: Function;

  /**
   * Gets or sets the callback when an error occurs with the audio player.
   */
  errorCallback?: Function;

  /**
   * Gets or sets the callback to be invoked to communicate some info and/or warning about the media or its playback.
   */
  infoCallback?: Function;
}

export interface AudioRecorderOptions {
  /**
   * Gets or sets the recorded file name.
   */
  filename: string;

  /**
   * Gets or set the max duration of the recording session.
   */
  maxDuration?: number;

  /**
   * Enable metering. Off by default.
   */
  metering?: boolean;

  /**
  * Gets or sets the callback when an error occurs with the media recorder.
  */
  errorCallback?: Function;

  /**
  * Gets or sets the callback to be invoked to communicate some info and/or warning about the media or its playback.
  */
  infoCallback?: Function;
}