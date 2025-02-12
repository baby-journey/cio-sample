import React, {useCallback} from 'react';
import {View, Text, StyleSheet, Pressable, Alert} from 'react-native';
import {useMessaging} from '../contexts/MessagingContext';

function ProfileScreen() {
  const {permissionStatus, requestPermission, fcmToken} = useMessaging();

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
        <Text style={styles.title}>Profile Screen</Text>
        <View style={styles.notificationSection}>
          <Text style={styles.label}>
            Push Notifications: {permissionStatus ? 'Enabled' : 'Disabled'}
          </Text>
          {fcmToken && (
            <Text style={styles.tokenText} numberOfLines={2}>
              Device Token: {fcmToken.substring(0, 20)}...
            </Text>
          )}
          {!permissionStatus && (
            <Pressable onPress={handleRequestPermission} style={styles.button}>
              <Text style={styles.buttonText}>Enable Push Notifications</Text>
            </Pressable>
          )}
        </View>
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  notificationSection: {
    marginTop: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#666',
  },
  tokenText: {
    fontSize: 14,
    color: '#888',
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ProfileScreen;
