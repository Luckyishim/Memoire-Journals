import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks";
import { useJournal } from "../hooks";
import "../styles/DashboardPage.css";
import { useState } from "react";

export function DashboardPage() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { entries, loading } = useJournal();


    const suggestions = [
        "What made you smile today?",
        "What are you grateful for?",
        "What's been on your mind lately?",
        "Describe your mood in three words.",
        "What did you learn today?",
        "Who did you spend time with today?",
        "What's something you're looking forward to?",
        "What challenged you today?",
        "How did you practice self-care today?",
        "What inspired you recently?",
        "What's a goal you're working towards?",
        "Describe a moment that made you feel alive.",
        "What’s a small victory you had today?",
        "Who or what motivated you today?",
        "What emotions did you experience most today?",
        "How did you handle stress or difficulty?",
        "What’s a memory that brings you peace?",
        "What’s one thing you’d like to improve about yourself?",
        "What surprised you today?",
        "How did you express creativity today?"
    ];
    const [randomSuggestion] = useState(
        () => suggestions[Math.floor(Math.random() * suggestions.length)]
    );

    return (
        <div className="dashboard-page">


            <div className="dashboard-welcome">
                <h1> {user?.displayName || "there"} ✦</h1>
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
                    <div className="stat-card"
                    onClick={()=>{
                        navigate("/journals")
                    }}
                    >
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