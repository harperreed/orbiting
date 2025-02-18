import { StyleSheet, Platform, useWindowDimensions } from 'react-native';
import { Surface, IconButton, useTheme } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';

type BottomBarProps = {
    onClearPress: () => void;
    onHistoryPress: () => void;
};

export default function BottomBar({ onClearPress, onHistoryPress }: BottomBarProps) {
    const { t } = useTranslation();
    const theme = useTheme();
    const { width } = useWindowDimensions();
    
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

    const handleClearPress = () => {
        ReactNativeHapticFeedback.trigger('impactLight');
        onClearPress();
    };

    const handleHistoryPress = () => {
        ReactNativeHapticFeedback.trigger('impactLight');
        onHistoryPress();
    };

    return (
        <Surface style={styles.container} elevation={1}>
            <IconButton
                icon="delete"
                mode="contained"
                onPress={handleClearPress}
                testID="clear-button"
                accessibilityLabel={t('clearText')}
                accessibilityHint={t('clearHint')}
                accessibilityRole="button"
                accessibilityState={{ disabled: false }}
                accessible={true}
            />
            <IconButton
                icon="history"
                mode="contained"
                onPress={handleHistoryPress}
                testID="history-button"
                accessibilityLabel={t('showHistory')}
                accessibilityHint={t('showHistoryHint')}
                accessibilityRole="button"
                accessibilityState={{ disabled: false }}
                accessible={true}
            />
        </Surface>
    );
}
