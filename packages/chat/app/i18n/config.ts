import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';

export const defaultNS = 'common';

export const SUPPORTED_LANGUAGES = [
  { code: 'en', label: 'English', flag: '🇺🇸' },
  { code: 'es', label: 'Español', flag: '🇪🇸' }
] as const;

export type LanguageCode = typeof SUPPORTED_LANGUAGES[number]['code'];

export const resources = {
  en: {
    common: {
      welcome: 'Welcome',
      about: 'About',
      settings: 'Settings',
      help: 'Help',
      history: 'History',
      clear: 'Clear',
      save: 'Save',
      cancel: 'Cancel',
      delete: 'Delete',
      confirm: 'Confirm'
    }
  },
  es: {
    common: {
      welcome: 'Bienvenido',
      about: 'Acerca de',
      settings: 'Ajustes',
      help: 'Ayuda',
      history: 'Historial',
      clear: 'Limpiar',
      save: 'Guardar',
      cancel: 'Cancelar',
      delete: 'Eliminar',
      confirm: 'Confirmar'
    }
  }
};

i18next
  .use(initReactI18next)
  .init({
    resources,
    lng: Localization.locale.split('-')[0], // Use device language
    fallbackLng: 'en',
    defaultNS,
    interpolation: {
      escapeValue: false
    }
  });

export const changeLanguage = (lng: LanguageCode) => {
  return i18next.changeLanguage(lng);
};

export default i18next;
