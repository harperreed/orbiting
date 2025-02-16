import { StyleSheet, View, Linking } from "react-native";
import {
    Surface,
    Text,
    List,
    Card,
    useTheme,
    Divider,
} from "react-native-paper";
import PageLayout from "./components/PageLayout";
import { useTranslation } from 'react-i18next';

export default function HelpScreen() {
    const theme = useTheme();
    const { t } = useTranslation();

    const handleNamePress = (name) => {
        Linking.openURL(`https://en.wikipedia.org/wiki/${name}`);
    };

    const handleEmailPress = () => {
        Linking.openURL("mailto:feedback@orbiting.com");
    };

    const styles = StyleSheet.create({
        container: {
            gap: 16,
            padding: 16,
        },
        card: {
            marginBottom: 8,
        },
        cardContent: {
            padding: 8,
        },
        sectionTitle: {
            fontSize: 24,
            fontWeight: "bold",
            color: theme.colors.primary,
            paddingHorizontal: 16,
            paddingVertical: 12,
        },
        subsectionTitle: {
            fontSize: 20,
            fontWeight: "bold",
            color: theme.colors.primary,
            paddingHorizontal: 16,
            paddingVertical: 8,
        },
        listSection: {
            backgroundColor: theme.colors.background,
            borderRadius: theme.roundness,
            marginBottom: 8,
            elevation: 1,
        },
        listItem: {
            paddingVertical: 4,
        },
        description: {
            marginTop: 4,
            color: theme.colors.onSurfaceVariant,
        },
        divider: {
            marginVertical: 4,
        },
        link: {
            color: theme.colors.primary,
            textDecorationLine: "underline",
        },
        paragraph: {
            fontSize: 16,
            lineHeight: 24,
            marginBottom: 12,
            paddingHorizontal: 16,
        },
    });

    return (
        <PageLayout scrollable>
            <View style={styles.container}>
                {/* Welcome Section */}
                <Card style={styles.card}>
                    <Card.Content>
                        <Text
                            variant="headlineLarge"
                            style={{ marginBottom: 16 }}
                        >
                            {t('welcome')}
                        </Text>
                        <Text variant="bodyLarge">
                            {t('description')}
                        </Text>
                    </Card.Content>
                </Card>

                {/* Quick Start Guide */}
                <Surface style={styles.listSection}>
                    <Text style={styles.sectionTitle}>{t('quick_start')}</Text>
                    <List.Item
                        style={styles.listItem}
                        title={t('tap_to_type')}
                        description={t('tap_to_type_hint')}
                        left={(props) => (
                            <List.Icon {...props} icon="gesture-tap" />
                        )}
                    />
                    <Divider style={styles.divider} />
                    <List.Item
                        style={styles.listItem}
                        title={t('clear_display')}
                        description={t('clear_display_hint')}
                        left={(props) => (
                            <List.Icon {...props} icon="gesture-swipe-left" />
                        )}
                    />
                    <Divider style={styles.divider} />
                    <List.Item
                        style={styles.listItem}
                        title={t('view_menu')}
                        description={t('view_menu_hint')}
                        left={(props) => (
                            <List.Icon {...props} icon="gesture-swipe-right" />
                        )}
                    />
                    <Divider style={styles.divider} />
                    <List.Item
                        style={styles.listItem}
                        title={t('display_history')}
                        description={t('display_history_hint')}
                        left={(props) => (
                            <List.Icon {...props} icon="gesture-swipe-up" />
                        )}
                    />
                    <Divider style={styles.divider} />
                    <List.Item
                        style={styles.listItem}
                        title={t('cross_platform')}
                        description={t('cross_platform_hint')}
                        left={(props) => (
                            <List.Icon {...props} icon="devices" />
                        )}
                    />
                </Surface>

                {/* Features */}
                <Surface style={styles.listSection}>
                    <Text style={styles.subsectionTitle}>{t('features')}</Text>
                    <List.Item
                        style={styles.listItem}
                        title={t('auto_scaling')}
                        description={t('auto_scaling_hint')}
                        left={(props) => (
                            <List.Icon {...props} icon="format-size" />
                        )}
                    />
                    <Divider style={styles.divider} />
                    <List.Item
                        style={styles.listItem}
                        title={t('message_history')}
                        description={t('message_history_hint')}
                        left={(props) => (
                            <List.Icon {...props} icon="history" />
                        )}
                    />
                    <Divider style={styles.divider} />
                    <List.Item
                        style={styles.listItem}
                        title={t('auto_saving')}
                        description={t('auto_saving_hint')}
                        left={(props) => (
                            <List.Icon {...props} icon="content-save" />
                        )}
                    />
                </Surface>

                {/* Pro Tips */}
                <Surface style={styles.listSection}>
                    <Text style={styles.subsectionTitle}>{t('pro_tips')}</Text>
                    <List.Item
                        style={styles.listItem}
                        title={t('add_to_homescreen')}
                        description={t('add_to_homescreen_hint')}
                        left={(props) => <List.Icon {...props} icon="home" />}
                    />
                    <Divider style={styles.divider} />
                    <List.Item
                        style={styles.listItem}
                        title={t('quick_load')}
                        description={t('quick_load_hint')}
                        left={(props) => (
                            <List.Icon {...props} icon="gesture-tap" />
                        )}
                    />
                    <Divider style={styles.divider} />
                    <List.Item
                        style={styles.listItem}
                        title={t('text_wrapping')}
                        description={t('text_wrapping_hint')}
                        left={(props) => <List.Icon {...props} icon="wrap" />}
                    />
                </Surface>

                {/* About Section */}
                <Surface style={styles.listSection}>
                    <Text style={styles.sectionTitle}>{t('about')}</Text>
                    <Text style={styles.paragraph}>
                        {t('created_by')}{" "}
                        <Text
                            style={styles.link}
                            onPress={() => handleNamePress("Christine_Sun_Kim")}
                        >
                            Christine Sun Kim
                        </Text>{" "}
                        and{" "}
                        <Text
                            style={styles.link}
                            onPress={() => handleNamePress("Harper_Reed")}
                        >
                            Harper Reed
                        </Text>
                        . {t('inspired_by')}
                    </Text>
                    <Text style={styles.paragraph}>
                        {t('send_feedback')}{" "}
                        <Text style={styles.link} onPress={handleEmailPress}>
                            {t('feedback_email')}
                        </Text>
                    </Text>
                </Surface>
            </View>
        </PageLayout>
    );
}
