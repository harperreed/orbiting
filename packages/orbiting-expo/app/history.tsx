import { useState, useEffect } from "react";
import { Text, View, FlatList, Pressable, StyleSheet, Alert } from "react-native";
import { useRouter } from "expo-router";
import { getMessages, clearMessages, type Message } from "../utils/storage";

export default function HistoryScreen() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    try {
      const storedMessages = await getMessages();
      setMessages(storedMessages);
    } catch (error) {
      console.error("Failed to load messages:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMessagePress = (message: Message) => {
    router.push({
      pathname: "/",
      params: { restoredMessage: message.text }
    });
  };

  const handleClearHistory = () => {
    Alert.alert(
      "Clear History",
      "Are you sure you want to clear all messages? This cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear",
          style: "destructive",
          onPress: async () => {
            try {
              await clearMessages();
              setMessages([]);
            } catch (error) {
              console.error("Failed to clear messages:", error);
            }
          }
        }
      ]
    );
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text>Loading messages...</Text>
      </View>
    );
  }

  return (
    <View testID="history-screen" style={styles.container}>
      <FlatList
        testID="message-list"
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Pressable
            testID={`message-${item.id}`}
            style={styles.messageItem}
            onPress={() => handleMessagePress(item)}
          >
            <Text style={styles.messageText}>{item.text}</Text>
            <Text style={styles.timestamp}>
              {new Date(item.timestamp).toLocaleString()}
            </Text>
          </Pressable>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No messages in history</Text>
        }
      />
      
      <Pressable
        testID="clear-history-button"
        style={styles.clearButton}
        onPress={handleClearHistory}
      >
        <Text style={styles.clearButtonText}>Clear History</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  messageItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  messageText: {
    fontSize: 16,
    marginBottom: 5,
  },
  timestamp: {
    fontSize: 12,
    color: "#666",
  },
  emptyText: {
    textAlign: "center",
    marginTop: 20,
    color: "#666",
  },
  clearButton: {
    backgroundColor: "#ff4444",
    padding: 15,
    borderRadius: 5,
    marginTop: 20,
  },
  clearButtonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "500",
  },
});
