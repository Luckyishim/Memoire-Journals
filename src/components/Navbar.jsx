import "../styles/Navbar.css"
import ThemeToggle from "./ThemeToggle";

function getGreeting() {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
}

export function Navbar() {
    const greeting = getGreeting();

    const user = JSON.parse(localStorage.getItem("memoire_user"))
    const username = user?.username || "there";

    return (
        <nav className="navbar">
            <div className="logo">Memoire</div>
            <div className="greeting">
                <span className="cursor typewriter-animation">
                    {greeting}, {username}
                </span>
            </div>
            <div className="nav-right">
                <span className="moon"> <ThemeToggle /> </span>
                <div className="avatar">{username[0].toUpperCase()}</div>
            </div>
        </nav>
    )
}

