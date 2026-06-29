import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { auth } from '../firebase/config';
import { fetchUserTrips } from '../services/trips';

function formatDuration(start, end) {
  const startMs = new Date(start).getTime();
  const endMs = new Date(end).getTime();
  const diff = Math.max(0, endMs - startMs);
  const minutes = Math.floor(diff / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);
  return `${minutes}m ${seconds}s`;
}

export default function TripsScreen({ navigation }) {
  const [trips, setTrips] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await fetchUserTrips(auth.currentUser.uid);
        setTrips(data);
      } finally {
        setLoading(false);
      }
    };
    const unsubscribe = navigation.addListener('focus', load);
    load();
    return unsubscribe;
  }, [navigation]);

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('TripDetail', { tripId: item.id })}>
      <Text style={styles.cardTitle}>{new Date(item.startTime).toLocaleString()}</Text>
      <Text style={styles.cardSubtitle}>Duration: {formatDuration(item.startTime, item.endTime)}</Text>
      <Text style={styles.cardSubtitle}>Points: {item.path?.length || 0}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {loading ? <Text>Loading…</Text> : (
        <FlatList
          data={trips}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          ListEmptyComponent={<Text>No trips yet.</Text>}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  card: { borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 12, padding: 12, marginBottom: 12 },
  cardTitle: { fontSize: 16, fontWeight: '700' },
  cardSubtitle: { color: '#6b7280', marginTop: 2 },
});





