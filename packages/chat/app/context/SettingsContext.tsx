import React, { createContext, useContext, useEffect, useState } from 'react';
import { ColorSchemeName, useColorScheme as useDeviceColorScheme } from 'react-native';
import { loadSettings, saveSettings } from '../utils/settingsStorage';

export type ThemeType = 'classic' | 'ocean' | 'forest' | 'sunset';

export interface ThemeColors {
  background: string;
  text: string;
  placeholder: string;
  tabBar: string;
  tabBarActive: string;
}

export const themes: Record<ThemeType, { light: ThemeColors; dark: ThemeColors }> = {
  classic: {
    light: {
      background: '#ffffff',
      text: '#000000',
      placeholder: '#888888',
      tabBar: '#f5f5f5',
      tabBarActive: '#000000',
    },
    dark: {
      background: '#1a1a1a',
      text: '#ffffff',
      placeholder: '#888888',
      tabBar: '#2a2a2a',
      tabBarActive: '#ffffff',
    }
  },
  ocean: {
    light: {
      background: '#f0f8ff',
      text: '#1a3c5b',
      placeholder: '#6c8eae',
      tabBar: '#e1f1ff',
      tabBarActive: '#1a3c5b',
    },
    dark: {
      background: '#0a1929',
      text: '#b8d4f0',
      placeholder: '#4a6785',
      tabBar: '#142943',
      tabBarActive: '#b8d4f0',
    }
  },
  forest: {
    light: {
      background: '#f5fff5',
      text: '#1b4d1b',
      placeholder: '#6b8e6b',
      tabBar: '#e6ffe6',
      tabBarActive: '#1b4d1b',
    },
    dark: {
      background: '#0a290a',
      text: '#b9e6b9',
      placeholder: '#4a854a',
      tabBar: '#143814',
      tabBarActive: '#b9e6b9',
    }
  },
  sunset: {
    light: {
      background: '#fff5f0',
      text: '#5b1a1a',
      placeholder: '#8e6c6c',
      tabBar: '#ffe1e1',
      tabBarActive: '#5b1a1a',
    },
    dark: {
      background: '#290a0a',
      text: '#f0b8b8',
      placeholder: '#854a4a',
      tabBar: '#431414',
      tabBarActive: '#f0b8b8',
    }
  }
};

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

  const currentTheme = themes[settings.theme][effectiveColorScheme || 'light'];

  return (
    <SettingsContext.Provider
      value={{
        ...settings,
        colorScheme: effectiveColorScheme,
        updateSettings,
        resetSettings,
        currentTheme,
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
