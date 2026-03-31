import { useState } from "react";
import "../styles/Sidebar.css";
import { useNavigate } from "react-router-dom";

export function Sidebar() {
    const navigate = useNavigate();
    const [collapsed, setCollapsed] = useState(false);
    const [searchInput, setSearchInput] = useState("");  // ADD

    return (
        <div className={`sidebar ${collapsed ? "collapsed" : ""}`} style={{ width: collapsed ? "60px" : "18%", transition: "width 0.2s ease" }}>
            <button className="collapse-btn" onClick={() => setCollapsed(c => !c)}>
                {!collapsed && <span className="brand">Memoire</span>}
                <img
                    src="/images/sidebar.png"
                    alt="Toggle sidebar"
                    style={{
                        width: "20px",
                        height: "20px",
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
                        value={searchInput}                          // ADD
                        onChange={(e) => setSearchInput(e.target.value)}  // ADD
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                navigate(`/journals?search=${searchInput}`)  // CHANGED
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
                <button title="Gallery" onClick={() => navigate("/gallery")}>
                    <img src="/images/gallery.png" alt="Gallery" className="btn-icon" />
                    {!collapsed && <span className="btn-label">Gallery</span>}
                </button>
                <button title="Settings" onClick={() => navigate("/settings")}>
                    <img src="/images/setting.png" alt="Settings" className="btn-icon" />
                    {!collapsed && <span className="btn-label">Settings</span>}
                </button>
            </div>
        </div>
    );
}