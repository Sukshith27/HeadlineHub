import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Alert } from 'react-native';
import SplashScreen from './src/screens/SplashScreen';
import NewsFeedScreen from './src/screens/NewsFeedScreen';
import { fetchTeslaNews, fetchAppleNews, storeNews } from './src/utils/newsUtils'; // Updated import

const Stack = createStackNavigator();

const App = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAndStoreNews = async () => {
      try {
        // Fetch Tesla News
        const teslaNews = await fetchTeslaNews(); 
        if (teslaNews.length > 0) {
          await storeNews(teslaNews, 'teslaNews');
        }
        
        // Fetch Apple News
        const appleNews = await fetchAppleNews();
        if (appleNews.length > 0) {
          await storeNews(appleNews, 'appleNews');
        }

        if (teslaNews.length === 0 && appleNews.length === 0) {
          Alert.alert(
            "Network Error",
            "Unable to fetch news. Please check your internet connection and try again.",
            [{ text: "OK" }]
          );
        }
      } catch (error) {
        console.error('Error in fetchAndStoreNews:', error);
        Alert.alert(
          "Error",
          "An unexpected error occurred. Please try again later.",
          [{ text: "OK" }]
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchAndStoreNews();
  }, []);

  if (isLoading) {
    return <SplashScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="NewsFeed" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="NewsFeed" component={NewsFeedScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
