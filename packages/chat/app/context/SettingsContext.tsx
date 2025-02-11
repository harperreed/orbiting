import React, { createContext, useContext, useEffect, useState } from 'react';
import { ColorSchemeName, useColorScheme as useDeviceColorScheme } from 'react-native';
import { ThemeManager } from 'rnuilib';
import { loadSettings, saveSettings } from '../utils/settingsStorage';

export type ThemeType = 'classic' | 'ocean' | 'forest' | 'sunset';

export interface CustomTheme extends ThemeManager.Theme {
  custom?: {
    tabBar?: string;
    tabBarActive?: string;
  }
}

export interface ThemeColors {
  backgroundColor: string; // RNUIlib uses backgroundColor instead of background
  textColor: string; // RNUIlib uses textColor instead of text
  placeholderTextColor: string;
  tabBarColor: string;
  tabBarActiveColor: string;
}

export const themes: Record<ThemeType, { light: CustomTheme; dark: CustomTheme }> = {
  classic: {
    light: {
      colors: {
        $backgroundPrimaryLight: '#ffffff',
        $textPrimary: '#000000',
        $backgroundSecondaryLight: '#f5f5f5',
        $textSecondary: '#666666',
        $outlineColor: '#666666',
        $iconPrimary: '#000000',
        $iconSecondary: '#666666',
        // RNUIlib specific semantic colors
        $backgroundDefault: '#ffffff',
        $textDefault: '#000000',
        $contentBackgroundLight: '#f5f5f5',
        $textNeutral: '#666666'
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
      colors: {
        primary: '#1a3c5b',
        onPrimary: '#ffffff',
        primaryContainer: '#e1f1ff',
        onPrimaryContainer: '#1a3c5b',
        secondary: '#6c8eae',
        onSecondary: '#ffffff',
        secondaryContainer: '#e1f1ff',
        onSecondaryContainer: '#1a3c5b',
        background: '#f0f8ff',
        onBackground: '#1a3c5b',
        surface: '#f0f8ff',
        onSurface: '#1a3c5b',
        surfaceVariant: '#e1f1ff',
        onSurfaceVariant: '#1a3c5b',
        outline: '#6c8eae',
        elevation: {
          level0: 'transparent',
          level1: '#e1f1ff',
          level2: '#d2e8ff',
          level3: '#c3dfff',
          level4: '#b4d6ff',
          level5: '#a5cdff',
        }
      },
      custom: {
        tabBar: '#e1f1ff',
        tabBarActive: '#1a3c5b',
      }
    },
    dark: {
      colors: {
        primary: '#e0f0ff',
        onPrimary: '#0d1b2a',
        primaryContainer: '#162635',
        onPrimaryContainer: '#e0f0ff',
        secondary: '#8ab4e8',
        onSecondary: '#0d1b2a',
        secondaryContainer: '#162635',
        onSecondaryContainer: '#e0f0ff',
        background: '#0d1b2a',
        onBackground: '#e0f0ff',
        surface: '#0d1b2a',
        onSurface: '#e0f0ff',
        surfaceVariant: '#162635',
        onSurfaceVariant: '#e0f0ff',
        outline: '#8ab4e8',
        elevation: {
          level0: 'transparent',
          level1: '#162635',
          level2: '#1b2f40',
          level3: '#20384b',
          level4: '#254156',
          level5: '#2a4a61',
        }
      },
      custom: {
        tabBar: '#162635',
        tabBarActive: '#e0f0ff',
      }
    }
  },
  forest: {
    light: {
      colors: {
        primary: '#1b4d1b',
        onPrimary: '#ffffff',
        primaryContainer: '#e6ffe6',
        onPrimaryContainer: '#1b4d1b',
        secondary: '#6b8e6b',
        onSecondary: '#ffffff',
        secondaryContainer: '#e6ffe6',
        onSecondaryContainer: '#1b4d1b',
        background: '#f5fff5',
        onBackground: '#1b4d1b',
        surface: '#f5fff5',
        onSurface: '#1b4d1b',
        surfaceVariant: '#e6ffe6',
        onSurfaceVariant: '#1b4d1b',
        outline: '#6b8e6b',
        elevation: {
          level0: 'transparent',
          level1: '#e6ffe6',
          level2: '#d7ffd7',
          level3: '#c8ffc8',
          level4: '#b9ffb9',
          level5: '#aaffaa',
        }
      },
      custom: {
        tabBar: '#e6ffe6',
        tabBarActive: '#1b4d1b',
      }
    },
    dark: {
      colors: {
        primary: '#e0ffe0',
        onPrimary: '#0d1f0d',
        primaryContainer: '#162916',
        onPrimaryContainer: '#e0ffe0',
        secondary: '#85c285',
        onSecondary: '#0d1f0d',
        secondaryContainer: '#162916',
        onSecondaryContainer: '#e0ffe0',
        background: '#0d1f0d',
        onBackground: '#e0ffe0',
        surface: '#0d1f0d',
        onSurface: '#e0ffe0',
        surfaceVariant: '#162916',
        onSurfaceVariant: '#e0ffe0',
        outline: '#85c285',
        elevation: {
          level0: 'transparent',
          level1: '#162916',
          level2: '#1b321b',
          level3: '#203b20',
          level4: '#254425',
          level5: '#2a4d2a',
        }
      },
      custom: {
        tabBar: '#162916',
        tabBarActive: '#e0ffe0',
      }
    }
  },
  sunset: {
    light: {
      colors: {
        primary: '#5b1a1a',
        onPrimary: '#ffffff',
        primaryContainer: '#ffe1e1',
        onPrimaryContainer: '#5b1a1a',
        secondary: '#8e6c6c',
        onSecondary: '#ffffff',
        secondaryContainer: '#ffe1e1',
        onSecondaryContainer: '#5b1a1a',
        background: '#fff5f0',
        onBackground: '#5b1a1a',
        surface: '#fff5f0',
        onSurface: '#5b1a1a',
        surfaceVariant: '#ffe1e1',
        onSurfaceVariant: '#5b1a1a',
        outline: '#8e6c6c',
        elevation: {
          level0: 'transparent',
          level1: '#ffe1e1',
          level2: '#ffd2d2',
          level3: '#ffc3c3',
          level4: '#ffb4b4',
          level5: '#ffa5a5',
        }
      },
      custom: {
        tabBar: '#ffe1e1',
        tabBarActive: '#5b1a1a',
      }
    },
    dark: {
      colors: {
        primary: '#ffe0e0',
        onPrimary: '#1f0d0d',
        primaryContainer: '#291616',
        onPrimaryContainer: '#ffe0e0',
        secondary: '#c28585',
        onSecondary: '#1f0d0d',
        secondaryContainer: '#291616',
        onSecondaryContainer: '#ffe0e0',
        background: '#1f0d0d',
        onBackground: '#ffe0e0',
        surface: '#1f0d0d',
        onSurface: '#ffe0e0',
        surfaceVariant: '#291616',
        onSurfaceVariant: '#ffe0e0',
        outline: '#c28585',
        elevation: {
          level0: 'transparent',
          level1: '#291616',
          level2: '#321b1b',
          level3: '#3b2020',
          level4: '#442525',
          level5: '#4d2a2a',
        }
      },
      custom: {
        tabBar: '#291616',
        tabBarActive: '#ffe0e0',
      }
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
  currentTheme: CustomTheme;
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
        currentTheme: themes[settings.theme][effectiveColorScheme || 'light'],
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
