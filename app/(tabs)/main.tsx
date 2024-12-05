import HView from '@/components/HView';
import Gmail_Auth from '@/components/Gmail_Auth';
import React, { useState } from 'react';
import { Button, FlatList, Text, View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

const data = [
  {
    id: '1',
    title: 'Gather Emails',
    func: () => ({ type: 'emails', status: 'success' }),
  },
  {
    id: '2',
    title: 'Gather Zoom Meetings',
    func: () => ({ type: 'zoom meetings', status: 'success' }),
  },
  {
    id: '3',
    title: 'Gather Slack Messages',
    func: () => ({ type: 'slack messages', status: 'success' }),
  },
];

const ListItem = ({ item, onPress }: { item: { title: string; func: () => object }; onPress: (result: object) => void }) => {
  const { title, func } = item;
  return (
    <TouchableOpacity
      style={styles.item}
      onPress={() => {
        const result = func();
        onPress(result);
      }}
    >
      <Text>{title}</Text>
    </TouchableOpacity>
  );
};

export default function TabOneScreen() {
  const [results, setResults] = useState<object[]>([]);

  const handlePress = (result: object) => {
    setResults((prevResults) => [...prevResults, result]);
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ListItem item={item} onPress={handlePress} />
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
      
      <View style={{
        marginBottom: 100,
        zIndex: 10,
        justifyContent: "space-between"
      }}>
        <Gmail_Auth/>
      </View>
      
      {/* Results Container with BlurView */}
      <View style={styles.resultsContainer}>
        <HView style={{
          marginBottom: 5,
          justifyContent: "space-between"
        }}>
          <Text style={styles.resultsHeader}>Results:</Text>
          <Button title="Clear" onPress={() => setResults([])} />
        </HView>
        {results.map((result, index) => (
          <Text key={index} style={styles.resultText}>
            {JSON.stringify(result)}
          </Text>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f8f8',
  },
  scrollContainer: {
    flexGrow: 1, // Ensures scrolling for the list items
  },
  item: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginVertical: 5,
  },
  separator: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 5,
  },
  resultsContainer: {
    position: 'absolute', // Overlap the list
    bottom: 20, // Stick to the bottom of the screen
    left: 20,
    right: 20,
    padding: 15,
    borderRadius: 10,
    zIndex: 1, // Ensure the results are on top of the list
    backgroundColor: "#ddd"
  },
  resultsHeader: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  resultText: {
    fontSize: 16,
    color: '#333',
  },
});