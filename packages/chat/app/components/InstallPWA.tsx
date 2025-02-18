import React, { useEffect, useState } from 'react';
import { Button, Card, Text, IconButton, useTheme } from 'react-native-paper';
import { Platform, View, StyleSheet, Linking } from 'react-native';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function InstallPWA() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallOption, setShowInstallOption] = useState(false);
  const [browserType, setBrowserType] = useState<'standard' | 'ios-safari' | 'desktop-safari' | 'firefox' | 'unsupported'>('unsupported');
  const [guideExpanded, setGuideExpanded] = useState(false);
  const theme = useTheme();

  useEffect(() => {
    if (Platform.OS !== 'web') return;
    
    // Detect browser type
    const ua = window.navigator.userAgent;
    const isIOS = /iPad|iPhone|iPod/.test(ua) && !window.MSStream;
    const isSafari = /Safari/.test(ua) && !/Chrome/.test(ua);
    const isFirefox = /Firefox/.test(ua);
    
    if (isIOS && isSafari) {
      setBrowserType('ios-safari');
      setShowInstallOption(true);
    } else if (!isIOS && isSafari) {
      setBrowserType('desktop-safari');
      setShowInstallOption(true);
    } else if (isFirefox) {
      setBrowserType('firefox');
      setShowInstallOption(true);
    } else {
      setBrowserType('standard');
      // For standard browsers, we'll wait for the beforeinstallprompt event
    }

    // Only set up the event listener for standard browsers
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowInstallOption(true);
    };
    
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    
    // Detect if app is already installed
    // Simple heuristic - not perfect, but provides a hint
    if ('standalone' in window.navigator && (window.navigator as any).standalone === true) {
      setShowInstallOption(false);
    }
    
    // Check if the app is already installed on Android
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setShowInstallOption(false);
    }
    
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (browserType === 'standard' && deferredPrompt) {
      try {
        await deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
          setShowInstallOption(false);
        }
      } catch (error) {
        console.error('Installation failed:', error);
      }
      setDeferredPrompt(null);
    } else {
      // For non-standard browsers, toggle the installation guide
      setGuideExpanded(!guideExpanded);
    }
  };

  const handleLearnMore = () => {
    Linking.openURL('https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/Installing');
  };

  if (!showInstallOption || Platform.OS !== 'web') return null;

  const renderInstallGuide = () => {
    switch (browserType) {
      case 'ios-safari':
        return (
          <>
            <Text style={styles.guideTitle}>Install on iOS Safari:</Text>
            <View style={styles.steps}>
              <Text style={styles.step}>1. Tap the <IconButton icon="share" size={16} /> share button</Text>
              <Text style={styles.step}>2. Scroll down and tap "Add to Home Screen"</Text>
              <Text style={styles.step}>3. Tap "Add" in the top-right corner</Text>
            </View>
          </>
        );
      case 'desktop-safari':
        return (
          <>
            <Text style={styles.guideTitle}>Install on macOS Safari:</Text>
            <Text style={styles.note}>
              Safari on macOS has limited PWA support. For the best experience, consider using Chrome or Edge.
            </Text>
          </>
        );
      case 'firefox':
        return (
          <>
            <Text style={styles.guideTitle}>Install on Firefox:</Text>
            <View style={styles.steps}>
              <Text style={styles.step}>1. Click the ⋮ menu button</Text>
              <Text style={styles.step}>2. Select "Add to Home Screen" or "Install"</Text>
              <Text style={styles.note}>
                Note: Firefox has varying levels of PWA support across versions
              </Text>
            </View>
          </>
        );
      default:
        return (
          <Text style={styles.note}>
            Your browser may not fully support installing web apps. For the best experience, try Chrome or Edge.
          </Text>
        );
    }
  };

  return (
    <Card style={styles.container}>
      <Card.Content>
        <Text variant="titleMedium">Install Orbiting</Text>
        <Text variant="bodyMedium" style={styles.description}>
          Install this app on your device for quick access and improved performance
        </Text>
        
        {guideExpanded && (
          <View style={styles.guideContainer}>
            {renderInstallGuide()}
            <Button
              mode="text"
              onPress={handleLearnMore}
              style={styles.learnMoreButton}
            >
              Learn more about PWAs
            </Button>
          </View>
        )}
      </Card.Content>
      
      <Card.Actions>
        <Button
          mode="contained"
          onPress={handleInstallClick}
          icon={browserType === 'standard' ? "download" : "information-outline"}
        >
          {browserType === 'standard' ? 'Install App' : 'How to Install'}
        </Button>
        
        {guideExpanded && (
          <Button
            mode="outlined"
            onPress={() => setGuideExpanded(false)}
            style={styles.closeButton}
          >
            Close
          </Button>
        )}
      </Card.Actions>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
    marginBottom: 8,
  },
  description: {
    marginVertical: 8,
  },
  guideContainer: {
    marginTop: 16,
    padding: 12,
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 8,
  },
  guideTitle: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  steps: {
    marginTop: 8,
  },
  step: {
    marginBottom: 6,
    flexDirection: 'row',
    alignItems: 'center',
  },
  note: {
    fontStyle: 'italic',
    marginTop: 8,
    opacity: 0.8,
  },
  learnMoreButton: {
    marginTop: 12,
    alignSelf: 'flex-start',
  },
  closeButton: {
    marginLeft: 8,
  }
});
