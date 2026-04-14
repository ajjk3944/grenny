import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import bn from './bn.json';
import en from './en.json';
import { storage } from '../utils/storage';

const LANGUAGE_KEY = 'app_language';

const initI18n = async () => {
  const savedLanguage = await storage.get<string>(LANGUAGE_KEY);
  
  i18n
    .use(initReactI18next)
    .init({
      resources: {
        bn: { translation: bn },
        en: { translation: en },
      },
      lng: savedLanguage || 'bn',
      fallbackLng: 'bn',
      interpolation: {
        escapeValue: false,
      },
    });
};

export const changeLanguage = async (lang: string) => {
  await storage.set(LANGUAGE_KEY, lang);
  i18n.changeLanguage(lang);
};

initI18n();

export default i18n;
