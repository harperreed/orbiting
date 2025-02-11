import { View, Text, Button } from "react-native-ui-lib";

type BottomBarProps = {
    onClearPress: () => void;
    onHistoryPress: () => void;
};

export default function BottomBar({
    onClearPress,
    onHistoryPress,
}: BottomBarProps) {
    return (
        <View
            row
            height={60}
            spread
            center
            backgroundColor="background.secondary"
            style={{
                borderTopWidth: 1,
                borderTopColor: "border",
            }}
        >
            <Button
                link
                testID="clear-button"
                onPress={onClearPress}
                padding-10
            >
                <Text text60>🗑️</Text>
            </Button>
            <Button
                link
                testID="history-button"
                onPress={onHistoryPress}
                padding-10
            >
                <Text text60>⏱️</Text>
            </Button>
        </View>
    );
}
