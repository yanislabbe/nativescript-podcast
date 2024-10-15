import { Application, EventData, Observable, Utils } from '@nativescript/core';
import { resolveAudioFilePath, TNSPlayerI } from '../common';
import { AudioPlayerEvents, AudioPlayerOptions } from '../options';

export enum AudioFocusDurationHint {
  AUDIOFOCUS_GAIN = android.media.AudioManager.AUDIOFOCUS_GAIN,
  AUDIOFOCUS_GAIN_TRANSIENT = android.media.AudioManager.AUDIOFOCUS_GAIN_TRANSIENT,
  AUDIOFOCUS_GAIN_TRANSIENT_MAY_DUCK = android.media.AudioManager.AUDIOFOCUS_GAIN_TRANSIENT_MAY_DUCK,
  AUDIOFOCUS_GAIN_TRANSIENT_EXCLUSIVE = android.media.AudioManager.AUDIOFOCUS_GAIN_TRANSIENT_EXCLUSIVE
}

const defaultAudioFocusManagerOptions: AudioFocusManagerOptions = {
  durationHint: AudioFocusDurationHint.AUDIOFOCUS_GAIN,
  usage: android.media.AudioAttributes.USAGE_MEDIA,
  contentType: android.media.AudioAttributes.CONTENT_TYPE_MUSIC
};

export interface AudioFocusManagerOptions {
  durationHint?: AudioFocusDurationHint;
  usage?: number; // android.media.AudioAttributes.USAGE_MEDIA
  contentType?: number; // android.media.AudioAttributes.CONTENT_TYPE_MUSIC
}
export interface AudioFocusChangeEventData extends EventData {
  focusChange: number;
}

export class AudioFocusManager extends Observable {
  private _audioFocusRequest: android.media.AudioFocusRequest;
  private _mAudioFocusGranted: boolean = false;
  private _durationHint: AudioFocusDurationHint;
  private _audioPlayerSet = new Set<TNSPlayer>();

  constructor(options?: AudioFocusManagerOptions) {
    super();
    options = { ...defaultAudioFocusManagerOptions, ...(options || {}) };
    this._durationHint = options.durationHint;
    if (android.os.Build.VERSION.SDK_INT < 26) {
      return;
    }

    const playbackAttributes = new android.media.AudioAttributes.Builder()
      .setUsage(options.usage)
      .setContentType(options.contentType)
      .build();
    this._audioFocusRequest = new android.media.AudioFocusRequest.Builder(options.durationHint)
      .setAudioAttributes(playbackAttributes)
      .setAcceptsDelayedFocusGain(true)
      .setOnAudioFocusChangeListener(this._mOnAudioFocusChangeListener)
      .build();
  }

  private _mOnAudioFocusChangeListener =
    new android.media.AudioManager.OnAudioFocusChangeListener({
      onAudioFocusChange: (focusChange: number) => {
        this.notify({
          eventName: 'audioFocusChange',
          object: this,
          focusChange
        });
      }
    });

  private needsFocus(): boolean {
    return this._audioPlayerSet.size > 0;
  }

  requestAudioFocus(owner: TNSPlayer): boolean {
    let result = true;
    let focusResult = null;
    if (!this._mAudioFocusGranted) {
      const ctx = this._getAndroidContext();
      const am = ctx.getSystemService(android.content.Context.AUDIO_SERVICE) as android.media.AudioManager;

      if (android.os.Build.VERSION.SDK_INT >= 26) {
        focusResult = am.requestAudioFocus(this._audioFocusRequest);
      } else {
        focusResult = am.requestAudioFocus(
          this._mOnAudioFocusChangeListener,
          android.media.AudioManager.STREAM_MUSIC,
          this._durationHint
        );
      }

      if (focusResult === android.media.AudioManager.AUDIOFOCUS_REQUEST_GRANTED) {
        result = true;
      } else {
        result = false;
      }
    }

    this._audioPlayerSet.add(owner);
    this._mAudioFocusGranted = result;

    return result;
  }

