import axios from 'axios';

export interface Chemist {
  id: number;
  name: string;
  birth_year: number;
  death_year: number;
  description: string;
  era: number;
  portrait_path: string;
  model_path: string;
  position: {
    x: number;
    y: number;
    z: number;
  };
}

interface ApiResponse<T> {
  status: 'success' | 'error';
  data: T;
  message: string;
}

const api = axios.create({
  baseURL: 'http://localhost:8002/api/v1/',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
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

export const fetchEras = async () => {
  try {
    console.log('開始獲取時代數據...');
    const response = await api.get<ApiResponse<any>>('era/');
    console.log('時代數據:', response.data);
    return response.data;
  } catch (error) {
    console.error('獲取時代數據失敗:', error);
    throw error;
  }
};

export const fetchEvents = async (eraId: number) => {
  try {
    console.log('開始獲取事件數據，時代ID:', eraId);
    const response = await api.get<ApiResponse<any>>(`event/?era=${eraId}`);
    console.log('事件數據:', response.data);
    return response.data;
  } catch (error) {
    console.error('獲取事件數據失敗:', error);
    throw error;
  }
};

export const fetchScientists = async (eraId: number): Promise<Chemist[]> => {
  try {
    console.log('開始獲取化學家數據，時代 ID:', eraId);
    const response = await api.get<ApiResponse<Chemist[]>>(`scientist/?era=${eraId}`);
    console.log('API 響應:', response.data);
    if (response.data.status === 'success' && Array.isArray(response.data.data)) {
      console.log('獲取到的化學家數據:', response.data.data);
      return response.data.data;
    } else {
      console.warn('API 響應格式不正確:', response.data);
      return [];
    }
  } catch (error) {
    console.error('獲取化學家數據時出錯:', error);
    return [];
  }
};

export const sendMessage = async (chemistId: number, message: string) => {
  try {
    const response = await api.post<ApiResponse<{ assistant_message: any }>>(
      `scientist/${chemistId}/send_message/`,
      { message }
    );
    return response.data;
  } catch (error) {
    console.error('發送訊息失敗:', error);
    throw error;
  }
};

export default api;