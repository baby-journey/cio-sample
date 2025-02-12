import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import messaging from '@react-native-firebase/messaging';
import * as Sentry from '@sentry/react-native';
import {
  CioConfig,
  CioLogLevel,
  CioRegion,
  CustomerIO,
  PushClickBehaviorAndroid,
} from 'customerio-reactnative';
import {MessagingProvider} from './contexts/MessagingContext';

import HomeScreen from './screens/HomeScreen';
import ContentScreen from './screens/ContentScreen';
import ProfileScreen from './screens/ProfileScreen';

Sentry.init({
  dsn: 'https://cea4d6215dc543f591933ceb2261f87b@o520608.ingest.sentry.io/5631203',
  environment: 'staging',
  integrations: [
    Sentry.functionToStringIntegration(),
    Sentry.dedupeIntegration(),
    Sentry.reactNativeTracingIntegration(),
    Sentry.mobileReplayIntegration({
      maskAllText: true,
      maskAllImages: true,
      maskAllVectors: false,
    }),
  ],
  tracesSampleRate: 1.0,
  appHangTimeoutInterval: 2,
  enableAppStartTracking: true,
  enableNativeFramesTracking: true,
  enableStallTracking: true,
  enableUserInteractionTracing: true,
  _experiments: {
    replaysSessionSampleRate: 1.0,
    replaysOnErrorSampleRate: 1.0,
    profilesSampleRate: 0.3,
  },
});

const CUSTOMERIO_SITEID = ''; // Add your Customer.io site ID here
const CUSTOMERIO_APIKEY = ''; // Add your Customer.io API key here
const CUSTOMERIO_CDPKEY = ''; // Add your Customer.io API key here

const Tab = createBottomTabNavigator();

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
    try {
      const config: CioConfig = {
        cdpApiKey: CUSTOMERIO_CDPKEY,
        migrationSiteId: CUSTOMERIO_SITEID,
        inApp: {
          siteId: CUSTOMERIO_SITEID,
        },
        logLevel: CioLogLevel.Debug,
        trackApplicationLifecycleEvents: true,
        autoTrackDeviceAttributes: true,
        region: CioRegion.EU,
        push: {
          android: {
            pushClickBehavior: PushClickBehaviorAndroid.ResetTaskStack,
          },
        },
      };

      CustomerIO.initialize(config);
    } catch (error) {
      console.error('Error initializing Customer.io', error);
    }
  }, []);

  return (
    <MessagingProvider>
      <NavigationContainer linking={linking}>
        <Tab.Navigator>
          <Tab.Screen name="Home" component={HomeScreen} />
          <Tab.Screen name="Content" component={ContentScreen} />
          <Tab.Screen name="Profile" component={ProfileScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    </MessagingProvider>
  );
}

export default App;
