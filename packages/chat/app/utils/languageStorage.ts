import AsyncStorage from '@react-native-async-storage/async-storage';
import type { LanguageCode } from '../i18n/config';

const LANGUAGE_KEY = '@orbiting/language';

export async function saveLanguage(language: LanguageCode): Promise<void> {
  try {
    // Check if we're in a browser environment
    if (typeof window === 'undefined') {
      return; // Skip storage operations during SSR
    }
    await AsyncStorage.setItem(LANGUAGE_KEY, language);
  } catch (error) {
    console.error('Error saving language:', error);
  }
}

export async function loadLanguage(): Promise<LanguageCode | null> {
  try {
    // Check if we're in a browser environment
    if (typeof window === 'undefined') {
      return null; // Return null during SSR
    }
    const language = await AsyncStorage.getItem(LANGUAGE_KEY);
    return language as LanguageCode;
  } catch (error) {
    console.error('Error loading language:', error);
    return null;
  }
}
