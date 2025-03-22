import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

export function initScene(container: HTMLElement, modelPath: string) {
  // === 建立場景 ===
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xeeeeee);

  // === 建立相機 ===
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 5;

  // === 建立渲染器 ===
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  container.appendChild(renderer.domElement);

  // === 加入光源 ===
  const light = new THREE.HemisphereLight(0xffffff, 0x444444);
  light.position.set(0, 20, 0);
  scene.add(light);

  const dirLight = new THREE.DirectionalLight(0xffffff);
  dirLight.position.set(3, 10, 10);
  scene.add(dirLight);

  // === OrbitControls ===
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;

  // === 載入 GLTF 模型 ===
  const loader = new GLTFLoader();
  loader.load(modelPath, (gltf) => {
    scene.add(gltf.scene);
  });

  // === 渲染迴圈 ===
  function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
  }
  animate();

  // === resize 處理 ===
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}