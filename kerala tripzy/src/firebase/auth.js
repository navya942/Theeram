import { auth, db } from './config';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

export function onAuthStateChangedListener(callback) {
  return onAuthStateChanged(auth, callback);
}

export async function signUpWithEmail({ email, password, displayName }) {
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  if (displayName) {
    await updateProfile(cred.user, { displayName });
  }
  const userDoc = doc(db, 'users', cred.user.uid);
  await setDoc(userDoc, {
    uid: cred.user.uid,
    email: cred.user.email,
    displayName: cred.user.displayName || '',
    createdAt: new Date().toISOString()
  }, { merge: true });
  return cred.user;
}

export async function signInWithEmail({ email, password }) {
  const cred = await signInWithEmailAndPassword(auth, email, password);
  return cred.user;
}

export async function signOutUser() {
  await signOut(auth);
}




