import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';
import { loadLanguage, saveLanguage } from '../utils/languageStorage';

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
      dark: 'Dark',
      // Navigation
      home: 'Home',
      homeHint: 'Navigate to main text input screen',
      historyTab: 'History',
      historyHint: 'View your message history',
      helpTab: 'Help',
      helpHint: 'View app instructions and help',
      settingsTab: 'Settings',
      settingsHint: 'Adjust app preferences and settings',
      aboutTab: 'About',
      aboutHint: 'View app information and credits',
      mainNavigation: 'Main navigation',
      // Actions
      clearText: 'Clear text',
      clearHint: 'Erases all current text from the screen',
      showHistory: 'Show history',
      showHistoryHint: 'Opens the message history screen',
      // History Screen
      searchMessages: 'Search messages',
      messagesWillAppearHere: 'Messages you create will appear here',
      clearAllHistory: 'Clear All History',
      clearHistoryTitle: 'Clear History',
      clearHistoryConfirmMessage: 'This will permanently delete all messages. Are you sure?',
      clearAll: 'Clear All',
      deleteMessage: 'Delete Message',
      deleteMessageConfirm: 'Are you sure you want to delete this message?',
      noMessages: 'No messages',
      // Text Input
      typeHere: 'Type here',
      // Help Screen
      welcomeToOrbiting: 'Welcome to Orbiting',
      appDescription: 'A simple messaging app for your eyeballs. You can use it to type and display messages to those around you. Display a message loud and clear.',
      quickStartGuide: 'Quick Start Guide',
      tapAndType: '✍️ Tap and start typing',
      tapAndTypeDesc: 'Your message will display loud and clear!',
      swipeLeft: '⬅️ Swipe Left',
      swipeLeftDesc: 'To clear the display',
      swipeRight: '➡️ Swipe Right',
      swipeRightDesc: 'To view the menu and settings',
      swipeUp: '⬆️ Swipe Up',
      swipeUpDesc: 'To display the history',
      crossPlatform: '📱 Cross-Platform',
      crossPlatformDesc: 'Works on both desktop and mobile',
      features: 'Features',
      autoScaling: 'Auto-scaling text size',
      autoScalingDesc: 'Text automatically adjusts to fit the screen',
      messageHistory: 'Message history',
      messageHistoryDesc: 'Access your previous messages easily',
      autoSaving: 'Automatic saving',
      autoSavingDesc: 'All messages are saved automatically',
      proTips: 'Pro Tips',
      addToHomescreen: 'Add to Homescreen',
      addToHomescreenDesc: 'Install the app for quick access anytime',
      quickLoad: 'Quick Load',
      quickLoadDesc: 'Tap any message in History to load it',
      textWrapping: 'Text Wrapping',
      textWrappingDesc: 'Messages automatically wrap on whitespace',
      about: 'About',
      aboutText: 'Orbiting was created by {{author1}} and {{author2}}. It was inspired by the need to communicate with people in the same space, but with different communications needs.',
      feedbackText: 'Please send us feedback. We want it!',
      feedbackEmail: 'feedback@orbiting.com'
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
      dark: 'Oscuro',
      // Navigation
      home: 'Inicio',
      homeHint: 'Ir a la pantalla principal de entrada de texto',
      historyTab: 'Historial',
      historyHint: 'Ver historial de mensajes',
      helpTab: 'Ayuda',
      helpHint: 'Ver instrucciones y ayuda',
      settingsTab: 'Ajustes',
      settingsHint: 'Ajustar preferencias y configuración',
      aboutTab: 'Acerca de',
      aboutHint: 'Ver información y créditos',
      mainNavigation: 'Navegación principal',
      // Actions
      clearText: 'Borrar texto',
      clearHint: 'Borra todo el texto actual de la pantalla',
      showHistory: 'Mostrar historial',
      showHistoryHint: 'Abre la pantalla de historial de mensajes',
      // History Screen
      searchMessages: 'Buscar mensajes',
      messagesWillAppearHere: 'Los mensajes que crees aparecerán aquí',
      clearAllHistory: 'Borrar todo el historial',
      clearHistoryTitle: 'Borrar historial',
      clearHistoryConfirmMessage: 'Esto eliminará permanentemente todos los mensajes. ¿Estás seguro?',
      clearAll: 'Borrar todo',
      deleteMessage: 'Eliminar mensaje',
      deleteMessageConfirm: '¿Estás seguro de que quieres eliminar este mensaje?',
      noMessages: 'No hay mensajes',
      // Text Input
      typeHere: 'Escribe aquí',
      // Help Screen
      welcomeToOrbiting: 'Bienvenido a Orbiting',
      appDescription: 'Una aplicación de mensajería simple para tus ojos. Puedes usarla para escribir y mostrar mensajes a quienes te rodean. Muestra un mensaje alto y claro.',
      quickStartGuide: 'Guía de inicio rápido',
      tapAndType: '✍️ Toca y empieza a escribir',
      tapAndTypeDesc: '¡Tu mensaje se mostrará alto y claro!',
      swipeLeft: '⬅️ Desliza a la izquierda',
      swipeLeftDesc: 'Para limpiar la pantalla',
      swipeRight: '➡️ Desliza a la derecha',
      swipeRightDesc: 'Para ver el menú y la configuración',
      swipeUp: '⬆️ Desliza hacia arriba',
      swipeUpDesc: 'Para mostrar el historial',
      crossPlatform: '📱 Multiplataforma',
      crossPlatformDesc: 'Funciona tanto en escritorio como en móvil',
      features: 'Características',
      autoScaling: 'Tamaño de texto automático',
      autoScalingDesc: 'El texto se ajusta automáticamente para adaptarse a la pantalla',
      messageHistory: 'Historial de mensajes',
      messageHistoryDesc: 'Accede fácilmente a tus mensajes anteriores',
      autoSaving: 'Guardado automático',
      autoSavingDesc: 'Todos los mensajes se guardan automáticamente',
      proTips: 'Consejos Pro',
      addToHomescreen: 'Añadir a la pantalla de inicio',
      addToHomescreenDesc: 'Instala la aplicación para acceder rápidamente',
      quickLoad: 'Carga rápida',
      quickLoadDesc: 'Toca cualquier mensaje en el Historial para cargarlo',
      textWrapping: 'Ajuste de texto',
      textWrappingDesc: 'Los mensajes se ajustan automáticamente en los espacios',
      about: 'Acerca de',
      aboutText: 'Orbiting fue creado por {{author1}} y {{author2}}. Se inspiró en la necesidad de comunicarse con personas en el mismo espacio, pero con diferentes necesidades de comunicación.',
      feedbackText: '¡Por favor, envíanos tus comentarios. ¡Los queremos!',
      feedbackEmail: 'feedback@orbiting.com'
    }
  }
};

// Initialize with system locale, then load saved language
i18next
  .use(initReactI18next)
  .init({
    resources,
    lng: Localization.locale.split('-')[0], // Use device language initially
    fallbackLng: 'en',
    defaultNS,
    interpolation: {
      escapeValue: false
    }
  });

// Load saved language preference
loadLanguage().then(savedLanguage => {
  if (savedLanguage) {
    i18next.changeLanguage(savedLanguage);
  }
});

export const changeLanguage = async (lng: LanguageCode) => {
  await saveLanguage(lng);
  return i18next.changeLanguage(lng);
};

export default i18next;
