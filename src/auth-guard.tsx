import React, { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";

interface AuthGuardProps {
  guarded: React.ReactNode;
  fallback: React.ReactNode;
}

const AuthGuard = ({ guarded, fallback }: AuthGuardProps) => {
  const [user, setUser] = useState<null | object>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user: any) => {
      if (user) {
        try {
          const response = await fetch(
            `https://us-central1-rvir-1e34e.cloudfunctions.net/api/users/${user.uid}`
          );
          const userData = await response.json();

          if (userData.role === "admin" || userData.role === "doorman") {
            setUser(user);
          } else {
            setShowModal(true);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        } finally {
          setIsLoading(false);
        }
      } else {
        setUser(null);
        setIsLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return user ? (
    <>{guarded}</>
  ) : (
    <>
      {fallback}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white rounded-lg p-6">
            <h2 className="text-lg font-bold text-red-500">
              You do not have access to this console
            </h2>
            <button
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded"
              onClick={() => setShowModal(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default AuthGuard;
