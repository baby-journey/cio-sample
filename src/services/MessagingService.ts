import messaging from '@react-native-firebase/messaging';
import {Platform, PermissionsAndroid} from 'react-native';
import {registerDeviceToken} from './CustomerIOService';

export const requestUserPermission = async () => {
  if (Platform.OS === 'ios') {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    return enabled;
  } else if (Platform.OS === 'android') {
    if (Platform.Version >= 33) {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true;
  }
  return false;
};

export const getFCMToken = async () => {
  try {
    const fcmToken = await messaging().getToken();
    if (fcmToken) {
      console.log('FCM Token:', fcmToken);
      // Register the token with Customer.io
      await registerDeviceToken(fcmToken);
      return fcmToken;
    }
  } catch (error) {
    console.error('Error getting FCM token:', error);
    return null;
  }
};

export const setupMessaging = async () => {
  const hasPermission = await requestUserPermission();
  if (!hasPermission) {
    console.log('User has not granted push notification permissions');
    return;
  }

  // Get the token and register it with Customer.io
  await getFCMToken();

  // Handle token refresh
  messaging().onTokenRefresh(async token => {
    console.log('FCM Token refreshed:', token);
    await registerDeviceToken(token);
  });

  // Handle background messages
  messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('Background message:', remoteMessage);
  });

  // Handle quit state messages
  messaging()
    .getInitialNotification()
    .then(remoteMessage => {
      if (remoteMessage) {
        console.log('Quit state message:', remoteMessage);
      }
    });

  // Handle foreground messages
  messaging().onMessage(async remoteMessage => {
    console.log('Foreground message:', remoteMessage);
  });
};
