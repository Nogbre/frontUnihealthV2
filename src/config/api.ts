const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://54.166.181.144:3000';

export const apiConfig = {
  baseURL: API_BASE_URL,
  timeout: 10000,
};

export default apiConfig;

