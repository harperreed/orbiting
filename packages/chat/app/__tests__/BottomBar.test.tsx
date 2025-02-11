import { render, fireEvent } from '@testing-library/react-native';
import BottomBar from '../components/BottomBar';

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
    });
});
