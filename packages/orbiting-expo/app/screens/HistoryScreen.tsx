import { View, Text, StyleSheet, FlatList, Pressable, Button, Alert } from 'react-native';
import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { getMessages, clearMessages } from '../../utils/storage';

export default function HistoryScreen() {
  const [messages, setMessages] = useState([]);
  const router = useRouter();

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    try {
      const storedMessages = await getMessages();
      setMessages(storedMessages);
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const handleMessagePress = (message) => {
    router.push({ pathname: '/', params: { message: message.text } });
  };

  const handleClearHistory = () => {
    Alert.alert(
      'Clear History',
      'Are you sure you want to clear all messages?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            try {
              await clearMessages();
              setMessages([]);
            } catch (error) {
              console.error('Error clearing messages:', error);
            }
          },
        },
      ]
    );
  };

  const renderItem = ({ item }) => (
    <Pressable
      testID="message-item"
      style={styles.messageItem}
      onPress={() => handleMessagePress(item)}
    >
      <Text numberOfLines={2}>{item.text}</Text>
      <Text style={styles.timestamp}>
        {new Date(item.timestamp).toLocaleDateString()}
      </Text>
    </Pressable>
  );

  return (
    <View testID="history-screen" style={styles.container}>
      {messages.length > 0 ? (
        <FlatList
          data={messages}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          testID="message-list"
        />
      ) : (
        <Text testID="empty-message">No messages in history</Text>
      )}
      <Button
        testID="clear-history-button"
        title="Clear History"
        onPress={handleClearHistory}
      />
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
    borderBottomColor: '#ccc',
  },
  timestamp: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
});
