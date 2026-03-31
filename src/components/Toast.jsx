import { useEffect } from "react";
import "../styles/Toast.css";

export function Toast({ message, type = "info", duration = 3000, onClose }) {
    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => {
                onClose?.();
            }, duration);
            return () => clearTimeout(timer);
        }
    }, [message, duration, onClose]);

    if (!message) return null;

    return (
        <div className={`toast toast-${type}`}>
            <span className="toast-icon">
                {type === "success" && "✓"}
                {type === "error" && "✕"}
                {type === "info" && "ℹ"}
                {type === "warning" && "⚠"}
            </span>
            <span className="toast-message">{message}</span>
        </div>
    );
}
