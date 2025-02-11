import { StyleSheet, View, Platform } from 'react-native';
import { Text, Button, List, ActivityIndicator, Surface, useTheme, Portal, Dialog } from 'react-native-paper';
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
  const [showClearDialog, setShowClearDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [messageToDelete, setMessageToDelete] = useState<string | null>(null);
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
  
  const handleClearHistory = useCallback(() => {
    setShowClearDialog(true);
  }, []);

  const handleConfirmClear = useCallback(async () => {
    try {
      await clearHistory();
      await clearText();
      setMessages([]);
      setHasMore(false);
      setPage(0);
    } catch (error) {
      console.error('Failed to clear history:', error);
    } finally {
      setShowClearDialog(false);
    }
  }, [clearText]);

  const handleDeleteMessage = useCallback((id: string) => {
    setMessageToDelete(id);
    setShowDeleteDialog(true);
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    if (messageToDelete) {
      try {
        await deleteMessage(messageToDelete);
        await loadMessages(0);
      } catch (error) {
        console.error('Failed to delete message:', error);
      } finally {
        setShowDeleteDialog(false);
        setMessageToDelete(null);
      }
    }
  }, [messageToDelete, loadMessages]);

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

  return (
    <>
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

      <Portal>
        <Dialog visible={showClearDialog} onDismiss={() => setShowClearDialog(false)}>
          <Dialog.Title>Clear History</Dialog.Title>
          <Dialog.Content>
            <Text>Are you sure you want to clear all messages?</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowClearDialog(false)}>Cancel</Button>
            <Button onPress={handleConfirmClear} textColor={theme.colors.error}>Clear</Button>
          </Dialog.Actions>
        </Dialog>

        <Dialog visible={showDeleteDialog} onDismiss={() => setShowDeleteDialog(false)}>
          <Dialog.Title>Delete Message</Dialog.Title>
          <Dialog.Content>
            <Text>Are you sure you want to delete this message?</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowDeleteDialog(false)}>Cancel</Button>
            <Button onPress={handleConfirmDelete} textColor={theme.colors.error}>Delete</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </>
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
