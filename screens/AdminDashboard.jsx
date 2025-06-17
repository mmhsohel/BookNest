import React, { useCallback, useState, memo, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  useWindowDimensions,
} from "react-native";
import Carousel from "react-native-reanimated-carousel";
import FastImage from "react-native-fast-image";
import useBooks from "../services/api";


// Add placeholder if card count is odd


const CardItem = memo(({ item, navigation }) => (
  <TouchableOpacity
    style={styles.card}
    onPress={() => navigation.navigate(item.screen == 'ScreenClass' ? 'ScreenA' : 'ScreenD', {bookData: item.itemData})}
  >
    <FastImage
      source={{ uri: item.image }}
      style={styles.cardImage}
      cacheKey={`card-${item.id}`}
    />
    <Text style={styles.cardTitle}>{item.title}</Text>
    <Text style={styles.cardDescription}>{item.description}</Text>
  </TouchableOpacity>
));

const AdminDashboard = ({ navigation }) => {
  const [carouselImages, setCarouselImages] = useState([]);
const [cards, setCards] = useState([]);
const { books: cardBooks } = useBooks('card');       // If 'card' data exists on your backend
const { books: carouselBooks } = useBooks('carousel');  // If 'carousel' data exists on your backend

useEffect(() => {
  if (cardBooks && cardBooks.length > 0) {

    setCards(cardBooks);
  }
}, [cardBooks]);

useEffect(() => {
  if (carouselBooks && carouselBooks.length > 0) {
 
    setCarouselImages(carouselBooks);
  }
}, [carouselBooks]);



  const [activeSlide, setActiveSlide] = useState(0);
  const { width } = useWindowDimensions();
  const IMAGE_HEIGHT = Math.round(width * 0.5);

  const evenCards = [...cards];
if (evenCards.length % 2 !== 0) {
  evenCards.push({ id: "placeholder", isPlaceholder: true });
}

  const renderCard = useCallback(
    ({ item }) =>
      item.isPlaceholder ? (
        <View style={[styles.card, { backgroundColor: "transparent", elevation: 0 }]} />
      ) : (
        <CardItem item={item} navigation={navigation} />
      ),
    [navigation]
  );

  return (
    <View style={styles.container}>
     
      <FlatList
        data={evenCards}
        renderItem={renderCard}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

export default AdminDashboard;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F6F8", // subtle light gray background
  },
  carouselWrapper: {
    alignItems: "center",
    marginTop: 12,
    marginBottom: 4,
  },
  carouselImage: {
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: -12,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#ccc",
    marginHorizontal: 5,
  },
  activeDot: {
    backgroundColor: "#007AFF",
    width: 10,
    height: 10,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 24,
  },

  card: {
    flex: 1,
    margin: 8,
    backgroundColor: "#ffffff", // clean white card
    borderRadius: 16,
    paddingVertical: 20,
    paddingHorizontal: 14,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 180,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#E1E4E8", // light subtle border
  },

  cardImage: {
    width: 74,
    height: 74,
    borderRadius: 14,
    marginBottom: 14,
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2D3436", // modern dark gray
    textAlign: "center",
    marginBottom: 6,
    letterSpacing: 0.3,
  },
  cardDescription: {
    fontSize: 13,
    fontWeight: "400",
    color: "#636e72", // soft gray text
    textAlign: "center",
    lineHeight: 18,
  },
});

