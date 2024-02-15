import { Appbar } from "react-native-paper";

function CustomNavigationBar({ navigation, back }) {
    return (
        <Appbar.Header>
            {back ? <Appbar.BackAction onPress={navigation.goBack} /> : null}
            <Appbar.Content title="Orbiting" />
        </Appbar.Header>
    );
}

export default CustomNavigationBar;
