import {AudioPlayerOptions, AudioRecorderOptions} from './options';

export interface TNSPlayerI {
  /**
   * Starts playing audio file from local app files.
   */
  playFromFile(options: AudioPlayerOptions): Promise<any>;

  /**
  * Starts playing audio file from url
  */
  playFromUrl(options: AudioPlayerOptions): Promise<any>;

  /**
   * Play audio file.
   */
  play(): Promise<boolean>;

  /**
   * Pauses playing audio file.
   */
  pause(): Promise<boolean>;

  /**
   * Releases resources from the audio player.
   */
  dispose(): Promise<boolean>;

  /**
   * Check if the audio is actively playing.
   */
  isAudioPlaying(): Promise<boolean>;

  /**
   * Get the duration of the audio file playing.
   */
  getAudioTrackDuration(): Promise<number>;
}

export interface TNSRecordI {
  /**
   * Starts the native audio recording control.
   */
  start(options: AudioRecorderOptions): Promise<any>;

  /**
  * Stops the native audio recording control.
  */
  stop(): Promise<any>;

  /**
   * Releases resources from the recorder.
   */
  dispose(): Promise<any>;
}