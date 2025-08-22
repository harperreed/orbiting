import React, { useState, useEffect } from "react";
import { Modal, Portal, Text, Button, useTheme } from "react-native-paper";
import { StyleSheet, View, Platform, Linking } from "react-native";
import Cookies from "js-cookie";
import { useTranslation } from 'react-i18next';
import { InstallPWA } from "./InstallPWA";

const WELCOME_COOKIE = "orbiting-welcome-shown";

export function WelcomeModal() {
    const [visible, setVisible] = useState(false);
    const theme = useTheme();
    const { t } = useTranslation();

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

            // Check if the app is already installed on iOS
            if ('standalone' in window.navigator && (window.navigator as any).standalone === true) {
                setVisible(false);
            }

            // Check if the app is already installed on Android
            if (window.matchMedia('(display-mode: standalone)').matches) {
                setVisible(false);
            }
        }
    }, []);

    const hideModal = () => {
        setVisible(false);
        if (Platform.OS === "web") {
            Cookies.set(WELCOME_COOKIE, "true", { expires: 365 });
        }
    };

    const handleFeedbackPress = () => {
        Linking.openURL("https://docs.google.com/forms/d/e/1FAIpQLSfkRKAA3BGZldZTnJmv2qAEuvVSwnRF4YSw_50jrBd69b1rzg/viewform");
    };

    const handleEmailPress = () => {
        Linking.openURL("mailto:feedback@orbiting.com");
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
                <Text style={styles.title as any}>{t('welcomeToOrbiting')}</Text>

                <Text style={styles.content as any}>
                    {t('appDescription')}
                </Text>

                <Text style={styles.subtitle as any}>
                    {t('quickStartGuide')}
                </Text>

                <View style={styles.listItem as any}>
                    <Text style={styles.content as any}>
                        • {t('tapAndTypeDesc')}
                    </Text>
                </View>
                <View style={styles.listItem as any}>
                    <Text style={styles.content as any}>
                        • {t('swipeLeftDesc')} - {t('swipeLeft')}
                    </Text>
                </View>
                <View style={styles.listItem as any}>
                    <Text style={styles.content as any}>
                        • {t('swipeRightDesc')} - {t('swipeRight')}
                    </Text>
                </View>
                <View style={styles.listItem as any}>
                    <Text style={styles.content as any}>
                        • {t('swipeUpDesc')} - {t('swipeUp')}
                    </Text>
                </View>
                <View style={styles.listItem as any}>
                    <Text style={styles.content as any}>
                        • {t('crossPlatformDesc')}
                    </Text>
                </View>

                <View style={styles.divider as any} />

                <Text style={styles.content as any}>
                    {t('feedbackText')}{" "}
                    <Text style={styles.link as any} onPress={handleFeedbackPress}>
                        {t('feedbackLink')}
                    </Text>
                    {t('feedbackTextContinue')}
                </Text>

                {Platform.OS === "web" && (
                    <Text style={styles.content as any}>
                        💡 {t('addToHomescreenDesc')}
                    </Text>
                )}

                <View style={styles.buttonContainer as any}>
                    <Button mode="contained" onPress={hideModal}>
                        {t('welcome')}
                    </Button>
                    {Platform.OS === "web" && <InstallPWA />}
                </View>
            </Modal>
        </Portal>
    );
}
