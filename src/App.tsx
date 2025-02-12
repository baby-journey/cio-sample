import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import messaging from '@react-native-firebase/messaging';
import * as Sentry from '@sentry/react-native';
import {
  CioLogLevel,
  CustomerIO,
  CustomerioConfig,
  CustomerIOEnv,
  Region,
} from 'customerio-reactnative';

import HomeScreen from './screens/HomeScreen';
import ContentScreen from './screens/ContentScreen';
import ProfileScreen from './screens/ProfileScreen';

Sentry.init({
  dsn: 'https://cea4d6215dc543f591933ceb2261f87b@o520608.ingest.sentry.io/5631203',
  environment: 'staging',
  integrations: [
    Sentry.functionToStringIntegration(), // This integration allows the SDK to provide original functions   method names, even when those functions or methods are wrapped by our error or breadcrumb handlers.
    Sentry.dedupeIntegration(), // This integration is enabled by default, but only deduplicates certain events. It can be helpful if you're receiving many duplicate errors. Note, that Sentry only compares stack traces and fingerprints.
    Sentry.reactNativeTracingIntegration(), // This integration allows the SDK to automatically capture performance data for React Native applications.
    Sentry.mobileReplayIntegration({
      maskAllText: true, // Masks all textual inputs to prevent PII exposure
      maskAllImages: true, // Masks images to avoid visual PII
      maskAllVectors: false, // Optional, based on sensitivity
    }), // Adding this for session replay integration
  ],
  tracesSampleRate: 1.0,
  appHangTimeoutInterval: 2,
  enableAppStartTracking: true,
  enableNativeFramesTracking: true,
  enableStallTracking: true,
  enableUserInteractionTracing: true,
  _experiments: {
    replaysSessionSampleRate: 1.0, // Capture 10% of sessions in production
    replaysOnErrorSampleRate: 1.0, // Always capture replays when an error occurs
    // profilesSampleRate is relative to tracesSampleRate.
    // Here, we'll capture profiles for 30% of transactions.
    profilesSampleRate: 0.3,
  },
});

const CUSTOMERIO_SITEID = '';
const CUSTOMERIO_APIKEY = '';

const linking = {
  prefixes: ['staging.babyjourney.se://', 'https://staging.babyjourney.se/'],
  config: {
    screens: {
      Home: 'screen/home',
      Content: 'screen/content',
      Profile: 'screen/profile',
    },
  },
};

function App(): JSX.Element {
  useEffect(() => {
    // Request user permission for notifications
    const requestUserPermission = async () => {
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (enabled) {
        console.log('Authorization status:', authStatus);
      }
    };

    requestUserPermission();

    // Handle foreground messages
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log('A new FCM message arrived!', JSON.stringify(remoteMessage));
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    try {
      const config = new CustomerioConfig();
      config.logLevel = CioLogLevel.debug;
      config.autoTrackDeviceAttributes = true;
      config.autoTrackPushEvents = true;
      config.enableInApp = true;

      const env = new CustomerIOEnv();
      env.siteId = CUSTOMERIO_SITEID;
      env.apiKey = CUSTOMERIO_APIKEY;
      env.region = Region.EU;
      CustomerIO.initialize(env, config);
    } catch (error) {
      console.error('Error initializing Customer.io', error);
    }
  }, []);

  const Tab = createBottomTabNavigator();

  return (
    <NavigationContainer linking={linking}>
      <Tab.Navigator>
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Content" component={ContentScreen} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

export default App;
