import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';

export const defaultNS = 'common';
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

export default i18next;
