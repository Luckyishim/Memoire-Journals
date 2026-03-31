import { useState } from "react";
import "../styles/Sidebar.css";
import { useNavigate, useLocation } from "react-router-dom";
import { useJournal } from "../hooks";

export function Sidebar() {
    const navigate = useNavigate();
    const location = useLocation();
    const [collapsed, setCollapsed] = useState(false);
    const [searchInput, setSearchInput] = useState("");
    const { entries } = useJournal();                          // ADD

    const recentEntries = entries.slice(0, 4);                 // ADD — latest 4

    return (
        <div className={`sidebar ${collapsed ? "collapsed" : ""}`} style={{ width: collapsed ? "60px" : "18%", transition: "width 0.2s ease" }}>
            <button className="collapse-btn" onClick={() => setCollapsed(c => !c)}>
                {!collapsed && <span className="brand">Memoire</span>}
                <img
                    src="/images/sidebar.png"
                    alt="Toggle sidebar"
                    style={{
                        width: "20px", height: "20px",
                        transform: collapsed ? "rotate(180deg)" : "rotate(0deg)",
                        transition: "transform 0.2s ease"
                    }}
                />
            </button>

            {!collapsed && (
                <div className="filter">
                    <span>🔍</span>
                    <input
                        type="text"
                        placeholder="Search Entries..."
                        value={searchInput}
                        onChange={(e) => {
                            setSearchInput(e.target.value);
                            if (location.pathname === "/journals") {
                                navigate(`/journals?search=${e.target.value}`);
                            }
                        }}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                navigate(`/journals?search=${searchInput}`);
                            }
                        }}
                    />
                </div>
            )}

            <div className="pages">
                <button title="Journal" onClick={() => navigate("/journals")}>
                    <img src="/images/journal.png" alt="Journal" className="btn-icon" />
                    {!collapsed && <span className="btn-label">Journal</span>}
                </button>
                <button title="People" onClick={() => navigate("/people")}>
                    <img src="/images/user.png" alt="People" className="btn-icon" />
                    {!collapsed && <span className="btn-label">People</span>}
                </button>
                <button title="Settings" onClick={() => navigate("/settings")}>
                    <img src="/images/setting.png" alt="Settings" className="btn-icon" />
                    {!collapsed && <span className="btn-label">Settings</span>}
                </button>
            </div>

            {/* Recent entries */}
            {!collapsed && recentEntries.length > 0 && (
                <div className="sidebar-recent">
                    <p className="sidebar-recent-label">Recent</p>
                    {recentEntries.map(entry => (
                        <div
                            key={entry.id}
                            className="sidebar-recent-item"
                            onClick={() => navigate(`/editor?id=${entry.id}`)}
                        >
                            <span className="sidebar-recent-title">
                                {entry.title || "Untitled"}
                            </span>
                            <span className="sidebar-recent-date">
                                {entry.createdAt
                                    ? new Date(entry.createdAt).toLocaleDateString("en-US", {
                                        month: "short", day: "numeric"
                                    })
                                    : ""}
                            </span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}