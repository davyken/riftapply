import api from './client';

export const notificationsApi = {
  getMine: () => api.get('/notifications/mine'),
  markRead: (id: string) => api.put(`/notifications/${id}/read`),
};
