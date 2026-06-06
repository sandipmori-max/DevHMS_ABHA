
import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import { AppRegistry } from 'react-native';
 
import notifee, { EventType } from '@notifee/react-native';

import { navigate } from './src/navigation/navigationService';

notifee.onBackgroundEvent(async ({ type, detail }) => {
  const data = detail.notification?.data;

  if (
    type === EventType.PRESS ||
    type === EventType.ACTION_PRESS
  ) {
    console.log('Background Notification Click');

    // App open hone ke baad App.js me
    // getInitialNotification handle karega
  }
});

AppRegistry.registerComponent(appName, () => App);
