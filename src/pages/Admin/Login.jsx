import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Store } from "lucide-react";

function Login() {
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  function handleLogin() {
    if (password === "admin123") {
      localStorage.setItem("adminAuth", "true");
      navigate("/admin");
    } else {
      alert("Senha incorreta");
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[100dvh] p-4 bg-background relative overflow-hidden">
      
      {/* Decorative background elements */}
      <div className="absolute top-10 left-10 text-4xl opacity-50 rotate-12">🍓</div>
      <div className="absolute top-20 right-12 text-5xl opacity-50 -rotate-12">🥝</div>
      <div className="absolute bottom-24 left-16 text-5xl opacity-50 rotate-45">🍇</div>
      <div className="absolute bottom-16 right-16 text-4xl opacity-50 -rotate-12">🥭</div>
      <div className="absolute top-1/2 left-4 text-3xl opacity-40 rotate-90">🍌</div>
      <div className="absolute top-1/3 right-4 text-4xl opacity-40 -rotate-45">🍎</div>

      <div className="bg-white p-8 rounded-[2rem] shadow-soft w-full max-w-sm relative z-10 border border-primary/10">
        
        <div className="flex flex-col items-center mb-6">
          <div className="w-16 h-16 bg-primary-light/10 text-primary flex items-center justify-center rounded-2xl mb-4">
             <Store size={32} />
          </div>
          <h2 className="text-2xl font-extrabold text-center text-text-main" style={{ fontFamily: 'cursive' }}>
            Salada Mania
          </h2>
          <p className="text-sm font-bold text-primary-light mt-1 uppercase tracking-widest">Painel Lojista</p>
        </div>

        <div className="space-y-4">
          <div className="relative">
            <label className="absolute -top-2.5 left-4 bg-white px-2 text-[10px] font-bold text-primary tracking-wide">
                Senha de Acesso
            </label>
            <input
              type="password"
              placeholder="Digite a senha..."
              className="w-full bg-slate-50 border-2 border-background-alt rounded-2xl px-5 py-4 text-sm font-medium text-text-main placeholder:text-text-muted focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all duration-300"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
            />
          </div>

          <button 
            onClick={handleLogin}
            className="w-full bg-primary text-white font-bold py-4 rounded-2xl shadow-lg shadow-primary/30 hover:bg-primary-light active:scale-95 transition-all duration-300 mt-2 flex items-center justify-center gap-2"
          >
            Acessar Painel <span>🍍</span>
          </button>
        </div>

        <p className="text-[10px] text-center text-text-muted mt-6 font-medium">
          Acesso restrito apenas para administradores.
        </p>
      </div>
    </div>
  );
}

export default Login;
