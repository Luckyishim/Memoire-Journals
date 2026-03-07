import "../styles/ThemeToggle.css"
import { useState } from 'react'

function ThemeToggle() {
    const [darkMode, setDarkMode] = useState(true);
    const clickHandler = () => {
        setDarkMode((value) => !value)
    }

    return (
        <div className='' > 
            <button onClick={clickHandler} className='theme'>
                {darkMode ? '☀︎' : '⏾'}
            </button>
        </div>
    )
}

export default ThemeToggle