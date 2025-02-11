import {
    StyleSheet,
    Dimensions,
    KeyboardAvoidingView,
    Platform,
} from "react-native";
import { Surface } from 'react-native-paper';
import BottomBar from "./BottomBar";
import { useCallback, useEffect } from "react";
import { useLocalSearchParams, router } from "expo-router";
import { GestureDetector, Gesture } from "react-native-gesture-handler";
import BigTextDisplay from "./BigTextDisplay";
import { useText } from "../context/TextContext";

export default function HomeScreen() {
    const { text, handleTextChange, restoreLastSession, error, isLoading } = useText();
    const { text: paramText } = useLocalSearchParams<{ text?: string }>();

    useEffect(() => {
        const initializeText = async () => {
            try {
                if (paramText) {
                    await handleTextChange(paramText);
                } else {
                    await restoreLastSession();
                }
            } catch (error) {
                console.error('Failed to initialize text:', error);
            }
        };
        
        initializeText();
    }, [paramText, handleTextChange, restoreLastSession]);

    const { width, height } = Dimensions.get("window");
    const SWIPE_THRESHOLD = width * 0.2; // 20% of screen width
    const VERTICAL_THRESHOLD = height * 0.2; // 20% of screen height

    const panGesture = Gesture.Pan()
        .onFinalize((event) => {
        const { translationX, translationY } = event;

        // Check for left swipe
        if (translationX < -SWIPE_THRESHOLD && Math.abs(translationY) < 50) {
            handleTextChange("");
        }

        // Check for up swipe
        if (translationY < -VERTICAL_THRESHOLD && Math.abs(translationX) < 50) {
            router.push("/history");
        }
    });

    useEffect(() => {
        // Cleanup function
        return () => {
            handleTextChange("");
        };
    }, [handleTextChange]);

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.container}
            keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
            contentContainerStyle={styles.keyboardAvoidingContent}
        >
            <Surface style={styles.contentContainer}>
                <GestureDetector gesture={panGesture}>
                    <Surface style={styles.innerContainer}>
                        <BigTextDisplay
                            text={text}
                            onChangeText={handleTextChange}
                        />
                    </Surface>
                </GestureDetector>
                <BottomBar 
                    onClearPress={() => handleTextChange("")}
                    onHistoryPress={() => router.push("/history")}
                />
            </Surface>
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
