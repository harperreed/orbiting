import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useRouter, usePathname } from 'expo-router';

export default function TabBar() {
  const router = useRouter();
  const pathname = usePathname();

  const isVisible = pathname !== '/';

  if (!isVisible) {
    return null;
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={[styles.tab, pathname === '/' && styles.activeTab]}
        onPress={() => router.push('/')}
        testID="home-tab"
      >
        <Text style={[styles.emoji, pathname === '/' && styles.activeEmoji]}>🏠</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={[styles.tab, pathname === '/history' && styles.activeTab]}
        onPress={() => router.push('/history')}
        testID="history-tab"
      >
        <Text style={[styles.emoji, pathname === '/history' && styles.activeEmoji]}>⏱️</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={[styles.tab, pathname === '/help' && styles.activeTab]}
        onPress={() => router.push('/help')}
        testID="help-tab"
      >
        <Text style={[styles.emoji, pathname === '/help' && styles.activeEmoji]}>❓</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={[styles.tab, pathname === '/settings' && styles.activeTab]}
        onPress={() => router.push('/settings')}
        testID="settings-tab"
      >
        <Text style={[styles.emoji, pathname === '/settings' && styles.activeEmoji]}>⚙️</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={[styles.tab, pathname === '/about' && styles.activeTab]}
        onPress={() => router.push('/about')}
        testID="about-tab"
      >
        <Text style={[styles.emoji, pathname === '/about' && styles.activeEmoji]}>ℹ️</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#f5f5f5',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    height: 50,
  },
  tab: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
  },
  activeTab: {
    borderTopWidth: 2,
    borderTopColor: '#007AFF',
  },
  emoji: {
    fontSize: 24,
    color: '#666',
  },
  activeEmoji: {
    color: '#007AFF',
  },
});
