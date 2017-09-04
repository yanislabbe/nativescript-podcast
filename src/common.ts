import { AudioPlayerOptions, AudioRecorderOptions } from "./options";

export interface TNSPlayerI {
  /**
   * native instance getters
   */
  readonly ios?: any;
  readonly android?: any;

  /**
   * Volume getter/setter
   */
  volume: any;

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
   * Seeks to specific time.
   */
  seekTo(time: number): Promise<boolean>;

  /**
   * Releases resources from the audio player.
   */
  dispose(): Promise<boolean>;

  /**
   * Check if the audio is actively playing.
   */
  isAudioPlaying(): boolean;

  /**
   * Get the duration of the audio file playing.
   */
  getAudioTrackDuration(): Promise<string>;

  /**
   * current time
   */
  readonly currentTime: number;
}

export interface TNSRecordI {
  /**
   * Starts the native audio recording control.
   */
  start(options: AudioRecorderOptions): Promise<any>;

  /**
   * Pauses the native audio recording control.
   */
  pause(): Promise<any>;

  /**
   * Resumes the native audio recording control.
   */
  resume(): Promise<any>;

  /**
  * Stops the native audio recording control.
  */
  stop(): Promise<any>;

  /**
   * Releases resources from the recorder.
   */
  dispose(): Promise<any>;
}
