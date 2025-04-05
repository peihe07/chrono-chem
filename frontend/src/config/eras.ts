export interface EraConfig {
  id: number;
  title: string;
  description: string;
  year: number;
  modelPath: string;
  modelScale: { x: number; y: number; z: number };
  cameraPosition: { x: number; y: number; z: number };
  cameraTarget?: { x: number; y: number; z: number };
}

export const eras: EraConfig[] = [
  {
    id: 1,
    title: '1774 - 普利斯特里實驗室',
    description: '普利斯特里在此發現氧氣。',
    year: 1774,
    modelPath: '/models/priestley_lab.glb',
    modelScale: { x: 2.0, y: 2.0, z: 2.0 },
    cameraPosition: { 
      x: 10,      // 調整為更合適的距離
      y: 8,      // 降低視角高度
      z: 5       // 保持對稱，形成45度角
    },
    cameraTarget: {
      x: 0,
      y: 2,      // 提高一點視點，更好觀察實驗台
      z: -1      // 稍微向前看
    }
  },
  {
    id: 2,
    title: '1869 - 門捷列夫書房',
    description: '門捷列夫整理出元素週期表。',
    year: 1869,
    modelPath: '/models/mendeleev_study.glb',
    modelScale: { x: 1.8, y: 1.8, z: 1.8 },
    cameraPosition: { 
      x: 10,      // 更近的視角
      y: 3,      // 略高於桌面
      z: 4       // 保持對稱，形成45度角
    },
    cameraTarget: {
      x: 0,
      y: 1.5,    // 視點略高，可以看到桌面
      z: -0.5    // 稍微向前看
    }
  },
  {
    id: 3,
    title: '1898 - 瑪麗居禮實驗室',
    description: '瑪麗居禮發現鐳元素。',
    year: 1898,
    modelPath: '/models/curie_lab.glb',
    modelScale: { x: 1.3, y: 1.3, z: 1.3 },
    cameraPosition: { 
      x: 15,      // 從側面觀察
      y: 3,      // 略高於實驗台
      z: 5       // 保持對稱，形成45度角
    },
    cameraTarget: {
      x: 0,
      y: 1.2,    // 視點對準實驗台
      z: -0.8    // 向前看
    }
  }
];