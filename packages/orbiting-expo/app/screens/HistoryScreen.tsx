import { View, Text, StyleSheet } from 'react-native';

export default function HistoryScreen() {
  return (
    <View testID="history-screen" style={styles.container}>
      <Text>History Screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
