import { useRouter, usePathname } from 'expo-router';
import { BottomNavigation } from 'react-native-paper';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';

export default function TabBar() {
  const { t } = useTranslation();
  const router = useRouter();
  const pathname = usePathname();

  const isVisible = pathname !== '/';

  if (!isVisible) {
    return null;
  }

  return (
    <BottomNavigation
      accessibilityRole="tablist"
      accessibilityLabel={t('mainNavigation')}
      navigationState={{
        index: ['/', '/history', '/help', '/settings', '/about'].indexOf(pathname),
        routes: [
          { 
            key: 'home', 
            title: t('home'), 
            focusedIcon: 'home', 
            unfocusedIcon: 'home-outline',
            accessibilityLabel: t('home'),
            accessibilityHint: t('homeHint')
          },
          { 
            key: 'history', 
            title: t('historyTab'), 
            focusedIcon: 'history', 
            unfocusedIcon: 'history',
            accessibilityLabel: t('historyTab'),
            accessibilityHint: t('historyHint')
          },
          { 
            key: 'help', 
            title: t('helpTab'), 
            focusedIcon: 'help-circle', 
            unfocusedIcon: 'help-circle-outline',
            accessibilityLabel: t('helpTab'),
            accessibilityHint: t('helpHint')
          },
          { 
            key: 'settings', 
            title: t('settingsTab'), 
            focusedIcon: 'cog', 
            unfocusedIcon: 'cog-outline',
            accessibilityLabel: t('settingsTab'),
            accessibilityHint: t('settingsHint')
          },
          { 
            key: 'about', 
            title: t('aboutTab'), 
            focusedIcon: 'information', 
            unfocusedIcon: 'information-outline',
            accessibilityLabel: t('aboutTab'),
            accessibilityHint: t('aboutHint')
          },
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
