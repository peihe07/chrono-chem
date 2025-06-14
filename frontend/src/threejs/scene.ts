import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import TWEEN from '@tweenjs/tween.js';
import { ChemistModel } from './ChemistModel';
import type { ChemistModelConfig } from './ChemistModel';

export interface CameraPreset {
  position: { x: number; y: number; z: number };
  target: { x: number; y: number; z: number };
  name: string;
}

export class Scene {
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private controls: OrbitControls;
  private currentModel: THREE.Group | null = null;
  private loader: GLTFLoader;
  private ambientLight: THREE.AmbientLight;
  private directionalLight: THREE.DirectionalLight;
  private chemistModels: Map<number, ChemistModel> = new Map();
  private raycaster: THREE.Raycaster;
  private mouse: THREE.Vector2;
  private selectedChemist: ChemistModel | null = null;
  private clock: THREE.Clock;
  private cameraPresets: CameraPreset[] = [
    {
      name: '正面視圖',
      position: { x: 0, y: 2, z: 10 },
      target: { x: 0, y: 0, z: 0 }
    },
    {
      name: '側面視圖',
      position: { x: 10, y: 2, z: 0 },
      target: { x: 0, y: 0, z: 0 }
    },
    {
      name: '俯視圖',
      position: { x: 0, y: 10, z: 0 },
      target: { x: 0, y: 0, z: 0 }
    },
    {
      name: '45度視角',
      position: { x: 10, y: 5, z: 10 },
      target: { x: 0, y: 0, z: 0 }
    }
  ];

  constructor(container: HTMLElement) {
    // 初始化場景
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xf0f0f0);
    
