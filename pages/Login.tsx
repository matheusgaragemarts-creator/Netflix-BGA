
import React, { useState } from 'react';
import { User, Role } from '../types.ts';
import { DEFAULT_ADMIN } from '../constants.tsx';

interface LoginProps {
  onLogin: (user: User) => void;
  collaborators: User[];
}

const Login: React.FC<LoginProps> = ({ onLogin, collaborators }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    // Normalização Rigorosa: Remove espaços e padroniza e-mail
    const normalizedEmail = email.toLowerCase().trim();
    const normalizedPassword = password.trim();

    setTimeout(() => {
      // 1. Verifica Admin Padrão
      const adminEmail = DEFAULT_ADMIN.email.toLowerCase().trim();
      if (normalizedEmail === adminEmail && normalizedPassword === 'admin123') {
        onLogin(DEFAULT_ADMIN);
        return;
      } 
      
      // 2. Verifica Colaboradores Dinâmicos
      // Busca o usuário na lista de colaboradores (já carregada do localStorage pelo App.tsx)
      const foundUser = collaborators.find(c => 
        c.email.toLowerCase().trim() === normalizedEmail
      );
      
      // Se encontrou o usuário, valida a senha (priorizando a senha personalizada)
      if (foundUser) {
        const storedPassword = (foundUser.password || 'barbeiro123').trim();
        
        if (normalizedPassword === storedPassword) {
           onLogin(foundUser);
        } else {
          setError('Senha incorreta. Verifique os dados e tente novamente.');
          setIsLoading(false);
        }
      } else {
        setError('E-mail não encontrado em nossa base de barbeiros.');
        setIsLoading(false);
      }
    }, 800);
  };

  return (
    <div className="relative min-h-screen bg-cover bg-center flex items-center justify-center px-4" style={{ backgroundImage: "linear-gradient(rgba(0,0,0,0.8), rgba(0,0,0,0.8)), url('https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&q=80&w=1920')" }}>
      <div className="absolute top-8 left-8 md:top-12 md:left-12">
        <h1 className="text-[#003376] font-extrabold text-3xl md:text-5xl tracking-tighter drop-shadow-2xl">NETFLIX BGA</h1>
      </div>
      
      <div className="bg-black/80 p-8 md:p-16 rounded-md w-full max-w-[450px] shadow-2xl backdrop-blur-sm border border-white/10">
        <h2 className="text-3xl font-bold mb-8">Entrar</h2>
        
        {error && (
          <div className="bg-[#e87c03] text-white p-3 rounded-md text-sm mb-6 animate-in fade-in slide-in-from-top-2">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <input 
              required
              type="email" 
              placeholder="E-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-12 bg-[#333] border-none rounded px-5 text-white focus:bg-[#454545] outline-none transition-colors"
            />
          </div>
          
          <div className="relative">
            <input 
              required
              type={showPassword ? "text" : "password"} 
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-12 bg-[#333] border-none rounded px-5 text-white focus:bg-[#454545] outline-none transition-colors"
            />
            <button 
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
            >
              {showPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              )}
            </button>
          </div>
          
          <button 
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 bg-[#003376] text-white rounded font-bold hover:bg-[#001a3d] transition-colors mt-6 disabled:opacity-50 flex items-center justify-center space-x-2"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Autenticando...</span>
              </>
            ) : 'Entrar'}
          </button>
        </form>

        <div className="mt-12 text-[#737373] text-xs border-t border-white/10 pt-8 text-center">
          <p>Problemas com o acesso? <br/>Fale com o administrador da BGA.</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
