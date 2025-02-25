import React, { createContext, useContext, useEffect, useState } from 'react';
import { ColorSchemeName, useColorScheme as useDeviceColorScheme } from 'react-native';
import { MD3Theme } from 'react-native-paper';
import { loadSettings, saveSettings } from '../utils/settingsStorage';
import { themes } from '../themes';
import { createError, ErrorType, logError } from '../utils/errorUtils';

export type ThemeType = 'classic' | 'ocean' | 'forest' | 'sunset' | 'mono' | 'neon' | 'contrast' | 'candy' | 'mint';

export interface CustomTheme extends MD3Theme {
  custom: {
    tabBar: string;
    tabBarActive: string;
  }
}

interface Settings {
  colorScheme: ColorSchemeName | 'system';
  startingFontSize: number;
  theme: ThemeType;
  shakeMode: 'clear' | 'flash' | 'none';
  isInstalled?: boolean;
}

interface SettingsContextType extends Settings {
  updateSettings: (settings: Partial<Settings>) => void;
  resetSettings: () => void;
  currentTheme: CustomTheme;
  error: string | null;
  clearError: () => void;
}

const defaultSettings: Settings = {
  colorScheme: 'system',
  startingFontSize: 24,
  theme: 'mono',
  shakeMode: 'none',
  isInstalled: false,
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const deviceColorScheme = useDeviceColorScheme();
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadSettings().then((savedSettings) => {
      if (savedSettings) {
        setSettings(savedSettings);
      }
    }).catch(err => {
      const appError = createError(
        ErrorType.STORAGE,
        'Failed to load settings',
        err
      );
      logError(appError);
      setError('Unable to load settings. Default settings applied.');
      setSettings(defaultSettings);
    });
  }, []);

  const clearError = () => setError(null);

  const updateSettings = async (newSettings: Partial<Settings>) => {
    try {
      const updatedSettings = { ...settings, ...newSettings };
      setSettings(updatedSettings);
      await saveSettings(updatedSettings);
    } catch (err) {
      const appError = createError(
        ErrorType.STORAGE,
        'Failed to save settings',
        err
      );
      logError(appError);
      setError('Unable to save settings. Please try again.');
    }
  };

  const resetSettings = async () => {
    try {
      setSettings(defaultSettings);
      await saveSettings(defaultSettings);
    } catch (err) {
      const appError = createError(
        ErrorType.STORAGE,
        'Failed to reset settings',
        err
      );
      logError(appError);
      setError('Unable to reset settings. Please try again.');
    }
  };

  const effectiveColorScheme = settings.colorScheme === 'system' 
    ? deviceColorScheme 
    : settings.colorScheme;

  const currentTheme = themes[settings.theme][effectiveColorScheme || 'light'];

  return (
    <SettingsContext.Provider
      value={{
        ...settings,
        updateSettings,
        resetSettings,
        currentTheme: currentTheme,
        error,
        clearError,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
