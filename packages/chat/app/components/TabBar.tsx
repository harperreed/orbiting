import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
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
        <FontAwesome name="home" size={24} color={pathname === '/' ? '#007AFF' : '#666'} />
      </TouchableOpacity>
      <TouchableOpacity 
        style={[styles.tab, pathname === '/history' && styles.activeTab]}
        onPress={() => router.push('/history')}
        testID="history-tab"
      >
        <FontAwesome name="history" size={24} color={pathname === '/history' ? '#007AFF' : '#666'} />
      </TouchableOpacity>
      <TouchableOpacity 
        style={[styles.tab, pathname === '/help' && styles.activeTab]}
        onPress={() => router.push('/help')}
        testID="help-tab"
      >
        <FontAwesome name="question-circle" size={24} color={pathname === '/help' ? '#007AFF' : '#666'} />
      </TouchableOpacity>
      <TouchableOpacity 
        style={[styles.tab, pathname === '/settings' && styles.activeTab]}
        onPress={() => router.push('/settings')}
        testID="settings-tab"
      >
        <FontAwesome name="cog" size={24} color={pathname === '/settings' ? '#007AFF' : '#666'} />
      </TouchableOpacity>
      <TouchableOpacity 
        style={[styles.tab, pathname === '/about' && styles.activeTab]}
        onPress={() => router.push('/about')}
        testID="about-tab"
      >
        <FontAwesome name="info-circle" size={24} color={pathname === '/about' ? '#007AFF' : '#666'} />
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
});