  abandonAudioFocus(owner: TNSPlayer | null): boolean {
    if (owner) {
      if (!this._audioPlayerSet.has(owner)) {
        return this._mAudioFocusGranted;
      }
      this._audioPlayerSet.delete(owner);
    }
    if (this.needsFocus() || !this._mAudioFocusGranted) {
      return this._mAudioFocusGranted;
    }
    const ctx = this._getAndroidContext();
    const am = ctx.getSystemService(android.content.Context.AUDIO_SERVICE);
    let result = null;

    if (android.os.Build.VERSION.SDK_INT >= 26) {
      console.log('abandonAudioFocusRequest...', this._audioFocusRequest);
      result = am.abandonAudioFocusRequest(this._audioFocusRequest);
      console.log('abandonAudioFocusRequest...result...', result);
    } else {
      console.log('abandonAudioFocus...', this._mOnAudioFocusChangeListener);
      result = am.abandonAudioFocus(this._mOnAudioFocusChangeListener);
    }
    if (result === android.media.AudioManager.AUDIOFOCUS_REQUEST_GRANTED) {
      this._mAudioFocusGranted = false;
    } else {
      console.log('Failed to abandon audio focus.');
    }
    return this._mAudioFocusGranted;
  }

  private _getAndroidContext() {
    let ctx = Application.android.context;
    if (!ctx) {
      ctx = Application.getNativeApplication().getApplicationContext();
    }

    if (ctx === null) {
      setTimeout(() => {
        this._getAndroidContext();
      }, 200);

      return null;
    }

    return ctx;
  }
}

let globalMixingManager: AudioFocusManager | null;

function getGlobalMixingManager(): AudioFocusManager {
  if (!globalMixingManager) {
    globalMixingManager = new AudioFocusManager();
  }
  return globalMixingManager;
}

export class TNSPlayer implements TNSPlayerI {
  private _mediaPlayer: android.media.MediaPlayer;
  private _lastPlayerVolume;
  private _wasPlaying = false;
  private _events: Observable;
  private _options: AudioPlayerOptions;
  private _audioFocusManager: AudioFocusManager | null;

  constructor(
    durationHint:
      | AudioFocusDurationHint
      | AudioFocusManager = AudioFocusDurationHint.AUDIOFOCUS_GAIN
  ) {
    if (!(durationHint instanceof AudioFocusManager)) {
      this.setAudioFocusManager(
        new AudioFocusManager({
          durationHint: durationHint
        })
      );
    } else {
      this.setAudioFocusManager(durationHint);
    }
  }

  public get events() {
    if (!this._events) {
      this._events = new Observable();
    }
    return this._events;
  }

  get android(): any {
    return this._player;
  }

  get volume(): number {
    const ctx = this._getAndroidContext();
    const mgr = ctx.getSystemService(android.content.Context.AUDIO_SERVICE);
    return mgr.getStreamVolume(android.media.AudioManager.STREAM_MUSIC);
  }

  set volume(value: number) {
    if (this._player && value >= 0) {
      this._player.setVolume(value, value);
    }
  }

  public get duration(): number {
    if (this._player) {
      return this._player.getDuration() / 1000;
    } else {
      return 0;
    }
  }

  get currentTime(): number {
    return this._player ? this._player.getCurrentPosition() / 1000 : 0;
  }

  public setAudioFocusManager(manager: AudioFocusManager) {
    if (manager === this._audioFocusManager) {
      return;
    }
    this._audioFocusManager?.off(
      'audioFocusChange',
      this._onAudioFocusChange,
      this
    );
    this._audioFocusManager?.abandonAudioFocus(this);
    this._audioFocusManager = manager;
    this._audioFocusManager?.on(
      'audioFocusChange',
      this._onAudioFocusChange,
      this
    );
  }

  public initFromFile(options: AudioPlayerOptions): Promise<any> {
    return new Promise((resolve, reject) => {
      options.autoPlay = false;
      this.playFromFile(options).then(resolve, reject);
    });
  }

