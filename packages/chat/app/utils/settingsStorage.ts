import AsyncStorage from '@react-native-async-storage/async-storage';

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
    console.error(`Failed to load settings: ${error}`);
    return null;
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
    console.error(`Failed to save settings: ${error}`);
  }
}
