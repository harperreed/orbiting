import {
    StyleSheet,
    useWindowDimensions,
    Platform,
    ScrollView,
} from "react-native";
import { Surface, useTheme } from "react-native-paper";
import TabBar from "./TabBar";

type PageLayoutProps = {
    children: React.ReactNode;
    scrollable?: boolean;
};

export default function PageLayout({
    children,
    scrollable = false,
}: PageLayoutProps) {
    const theme = useTheme();
    const { width } = useWindowDimensions();
    const isLargeScreen = width >= 768;
    const showTabBar =
        isLargeScreen || (Platform.OS !== "ios" && Platform.OS !== "android");

    return (
        <Surface
            style={[
                styles.wrapper,
                { backgroundColor: theme.colors.background },
            ]}
            elevation={0}
        >
            <Surface style={styles.container} elevation={1}>
                {scrollable ? (
                    <ScrollView
                        style={styles.scrollView}
                        contentContainerStyle={[
                            styles.scrollContent,
                            { backgroundColor: theme.colors.surface },
                        ]}
                    >
                        {children}
                    </ScrollView>
                ) : (
                    <Surface
                        style={[
                            styles.content,
                            { backgroundColor: theme.colors.surface },
                        ]}
                        elevation={0}
                    >
                        {children}
                    </Surface>
                )}
            </Surface>
            {showTabBar && <TabBar />}
        </Surface>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    container: {
        flex: 1,
        width: '100%',
        height: '100%',
        margin: 0,
        borderRadius: 0,
    },
    content: {
        flex: 1,
        padding: 20,
        borderRadius: 0,
        width: '100%',
    },
    scrollView: {
        flex: 1,
        width: '100%',
    },
    scrollContent: {
        padding: 20,
        flexGrow: 1,
        minHeight: '100%',
        width: '100%',
        borderRadius: 0,
    },
});
