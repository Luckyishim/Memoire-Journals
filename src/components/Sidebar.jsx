import "../styles/Sidebar.css"
export function Sidebar() {
  return (
    <div className="sidebar">
      <div className="filter" >
        <span>🔍</span>
        <input type="text" placeholder="Search Entries..." />
      </div>
      <div className="pages" >
        <button>
          Journal
        </button>
        <button>
          People
        </button>
        <button>
          Gallery
        </button>
        <button>
          Settings
        </button>
      </div>

    </div>
  )
}

