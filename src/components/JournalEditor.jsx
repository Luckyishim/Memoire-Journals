import { useState, useRef, useEffect } from "react";
import { useJournal } from "../hooks";

export function JournalEditor({ entryId, onSave, onCancel }) {
    const { addEntry, updateEntry, getEntryById } = useJournal();
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [people, setPeople] = useState([]);
    const [photos, setPhotos] = useState([]);
    const [newPersonName, setNewPersonName] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const [showPeopleInput, setShowPeopleInput] = useState(false);
    const contentRef = useRef(null);

    // Load existing entry if editing
    useEffect(() => {
        if (entryId) {
            const existing = getEntryById(entryId);
            if (existing) {
                setTitle(existing.title || "");
                setContent(existing.content || "");
                setPeople(existing.people || []);
                setPhotos(existing.photos || []);
            }
        }
    }, [entryId, getEntryById]);

    const handleAddPerson = () => {
        if (newPersonName.trim() && !people.find(p => p.name === newPersonName.trim())) {
            setPeople([...people, { name: newPersonName.trim(), id: Date.now() }]);
            setNewPersonName("");
        }
    };

    const handleRemovePerson = (personId) => {
        setPeople(people.filter(p => p.id !== personId));
    };

    const handleAddPhoto = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPhotos([...photos, { url: reader.result, name: file.name, id: Date.now() }]);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemovePhoto = (photoId) => {
        setPhotos(photos.filter(p => p.id !== photoId));
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const entryData = {
                title,
                content,
                people,
                photos,
                mood: null,
                tags: []
            };

            if (entryId) {
                await updateEntry(entryId, entryData);
            } else {
                await addEntry(entryData);
            }

            onSave?.();
        } catch (error) {
            console.error("Error saving entry:", error);
        } finally {
            setIsSaving(false);
        }
    };

    const insertFormatting = (tag) => {
        const textarea = contentRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selectedText = content.substring(start, end);
        const newText = content.substring(0, start) + tag + selectedText + tag + content.substring(end);
        setContent(newText);

        setTimeout(() => {
            textarea.focus();
            textarea.setSelectionRange(start + tag.length, end + tag.length);
        }, 0);
    };

    return (
        <div className="journal-editor">
            <div className="editor-toolbar">
                <button type="button" onClick={() => insertFormatting("**")}>B</button>
                <button type="button" onClick={() => insertFormatting("*")}>I</button>
                <button type="button" onClick={() => insertFormatting("~~")}>S</button>
                <button type="button" onClick={() => insertFormatting("# ")}>H1</button>
                <button type="button" onClick={() => insertFormatting("## ")}>H2</button>
                <button type="button" onClick={() => insertFormatting("- ")}>•</button>
                <button type="button" onClick={() => insertFormatting("> ")}>Quote</button>
                <button type="button" onClick={() => insertFormatting("`")}>Code</button>
            </div>

            <input
                type="text"
                className="editor-title"
                placeholder="Entry Title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            />

            <textarea
                ref={contentRef}
                className="editor-content"
                placeholder="Write your thoughts..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
            />

            <div className="editor-section">
                <div className="section-header">
                    <span>👤 People in this entry</span>
                    <button
                        type="button"
                        className="toggle-btn"
                        onClick={() => setShowPeopleInput(!showPeopleInput)}
                    >
                        {showPeopleInput ? "−" : "+"}
                    </button>
                </div>

                {showPeopleInput && (
                    <div className="people-input">
                        <input
                            type="text"
                            placeholder="Add a person..."
                            value={newPersonName}
                            onChange={(e) => setNewPersonName(e.target.value)}
                            onKeyPress={(e) => e.key === "Enter" && handleAddPerson()}
                        />
                        <button type="button" onClick={handleAddPerson}>Add</button>
                    </div>
                )}

                <div className="people-tags">
                    {people.map(person => (
                        <span key={person.id} className="person-tag">
                            {person.name}
                            <button type="button" onClick={() => handleRemovePerson(person.id)}>×</button>
                        </span>
                    ))}
                </div>
            </div>

            <div className="editor-section">
                <div className="section-header">
                    <span>📷 Photos</span>
                    <label className="upload-btn">
                        Upload Photo
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleAddPhoto}
                            style={{ display: "none" }}
                        />
                    </label>
                </div>

                <div className="photos-grid">
                    {photos.map(photo => (
                        <div key={photo.id} className="photo-item">
                            <img src={photo.url} alt={photo.name} />
                            <button
                                type="button"
                                className="remove-photo"
                                onClick={() => handleRemovePhoto(photo.id)}
                            >
                                ×
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            <div className="editor-actions">
                <button
                    type="button"
                    className="cancel-btn"
                    onClick={onCancel}
                    disabled={isSaving}
                >
                    Cancel
                </button>
                <button
                    type="button"
                    className="save-btn"
                    onClick={handleSave}
                    disabled={isSaving || (!title.trim() && !content.trim())}
                >
                    {isSaving ? "Saving..." : entryId ? "Update Entry" : "Save Entry"}
                </button>
            </div>
        </div>
    );
}
