export interface AudioPlayerOptions {

    /**
     * The audio file to play.
     */
    audioFile: string;

    /**
     * Set true to loop audio playback.
     */
    loop: boolean;

    /**
     * Callback to execute when playback has completed.
     */
    completeCallback?: Function;

    /**
     * Callback to execute when playback has an error.
     */
    errorCallback?: Function;

    /**
     * Callback to execute when info is emitted from the player.
     */
    infoCallback?: Function;
}


export interface AudioRecorderOptions {
    /**
     * The name of the file recorded.
     */
    filename: string;

    /**
     * The max duration of the audio recording.
     */
    maxDuration?: number;

    /**
     * Set true to enable audio metering.
     */
    metering?: boolean;

    /**
     * The format of the audio recording.
     */
    format?: any;
    channels?: any;
    sampleRate?: any;
    bitRate?: any;
    encoder?: any;
    errorCallback?: Function;
    infoCallback?: Function;
}
export interface TNSPlayerI {
    playFromFile(options: AudioPlayerOptions): Promise<any>;
    playFromUrl(options: AudioPlayerOptions): Promise<any>;
    play(): Promise<boolean>;
    pause(): Promise<boolean>;
    resume(): void;
    seekTo(time: number): Promise<any>;
    dispose(): Promise<boolean>;
    isAudioPlaying(): boolean;
    getAudioTrackDuration(): Promise<string>;
}
export interface TNSRecordI {
    start(options: AudioRecorderOptions): Promise<any>;
    stop(): Promise<any>;
    dispose(): Promise<any>;
}
export declare class TNSPlayer {
    static ObjCProtocols: any[];
    private _player;
    private _task;
    private _completeCallback;
    private _errorCallback;
    private _infoCallback;
    playFromFile(options: AudioPlayerOptions): Promise<any>;
    playFromUrl(options: AudioPlayerOptions): Promise<any>;
    pause(): Promise<any>;
    resume(): void;
    seekTo(time: number): Promise<any>;
    play(): Promise<any>;
    dispose(): Promise<any>;
    isAudioPlaying(): boolean;
    getAudioTrackDuration(): Promise<string>;
    audioPlayerDidFinishPlayingSuccessfully(player?: any, flag?: boolean): void;
    private reset();
}
export declare class TNSRecorder {
    static ObjCProtocols: any[];
    private _recorder;
    private _recordingSession;
    static CAN_RECORD(): boolean;
    start(options: AudioRecorderOptions): Promise<any>;
    stop(): Promise<any>;
    dispose(): Promise<any>;
    isRecording(): any;
    getMeters(channel: number): any;
    audioRecorderDidFinishRecording(recorder: any, success: boolean): void;
}


