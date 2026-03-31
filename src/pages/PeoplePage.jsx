import { useState } from "react";
import { useJournal } from "../hooks";
import { SearchBar } from "../components";
import "../styles/PeoplePage.css";

export function PeoplePage() {
    const { getPeopleFromEntries, entries } = useJournal();
    const [searchTerm, setSearchTerm] = useState("");
    const [expandedPerson, setExpandedPerson] = useState(null);

    const people = getPeopleFromEntries();

    const filteredPeople = searchTerm
        ? people.filter(person =>
            person.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
        : people;

    const getEntryDetails = (entryId) => entries.find(e => e.id === entryId);

    const handlePersonClick = (personName) => {
        setExpandedPerson(expandedPerson === personName ? null : personName);
    };

    return (
        <div className="people-page">
            <div className="people-header">
                <h1>People Tracker</h1>
                <p className="people-count">
                    {people.length} {people.length === 1 ? "person" : "people"} mentioned in your entries
                </p>
            </div>

            <div className="people-search">
                <SearchBar onSearch={setSearchTerm} placeholder="Search people..." />
            </div>

            <div className="people-list">
                {filteredPeople.length === 0 ? (
                    <div className="no-people">
                        <span className="no-people-icon">👥</span>
                        <p>
                            {searchTerm
                                ? `No people found matching "${searchTerm}"`
                                : "No people tracked yet. Mention someone with @name in your journal entries!"}
                        </p>
                    </div>
                ) : (
                    filteredPeople.map(person => (
                        <div key={person.name} className="person-card">
                            <div
                                className="person-card-header"
                                onClick={() => handlePersonClick(person.name)}
                            >
                                <div className="person-info">
                                    <span className="person-avatar">
                                        {person.name.charAt(0).toUpperCase()}
                                    </span>
                                    <div className="person-details">
                                        <h3>{person.name}</h3>
                                        <p>
                                            Mentioned in {person.count} {person.count === 1 ? "entry" : "entries"}
                                        </p>
                                    </div>
                                </div>
                                <span className="expand-icon">
                                    {expandedPerson === person.name ? "▼" : "▶"}
                                </span>
                            </div>

                            {expandedPerson === person.name && (
                                <div className="person-entries">
                                    <h4>Entries mentioning {person.name}:</h4>
                                    <div className="entries-list">
                                        {person.entryIds.map(entryId => {
                                            const entry = getEntryDetails(entryId);
                                            if (!entry) return null;
                                            return (
                                                <div key={entryId} className="entry-reference">
                                                    <span className="entry-date">
                                                        {entry.createdAt
                                                            ? new Date(entry.createdAt).toLocaleDateString("en-US", {
                                                                month: "short",
                                                                day: "numeric",
                                                                year: "numeric"
                                                            })
                                                            : ""}
                                                    </span>
                                                    <p className="entry-title">
                                                        {entry.title || "Untitled Entry"}
                                                    </p>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}