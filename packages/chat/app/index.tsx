import { useEffect } from 'react';
import HomeScreen from "./components/HomeScreen";

export default function Index() {
  useEffect(() => {
    const initServiceWorker = () => {
      import('./utils/registerServiceWorker')
        .then(({ registerServiceWorker }) => registerServiceWorker())
        .catch(error => console.error('Failed to load SW registration:', error));
    };

    window.addEventListener('load', initServiceWorker);
    return () => window.removeEventListener('load', initServiceWorker);
  }, []);

  return <HomeScreen />;
}
