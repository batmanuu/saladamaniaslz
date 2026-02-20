import { Moon, User } from 'lucide-react';

export default function Header() {
    return (
        <header className="flex items-center justify-between px-6 py-4 bg-background">
            <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z" /></svg>
                </div>
                <h1 className="text-primary font-bold text-xl italic tracking-tight" style={{ fontFamily: 'cursive' }}>Salada Mania</h1>
            </div>
            <div className="flex items-center gap-4 text-text-main">
                <button><User size={20} /></button>
                <button><Moon size={20} /></button>
            </div>
        </header>
    );
}
