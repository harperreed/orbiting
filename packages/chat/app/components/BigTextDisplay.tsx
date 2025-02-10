import { TextInput, StyleSheet, useWindowDimensions } from "react-native";
import { useMemo } from "react";

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
  
  const fontSize = useMemo(() => {
    const baseSize = maxFontSize;
    const reduction = Math.max(0, text.length - 5) * 4;
    const calculatedSize = baseSize - reduction;
    return Math.max(minFontSize, calculatedSize);
  }, [text, maxFontSize, minFontSize]);

  return (
    <TextInput
      testID="big-text-display"
      style={[styles.text, { fontSize }]}
      value={text}
      onChangeText={onChangeText}
      multiline
      placeholder="Type something..."
      selectionColor="#000"
      placeholderTextColor="#888"
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
    lineHeight: 38,  // Approximately 95% of default
    padding: 20,
    paddingBottom: 50,
    margin: 0,
    zIndex: 10,
  },
});
