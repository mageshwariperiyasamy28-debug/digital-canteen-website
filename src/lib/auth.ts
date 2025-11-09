import { auth } from "@/lib/firebase";
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  sendPasswordResetEmail,
  updateProfile as updateFirebaseProfile
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

// Sign in with email and password
export const signIn = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Update last login time
    await setDoc(doc(db, "users", user.uid), {
      lastLogin: new Date(),
    }, { merge: true });
    
    return { success: true, user };
  } catch (error) {
    console.error("Sign in error:", error);
    return { success: false, error };
  }
};

// Sign up with email and password
export const signUp = async (name: string, email: string, password: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Update profile with display name
    await updateFirebaseProfile(user, {
      displayName: name,
    });
    
    // Create user document in Firestore
    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      name,
      email,
      createdAt: new Date(),
      lastLogin: new Date(),
    });
    
    return { success: true, user };
  } catch (error) {
    console.error("Sign up error:", error);
    return { success: false, error };
  }
};

// Sign out
export const logOut = async () => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    console.error("Sign out error:", error);
    return { success: false, error };
  }
};

// Reset password
export const resetPassword = async (email: string) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return { success: true };
  } catch (error) {
    console.error("Password reset error:", error);
    return { success: false, error };
  }
};

// Get user profile
export const getUserProfile = async (uid: string) => {
  try {
    const userDoc = await getDoc(doc(db, "users", uid));
    if (userDoc.exists()) {
      return { success: true, data: userDoc.data() };
    } else {
      return { success: false, error: "User profile not found" };
    }
  } catch (error) {
    console.error("Get user profile error:", error);
    return { success: false, error };
  }
};

// Update user profile
export const updateUserProfile = async (uid: string, data: any) => {
  try {
    await setDoc(doc(db, "users", uid), data, { merge: true });
    return { success: true };
  } catch (error) {
    console.error("Update user profile error:", error);
    return { success: false, error };
  }
};