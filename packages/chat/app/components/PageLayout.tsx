import { View, StyleSheet, ScrollView, useWindowDimensions, Platform } from 'react-native';
import TabBar from './TabBar';

type PageLayoutProps = {
  children: React.ReactNode;
  scrollable?: boolean;
};

export default function PageLayout({ children, scrollable = false }: PageLayoutProps) {
  const Content = scrollable ? ScrollView : View;
  const { width, height } = useWindowDimensions();
  
  // Determine if device is a tablet/desktop based on screen size
  // Using 768dp as the breakpoint (common tablet breakpoint)
  const isLargeScreen = width >= 768;
  
  // Show TabBar only on large screens (tablets/desktop)
  // or on platforms other than iOS and Android
  const showTabBar = isLargeScreen || (Platform.OS !== 'ios' && Platform.OS !== 'android');
  
  return (
    <View style={styles.container}>
      <Content style={styles.content}>
        {children}
      </Content>
      {showTabBar && <TabBar />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    padding: 20,
  },
});
