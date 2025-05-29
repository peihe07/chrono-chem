import { AmbientLight, PointLight, DirectionalLight, Color } from 'three';

export class DefaultLights {
  private ambientLight: AmbientLight;
  private pointLight: PointLight;
  private directionalLight: DirectionalLight;

  constructor() {
    // 環境光
    this.ambientLight = new AmbientLight(new Color(0xffffff), 0.5);
    
    // 點光源
    this.pointLight = new PointLight(new Color(0xffffff), 1);
    this.pointLight.position.set(5, 5, 5);
    this.pointLight.castShadow = true;
    
    // 方向光
    this.directionalLight = new DirectionalLight(new Color(0xffffff), 0.8);
    this.directionalLight.position.set(5, 5, 5);
    this.directionalLight.castShadow = true;
    
    // 設置陰影屬性
    this.setupShadows();
  }

  private setupShadows() {
    this.pointLight.shadow.mapSize.width = 1024;
    this.pointLight.shadow.mapSize.height = 1024;
    this.pointLight.shadow.camera.near = 0.5;
    this.pointLight.shadow.camera.far = 50;

    this.directionalLight.shadow.mapSize.width = 1024;
    this.directionalLight.shadow.mapSize.height = 1024;
    this.directionalLight.shadow.camera.near = 0.5;
    this.directionalLight.shadow.camera.far = 50;
  }

  public getLights() {
    return [this.ambientLight, this.pointLight, this.directionalLight];
  }

  public updatePosition(x: number, y: number, z: number) {
    this.pointLight.position.set(x, y, z);
    this.directionalLight.position.set(x, y, z);
  }
} 