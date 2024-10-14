import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { getStoredNews } from '../utils/newsUtils';

const NewsFeedScreen = () => {
  const [teslaHeadlines, setTeslaHeadlines] = useState([]);
  const [appleHeadlines, setAppleHeadlines] = useState([]);
  const [currentFeed, setCurrentFeed] = useState('tesla');
  const [displayedHeadlines, setDisplayedHeadlines] = useState([]);

  useEffect(() => {
    const loadInitialHeadlines = async () => {
      const storedTeslaNews = await getStoredNews('teslaNews');
      const storedAppleNews = await getStoredNews('appleNews');
      setTeslaHeadlines(storedTeslaNews);
      setAppleHeadlines(storedAppleNews);
      setDisplayedHeadlines(storedTeslaNews.slice(0, 10));
    };
    loadInitialHeadlines();
  }, []);

  const addNewHeadlines = useCallback(() => {
    const currentHeadlines = currentFeed === 'tesla' ? teslaHeadlines : appleHeadlines;
    const newHeadlines = currentHeadlines.slice(displayedHeadlines.length, displayedHeadlines.length + 5);
    setDisplayedHeadlines(prevHeadlines => [...newHeadlines, ...prevHeadlines]);
  }, [currentFeed, teslaHeadlines, appleHeadlines, displayedHeadlines]);

  useEffect(() => {
    const timer = setInterval(addNewHeadlines, 10000);
    return () => clearInterval(timer);
  }, [addNewHeadlines]);

  const handleFeedChange = (feed) => {
    setCurrentFeed(feed);
    setDisplayedHeadlines(feed === 'tesla' ? teslaHeadlines.slice(0, 10) : appleHeadlines.slice(0, 10));
  };

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
          onPress={() => handleFeedChange('tesla')}
        >
          <Text style={styles.buttonText}>Tesla News</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, currentFeed === 'apple' && styles.activeButton]}
          onPress={() => handleFeedChange('apple')}
        >
          <Text style={styles.buttonText}>Apple News</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={displayedHeadlines}
        renderItem={renderItem}
        keyExtractor={(item, index) => `${item.title}-${index}`}
      />
      <TouchableOpacity style={styles.refreshButton} onPress={addNewHeadlines}>
        <Text style={styles.refreshButtonText}>Refresh</Text>
      </TouchableOpacity>
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
  refreshButton: {
    backgroundColor: '#007AFF',
    padding: 10,
    alignItems: 'center',
    margin: 10,
    borderRadius: 5,
  },
  refreshButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default NewsFeedScreen;
