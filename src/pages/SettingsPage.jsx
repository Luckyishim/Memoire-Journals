import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    updateProfile,
    updateEmail,
    updatePassword,
    reauthenticateWithCredential,
    EmailAuthProvider
} from "firebase/auth";
import { useAuth } from "../hooks";
import "../styles/SettingsPage.css";

export function SettingsPage() {
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const [formData, setFormData] = useState({
        displayName: user?.displayName || "",
        email: user?.email || "",
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });

    const [message, setMessage] = useState({ type: "", text: "" });
    const [showPasswordSection, setShowPasswordSection] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const showMsg = (type, text) => {
        setMessage({ type, text });
        setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    };

    const handleUpdateProfile = async () => {
        try {
            if (formData.displayName !== user?.displayName) {
                await updateProfile(user, { displayName: formData.displayName });
            }
            if (formData.email !== user?.email) {
                await updateEmail(user, formData.email);
            }
            showMsg("success", "Profile updated successfully! ✓");
        } catch (error) {
            if (error.code === "auth/email-already-in-use") {
                showMsg("error", "Email already in use!");
            } else if (error.code === "auth/invalid-email") {
                showMsg("error", "Invalid email address!");
            } else {
                showMsg("error", "Failed to update profile.");
            }
        }
    };

    const handleUpdatePassword = async () => {
        if (!formData.currentPassword) {
            showMsg("error", "Please enter your current password.");
            return;
        }
        if (formData.newPassword !== formData.confirmPassword) {
            showMsg("error", "New passwords don't match!");
            return;
        }
        if (formData.newPassword.length < 6) {
            showMsg("error", "Password must be at least 6 characters.");
            return;
        }
        try {
            const credential = EmailAuthProvider.credential(user.email, formData.currentPassword);
            await reauthenticateWithCredential(user, credential);
            await updatePassword(user, formData.newPassword);
            showMsg("success", "Password updated successfully! ✓");
            setFormData(prev => ({ ...prev, currentPassword: "", newPassword: "", confirmPassword: "" }));
            setShowPasswordSection(false);
        } catch (error) {
            if (error.code === "auth/wrong-password" || error.code === "auth/invalid-credential") {
                showMsg("error", "Current password is incorrect!");
            } else {
                showMsg("error", "Failed to update password.");
            }
        }
    };

    const handleLogout = async () => {
        await logout();
        navigate("/");
    };

    const handleDeleteAccount = async () => {
        if (!window.confirm("Are you sure you want to delete your account? This cannot be undone.")) return;
        try {
            const credential = EmailAuthProvider.credential(user.email, formData.currentPassword);
            await reauthenticateWithCredential(user, credential);
            await user.delete();
            navigate("/");
        } catch  {
            showMsg("error", "Failed to delete account. Please verify your password.");
        }
    };

    return (
        <div className="settings-page">
            <h1>Settings</h1>

            {message.text && (
                <div className={`settings-message ${message.type}`}>
                    {message.text}
                </div>
            )}

            <div className="settings-section">
                <h2>Profile Settings</h2>
                <div className="form-group">
                    <label htmlFor="displayName">Display Name</label>
                    <input type="text" id="displayName" name="displayName" value={formData.displayName} onChange={handleChange} />
                </div>
                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} />
                </div>
                <button className="save-btn" onClick={handleUpdateProfile}>Save Profile Changes</button>
            </div>

            <div className="settings-section">
                <h2>Security</h2>
                {!showPasswordSection ? (
                    <button className="toggle-btn" onClick={() => setShowPasswordSection(true)}>
                        Change Password
                    </button>
                ) : (
                    <div className="password-form">
                        <div className="form-group">
                            <label htmlFor="currentPassword">Current Password</label>
                            <input type="password" id="currentPassword" name="currentPassword" value={formData.currentPassword} onChange={handleChange} placeholder="Enter current password" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="newPassword">New Password</label>
                            <input type="password" id="newPassword" name="newPassword" value={formData.newPassword} onChange={handleChange} placeholder="New password" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="confirmPassword">Confirm New Password</label>
                            <input type="password" id="confirmPassword" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="Confirm new password" />
                        </div>
                        <div className="button-group">
                            <button className="cancel-btn" onClick={() => {
                                setShowPasswordSection(false);
                                setFormData(prev => ({ ...prev, currentPassword: "", newPassword: "", confirmPassword: "" }));
                            }}>Cancel</button>
                            <button className="save-btn" onClick={handleUpdatePassword}>Update Password</button>
                        </div>
                    </div>
                )}
            </div>

            <div className="settings-section danger-zone">
                <h2>Danger Zone</h2>
                <p className="danger-warning">These actions are irreversible. Please proceed with caution.</p>
                <div className="danger-actions">
                    <button className="logout-btn" onClick={handleLogout}>🚪 Logout</button>
                    <button className="delete-btn" onClick={handleDeleteAccount}>🗑️ Delete Account</button>
                </div>
            </div>
        </div>
    );
}