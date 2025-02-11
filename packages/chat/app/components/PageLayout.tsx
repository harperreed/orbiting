import React, { useCallback, useEffect, useState } from "react";
import {
    StyleSheet,
    useWindowDimensions,
    Platform,
    ScrollView,
    View,
    KeyboardAvoidingView,
    LayoutChangeEvent,
    AccessibilityInfo,
    ScrollViewProps,
    SafeAreaView,
    StatusBar,
} from "react-native";
import {
    View,
    Text,
    LoaderScreen,
    Colors,
} from "rnuilib";
import TabBar from "./TabBar";

// Error boundary class component
class ErrorBoundary extends React.Component<
    { children: React.ReactNode },
    { hasError: boolean; error: Error | null }
> {
    constructor(props: { children: React.ReactNode }) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error) {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error("PageLayout Error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <View style={styles.errorContainer}>
                    <Text text60 style={styles.errorText}>
                        Something went wrong
                    </Text>
                    <Text text70 style={styles.errorDetail}>
                        {this.state.error?.message ||
                            "An unexpected error occurred"}
                    </Text>
                </View>
            );
        }
        return this.props.children;
    }
}

export interface PageLayoutProps {
    children: React.ReactNode;
    scrollable?: boolean;
    loading?: boolean;
    refreshing?: boolean;
    onRefresh?: () => void;
    scrollViewProps?: Omit<ScrollViewProps, "refreshControl">;
    contentContainerStyle?: ScrollViewProps["contentContainerStyle"];
    hideTabBar?: boolean;
    onLayout?: (event: LayoutChangeEvent) => void;
    testID?: string;
    accessible?: boolean;
    accessibilityLabel?: string;
}

export default function PageLayout({
    children,
    scrollable = false,
    loading = false,
    refreshing = false,
    onRefresh,
    scrollViewProps,
    contentContainerStyle,
    hideTabBar = false,
    onLayout,
    testID = "page-layout",
    accessible = true,
    accessibilityLabel = "Page content",
}: PageLayoutProps) {
    const theme = useTheme();
    const { width, height } = useWindowDimensions();
    const [orientation, setOrientation] = useState<"portrait" | "landscape">(
        height > width ? "portrait" : "landscape",
    );
    const [screenReaderEnabled, setScreenReaderEnabled] = useState(false);

    useEffect(() => {
        setOrientation(height > width ? "portrait" : "landscape");
    }, [width, height]);

    useEffect(() => {
        const checkScreenReader = async () => {
            const isEnabled = await AccessibilityInfo.isScreenReaderEnabled();
            setScreenReaderEnabled(isEnabled);
        };

        checkScreenReader();
        const subscription = AccessibilityInfo.addEventListener(
            "screenReaderChanged",
            setScreenReaderEnabled,
        );

        return () => {
            subscription.remove();
        };
    }, []);

    const isLargeScreen = width >= 768;
    const showTabBar = !hideTabBar && (isLargeScreen || Platform.OS === "web");
    const keyboardBehavior = Platform.select({
        ios: "padding",
        android: "height",
    });
    const keyboardOffset = Platform.select({ ios: 0, android: 20 });

    const handleLayout = useCallback(
        (event: LayoutChangeEvent) => {
            onLayout?.(event);
        },
        [onLayout],
    );

    const renderContent = () => {
        const mainContent = (
            <View style={styles.contentWrapper}>
                {loading ? (
                    <View style={styles.loadingContainer}>
                        <LoaderScreen message="Loading..." />
                    </View>
                ) : (
                    <View
                        style={[
                            styles.content,
                            { backgroundColor: theme.colors.surface },
                            orientation === "landscape" &&
                                styles.landscapeContent,
                        ]}
                        elevation={0}
                    >
                        {children}
                    </View>
                )}
            </View>
        );

        if (scrollable) {
            return (
                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={[
                        styles.scrollContent,
                        { backgroundColor: theme.colors.surface },
                        contentContainerStyle,
                    ]}
                    scrollEventThrottle={16}
                    showsVerticalScrollIndicator={!screenReaderEnabled}
                    automaticallyAdjustKeyboardInsets
                    {...scrollViewProps}
                >
                    {mainContent}
                </ScrollView>
            );
        }

        return mainContent;
    };

    return (
        <ErrorBoundary>
            <View style={styles.root}>
                <SafeAreaView
                    style={[
                        styles.safeArea,
                        { backgroundColor: theme.colors.background },
                    ]}
                >
                    <KeyboardAvoidingView
                        behavior={keyboardBehavior}
                        style={styles.keyboardAvoid}
                        keyboardVerticalOffset={keyboardOffset}
                    >
                        <View
                            style={[
                                styles.container,
                                { backgroundColor: theme.colors.background },
                            ]}
                            elevation={0}
                            testID={testID}
                            accessible={accessible}
                            accessibilityLabel={accessibilityLabel}
                            onLayout={handleLayout}
                        >
                            <StatusBar
                                backgroundColor={theme.colors.background}
                                barStyle={
                                    theme.dark
                                        ? "light-content"
                                        : "dark-content"
                                }
                            />
                            {renderContent()}
                        </View>
                    </KeyboardAvoidingView>
                    {showTabBar && <TabBar />}
                </SafeAreaView>
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
    safeArea: {
        flex: 1,
        width: "100%",
        height: "100%",
    },
    keyboardAvoid: {
        flex: 1,
        width: "100%",
        height: "100%",
    },
    container: {
        flex: 1,
        width: "100%",
        height: "100%",
        margin: 0,
        borderRadius: 0,
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
        borderRadius: 0,
    },
    landscapeContent: {
        paddingHorizontal: 40,
    },
    scrollView: {
        flex: 1,
        width: "100%",
        height: "100%",
    },
    scrollContent: {
        flexGrow: 1,
        width: "100%",
        minHeight: "100%",
        borderRadius: 0,
    },
    loadingContainer: {
        flex: 1,
        width: "100%",
        height: "100%",
        justifyContent: "center",
        alignItems: "center",
    },
    errorContainer: {
        flex: 1,
        width: "100%",
        height: "100%",
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    errorText: {
        marginBottom: 12,
        textAlign: "center",
    },
    errorDetail: {
        textAlign: "center",
        opacity: 0.7,
    },
});
