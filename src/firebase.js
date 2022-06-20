import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getStorage , ref } from "firebase/storage";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyBaFo_TnxY3lzxv29PVEdIldTxFwkXe19g",
    authDomain: "design-team-6d633.firebaseapp.com",
    databaseURL: "https://design-team-6d633-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "design-team-6d633",
    storageBucket: "design-team-6d633.appspot.com",
    messagingSenderId: "305338666112",
    appId: "1:305338666112:web:92257b59290a534250ea65"
  };

  export const app = initializeApp(firebaseConfig);
  export const storage = getStorage();
  export const storageRef = ref(storage);
  export const db = getDatabase(app);
  export const auth = getAuth();