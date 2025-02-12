import React, { useState, useEffect } from "react";
import { Modal, Portal, Text, Button, useTheme } from "react-native-paper";
import { StyleSheet, View, Platform, Linking } from "react-native";
import Cookies from "js-cookie";
import { InstallPWA } from "./InstallPWA";

const WELCOME_COOKIE = "orbiting-welcome-shown";

export function WelcomeModal() {
    const [visible, setVisible] = useState(false);
    const theme = useTheme();

    useEffect(() => {
        if (Platform.OS === "web") {
            try {
                const hasSeenWelcome = Cookies.get(WELCOME_COOKIE);
                if (!hasSeenWelcome) {
                    setVisible(true);
                }
            } catch (error) {
                console.error("Failed to check welcome cookie:", error);
                setVisible(true); // Show modal on error as fallback
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

    const handleWikiPress = (name: string) => {
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
            overflow: "scroll",
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
                contentContainerStyle={styles.modalContainer as any}
            >
                <Text style={styles.title as any}>Welcome to Orbiting</Text>

                <Text style={styles.content as any}>
                    A simple messaging app for your eyeballs. You can use it to
                    type and display the message to those around you. Display a
                    message loud and clear.
                </Text>

                <Text style={styles.subtitle as any}>
                    Orbiting is simple to use.
                </Text>

                <View style={styles.listItem as any}>
                    <Text style={styles.content as any}>
                        • Tap and start typing. Your message will display loud
                        and clear!
                    </Text>
                </View>
                <View style={styles.listItem as any}>
                    <Text style={styles.content as any}>
                        • To clear the display - ⬅️ swipe left
                    </Text>
                </View>
                <View style={styles.listItem as any}>
                    <Text style={styles.content as any}>
                        • To view the menu and settings - ➡️ swipe right
                    </Text>
                </View>
                <View style={styles.listItem as any}>
                    <Text style={styles.content as any}>
                        • To display the history - ⬆️ swipe up
                    </Text>
                </View>
                <View style={styles.listItem as any}>
                    <Text style={styles.content as any}>
                        • You can use it on desktop or mobile
                    </Text>
                </View>

                <View style={styles.divider as any} />

                <Text style={styles.content as any}>
                    Please send us feedback. We want it!{" "}
                    <Text style={styles.link as any} onPress={handleEmailPress}>
                        feedback@orbiting.com
                    </Text>
                </Text>

                {Platform.OS === "web" && (
                    <Text style={styles.content as any}>
                        💡 Pro tip: Install Orbiting as an app on your device
                        for the best experience!
                    </Text>
                )}

                <View style={styles.buttonContainer as any}>
                    <Button mode="contained" onPress={hideModal}>
                        Get Started
                    </Button>
                    {Platform.OS === "web" && <InstallPWA />}
                </View>
            </Modal>
        </Portal>
    );
}
