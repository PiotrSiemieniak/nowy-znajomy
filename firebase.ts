// firebase.ts
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB-CJa9N2c0MpdlXeqsJHVnaWXPIeW7RbU",
  authDomain: "test-fab2c.firebaseapp.com",
  projectId: "test-fab2c",
  storageBucket: "test-fab2c.firebasestorage.app",
  messagingSenderId: "390315582040",
  appId: "1:390315582040:web:efc28ad7db1709e8f3602d",
  measurementId: "G-QSCEXXH0L5"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);