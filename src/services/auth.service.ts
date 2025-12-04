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
    console.log('🔐 LOGIN - Sending:', credentials);
    try {
      const response = await apiService.post<AuthResponse>('/auth/login', credentials);
      console.log('✅ LOGIN - Success:', response);
      return response;
    } catch (error) {
      console.error('❌ LOGIN - Error:', error);
      throw error;
    }
  },

  async register(data: RegisterData): Promise<AuthResponse> {
    // Only send name if it has a value
    const payload = {
      email: data.email,
      password: data.password,
      ...(data.name ? { name: data.name } : {})
    };
    console.log('📝 REGISTER - Sending:', payload);
    try {
      const response = await apiService.post<AuthResponse>('/auth/register', payload);
      console.log('✅ REGISTER - Success:', response);
      return response;
    } catch (error) {
      console.error('❌ REGISTER - Error:', error);
      throw error;
    }
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

