import React from "react";
import { StyleSheet } from "react-native";
import { View, Button, Colors } from "react-native-ui-lib";

type BottomBarProps = {
    onClearPress: () => void;
    onHistoryPress: () => void;
};

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        height: 60,
        backgroundColor: Colors.$backgroundElevated,
        elevation: 4, // Mimics paper's surface elevation
    },
    button: {
        padding: 8,
    },
});

export default function BottomBar({
    onClearPress,
    onHistoryPress,
}: BottomBarProps) {
    return (
        <View style={styles.container}>
            <Button
                testID="history-button"
                iconSource="history"
                onPress={onHistoryPress}
                style={styles.button}
                accessibilityLabel="Show history"
            />
            <Button
                testID="clear-button"
                iconSource="delete"
                onPress={onClearPress}
                style={styles.button}
                accessibilityLabel="Clear text"
            />
        </View>
    );
}
