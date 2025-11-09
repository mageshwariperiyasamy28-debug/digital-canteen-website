"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

interface UserContextType {
  user: User | null;
  userProfile: any | null;
  loading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        // Fetch user profile from Firestore
        try {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists()) {
            setUserProfile(userDoc.data());
          } else {
            // Create a default profile if it doesn't exist
            setUserProfile({
              uid: user.uid,
              email: user.email,
              displayName: user.displayName || "User",
              createdAt: new Date(),
            });
          }
        } catch (error: any) {
          console.error("Error fetching user profile:", error);
          // Handle permission errors gracefully
          if (error.code === "permission-denied") {
            // Use basic user info when Firestore access is denied
            setUserProfile({
              uid: user.uid,
              email: user.email,
              displayName: user.displayName || "User",
            });
          } else {
            setUserProfile(null);
          }
        }
      } else {
        setUser(null);
        setUserProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <UserContext.Provider value={{ user, userProfile, loading }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}