import { useEffect, useState } from 'react';
import RNFS from 'react-native-fs';
import { Alert } from 'react-native';
import axios from 'axios';
import NetInfo from '@react-native-community/netinfo';

import primarytextbooks from '../data/primarytextbooks';
import hightextbooks from '../data/hightextbooks';
import btptbooks from '../data/btptbooks';
import lessonplans from '../data/lessonplans';
import teachersguide from '../data/teachersguide';
import preprimary from '../data/preprimary';
import collegetextbooks from '../data/collegetextbooks';
import card from '../data/cards';
import carousel from '../data/carousel';

const bookDataMap = {
  primarytextbooks,
  hightextbooks,
  btptbooks,
  lessonplans,
  teachersguide,
  preprimary,
  collegetextbooks,
  card,
  carousel
};

const useBooks = (modelName) => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const localFilePath = `${RNFS.DocumentDirectoryPath}/${modelName}.json`;

  const loadFromRNFS = async () => {
    try {
      const exists = await RNFS.exists(localFilePath);
      if (exists) {
        const content = await RNFS.readFile(localFilePath, 'utf8');
        const parsed = JSON.parse(content);
        if (Array.isArray(parsed) && parsed.length > 0) {
        
          return parsed;
        }
      }
    } catch (err) {
      console.warn('❌ Error reading from RNFS:', err);
    }
    return null;
  };

  const fetchFromAPI = async () => {
    const state = await NetInfo.fetch();
    if (!state.isConnected) {
   
      return null;
    }

    try {
      const source = axios.CancelToken.source();
      const timeout = setTimeout(() => source.cancel('⏱ Timeout exceeded'), 1000);

      const response = await axios.get(`https://booknest-1-vowm.onrender.com/api/${modelName}`, {
        cancelToken: source.token
      });

      clearTimeout(timeout);
      const data = response.data;
      if (Array.isArray(data) && data.length > 0) {
        await RNFS.writeFile(localFilePath, JSON.stringify(data), 'utf8');
       
        return data;
      }
    } catch (err) {
      console.warn('❌ API fetch failed:', err?.message);
    }
    return null;
  };

  const loadFromAssets = () => {
   
    return bookDataMap[modelName] || [];
  };

  const loadBooks = async () => {
  setLoading(true);

  let data = await fetchFromAPI();
  if (!data) data = await loadFromRNFS();
  if (!data) data = loadFromAssets();

  if (data && Array.isArray(data)) {
  // Check if at least one item has a `serial` field
  const hasSerial = data.some(item => typeof item.serial !== 'undefined');

  if (hasSerial) {
    data.sort((a, b) => {
      const serialA = typeof a.serial === 'string' ? parseInt(a.serial) : a.serial;
      const serialB = typeof b.serial === 'string' ? parseInt(b.serial) : b.serial;
      return serialA - serialB;
    });
  }
}


  setBooks(data);
  setLoading(false);
};


  const refreshBooks = async () => {
    setRefreshing(true);
    const data = await fetchFromAPI();
    if (data) {
      setBooks(data);
    } else {
      Alert.alert('Update Failed', 'Unable to refresh books from the server.');
    }
    setRefreshing(false);
  };

  useEffect(() => {
    loadBooks();
  }, []);

  return { books, loading, refreshing, refreshBooks };
};

export default useBooks;
