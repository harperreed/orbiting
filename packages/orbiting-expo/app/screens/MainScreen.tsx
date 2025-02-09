import { View, Text, StyleSheet } from 'react-native';

export default function MainScreen() {
  return (
    <View testID="main-screen" style={styles.container}>
      <Text>Main Screen</Text>
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
