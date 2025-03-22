export interface Era {
  id: number;
  title: string;
  description: string;
  modelPath: string;
  cameraPosition: { x: number; y: number; z: number };
  modelScale: { x: number; y: number; z: number };
}

export const eras: Era[] = [
  {
    id: 1,
    title: '古代化學',
    description: '從古埃及到希臘羅馬時期的煉金術階段',
    modelPath: '/models/ancient_lab.glb',
    cameraPosition: { x: 0, y: 3, z: 8 },
    modelScale: { x: 1, y: 1, z: 1 }
  },
  {
    id: 2,
    title: '中世紀化學',
    description: '阿拉伯化學和歐洲煉金術時期',
    modelPath: '/models/medieval_lab.glb',
    cameraPosition: { x: 2, y: 4, z: 10 },
    modelScale: { x: 1.2, y: 1.2, z: 1.2 }
  },
  {
    id: 3,
    title: '近代化學',
    description: '科學革命到近代化學理論的建立',
    modelPath: '/models/renaissance_lab.glb',
    cameraPosition: { x: -2, y: 5, z: 12 },
    modelScale: { x: 1.5, y: 1.5, z: 1.5 }
  },
  {
    id: 4,
    title: '現代化學',
    description: '原子理論到量子化學的發展',
    modelPath: '/models/modern_lab.glb',
    cameraPosition: { x: 0, y: 6, z: 15 },
    modelScale: { x: 2, y: 2, z: 2 }
  },
  {
    id: 5,
    title: '未來化學',
    description: '納米技術和分子工程的新紀元',
    modelPath: '/models/future_lab.glb',
    cameraPosition: { x: 3, y: 8, z: 20 },
    modelScale: { x: 2.5, y: 2.5, z: 2.5 }
  }
]; 