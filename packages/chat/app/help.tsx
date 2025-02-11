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

export default function HelpScreen() {
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
                            Welcome to Orbiting
                        </Text>
                        <Text variant="bodyLarge">
                            A simple messaging app for your eyeballs. You can
                            use it to type and display messages to those around
                            you. Display a message loud and clear.
                        </Text>
                    </Card.Content>
                </Card>

                {/* Quick Start Guide */}
                <Surface style={styles.listSection}>
                    <Text style={styles.sectionTitle}>Quick Start Guide</Text>
                    <List.Item
                        style={styles.listItem}
                        title="✍️ Tap and start typing"
                        description="Your message will display loud and clear!"
                        left={(props) => (
                            <List.Icon {...props} icon="gesture-tap" />
                        )}
                    />
                    <Divider style={styles.divider} />
                    <List.Item
                        style={styles.listItem}
                        title="⬅️ Swipe Left"
                        description="To clear the display"
                        left={(props) => (
                            <List.Icon {...props} icon="gesture-swipe-left" />
                        )}
                    />
                    <Divider style={styles.divider} />
                    <List.Item
                        style={styles.listItem}
                        title="➡️ Swipe Right"
                        description="To view the menu and settings"
                        left={(props) => (
                            <List.Icon {...props} icon="gesture-swipe-right" />
                        )}
                    />
                    <Divider style={styles.divider} />
                    <List.Item
                        style={styles.listItem}
                        title="⬆️ Swipe Up"
                        description="To display the history"
                        left={(props) => (
                            <List.Icon {...props} icon="gesture-swipe-up" />
                        )}
                    />
                    <Divider style={styles.divider} />
                    <List.Item
                        style={styles.listItem}
                        title="📱 Cross-Platform"
                        description="Works on both desktop and mobile"
                        left={(props) => (
                            <List.Icon {...props} icon="devices" />
                        )}
                    />
                </Surface>

                {/* Features */}
                <Surface style={styles.listSection}>
                    <Text style={styles.subsectionTitle}>Features</Text>
                    <List.Item
                        style={styles.listItem}
                        title="Auto-scaling text size"
                        description="Text automatically adjusts to fit the screen"
                        left={(props) => (
                            <List.Icon {...props} icon="format-size" />
                        )}
                    />
                    <Divider style={styles.divider} />
                    <List.Item
                        style={styles.listItem}
                        title="Message history"
                        description="Access your previous messages easily"
                        left={(props) => (
                            <List.Icon {...props} icon="history" />
                        )}
                    />
                    <Divider style={styles.divider} />
                    <List.Item
                        style={styles.listItem}
                        title="Automatic saving"
                        description="All messages are saved automatically"
                        left={(props) => (
                            <List.Icon {...props} icon="content-save" />
                        )}
                    />
                </Surface>

                {/* Pro Tips */}
                <Surface style={styles.listSection}>
                    <Text style={styles.subsectionTitle}>Pro Tips</Text>
                    <List.Item
                        style={styles.listItem}
                        title="Add to Homescreen"
                        description="Install the app for quick access anytime"
                        left={(props) => <List.Icon {...props} icon="home" />}
                    />
                    <Divider style={styles.divider} />
                    <List.Item
                        style={styles.listItem}
                        title="Quick Load"
                        description="Tap any message in History to load it"
                        left={(props) => (
                            <List.Icon {...props} icon="gesture-tap" />
                        )}
                    />
                    <Divider style={styles.divider} />
                    <List.Item
                        style={styles.listItem}
                        title="Text Wrapping"
                        description="Messages automatically wrap on whitespace"
                        left={(props) => <List.Icon {...props} icon="wrap" />}
                    />
                </Surface>

                {/* About Section */}
                <Surface style={styles.listSection}>
                    <Text style={styles.sectionTitle}>About</Text>
                    <Text style={styles.paragraph}>
                        Orbiting was created by{" "}
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
                        . It was inspired by the need to communicate with people
                        in the same space, but with different communications
                        needs.
                    </Text>
                    <Text style={styles.paragraph}>
                        Please send us feedback. We want it!{" "}
                        <Text style={styles.link} onPress={handleEmailPress}>
                            feedback@orbiting.com
                        </Text>
                    </Text>
                </Surface>
            </View>
        </PageLayout>
    );
}
