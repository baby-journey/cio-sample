import {CustomerIO} from 'customerio-reactnative';
import {Platform} from 'react-native';

interface PushMessage {
  link?: string;
  title?: string;
  body?: string;
  [key: string]: any;
}

export const registerDeviceToken = async (token: string) => {
  try {
    await CustomerIO.registerDeviceToken(token);
    console.log('Device token registered with Customer.io successfully');
  } catch (error) {
    console.error('Error registering device token with Customer.io:', error);
  }
};

export const deleteDeviceToken = async () => {
  try {
    await CustomerIO.deleteDeviceToken();
    console.log('Device token deleted from Customer.io successfully');
  } catch (error) {
    console.error('Error deleting device token from Customer.io:', error);
  }
};

export const trackEvent = async (
  name: string,
  properties?: Record<string, any>,
) => {
  try {
    await CustomerIO.track(name, properties);
    console.log('Event tracked successfully:', name);
  } catch (error) {
    console.error('Error tracking event:', error);
  }
};

export const configureNotificationHandling = () => {
  if (Platform.OS === 'ios') {
    // Configure iOS foreground presentation options
    (CustomerIO as any).configureNotificationPresentationOptions({
      alert: true,
      badge: true,
      sound: true,
    });
  }

  // Handle notification clicks
  (CustomerIO as any).addPushClickCallback((message: PushMessage) => {
    console.log('Push notification clicked:', message);
    // Handle deep linking or navigation here
    if (message.link) {
      // Handle deep link
      console.log('Deep link:', message.link);
    }
  });

  // Handle notification received in foreground
  (CustomerIO as any).addPushNotificationReceivedCallback(
    (message: PushMessage) => {
      console.log('Push notification received:', message);
    },
  );
};
