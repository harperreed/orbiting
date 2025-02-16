import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { useTranslation } from 'react-i18next';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log to error reporting service
    console.error('Error caught by boundary:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      return (
        <ErrorDisplay error={this.state.error} onReset={this.handleReset} />
      );
    }

    return this.props.children;
  }
}

interface ErrorDisplayProps {
  error?: Error;
  onReset: () => void;
}

function ErrorDisplay({ error, onReset }: ErrorDisplayProps) {
  const { t } = useTranslation();

  return (
    <View 
      style={styles.container}
      accessibilityRole="alert"
      accessibilityLiveRegion="assertive"
    >
      <Text variant="headlineMedium" style={styles.title}>
        {t('error')}
      </Text>
      <Text variant="bodyLarge" style={styles.message}>
        {error?.message || t('unexpected_error')}
      </Text>
      <Button 
        mode="contained"
        onPress={onReset}
        style={styles.button}
        accessibilityLabel={t('try_again')}
        accessibilityHint={t('attempt_recover')}
      >
        {t('try_again')}
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    marginBottom: 16,
  },
  message: {
    textAlign: 'center',
    marginBottom: 24,
  },
  button: {
    minWidth: 120,
  },
});
