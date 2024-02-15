import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
    StyleSheet,
    TextInput,
    View,
    useColorScheme,
    Platform,
} from "react-native";
import { FAB } from "react-native-paper";
import { useSwipe } from "../hooks/useSwipe";
import { StateContext } from "../StateContext";

function Editor({ navigation }) {
    const colorScheme = useColorScheme();

    const themeTextStyle =
        colorScheme === "light" ? styles.lightThemeText : styles.darkThemeText;
    const themeFabStyle =
        colorScheme === "light" ? styles.lightThemeFab : styles.darkThemeFab;
    const themeContainerStyle =
        colorScheme === "light" ? styles.lightContainer : styles.darkContainer;
    const fabVisible = Platform.OS === "web" ? true : false;

    // Context for managing editor state
    const editorState = React.useContext(StateContext);

    // Destructure message and setMessage from the editorState
    const { message, setMessage } = editorState;

    // Destructure messageHistory and setMessageHistory from the editorState
    const { messageHistory, setMessageHistory } = editorState;

    // Log the current state for debugging purposes
    console.debug("Current message:", message);
    console.debug("Current message history:", messageHistory);

    const { onTouchStart, onTouchEnd } = useSwipe(onSwipeLeft, onSwipeRight, 6);

    /**
     * Adds the current message to the message history.
     * @param {string} newMessage - The message to be added to the history.
     */
    function addToHistory(newMessage) {
        console.debug("Adding message to history:", newMessage);

        // Create a new history entry.
        const messageObject = {
            message: newMessage,
            date: new Date(),
            id: messageHistory.length + 1,
        };

        // Update the message history state with the new entry.
        setMessageHistory((prevHistory) => [...prevHistory, messageObject]);
    }

    /**
     * Handles the swipe left action which clears the current message and adds it to the history.
     */
    function onSwipeLeft() {
        if (message.trim() !== "") {
            console.debug(
                "Swipe left detected. Adding message to history and clearing the editor.",
            );
            addToHistory(message);
            setMessage("");
        } else {
            console.debug(
                "Swipe left detected but no message to add to history.",
            );
        }
    }

    /**
     * Handles the swipe right action which navigates to the Utility screen.
     */
    function onSwipeRight() {
        console.debug(
            "Swipe right detected. Navigating to the Utility screen.",
        );
        navigation.navigate("Utility");
    }

    return (
        <View
            style={[styles.container, themeContainerStyle]}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
        >
            <TextInput
                style={[styles.editor, themeTextStyle]}
                placeholder="Type here"
                placeholderTextColor="gray"
                value={message}
                onChangeText={setMessage}
                multiline={true}
                numberOfLines={4}
                adjustsFontSizeToFit={true}
                // The following props are not necessary and have been commented out
                // autoFocus={true}
                // clearTextOnFocus={true}
                // The following props are set to ensure the behavior is consistent across platforms
                autoCorrect={false}
                autoCapitalize="none"
                spellCheck={false}
                textContentType="none"
                // Adding onBlur to handle the scenario where the TextInput is deselected
                onBlur={() => {
                    console.debug(
                        "TextInput onBlur event: message is",
                        message,
                    );
                    addToHistory(message);
                }}
            />
            <StatusBar style="auto" />
            <FAB
                label="🎉"
                style={[styles.fab, themeFabStyle]}
                onPress={() => {
                    console.debug(
                        "FAB onPress event: Navigating to the Utility screen.",
                    );
                    navigation.navigate("Utility");
                }}
                color={themeTextStyle.color}
                visible={fabVisible}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    lightContainer: {
        backgroundColor: "#fff",
    },
    darkContainer: {
        backgroundColor: "#000",
    },
    lightThemeText: {
        color: "#242c40",
    },
    darkThemeText: {
        color: "#fff",
    },
    editor: {
        alignItems: "center",
        justifyContent: "center",
        padding: 10,
        height: "100%",
        width: "100%",
        fontSize: 100,
        fontWeight: "bold",
    },
    fab: {
        position: "absolute",

        margin: 16,
        right: 0,
        bottom: 0,
    },
    lightThemeFab: {
        color: "#242c40",
        backgroundColor: "#000",
    },
    darkThemeFab: {
        color: "#fff",
        backgroundColor: "#fff",
    },
});

export default Editor;
