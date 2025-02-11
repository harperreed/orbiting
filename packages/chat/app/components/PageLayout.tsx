import React from "react";
import { StyleSheet, View, ScrollView, ActivityIndicator } from "react-native";
import { Surface, Text } from "react-native-paper";
import TabBar from "./TabBar";

// Simple error boundary
class ErrorBoundary extends React.Component {
    state = { hasError: false, error: null };

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    render() {
        if (this.state.hasError) {
            return (
                <View style={styles.errorContainer}>
                    <Text>Something went wrong</Text>
                    <Text>{this.state.error?.message}</Text>
                </View>
            );
        }
        return this.props.children;
    }
}

interface PageLayoutProps {
    children: React.ReactNode;
    scrollable?: boolean;
    loading?: boolean;
}

export default function PageLayout({
    children,
    scrollable = false,
    loading = false,
}: PageLayoutProps) {
    const renderContent = () => {
        const content = (
            <View style={styles.contentWrapper}>
                {loading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" />
                    </View>
                ) : (
                    <Surface style={styles.content}>{children}</Surface>
                )}
            </View>
        );

        if (scrollable) {
            return (
                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.scrollViewContent}
                >
                    {content}
                </ScrollView>
            );
        }

        return content;
    };

    return (
        <ErrorBoundary>
            <View style={styles.root}>
                <View style={styles.container}>
                    <View style={styles.mainContent}>{renderContent()}</View>
                    <View style={styles.tabBarContainer}>
                        <TabBar />
                    </View>
                </View>
            </View>
        </ErrorBoundary>
    );
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
        width: "100%",
        height: "100%",
    },
    container: {
        flex: 1,
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
    },
    mainContent: {
        flex: 1,
        width: "100%",
    },
    contentWrapper: {
        flex: 1,
        width: "100%",
        height: "100%",
    },
    content: {
        flex: 1,
        width: "100%",
        height: "100%",
        padding: 20,
    },
    scrollView: {
        flex: 1,
        width: "100%",
    },
    scrollViewContent: {
        flexGrow: 1,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    errorContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    tabBarContainer: {
        width: "100%",
        borderTopWidth: 1,
        borderTopColor: "#e0e0e0",
    },
});
