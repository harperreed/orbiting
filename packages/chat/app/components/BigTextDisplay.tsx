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
  
  const textInputRef = useRef<TextInput>(null);
  const resizeTimeoutRef = useRef<NodeJS.Timeout>();
  const rafRef = useRef<number>();

  const onLayout = useCallback((event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    setContainerSize({ width, height });
  }, []);

  const onContentSizeChange = useCallback((width: number, height: number) => {
    setContentSize({ width, height });
  }, []);

  const calculateAndSetFontSize = useCallback(() => {
    try {
      if (!textInputRef.current || !containerSize.width || !containerSize.height) return;

      const input = textInputRef.current;
      let currentSize = maxFontSize;
      const vhUnit = containerSize.height / 100;
      
      const checkOverflow = (size: number) => {
        const pixelSize = size * vhUnit;
        input.setNativeProps({ style: { fontSize: pixelSize } });
        
        // Wait for layout to update
        return new Promise<boolean>((resolve) => {
          requestAnimationFrame(() => {
            const hasVerticalOverflow = contentSize.height > containerSize.height;
            const hasHorizontalOverflow = contentSize.width > containerSize.width;
            resolve(hasVerticalOverflow || hasHorizontalOverflow);
          });
        });
      };

      const resizeText = async () => {
        while (currentSize > minFontSize) {
          const hasOverflow = await checkOverflow(currentSize);
          if (!hasOverflow) break;
          currentSize -= 0.5;
        }
        setFontSize(currentSize);
      };

      // Clean up previous RAF
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      
      rafRef.current = requestAnimationFrame(() => {
        resizeText();
      });
    } catch (error) {
      console.error('Error in font size calculation:', error);
    }
  }, [containerSize, contentSize, maxFontSize, minFontSize]);

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
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [text, containerSize, contentSize, calculateAndSetFontSize, debounceMs]);

  return (
    <TextInput
      ref={textInputRef}
      testID="big-text-display"
      style={[styles.text, { 
        fontSize: fontSize * (containerSize.height / 100), // Convert vh to pixels
        lineHeight: fontSize * (containerSize.height / 100) * 1.2
      }]}
      value={text}
      onChangeText={onChangeText}
      multiline
      placeholder="Type something..."
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
