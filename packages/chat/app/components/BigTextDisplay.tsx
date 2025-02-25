import { useWindowDimensions, LayoutChangeEvent, Platform, Keyboard, StyleSheet, View } from "react-native";
import { TextInput, useTheme } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { useIsMounted } from '../hooks/useIsMounted';
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
  const { t } = useTranslation();
  const maxFontSize = propMaxFontSize ?? (startingFontSize / 2.4); // Convert px to vh units
  const dimensions = useWindowDimensions();
  const previousDimensions = useRef(dimensions);
  const inputRef = useRef<TextInput>(null);
  const textInputRef = useRef<TextInput>(null);

  const isMounted = useIsMounted();
  const abortControllerRef = useRef<AbortController>();
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
      if (isMounted() && !abortControllerRef.current?.signal.aborted) {
        calculateAndSetFontSize();
      }
    }, debounceMs, { maxWait: debounceMs * 2 }),
    [calculateAndSetFontSize, debounceMs, isMounted]
  );

  // Initialize AbortController
  useEffect(() => {
    abortControllerRef.current = new AbortController();
    return () => {
      abortControllerRef.current?.abort();
    };
  }, [debouncedCalculate]);

  // Handle keyboard events and cleanup
  useEffect(() => {
    const abortController = new AbortController();
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';
    
    const handleKeyboardShow = (e: any) => {
      if (!abortController.signal.aborted && isMounted()) {
        setKeyboardHeight(e.endCoordinates.height);
        setKeyboardVisible(true);
      }
    };
    
    const handleKeyboardHide = () => {
      if (!abortController.signal.aborted && isMounted()) {
        setKeyboardHeight(0);
        setKeyboardVisible(false);
      }
    };

    const listeners = [
      Keyboard.addListener(showEvent, handleKeyboardShow),
      Keyboard.addListener(hideEvent, handleKeyboardHide)
    ];

    // Cleanup function
    return () => {
      abortController.abort();
      listeners.forEach(listener => listener.remove());
      debouncedCalculate.cancel();
    };
  }, [isMounted, debouncedCalculate]);
  const onLayout = useCallback((event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    setContainerSize({ width, height });
    setAdjustedContainerHeight(height - keyboardHeight);
  }, [keyboardHeight]);

  const onContentSizeChange = useCallback((width: number, height: number) => {
    if (isMounted()) {
      setContentSize({ width, height });
    }
  }, [isMounted]);

  const scrollToCursor = useCallback(() => {
    if (Platform.OS !== 'web' && textInputRef.current) {
      // For native platforms
      textInputRef.current.scrollToEnd({ animated: false });
    } else if (Platform.OS === 'web' && inputRef.current) {
      // For web platform
      try {
        const element = inputRef.current as unknown as HTMLElement;
        const textArea = element.querySelector('textarea');
        if (textArea) {
          textArea.scrollTop = textArea.scrollHeight;
        }
      } catch (error) {
        console.error('Error scrolling to cursor:', error);
      }
    }
  }, []);

  // Add this effect to handle text changes and scrolling
  useEffect(() => {
    // Small delay to ensure the text has rendered
    const timer = setTimeout(() => {
      scrollToCursor();
    }, 50);
    
    return () => clearTimeout(timer);
  }, [text, scrollToCursor]);

  // Handle screen dimension changes
  useEffect(() => {
    if (!isMounted() || abortControllerRef.current?.signal.aborted) return;

    const handleDimensionChange = () => {
      const dimensionsChanged = 
        previousDimensions.current.width !== dimensions.width ||
        previousDimensions.current.height !== dimensions.height;

      if (dimensionsChanged && isMounted()) {
        setContainerSize({
          width: dimensions.width,
          height: dimensions.height
        });
        
        const adjustedHeight = dimensions.height - keyboardHeight;
        if (adjustedHeight > 0) {
          debouncedCalculate(
            text, 
            { width: dimensions.width, height: dimensions.height }, 
            contentSize, 
            adjustedHeight
          );
        }
        
        previousDimensions.current = dimensions;
      }
    };

    handleDimensionChange();

    return () => {
      debouncedCalculate.cancel();
    };
  }, [dimensions, keyboardHeight, text, contentSize, debouncedCalculate, isMounted]);

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

  // Memoize dynamic styles to prevent unnecessary recalculations
  const dynamicStyles = useMemo(() => ({
    fontSize: fontSize * (adjustedContainerHeight / 100),
    lineHeight: fontSize * (adjustedContainerHeight / 100) * 1.2,
    maxHeight: keyboardVisible ? `${100 - (keyboardHeight / dimensions.height * 100)}%` : '100%',
    color: theme.colors.onBackground,
    backgroundColor: theme.colors.background,
  }), [fontSize, adjustedContainerHeight, keyboardVisible, keyboardHeight, dimensions.height, theme.colors]);

  // Memoize placeholder color
  const placeholderColor = useMemo(() => 
    `${theme.colors.onBackground}66`, // Adding 66 for 40% opacity
  [theme.colors.onBackground]);

  return (
    <TextInput
      ref={(ref) => {
        inputRef.current = ref;
        textInputRef.current = ref;
      }}
      testID="big-text-display"
      mode="flat"
      accessibilityLabel="Main text input"
      accessibilityHint="Enter your text here. Text will automatically resize to fit the screen"
      accessibilityRole="textbox"
      accessibilityState={{ 
        disabled: false,
        editable: true,
        multiline: true
      }}
      style={[
        styles.container,
        dynamicStyles,
        Platform.OS === 'web' ? styles.webTextStyles : {}
      ]}
      value={text}
      onChangeText={(newText) => {
        onChangeText(newText);
        // Schedule a scroll after the text changes
        setTimeout(scrollToCursor, 10);
      }}
      multiline
      placeholder={t('typeHere')}
      placeholderTextColor={placeholderColor}
      onLayout={onLayout}
      onContentSizeChange={(e) => {
        onContentSizeChange(e.nativeEvent.contentSize.width, e.nativeEvent.contentSize.height);
        // Also scroll when content size changes
        scrollToCursor();
      }}
      autoCorrect={false}
      keyboardType={Platform.OS === 'ios' ? 'default' : 'visible-password'} // Prevents Android keyboard from jumping
      scrollEnabled={true}
      blurOnSubmit={false}
      textAlignVertical="top"
    />
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
    fontWeight: "bold",
    fontFamily: 'System',  // System font, similar to sans-serif
    textAlign: "left",
    padding: 20,
    paddingBottom: 50,
    margin: 0,
    zIndex: 10,
  },
  webTextStyles: {
    wordBreak: 'break-word',
    overflowWrap: 'break-word',
    whiteSpace: 'pre-wrap',
  }
});

