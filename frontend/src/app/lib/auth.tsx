import { auth, provider, db } from './firebase';
import { signInWithPopup, signOut } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';

export const handleGoogleLogin = async () => {
  const result = await signInWithPopup(auth, provider);
  const user = result.user;

  // Save to Firestore
  const userRef = doc(db, 'users', user.uid);
  await setDoc(
    userRef,
    {
      name: user.displayName,
      email: user.email,
      photoURL: user.photoURL,
    },
    { merge: true }
  );

  return user;
};

export const handleLogout = async () => {
  await signOut(auth);
};

export const fetchUserFromFirestore = async (uid: string) => {
  const userRef = doc(db, 'users', uid);
  const docSnap = await getDoc(userRef);
  if (docSnap.exists()) {
    return docSnap.data();
  } else {
    return null;
  }
};
