import React, {
  createContext,
  useContext,
  useCallback,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import messaging from '@react-native-firebase/messaging';
import {Platform, PermissionsAndroid} from 'react-native';

interface MessagingContextType {
  fcmToken: string | null;
  permissionStatus: boolean;
  requestPermission: () => Promise<boolean>;
  refreshToken: () => Promise<string | null>;
}

const MessagingContext = createContext<MessagingContextType | undefined>(
  undefined,
);

export const MessagingProvider = ({children}: {children: ReactNode}) => {
  const [fcmToken, setFcmToken] = useState<string | null>(null);
  const [permissionStatus, setPermissionStatus] = useState<boolean>(false);

  const requestPermission = useCallback(async () => {
    try {
      if (Platform.OS === 'ios') {
        const authStatus = await messaging().requestPermission();
        const enabled =
          authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
          authStatus === messaging.AuthorizationStatus.PROVISIONAL;

        setPermissionStatus(enabled);
        return enabled;
      } else if (Platform.OS === 'android') {
        if (Platform.Version >= 33) {
          const permission = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
          );
          const enabled = permission === 'granted';
          setPermissionStatus(enabled);
          return enabled;
        }
        setPermissionStatus(true);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error requesting permission:', error);
      return false;
    }
  }, []);

  const refreshToken = useCallback(async () => {
    try {
      const token = await messaging().getToken();
      setFcmToken(token);
      return token;
    } catch (error) {
      console.error('Error refreshing FCM token:', error);
      return null;
    }
  }, []);

  const setupMessageHandlers = useCallback(() => {
    // Foreground message handler
    const unsubscribeOnMessage = messaging().onMessage(async remoteMessage => {
      console.log('Received foreground message:', remoteMessage);
      // Handle your foreground message here
    });

    // Background message handler
    messaging().setBackgroundMessageHandler(async remoteMessage => {
      console.log('Received background message:', remoteMessage);
      // Handle your background message here
    });

    // Notification opened app from background state
    const unsubscribeOnNotificationOpenedApp =
      messaging().onNotificationOpenedApp(remoteMessage => {
        console.log(
          'Notification opened app from background state:',
          remoteMessage,
        );
        // Handle your notification opened from background state here
      });

    // Notification opened app from quit state
    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          console.log(
            'Notification opened app from quit state:',
            remoteMessage,
          );
          // Handle your notification opened from quit state here
        }
      });

    // Token refresh handler
    const unsubscribeTokenRefresh = messaging().onTokenRefresh(token => {
      setFcmToken(token);
    });

    // Cleanup subscriptions
    return () => {
      unsubscribeOnMessage();
      unsubscribeOnNotificationOpenedApp();
      unsubscribeTokenRefresh();
    };
  }, []);

  useEffect(() => {
    const initializeMessaging = async () => {
      const hasPermission = await requestPermission();
      if (hasPermission) {
        await refreshToken();
      }
    };

    initializeMessaging();
    const cleanup = setupMessageHandlers();

    return () => {
      cleanup();
    };
  }, [requestPermission, refreshToken, setupMessageHandlers]);

  const value = {
    fcmToken,
    permissionStatus,
    requestPermission,
    refreshToken,
  };

  return (
    <MessagingContext.Provider value={value}>
      {children}
    </MessagingContext.Provider>
  );
};

export const useMessaging = () => {
  const context = useContext(MessagingContext);
  if (context === undefined) {
    throw new Error('useMessaging must be used within a MessagingProvider');
  }
  return context;
};
