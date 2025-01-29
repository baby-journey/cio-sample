import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
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
  dsn: '',
  environment: 'staging',
  integrations: [
    Sentry.functionToStringIntegration(), // This integration allows the SDK to provide original functions and method names, even when those functions or methods are wrapped by our error or breadcrumb handlers.
    Sentry.dedupeIntegration(), // This integration is enabled by default, but only deduplicates certain events. It can be helpful if you're receiving many duplicate errors. Note, that Sentry only compares stack traces and fingerprints.
    Sentry.reactNativeTracingIntegration(), // This integration allows the SDK to automatically capture performance data for React Native applications.
  ],
  tracesSampleRate: 1.0,
  appHangTimeoutInterval: 2,
  enableAppStartTracking: true,
  enableNativeFramesTracking: true,
  enableStallTracking: true,
  enableUserInteractionTracing: true,
});

const CUSTOMERIO_SITEID = '';
const CUSTOMERIO_APIKEY = '';

function App(): JSX.Element {
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
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Content" component={ContentScreen} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

export default App;
