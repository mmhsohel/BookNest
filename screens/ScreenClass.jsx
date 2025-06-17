import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import useBooks from '../services/api';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

// Create top tab navigator
const Tab = createMaterialTopTabNavigator();

// Top Tab One (Bangla Version)
const TabOne = ({ navigation, route }) => {
  const { bookData } = route.params;
  const { books } = useBooks(bookData);

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
};

// Top Tab Two (English Version)
const TabTwo = ({ navigation, route }) => {
  const { bookData } = route.params;
  const { books } = useBooks(bookData);

  const classes = [...new Set((books || []).map(b => b.envClass))];
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
};

// Screen that wraps the Top Tabs
const ScreenClass = ({ route }) => {
  const { bookData } = route.params;

  return (
   <Tab.Navigator
  screenOptions={{
    tabBarStyle: {
      backgroundColor:'#1a535c', // light, neutral background
      borderBottomWidth: 1,
      borderBottomColor:'rgb(236, 239, 247)', // subtle bottom border
      elevation: 0, // no Android shadow
    },
    tabBarLabelStyle: {
      fontSize: 20,
      fontWeight: '900',
      textTransform: 'capitalize',
    },
    tabBarActiveTintColor: 'white', // dark gray/black
    tabBarInactiveTintColor: '#9CA3AF', // muted gray
    tabBarIndicatorStyle: {
      backgroundColor:'#10ac84', // dark indicator
      height: 6,
      width: 100,
      borderRadius: 2,
      marginHorizontal: 49, // make indicator narrower
    },
  }}
>
  <Tab.Screen
    name="Bangla"
    component={TabOne}
    initialParams={{ bookData }}
  />
  <Tab.Screen
    name="English"
    component={TabTwo}
    initialParams={{ bookData }}
  />
</Tab.Navigator>

  );
};


//'#ff6b6b', '#4ecdc4', '#ffe66d',
// '#1a535c', '#5f27cd', '#ff9f43',
// '#10ac84', '#341f97'
//#028C8C, #23B1B1, #2F60C0, #00A080, #984E8C, #F36E5C, #FFDD4A, #ACE3F6, #F9A78C, #FFFFFF, #333333, #666666


export default ScreenClass;

// ✅ Styles
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
    fontSize: 35,
    fontWeight: '900',
    textAlign: 'center',
    textTransform: 'capitalize',
  },
});
