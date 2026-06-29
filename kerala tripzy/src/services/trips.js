import { db } from '../firebase/config';
import { addDoc, collection, doc, getDoc, getDocs, orderBy, query, serverTimestamp, where } from 'firebase/firestore';

export async function saveTripToFirestore({ userId, startTime, endTime, path }) {
  const tripsCol = collection(db, 'trips');
  const docRef = await addDoc(tripsCol, {
    userId,
    startTime: startTime instanceof Date ? startTime.toISOString() : startTime,
    endTime: endTime instanceof Date ? endTime.toISOString() : endTime,
    path,
    createdAt: serverTimestamp()
  });
  return docRef.id;
}

export async function fetchUserTrips(userId) {
  const tripsCol = collection(db, 'trips');
  const q = query(tripsCol, where('userId', '==', userId), orderBy('startTime', 'desc'));
  const snapshot = await getDocs(q);
  const trips = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
  return trips;
}

export async function fetchTripById(tripId) {
  const ref = doc(db, 'trips', tripId);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() };
}




