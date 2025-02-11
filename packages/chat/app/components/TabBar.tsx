import { useRouter, usePathname } from "expo-router";
import { StyleSheet } from "react-native";
import { View, Button, Colors } from "react-native-ui-lib";

export default function TabBar() {
    const router = useRouter();
    const pathname = usePathname();
    const isVisible = pathname !== "/";

    if (!isVisible) {
        return null;
    }

    const routes = ["/", "/history", "/help", "/settings", "/about"];
    const currentIndex = routes.indexOf(pathname);

    const tabs = [
        {
            label: "Home",
            icon: currentIndex === 0 ? "home" : "home-outline",
            route: "/",
        },
        { label: "History", icon: "history", route: "/history" },
        {
            label: "Help",
            icon: currentIndex === 2 ? "help-circle" : "help-circle-outline",
            route: "/help",
        },
        {
            label: "Settings",
            icon: currentIndex === 3 ? "cog" : "cog-outline",
            route: "/settings",
        },
        {
            label: "About",
            icon: currentIndex === 4 ? "information" : "information-outline",
            route: "/about",
        },
    ];

    return (
        <View
            style={styles.container}
            backgroundColor={Colors.$backgroundDefault}
        >
            {tabs.map((tab, index) => (
                <Button
                    key={tab.route}
                    testID={`${tab.label.toLowerCase()}-tab`}
                    label={tab.label}
                    iconSource={tab.icon}
                    onPress={() => router.push(tab.route)}
                    style={[
                        styles.tab,
                        currentIndex === index && styles.activeTab,
                    ]}
                    backgroundColor={
                        currentIndex === index
                            ? Colors.$backgroundPrimaryLight
                            : "transparent"
                    }
                    color={
                        currentIndex === index
                            ? Colors.$textPrimary
                            : Colors.$textNeutral
                    }
                />
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        height: 60,
        justifyContent: "space-around",
        alignItems: "center",
        borderTopWidth: 1,
        borderTopColor: Colors.$outlineDefault,
        paddingBottom: 5,
        elevation: 4,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: -2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3,
    },
    tab: {
        flex: 1,
        height: "100%",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 0,
    },
    activeTab: {
        borderBottomWidth: 2,
        borderBottomColor: Colors.$outlinePrimary,
    },
});
