
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
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    setTimeout(() => {
      // 1. Verifica Admin Padrão
      if (email === DEFAULT_ADMIN.email && password === 'admin123') {
        onLogin(DEFAULT_ADMIN);
      } 
      // 2. Verifica Colaboradores Dinâmicos com senha personalizada
      else {
        const foundUser = collaborators.find(c => c.email === email);
        // Verifica se o usuário existe e se a senha fornecida coincide com a salva (ou a padrão se não houver)
        if (foundUser && password === (foundUser.password || 'barbeiro123')) {
           onLogin(foundUser);
        } else {
          setError('Credenciais incorretas. Verifique seu e-mail ou fale com seu gestor.');
          setIsLoading(false);
        }
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
          <input 
            required
            type="email" 
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full h-12 bg-[#333] border-none rounded px-5 text-white focus:bg-[#454545] outline-none"
          />
          <input 
            required
            type="password" 
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full h-12 bg-[#333] border-none rounded px-5 text-white focus:bg-[#454545] outline-none"
          />
          
          <button 
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 bg-[#003376] text-white rounded font-bold hover:bg-[#001a3d] transition-colors mt-6 disabled:opacity-50"
          >
            {isLoading ? 'Autenticando...' : 'Entrar'}
          </button>
        </form>

        <div className="mt-12 text-[#737373] text-sm border-t border-white/10 pt-8 text-center">
          <p>Esqueceu sua senha? Entre em contato com o suporte.</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
