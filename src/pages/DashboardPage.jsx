import {  useNavigate } from "react-router-dom";
import "../styles/DashboardPage.css";

export function DashboardPage() {
    const navigate = useNavigate()
    return (
        <div>
            <div className="container" >
                <span className="icon" >
                    📖
                </span>
                <p className="line" >
                    Select an Entry or Start a New Entry
                </p>
                <button className="entry-btn" 
                onClick={()=> navigate("/editorPage")}
                >
                    + New Entry
                </button>
            </div>
        </div>
    )
}