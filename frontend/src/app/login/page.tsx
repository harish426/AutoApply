'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth, provider } from '../lib/firebase';
import { useUserStore } from '../store/userStore';

import {
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth';

export default function LoginPage() {
  const [user] = useState<User | null>(null);
  const router = useRouter();
  const { setUser } = useUserStore();


  // 🔄 Listen for login state change
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        router.push('/');
      }
    });
    return () => unsubscribe();
  }, []);

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, provider);
    } catch (err) {
      console.error('Login failed:', err);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem('user');
      setUser(null);
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      {!user ? (
        <button
          onClick={handleGoogleLogin}
          className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700"
        >
          Sign in with Google
        </button>
      ) : (
        <div className="text-center">
          <p className="text-xl">Welcome, {user.displayName}</p>
          <img src={user.photoURL ?? ''} alt="User" className="rounded-full mt-4 w-24 h-24 mx-auto" />
          <button
            onClick={handleLogout}
            className="mt-4 bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
