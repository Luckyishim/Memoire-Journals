import { useState, useRef, useEffect } from "react";
import "../styles/Navbar.css";
import ThemeToggle from "./ThemeToggle";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_URL = "https://69ac57f99ca639a5217ec105.mockapi.io/api/Memoire-Users";

function getGreeting() {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
}

export function Navbar() {
    const greeting = getGreeting();
    const navigate = useNavigate();
    const [user, setUser] = useState(JSON.parse(localStorage.getItem("memoire_user")));
    const username = user?.username || "there";

    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [showPasswordFields, setShowPasswordFields] = useState(false);
    const [formData, setFormData] = useState({
        username: user?.username || "",
        email: user?.email || "",
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });
    const [message, setMessage] = useState("");
    const dropdownRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(e) {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setDropdownOpen(false);
                setMessage("");
                setShowPasswordFields(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
        if (showPasswordFields) {
            if (formData.currentPassword !== user.password) {
                setMessage("❌ Current password is incorrect.");
                return;
            }
            if (formData.newPassword !== formData.confirmPassword) {
                setMessage("❌ New passwords don't match.");
                return;
            }
        }

        try {
            const updatedUser = {
                username: formData.username,
                email: formData.email,
                password: showPasswordFields && formData.newPassword ? formData.newPassword : user.password,
            };

            const response = await axios.put(`${API_URL}/${user.id}`, updatedUser);
            const saved = response.data;

            localStorage.setItem("memoire_user", JSON.stringify(saved));
            setUser(saved);
            setMessage("✅ Account updated!");
            setFormData({ ...formData, currentPassword: "", newPassword: "", confirmPassword: "" });
            setShowPasswordFields(false);
        } catch (err) {
            console.error(err);
            setMessage("❌ Something went wrong.");
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("memoire_user");
        navigate("/");
    };

    return (
        <nav className="navbar">
            <div className="logo">Memoire</div>
            <div className="greeting">
                <span className="cursor typewriter-animation">
                    {greeting}, {username}
                </span>
            </div>
            <div className="nav-right">
                <span className="moon"><ThemeToggle /></span>

                <div className="avatar-wrapper" ref={dropdownRef}>
                    <div className="avatar" onClick={() => setDropdownOpen(!dropdownOpen)}>
                        {username[0].toUpperCase()}
                    </div>

                    {dropdownOpen && (
                        <div className="account-dropdown">
                            <h3>Edit Account</h3>

                            <label>Username</label>
                            <input name="username" value={formData.username} onChange={handleChange} />

                            <label>Email</label>
                            <input name="email" type="email" value={formData.email} onChange={handleChange} />

                            <hr />

                            {/* Toggle password section */}
                            <div
                                className="password-toggle"
                                onClick={() => {
                                    setShowPasswordFields(!showPasswordFields);
                                    setMessage("");
                                }}
                            >
                                <span>{showPasswordFields ? "▲" : "▼"} Change Password</span>
                            </div>

                            {showPasswordFields && (
                                <>
                                    <label>Current Password</label>
                                    <input name="currentPassword" type="password" value={formData.currentPassword} onChange={handleChange} placeholder="Current password" />

                                    <label>New Password</label>
                                    <input name="newPassword" type="password" value={formData.newPassword} onChange={handleChange} placeholder="New password" />

                                    <label>Confirm New Password</label>
                                    <input name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange} placeholder="Confirm new password" />
                                </>
                            )}

                            {message && <p className="dropdown-message">{message}</p>}

                            <button className="save-btn" onClick={handleSave}>Save Changes</button>

                            <hr />

                            <button className="logout-btn" onClick={handleLogout}>Logout</button>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}