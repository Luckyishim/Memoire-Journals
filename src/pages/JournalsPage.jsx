import { useSearchParams, useNavigate } from "react-router-dom";
import { EntryCard } from "../components";
import { useJournal } from "../hooks";
import "../styles/JournalPage.css";

export function JournalsPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const searchTerm = searchParams.get("search") || "";

    const { entries, loading, deleteEntry, searchEntries } = useJournal();
    const filteredEntries = searchTerm ? searchEntries(searchTerm) : entries;

    const handleDelete = (id) => deleteEntry(id);

    if (loading) {
        return (
            <div className="journal-loading">
                <p>Loading your entries...</p>
            </div>
        );
    }

    return (
        <div className="journal-page">
            <div className="journal-header">
                <h1>My Journal</h1>
                <button
                    className="journal-new-entry-btn"
                    onClick={() => navigate("/editor")}
                >
                    + New Entry
                </button>
            </div>

            <div className="journal-content">
                {filteredEntries.length === 0 ? (
                    searchTerm ? (
                        <div className="journal-no-results">
                            <span>🔍</span>
                            <p>No entries match "{searchTerm}"</p>
                        </div>
                    ) : (
                        <div className="journal-empty">
                            <span>📖</span>
                            <p>No entries yet. Start writing!</p>
                            <button
                                className="journal-first-entry-btn"
                                onClick={() => navigate("/editor")}
                            >
                                Create First Entry
                            </button>
                        </div>
                    )
                ) : (
                    <div className="journal-grid">
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