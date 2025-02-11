import { StyleSheet, useWindowDimensions, LayoutChangeEvent, Platform, Keyboard } from "react-native";
import { TextField, useTheme } from 'react-native-ui-lib';
import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { useSettings } from '../context/SettingsContext';
import { debounce } from 'lodash';

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
  maxFontSize: propMaxFontSize,
  minFontSize = 1,  // in vh units (3/4 of previous 1.3vh)
  debounceMs = 150
}: BigTextDisplayProps) {
  const { startingFontSize } = useSettings();
  const theme = useTheme();
  const maxFontSize = propMaxFontSize ?? (startingFontSize / 2.4); // Convert px to vh units
  const dimensions = useWindowDimensions();
  const previousDimensions = useRef(dimensions);
  const inputRef = useRef<typeof TextField>(null);

  const [fontSize, setFontSize] = useState(maxFontSize);
  const [containerSize, setContainerSize] = useState<ViewportSize>({ width: 0, height: 0 });
  const [contentSize, setContentSize] = useState<ViewportSize>({ width: 0, height: 0 });
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [adjustedContainerHeight, setAdjustedContainerHeight] = useState(0);

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
        setFontSize(current => Math.max(current - 0.5, minFontSize));
      } else if (!hasOverflow && fontSize < maxFontSize) {
        // More aggressive increase when text is deleted
        const increaseFactor = text.length < 10 ? 2.0 : 0.5;
        const nextSize = Math.min(fontSize + increaseFactor, maxFontSize);
        const wouldOverflow = 
          (contentSize.height * (nextSize / fontSize)) > adjustedContainerHeight ||
          (contentSize.width * (nextSize / fontSize)) > containerSize.width;
        
        if (!wouldOverflow) {
          setFontSize(nextSize);
        }
      }
    } catch (error) {
      console.error('Error in font size calculation:', error);
    }
  }, [containerSize, contentSize, fontSize, maxFontSize, minFontSize, text, adjustedContainerHeight]);

  const debouncedCalculate = useMemo(
    () => debounce((
      text: string,
      containerSize: ViewportSize,
      contentSize: ViewportSize,
      adjustedContainerHeight: number
    ) => {
      calculateAndSetFontSize();
    }, debounceMs),
    [calculateAndSetFontSize, debounceMs]
  );

  // Handle keyboard events and cleanup
  useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';
    
    const handleKeyboardShow = (e: any) => {
      setKeyboardHeight(e.endCoordinates.height);
      setKeyboardVisible(true);
    };
    
    const handleKeyboardHide = () => {
      setKeyboardHeight(0);
      setKeyboardVisible(false);
    };

    const keyboardWillShow = Keyboard.addListener(showEvent, handleKeyboardShow);
    const keyboardWillHide = Keyboard.addListener(hideEvent, handleKeyboardHide);

    // Cleanup function
    return () => {
      keyboardWillShow.remove();
      keyboardWillHide.remove();
      // Cancel any pending debounced calculations
      debouncedCalculate.cancel();
    };
  }, []);
  const onLayout = useCallback((event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    setContainerSize({ width, height });
    setAdjustedContainerHeight(height - keyboardHeight);
  }, [keyboardHeight]);

  const onContentSizeChange = useCallback((width: number, height: number) => {
    setContentSize({ width, height });
  }, []);

  // Handle screen dimension changes
  useEffect(() => {
    const handleDimensionChange = () => {
      if (previousDimensions.current.width !== dimensions.width ||
          previousDimensions.current.height !== dimensions.height) {
        setContainerSize({
          width: dimensions.width,
          height: dimensions.height
        });
        
        debouncedCalculate(
          text, 
          { width: dimensions.width, height: dimensions.height }, 
          contentSize, 
          dimensions.height - keyboardHeight
        );
        
        previousDimensions.current = dimensions;
      }
    };

    handleDimensionChange();

    return () => {
      debouncedCalculate.cancel();
    };
  }, [dimensions, keyboardHeight, text, contentSize, debouncedCalculate]);

  // Handle font size calculations with error boundary
  useEffect(() => {
    try {
      debouncedCalculate(text, containerSize, contentSize, adjustedContainerHeight);
    } catch (error) {
      console.error('Error in font size calculation:', error);
      // Fallback to minimum font size on error
      setFontSize(minFontSize);
    }

    return () => {
      debouncedCalculate.cancel();
    };
  }, [text, containerSize, contentSize, adjustedContainerHeight, debouncedCalculate, minFontSize]);

  return (
    <TextField
      ref={inputRef}
      testID="big-text-display"
      mode="flat"
      style={[
        {
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: '100%',
          height: '100%',
          fontWeight: "bold",
          fontFamily: 'System',  // System font, similar to sans-serif
          color: theme.colors.onBackground,
          backgroundColor: theme.colors.background,
          textAlign: "left",
          padding: 20,
          paddingBottom: 50,
          margin: 0,
          zIndex: 10,
        },
        {
          fontSize: fontSize * (adjustedContainerHeight / 100),
          lineHeight: fontSize * (adjustedContainerHeight / 100) * 1.2,
          maxHeight: keyboardVisible ? `${100 - (keyboardHeight / dimensions.height * 100)}%` : '100%',
        }
      ]}
      value={text}
      onChangeText={onChangeText}
      multiline
      placeholder="Type Here"
      onLayout={onLayout}
      onContentSizeChange={(e) => {
        onContentSizeChange(e.nativeEvent.contentSize.width, e.nativeEvent.contentSize.height);
      }}
      autoCorrect={false}
      keyboardType={Platform.OS === 'ios' ? 'default' : 'visible-password'} // Prevents Android keyboard from jumping
    />
  );
}

