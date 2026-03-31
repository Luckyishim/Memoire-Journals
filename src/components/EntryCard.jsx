import { useNavigate } from "react-router-dom";

export function EntryCard({ entry, onDelete }) {
    const navigate = useNavigate();

    const formatDate = (date) => {
        if (!date) return "";
        return new Date(date).toLocaleDateString("en-US", {
            weekday: "short",
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        });
    };

    const getPreview = (content) => {
        if (!content) return "No content...";
        const plainText = content.replace(/<[^>]*>/g, "");
        return plainText.length > 100
            ? plainText.substring(0, 100) + "..."
            : plainText || "No content...";
    };

    const handleDelete = (e) => {
        e.stopPropagation();
        if (window.confirm("Are you sure you want to delete this entry?")) {
            onDelete(entry.id);
        }
    };

    const hasPhotos = entry.photos && entry.photos.length > 0;
    const hasPeople = entry.people && entry.people.length > 0;

    return (
        <div
            className="entry-card"
            onClick={() => navigate(`/editor?id=${entry.id}`)}
        >
            <div className="entry-card-header">
                <h3 className="entry-card-title">
                    {entry.title || "Untitled Entry"}
                </h3>
                <span className="entry-card-date">{formatDate(entry.createdAt)}</span>
            </div>

            <p className="entry-card-preview">{getPreview(entry.content)}</p>

            <div className="entry-card-meta">
                {hasPeople && (
                    <div className="entry-card-people">
                        <span>👤</span>
                        <span>
                            {entry.people.map(p => p.name).join(", ")}
                        </span>
                    </div>
                )}
                {hasPhotos && (
                    <div className="entry-card-photos">
                        <span>📷</span>
                        <span>{entry.photos.length} photo(s)</span>
                    </div>
                )}
            </div>

            <button className="entry-card-delete" onClick={handleDelete}>
                🗑️
            </button>
        </div>
    );
}
