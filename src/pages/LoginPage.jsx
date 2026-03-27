import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../index"

import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    updateProfile
} from "firebase/auth"
import "../styles/LoginPage.css";

export function LoginPage() {
    const navigate = useNavigate();
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const [message, setMessage] = useState("");
    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => setMessage(""), 3000);
            return () => clearTimeout(timer);
        }
    }, [message]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    const resetForm = () => {
        setFormData({ username: '', email: '', password: '', confirmPassword: '' })
    }
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSubmit(e);
        }
    };
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (isLogin) {
            try {
                const userCredential = await signInWithEmailAndPassword(
                    auth,
                    formData.email,
                    formData.password
                )
                const user = userCredential.user;
                console.log("Logged in as:", user.email)
                setMessage("Welcome Back! ✦")
                setTimeout(() => navigate('/dashboard'), 1000)
            } catch (error) {
                console.error("Login error:".error.code)
                if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
                    setMessage("Invalid email or password! ❌")
                } else if (error.code === 'auth/too-many-request') {
                    setMessage("Too manu attempts. Try again later. ❌")
                } else {
                    setMessage("Something went wrong during login.")
                }
            }
        } else {
            if (formData.password !== formData.confirmPassword) {
                setMessage("Passwords don't match! ❌")
                return
            }
            try {
                const userCredential = await createUserWithEmailAndPassword(
                    auth,
                    formData.email,
                    formData.password
                )
                await updateProfile(userCredential.user, {
                    displayName: formData.username
                })
                console.log("Account Created for:", userCredential.user.email)
                setMessage("Account Created Successfully!")
                resetForm()
                setIsLogin(true)
            } catch (error) {
                console.error("Registration error:", error.code)
                if (error.code === 'auth/email-already-in-use') {
                    setMessage("Email already registered! ❌")
                } else if (error.code === "auth/weak-password") {
                    setMessage("Password must be at least 6 characters!")
                } else if (error.code === "auth/invalid-email") {
                    setMessage("Invalid Email Address! ❌")
                } else {
                    setMessage("Could not create account.")
                }
            }
        }
    };

    return (
        <div className="page">
            {message && (
                <div className="popup-message">
                    {message}
                </div>
            )}
            <div className="card">
                <div className="title">
                    <h1>Memoire</h1>
                    <p>Your Private Journal Space ✦</p>
                </div>

                <form onSubmit={handleSubmit} className="form">
                    {!isLogin && (
                        <>
                            <label htmlFor="username">Username</label>
                            <input
                                type="text"
                                id="username"
                                name="username"
                                value={formData.username}
                                placeholder="Username"
                                onChange={handleChange}
                                onKeyDown={handleKeyPress}
                                required
                            />
                        </>
                    )}

                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        placeholder="Email"
                        onChange={handleChange}
                        onKeyDown={handleKeyPress}
                        required
                    />

                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        placeholder="Password"
                        onChange={handleChange}
                        onKeyDown={handleKeyPress}
                        required
                    />

                    {!isLogin && (
                        <>
                            <label htmlFor="confirmPassword">Confirm Password</label>
                            <input
                                type="password"
                                id="confirmPassword"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                placeholder="Confirm Password"
                                onChange={handleChange}
                                onKeyDown={handleKeyPress}
                                required
                            />
                        </>
                    )}

                    <button type="submit" className="login-btn">
                        {isLogin ? 'Login 🠮' : 'Create Account 🠮'}
                    </button>

                    <div className="divider"><span>or</span></div>

                    <p className="auth-switch">
                        {isLogin ? "Don't have an account? " : "Already have an account? "}
                        <span className="toggle-link" onClick={() => setIsLogin(!isLogin)}>
                            {isLogin ? "Create one now 🠮" : "Login Here 🠮"}
                        </span>
                    </p>
                </form>
            </div>
        </div>
    );
} 