import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import type { UserRole } from '../lib/types';
import { logEvent } from '../lib/eventLog';

const SESSION_START_KEY = 'yoobees_session_start';
const SESSION_UID_KEY = 'yoobees_session_uid';

interface AuthContextValue {
  user:        User | null;
  role:        UserRole | null;
  loading:     boolean;
  login:       (email: string, password: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  register:    (email: string, password: string, role: UserRole) => Promise<void>;
  logout:      () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user,    setUser]    = useState<User | null>(null);
  const [role,    setRole]    = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          setUser(firebaseUser);
          const snap = await getDoc(doc(db, 'users', firebaseUser.uid));
          setRole(snap.exists() ? (snap.data().role as UserRole) : null);
        } else {
          setUser(null);
          setRole(null);
        }
      } finally {
        setLoading(false);
      }
    });
    return unsub;
  }, []);

  const login = async (email: string, password: string) => {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    const roleSnap = await getDoc(doc(db, 'users', cred.user.uid));
    const currentRole = roleSnap.exists() ? (roleSnap.data().role as UserRole) : null;
    localStorage.setItem(SESSION_START_KEY, String(Date.now()));
    localStorage.setItem(SESSION_UID_KEY, cred.user.uid);
    await logEvent({
      type: 'user_login',
      description: `${cred.user.email || 'User'} signed in.`,
      actorUid: cred.user.uid,
      actorEmail: cred.user.email,
      actorRole: currentRole,
    }).catch(() => undefined);
  };

  const register = async (email: string, password: string, role: UserRole) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    await setDoc(doc(db, 'users', cred.user.uid), {
      uid:       cred.user.uid,
      email,
      role,
      createdAt: serverTimestamp(),
    });
    if (role === 'teachingAssistant') {
      await logEvent({
        type: 'ta_account_created',
        description: `New teaching assistant account created: ${email}.`,
        actorUid: cred.user.uid,
        actorEmail: email,
        actorRole: role,
      }).catch(() => undefined);
    }
    setRole(role);
  };

  const logout = async () => {
    const sessionStart = Number(localStorage.getItem(SESSION_START_KEY) || '0');
    const sessionUid = localStorage.getItem(SESSION_UID_KEY);
    const durationSeconds = sessionStart > 0 ? Math.max(0, Math.floor((Date.now() - sessionStart) / 1000)) : 0;
    if (user && (!sessionUid || sessionUid === user.uid)) {
      await logEvent({
        type: 'user_logout',
        description: `${user.email || 'User'} signed out after ${durationSeconds}s.`,
        actorUid: user.uid,
        actorEmail: user.email,
        actorRole: role,
        durationSeconds,
      }).catch(() => undefined);
    }
    localStorage.removeItem(SESSION_START_KEY);
    localStorage.removeItem(SESSION_UID_KEY);
    await signOut(auth);
  };

  const resetPassword = async (email: string) => {
    await sendPasswordResetEmail(auth, email);
  };

  return (
    <AuthContext.Provider value={{ user, role, loading, login, resetPassword, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
