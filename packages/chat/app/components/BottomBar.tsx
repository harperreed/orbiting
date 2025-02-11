import React from 'react';
import { View, Button, useTheme, StyleSheet } from 'rnuilib';

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
            elevation: 4, // Mimics paper's surface elevation
        },
        button: {
            padding: 8,
        },
    });

    return (
        <View style={styles.container}>
            <Button
                icon="history"
                onPress={onHistoryPress}
                style={styles.button}
                accessibilityLabel="Show history"
            />
            <Button
                icon="delete"
                onPress={onClearPress}
                style={styles.button}
                accessibilityLabel="Clear text"
            />
        </View>
    );
}

