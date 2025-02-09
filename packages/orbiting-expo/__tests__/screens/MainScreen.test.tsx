import { render, fireEvent } from '@testing-library/react-native';
import MainScreen from '../../app/index';

const mockPush = jest.fn();

jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

describe('MainScreen', () => {
  it('renders correctly', () => {
    const { getByTestId } = render(<MainScreen />);
    expect(getByTestId('main-screen')).toBeTruthy();
    expect(getByTestId('main-text')).toBeTruthy();
  });

  it('navigates to history screen when button is pressed', () => {
    const { getByTestId } = render(<MainScreen />);
    fireEvent.press(getByTestId('history-button'));
    expect(mockPush).toHaveBeenCalledWith('/history');
  });
});
