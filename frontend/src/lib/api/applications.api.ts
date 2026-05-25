import api from './client';

export const applicationsApi = {
  create: (data: FormData) =>
    api.post('/applications', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  getMine: () => api.get('/applications/mine'),

  getOne: (id: string) => api.get(`/applications/${id}`),

  // University
  getUniversityApplications: () => api.get('/applications/university'),

  universityRespond: (
    id: string,
    data: { decision: 'accepted' | 'refused' | 'info_requested'; response: string },
  ) => api.put(`/applications/${id}/respond`, data),
};
