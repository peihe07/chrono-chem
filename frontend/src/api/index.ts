import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api/',  // 根據實際後端 API 地址調整
});

export const fetchEras = () => api.get('eras/');
export const fetchEvents = (eraId: number) => api.get(`events/?era=${eraId}`);
export const fetchScientists = (eraId: number) => api.get(`scientists/?era=${eraId}`);

export default api;