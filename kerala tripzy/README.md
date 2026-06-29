Tripzy (React Native + Firebase)

Minimal prototype to record trips, save GPS points every 15 seconds, and view past trips on a map. Uses Firebase Auth (email/password) and Firestore.

Setup

1. Install dependencies:
```
npm install
```
2. Firebase project: create one and enable Email/Password Auth. Create Firestore in native mode.
3. Copy Firebase web config into `src/firebase/config.js`.
4. Maps API keys: add iOS and Android keys in `app.json` (replace placeholders). Enable Maps SDK for iOS/Android in Google Cloud.
5. Permissions:
   - iOS: Location usage descriptions already in `app.json`.
   - Android: Location permissions already requested in `app.json`. On Android 12+, background location is not required for manual recording.
6. Run:
```
npx expo start
```
Then build/run on a device or emulator.

Notes

- Recording interval is 15s using `react-native-geolocation-service`.
- Trip saved with `userId`, `startTime`, `endTime`, and `path` array [{ latitude, longitude, timestamp }].
- Trips list shows date/duration; detail screen draws polyline path.

Collections

- users/{uid}
- trips/{tripId}

Files

- `App.js`: Navigation + auth state
- `src/screens/*`: Auth, Home, Trips, TripDetail
- `src/hooks/useTripRecorder.js`: 15s GPS recorder
- `src/services/trips.js`: Firestore functions
- `src/firebase/*`: Firebase setup & auth helpers




