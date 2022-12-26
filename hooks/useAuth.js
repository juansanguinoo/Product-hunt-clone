import React, { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

function useAuth() {
  const [authUser, setAuthUser] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setAuthUser(user);
        const uid = user.uid;
      } else {
        setAuthUser(null);
      }

      return () => unsubscribe();
    });
  }, []);

  return authUser;
}

export default useAuth;
