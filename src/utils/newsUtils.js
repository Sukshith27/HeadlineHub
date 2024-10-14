import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const API_URL = 'https://asia-south1-kc-stage-rp.cloudfunctions.net/globalNews';

const axiosInstance = axios.create({
  headers: {
    'Accept': 'application/json, text/plain, */*',
    'Content-Type': 'application/json'
  }
});

// Fetch Tesla News
export const fetchTeslaNews = async (from = new Date().toISOString().split('T')[0], sortBy = 'publishedAt') => {
  try {
    console.log('Fetching Tesla news with params:', { from, sortBy });
    const response = await axiosInstance.post(API_URL, {}, {
      params: {
        endpoint: 'everything',
        q: 'tesla',
        from: 2024-10-13,
        sortBy: 2024-10-13,
        apiKey: '03d30eb2b7454b4da64774d67518c221'
      }
    });
    console.log('Tesla news response:', response.data);
    return response.data.articles.slice(0, 100);
  } catch (error) {
    console.error('Error fetching Tesla news:', error.response ? error.response.data : error.message);
    return [];
  }
};

// Fetch Apple News
export const fetchAppleNews = async (from = new Date().toISOString().split('T')[0], to = new Date().toISOString().split('T')[0], sortBy = 'popularity') => {
  try {
    console.log('Fetching Apple news with params:', { from, to, sortBy });
    const response = await axiosInstance.post(API_URL, {}, {
      params: {
        endpoint: 'everything',
        q: 'apple',
        from: 2024-10-13,
        to: 2024-10-13,
        sortBy: sortBy,
        apiKey: '5c659f698d0549b0895d0fcb6ba84e20'
      }
    });
    console.log('Apple news response:', response.data);
    return response.data.articles.slice(0, 100);
  } catch (error) {
    console.error('Error fetching Apple news:', error.response ? error.response.data : error.message);
    return [];
  }
};

// Fetch Google News
export const fetchGoogleNews = async (from = new Date().toISOString().split('T')[0], sortBy = 'publishedAt') => {
  try {
    console.log('Fetching Google news with params:', { from, sortBy });
    const response = await axiosInstance.post(API_URL, {}, {
      params: {
        endpoint: 'everything',
        q: 'google',
        from: 2024-10-13,
        sortBy: 2024-10-13,
        apiKey: '5c659f698d0549b0895d0fcb6ba84e20'
      }
    });
    console.log('Google news response:', response.data);
    return response.data.articles.slice(0, 100);
  } catch (error) {
    console.error('Error fetching Google news:', error.response ? error.response.data : error.message);
    return [];
  }
};

// Store News in AsyncStorage
export const storeNews = async (news, key = 'storedNews') => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(news));
  } catch (error) {
    console.error('Error storing news:', error);
  }
};

// Get Stored News from AsyncStorage
export const getStoredNews = async (key = 'storedNews') => {
  try {
    const storedNews = await AsyncStorage.getItem(key);
    return storedNews ? JSON.parse(storedNews) : [];
  } catch (error) {
    console.error('Error getting stored news:', error);
    return [];
  }
};
