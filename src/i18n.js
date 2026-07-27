import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

import en from './locales/en.json'
import et from './locales/et.json'
import ru from './locales/ru.json'

i18n
  // detect language from localStorage / browser, then persist the choice
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      et: { translation: et },
      ru: { translation: ru },
    },
    fallbackLng: 'en',
    supportedLngs: ['en', 'et', 'ru'],
    interpolation: {
      escapeValue: false, // React already escapes
    },
    detection: {
      order: ['localStorage', 'navigator'],
      lookupLocalStorage: 'lang',
      caches: ['localStorage'],
    },
  })

export default i18n
