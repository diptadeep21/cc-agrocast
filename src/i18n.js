import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      welcome: 'Welcome to AgroCast',
      // ...other translations...
    },
  },
  hi: {
    translation: {
      welcome: 'एग्रोकास्ट में आपका स्वागत है',
      // ...other translations...
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: 'en',
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
