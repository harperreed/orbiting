import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

type BottomBarProps = {
    onClearPress: () => void;
    onHistoryPress: () => void;
};

export default function BottomBar({ onClearPress, onHistoryPress }: BottomBarProps) {
    return (
        <View style={styles.container}>
            <TouchableOpacity 
                onPress={onClearPress}
                style={styles.button}
                testID="clear-button"
            >
                <FontAwesome name="trash" size={24} color="#666" />
            </TouchableOpacity>
            <TouchableOpacity 
                onPress={onHistoryPress}
                style={styles.button}
                testID="history-button"
            >
                <FontAwesome name="history" size={24} color="#666" />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        height: 60,
        backgroundColor: '#f5f5f5',
        borderTopWidth: 1,
        borderTopColor: '#e0e0e0',
    },
    button: {
        padding: 10,
    },
});
