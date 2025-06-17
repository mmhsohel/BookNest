import React, {useCallback, useState, memo, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Dimensions,
  SafeAreaView,
  Alert,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import useBooks from '../services/api';
import {deleteCardAndCarousel} from '../services/api2';

const {width} = Dimensions.get('window');

const CardItem = memo(({item, navigation, setCards}) => {
  const handleDelete = async () => {
    Alert.alert('Confirm Delete', 'Are you sure?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Delete',
        onPress: async () => {
          try {
            // Optimistic update
            const response = await deleteCardAndCarousel('cardcarousel', item._id);
   
            if (response?.success) {
              setCards(prev => prev.filter(card => card._id !== item._id));
            }
          } catch (error) {
            console.error('Error deleting:', error);
          }
        },
      },
    ]);
  };

  return (
    <TouchableOpacity
      onPress={() =>
     {
      item?.screen &&    
      navigation.navigate(
          item.screen == 'ScreenClass' ? 'ScreenA' : 'ScreenD',
          {bookData: item.itemData},
        )
     }
      }>
      <View style={styles.card}>
        <FastImage
          source={{uri: item.image}}
          style={styles.cardImage}
          resizeMode={FastImage.resizeMode.cover}
        />
        <View style={styles.cardBody}>
          <View style={styles.titleAndDesbody}>
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.cardDescription}>{item.description}</Text>
          </View>
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={styles.updateButton}
              onPress={() =>
                navigation.navigate('cardAndCarousel', {
                  item: item,
                  modelName: 'carousel',
                })
              }>
              <Text style={styles.buttonText}>Update</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={handleDelete}>
              <Text style={styles.buttonText}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
});

const GetAllCarousel = ({navigation}) => {
  const [cards, setCards] = useState([]);
  const {books: cardBooks} = useBooks('carousel');

  useEffect(() => {
    if (cardBooks && cardBooks.length > 0) {
      setCards(cardBooks);
    }
  }, [cardBooks]);

  const evenCards = [...cards];

  evenCards.push({id: 'add-new-button', isAddButton: true});

  const renderCard = useCallback(
    ({item}) =>
      item.isPlaceholder ? (
        <View
          style={[styles.card, {backgroundColor: 'transparent', elevation: 0}]}
        />
      ) : item.isAddButton ? (
        <TouchableOpacity
          style={styles.addCard}
          onPress={() =>
            navigation.navigate('cardAndCarousel', {
              modelName: 'carousel',
              cards: cards,
              setCards: setCards,
            })
          }>
          <Text style={styles.addCardText}>+ Add New Item</Text>
        </TouchableOpacity>
      ) : (
        <CardItem item={item} navigation={navigation} setCards={setCards} />
      ),
    [navigation],
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={evenCards}
        renderItem={renderCard}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

export default GetAllCarousel;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FB',
    margin: 4,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingBottom: 30,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    marginBottom: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
    padding: 10,
  },
  cardImage: {
    width: 100,
    height: 120,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginVertical: 20,
    marginLeft: 10,
  },
  cardBody: {
    padding: 16,
    margin: 4,
  },
  titleAndDesbody: {
    width: '80%',
    margingHorizontal: 20,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 6,
  },
  cardDescription: {
    fontSize: 14,
    color: '#7f8c8d',
    lineHeight: 20,
    marginBottom: 12,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
  },
  updateButton: {
    backgroundColor: '#27ae60',
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderRadius: 10,
    flex: 1,
    marginRight: 8,
  },
  deleteButton: {
    backgroundColor: '#c0392b',
    paddingVertical: 4,
    paddingHorizontal: 4,
    borderRadius: 10,
    flex: 1,
    marginLeft: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    textAlign: 'center',
    fontSize: 16,
    letterSpacing: 0.5,
  },

  // Add New Card Button
  addCard: {
    marginVertical: 18,
    marginBottom: 30,
    backgroundColor: '#2980b9',
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    minHeight: 60,
  },
  addCardText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
});
