import React, {useState, useEffect} from 'react';
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
  const version = 'bangla';
  const { books } = useBooks(bookData);



  const [itemClass, setItemClass] = useState([]);

  useEffect(() => {
    const classes = [...new Set((books || []).map(b => b.envClass))];
    setItemClass(classes);
  }, [books]);

  const dataWithAddButton = [...itemClass, 'ADD_BUTTON'];


const handleDelete = (item) => {
 
  Alert.alert(
    'Delete Class',
    `Are you sure you want to delete "${item}"?`,
    [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            // Backend DELETE request (update the URL based on your API)
            await deleteClass(bookData, item)

            // Remove from local state
            setItemClass(prev => prev.filter(c => c !== item));

            Alert.alert('Success', 'Class deleted successfully.');
          } catch (error) {
            console.error('Delete failed:', error);
            Alert.alert('Error', 'Failed to delete class. Please try again.');
          }
        },
      },
    ]
  );
};

  return (
    <View style={styles.container}>
      <FlatList
        data={dataWithAddButton}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => {
          if (item === 'ADD_BUTTON') {
            return (
              <TouchableOpacity
                onPress={() => navigation.navigate("ScreenB", {
                  bookData,
                  version,
                  itemClass,
                  setItemClass,
                })}
                style={[styles.card, styles.addCard]}
                activeOpacity={0.85}
              >
                <Text style={styles.addText}>＋ Add Class</Text>
              </TouchableOpacity>
            );
          }

          return (
            <View style={styles.card}>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('ScreenE', {
                    class: item,
                    books,
                    bookData,
                    version,
                    itemClass,
                    setItemClass,
                  })
                }
                activeOpacity={0.9}
              >
                <Text style={styles.classText}>{item}</Text>
              </TouchableOpacity>

              <View style={styles.buttonRow}>
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate("ScreenB", {
                       item,
                      books,
                      bookData,
                      version,
                      itemClass,
                      setItemClass,
                      isEdit: true,
                    })
                  }
                  style={[styles.actionBtn, styles.editBtn]}
                >
                  <Text style={styles.actionText}>Edit</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => handleDelete(item)}
                  style={[styles.actionBtn, styles.deleteBtn]}
                >
                  <Text style={styles.actionText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        }}
      />
    </View>
  );
};

// Top Tab Two (English Version)
const TabTwo = ({ navigation, route }) => {
   const { bookData } = route.params;
  const version = 'english';
  const { books } = useBooks(bookData);


  const [itemClass, setItemClass] = useState([]);

  useEffect(() => {
    const classes = [...new Set((books || []).map(b => b.envClass))];
    setItemClass(classes);
  }, [books]);

  const dataWithAddButton = [...itemClass, 'ADD_BUTTON'];


const handleDelete = (item) => {
 
  Alert.alert(
    'Delete Class',
    `Are you sure you want to delete "${item}"?`,
    [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            // Backend DELETE request (update the URL based on your API)
            await deleteClass(bookData, item)

            // Remove from local state
            setItemClass(prev => prev.filter(c => c !== item));

            Alert.alert('Success', 'Class deleted successfully.');
          } catch (error) {
            console.error('Delete failed:', error);
            Alert.alert('Error', 'Failed to delete class. Please try again.');
          }
        },
      },
    ]
  );
};

  return (
    <View style={styles.container}>
      <FlatList
        data={dataWithAddButton}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => {
          if (item === 'ADD_BUTTON') {
            return (
              <TouchableOpacity
                onPress={() => navigation.navigate("ScreenB", {
                  bookData,
                  version,
                  itemClass,
                  setItemClass,
                })}
                style={[styles.card, styles.addCard]}
                activeOpacity={0.85}
              >
                <Text style={styles.addText}>＋ Add Class</Text>
              </TouchableOpacity>
            );
          }

          return (
            <View style={styles.card}>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('ScreenE', {
                    class: item,
                    books,
                    bookData,
                    version,
                    itemClass,
                    setItemClass,
                  })
                }
                activeOpacity={0.9}
              >
                <Text style={styles.classText}>{item}</Text>
              </TouchableOpacity>

              <View style={styles.buttonRow}>
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate("ScreenB", {
                       item,
                      books,
                      bookData,
                      version,
                      itemClass,
                      setItemClass,
                      isEdit: true,
                    })
                  }
                  style={[styles.actionBtn, styles.editBtn]}
                >
                  <Text style={styles.actionText}>Edit</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => handleDelete(item)}
                  style={[styles.actionBtn, styles.deleteBtn]}
                >
                  <Text style={styles.actionText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        }}
      />
    </View>
  );
};

// Screen that wraps the Top Tabs
const ScreenA = ({ route }) => {
  const { bookData } = route.params;

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: { backgroundColor: '#6200ee' },
        tabBarLabelStyle: { color: '#fff', fontWeight: 'bold' },
        tabBarIndicatorStyle: { backgroundColor: '#fff' },
      }}
    >
      <Tab.Screen
        name="Bangla Version"
        component={TabOne}
        initialParams={{ bookData }}
      />
      <Tab.Screen
        name="English Version"
        component={TabTwo}
        initialParams={{ bookData }}
      />
    </Tab.Navigator>
  );
};

export default ScreenA;

// ✅ Styles

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:"#F4F6F8", // Softer light gray background
  },
  listContent: {
    paddingVertical: 24,
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: '#E5EAF1',
    borderRadius: 16,
    paddingVertical: 20,
    paddingHorizontal: 14,
    marginBottom: 38,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
    borderWidth: 2.5,
    borderColor: '#E0E3E7', // Very light subtle border
  },
  classText: {
    fontSize: 24,
    fontWeight: '900',
    color:'rgb(38, 73, 148)', // Almost black for strong legibility
    textAlign: 'center',
    textTransform: 'capitalize',
  },
  addCard: {
    borderStyle: 'dashed',
    borderWidth: 2,
    borderColor: '#D1D5DB', // Soft border
    backgroundColor: '#E5EAF1', // Light blue-gray background
    borderRadius: 16,
    paddingVertical: 22,
    paddingHorizontal: 24,
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addText: {
    fontSize: 18,
    color: '#4B5563', // Muted slate text
    textAlign: 'center',
    fontWeight: '500',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    gap: 90,
  },
  actionBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
editBtn: {
  backgroundColor: '#2563EB', // Blue-600
  paddingVertical: 6,
  paddingHorizontal: 12,
  borderRadius: 6,
  alignItems: 'center',
  justifyContent: 'center',
  minWidth: 10,
},

deleteBtn: {
  backgroundColor: '#DC2626', // Red-600
  paddingVertical: 0,
  paddingHorizontal: 0,
  borderRadius: 6,
  alignItems: 'center',
  justifyContent: 'center',
  minWidth: 10,
},

  actionText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});



