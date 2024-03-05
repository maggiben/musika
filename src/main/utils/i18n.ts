import i18n, { Module } from 'i18next';
import { is } from '@electron-toolkit/utils';
import { loadPreferences } from '../utils/preferences';
import { initReactI18next } from 'react-i18next';
import translationES from '@locale/es/translation.json';
import translationEN from '@locale/en/translation.json';
import translationFR from '@locale/fr/translation.json';

const fallbackLng = 'en';
const languageDetector = {
  type: 'languageDetector',
  async: true, // If this is set to true, your detect function receives a callback function that you should call with your language, useful to retrieve your language stored in AsyncStorage for example
  detect: async () => (await loadPreferences()).behaviour?.language ?? fallbackLng,
};

// (We only need to initialize i18next once).
i18n
  .use(languageDetector as Module)
  // Plug in i18next React extensions.
  .use(initReactI18next)
  .init({
    // translations would likely be in separate files.
    resources: {
      es: { translation: translationES },
      en: { translation: translationEN },
      fr: { translation: translationFR },
    },
    supportedLngs: ['en', 'es', 'fr'],
    // Set the default language to English.
    fallbackLng,
    // Disable i18next's default escaping, which prevents XSS
    // attacks. React already takes care of this.
    interpolation: {
      escapeValue: false,
    },
    debug: is.dev,
  });

export default i18n;
