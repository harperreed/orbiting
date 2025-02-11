import React, { useState, useEffect } from "react";
import { Modal, Portal, Text, Button, useTheme } from "react-native-paper";
import { StyleSheet, View, Platform, Linking } from "react-native";
import Cookies from "js-cookie";

const WELCOME_COOKIE = "orbiting-welcome-shown";

export function WelcomeModal() {
    const [visible, setVisible] = useState(false);
    const theme = useTheme();

    useEffect(() => {
        if (Platform.OS === "web") {
            const hasSeenWelcome = Cookies.get(WELCOME_COOKIE);
            if (!hasSeenWelcome) {
                setVisible(true);
            }
        }
    }, []);

    const hideModal = () => {
        setVisible(false);
        if (Platform.OS === "web") {
            Cookies.set(WELCOME_COOKIE, "true", { expires: 365 });
        }
    };

    const handleEmailPress = () => {
        Linking.openURL("mailto:feedback@orbiting.com");
    };

    const handleWikiPress = (name) => {
        Linking.openURL(`https://en.wikipedia.org/wiki/${name}`);
    };

    const styles = StyleSheet.create({
        modalContainer: {
            backgroundColor: theme.colors.background,
            padding: 24,
            margin: 20,
            borderRadius: 8,
            maxWidth: 600,
            maxHeight: "90%",
            alignSelf: "center",
            overflow: "auto",
        },
        title: {
            fontSize: 28,
            fontWeight: "bold",
            marginBottom: 16,
        },
        subtitle: {
            fontSize: 24,
            fontWeight: "bold",
            marginTop: 24,
            marginBottom: 16,
        },
        content: {
            fontSize: 16,
            lineHeight: 24,
            marginBottom: 8,
        },
        listItem: {
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 2,
            paddingLeft: 16,
        },
        divider: {
            height: 1,
            backgroundColor: theme.colors.outline,
            marginVertical: 8,
        },
        link: {
            color: theme.colors.primary,
            textDecorationLine: "underline",
        },
        buttonContainer: {
            marginTop: 24,
        },
    });

    return (
        <Portal>
            <Modal
                visible={visible}
                onDismiss={hideModal}
                contentContainerStyle={styles.modalContainer}
            >
                <Text style={styles.title}>Welcome to Orbiting</Text>

                <Text style={styles.content}>
                    A simple messaging app for your eyeballs. You can use it to
                    type and display the message to those around you. Display a
                    message loud and clear.
                </Text>

                <Text style={styles.subtitle}>Orbiting is simple to use.</Text>

                <View style={styles.listItem}>
                    <Text style={styles.content}>
                        • Tap and start typing. Your message will display loud
                        and clear!
                    </Text>
                </View>
                <View style={styles.listItem}>
                    <Text style={styles.content}>
                        • To clear the display - ⬅️ swipe left
                    </Text>
                </View>
                <View style={styles.listItem}>
                    <Text style={styles.content}>
                        • To view the menu and settings - ➡️ swipe right
                    </Text>
                </View>
                <View style={styles.listItem}>
                    <Text style={styles.content}>
                        • To display the history - ⬆️ swipe up
                    </Text>
                </View>
                <View style={styles.listItem}>
                    <Text style={styles.content}>
                        • You can use it on desktop or mobile
                    </Text>
                </View>

                <View style={styles.divider} />

                <Text style={styles.content}>
                    Please send us feedback. We want it!{" "}
                    <Text style={styles.link} onPress={handleEmailPress}>
                        feedback@orbiting.com
                    </Text>
                </Text>

                <View style={styles.buttonContainer}>
                    <Button mode="contained" onPress={hideModal}>
                        Get Started
                    </Button>
                </View>
            </Modal>
        </Portal>
    );
}

export default WelcomeModal;
