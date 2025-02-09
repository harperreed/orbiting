import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Alert } from 'react-native';
import HistoryScreen from '../../app/history';
import { getMessages, clearMessages } from '../../utils/storage';

jest.mock('../../utils/storage');
jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

jest.spyOn(Alert, 'alert');

describe('HistoryScreen', () => {
  const mockMessages = [
    { id: '1', text: 'Test message 1', timestamp: Date.now() },
    { id: '2', text: 'Test message 2', timestamp: Date.now() - 1000 },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    (getMessages as jest.Mock).mockResolvedValue(mockMessages);
  });

  it('renders messages from storage', async () => {
    const { getByTestId, findByText } = render(<HistoryScreen />);
    
    expect(getByTestId('history-screen')).toBeTruthy();
    await findByText('Test message 1');
    await findByText('Test message 2');
  });

  it('shows empty state when no messages exist', async () => {
    (getMessages as jest.Mock).mockResolvedValue([]);
    const { findByText } = render(<HistoryScreen />);
    
    await findByText('No messages in history');
  });

  it('confirms before clearing history', async () => {
    const { getByTestId } = render(<HistoryScreen />);
    
    fireEvent.press(getByTestId('clear-history-button'));
    
    expect(Alert.alert).toHaveBeenCalledWith(
      'Clear History',
      expect.any(String),
      expect.arrayContaining([
        expect.objectContaining({ text: 'Cancel' }),
        expect.objectContaining({ text: 'Clear' }),
      ])
    );
  });

  it('clears history when confirmed', async () => {
    const { getByTestId } = render(<HistoryScreen />);
    
    fireEvent.press(getByTestId('clear-history-button'));
    
    // Find and trigger the clear action
    const clearAction = (Alert.alert as jest.Mock).mock.calls[0][2][1];
    await clearAction.onPress();
    
    expect(clearMessages).toHaveBeenCalled();
  });
});
