import { StyleSheet } from "react-native";
import { View, Text, ListItem, Colors } from "react-native-ui-lib";
import PageLayout from "./components/PageLayout";

export default function HelpScreen() {
    return (
        <PageLayout scrollable>
            <View style={styles.section}>
                <Text text50 style={styles.sectionHeader}>
                    About Orbiting
                </Text>
                <View style={styles.listItem}>
                    <Text text60>A simple messaging app for your eyeballs</Text>
                    <Text text70>
                        You can use it to type and display messages to those
                        around you. Display a message loud and clear.
                    </Text>
                </View>
            </View>

            <View style={styles.section}>
                <Text text50 style={styles.sectionHeader}>
                    Gestures
                </Text>

                <ListItem activeBackgroundColor={Colors.$backgroundDisabled}>
                    <ListItem.Part left>
                        <Text text70M>Swipe Left</Text>
                    </ListItem.Part>
                    <ListItem.Part middle>
                        <Text text70>To clear the display</Text>
                    </ListItem.Part>
                </ListItem>

                <ListItem activeBackgroundColor={Colors.$backgroundDisabled}>
                    <ListItem.Part left>
                        <Text text70M>Swipe Right</Text>
                    </ListItem.Part>
                    <ListItem.Part middle>
                        <Text text70>To view the menu and settings</Text>
                    </ListItem.Part>
                </ListItem>

                <ListItem activeBackgroundColor={Colors.$backgroundDisabled}>
                    <ListItem.Part left>
                        <Text text70M>Swipe Up</Text>
                    </ListItem.Part>
                    <ListItem.Part middle>
                        <Text text70>To display the history</Text>
                    </ListItem.Part>
                </ListItem>
            </View>

            <View style={styles.section}>
                <Text text50 style={styles.sectionHeader}>
                    How to Use
                </Text>

                <ListItem activeBackgroundColor={Colors.$backgroundDisabled}>
                    <ListItem.Part>
                        <Text text70>
                            Type or paste your text in the main screen
                        </Text>
                    </ListItem.Part>
                </ListItem>

                <ListItem activeBackgroundColor={Colors.$backgroundDisabled}>
                    <ListItem.Part>
                        <Text text70>
                            Text will automatically adjust its size to fit
                        </Text>
                    </ListItem.Part>
                </ListItem>

                <ListItem activeBackgroundColor={Colors.$backgroundDisabled}>
                    <ListItem.Part>
                        <Text text70>All text is automatically saved</Text>
                    </ListItem.Part>
                </ListItem>

                <ListItem activeBackgroundColor={Colors.$backgroundDisabled}>
                    <ListItem.Part>
                        <Text text70>
                            Switch tabs to access History or Help
                        </Text>
                    </ListItem.Part>
                </ListItem>
            </View>

            <View style={styles.section}>
                <Text text50 style={styles.sectionHeader}>
                    Features
                </Text>

                <ListItem activeBackgroundColor={Colors.$backgroundDisabled}>
                    <ListItem.Part>
                        <Text text70>Auto-scaling text size</Text>
                    </ListItem.Part>
                </ListItem>

                <ListItem activeBackgroundColor={Colors.$backgroundDisabled}>
                    <ListItem.Part>
                        <Text text70>Message history</Text>
                    </ListItem.Part>
                </ListItem>

                <ListItem activeBackgroundColor={Colors.$backgroundDisabled}>
                    <ListItem.Part>
                        <Text text70>Quick message recall</Text>
                    </ListItem.Part>
                </ListItem>

                <ListItem activeBackgroundColor={Colors.$backgroundDisabled}>
                    <ListItem.Part>
                        <Text text70>Automatic saving</Text>
                    </ListItem.Part>
                </ListItem>
            </View>

            <View style={styles.section}>
                <Text text50 style={styles.sectionHeader}>
                    Tips
                </Text>

                <ListItem activeBackgroundColor={Colors.$backgroundDisabled}>
                    <ListItem.Part>
                        <Text text70>
                            Tap any message in History to load it
                        </Text>
                    </ListItem.Part>
                </ListItem>

                <ListItem activeBackgroundColor={Colors.$backgroundDisabled}>
                    <ListItem.Part>
                        <Text text70>
                            Use Clear History to remove all saved messages
                        </Text>
                    </ListItem.Part>
                </ListItem>

                <ListItem activeBackgroundColor={Colors.$backgroundDisabled}>
                    <ListItem.Part>
                        <Text text70>
                            Text wraps automatically on whitespace
                        </Text>
                    </ListItem.Part>
                </ListItem>

                <ListItem activeBackgroundColor={Colors.$backgroundDisabled}>
                    <ListItem.Part>
                        <Text text70>Available on desktop and mobile</Text>
                    </ListItem.Part>
                    <ListItem.Part>
                        <Text text70>
                            You can add the app to your homescreen and launch it
                            anytime
                        </Text>
                    </ListItem.Part>
                </ListItem>
            </View>
        </PageLayout>
    );
}

const styles = StyleSheet.create({
    section: {
        marginBottom: 30,
        padding: 16,
    },
    sectionHeader: {
        marginBottom: 15,
        color: Colors.$textPrimary,
    },
    listItem: {
        marginBottom: 10,
    },
});
