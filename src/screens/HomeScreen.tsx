import {CustomerIO} from 'customerio-reactnative';
import React, {useCallback, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
  Keyboard,
} from 'react-native';
import {useMessaging} from '../contexts/MessagingContext';

function HomeScreen() {
  const [cioId, setCioId] = useState<string>('');
  const {fcmToken, permissionStatus, requestPermission} = useMessaging();

  const identifyUser = useCallback(() => {
    try {
      // Assuming CustomerIO is imported and initialized
      CustomerIO.identify({userId: cioId});
      Keyboard.dismiss();
      Alert.alert('User Identified', `User with ID ${cioId} identified`);
    } catch (error) {
      console.error('Error identifying user', error);
    }
  }, [cioId]);

  const handleRequestPermission = useCallback(async () => {
    try {
      const granted = await requestPermission();
      if (granted) {
        Alert.alert('Success', 'Push notification permission granted!');
      } else {
        Alert.alert('Error', 'Push notification permission denied.');
      }
    } catch (error) {
      console.error('Error requesting permission:', error);
      Alert.alert('Error', 'Failed to request push notification permission.');
    }
  }, [requestPermission]);

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Customer.io Integration</Text>
        <TextInput
          style={styles.input}
          onChangeText={setCioId}
          placeholder="Enter ID"
        />
        <Pressable onPress={identifyUser} style={styles.button}>
          <Text style={styles.buttonText}>Identify</Text>
        </Pressable>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Push Notifications</Text>
        <Text style={styles.label}>
          Permission Status: {permissionStatus ? 'Granted' : 'Not Granted'}
        </Text>
        {fcmToken && (
          <Text style={styles.label} numberOfLines={2}>
            FCM Token: {fcmToken.substring(0, 20)}...
          </Text>
        )}
        {!permissionStatus && (
          <Pressable onPress={handleRequestPermission} style={styles.button}>
            <Text style={styles.buttonText}>Request Permission</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f0f0f0',
  },
  section: {
    marginBottom: 24,
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  input: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 10,
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  label: {
    fontSize: 14,
    marginBottom: 12,
    color: '#666',
  },
});

export default HomeScreen;
