// Importar módulos de Firebase SDK (v10+ Modular)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, collection, onSnapshot } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// Reemplaza esto con TU configuración copiada de la consola de Firebase:
const firebaseConfig = {
    apiKey: "AIzaSyBP91WgbdyUCn7jCcwMDUv1FeiG_gz4qAU",
    authDomain: "bigtecstore-a45e8.firebaseapp.com",
    projectId: "bigtecstore-a45e8",
    storageBucket: "bigtecstore-a45e8.firebasestorage.app",
    messagingSenderId: "12736846619",
    appId: "1:12736846619:web:3b45008de662f9bd0111be",
    measurementId: "G-G7RC3T4XDT"
};

// Inicializar Firebase y la base de datos Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db, collection, onSnapshot };