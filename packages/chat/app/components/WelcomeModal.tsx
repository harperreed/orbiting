import React, { useState, useEffect } from "react";
import { Modal, Portal, Text, Button, useTheme } from "react-native-paper";
import { StyleSheet, View, Platform, Linking } from "react-native";
import Cookies from "js-cookie";
import { InstallPWA } from "./InstallPWA";
import { useTranslation } from 'react-i18next';

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
                <Text style={styles.title as any}>{t('welcome')}</Text>

                <Text style={styles.content as any}>
                    {t('description')}
                </Text>

                <Text style={styles.subtitle as any}>
                    {t('orbiting_simple')}
                </Text>

                <View style={styles.listItem as any}>
                    <Text style={styles.content as any}>
                        {t('tap_to_type')}
                    </Text>
                </View>
                <View style={styles.listItem as any}>
                    <Text style={styles.content as any}>
                        {t('clear_display')}
                    </Text>
                </View>
                <View style={styles.listItem as any}>
                    <Text style={styles.content as any}>
                        {t('view_menu')}
                    </Text>
                </View>
                <View style={styles.listItem as any}>
                    <Text style={styles.content as any}>
                        {t('display_history')}
                    </Text>
                </View>
                <View style={styles.listItem as any}>
                    <Text style={styles.content as any}>
                        {t('cross_platform')}
                    </Text>
                </View>

                <View style={styles.divider as any} />

                <Text style={styles.content as any}>
                    {t('send_feedback')}{" "}
                    <Text style={styles.link as any} onPress={handleEmailPress}>
                        {t('feedback_email')}
                    </Text>
                </Text>

                {Platform.OS === "web" && (
                    <Text style={styles.content as any}>
                        {t('pro_tip')}
                    </Text>
                )}

                <View style={styles.buttonContainer as any}>
                    <Button mode="contained" onPress={hideModal}>
                        {t('get_started')}
                    </Button>
                    {Platform.OS === "web" && <InstallPWA />}
                </View>
            </Modal>
        </Portal>
    );
}
