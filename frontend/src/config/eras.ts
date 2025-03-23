export interface EraConfig {
  id: number;
  title: string;
  description: string;
  modelPath: string;
  modelScale: { x: number; y: number; z: number };
  cameraPosition: { x: number; y: number; z: number };
}

export const eras: EraConfig[] = [
  {
    id: 1,
    title: '1774 - 普利斯特里實驗室',
    description: '普利斯特里在此發現氧氣。',
    modelPath: '/models/priestley_lab.glb',
    modelScale: { x: 1, y: 1, z: 1 },
    cameraPosition: { 
      x: 0,      // 左右位置
      y: 20,      // 提高高度
      z: 20      // 距離
    }
  },
  {
    id: 2,
    title: '1869 - 門捷列夫書房',
    description: '門捷列夫整理出元素週期表。',
    modelPath: '/models/mendeleev_study.glb',
    modelScale: { x: 1, y: 1, z: 1 },
    cameraPosition: { x: 0, y: 4, z: 8 }
  },
  {
    id: 3,
    title: '1898 - 瑪麗居禮實驗室',
    description: '瑪麗居禮發現鐳元素。',
    modelPath: '/models/curie_lab.glb',
    modelScale: { x: 1, y: 1, z: 1 },
    cameraPosition: { x: 0, y: 6, z: 12 }
  }
];