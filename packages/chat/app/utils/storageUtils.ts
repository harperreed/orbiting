import AsyncStorage from '@react-native-async-storage/async-storage';

const MESSAGES_KEY = '@messages';

export interface StoredMessage {
  id: string;
  text: string;
  timestamp: number;
}

export async function storeMessage(text: string): Promise<void> {
  // Don't store empty or whitespace-only messages
  if (!text || !text.trim()) {
    return;
  }

  try {
    const { messages } = await getMessages(0, Number.MAX_SAFE_INTEGER);
    const newMessage: StoredMessage = {
      id: Date.now().toString(),
      text,
      timestamp: Date.now(),
    };
    
    messages.unshift(newMessage); // Add to beginning since we sort by newest first
    await AsyncStorage.setItem(MESSAGES_KEY, JSON.stringify(messages));
  } catch (error) {
    console.error('Error storing message:', error);
    throw error;
  }
}

interface GetMessagesOptions {
  cursor?: string;
  limit?: number;
  search?: string;
}

export async function getMessages({ 
  cursor, 
  limit = 20,
  search = ''
}: GetMessagesOptions = {}): Promise<{
  messages: StoredMessage[];
  nextCursor: string | null;
}> {
  try {
    const jsonValue = await AsyncStorage.getItem(MESSAGES_KEY);
    let messages = jsonValue ? JSON.parse(jsonValue) : [];
    
    // Filter by search term if provided
    if (search) {
      const searchLower = search.toLowerCase();
      messages = messages.filter(msg => 
        msg.text.toLowerCase().includes(searchLower)
      );
    }

    // Sort by timestamp descending
    messages.sort((a: StoredMessage, b: StoredMessage) => b.timestamp - a.timestamp);
    
    // Apply cursor-based pagination
    let startIndex = 0;
    if (cursor) {
      startIndex = messages.findIndex(msg => msg.id === cursor) + 1;
      if (startIndex === 0) {
        startIndex = messages.length; // Cursor not found, return empty
      }
    }
    
    const paginatedMessages = messages.slice(startIndex, startIndex + limit);
    const nextCursor = paginatedMessages.length === limit ? 
      paginatedMessages[paginatedMessages.length - 1].id : 
      null;
    
    return { 
      messages: paginatedMessages,
      nextCursor
    };
  } catch (error) {
    console.error('Error getting messages:', error);
    throw error;
  }
}

export async function clearHistory(): Promise<void> {
  try {
    await AsyncStorage.setItem(MESSAGES_KEY, JSON.stringify([]));
  } catch (error) {
    console.error('Error clearing history:', error);
    throw error;
  }
}

export async function deleteMessage(id: string): Promise<void> {
  try {
    const messages = await getMessages(0, Number.MAX_SAFE_INTEGER);
    const filteredMessages = messages.messages.filter(msg => msg.id !== id);
    await AsyncStorage.setItem(MESSAGES_KEY, JSON.stringify(filteredMessages));
  } catch (error) {
    console.error('Error deleting message:', error);
    throw error;
  }
}
