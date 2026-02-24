import "../styles/Navbar.css"

function getGreeting() {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Evening";
    return "Good Afternoon";
}

function Navbar() {
    const greeting = getGreeting();
    return (
        <nav className="navbar">
            <div className="logo">Memoire</div>
            <div className="greeting">
                <span className="cursor typewriter-animation">
                    {greeting}, Lucky👋
                </span>
            </div>
            <div className="nav-right">
                <span className="moon">🌙</span>
                <div className="avatar">L</div>
            </div>
        </nav>
    )
}

export default Navbar