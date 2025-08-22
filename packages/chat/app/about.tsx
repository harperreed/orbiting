import { StyleSheet, Linking } from "react-native";
import {
    Surface,
    Text,
    useTheme,
} from "react-native-paper";
import { useTranslation } from 'react-i18next';
import PageLayout from "./components/PageLayout";

export default function AboutScreen() {
    const theme = useTheme();
    const { t } = useTranslation();
    const handleNamePress = (name: string) => {
        Linking.openURL(`https://en.wikipedia.org/wiki/${name}`).catch((err) =>
            console.error("Failed to open Wikipedia:", err),
        );
    };

    const handleFeedbackPress = () => {
        Linking.openURL("https://docs.google.com/forms/d/e/1FAIpQLSfkRKAA3BGZldZTnJmv2qAEuvVSwnRF4YSw_50jrBd69b1rzg/viewform");
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
                    {t('aboutText', {
                        author1: (
                            <Text
                                variant="bodyLarge"
                                style={styles.link}
                                onPress={() => handleNamePress("Christine_Sun_Kim")}
                            >
                                Christine Sun Kim
                            </Text>
                        ),
                        author2: (
                            <Text
                                variant="bodyLarge"
                                style={styles.link}
                                onPress={() => handleNamePress("Harper_Reed")}
                            >
                                Harper Reed
                            </Text>
                        )
                    })}
                </Text>

                <Text variant="bodyLarge" style={styles.paragraph}>
                    {t('feedbackText')}{" "}
                    <Text
                        variant="bodyLarge"
                        style={styles.link}
                        onPress={handleFeedbackPress}
                    >
                        {t('feedbackLink')}
                    </Text>
                    {t('feedbackTextContinue')}
                </Text>
            </Surface>
        </PageLayout>
    );
}
