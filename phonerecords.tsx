import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import Contacts from 'react-native-contacts';

// Request permission and fetch contacts
const fetchContacts = async () => {
    const permission = await Contacts.requestPermission();
    if (permission === 'authorized') {
    try {
        const fetchedContacts = await Contacts.getAll();
        console.log(fetchContacts)
    } catch (error) {
        console.error('Error fetching contacts:', error);
    }
    } else {
        console.warn('Permission denied');
    }
};