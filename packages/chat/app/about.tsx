import { StyleSheet, Linking } from "react-native";
import {
    Surface,
    Text,
    useTheme,
} from "react-native-paper";
import PageLayout from "./components/PageLayout";
import { useTranslation } from 'react-i18next';

export default function AboutScreen() {
    const theme = useTheme();
    const { t } = useTranslation();
    const handleNamePress = (name: string) => {
        Linking.openURL(`https://en.wikipedia.org/wiki/${name}`).catch((err) =>
            console.error("Failed to open Wikipedia:", err),
        );
    };

    const handleEmailPress = () => {
        Linking.openURL("mailto:feedback@orbiting.com");
    };

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
            color: theme.colors.primary,
        },
    });

    return (
        <PageLayout>
            <Surface style={styles.centered} elevation={1}>
                <Text variant="displaySmall" style={styles.title}>
                    {t('about')}
                </Text>

                <Text variant="bodyLarge" style={styles.paragraph}>
                    {t('created_by')}{" "}
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
                    . {t('inspired_by')}
                </Text>

                <Text variant="bodyLarge" style={styles.paragraph}>
                    {t('send_feedback')}{" "}
                    <Text
                        variant="bodyLarge"
                        style={styles.link}
                        onPress={handleEmailPress}
                    >
                        {t('feedback_email')}
                    </Text>
                </Text>
            </Surface>
        </PageLayout>
    );
}
