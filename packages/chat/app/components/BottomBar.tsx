import { StyleSheet } from 'react-native';
import { Surface, IconButton, useTheme } from 'react-native-paper';

type BottomBarProps = {
    onClearPress: () => void;
    onHistoryPress: () => void;
};

export default function BottomBar({ onClearPress, onHistoryPress }: BottomBarProps) {
    const theme = useTheme();
    
    const styles = StyleSheet.create({
        container: {
            flexDirection: 'row',
            justifyContent: 'space-around',
            alignItems: 'center',
            height: 60,
            backgroundColor: theme.colors.background,
        },
    });

    return (
        <Surface style={styles.container} elevation={4}>
            <IconButton
                icon="delete"
                mode="contained"
                onPress={onClearPress}
                testID="clear-button"
            />
            <IconButton
                icon="history"
                mode="contained"
                onPress={onHistoryPress}
                testID="history-button"
            />
        </Surface>
    );
}

