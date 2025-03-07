import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Link, Tabs } from 'expo-router';
import { Text, Pressable } from 'react-native';

import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { useClientOnlyValue } from '@/components/useClientOnlyValue';

function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: useClientOnlyValue(false, true),
      }}>
      <Tabs.Screen
        name="data"
        options={{
          title: 'data',
          tabBarIcon: ({ color }) => <TabBarIcon name="address-card" color={color} />,
        }}
      />
      <Tabs.Screen
        name="other"
        options={{
          title: 'Testing Space',
          tabBarIcon: ({ color }) => <TabBarIcon name="align-left" color={color} />,
        }}
      />
    </Tabs>
  );
}
