import { render, fireEvent } from '@testing-library/react-native';
import { View } from 'react-native-ui-lib';
import TabBar from '../components/TabBar';
import { useRouter, usePathname } from 'expo-router';

// Mock expo-router
jest.mock('expo-router', () => ({
  useRouter: jest.fn(),
  usePathname: jest.fn()
}));

describe('TabBar', () => {
  const mockRouter = { push: jest.fn() };
  
  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
  });

  it('is hidden on home screen', () => {
    (usePathname as jest.Mock).mockReturnValue('/');
    const { container } = render(<TabBar />);
    expect(container.children).toHaveLength(0);
  });

  it('is visible on other screens', () => {
    (usePathname as jest.Mock).mockReturnValue('/history');
    const { getByTestId } = render(<TabBar />);
    expect(getByTestId('home-tab')).toBeTruthy();
  });

  it('navigates to home when home tab is pressed', () => {
    (usePathname as jest.Mock).mockReturnValue('/history');
    const { getByTestId } = render(<TabBar />);
    fireEvent.press(getByTestId('home-tab'));
    expect(mockRouter.push).toHaveBeenCalledWith('/');
  });
});
