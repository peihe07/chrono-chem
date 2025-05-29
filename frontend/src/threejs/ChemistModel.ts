import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export interface ChemistModelConfig {
  id: number;
  name: string;
  modelPath: string;
  position: THREE.Vector3;
  scale: THREE.Vector3;
  portraitPath: string;
  bio: string;
  birth_year: number;
  death_year: number;
  era: number;
  description: string;
}

export class ChemistModel {
  private model: THREE.Object3D | null = null;
  private mixer: THREE.AnimationMixer | null = null;
  private animations: THREE.AnimationClip[] = [];
  private config: ChemistModelConfig;
  private loader: GLTFLoader;
  private boundingBox: THREE.Box3;
  private highlightMesh: THREE.Mesh | null = null;
  private isHighlighted: boolean = false;

  constructor(config: ChemistModelConfig) {
    this.config = config;
    this.loader = new GLTFLoader();
    this.boundingBox = new THREE.Box3();
  }

  async load(): Promise<void> {
    try {
      // 如果沒有指定模型路徑，使用預設模型
      const modelPath = this.config.modelPath || '/models/default-chemist.glb';
      
      const gltf = await this.loader.loadAsync(modelPath);
      this.model = gltf.scene;
      
      // 設置位置、旋轉和縮放
      this.model.position.copy(this.config.position);
      this.model.scale.copy(this.config.scale);
      
      // 設置動畫
      if (gltf.animations.length > 0) {
        this.mixer = new THREE.AnimationMixer(this.model);
        this.animations = gltf.animations;
      }
      
      // 計算邊界框
      this.updateBoundingBox();
      
      // 創建高亮效果
      this.createHighlightMesh();
      
    } catch (error) {
      console.error(`Error loading chemist model for ${this.config.name}:`, error);
      throw error;
    }
  }

  private updateBoundingBox(): void {
    if (this.model) {
      this.boundingBox.setFromObject(this.model);
    }
  }

  private createHighlightMesh(): void {
    if (!this.model) return;
    
    // 創建一個略大於模型的邊界框網格
    const size = new THREE.Vector3();
    this.boundingBox.getSize(size);
    
    const geometry = new THREE.BoxGeometry(
      size.x * 1.1,
      size.y * 1.1,
      size.z * 1.1
    );
    
    const material = new THREE.MeshBasicMaterial({
      color: 0x42b883,
      transparent: true,
      opacity: 0.3,
      side: THREE.BackSide
    });
    
    this.highlightMesh = new THREE.Mesh(geometry, material);
    this.highlightMesh.position.copy(this.model.position);
    this.highlightMesh.visible = false;
  }

  getModel(): THREE.Object3D | null {
    return this.model;
  }

  getHighlightMesh(): THREE.Mesh | null {
    return this.highlightMesh;
  }

  getConfig(): ChemistModelConfig {
    return this.config;
  }

  update(delta: number): void {
    if (this.mixer) {
      this.mixer.update(delta);
    }
  }

  playAnimation(name: string): void {
    if (!this.mixer || !this.animations.length) return;
    
    const clip = this.animations.find(a => a.name === name);
    if (clip) {
      const action = this.mixer.clipAction(clip);
      action.reset().play();
    }
  }

  highlight(): void {
    if (this.highlightMesh && !this.isHighlighted) {
      this.highlightMesh.visible = true;
      this.isHighlighted = true;
    }
  }

  unhighlight(): void {
    if (this.highlightMesh && this.isHighlighted) {
      this.highlightMesh.visible = false;
      this.isHighlighted = false;
    }
  }

  isPointInside(point: THREE.Vector3): boolean {
    return this.boundingBox.containsPoint(point);
  }

  dispose(): void {
    if (this.model) {
      this.model.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.geometry.dispose();
          if (Array.isArray(object.material)) {
            object.material.forEach(material => material.dispose());
          } else if (object.material) {
            object.material.dispose();
          }
        }
      });
    }
    
    if (this.highlightMesh) {
      this.highlightMesh.geometry.dispose();
      if (this.highlightMesh.material) {
        if (Array.isArray(this.highlightMesh.material)) {
          this.highlightMesh.material.forEach(material => material.dispose());
        } else {
          this.highlightMesh.material.dispose();
        }
      }
    }
    
    this.model = null;
    this.mixer = null;
    this.animations = [];
    this.highlightMesh = null;
  }
} 