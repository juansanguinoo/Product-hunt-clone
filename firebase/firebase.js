import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth';

import firebaseConfig from './config';

class Firebase {
  constructor() {
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    const db = getFirestore(app);
    const storage = getStorage(app);
  }

  async register(name, email, password) {
    const auth = getAuth();
    await createUserWithEmailAndPassword(auth, email, password).then(
      (userCredential) => {
        const user = userCredential.user;
        updateProfile(user, { displayName: name });
      }
    );
  }

  async login(email, password) {
    const auth = getAuth();
    await signInWithEmailAndPassword(auth, email, password).then(
      (userCredential) => {
        const user = userCredential.user;
        return user;
      }
    );
  }

  async logout() {
    const auth = getAuth();
    await auth.signOut();
  }
}

const firebase = new Firebase();
export default firebase;
