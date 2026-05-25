import api from './client';

export const adminApi = {
  getStats: () => api.get('/admin/stats'),

  // Account verifications
  getPendingAgents: () => api.get('/admin/pending/agents'),
  getPendingUniversities: () => api.get('/admin/pending/universities'),
  approveAgent: (id: string) => api.put(`/admin/agents/${id}/approve`),
  rejectAgent: (id: string, reason: string) => api.put(`/admin/agents/${id}/reject`, { reason }),
  approveUniversity: (id: string) => api.put(`/admin/universities/${id}/approve`),
  rejectUniversity: (id: string, reason: string) =>
    api.put(`/admin/universities/${id}/reject`, { reason }),

  // Applications
  getApplications: (status?: string) =>
    api.get('/admin/applications', { params: { status } }),
  getApplication: (id: string) => api.get(`/admin/applications/${id}`),
  approveApplication: (id: string) => api.put(`/admin/applications/${id}/approve`),
  rejectApplication: (id: string, reason: string) =>
    api.put(`/admin/applications/${id}/reject`, { reason }),
  sendToUniversity: (id: string) => api.put(`/admin/applications/${id}/send-to-university`),

  // Notify
  notifyCandidate: (
    id: string,
    data: {
      sendEmail: boolean;
      emailSubject?: string;
      emailBody?: string;
      sendDashboard?: boolean;
    },
  ) => api.post(`/admin/applications/${id}/notify`, data),

  getEmailTemplate: (
    id: string,
    type: 'acceptance' | 'rejection' | 'waiting',
    params: { candidateName: string; universityName: string; program?: string },
  ) => api.get(`/admin/applications/${id}/email-template/${type}`, { params }),

  // University replies
  getUniversityReplies: () => api.get('/admin/university-replies'),

  // All agents / universities / students (with optional status filter)
  getAllAgents:       (status?: string) => api.get('/admin/agents',       { params: status ? { status } : {} }),
  deleteAgent:        (id: string)      => api.delete(`/admin/agents/${id}`),
  getAllUniversities: (status?: string) => api.get('/admin/universities', { params: status ? { status } : {} }),
  deleteUniversity:   (id: string)      => api.delete(`/admin/universities/${id}`),
  getAllStudents:     ()                => api.get('/admin/students'),
  deleteStudent:      (id: string)      => api.delete(`/admin/students/${id}`),
};
