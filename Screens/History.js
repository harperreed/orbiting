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
            {messageHistory.some((r) => r.isFavorite) && (
                <>
                    <Headline>Favorites</Headline>
                    <DataTable>
                        {messageHistory
                            .filter((r) => r.isFavorite)
                            .map((r, index) => (
                                <DataTable.Row key={index}>
                                    <DataTable.Cell style={{ flex: 3 }}>
                                        {r.message}
                                    </DataTable.Cell>
                                    <DataTable.Cell numeric>
                                        <ToggleButton
                                            icon="star"
                                            value="favorite"
                                            status="checked"
                                            onPress={() => {
                                                const newMessageHistory = [
                                                    ...messageHistory,
                                                ];
                                                newMessageHistory[
                                                    index
                                                ].isFavorite =
                                                    !newMessageHistory[index]
                                                        .isFavorite;
                                                setMessageHistory(
                                                    newMessageHistory,
                                                );
                                            }}
                                        />
                                    </DataTable.Cell>
                                </DataTable.Row>
                            ))}
                    </DataTable>
                </>
            )}
            {messageHistory.length > 0 && (
                <>
                    <Headline>History</Headline>
                    <DataTable>
                        {messageHistory.map((r, index) => (
                            <DataTable.Row key={index}>
                                <DataTable.Cell style={{ flex: 3 }}>
                                    {r.message}
                                </DataTable.Cell>
                                <DataTable.Cell numeric>
                                    <ToggleButton
                                        icon={
                                            r.isFavorite
                                                ? "star"
                                                : "star-outline"
                                        }
                                        value="favorite"
                                        status={
                                            r.isFavorite
                                                ? "checked"
                                                : "unchecked"
                                        }
                                        onPress={() => {
                                            const newMessageHistory = [
                                                ...messageHistory,
                                            ];
                                            newMessageHistory[
                                                index
                                            ].isFavorite =
                                                !newMessageHistory[index]
                                                    .isFavorite;
                                            setMessageHistory(
                                                newMessageHistory,
                                            );
                                        }}
                                    />
                                </DataTable.Cell>
                            </DataTable.Row>
                        ))}
                    </DataTable>
                </>
            )}
        </View>
    );
}

export default History;
