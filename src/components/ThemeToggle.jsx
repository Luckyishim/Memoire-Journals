import { useTheme } from "../hooks";
import "../styles/ThemeToggle.css"

export function ThemeToggle() {
    const { darkMode, toggleTheme } = useTheme();

    return (
        <div>
            <button onClick={toggleTheme} className='theme'>
                {darkMode ? '☀︎' : '☾'}
            </button>
        </div>
    )
}
