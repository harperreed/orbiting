import {
    StyleSheet,
    View,
    Platform,
    ActivityIndicator,
    Alert,
} from "react-native";
import { Text, Button, ListItem, Dialog, Colors } from "react-native-ui-lib";
import PageLayout from "./components/PageLayout";
import { useCallback, useEffect, useState } from "react";
import { useText } from "./context/TextContext";
import { useRouter } from "expo-router";
import {
    StoredMessage,
    getMessages,
    clearHistory,
    deleteMessage,
} from "./utils/storageUtils";
import { FlashList } from "@shopify/flash-list";

export default function HistoryScreen() {
    const [messages, setMessages] = useState<StoredMessage[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(0);
    const [showClearDialog, setShowClearDialog] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [messageToDelete, setMessageToDelete] = useState<string | null>(null);
    const router = useRouter();

    const loadMessages = useCallback(
        async (pageNum: number, append = false) => {
            try {
                if (pageNum === 0) {
                    setIsLoading(true);
                } else {
                    setIsLoadingMore(true);
                }
                const { messages: newMessages, hasMore: more } =
                    await getMessages(pageNum);
                setMessages((prev) =>
                    append ? [...prev, ...newMessages] : newMessages,
                );
                setHasMore(more);
                setPage(pageNum);
            } catch (error) {
                console.error("Failed to load messages:", error);
                Alert.alert("Error", "Failed to load messages");
            } finally {
                setIsLoading(false);
                setIsLoadingMore(false);
            }
        },
        [],
    );

    useEffect(() => {
        loadMessages(0);
    }, [loadMessages]);

    const { clearText } = useText();

    const handleClearHistory = useCallback(() => {
        setShowClearDialog(true);
    }, []);

    const handleConfirmClear = useCallback(async () => {
        try {
            await clearHistory();
            await clearText();
            setMessages([]);
            setHasMore(false);
            setPage(0);
        } catch (error) {
            console.error("Failed to clear history:", error);
        } finally {
            setShowClearDialog(false);
        }
    }, [clearText]);

    const handleDeleteMessage = useCallback((id: string) => {
        setMessageToDelete(id);
        setShowDeleteDialog(true);
    }, []);

    const handleConfirmDelete = useCallback(async () => {
        if (messageToDelete) {
            try {
                await deleteMessage(messageToDelete);
                await loadMessages(0);
            } catch (error) {
                console.error("Failed to delete message:", error);
            } finally {
                setShowDeleteDialog(false);
                setMessageToDelete(null);
            }
        }
    }, [messageToDelete, loadMessages]);

    const renderItem = useCallback(
        ({ item }: { item: StoredMessage }) => (
            <ListItem
                activeOpacity={0.3}
                height={80}
                onPress={() => {
                    router.push({ pathname: "/", params: { text: item.text } });
                }}
                onLongPress={() => handleDeleteMessage(item.id)}
            >
                <ListItem.Part>
                    <Text numberOfLines={2}>{item.text}</Text>
                    <Text style={styles.timestamp} text90>
                        {new Date(item.timestamp).toLocaleDateString()}
                    </Text>
                </ListItem.Part>
            </ListItem>
        ),
        [router, handleDeleteMessage],
    );

    if (isLoading) {
        return (
            <PageLayout>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator
                        size="large"
                        color={Colors.$textPrimary}
                    />
                </View>
            </PageLayout>
        );
    }

    return (
        <>
            <PageLayout>
                <FlashList
                    data={messages}
                    renderItem={renderItem}
                    estimatedItemSize={80}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.listContent}
                    onEndReached={() => {
                        if (hasMore && !isLoadingMore) {
                            loadMessages(page + 1, true);
                        }
                    }}
                    onEndReachedThreshold={0.5}
                    ListFooterComponent={() =>
                        isLoadingMore ? (
                            <View style={styles.loadingMore}>
                                <ActivityIndicator
                                    size="small"
                                    color={Colors.$textPrimary}
                                />
                            </View>
                        ) : null
                    }
                />
                {messages.length > 0 && (
                    <Button
                        label="Clear History"
                        onPress={handleClearHistory}
                        style={styles.clearButton}
                        backgroundColor={Colors.$backgroundDangerLight}
                    />
                )}
            </PageLayout>

            <Dialog
                visible={showClearDialog}
                onDismiss={() => setShowClearDialog(false)}
                overlayBackgroundColor={Colors.$backgroundDefault}
            >
                <Text text60>Clear History</Text>
                <Text text70>Are you sure you want to clear all messages?</Text>
                <View row spread>
                    <Button
                        label="Cancel"
                        link
                        onPress={() => setShowClearDialog(false)}
                        linkColor={Colors.$textPrimary}
                    />
                    <Button
                        label="Clear"
                        link
                        onPress={handleConfirmClear}
                        linkColor={Colors.$textDanger}
                    />
                </View>
            </Dialog>

            <Dialog
                visible={showDeleteDialog}
                onDismiss={() => setShowDeleteDialog(false)}
                overlayBackgroundColor={Colors.$backgroundDefault}
            >
                <Text text60>Delete Message</Text>
                <Text text70>
                    Are you sure you want to delete this message?
                </Text>
                <View row spread>
                    <Button
                        label="Cancel"
                        link
                        onPress={() => setShowDeleteDialog(false)}
                        linkColor={Colors.$textPrimary}
                    />
                    <Button
                        label="Delete"
                        link
                        onPress={handleConfirmDelete}
                        linkColor={Colors.$textDanger}
                    />
                </View>
            </Dialog>
        </>
    );
}

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    loadingMore: {
        padding: 16,
        alignItems: "center",
    },
    listContent: {
        padding: 16,
    },
    timestamp: {
        fontSize: 12,
        color: Colors.$textNeutral,
        marginTop: 4,
    },
    clearButton: {
        margin: 16,
    },
});
