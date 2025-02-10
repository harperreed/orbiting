import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import { useState, useCallback } from "react";
import { useRouter } from "expo-router";
import BigTextDisplay from "./BigTextDisplay";
import { storeMessage } from "../utils/storage";

export default function HomeScreen() {
  const [text, setText] = useState("");
  const router = useRouter();

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
      <TouchableOpacity
        style={styles.historyButton}
        onPress={() => router.push("/history")}
      >
        <Text style={styles.historyButtonText}>View History</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  historyButton: {
    position: 'absolute',
    bottom: 40,
    right: 20,
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 25,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  historyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
