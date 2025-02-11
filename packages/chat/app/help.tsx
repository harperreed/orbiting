import { StyleSheet } from 'react-native';
import { Surface, Text } from 'react-native-paper';
import PageLayout from './components/PageLayout';

export default function HelpScreen() {
  return (
    <PageLayout scrollable>
      <Surface style={styles.section} elevation={0}>
        <Text variant="headlineSmall" style={styles.title}>How to Use</Text>
        <Text variant="bodyLarge" style={styles.text}>
          • Type or paste your text in the main screen{'\n'}
          • Text will automatically adjust its size to fit{'\n'}
          • All text is automatically saved{'\n'}
          • Switch tabs to access History or Help
        </Text>
      </View>
      
      <Surface style={styles.section} elevation={0}>
        <Text variant="headlineSmall" style={styles.title}>Features</Text>
        <Text variant="bodyLarge" style={styles.text}>
          • Auto-scaling text size{'\n'}
          • Message history{'\n'}
          • Quick message recall{'\n'}
          • Automatic saving
        </Text>
      </View>

      <Surface style={styles.section} elevation={0}>
        <Text variant="headlineSmall" style={styles.title}>Tips</Text>
        <Text variant="bodyLarge" style={styles.text}>
          • Tap any message in History to load it{'\n'}
          • Use Clear History to remove all saved messages{'\n'}
          • Text wraps automatically on whitespace
        </Text>
      </View>
    </PageLayout>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 30,
    padding: 16,
  },
  title: {
    marginBottom: 15,
  },
  text: {
    lineHeight: 24,
  },
});
