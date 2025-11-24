import { apiService } from './api';

export interface User {
  id: number;
  email: string;
  role?: string;
  name?: string;
}

export interface CreateUserDto {
  email: string;
  password: string;
  name?: string;
}

export interface UpdateUserDto {
  email?: string;
  name?: string;
}

export const usersService = {
  async getAll(): Promise<User[]> {
    return apiService.get<User[]>('/users');
  },

  async getById(id: number): Promise<User> {
    return apiService.get<User>(`/users/${id}`);
  },

  async create(data: CreateUserDto): Promise<User> {
    return apiService.post<User>('/users', data);
  },

  async update(id: number, data: UpdateUserDto): Promise<User> {
    return apiService.patch<User>(`/users/${id}`, data);
  },

  async delete(id: number): Promise<void> {
    return apiService.delete<void>(`/users/${id}`);
  },
};

