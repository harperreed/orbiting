import { Text, View } from "react-native";

export default function Index() {
  return (
    <View
      testID="main-container"
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text testID="welcome-text">Edit app/index.tsx to edit this screen.</Text>
    </View>
  );
}
