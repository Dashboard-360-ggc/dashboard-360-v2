// components/LoginButton.tsx

'use client';

import { GoogleAuthProvider, signInWithPopup, signOut, User } from "firebase/auth";
import { auth } from "../firebase/config";
import { useState, useEffect } from "react";

export default function LoginButton() {
  const [user, setUser] = useState<User | null>(null);

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      setUser(result.user);
      console.log("Inicio de sesión exitoso:", result.user);
    } catch (error) {
      console.error("Error en el inicio de sesión:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      console.log("Cierre de sesión exitoso");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="mt-4">
      {user ? (
    
        <div className="flex items-center gap-4">
          <p>Bienvenido, <strong>{user.displayName}</strong></p>
          <button onClick={handleLogout} className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700">
            Cerrar Sesión
          </button>
        </div>
      ) : (

        <button onClick={handleGoogleLogin} className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700">
          Iniciar Sesión con Google
        </button>
      )}
    </div>
  );
  
}