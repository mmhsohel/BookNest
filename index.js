/**
 * @format
 */

/**
 * @format
 */
import React from 'react';
import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import { Provider } from 'react-redux';
import store from './redux/store';
import Toast from 'react-native-toast-message'; // ✅ Import Toast

const RootApp = () => (
  
  <Provider store={store}>
    <>
      <App />
      <Toast />
    </>
  </Provider>
);

AppRegistry.registerComponent(appName, () => RootApp);

