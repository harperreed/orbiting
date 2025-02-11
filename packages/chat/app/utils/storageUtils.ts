import AsyncStorage from '@react-native-async-storage/async-storage';

const MESSAGES_KEY = '@messages';

export interface StoredMessage {
  id: string;
  text: string;
  timestamp: number;
}

export async function storeMessage(text: string): Promise<void> {
  try {
    const messages = await getMessages();
    const newMessage: StoredMessage = {
      id: Date.now().toString(),
      text,
      timestamp: Date.now(),
    };
    
    messages.push(newMessage);
    await AsyncStorage.setItem(MESSAGES_KEY, JSON.stringify(messages));
  } catch (error) {
    console.error('Error storing message:', error);
    throw error;
  }
}

export async function getMessages(page = 0, pageSize = 20): Promise<{
  messages: StoredMessage[];
  hasMore: boolean;
}> {
  try {
    const jsonValue = await AsyncStorage.getItem(MESSAGES_KEY);
    const allMessages = jsonValue ? JSON.parse(jsonValue) : [];
    
    // Sort messages by timestamp in descending order
    const sortedMessages = allMessages.sort((a: StoredMessage, b: StoredMessage) => 
      b.timestamp - a.timestamp
    );
    
    const start = page * pageSize;
    const messages = sortedMessages.slice(start, start + pageSize);
    const hasMore = start + pageSize < sortedMessages.length;
    
    return { messages, hasMore };
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
