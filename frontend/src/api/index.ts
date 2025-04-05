import axios from 'axios';

export interface Chemist {
  id: number;
  name: string;
  birth_year: number;
  death_year: number;
  bio?: string;
  portrait_path?: string;
  model_path?: string;
  position: {
    x: number;
    y: number;
    z: number;
  };
}

const api = axios.create({
  baseURL: 'http://localhost:8000/api/',
  timeout: 10000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
});

// 添加請求攔截器
api.interceptors.request.use(
  (config) => {
    // 在發送請求之前做些什麼
    console.log('發送請求:', config.url);
    return config;
  },
  (error) => {
    // 對請求錯誤做些什麼
    console.error('請求錯誤:', error);
    return Promise.reject(error);
  }
);

// 添加響應攔截器
api.interceptors.response.use(
  (response) => {
    // 對響應數據做點什麼
    console.log('收到響應:', response.status);
    return response;
  },
  (error) => {
    // 對響應錯誤做點什麼
    console.error('響應錯誤:', error);
    return Promise.reject(error);
  }
);

export const fetchEras = () => api.get('eras/');
export const fetchEvents = (eraId: number) => api.get(`events/?era=${eraId}`);
export const fetchScientists = async (eraId?: number) => {
  const params = eraId ? { era: eraId } : undefined;
  return await api.get<Chemist[]>('/chemists/', { params });
};

export default api;