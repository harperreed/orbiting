import { useRouter, usePathname } from 'expo-router';
import { View, Text, TouchableOpacity } from 'react-native-ui-lib';

export default function TabBar() {
  const router = useRouter();
  const pathname = usePathname();

  const isVisible = pathname !== '/';

  if (!isVisible) {
    return null;
  }

  const TabButton = ({ path, emoji, testID }: { path: string; emoji: string; testID: string }) => {
    const isActive = pathname === path;
    return (
      <TouchableOpacity 
        flex
        center
        paddingV-8
        testID={testID}
        onPress={() => router.push(path)}
        style={{
          borderTopWidth: isActive ? 2 : 0,
          borderTopColor: isActive ? 'primary' : undefined
        }}
      >
        <Text 
          text70
          color={isActive ? 'primary' : 'text.secondary'}
        >
          {emoji}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View
      row
      height={50}
      backgroundColor="background.secondary"
      style={{
        borderTopWidth: 1,
        borderTopColor: 'border'
      }}
    >
      <TabButton path="/" emoji="🏠" testID="home-tab" />
      <TabButton path="/history" emoji="⏱️" testID="history-tab" />
      <TabButton path="/help" emoji="❓" testID="help-tab" />
      <TabButton path="/settings" emoji="⚙️" testID="settings-tab" />
      <TabButton path="/about" emoji="ℹ️" testID="about-tab" />
    </View>
  );
}
