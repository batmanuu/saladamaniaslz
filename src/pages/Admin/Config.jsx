import { useNavigate } from "react-router-dom";
import { ChevronLeft, LogOut, Settings, Store, User } from "lucide-react";

export default function AdminConfig() {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("adminAuth");
        navigate("/login");
    };

    return (
        <div className="admin-theme pb-24 bg-background min-h-screen">
            {/* Header */}
            <header className="flex items-center gap-4 px-5 py-4 bg-white shadow-soft sticky top-0 z-20">
                <button onClick={() => navigate(-1)} className="text-primary p-2 -ml-2 hover:bg-primary-light/10 rounded-full transition-colors">
                    <ChevronLeft size={24} />
                </button>
                <div className="flex items-center gap-3">
                    <div className="bg-primary-light/10 p-2 rounded-xl text-primary">
                        <Settings size={22} />
                    </div>
                    <div>
                        <h1 className="font-extrabold text-text-main text-lg leading-tight">Configurações</h1>
                        <p className="text-[10px] text-text-muted">Ajustes da Loja</p>
                    </div>
                </div>
            </header>

            <div className="px-5 mt-6 space-y-6">
                
                {/* Loja Info */}
                <section>
                    <h2 className="text-[11px] font-extrabold text-text-muted tracking-widest uppercase mb-3 px-2">Sua Loja</h2>
                    <div className="bg-white rounded-[2rem] p-2 shadow-soft space-y-1 border border-primary/5">
                        <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-background-alt transition-colors rounded-2xl">
                            <div className="flex items-center gap-3">
                                <div className="bg-primary-light/10 p-2.5 rounded-xl text-primary-light">
                                    <Store size={20} />
                                </div>
                                <div>
                                    <p className="font-bold text-sm text-text-main">Perfil da Loja</p>
                                    <p className="text-[10px] text-text-muted">Editar nome, logo e endereço (Em breve)</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Conta Setup */}
                <section>
                    <h2 className="text-[11px] font-extrabold text-text-muted tracking-widest uppercase mb-3 px-2">Conta</h2>
                    <div className="bg-white rounded-[2rem] p-2 shadow-soft space-y-1 border border-primary/5">
                        <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-background-alt transition-colors rounded-2xl">
                            <div className="flex items-center gap-3">
                                <div className="bg-blue-100 p-2.5 rounded-xl text-blue-500">
                                    <User size={20} />
                                </div>
                                <div>
                                    <p className="font-bold text-sm text-text-main">Administradores</p>
                                    <p className="text-[10px] text-text-muted">Gerenciar acessos (Em breve)</p>
                                </div>
                            </div>
                        </div>

                        <div 
                            onClick={handleLogout}
                            className="flex items-center justify-between p-4 cursor-pointer hover:bg-red-50 transition-colors rounded-2xl mt-2 border border-red-100"
                        >
                            <div className="flex items-center gap-3">
                                <div className="bg-red-100 p-2.5 rounded-xl text-red-500">
                                    <LogOut size={20} />
                                </div>
                                <div>
                                    <p className="font-bold text-sm text-red-500">Sair da Conta</p>
                                    <p className="text-[10px] text-red-400">Desconectar deste dispositivo</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Footer Credits */}
                <div className="text-center pt-8">
                    <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Salada Mania ERP</p>
                    <p className="text-[10px] text-text-muted mt-1">Versão 1.0.0</p>
                </div>
            </div>
        </div>
    );
}
