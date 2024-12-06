import HView from '@/components/HView';
import Gmail_Auth from '@/components/Gmail_Auth';
import React, { useState } from 'react';
import {
  FlatList,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Gatherer, DataShape } from "../../Data Gatherers/_layout"
import { SymbolView } from "expo-symbols"

import GetEmail from "../../Data Gatherers/Fake/GetEmail"
import GetIcloud from "../../Data Gatherers/Fake/GetIcloud"
import GetOutlook from "../../Data Gatherers/Fake/GetOutlook"
import GetGithub from "../../Data Gatherers/Fake/GetGithub"
import Spacer from '@/components/Spacer';

const gatherOptions = [
  GetEmail,
  GetIcloud,
  GetOutlook,
  GetGithub
]

const GatherButton = ({ item, onPress }: { item: Gatherer; onPress: (result: DataShape) => void }) => {
  const { id, title, gatherFunc } = item;
  const [loading, setLoading] = useState(false)
  
  const handleFetchData = async () => {
    if (loading) { return }
    setLoading(true)
    const data = await gatherFunc()
    setLoading(false)
    onPress(data);
  }

  return (
    <TouchableOpacity
      style={styles.item}
      onPress={ handleFetchData }
    >
      <Text style={{ lineHeight: 20 }} >{title}</Text>
      <Spacer />
      {loading && 
        <SymbolView 
          name='hourglass' 
          tintColor="black"
          size={20}
        />
      }
    </TouchableOpacity>
  );
};

export default function TabOneScreen() {
  const [results, setResults] = useState<DataShape[]>([]);
  const handlePress = (result: DataShape) => {
    setResults((prevResults) => [result, ...prevResults]);
  };
  const padding = results.length > 0 ? 10 : 0

  return (
    <View style={styles.container}>
      <FlatList
        data={gatherOptions}
        keyExtractor={(item) => item.id}
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
        <FlatList
          data={results}
          style={{paddingTop: padding}}
          keyExtractor={(item) => JSON.stringify(item.information)}
          renderItem={({ item }) => (
            <View style={{marginVertical: 5}}>
              <Text style={[styles.resultText, item.error != null ? { color: "red"} : null]}>
                {item.gatherType}
              </Text>
              {Object.entries(item.information).map(([key, value]) => (
                <Text key={key}>
                  {JSON.stringify(key)}: {JSON.stringify(value)}
                </Text>
              ))}
            </View>
          )}
          ItemSeparatorComponent={() => <View style={[styles.separator, { backgroundColor: "black"}]} />}
        />
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
    flexDirection: "row"
  },
  separator: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 5,
  },
  resultsContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    maxHeight: 250, // Allow room for the scrollable content
    padding: 15,
    borderRadius: 10,
    zIndex: 1,
    backgroundColor: "#ddd",
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
  },
});