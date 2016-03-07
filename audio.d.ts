/**
 * Contains the Audio class.
 */

declare module "audio" {
    import fs = require("file-system"); 

//    export class Audio {
//        
//    }
   /**
    * Starts playing audio file.
    * @param url The URL to request from.
    */
    export function playAudio(options: AudioPlayerOptions): Promise<string>;
    
    /**
     * Pauses playing audio file.
     * @param player The audio player to pause.
     */
    export function pauseAudio(player: any): Promise<boolean>;
    
    /**
     * Resets the audio player.
     * @param player The audio player to reset.
     */
     export function resetAudioPlayer(player: any): Promise<boolean>; 
     
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
    * Provides options for the audio player.
    */
    export interface AudioPlayerOptions {
         /**
          * Gets or sets the audio file url.
          */
         audioUrl: string;
        
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
       
}