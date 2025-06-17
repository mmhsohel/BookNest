import {
  StyleSheet,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {useDispatch, useSelector} from 'react-redux';
import {restoreUser, logoutUser} from './redux/slices/authSlice';

import DrawerContent from './DrawerContent';
import AdminDrawerContent from './AdminDrawerContent';
import AdminDashboard from './screens/AdminDashboard';
import AllTab from './screens/AllTab';
import AuthStack from './screens/AuthStack';
import AllStack from './screens/AllStack';
import AdminStackScreen from './screens/AdminStackScreen';

const Drawer = createDrawerNavigator();

const App = () => {
  const dispatch = useDispatch();
  const {user, loading} = useSelector(s => s.auth);


  useEffect(() => {
    dispatch(restoreUser());
  }, []);

  if (loading) return null;

  return (
    <NavigationContainer>
      {user?.role === 'user' || user?.role === 'admin' ? (
        <Drawer.Navigator
          screenOptions={{headerShown: false}}
          drawerContent={props => user?.role === "admin" ? (
             <AdminDrawerContent {...props} /> 
          ) : ( <DrawerContent {...props} /> ) }>
          {
            user?.role == 'admin'? (
            <Drawer.Screen 
            name="Admin"
            component={AdminStackScreen}
            />
          ) : ( <Drawer.Screen
            name="Main"
            component={AllTab}
            />)
          }
          {/* You can add other Drawer.Screens here if needed */}
        </Drawer.Navigator>
      ) : (
        <AuthStack />
      )}
    </NavigationContainer>
  );
};

export default App;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    height: 100,
    backgroundColor: '#00b377', //'#1abc9c',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    position: 'relative',
  },
  headerCenter: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    top: 20,
    justifyContent: 'center',
    alignItems: 'center',
    pointerEvents: 'none',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
  },
  avatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    marginTop: 20,
  },
  usernameText: {
    color: '#fff',
    marginTop: 20,
    marginRight: 10,
    fontWeight: '700',
    fontSize: 20,
  },

  modalContainer: {
    flex: 1,
    backgroundColor: '#00000099',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    width: '85%',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 20,
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    width: '100%',
    marginBottom: 15,
    padding: 10,
    borderRadius: 5,
  },
});
