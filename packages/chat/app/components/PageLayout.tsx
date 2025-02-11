import { StyleSheet, ScrollView, useWindowDimensions, Platform, View } from 'react-native';
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
    <View style={styles.wrapper}>
      <Surface style={styles.container} elevation={1}>
        {scrollable ? (
          <ScrollView 
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
          >
            {children}
          </ScrollView>
        ) : (
          <View style={styles.content}>
            {children}
          </View>
        )}
      </Surface>
      {showTabBar && <TabBar />}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    height: '100%',
  },
  container: {
    flex: 1,
    minHeight: 0,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  scrollView: {
    flex: 1,
    width: '100%',
  },
  scrollContent: {
    padding: 20,
    flexGrow: 1,
  },
});
