// EditorPage.jsx - Simplified version
import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { JournalEditor } from "../components/JournalEditor";
import { useJournal } from "../hooks";
import "../styles/EditorPage.css";

export function EditorPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const entryId = searchParams.get("id");
    const { deleteEntry, loading } = useJournal();
    const [isDeleting, setIsDeleting] = useState(false);

    const handleSave = () => {
        navigate("/dashboard");
    };

    const handleCancel = () => {
        navigate("/dashboard");
    };

    const handleDelete = async (id) => {
        if (isDeleting) return;

        const confirmDelete = window.confirm("Are you sure you want to delete this entry? This action cannot be undone.");
        if (!confirmDelete) return;
        
        try {
            setIsDeleting(true);
            await deleteEntry(id);
            navigate("/dashboard");
        } catch (error) {
            console.error("Error deleting entry:", error);
            alert("Failed to delete entry. Please try again.");
        } finally {
            setIsDeleting(false);
        }
    };

    if (loading) {
        return (
            <div className="editor-page">
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="editor-page-wrapper">
            <button className="back-btn" onClick={() => navigate("/dashboard")}>
                 Back to Dashboard
            </button>
            <JournalEditor
                entryId={entryId}
                onSave={handleSave}
                onCancel={handleCancel}
                onDelete={handleDelete}
            />
        </div>
    );
}