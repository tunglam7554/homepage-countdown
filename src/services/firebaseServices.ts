// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getDatabase, ref, set, get } from "firebase/database";
import { firebaseConfig } from "../config/firebaseConfig";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getDatabase(app);

export { auth, provider, db };

// Database functions for sync
export const saveSettingsToFirebase = async (syncKey: string, settings: any): Promise<void> => {
  try {
    await set(ref(db, `sync/${syncKey}`), settings);
  } catch (error) {
    console.error("Error saving settings:", error);
  }
};

export const loadSettingsFromFirebase = async (syncKey: string): Promise<any | null> => {
  try {
    const snapshot = await get(ref(db, `sync/${syncKey}`));
    if (snapshot.exists()) {
      return snapshot.val();
    }
    return null;
  } catch (error) {
    console.error("Error loading settings:", error);
    return null;
  }
};