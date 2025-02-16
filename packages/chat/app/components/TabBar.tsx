import { useRouter, usePathname } from 'expo-router';
import { BottomNavigation } from 'react-native-paper';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';

export default function TabBar() {
  const router = useRouter();
  const pathname = usePathname();
  const { t } = useTranslation();

  const isVisible = pathname !== '/';

  if (!isVisible) {
    return null;
  }

  return (
    <BottomNavigation
      accessibilityRole="tablist"
      accessibilityLabel={t('main_navigation')}
      navigationState={{
        index: ['/', '/history', '/help', '/settings', '/about'].indexOf(pathname),
        routes: [
          { 
            key: 'home', 
            title: t('home'), 
            focusedIcon: 'home', 
            unfocusedIcon: 'home-outline',
            accessibilityLabel: t('home_screen'),
            accessibilityHint: t('navigate_to_main_text_input_screen')
          },
          { 
            key: 'history', 
            title: t('history'), 
            focusedIcon: 'history', 
            unfocusedIcon: 'history',
            accessibilityLabel: t('history_screen'),
            accessibilityHint: t('view_your_message_history')
          },
          { 
            key: 'help', 
            title: t('help'), 
            focusedIcon: 'help-circle', 
            unfocusedIcon: 'help-circle-outline',
            accessibilityLabel: t('help_screen'),
            accessibilityHint: t('view_app_instructions_and_help')
          },
          { 
            key: 'settings', 
            title: t('settings'), 
            focusedIcon: 'cog', 
            unfocusedIcon: 'cog-outline',
            accessibilityLabel: t('settings_screen'),
            accessibilityHint: t('adjust_app_preferences_and_settings')
          },
          { 
            key: 'about', 
            title: t('about'), 
            focusedIcon: 'information', 
            unfocusedIcon: 'information-outline',
            accessibilityLabel: t('about_screen'),
            accessibilityHint: t('view_app_information_and_credits')
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
