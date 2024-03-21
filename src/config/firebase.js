import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'MUSICALL_API_KEY',
  authDomain: 'MUSICALL_AUTH_DOMAIN',
  projectId: 'MUSICALL_PROJECT_ID',
  storageBucket: 'MUSICALL_STORAGE_BUCKET',
  messagingSenderId: 'MUSICALL_MESSAGING_SENDER_ID',
  appId: 'MUSICALL_APP_ID',
};

// Inicializar Firebase
const firebaseApp = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const firestore = firebase.firestore();

export { firebaseApp, auth, firestore };
