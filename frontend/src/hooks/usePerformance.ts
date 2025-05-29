import { ref, onMounted } from 'vue'
import * as THREE from 'three'

export function usePerformance() {
  const fps = ref(0)
  const frameCount = ref(0)
  const lastTime = ref(performance.now())
  const isLowPerformance = ref(false)

  const calculateFPS = () => {
    const currentTime = performance.now()
    frameCount.value++

    if (currentTime - lastTime.value >= 1000) {
      fps.value = Math.round((frameCount.value * 1000) / (currentTime - lastTime.value))
      frameCount.value = 0
      lastTime.value = currentTime

      // 如果 FPS 低於 30，啟用低效能模式
      isLowPerformance.value = fps.value < 30
    }

    requestAnimationFrame(calculateFPS)
  }

  const setupLOD = (object: THREE.Object3D, distances: number[]) => {
    const lod = new THREE.LOD()
    
    distances.forEach((distance) => {
      const level = object.clone()
      // TODO: 根據距離設置不同細節層級的模型
      lod.addLevel(level, distance)
    })

    return lod
  }

  const optimizeScene = (scene: THREE.Scene) => {
    // 合併幾何體
    const geometries: THREE.BufferGeometry[] = []
    scene.traverse((object) => {
      if (object instanceof THREE.Mesh) {
        geometries.push(object.geometry)
      }
    })

    // 優化材質
    scene.traverse((object) => {
      if (object instanceof THREE.Mesh) {
        object.material = Array.isArray(object.material)
          ? object.material.map(optimizeMaterial)
          : optimizeMaterial(object.material)
      }
    })
  }

  const optimizeMaterial = (material: THREE.Material) => {
    if (material instanceof THREE.MeshStandardMaterial) {
      material.roughness = 1
      material.metalness = 0
    }
    return material
  }

  onMounted(() => {
    calculateFPS()
  })

  return {
    fps,
    isLowPerformance,
    setupLOD,
    optimizeScene
  }
} 