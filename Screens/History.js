import React from "react";
import { StyleSheet, View } from "react-native";
import {
    Avatar,
    DataTable,
    Headline,
    Paragraph,
    Subheading,
    ToggleButton,
    RadioButton,
    Button,
    Text,
    Switch,
    Title,
    Divider,
} from "react-native-paper";
import { StateContext } from "../StateContext";

const MessageRow = ({ record, toggleFavorite }) => (
    <DataTable.Row>
        <DataTable.Cell style={{ flex: 3 }}>{record.message}</DataTable.Cell>
        <DataTable.Cell numeric>{record.id}</DataTable.Cell>
        <DataTable.Cell numeric>
            <ToggleButton
                icon={record.isFavorite ? "star" : "star-outline"}
                value="favorite"
                status={record.isFavorite ? "checked" : "unchecked"}
                onPress={toggleFavorite}
            />
        </DataTable.Cell>
    </DataTable.Row>
);

/**
 * A component that renders a list of messages, with the ability to filter by favorites.
 * @param {Array} messageHistory - Array of message records to display.
 * @param {Function} setMessageHistory - Function to update the message history state.
 * @param {boolean} filterFavorites - Flag to determine if only favorite messages should be shown.
 */
const MessageList = ({
    messageHistory,
    setMessageHistory,
    filterFavorites,
}) => {
    console.debug("Rendering MessageList", { filterFavorites });

    /**
     * Toggles the favorite status of a message.
     * @param {number} index - The index of the message in the message history array.
     */
    const handleToggleFavorite = (index) => {
        console.debug("Toggling favorite status for message at index", index);
        const newMessageHistory = [...messageHistory];
        newMessageHistory[index].isFavorite =
            !newMessageHistory[index].isFavorite;
        setMessageHistory(newMessageHistory);
    };

    return (
        <DataTable>
            {messageHistory
                .filter((record) =>
                    filterFavorites ? record.isFavorite : true,
                )
                .map((record, index) => (
                    <MessageRow
                        key={record.id} // Prefer using unique id instead of index for key
                        record={record}
                        toggleFavorite={() => handleToggleFavorite(index)}
                    />
                ))}
        </DataTable>
    );
};

function History() {
    const { message, setMessage } = React.useContext(StateContext);
    const { messageHistory, setMessageHistory } =
        React.useContext(StateContext);

    return (
        <View
            style={{
                flex: 1,
                alignItems: "stretch",
                justifyContent: "flex-start",
                marginLeft: 10,
            }}
        >
            <MessageList
                messageHistory={messageHistory}
                setMessageHistory={setMessageHistory}
                filterFavorites={true}
            />

            {messageHistory.length > 0 ? (
                <>
                    <Headline>History</Headline>
                    <MessageList
                        messageHistory={messageHistory}
                        setMessageHistory={setMessageHistory}
                        filterFavorites={false}
                    />
                </>
            ) : (
                <View
                    style={{
                        flex: 1,
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <Text
                        style={{
                            fontSize: 20,
                        }}
                    >
                        No History. We will live forever.
                    </Text>
                </View>
            )}
        </View>
    );
}

export default History;
