import { Text, StyleSheet, View } from 'react-native';
import PageLayout from './components/PageLayout';

export default function AboutScreen() {
  return (
    <PageLayout>
      <View style={styles.centered}>
        <Text style={styles.title}>About</Text>
      </View>
    </PageLayout>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});
