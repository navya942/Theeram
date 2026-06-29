import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { signInWithEmail, signUpWithEmail } from '../firebase/auth';

export default function AuthScreen() {
  const [mode, setMode] = React.useState('login');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [displayName, setDisplayName] = React.useState('');
  const [error, setError] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const toggle = () => setMode(prev => (prev === 'login' ? 'signup' : 'login'));

  const onSubmit = async () => {
    try {
      setLoading(true);
      setError('');
      if (mode === 'login') {
        await signInWithEmail({ email, password });
      } else {
        await signUpWithEmail({ email, password, displayName });
      }
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tripzy</Text>
      {mode === 'signup' && (
        <TextInput
          style={styles.input}
          placeholder="Display Name"
          value={displayName}
          onChangeText={setDisplayName}
          autoCapitalize="words"
        />
      )}
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <TouchableOpacity style={styles.button} onPress={onSubmit} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? 'Please wait…' : mode === 'login' ? 'Log In' : 'Sign Up'}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={toggle}>
        <Text style={styles.switch}>{mode === 'login' ? "Don't have an account? Sign up" : 'Already have an account? Log in'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: 'center' },
  title: { fontSize: 32, fontWeight: '700', marginBottom: 24, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, marginBottom: 12 },
  button: { backgroundColor: '#0ea5e9', padding: 14, borderRadius: 8, alignItems: 'center', marginTop: 8 },
  buttonText: { color: '#fff', fontWeight: '600' },
  switch: { marginTop: 12, color: '#0ea5e9', textAlign: 'center' },
  error: { color: 'red', marginBottom: 8, textAlign: 'center' },
});





