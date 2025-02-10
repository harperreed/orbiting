import { View, StyleSheet } from "react-native";
import { useState, useCallback } from "react";
import BigTextDisplay from "./BigTextDisplay";
import { storeMessage } from "../utils/storage";

export default function HomeScreen() {
  const [text, setText] = useState("");

  const handleTextChange = useCallback(async (newText: string) => {
    setText(newText);
    try {
      await storeMessage(newText);
    } catch (error) {
      console.error('Failed to store message:', error);
    }
  }, []);

  return (
    <View style={styles.container}>
      <BigTextDisplay 
        text={text}
        onChangeText={handleTextChange}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
