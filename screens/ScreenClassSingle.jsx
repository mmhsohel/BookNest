import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Button, FlatList, TouchableOpacity } from 'react-native';
import useBooks from '../services/api';

// Create top tab navigator

// Top tab screens
const ScreenClassSingle = ({ navigation, route }) => {

  const {bookData} = route.params
 
//  const [books, setBooks] = useState([]);

  const { books, loading, refreshing, refreshBooks } = useBooks(bookData);
   const classes = [...new Set((books || []).map(b => b.class))];

  const backgroundColors = [
    '#4ecdc4',  '#1a535c',  
    '#10ac84', '#341f97',
  ];
  return (
    <View style={styles.container}>
         <FlatList
           data={classes}
           keyExtractor={(item, index) => index.toString()}
           contentContainerStyle={styles.listContent}
           renderItem={({ item, index }) => {
             const backgroundColor = backgroundColors[index % backgroundColors.length];
             return (
               <TouchableOpacity
                 onPress={() =>
                   navigation.navigate('BookViewScreen', {
                     class: item,
                     books: books,
                     bookData: bookData,
                   })
                 }
                 style={[styles.button, { backgroundColor }]}
                 activeOpacity={0.9}
               >
                 <Text style={styles.buttonText}>{item}</Text>
               </TouchableOpacity>
             );
           }}
         />
       </View>
  );
}

export default ScreenClassSingle

 const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F8FA',
  },
  listContent: {
    paddingVertical: 20,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    flexGrow: 1,
  },
  button: {
    width: '100%',                 // Full width of container
    aspectRatio: 4.0,              // Optional: makes it rectangular (1 = square, <1 = taller)
    marginVertical: 10,
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4ecdc4',

    // iOS shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 10,

    // Android shadow
    elevation: 10,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 25,
    fontWeight: '900',
    textAlign: 'center',
    textTransform: 'capitalize',
  },
});
