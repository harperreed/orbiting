import { StyleSheet, Alert, View, Platform } from 'react-native';
import { Text, Button, List, ActivityIndicator, Surface, useTheme, Portal } from 'react-native-paper';
import PageLayout from './components/PageLayout';
import { useCallback, useEffect, useState } from 'react';
import { useText } from './context/TextContext';
import { useRouter } from 'expo-router';
import { StoredMessage, getMessages, clearHistory, deleteMessage } from './utils/storageUtils';
import { FlashList } from '@shopify/flash-list';

export default function HistoryScreen() {
  const theme = useTheme();
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

  const { clearText } = useText();
  
  const handleClearHistory = useCallback(async () => {
    console.log('Clear history pressed');
    
    // For web environment, use window.confirm instead of Alert
    if (Platform.OS === 'web') {
        const confirmed = window.confirm('Are you sure you want to clear all messages?');
        if (confirmed) {
            try {
                await clearHistory();
                await clearText();
                setMessages([]);
                setHasMore(false);
                setPage(0);
            } catch (error) {
                console.error('Failed to clear history:', error);
                window.alert('Failed to clear history');
            }
        }
    } else {
        // Use React Native Alert for native platforms
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
                            await clearText();
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
    }
  }, [clearText, clearHistory]);

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
    <List.Item
      title={item.text}
      description={new Date(item.timestamp).toLocaleDateString()}
      onPress={() => {
        router.push({ pathname: '/', params: { text: item.text } });
      }}
      onLongPress={() => handleDeleteMessage(item.id)}
      titleNumberOfLines={2}
      descriptionStyle={styles.timestamp}
    />
  ), [router, handleDeleteMessage]);

  if (isLoading) {
    return (
      <PageLayout>
        <Portal>
          <Surface style={styles.loadingContainer}>
            <ActivityIndicator size="large" />
          </Surface>
        </Portal>
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
            <Portal>
              <Surface style={styles.loadingMore}>
                <ActivityIndicator size="small" />
              </Surface>
            </Portal>
          ) : null
        }
      />
      {messages.length > 0 && (
        <Button
          mode="contained"
          onPress={handleClearHistory}
          style={styles.clearButton}
          buttonColor={theme.colors.error}
        >
          Clear History
        </Button>
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
  timestamp: {
    fontSize: 12,
  },
  clearButton: {
    margin: 16,
  },
});
