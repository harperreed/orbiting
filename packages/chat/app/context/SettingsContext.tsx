import React, { createContext, useContext, useEffect, useState } from 'react';
import { ColorSchemeName, useColorScheme as useDeviceColorScheme } from 'react-native';
import { loadSettings, saveSettings } from '../utils/settingsStorage';

export type ThemeType = 'classic' | 'ocean' | 'forest' | 'sunset';

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
}

const defaultSettings: Settings = {
  colorScheme: 'system',
  startingFontSize: 24,
  theme: 'classic',
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

  return (
    <SettingsContext.Provider
      value={{
        ...settings,
        colorScheme: effectiveColorScheme,
        updateSettings,
        resetSettings,
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
