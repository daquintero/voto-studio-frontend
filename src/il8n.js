/* eslint-disable */
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import English from './translations/English';
import Spanish from './translations/Spanish';

// the translations
// (tip move them in a JSON file and import them)
const resources = {
  en: English,
  es: Spanish,
};

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: 'es',

    keySeparator: false, // we do not use keys in form messages.welcome

    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

export default i18n;
