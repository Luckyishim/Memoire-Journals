import { useState } from "react";
import { useJournal } from "../hooks";
import { SearchBar } from "../components/SearchBar";
import "../styles/GalleryPage.css";

export function GalleryPage() {
    const { entries } = useJournal();
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedPhoto, setSelectedPhoto] = useState(null);

    // Collect all photos from entries
    const allPhotos = entries
        .filter(entry => entry.photos && entry.photos.length > 0)
        .flatMap(entry =>
            entry.photos.map(photo => ({
                ...photo,
                entryId: entry.id,
                entryTitle: entry.title || "Untitled Entry",
                entryDate: entry.createdAt
            }))
        );

    const filteredPhotos = searchTerm
        ? allPhotos.filter(photo =>
              photo.entryTitle.toLowerCase().includes(searchTerm.toLowerCase())
          )
        : allPhotos;

    const openLightbox = (photo) => {
        setSelectedPhoto(photo);
    };

    const closeLightbox = () => {
        setSelectedPhoto(null);
    };

    return (
        <div className="gallery-page">
            <div className="gallery-header">
                <h1>Photo Gallery</h1>
                <p className="photo-count">
                    {allPhotos.length} {allPhotos.length === 1 ? "photo" : "photos"} from your entries
                </p>
            </div>

            <div className="gallery-search">
                <SearchBar
                    onSearch={setSearchTerm}
                    placeholder="Search by entry title..."
                />
            </div>

            <div className="gallery-grid">
                {filteredPhotos.length === 0 ? (
                    <div className="no-photos">
                        <span className="no-photos-icon">📷</span>
                        <p>
                            {searchTerm
                                ? `No photos found matching "${searchTerm}"`
                                : "No photos yet. Add photos to your journal entries!"}
                        </p>
                    </div>
                ) : (
                    filteredPhotos.map((photo, index) => (
                        <div
                            key={`${photo.id}-${index}`}
                            className="gallery-item"
                            onClick={() => openLightbox(photo)}
                        >
                            <img src={photo.url} alt={photo.name || "Entry photo"} />
                            <div className="gallery-item-overlay">
                                <p className="gallery-entry-title">{photo.entryTitle}</p>
                                <p className="gallery-entry-date">
                                    {new Date(photo.entryDate).toLocaleDateString("en-US", {
                                        month: "short",
                                        day: "numeric",
                                        year: "numeric"
                                    })}
                                </p>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {selectedPhoto && (
                <div className="lightbox" onClick={closeLightbox}>
                    <button className="lightbox-close" onClick={closeLightbox}>
                        ×
                    </button>
                    <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
                        <img src={selectedPhoto.url} alt={selectedPhoto.name || "Entry photo"} />
                        <div className="lightbox-info">
                            <h3>{selectedPhoto.entryTitle}</h3>
                            <p>
                                {new Date(selectedPhoto.entryDate).toLocaleDateString("en-US", {
                                    weekday: "long",
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric"
                                })}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
