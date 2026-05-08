// Importamos las herramientas de Firebase
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// TUS LLAVES MAESTRAS DE VISTA AL VUELO
const firebaseConfig = {
  apiKey: "AIzaSyBDK6ogRCnu492mJx_kVFJGFCQfR-3xAg8",
  authDomain: "vista-al-vuelo-lms.firebaseapp.com",
  projectId: "vista-al-vuelo-lms",
  storageBucket: "vista-al-vuelo-lms.firebasestorage.app",
  messagingSenderId: "414982939087",
  appId: "1:414982939087:web:9754b6c79dd193ce2bf2ba"
};

// Inicializamos la conexión
const app = initializeApp(firebaseConfig);

// Activamos la Base de Datos (Firestore) y la exportamos para que la App la use
const db = getFirestore(app);

export { db };