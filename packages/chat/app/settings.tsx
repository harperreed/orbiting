import { StyleSheet } from "react-native";
import {
    View,
    Text,
    Switch,
    Button,
    SegmentedControl,
    Colors,
    ListItem,
} from "react-native-ui-lib";
import { useState } from "react";
import PageLayout from "./components/PageLayout";
import { useSettings } from "./context/SettingsContext";
import type { ThemeType } from "./context/SettingsContext";

const FONT_SIZES = [16, 18, 20, 24, 28, 32, 36, 40];

const THEMES: { label: string; value: ThemeType }[] = [
    { label: "Classic", value: "classic" },
    { label: "Ocean", value: "ocean" },
    { label: "Forest", value: "forest" },
    { label: "Sunset", value: "sunset" },
];

const COLOR_SCHEMES = [
    { label: "System", value: "system" },
    { label: "Light", value: "light" },
    { label: "Dark", value: "dark" },
];

export default function SettingsScreen() {
    const {
        colorScheme,
        startingFontSize,
        theme,
        shakeEnabled,
        shakeFlashEnabled,
        updateSettings,
        resetSettings,
    } = useSettings();
    const [isResetting, setIsResetting] = useState(false);

    const handleReset = async () => {
        setIsResetting(true);
        await resetSettings();
        setIsResetting(false);
    };

    return (
        <PageLayout scrollable>
            <View style={styles.container} bg-surface>
                <Text text40 style={styles.title}>
                    Settings
                </Text>

                {/* Appearance Section */}
                <Text text70 style={styles.sectionHeader}>
                    Appearance
                </Text>

                <ListItem activeBackgroundColor={Colors.$backgroundDisabled}>
                    <ListItem.Part>
                        <Text text65>Color Scheme</Text>
                    </ListItem.Part>
                    <ListItem.Part>
                        <SegmentedControl
                            segments={COLOR_SCHEMES.map((scheme) => ({
                                label: scheme.label,
                                value: scheme.value,
                            }))}
                            initialValue={colorScheme}
                            onValueChange={(value) =>
                                updateSettings({ colorScheme: value })
                            }
                            style={styles.segmentedControl}
                        />
                    </ListItem.Part>
                </ListItem>

                <ListItem activeBackgroundColor={Colors.$backgroundDisabled}>
                    <ListItem.Part>
                        <Text text65>Starting Font Size</Text>
                    </ListItem.Part>
                    <ListItem.Part>
                        <SegmentedControl
                            segments={FONT_SIZES.map((size) => ({
                                label: `${size}px`,
                                value: size.toString(),
                            }))}
                            initialValue={startingFontSize.toString()}
                            onValueChange={(value) =>
                                updateSettings({
                                    startingFontSize: parseInt(value, 10),
                                })
                            }
                            style={styles.segmentedControl}
                        />
                    </ListItem.Part>
                </ListItem>

                <ListItem activeBackgroundColor={Colors.$backgroundDisabled}>
                    <ListItem.Part>
                        <Text text65>Theme</Text>
                    </ListItem.Part>
                    <ListItem.Part>
                        <SegmentedControl
                            segments={THEMES.map((themeOption) => ({
                                label: themeOption.label,
                                value: themeOption.value,
                            }))}
                            initialValue={theme}
                            onValueChange={(value) =>
                                updateSettings({ theme: value as ThemeType })
                            }
                            style={styles.segmentedControl}
                        />
                    </ListItem.Part>
                </ListItem>

                {/* Gestures Section */}
                <Text
                    text70
                    style={[styles.sectionHeader, styles.secondSection]}
                >
                    Gestures
                </Text>

                <ListItem activeBackgroundColor={Colors.$backgroundDisabled}>
                    <ListItem.Part>
                        <Text text65>Shake to Clear</Text>
                    </ListItem.Part>
                    <ListItem.Part>
                        <Switch
                            value={shakeEnabled}
                            onValueChange={(value) =>
                                updateSettings({ shakeEnabled: value })
                            }
                        />
                    </ListItem.Part>
                </ListItem>

                <ListItem activeBackgroundColor={Colors.$backgroundDisabled}>
                    <ListItem.Part>
                        <Text text65>Shake to Flash</Text>
                    </ListItem.Part>
                    <ListItem.Part>
                        <Switch
                            value={shakeFlashEnabled}
                            onValueChange={(value) =>
                                updateSettings({ shakeFlashEnabled: value })
                            }
                        />
                    </ListItem.Part>
                </ListItem>

                <Button
                    label="Reset to Defaults"
                    disabled={isResetting}
                    backgroundColor={Colors.$backgroundDangerLight}
                    onPress={handleReset}
                    style={styles.resetButton}
                />
            </View>
        </PageLayout>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    title: {
        marginBottom: 24,
    },
    sectionHeader: {
        marginBottom: 8,
        marginTop: 16,
        paddingHorizontal: 8,
        color: Colors.$textDefault,
    },
    secondSection: {
        marginTop: 32,
    },
    segmentedControl: {
        marginVertical: 8,
    },
    resetButton: {
        margin: 16,
        marginTop: 32,
    },
});
