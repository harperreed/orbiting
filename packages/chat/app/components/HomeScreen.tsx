import {
    StyleSheet,
    Dimensions,
    KeyboardAvoidingView,
    Platform,
    Animated,
} from "react-native";
import RNShake from 'react-native-shake';
import { Surface, Snackbar } from 'react-native-paper';
import BottomBar from "./BottomBar";
import { useCallback, useEffect, useState } from "react";
import { useSettings } from "../context/SettingsContext";
import { useLocalSearchParams, router } from "expo-router";
import { GestureDetector, Gesture } from "react-native-gesture-handler";
import BigTextDisplay from "./BigTextDisplay";
import { useText } from "../context/TextContext";
import { useTranslation } from 'react-i18next';

import { AccessibilityInfo } from 'react-native';

export default function HomeScreen() {
    const { text, handleTextChange, restoreLastSession, error } = useText();
    const announceError = useCallback((error: string) => {
        AccessibilityInfo.announceForAccessibility(error);
    }, []);
    const { text: paramText } = useLocalSearchParams<{ text?: string }>();
    const { shakeMode, currentTheme } = useSettings();
    const [flashAnim] = useState(new Animated.Value(0));
    const { t } = useTranslation();

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

        // Horizontal swipes
        if (Math.abs(translationX) > SWIPE_THRESHOLD && Math.abs(translationY) < 50) {
            if (translationX < 0) {
                // Left swipe - clear text
                handleTextChange("");
            } else {
                // Right swipe - show history
                router.push("/history");
            }
        }
        
        // Up swipe - show history
        if (translationY < -VERTICAL_THRESHOLD && Math.abs(translationX) < 50) {
            router.push("/history");
        }
    });

    const handleShake = useCallback(() => {
        if (shakeMode === 'clear') {
            handleTextChange("");
        } else if (shakeMode === 'flash') {
            Animated.sequence([
                Animated.timing(flashAnim, {
                    toValue: 1,
                    duration: 100,
                    useNativeDriver: false,
                }),
                Animated.timing(flashAnim, {
                    toValue: 0,
                    duration: 900,
                    useNativeDriver: false,
                })
            ]).start();
        }
    }, [shakeMode, handleTextChange, flashAnim]);

    useEffect(() => {
        const subscription = RNShake.addListener(handleShake);
        return () => {
            subscription.remove();
            handleTextChange("");
        };
    }, [handleShake, handleTextChange]);

    const flashStyle = {
        backgroundColor: flashAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [currentTheme.colors.background, currentTheme.colors.onBackground]
        }),
    };

    return (
        <>
            <Animated.View style={[StyleSheet.absoluteFill, flashStyle]} />
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
            <Snackbar
                visible={!!error}
                onDismiss={() => {}}
                action={{
                    label: t('dismiss'),
                    onPress: () => {},
                }}
                accessibilityLiveRegion="polite"
                accessibilityLabel={error || t('error')}
                onShow={() => error && announceError(error)}>
                {error}
            </Snackbar>
            </KeyboardAvoidingView>
        </>
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
