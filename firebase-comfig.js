
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "GANTI_DENGAN_CONFIG_FIREBASE",
  authDomain: "GANTI_DENGAN_CONFIG_FIREBASE",
  projectId: "GANTI_DENGAN_CONFIG_FIREBASE",
  storageBucket: "GANTI_DENGAN_CONFIG_FIREBASE",
  messagingSenderId: "GANTI_DENGAN_CONFIG_FIREBASE",
  appId: "GANTI_DENGAN_CONFIG_FIREBASE"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
