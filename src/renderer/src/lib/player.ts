interface PlayerOptions {
  playbackRate?: number;
  audioOutputDevice?: string;
  volume?: number;
  muted?: boolean;
}

/**
 * Library in charge of playing audio. Currently uses HTMLAudioElement.
 *
 * Open questions:
 *   - Should it emit IPC events itself? Or expose events?
 *   - Should it hold the concepts of queue/random/etc? (in other words, should
 *     we merge player actions here?)
 */
class Player {
  private audio: HTMLAudioElement;

  constructor(options?: PlayerOptions) {
    const mergedOptions = {
      playbackRate: 1,
      volume: 1,
      muted: false,
      audioOutputDevice: 'default',
      ...options,
    };

    this.audio = new Audio();

    this.audio.defaultPlaybackRate = mergedOptions.playbackRate;
    // eslint-disable-next-line
    // @ts-ignore
    this.audio.setSinkId(mergedOptions.audioOutputDevice);
    this.audio.playbackRate = mergedOptions.playbackRate;
    this.audio.volume = mergedOptions.volume;
    this.audio.muted = mergedOptions.muted;
  }

  async play(): Promise<void> {
    if (!this.audio.src) {
      throw new Error('Trying to play a track but not audio.src is defined');
    }

    await this.audio.play();
  }

  pause(): void {
    return this.audio.pause();
  }

  stop(): void {
    this.audio.pause();
  }

  mute(): void {
    this.audio.muted = true;
  }

  unmute(): void {
    this.audio.muted = false;
  }

  getAudio(): HTMLAudioElement {
    return this.audio;
  }

  getCurrentTime(): number {
    return this.audio.currentTime;
  }

  getVolume(): number {
    return this.audio.volume;
  }

  setVolume(volume: number): void {
    this.audio.volume = volume;
  }

  setPlaybackRate(playbackRate: number): void {
    this.audio.playbackRate = playbackRate;
    this.audio.defaultPlaybackRate = playbackRate;
  }

  async setOutputDevice(deviceID: string): Promise<void> {
    // eslint-disable-next-line
    // @ts-ignore
    await this.audio.setSinkId(deviceID);
  }

  setCurrentTime(currentTime: number): void {
    this.audio.currentTime = currentTime;
  }

  isMuted(): boolean {
    return this.audio.muted;
  }

  isPaused(): boolean {
    return this.audio.paused;
  }
}

/**
 * Export a singleton by default, for the sake of simplicity (and we only need
 * one anyway)
 */

export default new Player();
