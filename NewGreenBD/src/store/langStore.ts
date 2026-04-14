import { create } from 'zustand';
import { Language } from '../types';
import { changeLanguage } from '../i18n';

interface LangStore {
  language: Language;
  lang: Language;
  setLanguage: (lang: Language) => void;
  toggleLang: () => void;
}

export const useLangStore = create<LangStore>((set, get) => ({
  language: 'bn',
  lang: 'bn',

  setLanguage: async (lang: Language) => {
    await changeLanguage(lang);
    set({ language: lang, lang });
  },

  toggleLang: async () => {
    const newLang = get().lang === 'bn' ? 'en' : 'bn';
    await changeLanguage(newLang);
    set({ language: newLang, lang: newLang });
  },
}));
