import { useState, useEffect } from "react";
import { Text, View, Pressable, TextInput, StyleSheet, Modal } from "react-native";
import { useRouter } from "expo-router";
import { saveMessage, isFirstLaunch } from "../utils/storage";

export default function MainScreen() {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);

  useEffect(() => {
    // @ts-ignore - router.current is available in Expo Router
    const restoredMessage = router.current?.params?.restoredMessage;
    if (restoredMessage) {
      setMessage(restoredMessage);
    }
  }, []);

  useEffect(() => {
    const checkFirstLaunch = async () => {
      const isFirst = await isFirstLaunch();
      if (isFirst) {
        setShowWelcomeModal(true);
      }
    };
    checkFirstLaunch();
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
        <Pressable
          testID="help-button"
          onPress={() => setShowHelpModal(true)}
          style={[styles.button, styles.helpButton]}
        >
          <Text style={styles.buttonText}>Help</Text>
        </Pressable>
      </View>

      <Modal
        testID="help-modal"
        visible={showHelpModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowHelpModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Help</Text>
            <Text style={styles.modalText}>
              • Type your message in the text box{'\n'}
              • Press "Save Message" to store it{'\n'}
              • View your message history anytime{'\n'}
              • Tap any history item to restore it
            </Text>
            <Pressable
              testID="close-help-modal"
              onPress={() => setShowHelpModal(false)}
              style={styles.modalButton}
            >
              <Text style={styles.buttonText}>Got it!</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      <Modal
        testID="welcome-modal"
        visible={showWelcomeModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowWelcomeModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Welcome to Orbiting!</Text>
            <Text style={styles.modalText}>
              This app helps you save and manage your messages.{'\n\n'}
              Get started by typing a message and saving it.{'\n\n'}
              You can access help anytime by tapping the Help button.
            </Text>
            <Pressable
              testID="close-welcome-modal"
              onPress={() => setShowWelcomeModal(false)}
              style={styles.modalButton}
            >
              <Text style={styles.buttonText}>Let's Start!</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
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
  helpButton: {
    backgroundColor: "#5856D6",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    width: "80%",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
    lineHeight: 24,
    textAlign: "left",
  },
  modalButton: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 5,
    width: "100%",
    alignItems: "center",
  },
});
