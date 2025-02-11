import { View, StyleSheet } from "react-native";
import { useState, useCallback, useEffect } from "react";
import { useLocalSearchParams, router } from "expo-router";
import { GestureDetector, Gesture } from "react-native-gesture-handler";
import BigTextDisplay from "./BigTextDisplay";
import { storeMessage } from "../utils/storage";

export default function HomeScreen() {
  const [text, setText] = useState("");
  const { text: paramText } = useLocalSearchParams<{ text?: string }>();

  useEffect(() => {
    if (paramText) {
      setText(paramText);
    }
  }, [paramText]);

  const handleTextChange = useCallback(async (newText: string) => {
    setText(newText);
    try {
      await storeMessage(newText);
    } catch (error) {
      console.error('Failed to store message:', error);
    }
  }, []);

  const swipeLeft = Gesture.Fling()
    .direction('left')
    .onEnd(() => {
      setText('');
    });

  const swipeUp = Gesture.Fling()
    .direction('up')
    .onEnd(() => {
      router.push('/history');
    });

  const gestures = Gesture.Race(swipeLeft, swipeUp);

  return (
    <GestureDetector gesture={gestures}>
      <View style={styles.container}>
        <BigTextDisplay 
          text={text}
          onChangeText={handleTextChange}
        />
      </View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
