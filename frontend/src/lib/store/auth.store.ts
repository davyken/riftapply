'use client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Student, Agent, University, UserRole } from '@/types';

type AuthUser = (Student | Agent | University) & { role: UserRole };

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  role: UserRole | null;
  setAuth: (user: AuthUser, token: string, role: UserRole) => void;
  clearAuth: () => void;
  isAuthenticated: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      role: null,
      setAuth: (user, token, role) => set({ user, token, role }),
      clearAuth: () => set({ user: null, token: null, role: null }),
      isAuthenticated: () => !!get().token,
    }),
    {
      name: 'auth-storage',
    },
  ),
);
