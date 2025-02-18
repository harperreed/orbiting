import { StyleSheet, View } from "react-native";
import {
    Text,
    Button,
    ActivityIndicator,
    Surface,
    useTheme,
    Dialog,
    Divider,
    Searchbar,
    Snackbar,
    List,
    TouchableRipple,
} from "react-native-paper";
import { useTranslation } from 'react-i18next';
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
    const theme = useTheme();
    const { t } = useTranslation();
    const [messages, setMessages] = useState<StoredMessage[]>([]);
    const [filteredMessages, setFilteredMessages] = useState<StoredMessage[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [cursor, setCursor] = useState<string | null>(null);
    const [showClearDialog, setShowClearDialog] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [messageToDelete, setMessageToDelete] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [snackbarVisible, setSnackbarVisible] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");

    const router = useRouter();
    const { clearText } = useText();

    const showSnackbar = (message: string) => {
        setSnackbarMessage(message);
        setSnackbarVisible(true);
    };

    const loadMessages = useCallback(
        async (newCursor: string | null = null, append = false) => {
            try {
                if (!newCursor) {
                    setIsLoading(true);
                } else {
                    setIsLoadingMore(true);
                }

                const { messages: newMessages, nextCursor } = await getMessages(
                    {
                        cursor: newCursor ?? undefined,
                        limit: 20,
                        search: searchQuery,
                    },
                );

                setMessages((prev) =>
                    append ? [...prev, ...newMessages] : newMessages,
                );
                setFilteredMessages((prev) =>
                    append ? [...prev, ...newMessages] : newMessages,
                );
                setHasMore(!!nextCursor);
                setCursor(nextCursor);
            } catch (error) {
                console.error("Failed to load messages:", error);
                showSnackbar("Failed to load messages");
            } finally {
                setIsLoading(false);
                setIsLoadingMore(false);
            }
        },
        [searchQuery],
    );

    useEffect(() => {
        loadMessages(null);
    }, [loadMessages, searchQuery]);

    useEffect(() => {
        // Reset pagination and reload with search
        setCursor(null);
        setMessages([]);
        setFilteredMessages([]);
        loadMessages(null, false);
    }, [searchQuery, loadMessages]);

    const handleClearHistory = useCallback(async () => {
        try {
            await clearHistory();
            await clearText();
            setMessages([]);
            setFilteredMessages([]);
            setHasMore(false);
            showSnackbar("History cleared successfully");
        } catch (error) {
            console.error("Failed to clear history:", error);
            showSnackbar("Failed to clear history");
        } finally {
            setShowClearDialog(false);
        }
    }, [clearText]);

    const handleDeleteMessage = useCallback(async () => {
        if (messageToDelete) {
            try {
                await deleteMessage(messageToDelete);
                await loadMessages(null);
                showSnackbar("Message deleted successfully");
            } catch (error) {
                console.error("Failed to delete message:", error);
                showSnackbar("Failed to delete message");
            } finally {
                setShowDeleteDialog(false);
                setMessageToDelete(null);
            }
        }
    }, [messageToDelete, loadMessages]);

    const formatDate = (timestamp: number) => {
        const date = new Date(timestamp);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        if (date.toDateString() === today.toDateString()) {
            return date.toLocaleTimeString(undefined, {
                hour: "2-digit",
                minute: "2-digit",
            });
        } else if (date.toDateString() === yesterday.toDateString()) {
            return (
                "Yesterday " +
                date.toLocaleTimeString(undefined, {
                    hour: "2-digit",
                    minute: "2-digit",
                })
            );
        } else {
            return date.toLocaleDateString(undefined, {
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
            });
        }
    };

    const renderItem = useCallback(
        ({ item }: { item: StoredMessage }) => (
            <TouchableRipple
                onPress={() =>
                    router.push({ pathname: "/", params: { text: item.text } })
                }
                onLongPress={() => {
                    setMessageToDelete(item.id);
                    setShowDeleteDialog(true);
                }}
            >
                <List.Item
                    title={item.text}
                    titleNumberOfLines={1}
                    titleStyle={styles.messageText}
                    description={formatDate(item.timestamp)}
                    descriptionStyle={styles.timestamp}
                    right={(props) => (
                        <List.Icon
                            {...props}
                            icon="chevron-right"
                            color={theme.colors.onSurfaceVariant}
                        />
                    )}
                />
            </TouchableRipple>
        ),
        [router, theme.colors.onSurfaceVariant],
    );

    if (isLoading) {
        return (
            <PageLayout>
                <Surface style={styles.loadingContainer}>
                    <ActivityIndicator size="large" />
                </Surface>
            </PageLayout>
        );
    }

    return (
        <PageLayout>
            <View style={styles.searchContainer}>
                <Searchbar
                    placeholder={t('searchMessages')}
                    onChangeText={setSearchQuery}
                    value={searchQuery}
                    style={styles.searchBar}
                />
            </View>

            {filteredMessages.length === 0 ? (
                <Surface style={styles.emptyContainer}>
                    <Text variant="headlineSmall">No messages</Text>
                    <Text variant="bodyMedium" style={styles.emptyText}>
                        Messages you create will appear here
                    </Text>
                </Surface>
            ) : (
                <View>
                    <FlashList
                        data={filteredMessages}
                        renderItem={renderItem}
                        estimatedItemSize={64}
                        keyExtractor={(item) => item.id}
                        ItemSeparatorComponent={() => <Divider />}
                        onEndReached={() => {
                            if (hasMore && !isLoadingMore && cursor) {
                                loadMessages(cursor, true);
                            }
                        }}
                        onEndReachedThreshold={0.5}
                        ListFooterComponent={() =>
                            isLoadingMore ? (
                                <ActivityIndicator
                                    style={styles.loadingMore}
                                    size="small"
                                />
                            ) : null
                        }
                    />
                    {messages.length > 0 && (
                        <Button
                            mode="contained"
                            onPress={() => setShowClearDialog(true)}
                            style={styles.clearButton}
                            buttonColor={theme.colors.error}
                            icon="delete-sweep"
                        >
                            {t('clearAllHistory')}
                        </Button>
                    )}
                </View>
            )}

            <Dialog
                visible={showClearDialog}
                onDismiss={() => setShowClearDialog(false)}
            >
                <Dialog.Title>{t('clearHistoryTitle')}</Dialog.Title>
                <Dialog.Content>
                    <Text variant="bodyLarge">
                        {t('clearHistoryConfirmMessage')}
                    </Text>
                </Dialog.Content>
                <Dialog.Actions>
                    <Button onPress={() => setShowClearDialog(false)}>
                        {t('cancel')}
                    </Button>
                    <Button
                        onPress={handleClearHistory}
                        textColor={theme.colors.error}
                        icon="delete-sweep"
                    >
                        {t('clearAll')}
                    </Button>
                </Dialog.Actions>
            </Dialog>

            <Dialog
                visible={showDeleteDialog}
                onDismiss={() => setShowDeleteDialog(false)}
            >
                <Dialog.Title>{t('deleteMessage')}</Dialog.Title>
                <Dialog.Content>
                    <Text variant="bodyLarge">
                        {t('deleteMessageConfirm')}
                    </Text>
                </Dialog.Content>
                <Dialog.Actions>
                    <Button onPress={() => setShowDeleteDialog(false)}>
                        {t('cancel')}
                    </Button>
                    <Button
                        onPress={handleDeleteMessage}
                        textColor={theme.colors.error}
                        icon="delete"
                    >
                        {t('delete')}
                    </Button>
                </Dialog.Actions>
            </Dialog>

            <Snackbar
                visible={snackbarVisible}
                onDismiss={() => setSnackbarVisible(false)}
                duration={3000}
                action={{
                    label: "Dismiss",
                    onPress: () => setSnackbarVisible(false),
                }}
            >
                {snackbarMessage}
            </Snackbar>
        </PageLayout>
    );
}

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    loadingMore: {
        padding: 8,
    },
    messageText: {
        fontSize: 16,
    },
    timestamp: {
        fontSize: 12,
        color: "gray",
    },
    clearButton: {
        margin: 16,
    },
    searchContainer: {
        padding: 8,
    },
    searchBar: {
        elevation: 0,
        borderWidth: 1,
        borderColor: "rgba(0,0,0,0.1)",
    },
    emptyContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 16,
    },
    emptyText: {
        marginTop: 8,
        color: "gray",
        textAlign: "center",
    },
});
