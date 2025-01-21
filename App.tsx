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
  CioLogLevel,
  CustomerIO,
  CustomerioConfig,
  CustomerIOEnv,
  InAppMessageEventType,
  Region,
} from 'customerio-reactnative';

Sentry.init({
  dsn: '', // Add your DSN here
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

function App(): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const [cioId, setCioId] = useState<string>('');
  const [timeToAlive, setTimeToAlive] = useState<Date | null>(null);

  useEffect(() => {
    try {
      const data = new CustomerioConfig();
      data.logLevel = CioLogLevel.debug;
      data.autoTrackDeviceAttributes = true;
      data.autoTrackPushEvents = true;
      data.enableInApp = true;

      const env = new CustomerIOEnv();
      env.siteId = CUSTOMERIO_SITEID;
      env.apiKey = CUSTOMERIO_APIKEY;
      env.region = Region.EU;
      CustomerIO.initialize(env, data);
    } catch (error) {
      console.error('Error initializing Customer.io', error);
    }
  }, []);

  useEffect(() => {
    CustomerIO.inAppMessaging().registerEventsListener(event => {
      if (event.eventType === InAppMessageEventType.messageDismissed) {
        setTimeToAlive(new Date());
      }
    });
  }, []);

  const identifyUser = useCallback(() => {
    try {
      CustomerIO.identify(cioId);
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
