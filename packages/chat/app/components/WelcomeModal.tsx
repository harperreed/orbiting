import { Modal, Portal, Text, Button, useTheme } from 'react-native-paper';
import { StyleSheet, View, Platform } from 'react-native';
import Cookies from 'js-cookie';
import { useState, useEffect } from 'react';

const WELCOME_COOKIE = 'orbiting-welcome-shown';

export function WelcomeModal() {
  const [visible, setVisible] = useState(false);
  const theme = useTheme();

  useEffect(() => {
    if (Platform.OS === 'web') {
      const hasSeenWelcome = Cookies.get(WELCOME_COOKIE);
      if (!hasSeenWelcome) {
        setVisible(true);
      }
    }
  }, []);

  const hideModal = () => {
    setVisible(false);
    if (Platform.OS === 'web') {
      Cookies.set(WELCOME_COOKIE, 'true', { expires: 365 });
    }
  };

  const styles = StyleSheet.create({
    modalContainer: {
      backgroundColor: theme.colors.background,
      padding: 20,
      margin: 20,
      borderRadius: 8,
      maxWidth: 500,
      alignSelf: 'center',
    },
    title: {
      fontSize: 24,
      marginBottom: 16,
      textAlign: 'center',
    },
    content: {
      marginBottom: 20,
      lineHeight: 24,
    },
    buttonContainer: {
      marginTop: 10,
    },
  });

  return (
    <Portal>
      <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={styles.modalContainer}>
        <Text style={styles.title}>Welcome to Orbiting!</Text>
        <Text style={styles.content}>
          Orbiting is a unique communication tool that helps you express yourself through large, dynamic text.
          Type or paste your message and watch it automatically resize to fill the screen.
        </Text>
        <View style={styles.buttonContainer}>
          <Button mode="contained" onPress={hideModal}>
            Get Started
          </Button>
        </View>
      </Modal>
    </Portal>
  );
}
