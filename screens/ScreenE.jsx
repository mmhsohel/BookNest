import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  Modal,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { deleteBtptBook } from '../services/api2';

const screenWidth = Dimensions.get('window').width;

const ScreenE = ({ route, navigation }) => {
  const { class: className, books, bookData, version } = route.params;
  const [allbook, setAllbook] = useState(books);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedBookId, setSelectedBookId] = useState(null);
  const [finalBookList, setFinalBookList]   = useState ([])

  const getSubs = () => {
    const targetClass = allbook.find(
      b => b.class === className || b.envClass === className
    );
       return targetClass ? (version === 'bangla' ? targetClass.subs : targetClass.envSubs || []) : [];
  };

  const [bookList, setBookList] = useState([...getSubs(), { id: 'add', type: 'add' }]);



  useFocusEffect(
    useCallback(() => {
      const updatedSubs = getSubs();

  const withSerial = updatedSubs.filter(
    item => item?.serial !== undefined && item?.serial !== null && item?.serial !== ''
  );

  const withoutSerial = updatedSubs.filter(
    item => item?.serial === undefined || item?.serial === null || item?.serial === ''
  );

   {withSerial.length > 0 && withSerial.sort((a, b) => {
    const serialA = typeof a.serial === 'string' ? parseInt(a.serial) : a.serial;
    const serialB = typeof b.serial === 'string' ? parseInt(b.serial) : b.serial;
    return serialA - serialB;
  });
      }
  const sortedBooks = [...withSerial, ...withoutSerial];

      setBookList([...sortedBooks, { id: 'add', type: 'add' }]);
    }, [allbook])
  );

  const onCardPress = (book) => {
    navigation.navigate('BookDetailScreen', { book, className, bookData, version });
  };

  const onUpdate = (book) => {
    navigation.navigate('BookDetailScreen', { book, className, bookData, version, setAllbook });
  };

  const onAddNew = () => {
    navigation.navigate('BookDetailScreen', { className, bookData, version, setAllbook });
  };

  const onDelete = async (bookId) => {
    try {
      await deleteBtptBook(bookId); // Ensure your API function accepts bookId
      const updated = getSubs().filter(book => book.id !== bookId);
      setAllbook(prev =>
        prev.map(b =>
          b.class === className || b.envClass === className
            ? { ...b, subs: updated }
            : b
        )
      );
      setDeleteModalVisible(false);
      setSelectedBookId(null);
    } catch (error) {
      console.error('Delete failed:', error);
    }
  };

  const confirmDelete = (bookId) => {
    setSelectedBookId(bookId);
    setDeleteModalVisible(true);
  };

  const renderBookItem = ({ item }) => {
    if (item.type === 'add') {
      return (
        <TouchableOpacity
          style={styles.addCard}
          onPress={onAddNew}
          activeOpacity={0.8}
        >
          <Text style={styles.addText}>➕ নতুন বই যুক্ত করুন</Text>
        </TouchableOpacity>
      );
    }

    return (
      <TouchableOpacity
        style={styles.bookCard}
        onPress={() => onCardPress(item)}
        activeOpacity={0.8}
      >
       <View style={{marginRight: 20}}>
         <Image
          source={{ uri: item.imageUrl }}
          style={styles.bookImage}
          onError={() => console.warn(`Image failed to load for ${item.id}`)}
        />
       </View>
        <View style={styles.bookInfo}>
          <Text style={styles.bookTitle}>{item.title}</Text>
          <Text style={styles.bookCategory}>{item.category}</Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.updateButton} onPress={() => onUpdate(item)}>
              <Text style={styles.buttonText}>✏️ Update</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.deleteButton} onPress={() => confirmDelete(item.id)}>
              <Text style={styles.buttonText}>🗑️ Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{className} এর বইসমূহ</Text>
      <FlatList
        data={bookList}
        keyExtractor={(item, index) => item?.id || `item-${index}`}
        renderItem={renderBookItem}
        contentContainerStyle={{ paddingBottom: 100 }}
      />

      <Modal
        visible={deleteModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setDeleteModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalText}>আপনি কি এই বইটি মুছে ফেলতে চান?</Text>
            <View style={styles.modalButtonRow}>
              <TouchableOpacity style={styles.modalCancel} onPress={() => setDeleteModalVisible(false)}>
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalConfirm} onPress={() => onDelete(selectedBookId)}>
                <Text style={styles.buttonText}>Yes, Delete</Text>
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
    padding: 10, 
    backgroundColor:"#F4F6F8",

   },
  header: { fontSize: 22, fontWeight: 'bold', marginVertical: 10 },
 bookCard: {
  flexDirection: 'row',
  backgroundColor: '#ffffff', // Clean white background
  borderRadius: 12,
  padding: 16,
  marginBottom: 20,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 3 },
  shadowOpacity: 0.1,
  shadowRadius: 6,
  elevation: 4,
  borderWidth: 1,
  borderColor: '#e0e0e0',
  alignItems: 'center',
},

bookImage: {
  width: 100,               // More prominent display
  height: 110,
  resizeMode: 'cover',
  marginRight: 10,
  borderRadius: 8,
  backgroundColor: '#f0f0f0', // Fallback while loading
},

  bookInfo: {
    flex: 1,
  },
  bookTitle: {
    fontSize: 24,
    fontWeight: '900',
    color:'rgb(38, 73, 148)', // Almost black for strong legibility
    textTransform: 'capitalize',
  },
  bookCategory: {
    fontSize: 14,
    color: '#555',
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  updateButton: {
    backgroundColor: '#cce5ff',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 5,
    marginRight: 10,
  },
  deleteButton: {
    backgroundColor: '#ffcccc',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 5,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  addCard: {
    padding: 20,
    backgroundColor: '#e0ffe0',
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 15,
  },
  addText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007b00',
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    width: '80%',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
  },
  modalButtonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalCancel: {
    backgroundColor: '#ddd',
    padding: 10,
    borderRadius: 8,
    flex: 1,
    marginRight: 5,
    alignItems: 'center',
  },
  modalConfirm: {
    backgroundColor: '#f88',
    padding: 10,
    borderRadius: 8,
    flex: 1,
    marginLeft: 5,
    alignItems: 'center',
  },
});

export default ScreenE;
