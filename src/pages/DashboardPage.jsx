import "../styles/DashboardPage.css";

export function DashboardPage() {
    return (
        <div>
            <div className="container" >
                <span className="icon" >
                    📖
                </span>
                <p className="line" >
                    Select an Entry or Start a New Entry
                </p>
                <button className="entry-btn" >
                    + New Entry
                </button>
            </div>
        </div>
    )
}