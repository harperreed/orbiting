import { View, StyleSheet } from "react-native";
import { useState } from "react";
import BigTextDisplay from "./BigTextDisplay";

export default function HomeScreen() {
  const [text, setText] = useState("Hello Orbiting!");

  return (
    <View style={styles.container}>
      <BigTextDisplay 
        text={text}
        onChangeText={setText}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
