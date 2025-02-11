import { StyleSheet } from 'react-native';
import { Surface, Text } from 'react-native-paper';
import PageLayout from './components/PageLayout';

export default function AboutScreen() {
  return (
    <PageLayout>
      <Surface style={styles.centered} elevation={1}>
        <Text variant="displaySmall">About</Text>
      </Surface>
    </PageLayout>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
