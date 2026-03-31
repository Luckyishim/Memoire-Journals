import { useNavigate } from "react-router-dom";
import "../styles/Navbar.css"
import { ThemeToggle } from "./ThemeToggle";
import { useEffect, useRef, useState } from "react";
import { useAuth, useTheme } from "../hooks";
import {
    updateProfile,
    updateEmail,
    updatePassword,
    reauthenticateWithCredential,
    EmailAuthProvider,
} from "firebase/auth";

function getGreeting() {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
}

export function Navbar() {
    const greeting = getGreeting();
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const { darkMode } = useTheme();

    const logoImg = darkMode ? "/images/dark-logo.png" : "/images/logo.png";

    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [showPasswordFields, setShowPasswordFields] = useState(false);
    const [formData, setFormData] = useState({
        username: user?.displayName || "",
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
        try {
            const credential = EmailAuthProvider.credential(
                user.email,
                formData.currentPassword
            );
            await reauthenticateWithCredential(user, credential);
        } catch (err) {
            console.log(err);
            setMessage("Current password is incorrect! ❌");
            return;
        }

        if (showPasswordFields) {
            if (formData.newPassword !== formData.confirmPassword) {
                setMessage("New passwords don't match! ❌");
                return;
            }
        }

        try {
            if (formData.username !== user.displayName) {
                await updateProfile(user, { displayName: formData.username });
            }
            if (formData.email !== user.email) {
                await updateEmail(user, formData.email);
            }
            if (showPasswordFields && formData.newPassword) {
                await updatePassword(user, formData.newPassword);
            }

            setMessage("Account has been updated! 🎉");
            setFormData(prev => ({
                ...prev,
                currentPassword: "",
                newPassword: "",
                confirmPassword: ""
            }));
            setShowPasswordFields(false);
        } catch (err) {
            console.error(err);
            if (err.code === 'auth/email-already-in-use') {
                setMessage("Email already in use! ❌");
            } else if (err.code === 'auth/weak-password') {
                setMessage("New password must be at least 6 characters! ❌");
            } else {
                setMessage("Something went wrong...");
            }
        }
    };

    const handleLogout = async () => {
        await logout();
        navigate("/");
    };

    const username = user?.displayName || user?.email || "there";

    return (
        <nav className="navbar">
            <div className="logo">
                <img src={logoImg}
                    alt="logo"
                    onClick={() => navigate("/dashboard")}
                    width="140"
                    height="46" />
            </div>
            <div className="greeting">
                <span className="cursor typewriter-animation">
                    {greeting}, {username}
                </span>
            </div>
            <div className="nav-right">
                <span className="moon"> <ThemeToggle /> </span>
                <div className="avatar" onClick={() => setDropdownOpen(!dropdownOpen)}>
                    {username[0].toUpperCase()}
                </div>
            </div>

            {dropdownOpen && (
                <div className="acc-dropdown" ref={dropdownRef}>
                    <h3>Edit Account</h3>
                    <label>Username</label>
                    <input name="username" value={formData.username} onChange={handleChange} />
                    <label>Email</label>
                    <input name="email" value={formData.email} onChange={handleChange} />
                    <hr />
                    <div className="pass-toggle" onClick={() => { setShowPasswordFields(!showPasswordFields); setMessage(""); }}>
                        <span>{showPasswordFields ? "▲" : "▼"} Change Password</span>
                    </div>
                    {showPasswordFields && (
                        <>
                            <label>New Password</label>
                            <input name="newPassword" type="password" value={formData.newPassword} onChange={handleChange} placeholder="New Password" />
                            <label>Confirm New Password</label>
                            <input name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange} placeholder="Confirm Password" />
                        </>
                    )}
                    <hr />
                    <label>Current Password (required to save)</label>
                    <input name="currentPassword" type="password" value={formData.currentPassword} onChange={handleChange} placeholder="Enter current password" />
                    {message && <p className="dropdown-msg">{message}</p>}
                    <button className="save-btn" onClick={handleSave}>Save Changes</button>
                    <hr />
                    <button className="logout-btn" onClick={handleLogout}>Logout</button>
                </div>
            )}
        </nav>
    );
}