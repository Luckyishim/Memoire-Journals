import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks";
import { useTheme } from "../hooks";
import "../styles/LoginPage.css";

export function LoginPage() {
    const navigate = useNavigate();
    const { darkMode } = useTheme();
    const { login, register, user, loading } = useAuth();
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Redirect if already logged in
    useEffect(() => {
        if (user && !loading) {
            navigate('/dashboard');
        }
    }, [user, loading, navigate]);

    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => {
                setMessage("");
                setMessageType("");
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [message]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const resetForm = () => {
        setFormData({ username: '', email: '', password: '', confirmPassword: '' });
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSubmit(e);
        }
    };

    const showMessage = (text, type = "error") => {
        setMessage(text);
        setMessageType(type);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (isSubmitting) return;
        setIsSubmitting(true);

        if (isLogin) {
            // Login validation
            if (!formData.email || !formData.password) {
                showMessage("Please enter both email and password! ❌");
                setIsSubmitting(false);
                return;
            }

            try {
                await login(formData.email.trim(), formData.password);
                showMessage("Welcome Back! ✦", "success");
                setTimeout(() => navigate('/dashboard'), 1000);
            } catch (error) {
                console.error("Login error:", error.code);
                
                // Handle specific error codes
                switch (error.code) {
                    case 'auth/user-not-found':
                        showMessage("No account found with this email! ❌");
                        break;
                    case 'auth/wrong-password':
                        showMessage("Incorrect password! Please try again. ❌");
                        break;
                    case 'auth/invalid-credential':
                        showMessage("Invalid email or password! ❌");
                        break;
                    case 'auth/invalid-email':
                        showMessage("Please enter a valid email address! ❌");
                        break;
                    case 'auth/too-many-requests':
                        showMessage("Too many failed attempts. Please try again later. ❌");
                        break;
                    case 'auth/user-disabled':
                        showMessage("This account has been disabled. Contact support. ❌");
                        break;
                    default:
                        showMessage(error.message || "Something went wrong during login. Please try again. ❌");
                }
                setIsSubmitting(false);
            }
        } else {
            // Registration validation
            if (!formData.username.trim()) {
                showMessage("Please enter a username! ❌");
                setIsSubmitting(false);
                return;
            }
            
            if (!formData.email.trim()) {
                showMessage("Please enter an email address! ❌");
                setIsSubmitting(false);
                return;
            }
            
            if (!formData.password) {
                showMessage("Please enter a password! ❌");
                setIsSubmitting(false);
                return;
            }
            
            if (formData.password !== formData.confirmPassword) {
                showMessage("Passwords don't match! ❌");
                setIsSubmitting(false);
                return;
            }
            
            if (formData.password.length < 6) {
                showMessage("Password must be at least 6 characters! ❌");
                setIsSubmitting(false);
                return;
            }

            try {
                await register(formData.email.trim(), formData.password, formData.username.trim());
                showMessage("Account Created Successfully! ✨", "success");
                resetForm();
                
                // Switch to login after successful registration
                setTimeout(() => {
                    setIsLogin(true);
                    setIsSubmitting(false);
                }, 1500);
                
            } catch (error) {
                console.error("Registration error:", error.code);
                
                // Handle specific error codes
                switch (error.code) {
                    case 'auth/email-already-in-use':
                        showMessage("Email already registered! Try logging in instead. ❌");
                        break;
                    case 'auth/weak-password':
                        showMessage("Password must be at least 6 characters! ❌");
                        break;
                    case 'auth/invalid-email':
                        showMessage("Please enter a valid email address! ❌");
                        break;
                    case 'auth/operation-not-allowed':
                        showMessage("Email/password accounts are not enabled. Contact support. ❌");
                        break;
                    default:
                        showMessage(error.message || "Could not create account. Please try again. ❌");
                }
                setIsSubmitting(false);
            }
        }
    };

    const bgImage = darkMode ? "/images/memoire-dark.png" : "/images/memoire.png";

    // Show loading state while checking auth
    if (loading) {
        return (
            <div className="page" style={{ backgroundImage: `url(${bgImage})` }}>
                <div className="card">
                    <div className="title">
                        <h1>Memoire</h1>
                        <p>Loading...</p>
                    </div>
                </div>
            </div>
        );
    }

    // Don't render login form if already logged in (will redirect via useEffect)
    if (user) {
        return null;
    }

    return (
        <div className="page" style={{ backgroundImage: `url(${bgImage})` }}>
            {message && (
                <div className={`popup-message ${messageType}`}>
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
                                autoComplete="off"
                                disabled={isSubmitting}
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
                        autoComplete="email"
                        disabled={isSubmitting}
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
                        autoComplete={isLogin ? "current-password" : "new-password"}
                        disabled={isSubmitting}
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
                                autoComplete="off"
                                disabled={isSubmitting}
                            />
                        </>
                    )}

                    <button 
                        type="submit" 
                        className="login-btn"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Please wait...' : (isLogin ? 'Login 🠮' : 'Create Account 🠮')}
                    </button>

                    <div className="divider"><span>or</span></div>

                    <p className="auth-switch">
                        {isLogin ? "Don't have an account? " : "Already have an account? "}
                        <span 
                            className="toggle-link" 
                            onClick={() => {
                                setIsLogin(!isLogin);
                                setMessage("");
                                setMessageType("");
                                resetForm();
                                setIsSubmitting(false);
                            }}
                        >
                            {isLogin ? "Create one now 🠮" : "Login Here 🠮"}
                        </span>
                    </p>
                </form>
            </div>
        </div>
    );
}