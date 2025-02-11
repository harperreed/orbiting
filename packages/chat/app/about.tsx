import { StyleSheet } from 'react-native';
import { Surface, Text } from 'react-native-paper';
import PageLayout from './components/PageLayout';

export default function AboutScreen() {
  return (
    <PageLayout>
      <Surface style={styles.centered} elevation={1}>
        <Text variant="displaySmall" style={styles.title}>About</Text>
        
        <Text variant="bodyLarge" style={styles.paragraph}>
          Orbiting was created by Christine Sun Kim and Harper Reed. It was inspired by the need to communicate with people in the same space, but with different communications needs.
        </Text>

        <Text variant="bodyLarge" style={styles.paragraph}>
          Please send us feedback. We want it!{'\n'}
          <Text variant="bodyLarge" style={styles.email}>feedback@orbiting.com</Text>
        </Text>
      </Surface>
    </PageLayout>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    marginBottom: 24,
  },
  paragraph: {
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 24,
  },
  email: {
    textDecorationLine: 'underline',
  },
});
