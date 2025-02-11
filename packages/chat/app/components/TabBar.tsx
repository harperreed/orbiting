import { useRouter, usePathname } from 'expo-router';
import { View } from 'react-native';
import { TabBar as UITabBar } from 'react-native-ui-lib';

export default function TabBar() {
  const router = useRouter();
  const pathname = usePathname();

  const isVisible = pathname !== '/';

  if (!isVisible) {
    return null;
  }

  const routes = ['/', '/history', '/help', '/settings', '/about'];
  const currentIndex = routes.indexOf(pathname);

  return (
    <UITabBar
      selectedIndex={currentIndex}
      enableShadow
      onChangeIndex={(index) => router.push(routes[index])}
    >
      <UITabBar.Item
        label="Home"
        icon={currentIndex === 0 ? 'home' : 'home-outline'}
        onPress={() => router.push('/')}
      />
      <UITabBar.Item
        label="History"
        icon="history"
        onPress={() => router.push('/history')}
      />
      <UITabBar.Item
        label="Help"
        icon={currentIndex === 2 ? 'help-circle' : 'help-circle-outline'}
        onPress={() => router.push('/help')}
      />
      <UITabBar.Item
        label="Settings"
        icon={currentIndex === 3 ? 'cog' : 'cog-outline'}
        onPress={() => router.push('/settings')}
      />
      <UITabBar.Item
        label="About"
        icon={currentIndex === 4 ? 'information' : 'information-outline'}
        onPress={() => router.push('/about')}
      />
    </UITabBar>
  );
}
