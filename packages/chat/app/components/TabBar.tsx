import { useRouter, usePathname } from 'expo-router';
import { BottomNavigation } from 'react-native-paper';
import { View } from 'react-native';

export default function TabBar() {
  const router = useRouter();
  const pathname = usePathname();

  const isVisible = pathname !== '/';

  if (!isVisible) {
    return null;
  }

  return (
    <BottomNavigation
      navigationState={{
        index: ['/', '/history', '/help', '/settings', '/about'].indexOf(pathname),
        routes: [
          { key: 'home', title: 'Home', focusedIcon: 'home', unfocusedIcon: 'home-outline' },
          { key: 'history', title: 'History', focusedIcon: 'history', unfocusedIcon: 'history' },
          { key: 'help', title: 'Help', focusedIcon: 'help-circle', unfocusedIcon: 'help-circle-outline' },
          { key: 'settings', title: 'Settings', focusedIcon: 'cog', unfocusedIcon: 'cog-outline' },
          { key: 'about', title: 'About', focusedIcon: 'information', unfocusedIcon: 'information-outline' },
        ],
      }}
      renderScene={() => <View />}
      onIndexChange={(index) => {
        const route = ['/', '/history', '/help', '/settings', '/about'][index];
        router.push(route);
      }}
      onTabPress={({ route }) => {
        switch (route.key) {
          case 'home':
            router.push('/');
            break;
          case 'history':
            router.push('/history');
            break;
          case 'help':
            router.push('/help');
            break;
          case 'settings':
            router.push('/settings');
            break;
          case 'about':
            router.push('/about');
            break;
        }
      }}
    />
  );
}
