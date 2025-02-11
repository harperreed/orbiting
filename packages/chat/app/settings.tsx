import { Text, StyleSheet, View, Switch, Pressable } from 'react-native';
import { Picker } from '@react-native-picker/picker';
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
      <View style={styles.container}>
        <Text style={styles.title}>Settings</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Appearance</Text>
          
          <View style={styles.setting}>
            <Text style={styles.label}>Color Scheme</Text>
            <Picker
              selectedValue={colorScheme}
              style={styles.picker}
              onValueChange={(value) => updateSettings({ colorScheme: value })}
            >
              {COLOR_SCHEMES.map((scheme) => (
                <Picker.Item
                  key={scheme.value}
                  label={scheme.label}
                  value={scheme.value}
                />
              ))}
            </Picker>
          </View>

          <View style={styles.setting}>
            <Text style={styles.label}>Starting Font Size</Text>
            <Picker
              selectedValue={startingFontSize}
              style={styles.picker}
              onValueChange={(value) => updateSettings({ startingFontSize: value })}
            >
              {FONT_SIZES.map((size) => (
                <Picker.Item
                  key={size}
                  label={`${size}px`}
                  value={size}
                />
              ))}
            </Picker>
          </View>

          <View style={styles.setting}>
            <Text style={styles.label}>Theme</Text>
            <Picker
              selectedValue={theme}
              style={styles.picker}
              onValueChange={(value) => updateSettings({ theme: value })}
            >
              {THEMES.map((theme) => (
                <Picker.Item
                  key={theme.value}
                  label={theme.label}
                  value={theme.value}
                />
              ))}
            </Picker>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Gestures</Text>
          
          <View style={styles.setting}>
            <Text style={styles.label}>Shake to Clear</Text>
            <Switch
              value={shakeEnabled}
              onValueChange={(value) => updateSettings({ shakeEnabled: value })}
            />
          </View>

          <View style={styles.setting}>
            <Text style={styles.label}>Shake to Flash</Text>
            <Switch
              value={shakeFlashEnabled}
              onValueChange={(value) => updateSettings({ shakeFlashEnabled: value })}
            />
          </View>
        </View>

        <Pressable
          style={styles.resetButton}
          onPress={resetSettings}
        >
          <Text style={styles.resetButtonText}>Reset to Defaults</Text>
        </Pressable>
      </View>
    </PageLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
  setting: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    flex: 1,
  },
  picker: {
    flex: 2,
  },
  resetButton: {
    backgroundColor: '#ff6b6b',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  resetButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
