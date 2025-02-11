import AsyncStorage from '@react-native-async-storage/async-storage';

const SETTINGS_STORAGE_KEY = '@settings';

export async function loadSettings() {
  try {
    const settingsJson = await AsyncStorage.getItem(SETTINGS_STORAGE_KEY);
    return settingsJson ? JSON.parse(settingsJson) : null;
  } catch (error) {
    console.error('Error loading settings:', error);
    return null;
  }
}

export async function saveSettings(settings: object) {
  try {
    await AsyncStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
  } catch (error) {
    console.error('Error saving settings:', error);
  }
}
