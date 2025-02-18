import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import * as Localization from "expo-localization";
import { loadLanguage, saveLanguage } from "../utils/languageStorage";
import { resources } from "./translations";

export const defaultNS = "common";

export const SUPPORTED_LANGUAGES = [
    { code: "en", label: "English", flag: "🇺🇸" },
    { code: "de", label: "Deutsch", flag: "🇩🇪" },
    { code: "pt", label: "Português", flag: "🇵🇹" },
    { code: "es", label: "Español", flag: "🇪🇸" },
    { code: "fr", label: "Français", flag: "🇫🇷" },
    { code: "hi", label: "हिन्दी", flag: "🇮🇳" },
    { code: "bn", label: "বাংলা", flag: "🇧🇩" },
    { code: "id", label: "Bahasa Indonesia", flag: "🇮🇩" },
    { code: "zh", label: "中文", flag: "🇨🇳" },
    { code: "zh_TW", label: "繁體中文", flag: "🇹🇼" },
    { code: "ko", label: "한국어", flag: "🇰🇷" },
    { code: "ja", label: "日本語", flag: "🇯🇵" },
] as const;

export type LanguageCode = (typeof SUPPORTED_LANGUAGES)[number]["code"];

// Initialize with system locale, then load saved language
i18next.use(initReactI18next).init({
    resources,
    lng: Localization.locale.split("-")[0], // Use device language initially
    fallbackLng: "en",
    defaultNS,
    interpolation: {
        escapeValue: false,
    },
});

// Load saved language preference
loadLanguage().then((savedLanguage) => {
    if (savedLanguage) {
        i18next.changeLanguage(savedLanguage);
    }
});

export const changeLanguage = async (lng: LanguageCode) => {
    await saveLanguage(lng);
    return i18next.changeLanguage(lng);
};

export default i18next;
