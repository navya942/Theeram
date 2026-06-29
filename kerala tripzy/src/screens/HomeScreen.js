import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useTripRecorder } from '../hooks/useTripRecorder';
import { saveTripToFirestore } from '../services/trips';
import { auth } from '../firebase/config';
import { signOutUser } from '../firebase/auth';

export default function HomeScreen({ navigation }) {
  const { isRecording, start, stop, path, startTime, endTime } = useTripRecorder();

  const handleStart = () => {
    start();
  };

  const handleStop = async () => {
    stop();
    setTimeout(async () => {
      try {
        if (!auth.currentUser) return Alert.alert('Not signed in');
        if (!startTime) return;
        const end = new Date().toISOString();
        const id = await saveTripToFirestore({
          userId: auth.currentUser.uid,
          startTime,
          endTime: end,
          path
        });
        Alert.alert('Trip saved', `Trip ID: ${id}`);
      } catch (e) {
        Alert.alert('Error', e.message);
      }
    }, 200);
  };

  const goToTrips = () => navigation.navigate('Trips');

  const onLogout = async () => {
    await signOutUser();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome{auth.currentUser?.displayName ? `, ${auth.currentUser.displayName}` : ''}!</Text>
      <Text style={styles.subtitle}>Record your trip with Tripzy</Text>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: isRecording ? '#ef4444' : '#22c55e' }]}
        onPress={isRecording ? handleStop : handleStart}
      >
        <Text style={styles.buttonText}>{isRecording ? 'End Trip' : 'Start Trip'}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.secondary]} onPress={goToTrips}>
        <Text style={styles.secondaryText}>My Trips</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.secondary]} onPress={onLogout}>
        <Text style={styles.secondaryText}>Log out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: 'center' },
  title: { fontSize: 24, fontWeight: '700', marginBottom: 8, textAlign: 'center' },
  subtitle: { fontSize: 14, color: '#6b7280', marginBottom: 24, textAlign: 'center' },
  button: { padding: 16, borderRadius: 12, alignItems: 'center', marginBottom: 12 },
  buttonText: { color: 'white', fontWeight: '700' },
  secondary: { padding: 12, borderRadius: 12, alignItems: 'center', borderWidth: 1, borderColor: '#e5e7eb', marginTop: 8 },
  secondaryText: { color: '#111827', fontWeight: '600' }
});





