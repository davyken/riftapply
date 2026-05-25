import api from './client';

export const authApi = {
  loginStudent: (email: string, password: string) =>
    api.post('/auth/login', { email, password, role: 'student' }),

  loginAgent: (email: string, password: string) =>
    api.post('/auth/login', { email, password, role: 'agent' }),

  loginUniversity: (email: string, password: string) =>
    api.post('/auth/login', { email, password, role: 'university' }),

  loginAdmin: (email: string, password: string) =>
    api.post('/auth/login', { email, password, role: 'admin' }),

  registerStudent: (data: FormData) =>
    api.post('/auth/register/student', data),

  registerAgent: (data: FormData) =>
    api.post('/auth/register/agent', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  registerUniversity: (data: FormData) =>
    api.post('/auth/register/university', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
};
