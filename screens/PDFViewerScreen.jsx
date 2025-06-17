import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  Alert,
} from 'react-native';
import Pdf from 'react-native-pdf';

const PdfViewerScreen = ({route, navigation}) => {
  const {uri, title} = route.params;

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);


  if (!uri) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>❌ PDF ফাইল খুঁজে পাওয়া যায়নি।</Text>
      </View>
    );
  }

  const source = {uri, cache: true};

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Pdf
        source={source}
        onLoadComplete={(numberOfPages, filePath) => {
          try {
           
            setTotalPages(numberOfPages);
          } catch (e) {
           
          }
        }}
        onPageChanged={page => {
        
          setCurrentPage(page);
        }}
        onError={error => {
       
          Alert.alert('Error', 'Failed to load PDF file.');
        }}
        onPressLink={uri => {
          
        }}
        style={styles.pdf}
        activityIndicator={<ActivityIndicator size="large" color="#1e90ff" />}
      />

      <Text style={styles.pageText}>
        📄 পৃষ্ঠা: {currentPage} / {totalPages}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#23B1B1'},
  title: {
    padding: 12,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    backgroundColor: '#23B1B1',
    color: '#FFFFFF',
  },
  pdf: {
    flex: 1,
    width: Dimensions.get('window').width,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pageText: {
    position: 'absolute',
    top: 6,
    right: 0,
    zIndex: 1,
    textAlign: 'center',
    padding: 10,
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: 'bold',
    backgroundColor: 'black',
  },
  errorText: {
    fontSize: 16,
    color: 'red',
  },
});

export default PdfViewerScreen;
