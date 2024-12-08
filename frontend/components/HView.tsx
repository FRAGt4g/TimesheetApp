import React from 'react';
import { View, StyleSheet } from 'react-native';

const HView = ({ children, style }: { children: React.ReactNode; style?: object }) => {
  return <View style={[styles.header, style]}>{children}</View>
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: "flex-start"
  },
});

export default HView;