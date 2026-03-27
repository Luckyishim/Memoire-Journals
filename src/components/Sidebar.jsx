import { useState } from "react";
import "../styles/Sidebar.css";
import { useNavigate } from "react-router-dom";

export function Sidebar() {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

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
          <input type="text" placeholder="Search Entries..." />
        </div>
      )}

      <div className="pages">
        <button title="Journal" onClick={()=> navigate("/editorPage")}>
          <img src="/images/journal.png" alt="Journal" className="btn-icon" />
          {!collapsed && <span className="btn-label">Journal</span>}
        </button>
        <button title="People">
          <img src="/images/user.png" alt="People" className="btn-icon" />
          {!collapsed && <span className="btn-label">People</span>}
        </button>
        <button title="Gallery">
          <img src="/images/gallery.png" alt="Gallery" className="btn-icon" />
          {!collapsed && <span className="btn-label">Gallery</span>}
        </button>
        <button title="Settings">
          <img src="/images/setting.png" alt="Settings" className="btn-icon" />
          {!collapsed && <span className="btn-label">Settings</span>}
        </button>
      </div>

    </div>
  );
}