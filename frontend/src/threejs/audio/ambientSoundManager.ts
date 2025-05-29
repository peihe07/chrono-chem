import { AudioListener, PositionalAudio, AudioLoader } from 'three';

export class AmbientSoundManager {
  private listener: AudioListener;
  private currentSound: PositionalAudio | null = null;
  private audioLoader: AudioLoader;
  private volume: number = 0.5;

  constructor() {
    this.listener = new AudioListener();
    this.audioLoader = new AudioLoader();
  }

  public getListener(): AudioListener {
    return this.listener;
  }

  public setVolume(volume: number) {
    this.volume = Math.max(0, Math.min(1, volume));
    if (this.currentSound) {
      this.currentSound.setVolume(this.volume);
    }
  }

  public getVolume(): number {
    return this.volume;
  }

  public async playAmbientSound(soundUrl: string, position: [number, number, number] = [0, 0, 0]): Promise<void> {
    // 停止當前音效
    this.stopCurrentSound();

    try {
      const buffer = await this.loadSound(soundUrl);
      const sound = new PositionalAudio(this.listener);
      sound.setBuffer(buffer);
      sound.setRefDistance(1);
      sound.setLoop(true);
      sound.setVolume(this.volume);
      sound.position.set(...position);
      sound.play();
      this.currentSound = sound;
    } catch (error) {
      console.error('Error loading ambient sound:', error);
    }
  }

  private loadSound(url: string): Promise<AudioBuffer> {
    return new Promise((resolve, reject) => {
      this.audioLoader.load(
        url,
        (buffer) => resolve(buffer),
        undefined,
        (error) => reject(error)
      );
    });
  }

  public stopCurrentSound() {
    if (this.currentSound) {
      this.currentSound.stop();
      this.currentSound = null;
    }
  }

  public pauseCurrentSound() {
    if (this.currentSound && this.currentSound.isPlaying) {
      this.currentSound.pause();
    }
  }

  public resumeCurrentSound() {
    if (this.currentSound && !this.currentSound.isPlaying) {
      this.currentSound.play();
    }
  }
} 