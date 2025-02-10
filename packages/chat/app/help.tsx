import { View, Text, StyleSheet, ScrollView } from 'react-native';

export default function HelpScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.title}>How to Use</Text>
        <Text style={styles.text}>
          • Type or paste your text in the main screen{'\n'}
          • Text will automatically adjust its size to fit{'\n'}
          • All text is automatically saved{'\n'}
          • Access your saved messages in History tab
        </Text>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.title}>Features</Text>
        <Text style={styles.text}>
          • Auto-scaling text size{'\n'}
          • Message history{'\n'}
          • Quick message recall{'\n'}
          • Automatic saving
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.title}>Tips</Text>
        <Text style={styles.text}>
          • Tap any message in History to load it{'\n'}
          • Use Clear History to remove all saved messages{'\n'}
          • Text wraps automatically on whitespace
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  section: {
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  text: {
    fontSize: 16,
    lineHeight: 24,
    color: '#666',
  },
});
