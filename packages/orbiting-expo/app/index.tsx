import { Text, View, Pressable } from "react-native";
import { useRouter } from "expo-router";

export default function MainScreen() {
  const router = useRouter();

  return (
    <View
      testID="main-screen"
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text testID="main-text">Main Screen</Text>
      <Pressable
        testID="history-button"
        onPress={() => router.push("/history")}
        style={{
          marginTop: 20,
          padding: 10,
          backgroundColor: "#007AFF",
          borderRadius: 5,
        }}
      >
        <Text style={{ color: "white" }}>Go to History</Text>
      </Pressable>
    </View>
  );
}
