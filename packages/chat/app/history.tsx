import { StyleSheet, TouchableOpacity, Text, Alert, ActivityIndicator, View } from 'react-native';
import PageLayout from './components/PageLayout';
import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { StoredMessage, getMessages, clearHistory, deleteMessage } from './utils/storageUtils';
import { FlashList } from '@shopify/flash-list';

export default function HistoryScreen() {
  const [messages, setMessages] = useState<StoredMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const router = useRouter();

  const loadMessages = useCallback(async (pageNum: number, append = false) => {
    try {
      if (pageNum === 0) {
        setIsLoading(true);
      } else {
        setIsLoadingMore(true);
      }

      const { messages: newMessages, hasMore: more } = await getMessages(pageNum);
      
      setMessages(prev => 
        append ? [...prev, ...newMessages] : newMessages
      );
      setHasMore(more);
      setPage(pageNum);
    } catch (error) {
      console.error('Failed to load messages:', error);
      Alert.alert('Error', 'Failed to load messages');
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  }, []);

  useEffect(() => {
    loadMessages(0);
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
              setHasMore(false);
              setPage(0);
            } catch (error) {
              console.error('Failed to clear history:', error);
              Alert.alert('Error', 'Failed to clear history');
            }
          },
        },
      ]
    );
  }, []); // Remove loadMessages from dependencies as it's not used in the function

  const handleDeleteMessage = useCallback(async (id: string) => {
    Alert.alert(
      'Delete Message',
      'Are you sure you want to delete this message?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteMessage(id);
              await loadMessages(0);
            } catch (error) {
              console.error('Failed to delete message:', error);
              Alert.alert('Error', 'Failed to delete message');
            }
          },
        },
      ]
    );
  }, [loadMessages]);

  const renderItem = useCallback(({ item }: { item: StoredMessage }) => (
    <TouchableOpacity
      style={styles.messageItem}
      onPress={() => {
        router.push({ pathname: '/', params: { text: item.text } });
      }}
      onLongPress={() => handleDeleteMessage(item.id)}
    >
      <Text style={styles.messageText} numberOfLines={2}>
        {item.text}
      </Text>
      <Text style={styles.timestamp}>
        {new Date(item.timestamp).toLocaleDateString()}
      </Text>
    </TouchableOpacity>
  ), [router, handleDeleteMessage]);

  if (isLoading) {
    return (
      <PageLayout>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" />
        </View>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <FlashList
        data={messages}
        renderItem={renderItem}
        estimatedItemSize={80}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        onEndReached={() => {
          if (hasMore && !isLoadingMore) {
            loadMessages(page + 1, true);
          }
        }}
        onEndReachedThreshold={0.5}
        ListFooterComponent={() => 
          isLoadingMore ? (
            <View style={styles.loadingMore}>
              <ActivityIndicator size="small" />
            </View>
          ) : null
        }
      />
      {messages.length > 0 && (
        <TouchableOpacity
          style={styles.clearButton}
          onPress={handleClearHistory}
        >
          <Text style={styles.clearButtonText}>Clear History</Text>
        </TouchableOpacity>
      )}
    </PageLayout>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingMore: {
    padding: 16,
    alignItems: 'center',
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
