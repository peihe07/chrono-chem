import { ref, computed } from 'vue';
import * as THREE from 'three';
import { Tween, Easing } from '@tweenjs/tween.js';

export interface CameraPosition {
  x: number;
  y: number;
  z: number;
}

export interface CameraRotation {
  x: number;
  y: number;
  z: number;
}

export interface CameraTarget {
  x: number;
  y: number;
  z: number;
}

export interface CameraAnimationConfig {
  position?: CameraPosition;
  rotation?: CameraRotation;
  zoom?: number;
  target?: CameraTarget;
  duration?: number;
  easing?: (amount: number) => number;
}

export function useCamera() {
  const position = ref<CameraPosition>({ x: 0, y: 5, z: 10 });
  const rotation = ref<CameraRotation>({ x: 0, y: 0, z: 0 });
  const zoom = ref<number>(1);
  const target = ref<CameraTarget>({ x: 0, y: 0, z: 0 });
  const isAnimating = ref<boolean>(false);

  const setPosition = (newPosition: CameraPosition) => {
    position.value = newPosition;
  };

  const setRotation = (newRotation: CameraRotation) => {
    rotation.value = newRotation;
  };

  const setZoom = (newZoom: number) => {
    zoom.value = newZoom;
  };

  const setTarget = (newTarget: CameraTarget) => {
    target.value = newTarget;
  };

  const animateTo = (config: CameraAnimationConfig) => {
    if (isAnimating.value) {
      console.warn('相機正在動畫中，請等待當前動畫完成');
      return;
    }

    isAnimating.value = true;

    const duration = config.duration || 1000;
    const easing = config.easing || Easing.Quadratic.InOut;

    const animations: Tween<any>[] = [];

    if (config.position) {
      const positionTween = new Tween(position.value)
        .to(config.position, duration)
        .easing(easing);
      animations.push(positionTween);
    }

    if (config.rotation) {
      const rotationTween = new Tween(rotation.value)
        .to(config.rotation, duration)
        .easing(easing);
      animations.push(rotationTween);
    }

    if (config.zoom !== undefined) {
      const zoomTween = new Tween({ value: zoom.value })
        .to({ value: config.zoom }, duration)
        .easing(easing)
        .onUpdate((obj) => {
          zoom.value = obj.value;
        });
      animations.push(zoomTween);
    }

    if (config.target) {
      const targetTween = new Tween(target.value)
        .to(config.target, duration)
        .easing(easing);
      animations.push(targetTween);
    }

    // 啟動所有動畫
    animations.forEach(tween => tween.start());

    // 監聽動畫完成
    const checkAnimationsComplete = () => {
      const allComplete = animations.every(tween => !tween.isPlaying);
      if (allComplete) {
        isAnimating.value = false;
      } else {
        requestAnimationFrame(checkAnimationsComplete);
      }
    };

    requestAnimationFrame(checkAnimationsComplete);
  };

  const reset = () => {
    animateTo({
      position: { x: 0, y: 5, z: 10 },
      rotation: { x: 0, y: 0, z: 0 },
      zoom: 1,
      target: { x: 0, y: 0, z: 0 },
      duration: 1000,
      easing: Easing.Quadratic.InOut
    });
  };

  return {
    position,
    rotation,
    zoom,
    target,
    isAnimating,
    setPosition,
    setRotation,
    setZoom,
    setTarget,
    animateTo,
    reset
  };
} 