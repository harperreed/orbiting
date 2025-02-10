import { View, TextInput, StyleSheet } from "react-native";
import { useState } from "react";
import BigTextDisplay from "./BigTextDisplay";

export default function HomeScreen() {
  const [text, setText] = useState("Hello Orbiting!");

  return (
    <View style={styles.container}>
      <BigTextDisplay text={text} />
      <TextInput
        style={styles.input}
        value={text}
        onChangeText={setText}
        placeholder="Type something..."
        testID="text-input"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 20,
  },
  input: {
    width: "80%",
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginTop: 20,
  },
});
