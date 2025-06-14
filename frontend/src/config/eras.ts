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
    title: '1789 - 拉瓦錫的實驗室',
    description: '拉瓦錫透過秤重與燃燒實驗推翻了燃素說，確立質量守恆定律。',
    year: 1774,
    modelPath: '/models/priestley_lab.glb',
    modelScale: { x: 11.0, y: 11.0, z: 11 },
    cameraPosition: { 
      x: -13,       // 調整到中心位置
      y: 13.0,     // 保持視角高度
      z: 3       // 保持向前
    },
    cameraTarget: {
      x: 0,
      y: 2.0,     // 看向前方，與相機高度一致
      z: -3       // 向前看，距離更遠
    }
  },
  {
    id: 2,
    title: '1869 - 門捷列夫書房',
    description: '門捷列夫整理出元素週期表。',
    year: 1869,
    modelPath: '/models/mendeleev_study.glb',
    modelScale: { x: 50.0, y: 50.0, z: 50.0 },
    cameraPosition: { 
      x: 800,       // 改為負值，旋轉視角 180 度
      y: 700.0,     // 保持視角高度
      z: -150        // 保持當前 z 值
    },
    cameraTarget: {
      x: 30,
      y: 30.0,     // 保持視點高度
      z: -10      // 看向書房中心
    }
  },
  {
    id: 3,
    title: '1898 - 瑪麗居禮實驗室',
    description: '瑪麗居禮發現鐳元素。',
    year: 1898,
    modelPath: '/models/curie_lab.glb',
    modelScale: { x: 4.0, y: 4.0, z: 4.0 },
    cameraPosition: { 
      x: -1,      // 稍微向左偏移
      y: 2.5,     // 略高於地面
      z: -1       // 稍微向前
    },
    cameraTarget: {
      x: 0,
      y: 2.5,     // 看向前方，與相機高度一致
      z: -2       // 向前看，但保持適當距離
    }
  }
];