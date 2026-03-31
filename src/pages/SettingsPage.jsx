import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
    getAuth,
    EmailAuthProvider, 
    reauthenticateWithCredential,
    deleteUser
} from "firebase/auth";
import { useAuth } from "../hooks";
import "../styles/SettingsPage.css";

export function SettingsPage() {
    const navigate = useNavigate();
    const { user, logout, updateUserProfile, updateUserEmail, updateUserPassword } = useAuth();
    const auth = getAuth();

    const [formData, setFormData] = useState({
        displayName: user?.displayName || "",
        email: user?.email || "",
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });

    const [message, setMessage] = useState({ type: "", text: "" });
    const [showPasswordSection, setShowPasswordSection] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const showMsg = (type, text) => {
        setMessage({ type, text });
        setTimeout(() => setMessage({ type: "", text: "" }), 5000);
    };

    const handleUpdateProfile = async () => {
        setIsSubmitting(true);
        try {
            if (formData.displayName !== user?.displayName) {
                await updateUserProfile(formData.displayName);
            }
            if (formData.email !== user?.email) {
                if (!formData.currentPassword) {
                    showMsg("error", "Please enter your current password to change email.");
                    setIsSubmitting(false);
                    return;
                }
                await updateUserEmail(formData.email, formData.currentPassword);
            }
            showMsg("success", "Profile updated successfully! ✓");
        } catch (error) {
            console.error("Profile update error:", error);
            if (error.code === "auth/email-already-in-use") {
                showMsg("error", "Email already in use!");
            } else if (error.code === "auth/invalid-email") {
                showMsg("error", "Invalid email address!");
            } else if (error.code === "auth/requires-recent-login") {
                showMsg("error", "Please log out and log in again to update your email.");
            } else if (error.code === "auth/wrong-password") {
                showMsg("error", "Current password is incorrect!");
            } else {
                showMsg("error", error.message || "Failed to update profile.");
            }
        } finally {
            setIsSubmitting(false);
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

        setIsSubmitting(true);
        try {
            await updateUserPassword(formData.currentPassword, formData.newPassword);
            showMsg("success", "Password updated successfully! ✓");
            setFormData(prev => ({ ...prev, currentPassword: "", newPassword: "", confirmPassword: "" }));
            setShowPasswordSection(false);
        } catch (error) {
            console.error("Password update error:", error);
            if (error.code === "auth/wrong-password" || error.code === "auth/invalid-credential") {
                showMsg("error", "Current password is incorrect!");
            } else if (error.code === "auth/requires-recent-login") {
                showMsg("error", "Please log out and log in again to update your password.");
            } else {
                showMsg("error", error.message || "Failed to update password.");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleLogout = async () => {
        try {
            await logout();
            navigate("/");
        } catch (error) {
            console.error("Logout error:", error);
            showMsg("error", "Failed to logout. Please try again.");
        }
    };

    const handleDeleteAccount = async () => {
        console.log("=== DELETE ACCOUNT DEBUG START ===");
        console.log("1. User object:", user);
        console.log("2. User email:", user?.email);
        console.log("3. Current password entered:", formData.currentPassword ? "Yes" : "No");
        
        if (!window.confirm("⚠️ Are you absolutely sure you want to delete your account? This action is permanent and cannot be undone. All your journals and data will be lost forever.")) {
            console.log("4. User cancelled deletion");
            return;
        }

        if (!formData.currentPassword) {
            console.log("5. No password provided");
            showMsg("error", "Please enter your current password to delete your account.");
            return;
        }

        try {
            setIsSubmitting(true);
            
            // Method 1: Try using the current user from context
            console.log("6. Attempting deletion with user from context...");
            
            // Get the current user from Firebase auth directly
            const currentUser = auth.currentUser;
            console.log("7. Current user from auth.currentUser:", currentUser);
            console.log("8. Current user email:", currentUser?.email);
            
            if (!currentUser) {
                console.log("9. No current user found in Firebase");
                showMsg("error", "No user found. Please log in again.");
                setIsSubmitting(false);
                return;
            }
            
            // Create credential
            console.log("10. Creating credential with email:", currentUser.email);
            const credential = EmailAuthProvider.credential(
                currentUser.email,
                formData.currentPassword
            );
            
            // Reauthenticate
            console.log("11. Attempting reauthentication...");
            const userCredential = await reauthenticateWithCredential(currentUser, credential);
            console.log("12. Reauthentication successful!");
            console.log("13. User credential:", userCredential.user.email);
            
            // Delete the account
            console.log("14. Attempting to delete user...");
            await deleteUser(userCredential.user);
            console.log("15. User deleted successfully from Firebase!");
            
            // Logout
            console.log("16. Logging out...");
            await logout();
            console.log("17. Logged out successfully");
            
            // Clear form
            setFormData({
                displayName: "",
                email: "",
                currentPassword: "",
                newPassword: "",
                confirmPassword: ""
            });
            
            showMsg("success", "✅ Your account has been permanently deleted. Goodbye!");
            console.log("18. Account deletion complete!");
            
            // Redirect after delay
            setTimeout(() => {
                console.log("19. Redirecting to home page...");
                navigate("/", { replace: true });
            }, 2000);
            
        } catch (error) {
            console.error("=== DELETE ACCOUNT ERROR ===");
            console.error("Error code:", error.code);
            console.error("Error message:", error.message);
            console.error("Full error object:", error);
            
            // Handle specific Firebase error codes
            switch (error.code) {
                case 'auth/wrong-password':
                    showMsg("error", "❌ Current password is incorrect!");
                    break;
                case 'auth/invalid-credential':
                    showMsg("error", "❌ Invalid credentials. Please check your password.");
                    break;
                case 'auth/requires-recent-login':
                    showMsg("error", "🔒 For security reasons, please log out and log in again before deleting your account.");
                    break;
                case 'auth/too-many-requests':
                    showMsg("error", "⏰ Too many failed attempts. Please try again later.");
                    break;
                case 'auth/user-not-found':
                    showMsg("error", "👤 User not found. Please log in again.");
                    break;
                case 'auth/network-request-failed':
                    showMsg("error", "🌐 Network error. Please check your connection and try again.");
                    break;
                default:
                    showMsg("error", `❌ Failed to delete account: ${error.message || "Please try again."}`);
            }
        } finally {
            setIsSubmitting(false);
            console.log("=== DELETE ACCOUNT DEBUG END ===");
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
                    <input 
                        type="text" 
                        id="displayName" 
                        name="displayName" 
                        value={formData.displayName} 
                        onChange={handleChange}
                        disabled={isSubmitting}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input 
                        type="email" 
                        id="email" 
                        name="email" 
                        value={formData.email} 
                        onChange={handleChange}
                        disabled={isSubmitting}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="currentPassword">Current Password (required for email change)</label>
                    <input 
                        type="password" 
                        id="currentPassword" 
                        name="currentPassword" 
                        value={formData.currentPassword} 
                        onChange={handleChange}
                        placeholder="Enter current password"
                        disabled={isSubmitting}
                    />
                </div>
                <button 
                    className="save-btn" 
                    onClick={handleUpdateProfile}
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'Saving...' : 'Save Profile Changes'}
                </button>
            </div>

            <div className="settings-section">
                <h2>Security</h2>
                {!showPasswordSection ? (
                    <button 
                        className="toggle-btn" 
                        onClick={() => setShowPasswordSection(true)}
                        disabled={isSubmitting}
                    >
                        Change Password
                    </button>
                ) : (
                    <div className="password-form">
                        <div className="form-group">
                            <label htmlFor="currentPassword">Current Password</label>
                            <input 
                                type="password" 
                                id="currentPassword" 
                                name="currentPassword" 
                                value={formData.currentPassword} 
                                onChange={handleChange} 
                                placeholder="Enter current password"
                                disabled={isSubmitting}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="newPassword">New Password</label>
                            <input 
                                type="password" 
                                id="newPassword" 
                                name="newPassword" 
                                value={formData.newPassword} 
                                onChange={handleChange} 
                                placeholder="New password (min. 6 characters)"
                                disabled={isSubmitting}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="confirmPassword">Confirm New Password</label>
                            <input 
                                type="password" 
                                id="confirmPassword" 
                                name="confirmPassword" 
                                value={formData.confirmPassword} 
                                onChange={handleChange} 
                                placeholder="Confirm new password"
                                disabled={isSubmitting}
                            />
                        </div>
                        <div className="button-group">
                            <button 
                                className="cancel-btn" 
                                onClick={() => {
                                    setShowPasswordSection(false);
                                    setFormData(prev => ({ 
                                        ...prev, 
                                        currentPassword: "", 
                                        newPassword: "", 
                                        confirmPassword: "" 
                                    }));
                                }}
                                disabled={isSubmitting}
                            >
                                Cancel
                            </button>
                            <button 
                                className="save-btn" 
                                onClick={handleUpdatePassword}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Updating...' : 'Update Password'}
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <div className="settings-section danger-zone">
                <h2>Danger Zone</h2>
                <p className="danger-warning">
                    ⚠️ These actions are irreversible. Please proceed with caution.
                </p>
                <div className="danger-actions">
                    <button 
                        className="logout-btn" 
                        onClick={handleLogout}
                        disabled={isSubmitting}
                    >
                        🚪 Logout
                    </button>
                    <button 
                        className="delete-btn" 
                        onClick={handleDeleteAccount}
                        disabled={isSubmitting}
                    >
                        🗑️ Delete Account
                    </button>
                </div>
                <div className="form-group" style={{ marginTop: "1rem" }}>
                    <label htmlFor="deletePassword">
                        Enter your password to delete account:
                    </label>
                    <input 
                        type="password" 
                        id="deletePassword" 
                        name="currentPassword" 
                        value={formData.currentPassword} 
                        onChange={handleChange} 
                        placeholder="Current password required for deletion"
                        disabled={isSubmitting}
                    />
                </div>
            </div>
        </div>
    );
}