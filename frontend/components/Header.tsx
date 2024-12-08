import React from 'react';
import { Text, StyleSheet } from 'react-native';

const Header = ({ children, style }: { children: React.ReactNode; style?: object }) => {
  return <Text style={[styles.header, style]}>{children}</Text>;
};

const styles = StyleSheet.create({
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
  },
});

export default Header;