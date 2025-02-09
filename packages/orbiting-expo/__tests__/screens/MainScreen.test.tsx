import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Dimensions } from 'react-native';
import MainScreen from '../../app/index';
import { isFirstLaunch } from '../../utils/storage';

const mockPush = jest.fn();

jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: mockPush,
    current: { params: {} },
  }),
}));

jest.mock('../../utils/storage', () => ({
  saveMessage: jest.fn(),
  isFirstLaunch: jest.fn(),
}));

describe('MainScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (isFirstLaunch as jest.Mock).mockResolvedValue(false);
  });

  it('renders correctly', () => {
    const { getByTestId } = render(<MainScreen />);
    expect(getByTestId('main-screen')).toBeTruthy();
    expect(getByTestId('message-input')).toBeTruthy();
  });

  it('navigates to history screen when button is pressed', () => {
    const { getByTestId } = render(<MainScreen />);
    fireEvent.press(getByTestId('history-button'));
    expect(mockPush).toHaveBeenCalledWith('/history');
  });

  it('shows help modal when help button is pressed', () => {
    const { getByTestId } = render(<MainScreen />);
    fireEvent.press(getByTestId('help-button'));
    expect(getByTestId('help-modal')).toBeTruthy();
  });

  it('closes help modal when close button is pressed', () => {
    const { getByTestId, queryByTestId } = render(<MainScreen />);
    fireEvent.press(getByTestId('help-button'));
    fireEvent.press(getByTestId('close-help-modal'));
    expect(queryByTestId('help-modal')).toBeFalsy();
  });

  it('shows welcome modal on first launch', async () => {
    (isFirstLaunch as jest.Mock).mockResolvedValue(true);
    const { findByTestId } = render(<MainScreen />);
    await findByTestId('welcome-modal');
  });

  it('does not show welcome modal on subsequent launches', async () => {
    (isFirstLaunch as jest.Mock).mockResolvedValue(false);
    const { queryByTestId } = render(<MainScreen />);
    await waitFor(() => {
      expect(queryByTestId('welcome-modal')).toBeFalsy();
    });
  });

  it('adjusts font size when typing long text', async () => {
    const { getByTestId } = render(<MainScreen />);
    const input = getByTestId('message-input');
    
    // Type a long message
    fireEvent.changeText(input, 'This is a very long message that should cause the font size to decrease');
    
    // Check that the font size was adjusted
    await waitFor(() => {
      const style = input.props.style;
      expect(Array.isArray(style)).toBe(true);
      const fontSize = style.find((s: any) => s.fontSize)?.fontSize;
      expect(fontSize).toBeLessThan(72); // Should be smaller than max size
    });
  });
});
