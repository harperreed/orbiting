import AsyncStorage from '@react-native-async-storage/async-storage';

const SETTINGS_STORAGE_KEY = '@settings';

export async function loadSettings(): Promise<Record<string, unknown> | null> {
  try {
    const settingsJson = await AsyncStorage.getItem(SETTINGS_STORAGE_KEY);
    return settingsJson ? JSON.parse(settingsJson) : null;
  } catch (error) {
    throw new Error(`Failed to load settings: ${error}`);
  }
}

export async function saveSettings(settings: Record<string, unknown>): Promise<void> {
  try {
    await AsyncStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
  } catch (error) {
    throw new Error(`Failed to save settings: ${error}`);
  }
}
