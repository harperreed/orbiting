import AsyncStorage from '@react-native-async-storage/async-storage';
import { getMessages, saveMessage } from '../../utils/storage';

jest.mock('@react-native-async-storage/async-storage');

describe('Storage Utils', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return empty array when no messages exist', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
    const messages = await getMessages();
    expect(messages).toEqual([]);
  });

  it('should save and retrieve a message', async () => {
    const mockMessage = 'Test message';
    const savedMessage = await saveMessage(mockMessage);
    
    expect(savedMessage.text).toBe(mockMessage);
    expect(savedMessage.id).toBeTruthy();
    expect(savedMessage.timestamp).toBeTruthy();
    
    // Verify storage was called with correct data
    expect(AsyncStorage.setItem).toHaveBeenCalled();
    const setItemCall = (AsyncStorage.setItem as jest.Mock).mock.calls[0];
    const savedData = JSON.parse(setItemCall[1]);
    expect(savedData[0].text).toBe(mockMessage);
  });

  it('should maintain message order newest first', async () => {
    const existingMessages = [
      { id: '1', text: 'old message', timestamp: 1000 }
    ];
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(existingMessages));
    
    const newMessage = await saveMessage('new message');
    
    // Verify new message was added to start of array
    const setItemCall = (AsyncStorage.setItem as jest.Mock).mock.calls[0];
    const savedData = JSON.parse(setItemCall[1]);
    expect(savedData[0].id).toBe(newMessage.id);
    expect(savedData[1].id).toBe('1');
  });
});