  public playFromFile(options: AudioPlayerOptions): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this._options = options;
        if (options.autoPlay !== false) {
          options.autoPlay = true;
        }

        const audioPath = resolveAudioFilePath(options.audioFile);
        this._player.setAudioStreamType(
          android.media.AudioManager.STREAM_MUSIC
        );
        this._player.reset();
        this._player.setDataSource(audioPath);

        if (Utils.isFileOrResourcePath(audioPath)) {
          this._player.prepare();
        } else {
          this._player.prepareAsync();
        }

        if (options.infoCallback) {
          this._player.setOnInfoListener(
            new android.media.MediaPlayer.OnInfoListener({
              onInfo: (player: any, info: number, extra: number) => {
                options.infoCallback({ player, info, extra });
                return true;
              }
            })
          );
        }

        this._player.setOnPreparedListener(
          new android.media.MediaPlayer.OnPreparedListener({
            onPrepared: mp => {
              if (options.autoPlay) {
                this.play();
              }
              resolve(null);
            }
          })
        );
      } catch (ex) {
        this._abandonAudioFocus();
        reject(ex);
      }
    });
  }

  public initFromUrl(options: AudioPlayerOptions): Promise<any> {
    return new Promise((resolve, reject) => {
      options.autoPlay = false;
      this.playFromUrl(options).then(resolve, reject);
    });
  }

  public playFromUrl(options: AudioPlayerOptions): Promise<any> {
    return new Promise((resolve, reject) => {
      resolve(this.playFromFile(options));
    });
  }

  public pause(): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        if (this._player && this._player.isPlaying()) {
          this._player.pause();
          this._abandonAudioFocus(true);
          this._sendEvent(AudioPlayerEvents.paused);
        }

        resolve(true);
      } catch (ex) {
        reject(ex);
      }
    });
  }

  public play(): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        console.log('player play()');
        if (this._player && !this._player.isPlaying()) {
          if (this._options.audioMixing) {
            this.setAudioFocusManager(getGlobalMixingManager());
          }
          const audioFocusGranted = this._requestAudioFocus();
          if (!audioFocusGranted) {
            throw new Error('Could not request audio focus');
          }

          this._sendEvent(AudioPlayerEvents.started);
          Application.android.foregroundActivity.setVolumeControlStream(
            android.media.AudioManager.STREAM_MUSIC
          );

          Application.android.registerBroadcastReceiver(
            android.media.AudioManager.ACTION_AUDIO_BECOMING_NOISY,
            (
              context: android.content.Context,
              intent: android.content.Intent
            ) => {
              this.pause();
            }
          );

          if (this._options?.pitch) {
            const playBackParams = new android.media.PlaybackParams();
            playBackParams.setPitch(this._options!.pitch);
            this._player.setPlaybackParams(playBackParams);
          }

          this._player.start();
        }
        resolve(true);
      } catch (ex) {
        reject(ex);
      }
    });
  }

  public resume(): void {
    if (this._player) {
      this.play();
      this._sendEvent(AudioPlayerEvents.started);
    }
  }

  public seekTo(time: number): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        if (this._player) {
          this._player.seekTo(time);
          this._sendEvent(AudioPlayerEvents.seek);
        }
        resolve(true);
      } catch (ex) {
        reject(ex);
      }
    });
  }

  public changePlayerSpeed(speed) {
    if (android.os.Build.VERSION.SDK_INT >= 23 && this.play) {
      if (this._player?.isPlaying()) {
        (this._player as any).setPlaybackParams(
          (this._player as any).getPlaybackParams().setSpeed(speed)
        );
      } else {
        (this._player as any).setPlaybackParams(
          (this._player as any).getPlaybackParams().setSpeed(speed)
        );
        this._player?.pause();
      }
    } else {
      console.warn(
        'Android device API is not 23+. Cannot set the playbackRate on lower Android APIs.'
      );
    }
  }

  public dispose(): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        if (this._player) {
          this._player.stop();
          this._player.reset();
          this._options = undefined;
          Application.android.unregisterBroadcastReceiver(
            android.media.AudioManager.ACTION_AUDIO_BECOMING_NOISY
          );

          this._abandonAudioFocus();
          this.setAudioFocusManager(null);
        }
        resolve(null);
      } catch (ex) {
        reject(ex);
      }
    });
  }

  public isAudioPlaying(): boolean {
    if (this._player) {
      return this._player.isPlaying();
    } else {
      return false;
    }
  }

  public getAudioTrackDuration(): Promise<string> {
    return new Promise((resolve, reject) => {
      try {
        const duration = this._player ? this._player.getDuration() / 1000 : 0;
        resolve(duration.toString());
      } catch (ex) {
        reject(ex);
      }
    });
  }

  private _sendEvent(eventName: string, data?: any) {
    if (this.events) {
      this.events.notify(<any>{
        eventName,
        object: this,
        data: data
      });
    }
  }

  private _requestAudioFocus(): boolean {
    return this._audioFocusManager?.requestAudioFocus(this);
  }

  private _abandonAudioFocus(preserveMP: boolean = false): void {
    this._audioFocusManager?.abandonAudioFocus(this);

    if (this._mediaPlayer && !preserveMP) {
      this._mediaPlayer.release();
      this._mediaPlayer = undefined;
    }
  }

  private _getAndroidContext() {
    let ctx = Application.android.context;
    if (!ctx) {
      ctx = Application.getNativeApplication().getApplicationContext();
    }

    if (ctx === null) {
      setTimeout(() => {
        this._getAndroidContext();
      }, 200);

      return null;
    }

    return ctx;
  }

  private get _player() {
    if (!this._mediaPlayer && this._options) {
      this._mediaPlayer = new android.media.MediaPlayer();

      this._mediaPlayer.setOnCompletionListener(
        new android.media.MediaPlayer.OnCompletionListener({
          onCompletion: mp => {
            if (this._options && this._options.completeCallback) {
              if (this._options.loop === true) {
                mp.seekTo(5);
                mp.start();
              }
              this._options.completeCallback({ player: mp });
            }

            if (this._options && !this._options.loop) {
              this._abandonAudioFocus(true);
            }
          }
        })
      );

      this._mediaPlayer.setOnErrorListener(
        new android.media.MediaPlayer.OnErrorListener({
          onError: (player: any, error: number, extra: number) => {
            if (this._options && this._options.errorCallback) {
              this._options.errorCallback({ player, error, extra });
            }
            this.dispose();
            return true;
          }
        })
      );
    }

    return this._mediaPlayer;
  }

  private _onAudioFocusChange(data: AudioFocusChangeEventData) {
    const focusChange = data.focusChange;
    switch (focusChange) {
      case android.media.AudioManager.AUDIOFOCUS_GAIN:
        if (this._lastPlayerVolume && this._lastPlayerVolume >= 10) {
          this.volume = 1.0;
        } else if (this._lastPlayerVolume) {
          this.volume = parseFloat('0.' + this._lastPlayerVolume.toString());
        }

        if (this._wasPlaying) {
          this.resume();
        }
        break;
      case android.media.AudioManager.AUDIOFOCUS_GAIN_TRANSIENT:
        break;
      case android.media.AudioManager.AUDIOFOCUS_LOSS:
        this._wasPlaying = this._player?.isPlaying() ?? false;
        this.pause();
        break;
      case android.media.AudioManager.AUDIOFOCUS_LOSS_TRANSIENT:
        this._wasPlaying = this._player?.isPlaying() ?? false;
        this.pause();
        break;
      case android.media.AudioManager.AUDIOFOCUS_LOSS_TRANSIENT_CAN_DUCK:
        this._lastPlayerVolume = this.volume;
        this.volume = 0.2;
        break;
    }
  }
}