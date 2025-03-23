import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export class Scene {
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private controls: OrbitControls;
  private currentModel: THREE.Group | null = null;
  private loader: GLTFLoader;
  private ambientLight: THREE.AmbientLight;
  private directionalLight: THREE.DirectionalLight;

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

    this.animate();
  }

  async loadModel(
    url: string, 
    scale: { x: number; y: number; z: number } = { x: 1, y: 1, z: 1 },
    cameraPosition: { x: number; y: number; z: number } | null = null,
    cameraTarget: { x: number; y: number; z: number } | null = null
  ): Promise<void> {
    console.log('開始載入模型:', url);
    
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
      const targetSize = 3;  // 減小基礎目標大小
      const autoScale = targetSize / maxDim;

      // 設置模型位置和縮放
      model.position.set(
        -center.x,
        -center.y + (size.y * 0.45),  // 稍微調整 Y 軸位置
        -center.z - (size.z * 0.3)     // 將模型向前移動
      );
      
      // 應用縮放，考慮到模型的實際大小
      const finalScale = {
        x: scale.x * autoScale * 1.2,  // 增加一個額外的縮放係數
        y: scale.y * autoScale * 1.2,
        z: scale.z * autoScale * 1.2
      };
      model.scale.set(finalScale.x, finalScale.y, finalScale.z);

      console.log('模型變換:', {
        position: model.position,
        scale: finalScale,
        autoScale
      });

      // 設置陰影和材質
      model.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.castShadow = true;
          child.receiveShadow = true;
          if (child.material) {
            child.material.side = THREE.DoubleSide;
            child.material.needsUpdate = true;
          }
        }
      });

      this.currentModel = model;
      this.scene.add(this.currentModel);

      // 調整相機位置和目標點
      if (cameraPosition) {
        console.log('設置指定的相機位置:', cameraPosition);
        this.camera.position.set(
          cameraPosition.x,
          cameraPosition.y,
          cameraPosition.z
        );
      } else {
        // 自動設置相機位置
        const distance = maxDim * 1.0;
        const height = size.y * 0.6;
        console.log('設置自動計算的相機位置:', {
          distance,
          height,
          position: {
            x: distance,
            y: height,
            z: distance
          }
        });
        this.camera.position.set(distance, height, distance);
      }

      // 設置相機目標點
      if (cameraTarget) {
        console.log('設置指定的相機目標點:', cameraTarget);
        this.controls.target.set(
          cameraTarget.x,
          cameraTarget.y,
          cameraTarget.z
        );
        this.camera.lookAt(
          cameraTarget.x,
          cameraTarget.y,
          cameraTarget.z
        );
      } else {
        // 自動計算目標點
        const targetY = size.y * 0.35;
        const targetZ = -size.z * 0.2;
        this.controls.target.set(0, targetY, targetZ);
        this.camera.lookAt(0, targetY, targetZ);
      }
      
      // 調整光源以跟隨相機和目標點
      const target = cameraTarget || { x: 0, y: size.y * 0.35, z: -size.z * 0.2 };
      this.directionalLight.position.set(
        this.camera.position.x * 1.2,
        this.camera.position.y * 1.5,
        this.camera.position.z * 1.2
      );
      this.directionalLight.target.position.set(target.x, target.y, target.z);
      this.scene.add(this.directionalLight.target);

      // 調整環境光強度
      this.ambientLight.intensity = 0.6;  // 增加環境光強度

      // 更新控制器
      this.controls.update();

      console.log('模型載入和設置完成');

    } catch (error: unknown) {
      console.error('模型載入過程中發生錯誤:', error);
      const errorMessage = error instanceof Error ? error.message : '未知錯誤';
      throw new Error(`載入模型失敗: ${errorMessage}`);
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
    requestAnimationFrame(() => this.animate());
    this.controls.update();
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
  }

  createTestModel() {
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);
    return cube;
  }
}