import { StyleSheet, ScrollView, useWindowDimensions, Platform } from 'react-native';
import { Surface } from 'react-native-paper';
import TabBar from './TabBar';

type PageLayoutProps = {
  children: React.ReactNode;
  scrollable?: boolean;
};

export default function PageLayout({ children, scrollable = false }: PageLayoutProps) {
  const Content = scrollable ? ScrollView : Surface;
  const { width } = useWindowDimensions();
  
  // Determine if device is a tablet/desktop based on screen size
  const isLargeScreen = width >= 768;
  
  // Show TabBar only on large screens or non-mobile platforms
  const showTabBar = isLargeScreen || (Platform.OS !== 'ios' && Platform.OS !== 'android');
  
  return (
    <Surface style={styles.container}>
      <Content style={styles.content}>
        {children}
      </Content>
      {showTabBar && <TabBar />}
    </Surface>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
  },
});
