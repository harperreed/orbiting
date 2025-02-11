import React, { createContext, useContext, useEffect, useState } from 'react';
import { ColorSchemeName, useColorScheme as useDeviceColorScheme } from 'react-native';
import { MD3Theme } from 'react-native-paper';
import { loadSettings, saveSettings } from '../utils/settingsStorage';

export type ThemeType = 'classic' | 'ocean' | 'forest' | 'sunset';

export interface CustomTheme extends MD3Theme {
  custom: {
    tabBar: string;
    tabBarActive: string;
  }
}

export interface ThemeColors {
  background: string;
  text: string;
  placeholder: string;
  tabBar: string;
  tabBarActive: string;
}

export const themes: Record<ThemeType, { light: CustomTheme; dark: CustomTheme }> = {
  classic: {
    light: {
      colors: {
        primary: '#000000',
        onPrimary: '#ffffff',
        primaryContainer: '#f5f5f5',
        onPrimaryContainer: '#000000',
        secondary: '#666666',
        onSecondary: '#ffffff',
        secondaryContainer: '#f0f0f0',
        onSecondaryContainer: '#1a1a1a',
        background: '#ffffff',
        onBackground: '#000000',
        surface: '#ffffff',
        onSurface: '#000000',
        surfaceVariant: '#f5f5f5',
        onSurfaceVariant: '#000000',
        outline: '#666666',
        elevation: {
          level0: 'transparent',
          level1: '#f5f5f5',
          level2: '#ebebeb',
          level3: '#e0e0e0',
          level4: '#d6d6d6',
          level5: '#cccccc',
        }
      },
      custom: {
        tabBar: '#f5f5f5',
        tabBarActive: '#000000',
      }
    },
    dark: {
      colors: {
        primary: '#ffffff',
        onPrimary: '#000000',
        primaryContainer: '#1e1e1e',
        onPrimaryContainer: '#ffffff',
        secondary: '#a0a0a0',
        onSecondary: '#000000',
        secondaryContainer: '#2a2a2a',
        onSecondaryContainer: '#ffffff',
        background: '#121212',
        onBackground: '#ffffff',
        surface: '#121212',
        onSurface: '#ffffff',
        surfaceVariant: '#1e1e1e',
        onSurfaceVariant: '#ffffff',
        outline: '#a0a0a0',
        elevation: {
          level0: 'transparent',
          level1: '#1e1e1e',
          level2: '#232323',
          level3: '#282828',
          level4: '#2d2d2d',
          level5: '#323232',
        }
      },
      custom: {
        tabBar: '#1e1e1e',
        tabBarActive: '#ffffff',
      }
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
      background: '#0d1b2a',
      text: '#e0f0ff',
      placeholder: '#8ab4e8',
      tabBar: '#162635',
      tabBarActive: '#e0f0ff',
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
      background: '#0d1f0d',
      text: '#e0ffe0',
      placeholder: '#85c285',
      tabBar: '#162916',
      tabBarActive: '#e0ffe0',
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
      background: '#1f0d0d',
      text: '#ffe0e0',
      placeholder: '#c28585',
      tabBar: '#291616',
      tabBarActive: '#ffe0e0',
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
