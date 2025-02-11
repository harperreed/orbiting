import React, { createContext, useContext, useEffect, useState } from 'react';
import { ColorSchemeName, useColorScheme as useDeviceColorScheme } from 'react-native';
import { MD3Theme } from 'react-native-paper';
import { loadSettings, saveSettings } from '../utils/settingsStorage';
import { themes } from '../themes';

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
  shakeEnabled: boolean;
  shakeFlashEnabled: boolean;
}

interface SettingsContextType extends Settings {
  updateSettings: (settings: Partial<Settings>) => void;
  resetSettings: () => void;
  currentTheme: CustomTheme;
}

const defaultSettings: Settings = {
  colorScheme: 'system',
  startingFontSize: 24,
  theme: 'mono',
  shakeEnabled: true,
  shakeFlashEnabled: false,
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const deviceColorScheme = useDeviceColorScheme();
  const [settings, setSettings] = useState<Settings>(defaultSettings);

  useEffect(() => {
    loadSettings().then((savedSettings) => {
      if (savedSettings) {
        setSettings(savedSettings);
      }
    });
  }, []);

  const updateSettings = async (newSettings: Partial<Settings>) => {
    const updatedSettings = { ...settings, ...newSettings };
    setSettings(updatedSettings);
    await saveSettings(updatedSettings);
  };

  const resetSettings = async () => {
    setSettings(defaultSettings);
    await saveSettings(defaultSettings);
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
