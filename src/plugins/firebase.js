import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import firebaseConfig from './firebaseConfig';
import {getFirestore} from "firebase/firestore";

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

const analytics = getAnalytics(app);

const auth = getAuth(app);

export { app, analytics, auth, db };