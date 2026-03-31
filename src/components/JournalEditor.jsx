import { useState, useRef, useEffect } from "react";
import { useJournal } from "../hooks";
import "../styles/JournalEditor.css";

export function JournalEditor({ entryId, onSave, onCancel, onDelete }) {
    const { addEntry, updateEntry, getEntryById } = useJournal();
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const contentRef = useRef(null);

    useEffect(() => {
        if (entryId) {
            const existing = getEntryById(entryId);
            if (existing) {
                setTitle(existing.title || "");
                setContent(existing.content || "");
            }
        }
    }, [entryId, getEntryById]);

    const handleSave = async () => {
        if (!title.trim() && !content.trim()) {
            alert("Please add a title or some content before saving.");
            return;
        }

        setIsSaving(true);
        try {
            const entryData = {
                title: title.trim() || "Untitled",
                content: content.trim() || ""
            };

            if (entryId) {
                await updateEntry(entryId, entryData);
            } else {
                await addEntry(entryData);
            }

            onSave?.();
        } catch (error) {
            console.error("Error saving entry:", error);
            alert("Failed to save entry. Please try again.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = () => {
        if (entryId && onDelete) {
            onDelete(entryId);
        }
    };

    const insertFormatting = (tag, closingTag = null) => {
        const textarea = contentRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selectedText = content.substring(start, end);

        let newText;
        let cursorOffset;

        if (tag === "# " || tag === "## " || tag === "- " || tag === "> ") {
            const lineStart = content.lastIndexOf("\n", start - 1) + 1;
            const currentLine = content.substring(lineStart, end);
            newText = content.substring(0, lineStart) + tag + currentLine + content.substring(end);
            cursorOffset = tag.length;
        } else {
            const actualClosingTag = closingTag || tag;
            newText = content.substring(0, start) + tag + selectedText + actualClosingTag + content.substring(end);
            cursorOffset = tag.length;
        }

        setContent(newText);

        setTimeout(() => {
            textarea.focus();
            if (selectedText) {
                textarea.setSelectionRange(start + tag.length, end + tag.length);
            } else {
                textarea.setSelectionRange(start + cursorOffset, start + cursorOffset);
            }
        }, 0);
    };

    return (
        <div className="journal-editor">
            <div className="editor-toolbar">
                <button type="button" onClick={() => insertFormatting("**", "**")} title="Bold">B</button>
                <button type="button" onClick={() => insertFormatting("*", "*")} title="Italic">I</button>
                <button type="button" onClick={() => insertFormatting("~~", "~~")} title="Strikethrough">S</button>
                <button type="button" onClick={() => insertFormatting("# ")} title="Heading 1">H1</button>
                <button type="button" onClick={() => insertFormatting("## ")} title="Heading 2">H2</button>
                <button type="button" onClick={() => insertFormatting("- ")} title="Bullet List">•</button>
                <button type="button" onClick={() => insertFormatting("> ")} title="Quote">Quote</button>
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
                placeholder="Write your thoughts... (Markdown supported)"
                value={content}
                onChange={(e) => setContent(e.target.value)}
            />

            <div className="editor-actions">
                {entryId && (
                    <button
                        type="button"
                        className="delete-btn"
                        onClick={handleDelete}
                        disabled={isSaving}
                    >
                        Delete Entry
                    </button>
                )}
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