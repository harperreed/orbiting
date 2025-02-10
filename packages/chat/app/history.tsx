import { View, StyleSheet, FlatList, TouchableOpacity, Text, Alert } from 'react-native';
import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { StoredMessage, getMessages, clearHistory } from './utils/storage';

export default function HistoryScreen() {
  const [messages, setMessages] = useState<StoredMessage[]>([]);
  const router = useRouter();

  const loadMessages = useCallback(async () => {
    try {
      const loadedMessages = await getMessages();
      setMessages(loadedMessages.reverse()); // Show newest first
    } catch (error) {
      console.error('Failed to load messages:', error);
    }
  }, []);

  useEffect(() => {
    loadMessages();
  }, [loadMessages]);

  const handleClearHistory = useCallback(async () => {
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
              await clearHistory();
              setMessages([]);
              router.push('/');
            } catch (error) {
              console.error('Failed to clear history:', error);
            }
          },
        },
      ]
    );
  }, []);

  const renderItem = useCallback(({ item }: { item: StoredMessage }) => (
    <TouchableOpacity
      style={styles.messageItem}
      onPress={() => {
        router.push({ pathname: '/', params: { text: item.text } });
      }}
    >
      <Text style={styles.messageText} numberOfLines={2}>
        {item.text}
      </Text>
      <Text style={styles.timestamp}>
        {new Date(item.timestamp).toLocaleDateString()}
      </Text>
    </TouchableOpacity>
  ), [router]);

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
      />
      {messages.length > 0 && (
        <TouchableOpacity
          style={styles.clearButton}
          onPress={handleClearHistory}
        >
          <Text style={styles.clearButtonText}>Clear History</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  listContent: {
    padding: 16,
  },
  messageItem: {
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  messageText: {
    fontSize: 16,
    marginBottom: 4,
  },
  timestamp: {
    fontSize: 12,
    color: '#6c757d',
  },
  clearButton: {
    margin: 16,
    padding: 16,
    backgroundColor: '#dc3545',
    borderRadius: 8,
    alignItems: 'center',
  },
  clearButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
