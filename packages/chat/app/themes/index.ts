import { CustomTheme } from '../context/SettingsContext';
import type { ThemeType } from '../context/SettingsContext';

export const THEMES: { label: string; value: ThemeType; colors: { primary: string; secondary: string } }[] = [
  { label: 'Mono', value: 'mono', colors: { primary: '#000000', secondary: '#ffffff' } },
  { label: 'Contrast', value: 'contrast', colors: { primary: '#ffff00', secondary: '#000000' } },
  { label: 'Neon', value: 'neon', colors: { primary: '#00ff00', secondary: '#ff00ff' } },
  { label: 'Candy', value: 'candy', colors: { primary: '#ff1493', secondary: '#9932cc' } },
  { label: 'Classic', value: 'classic', colors: { primary: '#000000', secondary: '#666666' } },
  { label: 'Sunset', value: 'sunset', colors: { primary: '#5b1a1a', secondary: '#8e6c6c' } },
  { label: 'Forest', value: 'forest', colors: { primary: '#1b4d1b', secondary: '#6b8e6b' } },
  { label: 'Ocean', value: 'ocean', colors: { primary: '#1a3c5b', secondary: '#6c8eae' } },
  { label: 'Mint', value: 'mint', colors: { primary: '#3eb489', secondary: '#40826d' } },
];

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
  },
  mono: {
    light: {
      colors: {
        primary: '#000000',
        onPrimary: '#ffffff',
        primaryContainer: '#ffffff',
        onPrimaryContainer: '#000000',
        secondary: '#000000',
        onSecondary: '#ffffff',
        secondaryContainer: '#ffffff',
        onSecondaryContainer: '#000000',
        background: '#ffffff',
        onBackground: '#000000',
        surface: '#ffffff',
        onSurface: '#000000',
        surfaceVariant: '#ffffff',
        onSurfaceVariant: '#000000',
        outline: '#000000',
        elevation: {
          level0: 'transparent',
          level1: '#ffffff',
          level2: '#f5f5f5',
          level3: '#eeeeee',
          level4: '#e7e7e7',
          level5: '#e0e0e0',
        }
      },
      custom: {
        tabBar: '#ffffff',
        tabBarActive: '#000000',
      }
    },
    dark: {
      colors: {
        primary: '#ffffff',
        onPrimary: '#000000',
        primaryContainer: '#000000',
        onPrimaryContainer: '#ffffff',
        secondary: '#ffffff',
        onSecondary: '#000000',
        secondaryContainer: '#000000',
        onSecondaryContainer: '#ffffff',
        background: '#000000',
        onBackground: '#ffffff',
        surface: '#000000',
        onSurface: '#ffffff',
        surfaceVariant: '#000000',
        onSurfaceVariant: '#ffffff',
        outline: '#ffffff',
        elevation: {
          level0: 'transparent',
          level1: '#0a0a0a',
          level2: '#141414',
          level3: '#1f1f1f',
          level4: '#292929',
          level5: '#333333',
        }
      },
      custom: {
        tabBar: '#000000',
        tabBarActive: '#ffffff',
      }
    }
  },
  neon: {
    light: {
      colors: {
        primary: '#00ff00',
        onPrimary: '#000000',
        primaryContainer: '#e6ffe6',
        onPrimaryContainer: '#003300',
        secondary: '#ff00ff',
        onSecondary: '#000000',
        secondaryContainer: '#ffe6ff',
        onSecondaryContainer: '#330033',
        background: '#ffffff',
        onBackground: '#00cc00',
        surface: '#ffffff',
        onSurface: '#00cc00',
        surfaceVariant: '#e6ffe6',
        onSurfaceVariant: '#003300',
        outline: '#00ff00',
        elevation: {
          level0: 'transparent',
          level1: '#e6ffe6',
          level2: '#ccffcc',
          level3: '#b3ffb3',
          level4: '#99ff99',
          level5: '#80ff80',
        }
      },
      custom: {
        tabBar: '#e6ffe6',
        tabBarActive: '#00ff00',
      }
    },
    dark: {
      colors: {
        primary: '#00ff00',
        onPrimary: '#000000',
        primaryContainer: '#001a00',
        onPrimaryContainer: '#00ff00',
        secondary: '#ff00ff',
        onSecondary: '#000000',
        secondaryContainer: '#1a001a',
        onSecondaryContainer: '#ff00ff',
        background: '#000000',
        onBackground: '#00ff00',
        surface: '#000000',
        onSurface: '#00ff00',
        surfaceVariant: '#001a00',
        onSurfaceVariant: '#00ff00',
        outline: '#00ff00',
        elevation: {
          level0: 'transparent',
          level1: '#001a00',
          level2: '#003300',
          level3: '#004d00',
          level4: '#006600',
          level5: '#008000',
        }
      },
      custom: {
        tabBar: '#001a00',
        tabBarActive: '#00ff00',
      }
    }
  },
  contrast: {
    light: {
      colors: {
        primary: '#000000',
        onPrimary: '#ffffff',
        primaryContainer: '#ffffff',
        onPrimaryContainer: '#000000',
        secondary: '#ffff00',
        onSecondary: '#000000',
        secondaryContainer: '#ffffcc',
        onSecondaryContainer: '#333300',
        background: '#ffffff',
        onBackground: '#000000',
        surface: '#ffffff',
        onSurface: '#000000',
        surfaceVariant: '#ffffff',
        onSurfaceVariant: '#000000',
        outline: '#000000',
        elevation: {
          level0: 'transparent',
          level1: '#ffffff',
          level2: '#f5f5f5',
          level3: '#ebebeb',
          level4: '#e0e0e0',
          level5: '#d6d6d6',
        }
      },
      custom: {
        tabBar: '#ffffff',
        tabBarActive: '#000000',
      }
    },
    dark: {
      colors: {
        primary: '#ffff00',
        onPrimary: '#000000',
        primaryContainer: '#000000',
        onPrimaryContainer: '#ffff00',
        secondary: '#ffffff',
        onSecondary: '#000000',
        secondaryContainer: '#000000',
        onSecondaryContainer: '#ffffff',
        background: '#000000',
        onBackground: '#ffff00',
        surface: '#000000',
        onSurface: '#ffff00',
        surfaceVariant: '#000000',
        onSurfaceVariant: '#ffff00',
        outline: '#ffff00',
        elevation: {
          level0: 'transparent',
          level1: '#1a1a00',
          level2: '#333300',
          level3: '#4d4d00',
          level4: '#666600',
          level5: '#808000',
        }
      },
      custom: {
        tabBar: '#000000',
        tabBarActive: '#ffff00',
      }
    }
  },
  candy: {
    light: {
      colors: {
        primary: '#ff1493',
        onPrimary: '#ffffff',
        primaryContainer: '#ffe4f3',
        onPrimaryContainer: '#ff1493',
        secondary: '#9932cc',
        onSecondary: '#ffffff',
        secondaryContainer: '#f3e5ff',
        onSecondaryContainer: '#9932cc',
        background: '#fff0f8',
        onBackground: '#ff1493',
        surface: '#fff0f8',
        onSurface: '#ff1493',
        surfaceVariant: '#ffe4f3',
        onSurfaceVariant: '#ff1493',
        outline: '#ff69b4',
        elevation: {
          level0: 'transparent',
          level1: '#ffe4f3',
          level2: '#ffd9ed',
          level3: '#ffcee7',
          level4: '#ffc3e1',
          level5: '#ffb8db',
        }
      },
      custom: {
        tabBar: '#ffe4f3',
        tabBarActive: '#ff1493',
      }
    },
    dark: {
      colors: {
        primary: '#ff69b4',
        onPrimary: '#1a0011',
        primaryContainer: '#4d0033',
        onPrimaryContainer: '#ff69b4',
        secondary: '#da70d6',
        onSecondary: '#1a001a',
        secondaryContainer: '#4d004d',
        onSecondaryContainer: '#da70d6',
        background: '#1a0011',
        onBackground: '#ff69b4',
        surface: '#1a0011',
        onSurface: '#ff69b4',
        surfaceVariant: '#4d0033',
        onSurfaceVariant: '#ff69b4',
        outline: '#ff69b4',
        elevation: {
          level0: 'transparent',
          level1: '#4d0033',
          level2: '#660044',
          level3: '#800055',
          level4: '#990066',
          level5: '#b30077',
        }
      },
      custom: {
        tabBar: '#4d0033',
        tabBarActive: '#ff69b4',
      }
    }
  },
  mint: {
    light: {
      colors: {
        primary: '#3eb489',
        onPrimary: '#ffffff',
        primaryContainer: '#e0f5ed',
        onPrimaryContainer: '#3eb489',
        secondary: '#40826d',
        onSecondary: '#ffffff',
        secondaryContainer: '#e0f5ed',
        onSecondaryContainer: '#40826d',
        background: '#f0faf6',
        onBackground: '#3eb489',
        surface: '#f0faf6',
        onSurface: '#3eb489',
        surfaceVariant: '#e0f5ed',
        onSurfaceVariant: '#3eb489',
        outline: '#40826d',
        elevation: {
          level0: 'transparent',
          level1: '#e0f5ed',
          level2: '#d1f0e3',
          level3: '#c2ebd9',
          level4: '#b3e6cf',
          level5: '#a4e1c5',
        }
      },
      custom: {
        tabBar: '#e0f5ed',
        tabBarActive: '#3eb489',
      }
    },
    dark: {
      colors: {
        primary: '#98ffd9',
        onPrimary: '#00261a',
        primaryContainer: '#004d33',
        onPrimaryContainer: '#98ffd9',
        secondary: '#66ffb2',
        onSecondary: '#00261a',
        secondaryContainer: '#004d33',
        onSecondaryContainer: '#66ffb2',
        background: '#00261a',
        onBackground: '#98ffd9',
        surface: '#00261a',
        onSurface: '#98ffd9',
        surfaceVariant: '#004d33',
        onSurfaceVariant: '#98ffd9',
        outline: '#66ffb2',
        elevation: {
          level0: 'transparent',
          level1: '#004d33',
          level2: '#006644',
          level3: '#008055',
          level4: '#009966',
          level5: '#00b377',
        }
      },
      custom: {
        tabBar: '#004d33',
        tabBarActive: '#98ffd9',
      }
    }
  }
};
