import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  EmailAuthProvider,
  createUserWithEmailAndPassword,
  isSignInWithEmailLink,
  reauthenticateWithCredential,
  sendPasswordResetEmail,
  sendSignInLinkToEmail,
  signInWithEmailAndPassword,
  signInWithEmailLink,
  signOut,
  updatePassword,
  onAuthStateChanged,
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc, increment, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import type { UserRole } from '../lib/types';
import type { StudentProfile } from '../lib/types';
import { logEvent } from '../lib/eventLog';

const SESSION_START_KEY = 'yoobees_session_start';
const SESSION_UID_KEY   = 'yoobees_session_uid';

// Show the loading screen for at least this long so students can read the quotes
const MIN_LOADING_MS = 5_000;

const SIGNIN_EMAIL_KEY = 'yoobees_signin_email';

export const SIGN_IN_LINK_ACTION_SETTINGS = {
  url: window.location.origin + '/',
  handleCodeInApp: true,
};

interface AuthContextValue {
  user:                  User | null;
  role:                  UserRole | null;
  loading:               boolean;
  studentProfile:        StudentProfile | null;
  refreshStudentProfile: () => Promise<void>;
  login:                 (email: string, password: string) => Promise<void>;
  resetPassword:       (email: string) => Promise<void>;
  sendLoginLink:       (email: string) => Promise<void>;
  isSignInLink:        (url: string) => boolean;
  completeSignInWithLink: (email: string, url: string) => Promise<void>;
  changePassword:      (currentPassword: string, newPassword: string) => Promise<void>;
  register:    (email: string, password: string, role: UserRole) => Promise<void>;
  logout:      () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user,           setUser]           = useState<User | null>(null);
  const [role,           setRole]           = useState<UserRole | null>(null);
  const [loading,        setLoading]        = useState(true);
  const [studentProfile, setStudentProfile] = useState<StudentProfile | null>(null);

  useEffect(() => {
    const startedAt = Date.now();
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          setUser(firebaseUser);
          // Fetch user role and student profile in parallel — one round-trip instead of two.
          const [userSnap, studentSnap] = await Promise.all([
            getDoc(doc(db, 'users',    firebaseUser.uid)),
            getDoc(doc(db, 'students', firebaseUser.uid)),
          ]);
          setRole(userSnap.exists() ? (userSnap.data().role as UserRole) : null);
          setStudentProfile(studentSnap.exists() ? (studentSnap.data() as StudentProfile) : null);

          // Count this visit once per browser session (sessionStorage clears on tab close)
          const countedKey = `yoobees_counted_${firebaseUser.uid}`;
          if (!sessionStorage.getItem(countedKey) && userSnap.exists()) {
            sessionStorage.setItem(countedKey, '1');
            updateDoc(doc(db, 'users', firebaseUser.uid), {
              loginCount: increment(1),
            }).catch(() => undefined);
          }
        } else {
          setUser(null);
          setRole(null);
          setStudentProfile(null);
        }
      } finally {
        // Ensure the loading screen is visible for at least MIN_LOADING_MS so
        // students have time to read at least one full quote before proceeding.
        const elapsed = Date.now() - startedAt;
        const wait    = Math.max(0, MIN_LOADING_MS - elapsed);
        setTimeout(() => setLoading(false), wait);
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
    // Clear session flag so a subsequent login in the same tab is counted
    if (user) sessionStorage.removeItem(`yoobees_counted_${user.uid}`);
    await signOut(auth);
  };

  const resetPassword = async (email: string) => {
    await sendPasswordResetEmail(auth, email);
  };

  const sendLoginLink = async (email: string) => {
    await sendSignInLinkToEmail(auth, email, SIGN_IN_LINK_ACTION_SETTINGS);
    localStorage.setItem(SIGNIN_EMAIL_KEY, email);
  };

  const isSignInLink = (url: string): boolean =>
    isSignInWithEmailLink(auth, url);

  const completeSignInWithLink = async (email: string, url: string) => {
    const cred = await signInWithEmailLink(auth, email, url);
    localStorage.removeItem(SIGNIN_EMAIL_KEY);
    localStorage.setItem(SESSION_START_KEY, String(Date.now()));
    localStorage.setItem(SESSION_UID_KEY, cred.user.uid);
  };

  const refreshStudentProfile = async () => {
    if (!auth.currentUser) return;
    const snap = await getDoc(doc(db, 'students', auth.currentUser.uid));
    setStudentProfile(snap.exists() ? (snap.data() as StudentProfile) : null);
  };

  const changePassword = async (currentPassword: string, newPassword: string) => {
    if (!auth.currentUser?.email) throw new Error('Not signed in');
    const credential = EmailAuthProvider.credential(auth.currentUser.email, currentPassword);
    await reauthenticateWithCredential(auth.currentUser, credential);
    await updatePassword(auth.currentUser, newPassword);
  };

  return (
    <AuthContext.Provider value={{
      user, role, loading, studentProfile, refreshStudentProfile,
      login, resetPassword, sendLoginLink, isSignInLink, completeSignInWithLink, changePassword,
      register, logout,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
