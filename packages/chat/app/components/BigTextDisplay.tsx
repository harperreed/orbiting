import {
    TextInput,
    StyleSheet,
    useWindowDimensions,
    LayoutChangeEvent,
    Platform,
    Keyboard,
} from "react-native";
import { useState, useEffect, useCallback, useRef, RefObject } from "react";
import { debounce } from "lodash";

type BigTextDisplayProps = {
    text: string;
    onChangeText: (text: string) => void;
    maxFontSize?: number;
    minFontSize?: number;
    debounceMs?: number;
};

type ViewportSize = {
    width: number;
    height: number;
};

export default function BigTextDisplay({
    text,
    onChangeText,
    maxFontSize = 10, // in vh units (3/4 of previous 13vh)
    minFontSize = 1, // in vh units (3/4 of previous 1.3vh)
    debounceMs = 150,
}: BigTextDisplayProps) {
    const dimensions = useWindowDimensions();
    const [fontSize, setFontSize] = useState(maxFontSize);
    const [containerSize, setContainerSize] = useState<ViewportSize>({
        width: 0,
        height: 0,
    });
    const [keyboardHeight, setKeyboardHeight] = useState(0);
    const previousDimensions = useRef(dimensions);

    // Handle keyboard events
    useEffect(() => {
        const keyboardWillShow = Keyboard.addListener(
            Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow",
            (e) => {
                setKeyboardHeight(e.endCoordinates.height);
                setKeyboardVisible(true);
            },
        );
        const keyboardWillHide = Keyboard.addListener(
            Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide",
            () => {
                setKeyboardHeight(0);
                setKeyboardVisible(false);
            },
        );

        return () => {
            keyboardWillShow.remove();
            keyboardWillHide.remove();
        };
    }, []);
    const [contentSize, setContentSize] = useState<ViewportSize>({
        width: 0,
        height: 0,
    });
    const [adjustedContainerHeight, setAdjustedContainerHeight] = useState(0);
    const [keyboardVisible, setKeyboardVisible] = useState(false);
    const inputRef = useRef<TextInput>(null);
    const debouncedCalculateRef = useRef(
        debounce(
            (
                text: string,
                containerSize: ViewportSize,
                contentSize: ViewportSize,
                adjustedContainerHeight: number,
            ) => {
                calculateAndSetFontSize();
            },
            debounceMs,
        ),
    );

    const onLayout = useCallback(
        (event: LayoutChangeEvent) => {
            const { width, height } = event.nativeEvent.layout;
            setContainerSize({ width, height });
            setAdjustedContainerHeight(height - keyboardHeight);
        },
        [keyboardHeight],
    );

    const onContentSizeChange = useCallback((width: number, height: number) => {
        setContentSize({ width, height });
    }, []);

    const calculateAndSetFontSize = useCallback(() => {
        try {
            if (!containerSize.width || !adjustedContainerHeight) return;

            // Reset to max size when text is empty or very short
            if (text.length <= 1) {
                setFontSize(maxFontSize);
                return;
            }

            const hasOverflow =
                contentSize.height > adjustedContainerHeight ||
                contentSize.width > containerSize.width;

            if (hasOverflow && fontSize > minFontSize) {
                setFontSize((current) => Math.max(current - 0.5, minFontSize));
            } else if (!hasOverflow && fontSize < maxFontSize) {
                // More aggressive increase when text is deleted
                const increaseFactor = text.length < 10 ? 2.0 : 0.5;
                const nextSize = Math.min(
                    fontSize + increaseFactor,
                    maxFontSize,
                );
                const wouldOverflow =
                    contentSize.height * (nextSize / fontSize) >
                        adjustedContainerHeight ||
                    contentSize.width * (nextSize / fontSize) >
                        containerSize.width;

                if (!wouldOverflow) {
                    setFontSize(nextSize);
                }
            }
        } catch (error) {
            console.error("Error in font size calculation:", error);
        }
    }, [containerSize, contentSize, fontSize, maxFontSize, minFontSize, text]);

    // Handle screen dimension changes
    useEffect(() => {
        if (
            previousDimensions.current.width !== dimensions.width ||
            previousDimensions.current.height !== dimensions.height
        ) {
            // Update container size based on new dimensions
            setContainerSize((current) => ({
                width: dimensions.width,
                height: dimensions.height,
            }));
            // Trigger recalculation
            debouncedCalculateRef.current(
                text,
                { width: dimensions.width, height: dimensions.height },
                contentSize,
                dimensions.height - keyboardHeight,
            );
            previousDimensions.current = dimensions;
        }
    }, [dimensions, keyboardHeight]);

    // Call debounced calculation when dependencies change
    useEffect(() => {
        debouncedCalculateRef.current(
            text,
            containerSize,
            contentSize,
            adjustedContainerHeight,
        );
    }, [text, containerSize, contentSize, adjustedContainerHeight]);

    // Cleanup debounced function on unmount
    useEffect(() => {
        return () => {
            debouncedCalculateRef.current.cancel();
        };
    }, []);

    return (
        <TextInput
            ref={inputRef}
            testID="big-text-display"
            style={{
                ...styles.text,
                fontSize: fontSize * (adjustedContainerHeight / 100), // Convert vh to pixels
                lineHeight: fontSize * (adjustedContainerHeight / 100) * 1.2,
                maxHeight: keyboardVisible
                    ? `${100 - (keyboardHeight / dimensions.height) * 100}%`
                    : "100%",
            }}
            value={text}
            onChangeText={onChangeText}
            multiline
            placeholder="Type Here"
            selectionColor="#000"
            placeholderTextColor="#888"
            onLayout={onLayout}
            onContentSizeChange={(e) => {
                onContentSizeChange(
                    e.nativeEvent.contentSize.width,
                    e.nativeEvent.contentSize.height,
                );
            }}
            autoCorrect={false}
            keyboardType={
                Platform.OS === "ios" ? "default" : "visible-password"
            } // Prevents Android keyboard from jumping
        />
    );
}

const styles = StyleSheet.create({
    text: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: "100%",
        height: "100%",
        fontWeight: "bold",
        fontFamily: "System", // System font, similar to sans-serif
        color: "#000",
        textAlign: "left",
        padding: 20,
        paddingBottom: 50,
        margin: 0,
        zIndex: 10,
        boxShadow: "none", // Modern replacement for shadowProps
    },
});
