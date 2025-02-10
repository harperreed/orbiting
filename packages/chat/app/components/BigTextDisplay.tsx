import { TextInput, StyleSheet, useWindowDimensions, LayoutChangeEvent, Platform } from "react-native";
import { useState, useEffect, useCallback, useRef } from "react";

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
  maxFontSize = 20, // in vh units
  minFontSize = 2,  // in vh units
  debounceMs = 150
}: BigTextDisplayProps) {
  const { width, height } = useWindowDimensions();
  const [fontSize, setFontSize] = useState(maxFontSize);
  const [containerSize, setContainerSize] = useState<ViewportSize>({ width: 0, height: 0 });
  const [contentSize, setContentSize] = useState<ViewportSize>({ width: 0, height: 0 });
  
  const resizeTimeoutRef = useRef<NodeJS.Timeout>();

  const onLayout = useCallback((event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    setContainerSize({ width, height });
  }, []);

  const onContentSizeChange = useCallback((width: number, height: number) => {
    setContentSize({ width, height });
  }, []);

  const calculateAndSetFontSize = useCallback(() => {
    try {
      if (!containerSize.width || !containerSize.height) return;

      // Reset to max size when text is empty or very short
      if (text.length <= 1) {
        setFontSize(maxFontSize);
        return;
      }

      const hasOverflow = 
        contentSize.height > containerSize.height ||
        contentSize.width > containerSize.width;

      if (hasOverflow && fontSize > minFontSize) {
        setFontSize(current => Math.max(current - 0.5, minFontSize));
      } else if (!hasOverflow && fontSize < maxFontSize) {
        // More aggressive increase when text is deleted
        const increaseFactor = text.length < 10 ? 2.0 : 0.5;
        const nextSize = Math.min(fontSize + increaseFactor, maxFontSize);
        const wouldOverflow = 
          (contentSize.height * (nextSize / fontSize)) > containerSize.height ||
          (contentSize.width * (nextSize / fontSize)) > containerSize.width;
        
        if (!wouldOverflow) {
          setFontSize(nextSize);
        }
      }
    } catch (error) {
      console.error('Error in font size calculation:', error);
    }
  }, [containerSize, contentSize, fontSize, maxFontSize, minFontSize, text]);

  // Debounced resize handler
  useEffect(() => {
    if (resizeTimeoutRef.current) {
      clearTimeout(resizeTimeoutRef.current);
    }

    resizeTimeoutRef.current = setTimeout(() => {
      calculateAndSetFontSize();
    }, debounceMs);

    return () => {
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }
    };
  }, [text, containerSize, contentSize, calculateAndSetFontSize, debounceMs]);

  return (
    <TextInput
      testID="big-text-display"
      style={[styles.text, { 
        fontSize: fontSize * (containerSize.height / 100), // Convert vh to pixels
        lineHeight: fontSize * (containerSize.height / 100) * 1.2
      }]}
      value={text}
      onChangeText={onChangeText}
      multiline
      placeholder="Type Here"
      selectionColor="#000"
      placeholderTextColor="#888"
      onLayout={onLayout}
      onContentSizeChange={(e) => {
        onContentSizeChange(e.nativeEvent.contentSize.width, e.nativeEvent.contentSize.height);
      }}
      autoCorrect={false}
      keyboardType={Platform.OS === 'ios' ? 'default' : 'visible-password'} // Prevents Android keyboard from jumping
    />
  );
}

const styles = StyleSheet.create({
  text: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
    fontWeight: "bold",
    fontFamily: 'System',  // System font, similar to sans-serif
    color: '#000',
    textAlign: "left",
    padding: 20,
    paddingBottom: 50,
    margin: 0,
    zIndex: 10,
  },
});
