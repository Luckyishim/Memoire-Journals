import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks";
import { useJournal } from "../hooks";
import "../styles/DashboardPage.css";
import { useState } from "react";

export function DashboardPage() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { entries, loading } = useJournal();


    const getTimeOfDay = () => {
        const hour = new Date().getHours();
        if (hour < 12) return "morning";
        if (hour < 17) return "afternoon";
        return "evening";
    };

    const suggestions = [
        "What made you smile today?",
        "What are you grateful for?",
        "What's been on your mind lately?",
        "Describe your mood in three words.",
        "What did you learn today?",
        "Who did you spend time with today?",
        "What's something you're looking forward to?",
        "What challenged you today?",
    ];
    const [randomSuggestion] = useState(
        () => suggestions[Math.floor(Math.random() * suggestions.length)]
    );

    return (
        <div className="dashboard-page">


            <div className="dashboard-welcome">
                <h1>Good {getTimeOfDay()}, {user?.displayName || "there"} ✦</h1>
                <p>What's on your mind today?</p>
            </div>

            <div className="dashboard-prompt">
                <p className="prompt-label">Today's prompt</p>
                <p className="prompt-text">"{randomSuggestion}"</p>
                <button
                    className="new-entry-btn"
                    onClick={() => navigate("/editor")}
                >
                    + Start Writing
                </button>
            </div>

            {!loading && (
                <div className="dashboard-stats">
                    <div className="stat-card">
                        <span className="stat-number">{entries.length}</span>
                        <span className="stat-label">Total Entries</span>
                    </div>
                    <div className="stat-card">
                        <span className="stat-number">
                            {entries.filter(e => {
                                const date = new Date(e.createdAt);
                                const now = new Date();
                                return date.getMonth() === now.getMonth() &&
                                    date.getFullYear() === now.getFullYear();
                            }).length}
                        </span>
                        <span className="stat-label">This Month</span>
                    </div>
                    <div className="stat-card">
                        <span className="stat-number">
                            {entries.filter(e => {
                                const date = new Date(e.createdAt);
                                const now = new Date();
                                return date.toDateString() === now.toDateString();
                            }).length}
                        </span>
                        <span className="stat-label">Today</span>
                    </div>
                </div>
            )}

        </div>
    );
}