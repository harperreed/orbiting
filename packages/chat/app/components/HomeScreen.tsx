import {
    View,
    StyleSheet,
    Dimensions,
    KeyboardAvoidingView,
    Platform,
} from "react-native";
import BottomBar from "./BottomBar";
import { useState, useCallback, useEffect } from "react";
import { useLocalSearchParams, router } from "expo-router";
import { GestureDetector, Gesture } from "react-native-gesture-handler";
import BigTextDisplay from "./BigTextDisplay";
import { storeMessage, clearHistory } from "../utils/storage";

export default function HomeScreen() {
    const { text, handleTextChange, clearText, restoreLastSession } = useText();
    const { text: paramText } = useLocalSearchParams<{ text?: string }>();

    useEffect(() => {
        if (paramText) {
            handleTextChange(paramText);
        } else {
            restoreLastSession();
        }
    }, [paramText]);

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
            <View style={styles.contentContainer}>
                <GestureDetector gesture={panGesture}>
                    <View style={styles.innerContainer}>
                        <BigTextDisplay
                            text={text}
                            onChangeText={handleTextChange}
                        />
                    </View>
                </GestureDetector>
                <BottomBar 
                    onClearPress={clearText}
                    onHistoryPress={() => router.push("/history")}
                />
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    contentContainer: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
    },
    innerContainer: {
        flex: 1,
        width: "100%",
    },
    keyboardAvoidingContent: {
        flex: 1,
    },
});
