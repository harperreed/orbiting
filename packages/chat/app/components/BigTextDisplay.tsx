import { TextInput, StyleSheet, useWindowDimensions, LayoutChangeEvent } from "react-native";
import { useState, useEffect, useCallback } from "react";

type BigTextDisplayProps = {
  text: string;
  onChangeText: (text: string) => void;
  maxFontSize?: number;
  minFontSize?: number;
};

export default function BigTextDisplay({ 
  text, 
  onChangeText,
  maxFontSize = 120, 
  minFontSize = 20 
}: BigTextDisplayProps) {
  const { width, height } = useWindowDimensions();
  const [fontSize, setFontSize] = useState(maxFontSize);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const [contentSize, setContentSize] = useState({ width: 0, height: 0 });

  const onLayout = useCallback((event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    setContainerSize({ width, height });
  }, []);

  const onContentSizeChange = useCallback((width: number, height: number) => {
    setContentSize({ width, height });
  }, []);

  useEffect(() => {
    const calculateIdealFontSize = () => {
      let newSize = maxFontSize;
      
      if (containerSize.width && containerSize.height) {
        // Add a small buffer to prevent edge cases
        const targetHeight = containerSize.height * 0.95;
        const targetWidth = containerSize.width * 0.95;
        
        // Use binary search for faster convergence
        let min = minFontSize;
        let max = maxFontSize;
        
        while (max - min > 0.5) {
          newSize = (min + max) / 2;
          
          // Estimate content size at this font size
          const estimatedHeight = (text.split('\n').length) * (newSize * 1.2);
          const estimatedWidth = Math.max(...text.split('\n').map(line => line.length)) * (newSize * 0.5);
          
          if (estimatedHeight > targetHeight || estimatedWidth > targetWidth) {
            max = newSize;
          } else {
            min = newSize;
          }
        }
      }
      
      return Math.max(Math.min(newSize, maxFontSize), minFontSize);
    };

    const newSize = calculateIdealFontSize();
    if (Math.abs(newSize - fontSize) > 0.5) {
      setFontSize(newSize);
    }
  }, [text, containerSize, contentSize, maxFontSize, minFontSize, fontSize]);

  return (
    <TextInput
      testID="big-text-display"
      style={[styles.text, { 
        fontSize,
        lineHeight: fontSize * 1.2 // 120% of font size for comfortable reading
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
