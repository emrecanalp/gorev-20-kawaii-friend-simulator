import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import { UserData, FriendState } from '../types';

interface AuthContextType {
  user: User | null;
  userData: UserData | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  createFriend: (friendName: string) => Promise<void>;
  updateFriendState: (newState: FriendState) => Promise<void>;
  refreshUserData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserData = async (uid: string) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid));
      if (userDoc.exists()) {
        const data = userDoc.data();
        setUserData({
          ...data,
          lastInteraction: data.lastInteraction?.toDate() || new Date(),
          createdAt: data.createdAt?.toDate() || new Date(),
        } as UserData);
      } else {
        setUserData(null);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      setUserData(null);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        await fetchUserData(firebaseUser.uid);
      } else {
        setUserData(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      await fetchUserData(result.user.uid);
    } catch (error) {
      throw error;
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (error) {
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      setUserData(null);
    } catch (error) {
      throw error;
    }
  };

  const createFriend = async (friendName: string) => {
    if (!user) throw new Error('User not authenticated');

    const newUserData: UserData = {
      uid: user.uid,
      email: user.email || '',
      friendName,
      friendState: 'happy',
      lastInteraction: new Date(),
      happinessScore: 100,
      createdAt: new Date(),
    };

    await setDoc(doc(db, 'users', user.uid), {
      ...newUserData,
      lastInteraction: new Date(),
      createdAt: new Date(),
    });

    setUserData(newUserData);
  };

  const updateFriendState = async (newState: FriendState) => {
    if (!user || !userData) throw new Error('User not authenticated');

    const updatedData = {
      ...userData,
      friendState: newState,
      lastInteraction: new Date(),
    };

    await setDoc(doc(db, 'users', user.uid), {
      ...updatedData,
      lastInteraction: new Date(),
    }, { merge: true });

    setUserData(updatedData);
  };

  const refreshUserData = async () => {
    if (user) {
      await fetchUserData(user.uid);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      userData,
      loading,
      signIn,
      signUp,
      signOut,
      createFriend,
      updateFriendState,
      refreshUserData,
    }}>
      {children}
    </AuthContext.Provider>
  );
};