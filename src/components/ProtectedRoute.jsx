import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "..";
import  Loader  from "./Loader"

export function ProtectedRoute({ children }) {
    const navigate = useNavigate()
    const [checking, setChecking] = useState(true)

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (!user) navigate('/')
            setChecking(false)
        })
        return () => unsubscribe()
    }, [navigate])
    if (checking) return <Loader />
    return children
}