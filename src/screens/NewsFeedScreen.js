import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { FlatList, Swipeable } from 'react-native-gesture-handler';
import { getStoredNews, storeNews, fetchNews } from '../utils/newsUtils';


const NewsFeedScreen = () => {
  const [headlines, setHeadlines] = useState([]);
  const [displayedHeadlines, setDisplayedHeadlines] = useState([]);
  const [pinnedHeadlines, setPinnedHeadlines] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadInitialHeadlines = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const storedNews = await getStoredNews();
      if (storedNews.length === 0) {
        await refreshNewsFeed();
      } else {
        setHeadlines(storedNews);
        setDisplayedHeadlines(storedNews.slice(0, 10));
      }
    } catch (err) {
      setError('Failed to load news. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadInitialHeadlines();
  }, []);

  const addNewHeadlines = useCallback(() => {
    const newHeadlines = headlines.slice(displayedHeadlines.length, displayedHeadlines.length + 5);
    setDisplayedHeadlines(prevHeadlines => [...pinnedHeadlines, ...newHeadlines, ...prevHeadlines.filter(h => !pinnedHeadlines.includes(h))]);
  }, [headlines, displayedHeadlines, pinnedHeadlines]);

  const refreshNewsFeed = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const newNews = await fetchNews();
      await storeNews(newNews);
      setHeadlines(newNews);
      setDisplayedHeadlines(newNews.slice(0, 10));
      setPinnedHeadlines([]);
    } catch (err) {
      setError('Failed to refresh news. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timer = setInterval(addNewHeadlines, 10000);
    return () => clearInterval(timer);
  }, [addNewHeadlines]);

  const deleteHeadline = (headline) => {
    setDisplayedHeadlines(prevHeadlines => prevHeadlines.filter(h => h !== headline));
    setPinnedHeadlines(prevPinned => prevPinned.filter(h => h !== headline));
    setHeadlines(prevHeadlines => prevHeadlines.filter(h => h !== headline));
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
        <TouchableOpacity style={styles.deleteAction} onPress={() => deleteHeadline(headline)}>
          <Text style={styles.actionText}>Delete</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.pinAction} onPress={() => pinHeadline(headline)}>
          <Text style={styles.actionText}>Pin</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderItem = ({ item }) => (
    <Swipeable renderRightActions={() => renderRightActions(item)}>
      <View style={[styles.headlineItem, pinnedHeadlines.includes(item) && styles.pinnedItem]}>
        <View style={styles.headlineTop}>
          <View style={styles.sourceContainer}>
            <Image source={{ uri: item.urlToImage }} style={styles.sourceImage} />
            <Text style={styles.sourceName}>{item.source?.name || 'Unknown Source'}</Text>
          </View>
          <Text style={styles.publishTime}>{new Date(item.publishedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
        </View>
        <Text style={styles.headlineTitle}>{item.title || '[Removed]'}</Text>
        <View style={styles.headlineBottom}>
          <Text style={styles.authorName}>{item.author || 'Unknown Author'}</Text>
          <Image source={{ uri: item.urlToImage }} style={styles.newsImage} />
        </View>
      </View>
    </Swipeable>
  );

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.refreshButton} onPress={refreshNewsFeed}>
          <Text style={styles.refreshButtonText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={{uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT6ErXslxNBqSl59aj-Eu-HSQkP9A6ePPJCjA&s"}} style={styles.logo} />
        <TouchableOpacity onPress={refreshNewsFeed} style={styles.refreshButton}>
          <Text style={styles.refreshIcon}>↻</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={displayedHeadlines}
        renderItem={renderItem}
        keyExtractor={(item, index) => `${item.title}-${index}`}
        refreshing={isLoading}
        onRefresh={refreshNewsFeed}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
  },
  logo: {
    width: 100,
    height: 60,
    resizeMode: 'contain',
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
  headlineTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sourceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sourceImage: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 5,
  },
  sourceName: {
    fontSize: 12,
    color: '#666',
  },
  publishTime: {
    fontSize: 12,
    color: '#666',
  },
  headlineTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  headlineBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  authorName: {
    fontSize: 12,
    color: '#666',
  },
  newsImage: {
    width: 50,
    height: 50,
    borderRadius: 5,
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
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    marginBottom: 20,
  },
  refreshButton: {
    padding: 10,
  },
  refreshIcon: {
    fontSize: 24,
    color: '#484a48',
  },
});

export default NewsFeedScreen;
