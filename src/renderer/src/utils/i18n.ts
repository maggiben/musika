import i18n, { Module } from 'i18next';
import { initReactI18next } from 'react-i18next';
import translationES from '@translation/es/translation.json';
import translationEN from '@translation/en/translation.json';
import translationFR from '@translation/fr/translation.json';
import { IPreferences } from 'types/types';

const languageDetector = {
  type: 'languageDetector',
  async: true, // If this is set to true, your detect function receives a callback function that you should call with your language, useful to retrieve your language stored in AsyncStorage for example
  detect: async function () {
    // You'll receive a callback if you passed async true
    /* return detected language */
    const preferences = await window.preferences.loadPreferences();
    return preferences?.behaviour?.language ?? 'en';
  },
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
    fallbackLng: 'en',
    // Disable i18next's default escaping, which prevents XSS
    // attacks. React already takes care of this.
    interpolation: {
      escapeValue: false,
    },
    debug: true,
  });

export default i18n;
