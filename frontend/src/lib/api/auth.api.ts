import api from './client';

export const authApi = {
  // ── Login ──────────────────────────────────────────────
  loginStudent: (email: string, password: string) =>
    api.post('/auth/login', { email, password, role: 'student' }),

  loginAgent: (email: string, password: string) =>
    api.post('/auth/login', { email, password, role: 'agent' }),

  loginUniversity: (email: string, password: string) =>
    api.post('/auth/login', { email, password, role: 'university' }),

  loginAdmin: (email: string, password: string) =>
    api.post('/auth/login', { email, password, role: 'admin' }),

  // ── Register ───────────────────────────────────────────
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

  // ── Email verification ─────────────────────────────────
  verifyEmail: (email: string, code: string, role: string) =>
    api.post('/auth/verify-email', { email, code, role }),

  resendVerificationCode: (email: string, role: string) =>
    api.post('/auth/resend-code', { email, role }),

  // ── Forgot / Reset password ────────────────────────────
  forgotPassword: (email: string, role: string) =>
    api.post('/auth/forgot-password', { email, role }),

  resetPassword: (email: string, code: string, newPassword: string, role: string) =>
    api.post('/auth/reset-password', { email, code, newPassword, role }),
};
