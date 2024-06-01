import React, { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";

interface AuthGuardProps {
  guarded: React.ReactNode;
  fallback: React.ReactNode;
}

const AuthGuard = ({ guarded, fallback }: AuthGuardProps) => {
  const [user, setUser] = useState<null | object>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  return user ? <>{guarded}</> : <>{fallback}</>;
};

export default AuthGuard;
