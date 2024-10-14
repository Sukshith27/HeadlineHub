import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { FlatList, RectButton, Swipeable } from 'react-native-gesture-handler';
import { getStoredNews, storeNews } from '../utils/newsUtils';

const NewsFeedScreen = () => {
  const [teslaHeadlines, setTeslaHeadlines] = useState([]);
  const [appleHeadlines, setAppleHeadlines] = useState([]);
  const [currentFeed, setCurrentFeed] = useState('tesla');
  const [displayedHeadlines, setDisplayedHeadlines] = useState([]);
  const [pinnedHeadlines, setPinnedHeadlines] = useState([]);

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
    setDisplayedHeadlines(prevHeadlines => [...pinnedHeadlines, ...newHeadlines, ...prevHeadlines.filter(h => !pinnedHeadlines.includes(h))]);
  }, [currentFeed, teslaHeadlines, appleHeadlines, displayedHeadlines, pinnedHeadlines]);

  useEffect(() => {
    const timer = setInterval(addNewHeadlines, 10000);
    return () => clearInterval(timer);
  }, [addNewHeadlines]);

  const handleFeedChange = (feed) => {
    setCurrentFeed(feed);
    const headlines = feed === 'tesla' ? teslaHeadlines : appleHeadlines;
    setDisplayedHeadlines([...pinnedHeadlines, ...headlines.slice(0, 10 - pinnedHeadlines.length)]);
  };

  const deleteHeadline = (headline) => {
    setDisplayedHeadlines(prevHeadlines => prevHeadlines.filter(h => h !== headline));
    if (currentFeed === 'tesla') {
      setTeslaHeadlines(prevHeadlines => prevHeadlines.filter(h => h !== headline));
    } else {
      setAppleHeadlines(prevHeadlines => prevHeadlines.filter(h => h !== headline));
    }
  };

  const pinHeadline = (headline) => {
    if (!pinnedHeadlines.includes(headline)) {
      setPinnedHeadlines(prevPinned => [headline, ...prevPinned]);
      setDisplayedHeadlines(prevHeadlines => [headline, ...prevHeadlines.filter(h => h !== headline)]);
    }
  };

  const renderRightActions = (headline) => {
    return (
      <View style={styles.rightActions}>
        <RectButton style={styles.deleteAction} onPress={() => deleteHeadline(headline)}>
          <Text style={styles.actionText}>Delete</Text>
        </RectButton>
        <RectButton style={styles.pinAction} onPress={() => pinHeadline(headline)}>
          <Text style={styles.actionText}>Pin</Text>
        </RectButton>
      </View>
    );
  };

  const renderItem = ({ item }) => (
    <Swipeable renderRightActions={() => renderRightActions(item)}>
      <View style={[styles.headlineItem, pinnedHeadlines.includes(item) && styles.pinnedItem]}>
        <Text style={styles.headlineTitle}>{item.title || '[Removed]'}</Text>
      </View>
    </Swipeable>
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
    backgroundColor: 'white',
  },
  pinnedItem: {
    backgroundColor: '#e6f3ff',
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
  rightActions: {
    flexDirection: 'row',
  },
  deleteAction: {
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    width: 70,
  },
  pinAction: {
    backgroundColor: 'green',
    justifyContent: 'center',
    alignItems: 'center',
    width: 70,
  },
  actionText: {
    color: 'white',
    fontWeight: 'bold',
    padding: 10,
  },
});

export default NewsFeedScreen;
