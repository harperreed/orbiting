import { useState, useEffect } from "react";
import { Text, View, Pressable, TextInput, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { saveMessage } from "../utils/storage";

export default function MainScreen() {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    // @ts-ignore - router.current is available in Expo Router
    const restoredMessage = router.current?.params?.restoredMessage;
    if (restoredMessage) {
      setMessage(restoredMessage);
    }
  }, []);

  const handleSave = async () => {
    if (!message.trim()) return;
    
    setIsSaving(true);
    try {
      await saveMessage(message);
      setMessage(""); // Clear input after successful save
    } catch (error) {
      console.error("Failed to save message:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <View
      testID="main-screen"
      style={styles.container}
    >
      <TextInput
        testID="message-input"
        value={message}
        onChangeText={setMessage}
        placeholder="Type your message..."
        style={styles.input}
        multiline
      />
      
      <View style={styles.buttonContainer}>
        <Pressable
          testID="save-button"
          onPress={handleSave}
          disabled={isSaving || !message.trim()}
          style={[styles.button, styles.saveButton]}
        >
          <Text style={styles.buttonText}>
            {isSaving ? "Saving..." : "Save Message"}
          </Text>
        </Pressable>

        <Pressable
          testID="history-button"
          onPress={() => router.push("/history")}
          style={[styles.button, styles.historyButton]}
        >
          <Text style={styles.buttonText}>View History</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
    minHeight: 100,
  },
  buttonContainer: {
    gap: 10,
  },
  button: {
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  saveButton: {
    backgroundColor: "#4CAF50",
  },
  historyButton: {
    backgroundColor: "#007AFF",
  },
  buttonText: {
    color: "white",
    fontWeight: "500",
  },
});
