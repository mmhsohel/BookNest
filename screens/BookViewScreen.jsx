import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ActivityIndicator,
  Button,
  Alert,
  Dimensions,
} from 'react-native';
import RNFS from 'react-native-fs';
import * as Progress from 'react-native-progress';
import Ionicons from 'react-native-vector-icons/Ionicons';

const screenWidth = Dimensions.get('window').width;

const BookViewScreen = ({route, navigation}) => {
  const {class: className, books, bookData} = route.params;

  let subs = [];
  const match = books.find(b => {
    if (b.class === className) {
      subs = b.subs;
      return true;
    } else if (b.envClass === className) {
      subs = b.envSubs;
      return true;
    }
    return false;
  });



  const [downloadedFiles, setDownloadedFiles] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [bookToDelete, setBookToDelete] = useState(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    checkDownloadedFiles();
  }, []);

  const checkDownloadedFiles = async () => {
    try {
      const filesMap = {};
      for (const book of subs) {
        const folderPath = `${bookData}/${className}`;
        const fullFolderPath = `${RNFS.DocumentDirectoryPath}/${folderPath}`;
        const filePath = `${fullFolderPath}/${book.filename}`;
        const exists = await RNFS.exists(filePath);
        if (exists) {
          filesMap[book.id] = {localUri: 'file://' + filePath};
        }
      }
      setDownloadedFiles(filesMap);
    } catch (error) {
   
    }
  };

  const downloadFromUrl = async (url, destPath) => {
    const options = {
      fromUrl: url,
      toFile: destPath,
      begin: () => setProgress(0),
      progress: res => {
        const prog = res.bytesWritten / res.contentLength;
        setProgress(prog);
      },
      progressDivider: 1,
    };
    const ret = RNFS.downloadFile(options);
    await ret.promise;
  };

  const startDownload = async () => {
    if (!selectedBook) return;

    const folderPath = `${bookData}/${className}`;
    const fullFolderPath = `${RNFS.DocumentDirectoryPath}/${folderPath}`;

    try {
      const folderExists = await RNFS.exists(fullFolderPath);
      if (!folderExists) {
        await RNFS.mkdir(fullFolderPath);
      }
    } catch (err) {
      Alert.alert('Error', 'ফোল্ডার তৈরি করতে ব্যর্থ হয়েছে।');
      setModalVisible(false);
      setSelectedBook(null);
      setProgress(0);
      return;
    }

    const destPath = `${fullFolderPath}/${selectedBook.filename}`;

    try {
      await downloadFromUrl(selectedBook.url, destPath);
      const stats = await RNFS.stat(destPath);
      if (stats.size < 1000) throw new Error('File too small or corrupted');
    } catch (error1) {
      if (selectedBook.backupUrl) {
        try {
          await downloadFromUrl(selectedBook.backupUrl, destPath);
        } catch (error2) {
          Alert.alert(
            'Download failed',
            `Primary and backup sources failed.\n\nPrimary: ${error1.message}\nBackup: ${error2.message}`,
          );
          setModalVisible(false);
          setProgress(0);
          setSelectedBook(null);
          return;
        }
      } else {
        Alert.alert('Download failed', error1.message);
        setModalVisible(false);
        setProgress(0);
        setSelectedBook(null);
        return;
      }
    }

    const updatedFiles = {
      ...downloadedFiles,
      [selectedBook.id]: {localUri: 'file://' + destPath},
    };
    setDownloadedFiles(updatedFiles);
    setModalVisible(false);
    setProgress(0);
    setSelectedBook(null);
  };

  const confirmDelete = async () => {
    if (!bookToDelete) return;

    try {
      const filePath = downloadedFiles[bookToDelete.id]?.localUri.replace(
        'file://',
        '',
      );
      if (filePath) {
        const exists = await RNFS.exists(filePath);
        if (exists) {
          await RNFS.unlink(filePath);
        }
        const updatedFiles = {...downloadedFiles};
        delete updatedFiles[bookToDelete.id];
        setDownloadedFiles(updatedFiles);
      }
    } catch (error) {
      Alert.alert('Delete error', error.message);
    } finally {
      setDeleteModalVisible(false);
      setBookToDelete(null);
    }
  };

  const onCardPress = item => {
    const isDownloaded = !!downloadedFiles[item.id];
    if (isDownloaded) {
      navigation.navigate('PdfViewerScreen', {
        uri: downloadedFiles[item.id].localUri,
        title: item.title,
      });
    } else {
      setSelectedBook(item);
      setModalVisible(true);
    }
  };

  const renderBookItem = ({item}) => {

    const isDownloaded = !!downloadedFiles[item.id];

    return (
      <View style={styles.bookCard}>
        <TouchableOpacity
          style={styles.bookInfoTouchable}
          onPress={() => onCardPress(item)}
          activeOpacity={0.8}>
          <Image source={{uri: item.imageUrl}} style={styles.bookImage} />
          <View style={styles.bookInfo}>
            <Text style={styles.bookTitle}>{item.title}</Text>
            <Text style={styles.bookCategory}>{item.category}</Text>
            <Text style={isDownloaded ? styles.openText : styles.downloadText}>
              {isDownloaded ? '📖 খুলুন' : '📥 ডাউনলোড'}
            </Text>
          </View>
        </TouchableOpacity>

        {isDownloaded && (
          <TouchableOpacity
            style={styles.deleteButtonContainer}
            onPress={() => {
              setBookToDelete(item);
              setDeleteModalVisible(true);
            }}>
            <View style={styles.iconWrapper}>
              <Ionicons name="trash" size={24} color="#fff" />
            </View>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{className} এর বইসমূহ</Text>

      <FlatList
        data={subs}
        keyExtractor={item => item.id}
        renderItem={renderBookItem}
        contentContainerStyle={{paddingBottom: 100}}
      />

      {/* Download Modal */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {progress === 0 ? (
              <>
                <Text style={styles.modalTitle}>📘 {className}</Text>
                <Text style={styles.modalSubTitle}>
                  বিষয়: {selectedBook?.title || 'N/A'}
                </Text>
                <View style={styles.buttonRow}>
                  <Button
                    title="Cancel"
                    color="#ff4d4d"
                    onPress={() => {
                      setModalVisible(false);
                      setSelectedBook(null);
                    }}
                  />
                  <Button
                    title="Download"
                    color="#4CAF50"
                    onPress={startDownload}
                  />
                </View>
              </>
            ) : (
              <>
                <ActivityIndicator size="large" color="#00BFFF" />

                <Text style={styles.modalDownloadingTitle}>
                  📘 {selectedBook?.title || 'বইয়ের নাম'} {'\n'}শ্রেণী:{' '}
                  {className}
                </Text>

                <Text style={styles.downloadingText}>ডাউনলোড হচ্ছে:</Text>

                <View style={styles.progressContainer}>
                  <View style={styles.progressBarWrapper}>
                    <Progress.Bar
                      progress={progress}
                      width={250}
                      height={25}
                      borderRadius={20}
                      color="#2ecc71"
                      unfilledColor="#B3B4BD"
                      borderWidth={0}
                    />
                    <Text style={styles.progressText}>
                      {(progress * 100).toFixed(2)}%
                    </Text>
                  </View>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>

      {/* Delete Modal */}
      <Modal visible={deleteModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.deleteModalContainer}>
            <Text style={styles.deleteModalTitle}>
              <Text style={{color: 'red'}}> "{bookToDelete?.title}" </Text>
              ডিলিট করতে চান?
            </Text>

            <View style={styles.deleteModalButtonRow}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setDeleteModalVisible(false);
                  setBookToDelete(null);
                }}>
                <Text style={styles.cancelButtonText}>না</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.deleteButton]}
                onPress={confirmDelete}>
                <Text style={styles.deleteButtonText}>হ্যাঁ</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA', // Soft gradient-like base
    paddingHorizontal: 10,
  },
  header: {
    fontSize: 25,
    fontWeight: 'extra-bold',
    color: 'white',
    textAlign: 'center',
    marginTop: -20,
  },

  bookCard: {
    backgroundColor: '#ACE3F6',
    borderRadius: 12,
    marginVertical: 8,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#6A1B9A',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  bookInfoTouchable: {
    flexDirection: 'row',
    flex: 1,
  },
  bookImage: {
    width: 100, // More prominent display
    height: 110,
    resizeMode: 'cover',
    marginRight: 10,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    marginRight: 10,
    backgroundColor: '#ddd',
    marginRight: 15,
    shadowColor: '#6A1B9A',
  },
  bookInfo: {
    flex: 1,
    justifyContent: 'space-around',
  },
  bookTitle: {
    fontSize: 24,
    fontWeight: '900',
    color:'rgb(38, 73, 148)', // Almost black for strong legibility
    textTransform: 'capitalize',
  },
  bookCategory: {
    fontSize: 14,
    color: '#6A1B9A',
  },
  openText: {
    color: 'green',
    fontWeight: 'bold',
  },
  downloadText: {
    color: '#D84315',
    fontWeight: 'bold',
  },
  deleteButtonContainer: {
    padding: 8,
    justifyContent: 'center',
  },
  deleteButton: {
    fontSize: 18,
    color: '#E53935',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: screenWidth * 0.85,
    backgroundColor: '#FFF',
    borderRadius: 15,
    padding: 20,
    elevation: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4A148C',
    marginBottom: 10,
    textAlign: 'center',
  },
  modalSubTitle: {
    fontSize: 16,
    marginBottom: 20,
    color: '#6A1B9A',
    textAlign: 'center',
  },
  modalDownloadingTitle: {
    fontSize: 16,
    color: '#4A148C',
    fontWeight: 'bold',
    marginTop: 10,
    textAlign: 'center',
  },
  downloadingText: {
    marginTop: 10,
    fontSize: 14,
    color: '#000',
  },
  progressHighlight: {
    fontWeight: 'bold',
    color: '#1E88E5',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 15,
  },
  progressTextInside: {
    position: 'absolute',
    color: '#000',
    fontWeight: 'bold',
    fontSize: 12,
    zIndex: 1,
  },
  progressContainer: {
    marginTop: 20,
    alignItems: 'center',
  },

  progressBarWrapper: {
    position: 'relative',
    width: 250,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },

  progressText: {
    position: 'absolute',
    color: 'white',
    fontSize: 12,
    zIndex: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  deleteModalContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    width: '85%',
    paddingVertical: 30,
    paddingHorizontal: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 5,
  },

  deleteModalTitle: {
    fontSize: 22,
    fontWeight: '900',
    textAlign: 'center',
    color: 'black',
    marginBottom: 25,
  },

  deleteModalButtonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },

  modalButton: {
    flex: 1,
    paddingVertical: 12,
    marginHorizontal: 5,
    borderRadius: 10,
    alignItems: 'center',
  },

  cancelButton: {
    backgroundColor: '#ecf0f1',
  },

  deleteButton: {
    backgroundColor: '#e74c3c',
  },

  cancelButtonText: {
    color: '#2c3e50',
    fontWeight: '600',
    fontSize: 16,
  },

  deleteButtonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 16,
  },
  iconWrapper: {
    backgroundColor: '#ff3b30', // Professional red tone for delete
    padding: 12,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    width: 50,
    height: 50,

    // Shadow for iOS
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 5,

    // Elevation for Android
    elevation: 6,
  },
});

export default BookViewScreen;
