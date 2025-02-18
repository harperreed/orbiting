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
      confirm: 'Confirm',
      language: 'Language',
      appearance: 'Appearance',
      colorScheme: 'Color Scheme',
      chooseColorScheme: 'Choose your preferred color scheme',
      startingFontSize: 'Starting Font Size',
      theme: 'Theme',
      chooseTheme: 'Choose your preferred theme',
      gestures: 'Gestures',
      shakeAction: 'Shake Action',
      shakeDescription: 'Choose what happens when you shake your device',
      none: 'None',
      clearText: 'Clear Text',
      clearTextDescription: 'Shake to clear the current text',
      flashScreen: 'Flash Screen',
      flashScreenDescription: 'Shake to flash the screen colors',
      resetDefaults: 'Reset to Defaults',
      system: 'System',
      light: 'Light',
      dark: 'Dark'
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
      confirm: 'Confirmar',
      language: 'Idioma',
      appearance: 'Apariencia',
      colorScheme: 'Esquema de color',
      chooseColorScheme: 'Elige tu esquema de color preferido',
      startingFontSize: 'Tamaño de fuente inicial',
      theme: 'Tema',
      chooseTheme: 'Elige tu tema preferido',
      gestures: 'Gestos',
      shakeAction: 'Acción al agitar',
      shakeDescription: 'Elige qué sucede cuando agitas tu dispositivo',
      none: 'Ninguno',
      clearText: 'Borrar texto',
      clearTextDescription: 'Agita para borrar el texto actual',
      flashScreen: 'Destello de pantalla',
      flashScreenDescription: 'Agita para hacer destellar los colores de la pantalla',
      resetDefaults: 'Restablecer valores predeterminados',
      system: 'Sistema',
      light: 'Claro',
      dark: 'Oscuro'
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
