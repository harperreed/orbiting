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
  maxFontSize = 48, 
  minFontSize = 24 
}: BigTextDisplayProps) {
  const { width, height } = useWindowDimensions();
  
  const fontSize = useMemo(() => {
    const baseSize = maxFontSize;
    const reduction = Math.max(0, text.length - 10) * 2;
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
    />
  );
}

const styles = StyleSheet.create({
  text: {
    flex: 1,
    width: '100%',
    fontWeight: "bold",
    textAlign: "center",
    padding: 20,
  },
});
