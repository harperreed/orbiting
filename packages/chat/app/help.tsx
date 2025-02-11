import { StyleSheet } from "react-native";
import { View, Text, ListItem } from "react-native-ui-lib";
import PageLayout from "./components/PageLayout";

export default function HelpScreen() {
    return (
        <PageLayout scrollable>
            <View style={styles.section}>
                <Text text50 marginB-s4>About Orbiting</Text>
                <View marginB-s4>
                    <Text text60>A simple messaging app for your eyeballs</Text>
                    <Text text70>You can use it to type and display messages to those around you. Display a message loud and clear.</Text>
                </View>
            </View>

            <View style={styles.section}>
                <Text text50 marginB-s4>Gestures</Text>
                <ListItem
                    title="Swipe Left"
                    subtitle="To clear the display"
                />
                <ListItem
                    title="Swipe Right"
                    subtitle="To view the menu and settings"
                />
                <ListItem
                    title="Swipe Up"
                    subtitle="To display the history"
                />
            </View>

            <View style={styles.section}>
                <Text text50 marginB-s4>How to Use</Text>
                <ListItem
                    title="Type or paste your text in the main screen"
                />
                <ListItem
                    title="Text will automatically adjust its size to fit"
                />
                <ListItem
                    title="All text is automatically saved"
                />
                <ListItem
                    title="Switch tabs to access History or Help"
                />
            </View>

            <View style={styles.section}>
                <Text text50 marginB-s4>Features</Text>
                <ListItem
                    title="Auto-scaling text size"
                />
                <ListItem
                    title="Message history"
                />
                <ListItem
                    title="Quick message recall"
                />
                <ListItem
                    title="Automatic saving"
                />
            </View>

            <View style={styles.section}>
                <Text text50 marginB-s4>Tips</Text>
                <ListItem
                    title="Tap any message in History to load it"
                />
                <ListItem
                    title="Use Clear History to remove all saved messages"
                />
                <ListItem
                    title="Text wraps automatically on whitespace"
                />
                <ListItem
                    title="Available on desktop and mobile"
                    subtitle="You can add the app to your homescreen and launch it anytime"
                />
            </View>
        </PageLayout>
    );
}

const styles = StyleSheet.create({
    section: {
        marginBottom: 30,
        padding: 16,
    }
});
