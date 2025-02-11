import { Stack } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { View, useColorScheme } from "react-native";
import {
    ThemeManager,
    Colors,
    Typography,
    Spacings,
    View as UIView,
} from "react-native-ui-lib";
import { TextProvider } from "../app/context/TextContext";
import { SettingsProvider } from "../app/context/SettingsContext";

// Initialize theme
ThemeManager.setComponentTheme("Text", {
    body: true,
});

// Define light/dark color schemes
const lightColors = {
    primary: "#6750A4",
    secondary: "#625B71",
    background: "#FFFFFF",
    surface: "#F6F6F6",
    text: "#000000",
    border: "#E0E0E0",
};

const darkColors = {
    primary: "#D0BCFF",
    secondary: "#CCC2DC",
    background: "#1C1B1F",
    surface: "#2B2930",
    text: "#FFFFFF",
    border: "#3F3F3F",
};

// Colors
Colors.loadSchemes({
    light: lightColors,
    dark: darkColors,
});

// Typography
Typography.loadTypographies({
    h1: { fontSize: 36, fontWeight: "600" },
    h2: { fontSize: 28, fontWeight: "500" },
    h3: { fontSize: 24, fontWeight: "500" },
    body: { fontSize: 18, fontWeight: "400" },
    subtitle: { fontSize: 16, fontWeight: "400" },
    caption: { fontSize: 14, fontWeight: "400" },
});

// Spacings
Spacings.loadSpacings({
    page: 20,
    card: 12,
    gridGutter: 16,
    smallMargin: 8,
    mediumMargin: 16,
    largeMargin: 24,
});

export default function RootLayout() {
    const colorScheme = useColorScheme();
    const [isClient, setIsClient] = useState(false);

    // Handle color scheme changes
    const updateColorScheme = useCallback(() => {
        Colors.setScheme(colorScheme === "dark" ? "dark" : "light");
        ThemeManager.setComponentTheme("View", {
            backgroundColor: Colors.background,
        });
    }, [colorScheme]);

    // Initialize client-side rendering
    useEffect(() => {
        setIsClient(true);
        updateColorScheme();
    }, [updateColorScheme]);

    if (!isClient) {
        return null;
    }

    return (
        <UIView flex backgroundColor={Colors.background}>
            <GestureHandlerRootView style={{ flex: 1 }}>
                <SettingsProvider>
                    <TextProvider>
                        <Stack
                            screenOptions={{
                                headerShown: false,
                                contentStyle: { flex: 1 },
                            }}
                        />
                    </TextProvider>
                </SettingsProvider>
            </GestureHandlerRootView>
        </UIView>
    );
}
