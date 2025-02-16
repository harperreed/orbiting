import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';

const resources = {
  en: {
    translation: {
      "welcome": "Welcome to Orbiting",
      "description": "A simple messaging app for your eyeballs. You can use it to type and display the message to those around you. Display a message loud and clear.",
      "quick_start": "Quick Start Guide",
      "tap_to_type": "✍️ Tap and start typing",
      "clear_display": "⬅️ Swipe Left to clear the display",
      "view_menu": "➡️ Swipe Right to view the menu and settings",
      "display_history": "⬆️ Swipe Up to display the history",
      "cross_platform": "📱 Cross-Platform: Works on both desktop and mobile",
      "features": "Features",
      "auto_scaling": "Auto-scaling text size",
      "message_history": "Message history",
      "auto_saving": "Automatic saving",
      "pro_tips": "Pro Tips",
      "add_to_homescreen": "Add to Homescreen",
      "quick_load": "Quick Load",
      "text_wrapping": "Text Wrapping",
      "about": "About",
      "created_by": "Orbiting was created by",
      "inspired_by": "It was inspired by the need to communicate with people in the same space, but with different communications needs.",
      "send_feedback": "Please send us feedback. We want it!",
      "feedback_email": "feedback@orbiting.com",
      "get_started": "Get Started",
      "clear_history": "Clear History",
      "clear_history_confirmation": "This will permanently delete all messages. Are you sure?",
      "delete_message": "Delete Message",
      "delete_message_confirmation": "Are you sure you want to delete this message?",
      "no_messages": "No messages yet",
      "messages_appear_here": "Messages you create will appear here",
      "search_messages": "Search messages",
      "settings": "Settings",
      "appearance": "Appearance",
      "color_scheme": "Color Scheme",
      "starting_font_size": "Starting Font Size",
      "theme": "Theme",
      "gestures": "Gestures",
      "shake_action": "Shake Action",
      "none": "None",
      "clear_text": "Clear Text",
      "flash_screen": "Flash Screen",
      "reset_to_defaults": "Reset to Defaults",
      "loading": "Loading...",
      "error": "Error",
      "dismiss": "Dismiss"
    }
  },
  es: {
    translation: {
      "welcome": "Bienvenido a Orbiting",
      "description": "Una aplicación de mensajería simple para tus ojos. Puedes usarla para escribir y mostrar el mensaje a los que te rodean. Muestra un mensaje alto y claro.",
      "quick_start": "Guía de inicio rápido",
      "tap_to_type": "✍️ Toca y comienza a escribir",
      "clear_display": "⬅️ Desliza a la izquierda para borrar la pantalla",
      "view_menu": "➡️ Desliza a la derecha para ver el menú y la configuración",
      "display_history": "⬆️ Desliza hacia arriba para mostrar el historial",
      "cross_platform": "📱 Multiplataforma: Funciona tanto en escritorio como en móvil",
      "features": "Características",
      "auto_scaling": "Tamaño de texto autoajustable",
      "message_history": "Historial de mensajes",
      "auto_saving": "Guardado automático",
      "pro_tips": "Consejos profesionales",
      "add_to_homescreen": "Agregar a la pantalla de inicio",
      "quick_load": "Carga rápida",
      "text_wrapping": "Ajuste de texto",
      "about": "Acerca de",
      "created_by": "Orbiting fue creado por",
      "inspired_by": "Se inspiró en la necesidad de comunicarse con personas en el mismo espacio, pero con diferentes necesidades de comunicación.",
      "send_feedback": "Por favor envíanos tus comentarios. ¡Los queremos!",
      "feedback_email": "feedback@orbiting.com",
      "get_started": "Comenzar",
      "clear_history": "Borrar historial",
      "clear_history_confirmation": "Esto eliminará permanentemente todos los mensajes. ¿Estás seguro?",
      "delete_message": "Eliminar mensaje",
      "delete_message_confirmation": "¿Estás seguro de que deseas eliminar este mensaje?",
      "no_messages": "Aún no hay mensajes",
      "messages_appear_here": "Los mensajes que crees aparecerán aquí",
      "search_messages": "Buscar mensajes",
      "settings": "Configuraciones",
      "appearance": "Apariencia",
      "color_scheme": "Esquema de colores",
      "starting_font_size": "Tamaño de fuente inicial",
      "theme": "Tema",
      "gestures": "Gestos",
      "shake_action": "Acción de agitar",
      "none": "Ninguno",
      "clear_text": "Borrar texto",
      "flash_screen": "Pantalla de flash",
      "reset_to_defaults": "Restablecer a los valores predeterminados",
      "loading": "Cargando...",
      "error": "Error",
      "dismiss": "Descartar"
    }
  }
};

i18next
  .use(initReactI18next)
  .init({
    resources,
    lng: Localization.locale,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });
