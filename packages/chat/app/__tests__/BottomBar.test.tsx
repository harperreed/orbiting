import { render, fireEvent } from '@testing-library/react-native';
import BottomBar from '../components/BottomBar';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';

jest.mock('react-native-haptic-feedback', () => ({
    trigger: jest.fn(),
}));

describe('BottomBar', () => {
    it('calls onClearPress when clear button is pressed', () => {
        const onClearPress = jest.fn();
        const onHistoryPress = jest.fn();
        
        const { getByTestId } = render(
            <BottomBar 
                onClearPress={onClearPress}
                onHistoryPress={onHistoryPress}
            />
        );
        
        fireEvent.press(getByTestId('clear-button'));
        expect(onClearPress).toHaveBeenCalled();
        expect(ReactNativeHapticFeedback.trigger).toHaveBeenCalledWith('impactLight');
    });
    
    it('calls onHistoryPress when history button is pressed', () => {
        const onClearPress = jest.fn();
        const onHistoryPress = jest.fn();
        
        const { getByTestId } = render(
            <BottomBar 
                onClearPress={onClearPress}
                onHistoryPress={onHistoryPress}
            />
        );
        
        fireEvent.press(getByTestId('history-button'));
        expect(onHistoryPress).toHaveBeenCalled();
        expect(ReactNativeHapticFeedback.trigger).toHaveBeenCalledWith('impactLight');
    });
});
