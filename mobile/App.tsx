import React from 'react';
import { StyleSheet, Text, View, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" backgroundColor="#2e7d32" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Header Branding */}
        <View style={styles.header}>
          <Text style={styles.title}>🌾 ANNADATA</Text>
          <Text style={styles.tagline}>Har Kisan, Har Fasal, Har Faisla.</Text>
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>Day 1 • Mobile App Foundation</Text>
          </View>
        </View>

        {/* Foundation Welcome Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Kisan App Gateway</Text>
          <Text style={styles.cardDescription}>
            Welcome to the Annadata mobile application foundation. Designed for high readability, offline support, and large touch targets for Indian farmers.
          </Text>
        </View>

        {/* High Readability Button Prototype */}
        <TouchableOpacity 
          style={styles.largeButton} 
          activeOpacity={0.8}
          onPress={() => console.log('Annadata Foundation Ready')}
        >
          <Text style={styles.largeButtonText}>Foundation Active</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f8f4',
  },
  scrollContent: {
    padding: 16,
  },
  header: {
    backgroundColor: '#2e7d32',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  tagline: {
    fontSize: 16,
    color: '#e8f5e9',
    fontStyle: 'italic',
    marginBottom: 12,
  },
  statusBadge: {
    backgroundColor: '#f59e0b',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#1b2e1b',
    fontWeight: 'bold',
    fontSize: 12,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#e0eae0',
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2e7d32',
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 15,
    color: '#334433',
    lineHeight: 22,
  },
  largeButton: {
    backgroundColor: '#2e7d32',
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 56, // Accessible large touch target
  },
  largeButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
