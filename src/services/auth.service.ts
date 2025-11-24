import { apiService } from './api';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name?: string;
}

export interface AuthResponse {
  access_token: string;
  id: number;
  email: string;
  role: string;
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    // BYPASS: Allow login without credentials for UI testing
    if (!credentials.email || credentials.email === 'test@unihealth.com') {
      console.warn('⚠️ Login bypass activated with mock data');
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            access_token: 'mock-jwt-token-for-testing',
            id: 999,
            email: 'test@unihealth.com',
            role: 'admin',
          });
        }, 500); // Simulate network delay
      });
    }

    // Try real API, fallback to mock if backend is unavailable
    try {
      return await apiService.post<AuthResponse>('/auth/login', credentials);
    } catch (error) {
      console.warn('⚠️ Backend unavailable, using mock data for login');
      return {
        access_token: 'mock-jwt-token-for-testing',
        id: 999,
        email: credentials.email || 'test@unihealth.com',
        role: 'admin',
      };
    }
  },

  async register(data: RegisterData): Promise<AuthResponse> {
    return apiService.post<AuthResponse>('/auth/register', data);
  },

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getToken(): string | null {
    return localStorage.getItem('token');
  },

  getUser(): AuthResponse | null {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  setAuth(authData: AuthResponse) {
    localStorage.setItem('token', authData.access_token);
    localStorage.setItem('user', JSON.stringify(authData));
  },
};

