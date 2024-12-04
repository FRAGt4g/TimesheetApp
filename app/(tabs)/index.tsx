import HView from '@/components/HView';
import React, { useState } from 'react';
import { Button } from 'react-native';
import {
  FlatList,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Gatherer, DataShape } from "../../Data Gatherers/_layout"
import GetEmail from "../../Data Gatherers/GetEmail"
import GetIcloud from "../../Data Gatherers/GetIcloud"
import { Header } from 'react-native/Libraries/NewAppScreen';

const gatherOptions: Gatherer[] = [
  GetEmail,
  GetIcloud
];

const GatherButton = ({ item, onPress }: { item: Gatherer; onPress: (result: DataShape) => void }) => {
  const { title, gatherFunc } = item;
  return (
    <TouchableOpacity
      style={styles.item}
      onPress={() => {
        const result = gatherFunc();
        onPress(result);
      }}
    >
      <Text>{title}</Text>
    </TouchableOpacity>
  );
};

export default function TabOneScreen() {
  const [results, setResults] = useState<DataShape[]>([]);

  const handlePress = (result: DataShape) => {
    setResults((prevResults) => [...prevResults, result]);
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={gatherOptions}
        keyExtractor={(item) => item.title}
        renderItem={({ item }) => (
          <GatherButton item={item} onPress={handlePress} />
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
      <View style={styles.resultsContainer}>
        <HView style={{
          justifyContent: "space-between"
        }}>
          <Text style={styles.resultsHeader}>Results:</Text>
          <TouchableOpacity onPress={() => setResults([])}>
            <Text style={{ fontSize: 24 }}>🗑️</Text>
          </TouchableOpacity>
        </HView>
        {results.map((result, index) => (
          <View key={index}>
            <Text style={styles.resultText}>
              {result.gatherType}
            </Text>
            {Object.entries(result.information).map(([key, value]) => (
              <Text>
                {JSON.stringify(key)}: {JSON.stringify(value)}
              </Text>
            ))}
          </View>
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
    fontWeight: "bold",
    textTransform: "capitalize",
    marginTop: 10
  },
});