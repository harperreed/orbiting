import { render } from '@testing-library/react-native';
import HistoryScreen from '../../app/history';

describe('HistoryScreen', () => {
  it('renders correctly', () => {
    const { getByTestId } = render(<HistoryScreen />);
    expect(getByTestId('history-screen')).toBeTruthy();
    expect(getByTestId('history-text')).toBeTruthy();
  });
});
