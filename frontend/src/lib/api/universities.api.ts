import api from './client';

export const universitiesApi = {
  getAll:             ()         => api.get('/universities'),
  getOne:             (id: string) => api.get(`/universities/${id}`),
  updateProfile:      (data: any)  => api.put('/universities/profile', data),
  parsePrerequisites: (data: any)  => api.post('/universities/parse-prerequisites', data),
};
