import React, { useEffect } from 'react';
import { View, Image, StyleSheet } from 'react-native';

const SplashScreen = ({ navigation }) => {
  useEffect(() => {
    setTimeout(() => {
      navigation?.replace('NewsFeed');
    }, 2000);
  }, []);

  return (
    <View style={styles.container}>
      <Image
        source={{uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT6ErXslxNBqSl59aj-Eu-HSQkP9A6ePPJCjA&s"}}
        style={styles.logo}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  logo: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
  },
});

export default SplashScreen;
