import { useState, useEffect } from "react";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    updateProfile,
    updateEmail,
    updatePassword,
    reauthenticateWithCredential,
    EmailAuthProvider
} from "firebase/auth";
import { auth } from "../index";
import { AuthContext } from "../context";

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            setUser(firebaseUser);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const login = async (email, password) => {
        try {
            setError(null);
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            return { user: userCredential.user };
        } catch (err) {
            console.error("Login error:", err);
            setError(err.message);
            throw err;
        }
    };

    const register = async (email, password, displayName) => {
        try {
            setError(null);
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            await updateProfile(userCredential.user, { displayName });
            return { user: userCredential.user };
        } catch (err) {
            console.error("Register error:", err);
            setError(err.message);
            throw err;
        }
    };

    const logout = async () => {
        try {
            setError(null);
            await signOut(auth);
        } catch (err) {
            console.error("Logout error:", err);
            setError(err.message);
            throw err;
        }
    };

    const updateUserProfile = async (newDisplayName) => {
        try {
            setError(null);
            if (!user) throw new Error("No user logged in");
            await updateProfile(user, { displayName: newDisplayName });
            // Refresh user object to get updated profile
            setUser({ ...user });
        } catch (err) {
            console.error("Update profile error:", err);
            setError(err.message);
            throw err;
        }
    };

    const updateUserEmail = async (newEmail, currentPassword) => {
        try {
            setError(null);
            if (!user) throw new Error("No user logged in");
            const credential = EmailAuthProvider.credential(user.email, currentPassword);
            await reauthenticateWithCredential(user, credential);
            await updateEmail(user, newEmail);
            // Refresh user object to get updated email
            setUser({ ...user, email: newEmail });
        } catch (err) {
            console.error("Update email error:", err);
            setError(err.message);
            throw err;
        }
    };

    const updateUserPassword = async (currentPassword, newPassword) => {
        try {
            setError(null);
            if (!user) throw new Error("No user logged in");
            const credential = EmailAuthProvider.credential(user.email, currentPassword);
            await reauthenticateWithCredential(user, credential);
            await updatePassword(user, newPassword);
        } catch (err) {
            console.error("Update password error:", err);
            setError(err.message);
            throw err;
        }
    };

    const value = {
        user,
        loading,
        error,
        login,
        register,
        logout,
        updateUserProfile,
        updateUserEmail,
        updateUserPassword
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}