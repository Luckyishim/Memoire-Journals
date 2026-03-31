import { useState } from "react";

export function SearchBar({ onSearch, placeholder = "Search entries..." }) {
    const [searchTerm, setSearchTerm] = useState("");

    const handleChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        onSearch?.(value);
    };

    const handleClear = () => {
        setSearchTerm("");
        onSearch?.("");
    };

    return (
        <div className="search-bar">
            <span className="search-icon">🔍</span>
            <input
                type="text"
                className="search-input"
                placeholder={placeholder}
                value={searchTerm}
                onChange={handleChange}
            />
            {searchTerm && (
                <button className="clear-btn" onClick={handleClear}>
                    ×
                </button>
            )}
        </div>
    );
}
