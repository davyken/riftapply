import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Lang = 'en' | 'fr';

interface LanguageState {
  lang: Lang;
  setLang: (l: Lang) => void;
  toggle: () => void;
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set, get) => ({
      lang: 'en',
      setLang: (lang) => set({ lang }),
      toggle: () => set({ lang: get().lang === 'en' ? 'fr' : 'en' }),
    }),
    { name: 'riftapply-lang' },
  ),
);
