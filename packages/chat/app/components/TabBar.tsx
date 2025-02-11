import { useRouter, usePathname } from "expo-router";
import { StyleSheet } from "react-native";
import { View, Button, Colors } from "react-native-ui-lib";
import { Ionicons } from '@expo/vector-icons';

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
            icon: (props) => <Ionicons name={currentIndex === 0 ? "home" : "home-outline"} size={24} color={props.tintColor} />,
            route: "/",
        },
        { label: "History", icon: (props) => <Ionicons name="time-outline" size={24} color={props.tintColor} />, route: "/history" },
        {
            label: "Help",
            icon: (props) => <Ionicons name={currentIndex === 2 ? "help-circle" : "help-circle-outline"} size={24} color={props.tintColor} />,
            route: "/help",
        },
        {
            label: "Settings",
            icon: (props) => <Ionicons name={currentIndex === 3 ? "settings" : "settings-outline"} size={24} color={props.tintColor} />,
            route: "/settings",
        },
        {
            label: "About",
            icon: (props) => <Ionicons name={currentIndex === 4 ? "information-circle" : "information-circle-outline"} size={24} color={props.tintColor} />,
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
