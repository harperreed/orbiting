import { StyleSheet, Platform, useWindowDimensions } from 'react-native';
import { Surface, IconButton, useTheme } from 'react-native-paper';
import { useTranslation } from 'react-i18next';

type BottomBarProps = {
    onClearPress: () => void;
    onHistoryPress: () => void;
};

export default function BottomBar({ onClearPress, onHistoryPress }: BottomBarProps) {
    const theme = useTheme();
    const { width } = useWindowDimensions();
    const { t } = useTranslation();
    
    // Only show on web platform and screens wider than 768px (tablet/desktop)
    if (Platform.OS !== 'web' || width < 768) {
        return null;
    }
    
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
        <Surface style={styles.container} elevation={1}>
            <IconButton
                icon="delete"
                mode="contained"
                onPress={onClearPress}
                testID="clear-button"
                accessibilityLabel={t('clear_text')}
                accessibilityHint={t('clear_text_hint')}
                accessibilityRole="button"
                accessibilityState={{ disabled: false }}
                accessible={true}
            />
            <IconButton
                icon="history"
                mode="contained"
                onPress={onHistoryPress}
                testID="history-button"
                accessibilityLabel={t('show_history')}
                accessibilityHint={t('show_history_hint')}
                accessibilityRole="button"
                accessibilityState={{ disabled: false }}
                accessible={true}
            />
        </Surface>
    );
}
