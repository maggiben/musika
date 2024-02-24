import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import translationES from '@translation/es/translation.json';


// (We only need to initialize i18next once).
i18n
  // Plug in i18next React extensions.
  .use(initReactI18next)
  .init({
    // translations would likely be in separate files.
    resources: {
      es: { translation: translationES },
    },
    // Set the default language to English.
    lng: 'es',
    fallbackLng: 'es', // fallback language in case translation is missing
    // Disable i18next's default escaping, which prevents XSS
    // attacks. React already takes care of this.
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
