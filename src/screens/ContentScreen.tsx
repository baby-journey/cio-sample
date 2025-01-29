import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

function ContentScreen() {
  return (
    <View style={styles.container}>
      <Text>Content Screen</Text>
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
});

export default ContentScreen;
