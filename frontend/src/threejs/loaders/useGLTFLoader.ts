import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { ref } from 'vue';

export function useGLTFLoader() {
  const isLoading = ref(false);
  const progress = ref(0);
  const error = ref<Error | null>(null);

  const loader = new GLTFLoader();
  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath('/draco/');
  loader.setDRACOLoader(dracoLoader);

  const loadModel = async (url: string) => {
    isLoading.value = true;
    progress.value = 0;
    error.value = null;

    try {
      const gltf = await new Promise((resolve, reject) => {
        loader.load(
          url,
          (gltf) => resolve(gltf),
          (xhr) => {
            progress.value = (xhr.loaded / xhr.total) * 100;
          },
          (error) => reject(error)
        );
      });

      return gltf;
    } catch (err) {
      error.value = err as Error;
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  return {
    loadModel,
    isLoading,
    progress,
    error
  };
} 