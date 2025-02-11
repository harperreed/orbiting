import { StyleSheet } from "react-native";
import { Surface, Text, List } from "react-native-paper";
import PageLayout from "./components/PageLayout";

export default function HelpScreen() {
    return (
        <PageLayout scrollable>
            <List.Section>
                <List.Subheader style={{ fontSize: 20 }}>How to Use</List.Subheader>
                <List.Item
                    title="Type or paste your text in the main screen"
                    left={props => <List.Icon {...props} icon="text" />}
                />
                <List.Item
                    title="Text will automatically adjust its size to fit"
                    left={props => <List.Icon {...props} icon="format-size" />}
                />
                <List.Item
                    title="All text is automatically saved"
                    left={props => <List.Icon {...props} icon="content-save" />}
                />
                <List.Item
                    title="Switch tabs to access History or Help"
                    left={props => <List.Icon {...props} icon="tab" />}
                />
            </List.Section>

            <List.Section>
                <List.Subheader style={{ fontSize: 20 }}>Features</List.Subheader>
                <List.Item
                    title="Auto-scaling text size"
                    left={props => <List.Icon {...props} icon="format-size" />}
                />
                <List.Item
                    title="Message history"
                    left={props => <List.Icon {...props} icon="history" />}
                />
                <List.Item
                    title="Quick message recall"
                    left={props => <List.Icon {...props} icon="refresh" />}
                />
                <List.Item
                    title="Automatic saving"
                    left={props => <List.Icon {...props} icon="content-save" />}
                />
            </List.Section>

            <List.Section>
                <List.Subheader style={{ fontSize: 20 }}>Tips</List.Subheader>
                <List.Item
                    title="Tap any message in History to load it"
                    left={props => <List.Icon {...props} icon="gesture-tap" />}
                />
                <List.Item
                    title="Use Clear History to remove all saved messages"
                    left={props => <List.Icon {...props} icon="delete" />}
                />
                <List.Item
                    title="Text wraps automatically on whitespace"
                    left={props => <List.Icon {...props} icon="wrap" />}
                />
            </List.Section>
        </PageLayout>
    );
}

const styles = StyleSheet.create({
    section: {
        marginBottom: 30,
        padding: 16,
    },
    title: {
        marginBottom: 15,
    },
    text: {
        lineHeight: 24,
    },
});
