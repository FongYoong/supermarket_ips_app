import React, { useState, createContext, useEffect } from 'react';
import { getAuth, signInAnonymously } from "firebase/auth";
const authInstance = getAuth();

export const AuthContext = createContext(undefined);

export function AuthProvider ({children}) {
    
    const [auth, setAuth] = useState(undefined);
    const [authLoading, setAuthLoading] = useState(true);

    useEffect(() => {
        signInAnonymously(authInstance)
          .then((credential) => {
            setAuthLoading(false);
            setAuth(credential.user);
          })
          .catch((error) => {
            setAuthLoading(false);
            console.log(error.code);
            console.log(error.message);
        });
    }, []);

    return (
        <AuthContext.Provider value={{auth, authLoading}} >
            {children}
        </AuthContext.Provider>
    )
}