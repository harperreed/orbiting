import {
    View,
    StyleSheet,
    Dimensions,
    KeyboardAvoidingView,
    Platform,
} from "react-native";
import { useState, useCallback, useEffect } from "react";
import { useLocalSearchParams, router } from "expo-router";
import { GestureDetector, Gesture } from "react-native-gesture-handler";
import BigTextDisplay from "./BigTextDisplay";
import { storeMessage } from "../utils/storage";

export default function HomeScreen() {
    const [text, setText] = useState("");
    const { text: paramText } = useLocalSearchParams<{ text?: string }>();

    useEffect(() => {
        if (paramText) {
            setText(paramText);
        }
    }, [paramText]);

    const handleTextChange = useCallback(async (newText: string) => {
        setText(newText);
        try {
            await storeMessage(newText);
        } catch (error) {
            console.error("Failed to store message:", error);
        }
    }, []);

    const { width, height } = Dimensions.get("window");
    const SWIPE_THRESHOLD = width * 0.2; // 20% of screen width
    const VERTICAL_THRESHOLD = height * 0.2; // 20% of screen height

    const panGesture = Gesture.Pan()
        .onFinalize((event) => {
        const { translationX, translationY } = event;

        // Check for left swipe
        if (translationX < -SWIPE_THRESHOLD && Math.abs(translationY) < 50) {
            setText("");
        }

        // Check for up swipe
        if (translationY < -VERTICAL_THRESHOLD && Math.abs(translationX) < 50) {
            router.push("/history");
        }
    });

    useEffect(() => {
        // Cleanup function
        return () => {
            setText("");
        };
    }, []);

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.container}
            keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
            contentContainerStyle={styles.keyboardAvoidingContent}
        >
            <GestureDetector gesture={panGesture}>
                <View style={styles.innerContainer}>
                    <BigTextDisplay
                        text={text}
                        onChangeText={handleTextChange}
                    />
                </View>
            </GestureDetector>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    innerContainer: {
        flex: 1,
        width: "100%",
        height: "100%",
    },
    keyboardAvoidingContent: {
        flex: 1,
    },
});
