import React from 'react';
import { View, StyleSheet } from 'react-native';

const Spacer = () => {
  return <View style={styles.spacer} />;
};

const styles = StyleSheet.create({
  spacer: {
    flex: 1, // This makes the spacer take up remaining space
  },
});

export default Spacer;