import { StyleSheet, View } from 'react-native';
import { Text, Switch, Button, List, Surface, SegmentedButtons } from 'react-native-paper';
import PageLayout from './components/PageLayout';
import { useSettings } from './context/SettingsContext';
import type { ThemeType } from './context/SettingsContext';

const FONT_SIZES = [16, 18, 20, 24, 28, 32, 36, 40];
const THEMES: { label: string; value: ThemeType }[] = [
  { label: 'Classic', value: 'classic' },
  { label: 'Ocean', value: 'ocean' },
  { label: 'Forest', value: 'forest' },
  { label: 'Sunset', value: 'sunset' },
];
const COLOR_SCHEMES = [
  { label: 'System', value: 'system' },
  { label: 'Light', value: 'light' },
  { label: 'Dark', value: 'dark' },
];

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

  return (
    <PageLayout scrollable>
      <Surface style={styles.container}>
        <Text variant="headlineMedium" style={styles.title}>Settings</Text>

        <List.Section>
          <List.Subheader>Appearance</List.Subheader>
          
          <List.Item
            title="Color Scheme"
            description={
              <SegmentedButtons
                value={colorScheme}
                onValueChange={(value) => updateSettings({ colorScheme: value })}
                buttons={COLOR_SCHEMES.map((scheme) => ({
                  value: scheme.value,
                  label: scheme.label,
                }))}
              />
            }
            descriptionNumberOfLines={2}
            descriptionStyle={styles.segmentedButtonContainer}
          />

          <List.Item
            title="Starting Font Size"
            description={
              <SegmentedButtons
                value={startingFontSize.toString()}
                onValueChange={(value) => updateSettings({ startingFontSize: parseInt(value, 10) })}
                buttons={FONT_SIZES.map((size) => ({
                  value: size.toString(),
                  label: `${size}px`,
                }))}
              />
            }
            descriptionNumberOfLines={2}
            descriptionStyle={styles.segmentedButtonContainer}
          />

          <List.Item
            title="Theme"
            description={
              <SegmentedButtons
                value={theme}
                onValueChange={(value) => updateSettings({ theme: value as ThemeType })}
                buttons={THEMES.map((theme) => ({
                  value: theme.value,
                  label: theme.label,
                }))}
              />
            }
            descriptionNumberOfLines={2}
            descriptionStyle={styles.segmentedButtonContainer}
          />
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
          mode="contained"
          onPress={resetSettings}
          style={styles.resetButton}
          buttonColor="#ff6b6b"
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
  segmentedButtonContainer: {
    marginTop: 8,
  },
  resetButton: {
    margin: 16,
  },
});