    // 設置相機
    this.camera = new THREE.PerspectiveCamera(
      75,  // 視角改為 75 度，提供更好的視野
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    this.camera.position.set(0, 5, 10);  // 調整初始相機位置
    this.camera.lookAt(0, 0, 0);

    // 設置渲染器
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(this.renderer.domElement);

    // 設置控制器
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.minDistance = 1;  // 允許更近的距離
    this.controls.maxDistance = 50;  // 允許更遠的距離
    this.controls.maxPolarAngle = Math.PI / 1.5;  // 限制俯視角度
    this.controls.minPolarAngle = 0;  // 允許從上方查看
    this.controls.enablePan = true;  // 允許平移
    this.controls.panSpeed = 0.8;  // 增加平移速度
    this.controls.rotateSpeed = 0.8;  // 增加旋轉速度
    this.controls.zoomSpeed = 1.5;  // 增加縮放速度
    this.controls.target.set(0, 0, 0);  // 設置旋轉中心點
    this.controls.enableZoom = true;  // 確保啟用縮放
    this.controls.mouseButtons = {
      LEFT: THREE.MOUSE.ROTATE,
      MIDDLE: THREE.MOUSE.DOLLY,
      RIGHT: THREE.MOUSE.PAN
    };
    
    // 添加環境光
    this.ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    this.scene.add(this.ambientLight);

    // 添加平行光
    this.directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    this.directionalLight.position.set(5, 5, 5);
    this.directionalLight.castShadow = true;
    this.directionalLight.shadow.mapSize.width = 2048;
    this.directionalLight.shadow.mapSize.height = 2048;
    this.scene.add(this.directionalLight);

    // 添加地板
    const groundGeometry = new THREE.PlaneGeometry(100, 100);
    const groundMaterial = new THREE.MeshStandardMaterial({ 
      color: 0xcccccc,
      roughness: 0.8,
      metalness: 0.2
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    this.scene.add(ground);

    // 初始化加載器
    this.loader = new GLTFLoader();

    // 初始化射線檢測器
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    this.clock = new THREE.Clock();
    
    // 添加滑鼠事件監聽器
    container.addEventListener('mousemove', this.onMouseMove.bind(this));
    container.addEventListener('click', this.onMouseClick.bind(this));
    
    this.animate();
  }

  async loadModel(
    url: string, 
    scale: { x: number; y: number; z: number } = { x: 1, y: 1, z: 1 },
    cameraPosition: { x: number; y: number; z: number } | null = null,
    cameraTarget: { x: number; y: number; z: number } | null = null
  ): Promise<void> {
    console.log('開始載入模型:', {
      url,
      scale,
      cameraPosition,
      cameraTarget
    });
    
    try {
      // 檢查文件是否存在
      console.log('檢查模型文件是否存在...');
      const response = await fetch(url);
      if (!response.ok) {
        console.error('模型文件不存在:', url, '狀態碼:', response.status);
        throw new Error(`模型文件不存在: ${url} (${response.status})`);
      }
      console.log('模型文件存在，開始載入...');

      // 清理當前模型
      if (this.currentModel) {
        console.log('清理當前模型...');
        this.scene.remove(this.currentModel);
        this.currentModel.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.geometry.dispose();
            if (child.material instanceof THREE.Material) {
              child.material.dispose();
            }
          }
        });
        this.currentModel = null;
      }

      // 載入新模型
      console.log('使用 GLTFLoader 載入模型...');
      const gltf = await this.loader.loadAsync(url).catch(error => {
        console.error('GLTFLoader 載入失敗:', error);
        throw error;
      });
      
      console.log('模型載入成功，設置場景...');
      const model = gltf.scene;

      // 計算模型的邊界框
      const box = new THREE.Box3().setFromObject(model);
      const size = box.getSize(new THREE.Vector3());
      const center = box.getCenter(new THREE.Vector3());

      console.log('模型尺寸:', {
        size: { x: size.x, y: size.y, z: size.z },
        center: { x: center.x, y: center.y, z: center.z }
      });

      // 自動調整模型大小
      const maxDim = Math.max(size.x, size.y, size.z);
      const targetSize = 4;  // 基礎目標大小
      const autoScale = targetSize / maxDim;

      // 設置模型位置和縮放
      model.position.set(
        -center.x,
        -center.y + (size.y * 0.45),  // 稍微調整 Y 軸位置
        -center.z - (size.z * 0.3)     // 將模型向前移動
      );
      
      // 應用縮放
      model.scale.set(
        scale.x * autoScale,
        scale.y * autoScale,
        scale.z * autoScale
      );
      
      // 添加到場景
      this.scene.add(model);
      this.currentModel = model;
      
      // 設置相機位置和目標點
      if (cameraPosition) {
        console.log('設置相機位置:', cameraPosition);
        this.camera.position.set(
          cameraPosition.x,
          cameraPosition.y,
          cameraPosition.z
        );
      }
      
      if (cameraTarget) {
        console.log('設置相機目標點:', cameraTarget);
        this.controls.target.set(
          cameraTarget.x,
          cameraTarget.y,
          cameraTarget.z
        );
      }
      
      // 更新控制器
      this.controls.update();
      
      // 更新平行光位置
      this.directionalLight.position.copy(this.camera.position);
      
      console.log('模型載入完成');
    } catch (error) {
      console.error('載入模型失敗:', error);
      throw error;
    }
  }

  async loadModelWithLOD(lowRes: string, highRes: string) {
    // 先載入低精度版本
    await this.loadModel(lowRes);
    
    // 後台載入高精度版本
    const highResGLTF = await this.loader.loadAsync(highRes);
    // 完成後替換模型
    if (this.currentModel) {
      this.scene.remove(this.currentModel);
      this.currentModel = highResGLTF.scene;
      this.scene.add(this.currentModel);
    }
  }

  private animate(): void {
    requestAnimationFrame(this.animate.bind(this));
    
    const delta = this.clock.getDelta();
    
    // 更新 TWEEN
    TWEEN.update();
    
    // 更新化學家模型
    this.chemistModels.forEach(chemist => {
      chemist.update(delta);
    });
    
    // 更新控制器
    this.controls.update();
    
    // 渲染場景
    this.renderer.render(this.scene, this.camera);
  }

  public resize(): void {
    const container = this.renderer.domElement.parentElement;
    if (container) {
      const width = container.clientWidth;
      const height = container.clientHeight;
      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(width, height);
    }
  }

  public dispose(): void {
    this.renderer.dispose();
    this.scene.traverse((object) => {
      if (object instanceof THREE.Mesh) {
        object.geometry.dispose();
        if (object.material instanceof THREE.Material) {
          object.material.dispose();
        } else if (Array.isArray(object.material)) {
          object.material.forEach(material => material.dispose());
        }
      }
    });
    
    // 清理化學家模型
    this.chemistModels.forEach(chemist => {
      chemist.dispose();
    });
    this.chemistModels.clear();
    
    // 移除事件監聽器
    this.renderer.domElement.removeEventListener('mousemove', this.onMouseMove.bind(this));
    this.renderer.domElement.removeEventListener('click', this.onMouseClick.bind(this));
  }

  createTestModel() {
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);
    return cube;
  }

  // 添加相機動畫方法
  private animateCamera(
    targetPosition: { x: number; y: number; z: number },
    targetLookAt: { x: number; y: number; z: number },
    duration: number = 1000
  ): void {
    const startPosition = {
      x: this.camera.position.x,
      y: this.camera.position.y,
      z: this.camera.position.z
    };

    const startLookAt = {
      x: this.controls.target.x,
      y: this.controls.target.y,
      z: this.controls.target.z
    };

    // 創建位置動畫
    new TWEEN.Tween(startPosition)
      .to(targetPosition, duration)
      .easing(TWEEN.Easing.Quadratic.InOut)
      .onUpdate(() => {
        this.camera.position.set(startPosition.x, startPosition.y, startPosition.z);
      })
      .start();

    // 創建目標點動畫
    new TWEEN.Tween(startLookAt)
      .to(targetLookAt, duration)
      .easing(TWEEN.Easing.Quadratic.InOut)
      .onUpdate(() => {
        this.controls.target.set(startLookAt.x, startLookAt.y, startLookAt.z);
      })
      .start();
  }

  // 切換到預設視角
  public switchToPreset(presetName: string): void {
    const preset = this.cameraPresets.find(p => p.name === presetName);
    if (preset) {
      this.animateCamera(preset.position, preset.target);
    }
  }

  // 重置到預設視角
  public resetCamera(): void {
    const defaultPreset = this.cameraPresets[0];
    if (defaultPreset) {
      this.animateCamera(defaultPreset.position, defaultPreset.target);
    }
  }

  // 獲取所有預設視角
  public getCameraPresets(): CameraPreset[] {
    return this.cameraPresets;
  }

  private onMouseMove(event: MouseEvent): void {
    // 計算滑鼠在標準化設備坐標中的位置 (-1 到 +1)
    const rect = this.renderer.domElement.getBoundingClientRect();
    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    
    // 更新射線
    this.raycaster.setFromCamera(this.mouse, this.camera);
    
    // 檢查是否懸停在化學家模型上
    let foundIntersection = false;
    
    this.chemistModels.forEach(chemist => {
      const model = chemist.getModel();
      const highlightMesh = chemist.getHighlightMesh();
      
      if (model && highlightMesh) {
        const intersects = this.raycaster.intersectObject(highlightMesh);
        
        if (intersects.length > 0) {
          foundIntersection = true;
          chemist.highlight();
        } else {
          chemist.unhighlight();
        }
      }
    });
    
    // 更新游標樣式
    this.renderer.domElement.style.cursor = foundIntersection ? 'pointer' : 'default';
  }

  private onMouseClick(event: MouseEvent): void {
    // 更新射線
    this.raycaster.setFromCamera(this.mouse, this.camera);
    
    // 檢查點擊的化學家
    let clickedChemist: ChemistModel | null = null;
    
    this.chemistModels.forEach(chemist => {
      const highlightMesh = chemist.getHighlightMesh();
      if (highlightMesh) {
        const intersects = this.raycaster.intersectObject(highlightMesh);
        if (intersects.length > 0) {
          clickedChemist = chemist;
        }
      }
    });
    
    // 觸發化學家選擇事件
    if (clickedChemist) {
      this.selectedChemist = clickedChemist;
      this.onChemistSelected(clickedChemist);
    }
  }

  private onChemistSelected(chemist: ChemistModel): void {
    // 這裡可以觸發自定義事件，讓 Vue 組件知道化學家被選中了
    const event = new CustomEvent('chemist-selected', {
      detail: chemist.getConfig()
    });
    window.dispatchEvent(event);
  }

  public addChemist(config: ChemistModelConfig): void {
    try {
      console.log('Adding chemist:', config.name);
      
      // 創建臨時模型（立方體）
      const geometry = new THREE.BoxGeometry(1, 2, 1);
      const material = new THREE.MeshPhongMaterial({
        color: 0x42b883,
        transparent: true,
        opacity: 0.7
      });
      
      const model = new THREE.Mesh(geometry, material);
      model.position.copy(config.position);
      model.position.y += 1; // 稍微抬高一點
      
      // 創建標籤
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      if (context) {
        canvas.width = 256;
        canvas.height = 64;
        context.fillStyle = '#ffffff';
        context.font = '24px Arial';
        context.textAlign = 'center';
        context.fillText(config.name, canvas.width / 2, canvas.height / 2);
        
        const texture = new THREE.CanvasTexture(canvas);
        const labelMaterial = new THREE.SpriteMaterial({ map: texture });
        const label = new THREE.Sprite(labelMaterial);
        label.position.copy(model.position);
        label.position.y += 2;
        label.scale.set(2, 0.5, 1);
        
        this.scene.add(label);
      }
      
      this.scene.add(model);
      
      // 創建 ChemistModel 實例並保存
      const chemistModel = new ChemistModel(config);
      this.chemistModels.set(config.id, chemistModel);
      
      console.log('Successfully added chemist:', config.name);
    } catch (error) {
      console.error('Error adding chemist:', error);
    }
  }

  public removeChemist(id: number): void {
    const chemist = this.chemistModels.get(id);
    if (chemist) {
      const model = chemist.getModel();
      const highlightMesh = chemist.getHighlightMesh();
      
      if (model) {
        this.scene.remove(model);
      }
      
      if (highlightMesh) {
        this.scene.remove(highlightMesh);
      }
      
      chemist.dispose();
      this.chemistModels.delete(id);
    }
  }

  public getSelectedChemist(): ChemistModel | null {
    return this.selectedChemist;
  }

  public clearScene(): void {
    console.log('開始清除場景...');
    
    // 清除當前模型
    if (this.currentModel) {
      console.log('清除當前模型');
      this.scene.remove(this.currentModel);
      this.currentModel.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.geometry.dispose();
          if (child.material instanceof THREE.Material) {
            child.material.dispose();
          }
        }
      });
      this.currentModel = null;
    }
    
    // 清除化學家模型
    console.log('清除化學家模型');
    this.chemistModels.forEach((model) => {
      const chemistModel = model.getModel();
      if (chemistModel) {
        this.scene.remove(chemistModel);
      }
      const highlightMesh = model.getHighlightMesh();
      if (highlightMesh) {
        this.scene.remove(highlightMesh);
      }
      model.dispose();
    });
    this.chemistModels.clear();
    
    // 重置相機位置和目標點
    console.log('重置相機位置和目標點');
    const defaultPreset = this.cameraPresets[0];
    if (defaultPreset) {
      this.camera.position.set(
        defaultPreset.position.x,
        defaultPreset.position.y,
        defaultPreset.position.z
      );
      this.controls.target.set(
        defaultPreset.target.x,
        defaultPreset.target.y,
        defaultPreset.target.z
      );
    } else {
      this.camera.position.set(0, 5, 10);
      this.controls.target.set(0, 0, 0);
    }
    this.camera.lookAt(this.controls.target);
    this.controls.update();
    
    // 更新平行光位置
    this.directionalLight.position.copy(this.camera.position);
    
    console.log('場景清除完成');
  }

  public getScene(): THREE.Scene {
    return this.scene;
  }

  public getChemistModel(id: number): ChemistModel | undefined {
    return this.chemistModels.get(id);
  }
}