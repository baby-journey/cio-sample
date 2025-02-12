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

function HomeScreen() {
  const [cioId, setCioId] = useState<string>('');

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

  return (
    <View style={styles.container}>
      <Text>Home Screen</Text>
      <TextInput
        style={styles.input}
        onChangeText={setCioId}
        placeholder="Enter ID"
      />
      <Pressable onPress={identifyUser} style={styles.button}>
        <Text style={styles.buttonText}>Identify</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
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

export default HomeScreen;
