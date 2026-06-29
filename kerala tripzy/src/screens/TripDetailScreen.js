import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import MapView, { Polyline } from 'react-native-maps';
import { fetchTripById } from '../services/trips';

export default function TripDetailScreen({ route }) {
  const { tripId } = route.params;
  const [trip, setTrip] = React.useState(null);
  const [region, setRegion] = React.useState(null);

  React.useEffect(() => {
    const load = async () => {
      const t = await fetchTripById(tripId);
      setTrip(t);
      const points = t?.path || [];
      if (points.length > 0) {
        const first = points[0];
        setRegion({
          latitude: first.latitude,
          longitude: first.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        });
      }
    };
    load();
  }, [tripId]);

  const coordinates = (trip?.path || []).map(p => ({ latitude: p.latitude, longitude: p.longitude }));

  return (
    <View style={styles.container}>
      {region ? (
        <MapView style={styles.map} initialRegion={region}>
          {coordinates.length > 1 && (
            <Polyline coordinates={coordinates} strokeColor="#3b82f6" strokeWidth={4} />
          )}
        </MapView>
      ) : (
        <Text style={{ padding: 16 }}>No coordinates to display.</Text>
      )}
      {trip && (
        <View style={styles.info}>
          <Text style={styles.infoText}>Start: {new Date(trip.startTime).toLocaleString()}</Text>
          <Text style={styles.infoText}>End: {new Date(trip.endTime).toLocaleString()}</Text>
          <Text style={styles.infoText}>Points: {trip.path?.length || 0}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { width: Dimensions.get('window').width, height: Dimensions.get('window').height * 0.7 },
  info: { padding: 16, borderTopWidth: 1, borderTopColor: '#e5e7eb' },
  infoText: { marginBottom: 4 }
});





