import { Text, StyleSheet } from "react-native";

type BigTextDisplayProps = {
  text: string;
};

export default function BigTextDisplay({ text }: BigTextDisplayProps) {
  return <Text style={styles.text}>{text}</Text>;
}

const styles = StyleSheet.create({
  text: {
    fontSize: 48,
    fontWeight: "bold",
    textAlign: "center",
    padding: 20,
  },
});
