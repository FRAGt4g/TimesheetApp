import React, { useState } from 'react';
import { FlatList, Text, View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Gatherer, DataShape } from '@/app/(tabs)/layouts';
import * as Linking from "expo-linking";
import { SymbolView } from "expo-symbols";
import axios from 'axios';
import Spacer from '@/components/Spacer';
import HView  from '@/components/HView';

const gatherOptions = [
  {
    id: 'gmail',
    title: 'Fetch Gmail Data',
    gatherFunc: async (): Promise<DataShape> => {
      try {
        const authResponse = await axios.get('http://localhost:8000/auth_google');
        
        if (!authResponse || !authResponse.data) {
          throw new Error('help api doesnt work');
        }
        
        await Linking.openURL(authResponse.data)

        return {
          gatherType: "gmail success",
          information: authResponse.data,
        }
      } catch (error) {
        console.error('Error fetching Gmail data:', error);
        return { 
          error: 'Error fetching Gmail data',
          gatherType: 'gmail failure',
          information: {},
        };
      }
    },
  },
  {
    id: 'github',
    title: 'Fetch Github Data',
    gatherFunc: async () => {
      try {
        let username = "FRAGt4g"
        const response = await axios.get(`https://api.github.com/users/${username}`);

        return {
          gatherType: 'github',
          information: {
            login: response.data.login,
            followers: response.data.followers,
            following: response.data.following,
            html_url: response.data.html_url,
            avatar_url: response.data.avatar_url,
          },
        };
      } catch (error) {
        console.error("Error fetching Github data:", error);
        return { 
          error: "Error fetching Github data",
          gatherType: "github",
          information: {
            login: null,
            followers: null,
            following: null,
            html_url: null,
            avatar_url: null
          }};
      }
    },
  },
  {
    id: 'test-api',
    title: 'Test API Connection',
    gatherFunc: async () => {
      try {
        const response = await axios.get('http://localhost:8000/hello');
        return { gatherType: 'test-api', information: response.data };
      } catch (error) {
        console.error('Error fetching Hello World data:', error);
        return { error: 'Error fetching Hello World data' };
      }
    },
  },
];

const GatherButton = ({ item, onPress }: { item: Gatherer; onPress: (result: DataShape) => void }) => {
  const { id, title, gatherFunc } = item;
  const [loading, setLoading] = useState(false);
  
  const handleFetchData = async () => {
    if (loading) return;
    setLoading(true);

    try {
      const data = await gatherFunc();
      onPress(data);
    } catch (error) {
      console.error("Error during data fetching:", error);
    } finally {
      setLoading(false)
    }
  };

  return (
    <TouchableOpacity
      style={styles.item}
      onPress={handleFetchData}
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

  return (
    <View style={styles.container}>
      <FlatList
        data={gatherOptions}
        keyExtractor={(item, index) => item.id}
        renderItem={({ item }) => (
          <GatherButton item={item} onPress={handlePress} />
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
      
      <View style={styles.resultsContainer}>

        {/* <Text style={styles.resultsHeader}>Results:</Text> */}
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
          style={{ paddingTop: 10 }}
          // fixing indexing bug
          keyExtractor={(item, index) => `${index}-${JSON.stringify(item.information)}`}
          renderItem={({ item }) => (
            <View style={{ marginVertical: 5 }}>
              <Text style={[styles.resultText, item.error ? { color: "red" } : null]}>
                {item.gatherType || "NO TYPE"}
              </Text>
              {Object.entries(item.information).map(([key, value]) => (
                <Text key={`${key}-${value}`}>{JSON.stringify(key)}: {JSON.stringify(value)}</Text>
              ))}
            </View>
          )}
          ItemSeparatorComponent={() => (
            <View style={[styles.separator, { backgroundColor: "black" }]} />
          )}
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
    maxHeight: 250,
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
  },
});
