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
      90,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    this.camera.position.set(0, 2, 15);
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
    this.controls.minDistance = 5;
    this.controls.maxDistance = 20;
    this.controls.maxPolarAngle = Math.PI / 1.5;
    this.controls.minPolarAngle = Math.PI / 6;
    
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
    cameraPosition: { x: number; y: number; z: number } | null = null
  ): Promise<void> {
    console.log('開始載入模型:', url);
    
    try {
      // 檢查文件是否存在
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`模型文件不存在: ${url} (${response.status})`);
      }

      // 如果存在當前模型，先移除它
      if (this.currentModel) {
        this.scene.remove(this.currentModel);
        this.currentModel.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.geometry.dispose();
            if (child.material instanceof THREE.Material) {
              child.material.dispose();
            } else if (Array.isArray(child.material)) {
              child.material.forEach(material => material.dispose());
            }
          }
        });
        this.currentModel = null;
      }

      // 重置相機位置
      this.camera.position.set(0, 2, 15);
      this.camera.lookAt(0, 0, 0);

      console.log('開始載入 GLB 文件...');
      const gltf = await this.loader.loadAsync(url);
      console.log('GLB 文件載入成功:', gltf);
      const model = gltf.scene;
      
      // 計算模型的邊界框
      const box = new THREE.Box3().setFromObject(model);
      const size = box.getSize(new THREE.Vector3());
      const center = box.getCenter(new THREE.Vector3());
      
      // 根據模型大小自動調整比例
      const maxDim = Math.max(size.x, size.y, size.z);
      const targetSize = 10; // 目標大小
      const autoScale = targetSize / maxDim;
      
      // 遍歷模型中的所有網格
      model.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.castShadow = true;
          child.receiveShadow = true;
          // 確保所有材質都正確設置
          if (child.material) {
            if (Array.isArray(child.material)) {
              child.material.forEach(mat => {
                mat.side = THREE.DoubleSide;
                mat.needsUpdate = true;
              });
            } else {
              child.material.side = THREE.DoubleSide;
              child.material.needsUpdate = true;
            }
          }
        }
      });
      
      // 調整模型位置和比例
      model.position.set(-center.x, -center.y, -center.z); // 將模型置於中心
      model.scale.set(
        scale.x * autoScale,
        scale.y * autoScale,
        scale.z * autoScale
      );
      
      this.currentModel = model;
      this.scene.add(this.currentModel);

      // 設置相機位置
      if (cameraPosition) {
        this.camera.position.set(
          cameraPosition.x,
          cameraPosition.y,
          cameraPosition.z
        );
      } else {
        // 根據模型大小自動設置相機位置
        const distance = Math.max(size.x, size.y, size.z) * 2;
        this.camera.position.set(distance, distance / 2, distance);
      }
      this.camera.lookAt(0, 0, 0);
      this.controls.update();

      // 調整光源
      this.ambientLight.intensity = 0.7;
      this.directionalLight.intensity = 1.2;
      this.directionalLight.position.set(
        this.camera.position.x,
        this.camera.position.y,
        this.camera.position.z
      );

    } catch (error: unknown) {
      console.error('模型載入失敗:', error);
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