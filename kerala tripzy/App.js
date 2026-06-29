import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import AuthScreen from './src/screens/AuthScreen';
import HomeScreen from './src/screens/HomeScreen';
import TripsScreen from './src/screens/TripsScreen';
import TripDetailScreen from './src/screens/TripDetailScreen';
import { onAuthStateChangedListener } from './src/firebase/auth';

const Stack = createNativeStackNavigator();

export default function App() {
  const [user, setUser] = React.useState(null);
  const [initializing, setInitializing] = React.useState(true);

  React.useEffect(() => {
    const unsub = onAuthStateChangedListener((u) => {
      setUser(u);
      if (initializing) setInitializing(false);
    });
    return unsub;
  }, [initializing]);

  if (initializing) {
    return null;
  }

  return (
    <NavigationContainer>
      <StatusBar style="dark" />
      <Stack.Navigator>
        {user ? (
          <>
            <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Tripzy' }} />
            <Stack.Screen name="Trips" component={TripsScreen} options={{ title: 'My Trips' }} />
            <Stack.Screen name="TripDetail" component={TripDetailScreen} options={{ title: 'Trip Detail' }} />
          </>
        ) : (
          <Stack.Screen name="Auth" component={AuthScreen} options={{ headerShown: false }} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}




