import { create } from 'zustand';
import api from '../api/client';

interface NotificationState {
  unreadCount: number;
  fetching: boolean;
  initialized: boolean;
  fetchCount: () => Promise<void>;
  decrement: (n?: number) => void;
  reset: () => void;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  unreadCount: 0,
  fetching: false,
  initialized: false,

  fetchCount: async () => {
    if (get().fetching) return;
    set({ fetching: true });
    try {
      const res = await api.get('/notifications/mine');
      const count = (res.data as any[]).filter((n: any) => !n.isRead).length;
      set({ unreadCount: count, initialized: true });
    } catch {
      set({ initialized: true });
    } finally {
      set({ fetching: false });
    }
  },

  decrement: (n = 1) =>
    set((s) => ({ unreadCount: Math.max(0, s.unreadCount - n) })),

  reset: () => set({ unreadCount: 0 }),
}));
