import { StyleSheet, View, Dimensions } from 'react-native';
import { Text, Switch, Button, List, Surface, useTheme, Portal, Modal, TouchableRipple } from 'react-native-paper';
import { useState } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import PageLayout from './components/PageLayout';
import { useSettings } from './context/SettingsContext';
import type { ThemeType } from './context/SettingsContext';

const FONT_SIZES = [16, 18, 20, 24, 28, 32, 36, 40];
const MIN_FONT_SIZE = Math.min(...FONT_SIZES);
const MAX_FONT_SIZE = Math.max(...FONT_SIZES);

import { THEMES } from './themes';

const COLOR_SCHEMES = [
  { label: 'System', value: 'system', icon: 'theme-light-dark' },
  { label: 'Light', value: 'light', icon: 'white-balance-sunny' },
  { label: 'Dark', value: 'dark', icon: 'moon-waning-crescent' },
];

const ThemeSelector = ({ theme, onSelect }: { theme: ThemeType; onSelect: (theme: ThemeType) => void }) => {
  const [visible, setVisible] = useState(false);
  const paperTheme = useTheme();
  const currentTheme = THEMES.find(t => t.value === theme)!;

  return (
    <>
      <TouchableRipple onPress={() => setVisible(true)}>
        <View style={styles.themePreview}>
          <View style={[styles.themeColor, { backgroundColor: currentTheme.colors.primary }]} />
          <View style={[styles.themeColor, { backgroundColor: currentTheme.colors.secondary }]} />
          <Text>{currentTheme.label}</Text>
        </View>
      </TouchableRipple>
      
      <Portal>
        <Modal visible={visible} onDismiss={() => setVisible(false)} contentContainerStyle={styles.modal}>
          <Surface style={styles.themeGrid}>
            {THEMES.map((t) => (
              <TouchableRipple
                key={t.value}
                onPress={() => {
                  onSelect(t.value);
                  setVisible(false);
                }}
              >
                <View style={[
                  styles.themeOption,
                  theme === t.value && { borderColor: paperTheme.colors.primary, borderWidth: 2 }
                ]}>
                  <View style={[styles.themeColor, { backgroundColor: t.colors.primary }]} />
                  <View style={[styles.themeColor, { backgroundColor: t.colors.secondary }]} />
                  <Text>{t.label}</Text>
                </View>
              </TouchableRipple>
            ))}
          </Surface>
        </Modal>
      </Portal>
    </>
  );
};

export default function SettingsScreen() {
  const {
    colorScheme,
    startingFontSize,
    theme,
    shakeEnabled,
    shakeFlashEnabled,
    updateSettings,
    resetSettings,
  } = useSettings();
  const [isResetting, setIsResetting] = useState(false);
  const paperTheme = useTheme();

  const handleReset = async () => {
    setIsResetting(true);
    await resetSettings();
    setIsResetting(false);
  };

  return (
    <PageLayout scrollable>
      <Surface style={styles.container}>
        <Text variant="headlineMedium" style={styles.title}>Settings</Text>

        <List.Section>
          <List.Subheader>Appearance</List.Subheader>
          
          <List.Item
            title="Color Scheme"
            description="Choose your preferred color scheme"
            left={props => (
              <List.Icon
                {...props}
                icon={COLOR_SCHEMES.find(scheme => scheme.value === colorScheme)?.icon}
              />
            )}
            right={props => (
              <View style={styles.colorSchemeContainer}>
                {COLOR_SCHEMES.map((scheme) => (
                  <TouchableRipple
                    key={scheme.value}
                    onPress={() => updateSettings({ colorScheme: scheme.value })}
                    style={styles.colorSchemeButton}
                  >
                    <MaterialCommunityIcons
                      name={scheme.icon}
                      size={24}
                      color={colorScheme === scheme.value ? paperTheme.colors.primary : paperTheme.colors.onSurfaceVariant}
                    />
                  </TouchableRipple>
                ))}
              </View>
            )}
          />

          <List.Item
            title="Starting Font Size"
            description={`${startingFontSize}px`}
            left={props => <List.Icon {...props} icon="format-size" />}
          />
          <View style={styles.sliderContainer}>
            <Slider
              style={styles.slider}
              value={startingFontSize}
              minimumValue={MIN_FONT_SIZE}
              maximumValue={MAX_FONT_SIZE}
              step={1}
              onValueChange={(value) => updateSettings({ startingFontSize: value })}
              minimumTrackTintColor={paperTheme.colors.primary}
              maximumTrackTintColor={paperTheme.colors.onSurfaceVariant}
            />
            <View style={styles.sliderMarks}>
              {FONT_SIZES.map((size) => (
                <Text key={size} style={styles.sliderMark}>{size}</Text>
              ))}
            </View>
          </View>

          <List.Item
            title="Theme"
            description="Choose your preferred theme"
            left={props => <List.Icon {...props} icon="palette" />}
          />
          <View style={styles.themeContainer}>
            <ThemeSelector theme={theme} onSelect={(value) => updateSettings({ theme: value })} />
          </View>
        </List.Section>

        <List.Section>
          <List.Subheader>Gestures</List.Subheader>
          
          <List.Item
            title="Shake to Clear"
            right={() => (
              <Switch
                value={shakeEnabled}
                onValueChange={(value) => updateSettings({ shakeEnabled: value })}
              />
            )}
          />

          <List.Item
            title="Shake to Flash"
            right={() => (
              <Switch
                value={shakeFlashEnabled}
                onValueChange={(value) => updateSettings({ shakeFlashEnabled: value })}
              />
            )}
          />
        </List.Section>

        <Button
          loading={isResetting}
          mode="contained"
          onPress={handleReset}
          style={styles.resetButton}
          buttonColor={paperTheme.colors.error}
        >
          Reset to Defaults
        </Button>
      </Surface>
    </PageLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    marginBottom: 24,
  },
  resetButton: {
    margin: 16,
  },
  colorSchemeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  colorSchemeButton: {
    padding: 8,
    borderRadius: 20,
  },
  sliderContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  sliderMarks: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  sliderMark: {
    fontSize: 12,
    color: 'gray',
  },
  themeContainer: {
    padding: 16,
  },
  themePreview: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  themeColor: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  modal: {
    padding: 20,
    margin: 20,
  },
  themeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    padding: 16,
    borderRadius: 8,
  },
  themeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderWidth: 2,
    borderColor: 'transparent',
  },
});
