import { StyleSheet, View, Linking } from "react-native";
import {
    Surface,
    Text,
    List,
    Card,
    useTheme,
    Divider,
} from "react-native-paper";
import { useTranslation } from 'react-i18next';
import PageLayout from "./components/PageLayout";

export default function HelpScreen() {
    const { t } = useTranslation();
    const theme = useTheme();

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
                            {t('welcomeToOrbiting')}
                        </Text>
                        <Text variant="bodyLarge">
                            {t('appDescription')}
                        </Text>
                    </Card.Content>
                </Card>

                {/* Quick Start Guide */}
                <Surface style={styles.listSection}>
                    <Text style={styles.sectionTitle}>{t('quickStartGuide')}</Text>
                    <List.Item
                        style={styles.listItem}
                        title={t('tapAndType')}
                        description={t('tapAndTypeDesc')}
                        left={(props) => (
                            <List.Icon {...props} icon="gesture-tap" />
                        )}
                    />
                    <Divider style={styles.divider} />
                    <List.Item
                        style={styles.listItem}
                        title={t('swipeLeft')}
                        description={t('swipeLeftDesc')}
                        left={(props) => (
                            <List.Icon {...props} icon="gesture-swipe-left" />
                        )}
                    />
                    <Divider style={styles.divider} />
                    <List.Item
                        style={styles.listItem}
                        title={t('swipeRight')}
                        description={t('swipeRightDesc')}
                        left={(props) => (
                            <List.Icon {...props} icon="gesture-swipe-right" />
                        )}
                    />
                    <Divider style={styles.divider} />
                    <List.Item
                        style={styles.listItem}
                        title={t('swipeUp')}
                        description={t('swipeUpDesc')}
                        left={(props) => (
                            <List.Icon {...props} icon="gesture-swipe-up" />
                        )}
                    />
                    <Divider style={styles.divider} />
                    <List.Item
                        style={styles.listItem}
                        title={t('crossPlatform')}
                        description={t('crossPlatformDesc')}
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
                        title={t('autoScaling')}
                        description={t('autoScalingDesc')}
                        left={(props) => (
                            <List.Icon {...props} icon="format-size" />
                        )}
                    />
                    <Divider style={styles.divider} />
                    <List.Item
                        style={styles.listItem}
                        title={t('messageHistory')}
                        description={t('messageHistoryDesc')}
                        left={(props) => (
                            <List.Icon {...props} icon="history" />
                        )}
                    />
                    <Divider style={styles.divider} />
                    <List.Item
                        style={styles.listItem}
                        title={t('autoSaving')}
                        description={t('autoSavingDesc')}
                        left={(props) => (
                            <List.Icon {...props} icon="content-save" />
                        )}
                    />
                </Surface>

                {/* Pro Tips */}
                <Surface style={styles.listSection}>
                    <Text style={styles.subsectionTitle}>{t('proTips')}</Text>
                    <List.Item
                        style={styles.listItem}
                        title={t('addToHomescreen')}
                        description={t('addToHomescreenDesc')}
                        left={(props) => <List.Icon {...props} icon="home" />}
                    />
                    <Divider style={styles.divider} />
                    <List.Item
                        style={styles.listItem}
                        title={t('quickLoad')}
                        description={t('quickLoadDesc')}
                        left={(props) => (
                            <List.Icon {...props} icon="gesture-tap" />
                        )}
                    />
                    <Divider style={styles.divider} />
                    <List.Item
                        style={styles.listItem}
                        title={t('textWrapping')}
                        description={t('textWrappingDesc')}
                        left={(props) => <List.Icon {...props} icon="wrap" />}
                    />
                </Surface>

                {/* About Section */}
                <Surface style={styles.listSection}>
                    <Text style={styles.sectionTitle}>{t('about')}</Text>
                    <Text style={styles.paragraph}>
                        {t('aboutText', {
                            author1: (
                                <Text
                                    style={styles.link}
                                    onPress={() => handleNamePress("Christine_Sun_Kim")}
                                >
                                    Christine Sun Kim
                                </Text>
                            ),
                            author2: (
                                <Text
                                    style={styles.link}
                                    onPress={() => handleNamePress("Harper_Reed")}
                                >
                                    Harper Reed
                                </Text>
                            )
                        })}
                    </Text>
                    <Text style={styles.paragraph}>
                        {t('feedbackText')}{" "}
                        <Text style={styles.link} onPress={handleEmailPress}>
                            {t('feedbackEmail')}
                        </Text>
                    </Text>
                </Surface>
            </View>
        </PageLayout>
    );
}
