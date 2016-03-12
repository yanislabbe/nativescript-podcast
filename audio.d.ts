/**
 * Contains the Audio class.
 */

declare module "audio" {
    import fs = require("file-system");

    //    export class Audio {
    //        
    //    }
    /**
     * Starts playing audio file from local app files.
     */
    export function playFromFile(options: AudioPlayerOptions): Promise<any>;

    /**
    * Starts playing audio file from res/raw folder
    */
    export function playFromResource(options: AudioPlayerOptions): Promise<any>;

    /**
    * Starts playing audio file from url
    */
    export function playFromUrl(options: AudioPlayerOptions): Promise<any>;

    /**
     * Pauses playing audio file.
     * @param player The audio player to pause.
     */
    export function pausePlayer(player: any): Promise<boolean>;

    /**
     * Releases resources from the audio player.
     * @param player The audio player to reset.
     */
    export function disposePlayer(player: any): Promise<boolean>;

    /**
     * Check if the audio is actively playing.
     * @param player The audio player to check.
     */
    export function isAudioPlaying(player: any): Promise<boolean>;

    /**
     * Get the duration of the audio file playing.
     * @param player The audio player to check length of current file.
     */
    export function getAudioTrackDuration(player: any): Promise<number>;

    /**
     * Gets the capability of the device if it can record audio.
     */
    export function deviceCanRecord(): boolean;

    /**
     * Starts the native audio recording control.
     */
    export function startRecorder(options: AudioRecorderOptions): Promise<any>;

    /**
    * Stops the native audio recording control.
    */
    export function stopRecorder(recorder: any): Promise<any>;

    /**
     * Releases resources from the recorder.
     * @param recorder The audio player to reset.
     */
    export function disposeRecorder(recorder: any): Promise<any>;

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
        * Gets or sets the callback when an error occurs with the media recorder.
        */
        errorCallback?: Function;

        /**
        * Gets or sets the callback to be invoked to communicate some info and/or warning about the media or its playback.
        */
        infoCallback?: Function;
    }

}