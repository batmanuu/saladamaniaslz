import { Moon, Sun, User } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { Link } from 'react-router-dom';

export default function Header() {
    const { isDarkMode, toggleTheme } = useTheme();

    return (
        <header className="flex items-center justify-between px-6 py-4 bg-background transition-colors duration-300">
            <div className="flex items-center gap-2">
                <img src="/logo.png" alt="Salada Mania Logo" className="w-10 h-10 object-contain" />
                <h1 className="text-primary font-bold text-xl italic tracking-tight" style={{ fontFamily: 'cursive' }}>Salada Mania</h1>
            </div>
            <div className="flex items-center gap-4 text-text-main">
                <Link to="/admin" className="hover:text-primary transition-colors" title="Área do Lojista">
                    <User size={20} />
                </Link>
                <button onClick={toggleTheme} className="hover:text-primary transition-colors focus:outline-none" aria-label="Alternar tema escuro e claro">
                    {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                </button>
            </div>
        </header>
    );
}
