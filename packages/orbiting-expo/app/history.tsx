import { Text, View } from "react-native";

export default function HistoryScreen() {
  return (
    <View
      testID="history-screen"
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text testID="history-text">History Screen</Text>
    </View>
  );
}
