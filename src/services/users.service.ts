import { apiService } from './api';

export interface User {
  id: string;
  email: string;
  roleId?: string;
  isActive?: boolean;
  role?: {
    id: string;
    name: string;
  };
  patientProfile?: any;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateUserDto {
  email: string;
  password: string;
  name?: string;
}

export interface UpdateUserDto {
  email?: string;
  name?: string;
  isActive?: boolean;
}

export const usersService = {
  async getAll(): Promise<User[]> {
    console.log('👥 USERS - Fetching all users');
    try {
      const response = await apiService.get<User[]>('/users');
      console.log('✅ USERS - Success:', response);
      return response;
    } catch (error) {
      console.error('❌ USERS - Error fetching all:', error);
      throw error;
    }
  },

  async getById(id: number): Promise<User> {
    console.log('🔍 USERS - Fetching user:', id);
    try {
      const response = await apiService.get<User>(`/users/${id}`);
      console.log('✅ USERS - Success:', response);
      return response;
    } catch (error) {
      console.error('❌ USERS - Error fetching by id:', error);
      throw error;
    }
  },

  async create(data: CreateUserDto): Promise<User> {
    console.log('➕ USERS - Creating user:', data);
    try {
      const response = await apiService.post<User>('/users', data);
      console.log('✅ USERS - Created:', response);
      return response;
    } catch (error) {
      console.error('❌ USERS - Error creating:', error);
      throw error;
    }
  },

  async update(id: number, data: UpdateUserDto): Promise<User> {
    console.log('📝 USERS - Updating user:', id, data);
    try {
      const response = await apiService.patch<User>(`/users/${id}`, data);
      console.log('✅ USERS - Updated:', response);
      return response;
    } catch (error) {
      console.error('❌ USERS - Error updating:', error);
      throw error;
    }
  },

  async delete(id: number): Promise<void> {
    console.log('🗑️ USERS - Deleting user:', id);
    try {
      await apiService.delete<void>(`/users/${id}`);
      console.log('✅ USERS - Deleted successfully');
    } catch (error) {
      console.error('❌ USERS - Error deleting:', error);
      throw error;
    }
  },
};
