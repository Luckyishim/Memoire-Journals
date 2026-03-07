import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
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

    // API data from Mock API
    const API_URL = "https://69ac57f99ca639a5217ec105.mockapi.io/api/Memoire-Users";

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    const resetForm = () => {
        setFormData({ username: '', email: '', password: '', confirmPassword: '' })
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (isLogin) {
            try {
                const response = await axios.get(`${API_URL}?email=${formData.email}`);
                console.log("API response:", response.data); // Add this
                const users = response.data;
                const foundUser = users[0];
                console.log("Found user:", foundUser); // And this

                if (foundUser && foundUser.password === formData.password) {
                    localStorage.setItem("memoire_user", JSON.stringify(foundUser))
                    alert("Welcome back! ✦")
                    navigate('/dashboard')
                } else {
                    alert("Invalid email or password! ❌")
                }
            } catch (error) {
                console.error("Login error:", error);
                alert("Something went wrong during login.");
            }

        } else {
            if (formData.password !== formData.confirmPassword) {
                alert("Passwords don't match! ❌");
                return;
            }

            try {
                const newUser = {
                    username: formData.username,
                    email: formData.email,
                    password: formData.password
                };

                await axios.post(API_URL, newUser)
                alert("Account Created Successfully! 🎉")
                resetForm();
                setIsLogin(true)
            } catch (error) {
                console.error("Registration error:", error);
                alert("Could not create account.");
            }
        }
    };

    return (
        <div className="page">
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