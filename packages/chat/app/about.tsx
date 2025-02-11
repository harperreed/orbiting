import { StyleSheet } from 'react-native';
import { View, Text } from 'react-native-ui-lib';
import PageLayout from './components/PageLayout';

export default function AboutScreen() {
  return (
    <PageLayout>
      <View style={styles.centered} bg-surface>
        <Text text40 style={styles.title}>About</Text>
        
        <Text text65 style={styles.paragraph}>
          Orbiting was created by Christine Sun Kim and Harper Reed. It was inspired by the need to communicate with people in the same space, but with different communications needs.
        </Text>

        <Text text65 style={styles.paragraph}>
          Please send us feedback. We want it!{'\n'}
          <Text text65 style={styles.email}>feedback@orbiting.com</Text>
        </Text>
      </View>
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
