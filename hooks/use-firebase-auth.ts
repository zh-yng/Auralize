import { onAuthStateChanged, signInAnonymously, User } from "firebase/auth";
import { useEffect, useState } from "react";
import { auth } from ".././firebaseConfig";

export default function useFirebaseAuth() {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser: any) => {
            setUser(currentUser);
        });
        return unsubscribe;
    }, []);

    const handleAnonymousSignIn = async () => {
        try {
            await signInAnonymously(auth);
            console.log("Signed in anonymously");
        } catch (error) {
            console.error("Anonymous sign-in error:", error);
        }
    };

    return { user, handleAnonymousSignIn };
}