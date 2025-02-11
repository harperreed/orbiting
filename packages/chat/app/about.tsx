import { StyleSheet, Linking } from "react-native";
import { Surface, Text } from "react-native-paper";
import PageLayout from "./components/PageLayout";

export default function AboutScreen() {
    const handleNamePress = (name) => {
        Linking.openURL(`https://en.wikipedia.org/wiki/${name}`);
    };

    const handleEmailPress = () => {
        Linking.openURL("mailto:feedback@orbiting.com");
    };

    return (
        <PageLayout>
            <Surface style={styles.centered} elevation={1}>
                <Text variant="displaySmall" style={styles.title}>
                    About
                </Text>

                <Text variant="bodyLarge" style={styles.paragraph}>
                    Orbiting was created by{" "}
                    <Text
                        variant="bodyLarge"
                        style={styles.link}
                        onPress={() => handleNamePress("Christine_Sun_Kim")}
                    >
                        Christine Sun Kim
                    </Text>{" "}
                    and{" "}
                    <Text
                        variant="bodyLarge"
                        style={styles.link}
                        onPress={() => handleNamePress("Harper_Reed")}
                    >
                        Harper Reed
                    </Text>
                    . It was inspired by the need to communicate with people in
                    the same space, but with different communications needs.
                </Text>

                <Text variant="bodyLarge" style={styles.paragraph}>
                    Please send us feedback. We want it!{" "}
                    <Text
                        variant="bodyLarge"
                        style={styles.link}
                        onPress={handleEmailPress}
                    >
                        feedback@orbiting.com
                    </Text>
                </Text>
            </Surface>
        </PageLayout>
    );
}

const styles = StyleSheet.create({
    centered: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    title: {
        marginBottom: 24,
    },
    paragraph: {
        textAlign: "center",
        marginBottom: 16,
        lineHeight: 24,
    },
    link: {
        textDecorationLine: "underline",
        color: "#1976D2", // Material Design blue
    },
});
