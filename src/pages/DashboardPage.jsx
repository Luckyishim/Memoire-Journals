import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { EntryCard, SearchBar } from "../components";
import { useJournal } from "../hooks";
import "../styles/DashboardPage.css";

export function DashboardPage() {
    const navigate = useNavigate();
    const { entries, loading, deleteEntry, searchEntries } = useJournal();
    const [searchTerm, setSearchTerm] = useState("");

    const handleSearch = (term) => {
        setSearchTerm(term);
    };

    const filteredEntries = searchTerm ? searchEntries(searchTerm) : entries;

    const handleDelete = (id) => {
        deleteEntry(id);
    };

    if (loading) {
        return (
            <div className="dashboard-loading">
                <div className="spinner-large"></div>
                <p>Loading your entries...</p>
            </div>
        );
    }

    return (
        <div className="dashboard-page">
            <div className="dashboard-header">
                <h1>Your Journal</h1>
                <button
                    className="new-entry-btn"
                    onClick={() => navigate("/editor")}
                >
                    + New Entry
                </button>
            </div>

            <div className="dashboard-search">
                <SearchBar
                    onSearch={handleSearch}
                    placeholder="Search by title, content, or people..."
                />
            </div>

            <div className="dashboard-content">
                {filteredEntries.length === 0 ? (
                    searchTerm ? (
                        <div className="no-results">
                            <span className="no-results-icon">🔍</span>
                            <p>No entries match your search for "{searchTerm}"</p>
                        </div>
                    ) : (
                        <div className="no-entries-dashboard">
                            <span className="no-entries-icon">📖</span>
                            <p>Your journal is empty. Start writing your story!</p>
                            <button
                                className="first-entry-btn"
                                onClick={() => navigate("/editor")}
                            >
                                Create First Entry
                            </button>
                        </div>
                    )
                ) : (
                    <div className="entries-grid">
                        {filteredEntries.map(entry => (
                            <EntryCard
                                key={entry.id}
                                entry={entry}
                                onDelete={handleDelete}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
