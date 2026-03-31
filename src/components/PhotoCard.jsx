export function PhotoCard({ photo, entryTitle, date, onClick }) {
    const formatDate = (dateString) => {
        if (!dateString) return "";
        return new Date(dateString).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric"
        });
    };

    return (
        <div className="photo-card" onClick={() => onClick?.(photo)}>
            <img src={photo.url} alt={photo.name || "Entry photo"} />
            {entryTitle && (
                <div className="photo-card-info">
                    <p className="photo-card-title">{entryTitle}</p>
                    {date && (
                        <p className="photo-card-date">{formatDate(date)}</p>
                    )}
                </div>
            )}
        </div>
    );
}
