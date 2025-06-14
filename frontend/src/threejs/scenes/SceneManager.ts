import { Scene } from 'three';
import { DefaultLights } from '../lights/defaultLights';
import { AmbientSoundManager } from '../audio/ambientSoundManager';
import { useGLTFLoader } from '../loaders/useGLTFLoader';
import { useCamera } from '../camera/useCamera';
import { watch } from 'vue';
import * as THREE from 'three';

export interface SceneConfig {
  id: string;
  modelUrl: string;
  soundUrl: string;
  description: string;
  characters: string[];
}

export class SceneManager {
  private scene: Scene;
  private lights: DefaultLights;
  private soundManager: AmbientSoundManager;
  private gltfLoader: ReturnType<typeof useGLTFLoader>;
  private currentSceneId: string | null = null;
  private camera: ReturnType<typeof useCamera>;

  constructor() {
    this.scene = new Scene();
    this.lights = new DefaultLights();
    this.soundManager = new AmbientSoundManager();
    this.gltfLoader = useGLTFLoader();
    this.camera = useCamera();

    // 添加默認光源
    this.lights.getLights().forEach(light => this.scene.add(light));

    watch(this.camera.position, (newPosition) => {
      console.log('相機位置更新:', newPosition);
    });

    watch(this.camera.isAnimating, (animating) => {
      console.log('相機動畫狀態:', animating);
    });
  }

  public getScene(): Scene {
    return this.scene;
  }

  public getSoundManager(): AmbientSoundManager {
    return this.soundManager;
  }

  public async loadScene(config: SceneConfig): Promise<void> {
    if (this.currentSceneId === config.id) {
      return;
    }

    // 清除當前場景
    this.clearScene();

    try {
      // 載入 3D 模型
      const model = await this.gltfLoader.loadModel(config.modelUrl) as { scene: THREE.Object3D };
      this.scene.add(model.scene);

      // 播放背景音效
      await this.soundManager.playAmbientSound(config.soundUrl);

      this.currentSceneId = config.id;
    } catch (error) {
      console.error('Error loading scene:', error);
      throw error;
    }
  }

  private clearScene(): void {
    // 移除所有模型
    while (this.scene.children.length > 0) {
      const object = this.scene.children[0];
      if (object?.type !== 'Light') {
        this.scene.remove(object!);
      }
    }

    // 停止當前音效
    this.soundManager.stopCurrentSound();
  }

  public updateLightsPosition(x: number, y: number, z: number): void {
    this.lights.updatePosition(x, y, z);
  }

  public getLoadingProgress(): number {
    return this.gltfLoader.progress.value;
  }

  public isLoading(): boolean {
    return this.gltfLoader.isLoading.value;
  }

  public animateTo(config: {
    position?: { x: number; y: number; z: number };
    rotation?: { x: number; y: number; z: number };
    zoom?: number;
    target?: { x: number; y: number; z: number };
    duration?: number;
    easing?: (amount: number) => number;
  }): void {
    this.camera.animateTo(config);
  }
} 