import { View, StyleSheet, ScrollView } from 'react-native';
import TabBar from './TabBar';

type PageLayoutProps = {
  children: React.ReactNode;
  scrollable?: boolean;
};

export default function PageLayout({ children, scrollable = false }: PageLayoutProps) {
  const Content = scrollable ? ScrollView : View;
  
  return (
    <View style={styles.container}>
      <Content style={styles.content}>
        {children}
      </Content>
      <TabBar />
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
