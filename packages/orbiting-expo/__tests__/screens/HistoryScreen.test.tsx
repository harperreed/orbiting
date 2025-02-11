import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Alert } from 'react-native';
import HistoryScreen from '../../app/screens/HistoryScreen';
import { getMessages, clearMessages } from '../../utils/storage';

const mockPush = jest.fn();
jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

jest.mock('../../utils/storage', () => ({
  getMessages: jest.fn(),
  clearMessages: jest.fn(),
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

  it('renders correctly', () => {
    const { getByTestId } = render(<HistoryScreen />);
    expect(getByTestId('history-screen')).toBeTruthy();
  });

  it('displays messages from storage', async () => {
    const { getAllByTestId } = render(<HistoryScreen />);
    await waitFor(() => {
      const messageItems = getAllByTestId('message-item');
      expect(messageItems).toHaveLength(2);
    });
  });

  it('shows empty state when no messages exist', async () => {
    (getMessages as jest.Mock).mockResolvedValue([]);
    const { getByTestId } = render(<HistoryScreen />);
    await waitFor(() => {
      expect(getByTestId('empty-message')).toBeTruthy();
    });
  });

  it('navigates to MainScreen with message when item is pressed', async () => {
    const { getAllByTestId } = render(<HistoryScreen />);
    await waitFor(() => {
      const messageItems = getAllByTestId('message-item');
      fireEvent.press(messageItems[0]);
      expect(mockPush).toHaveBeenCalledWith({
        pathname: '/',
        params: { message: 'Test message 1' },
      });
    });
  });

  it('confirms before clearing history', async () => {
    const { getByTestId } = render(<HistoryScreen />);
    fireEvent.press(getByTestId('clear-history-button'));
    
    expect(Alert.alert).toHaveBeenCalledWith(
      'Clear History',
      'Are you sure you want to clear all messages?',
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
