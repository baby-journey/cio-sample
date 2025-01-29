import React, {useCallback, useEffect, useState} from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  useColorScheme,
  View,
  Pressable,
  Alert,
  Keyboard,
} from 'react-native';
import * as Sentry from '@sentry/react-native';

import {Colors} from 'react-native/Libraries/NewAppScreen';
import {
  CioConfig,
  CioLogLevel,
  CioRegion,
  CustomerIO,
  InAppMessageEventType,
  PushClickBehaviorAndroid,
} from 'customerio-reactnative';

Sentry.init({
  dsn: 'https://cea4d6215dc543f591933ceb2261f87b@o520608.ingest.sentry.io/5631203', // Add your DSN here
  environment: 'staging', // Sentry environment
  integrations: [
    Sentry.mobileReplayIntegration({
      maskAllText: true, // Masks all textual inputs to prevent PII exposure
      maskAllImages: true, // Masks images to avoid visual PII
      maskAllVectors: false, // Optional, based on sensitivity
    }), // Adding this for session replay integration
  ],
  appHangTimeoutInterval: 1,
  //when we remove the following object the issue went away.
  _experiments: {
    replaysSessionSampleRate: 1.0, // Capture 10% of sessions in production
    replaysOnErrorSampleRate: 1.0, // Always capture replays when an error occurs
    // profilesSampleRate is relative to tracesSampleRate.
    // Here, we'll capture profiles for 30% of transactions.
    profilesSampleRate: 0.3,
  },
});

const CUSTOMERIO_SITEID = ''; // Add your Customer.io site ID here
const CUSTOMERIO_APIKEY = ''; // Add your Customer.io API key here
const CUSTOMERIO_CDPKEY = ''; // Add your Customer.io API key here

function App(): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const [cioId, setCioId] = useState<string>('');
  const [timeToAlive, setTimeToAlive] = useState<Date | null>(null);

  useEffect(() => {
    try {
      const config: CioConfig = {
        cdpApiKey: CUSTOMERIO_CDPKEY,
        // Optional: Set other configuration options
        migrationSiteId: CUSTOMERIO_SITEID,
        inApp: {
          siteId: CUSTOMERIO_SITEID,
        },
        logLevel: CioLogLevel.Debug,
        trackApplicationLifecycleEvents: true,
        autoTrackDeviceAttributes: true,
        // autoTrackPushEvents: true,
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

  useEffect(() => {
    CustomerIO.inAppMessaging.registerEventsListener(event => {
      if (event.eventType === InAppMessageEventType.messageDismissed) {
        setTimeToAlive(new Date());
      }
    });
  }, []);

  const identifyUser = useCallback(() => {
    try {
      CustomerIO.identify({
        userId: cioId,
      });
      Keyboard.dismiss();
      Alert.alert('User Identified', `User with ID ${cioId} identified`);
    } catch (error) {
      console.error('Error identifying user', error);
    }
  }, [cioId]);

  const onFocus = useCallback(() => {
    if (timeToAlive) {
      setTimeToAlive(null);
      Alert.alert(
        `took ${
          new Date().getTime() - timeToAlive.getTime()
        } ms to responsive after in-app message dismissed`,
      );
    }
  }, [timeToAlive]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={Colors.lighter}
      />
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          onFocus={onFocus}
          onChangeText={setCioId}
          placeholder="Enter ID"
        />
        <Pressable onPress={identifyUser} style={styles.button}>
          <Text style={styles.buttonText}>Identify</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: Colors.lighter,
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 10,
    marginBottom: 10,
    width: '80%',
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
  },
});

export default App;
