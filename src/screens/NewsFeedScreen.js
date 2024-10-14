import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { getStoredNews } from '../utils/newsUtils';

const NewsFeedScreen = () => {
  const [teslaHeadlines, setTeslaHeadlines] = useState([]);
  const [appleHeadlines, setAppleHeadlines] = useState([]);
  const [currentFeed, setCurrentFeed] = useState('tesla');

  useEffect(() => {
    const loadInitialHeadlines = async () => {
      const storedTeslaNews = await getStoredNews('teslaNews');
      setTeslaHeadlines(storedTeslaNews.slice(0, 10));

      const storedAppleNews = await getStoredNews('appleNews');
      setAppleHeadlines(storedAppleNews.slice(0, 10));
    };
    loadInitialHeadlines();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.headlineItem}>
      <Text style={styles.headlineTitle}>{item.title}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, currentFeed === 'tesla' && styles.activeButton]}
          onPress={() => setCurrentFeed('tesla')}
        >
          <Text style={styles.buttonText}>Tesla News</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, currentFeed === 'apple' && styles.activeButton]}
          onPress={() => setCurrentFeed('apple')}
        >
          <Text style={styles.buttonText}>Apple News</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={currentFeed === 'tesla' ? teslaHeadlines : appleHeadlines}
        renderItem={renderItem}
        keyExtractor={(item) => item.title}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
  },
  button: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#ddd',
  },
  activeButton: {
    backgroundColor: '#007AFF',
  },
  buttonText: {
    fontWeight: 'bold',
  },
  headlineItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  headlineTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default NewsFeedScreen;
