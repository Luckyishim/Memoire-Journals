import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { JournalEditor } from "../components/JournalEditor";
import { useJournal } from "../hooks";
import "../styles/EditorPage.css";

export function EditorPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const entryId = searchParams.get("id");
    const { deleteEntry, entries, loading } = useJournal();
    const [showEditor, setShowEditor] = useState(false);
    const [selectedEntryId, setSelectedEntryId] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        if (entryId) {
            setSelectedEntryId(entryId);
            setShowEditor(true);
        }
    }, [entryId]);

    const handleSave = () => {
        setShowEditor(false);
        setSelectedEntryId(null);
        navigate("/editor", { replace: true });
    };

    const handleCancel = () => {
        setShowEditor(false);
        setSelectedEntryId(null);
        // Clear the URL param when canceling
        navigate("/editor", { replace: true });
    };

    const handleDelete = async (id) => {
        if (isDeleting) return;

        const confirmDelete = window.confirm("Are you sure you want to delete this entry? This action cannot be undone.");
        if (!confirmDelete) return;
        
        try {
            setIsDeleting(true);
            await deleteEntry(id);
    
            if (selectedEntryId === id) {
                setShowEditor(false);
                setSelectedEntryId(null);
                navigate("/editor", { replace: true });
            }
        } catch (error) {
            console.error("Error deleting entry:", error);
            alert("Failed to delete entry. Please try again.");
        } finally {
            setIsDeleting(false);
        }
    };

    const handleNewEntry = () => {
        setSelectedEntryId(null);
        setShowEditor(true);
        navigate("/editor", { replace: true });
    };

    const handleSelectEntry = (id) => {
        setSelectedEntryId(id);
        setShowEditor(true);
        navigate(`/editor?id=${id}`, { replace: true });
    };

    const handleBack = () => {
        setShowEditor(false);
        setSelectedEntryId(null);
        navigate("/editor", { replace: true });
    };

    if (showEditor) {
        return (
            <div className="editor-page-wrapper">
                <button className="back-btn" onClick={handleBack}>
                    ← Back to Entries
                </button>
                <JournalEditor
                    entryId={selectedEntryId}
                    onSave={handleSave}
                    onCancel={handleCancel}
                />
            </div>
        );
    }

    if (loading) {
        return (
            <div className="editor-page">
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Loading your entries...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="editor-page">
            <div className="editor-page-header">
                <h1>Your Journal Entries</h1>
                <button className="new-entry-btn" onClick={handleNewEntry}>
                    + New Entry
                </button>
            </div>

            <div className="entries-list">
                {!entries || entries.length === 0 ? (
                    <div className="no-entries">
                        <span className="no-entries-icon">📖</span>
                        <p>No entries yet. Start writing your first entry!</p>
                        <button className="first-entry-btn" onClick={handleNewEntry}>
                            Create First Entry
                        </button>
                    </div>
                ) : (
                    entries.map(entry => (
                        <div
                            key={entry.id}
                            className="entry-item"
                            onClick={() => handleSelectEntry(entry.id)}
                        >
                            <div className="entry-item-content">
                                <h3>{entry.title || "Untitled Entry"}</h3>
                                <p className="entry-date">
                                    {entry.createdAt ? 
                                        new Date(entry.createdAt).toLocaleDateString("en-US", {
                                            weekday: "long",
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric"
                                        }) : 
                                        "Date unavailable"
                                    }
                                </p>
                                {entry.people && entry.people.length > 0 && (
                                    <div className="entry-people-preview">
                                        👥 {entry.people.map(p => p.name).join(", ")}
                                    </div>
                                )}
                                {entry.tags && entry.tags.length > 0 && (
                                    <div className="entry-tags-preview">
                                        🏷️ {entry.tags.slice(0, 3).join(", ")}
                                        {entry.tags.length > 3 && "..."}
                                    </div>
                                )}
                            </div>
                            <button
                                className="entry-delete-btn"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleDelete(entry.id);
                                }}
                                disabled={isDeleting}
                            >
                                🗑️
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}