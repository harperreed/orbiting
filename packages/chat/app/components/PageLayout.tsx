import { useWindowDimensions, Platform } from "react-native";
import { View } from "react-native-ui-lib";
import { ScrollView } from "react-native";
import TabBar from "./TabBar";

type PageLayoutProps = {
    children: React.ReactNode;
    scrollable?: boolean;
};

export default function PageLayout({
    children,
    scrollable = false,
}: PageLayoutProps) {
    const Content = scrollable ? ScrollView : View;
    const { width } = useWindowDimensions();

    // Determine if device is a tablet/desktop based on screen size
    // Using 768dp as the breakpoint (common tablet breakpoint)
    const isLargeScreen = width >= 768;

    // Show TabBar only on large screens (tablets/desktop)
    // or on platforms other than iOS and Android
    const showTabBar =
        isLargeScreen || (Platform.OS !== "ios" && Platform.OS !== "android");

    return (
        <View flex backgroundColor="background.primary">
            <Content flex padding-20>
                {children}
            </Content>
            {showTabBar && <TabBar />}
        </View>
    );
}
