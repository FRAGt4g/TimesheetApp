import { StyleSheet } from 'react-native';

import EditScreenInfo from '@/components/EditScreenInfo';
import { Text, View } from '@/components/Themed';
import { Button, ScrollView } from 'react-native';
import * as Contacts from "expo-contacts"

export default function TabThreeScreen() {
  const dummyData = [
    "testing",
    "another",
    "third",
    "why not",
    "more stuff",
    "another",
    "this again...",
    "for good measure",
    "why the hell not"
  ]
  return (
    <ScrollView>
      { dummyData.map((item) => {
        return (<Text style={styles.title}>
          {item}
        </Text>)
      }) }
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    padding: 20,
    borderRadius: 20,
    margin: 20,
    backgroundColor: "#ffaaaa"
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
