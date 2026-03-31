import { useSearchParams, useNavigate } from "react-router-dom"  // ADD useSearchParams
import { EntryCard } from "../components"
import { useJournal } from "../hooks"
import "../styles/DashboardPage.css"

export function JournalsPage() {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()                      // ADD
    const searchTerm = searchParams.get("search") || ""          // ADD

    const { entries, loading, deleteEntry, searchEntries } = useJournal()
    const filteredEntries = searchTerm ? searchEntries(searchTerm) : entries

    const handleDelete = (id) => deleteEntry(id)

    if (loading) {
        return (
            <div className="dashboard-loading">
                <p>Loading your entries...</p>
            </div>
        )
    }

    return (
        <div className="dashboard-page">
            <div className="dashboard-header">
                <h1>My Journal</h1>
                <button className="new-entry-btn" onClick={() => navigate("/editor")}>
                    + New Entry
                </button>
            </div>

            {/* NO SearchBar here anymore! */}

            <div className="dashboard-content">
                {filteredEntries.length === 0 ? (
                    searchTerm ? (
                        <div className="no-results">
                            <span>🔍</span>
                            <p>No entries match "{searchTerm}"</p>
                        </div>
                    ) : (
                        <div className="no-entries-dashboard">
                            <span>📖</span>
                            <p>No entries yet. Start writing!</p>
                            <button className="first-entry-btn" onClick={() => navigate("/editor")}>
                                Create First Entry
                            </button>
                        </div>
                    )
                ) : (
                    <div className="entries-grid">
                        {filteredEntries.map(entry => (
                            <EntryCard key={entry.id} entry={entry} onDelete={handleDelete} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}