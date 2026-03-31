import { useState } from "react";
import "../styles/Sidebar.css";
import "../styles/SearchBar.css"
import { useNavigate, useLocation } from "react-router-dom";
import { useJournal, useTheme } from "../hooks";
import {SearchBar} from "../components"

export function Sidebar() {
    const navigate = useNavigate();
    const location = useLocation();
    const { darkMode } = useTheme();
    const [collapsed, setCollapsed] = useState(false);
    const [ setSearchInput] = useState("");
    const { entries } = useJournal();

    const recentEntries = entries.slice(0, 4);

    const sidebarImg = darkMode ? "/images/dark-sidebar.png" : "/images/sidebar.png";
    const journalImg = darkMode ? "/images/dark-journal.png" : "/images/journal.png";
    const userImg = darkMode ? "/images/dark-user.png" : "/images/user.png";
    const settingImg = darkMode ? "/images/dark-setting.png" : "/images/setting.png";
    const brandImg = darkMode ? "./images/dark-brand.png" : "./images/brand.png";

    return (
        <div className={`sidebar ${collapsed ? "collapsed" : ""}`} style={{ width: collapsed ? "60px" : "18%", transition: "width 0.2s ease" }}>
            <button className="collapse-btn" onClick={() => setCollapsed(c => !c)}>
                {!collapsed && <span className="brand">
                    <img src={brandImg} alt="Brand" className="brand-icon" /></span>}
                <img
                    src={sidebarImg}
                    alt="Toggle sidebar"
                    style={{
                        width: "25px", height: "25px",
                        transform: collapsed ? "rotate(180deg)" : "rotate(0deg)",
                        transition: "transform 0.2s ease"
                    }}
                />
            </button>

            {!collapsed && (
                <SearchBar
                    placeholder="Search Entries..."
                    onSearch={(value) => {
                 
                        setSearchInput(value);
                        if (location.pathname === "/journals") {
                            navigate(`/journals?search=${value}`);
                        }
                    }}
                />
            )}

            <div className="pages">
                <button title="Journal" onClick={() => navigate("/journals")}>
                    <img src={journalImg} alt="Journal" className="btn-icon" />
                    {!collapsed && <span className="btn-label">Journal</span>}
                </button>
                <button title="People" onClick={() => navigate("/people")}>
                    <img src={userImg} alt="People" className="btn-icon" />
                    {!collapsed && <span className="btn-label">People</span>}
                </button>
                <button title="Settings" onClick={() => navigate("/settings")}>
                    <img src={settingImg} alt="Settings" className="btn-icon" />
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