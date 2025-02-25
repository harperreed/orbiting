import AsyncStorage from '@react-native-async-storage/async-storage';
import { createError, ErrorType } from './errorUtils';

const SETTINGS_STORAGE_KEY = '@settings';

export async function loadSettings(): Promise<Record<string, unknown> | null> {
  try {
    // Check if we're in a browser environment
    if (typeof window === 'undefined') {
      return null; // Return null during SSR
    }
    const settingsJson = await AsyncStorage.getItem(SETTINGS_STORAGE_KEY);
    return settingsJson ? JSON.parse(settingsJson) : null;
  } catch (error) {
    throw createError(
      ErrorType.STORAGE,
      `Failed to load settings: ${error}`,
      error
    );
  }
}

export async function saveSettings(settings: Record<string, unknown>): Promise<void> {
  try {
    // Check if we're in a browser environment
    if (typeof window === 'undefined') {
      return; // Skip storage operations during SSR
    }
    await AsyncStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
  } catch (error) {
    throw createError(
      ErrorType.STORAGE,
      `Failed to save settings: ${error}`,
      error
    );
  }
}
