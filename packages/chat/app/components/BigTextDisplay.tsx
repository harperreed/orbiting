import { Text, StyleSheet, Dimensions, useWindowDimensions } from "react-native";
import { useMemo } from "react";

type BigTextDisplayProps = {
  text: string;
  maxFontSize?: number;
  minFontSize?: number;
};

export default function BigTextDisplay({ 
  text, 
  maxFontSize = 48, 
  minFontSize = 24 
}: BigTextDisplayProps) {
  const { width } = useWindowDimensions();
  
  const fontSize = useMemo(() => {
    const baseSize = maxFontSize;
    const reduction = Math.max(0, text.length - 10) * 2; // Reduce size for each character after 10
    const calculatedSize = baseSize - reduction;
    return Math.max(minFontSize, calculatedSize);
  }, [text, maxFontSize, minFontSize]);

  return (
    <Text 
      testID="big-text-display" 
      style={[styles.text, { fontSize }]}
    >
      {text}
    </Text>
  );
}

const styles = StyleSheet.create({
  text: {
    fontWeight: "bold",
    textAlign: "center",
    padding: 20,
  },
});
