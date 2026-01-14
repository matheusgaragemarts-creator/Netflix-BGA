
import React, { useState } from 'react';
import { User, Role } from '../types.ts';
import { DEFAULT_ADMIN } from '../constants.tsx';

interface LoginProps {
  onLogin: (user: User) => void;
  collaborators: User[];
  onSaveCloud: (config: { url: string; key: string }) => void;
  currentConfig: any;
}

const Login: React.FC<LoginProps> = ({ onLogin, collaborators, onSaveCloud, currentConfig }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showCloudConfig, setShowCloudConfig] = useState(false);
  const [cloudForm, setCloudForm] = useState(currentConfig || { url: '', key: '' });

  const handleCloudSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveCloud(cloudForm);
    setShowCloudConfig(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const normalizedEmail = email.toLowerCase().trim();

    setTimeout(() => {
      if (normalizedEmail === DEFAULT_ADMIN.email.toLowerCase().trim() && password === 'admin123') {
        onLogin(DEFAULT_ADMIN);
      } 
      else {
        const foundUser = collaborators.find(c => 
          c.email.toLowerCase().trim() === normalizedEmail
        );
        
        if (foundUser && password === (foundUser.password || 'barbeiro123')) {
           onLogin(foundUser);
        } else {
          setError('Acesso negado. Verifique os dados ou a conexão com a nuvem.');
          setIsLoading(false);
        }
      }
    }, 800);
  };

  return (
    <div className="relative min-h-screen bg-cover bg-center flex items-center justify-center px-4" style={{ backgroundImage: "linear-gradient(rgba(0,0,0,0.85), rgba(0,0,0,0.85)), url('https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&q=80&w=1920')" }}>
      <div className="absolute top-8 left-8 md:top-12 md:left-12">
        <h1 className="text-[#003376] font-extrabold text-3xl md:text-5xl tracking-tighter drop-shadow-2xl">NETFLIX BGA</h1>
      </div>
      
      <div className="bg-black/90 p-8 md:p-16 rounded-md w-full max-w-[450px] shadow-2xl backdrop-blur-md border border-white/5">
        {showCloudConfig ? (
          <form onSubmit={handleCloudSubmit} className="space-y-6 animate-in slide-in-from-right duration-300">
            <h2 className="text-2xl font-bold mb-2 uppercase tracking-tighter">Conectar Nuvem</h2>
            <p className="text-gray-500 text-xs mb-8">Insira os dados do Supabase fornecidos pelo administrador.</p>
            
            <input required type="text" placeholder="URL do Supabase" value={cloudForm.url} onChange={e => setCloudForm({...cloudForm, url: e.target.value})} className="w-full h-12 bg-[#333] border-none rounded px-5 text-white outline-none" />
            <input required type="password" placeholder="Chave de Acesso (Anon Key)" value={cloudForm.key} onChange={e => setCloudForm({...cloudForm, key: e.target.value})} className="w-full h-12 bg-[#333] border-none rounded px-5 text-white outline-none" />
            
            <button type="submit" className="w-full py-4 bg-[#003376] text-white font-bold rounded uppercase tracking-widest shadow-xl">Conectar Sistema</button>
            <button type="button" onClick={() => setShowCloudConfig(false)} className="w-full text-xs text-gray-500 font-bold uppercase">Voltar ao Login</button>
          </form>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <h2 className="text-3xl font-bold mb-8 uppercase tracking-tighter">Entrar</h2>
            
            {error && <div className="bg-red-600/20 border border-red-600/50 text-red-500 p-3 rounded-md text-xs mb-6 animate-in fade-in">{error}</div>}

            <input required type="email" placeholder="E-mail" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full h-12 bg-[#333] border-none rounded px-5 text-white focus:bg-[#454545] outline-none" />
            <input required type="password" placeholder="Senha" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full h-12 bg-[#333] border-none rounded px-5 text-white focus:bg-[#454545] outline-none" />
            
            <button type="submit" disabled={isLoading} className="w-full py-4 bg-[#003376] text-white rounded font-black uppercase tracking-widest hover:bg-[#001a3d] transition-all mt-4 disabled:opacity-50">
              {isLoading ? 'Conectando...' : 'Entrar'}
            </button>
            
            <div className="flex justify-between items-center text-[10px] mt-10">
              <span className="text-gray-600 uppercase font-black">Sistema Sincronizado</span>
              <button type="button" onClick={() => setShowCloudConfig(true)} className="text-[#003376] font-black uppercase hover:underline">Configurar Nuvem ☁</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Login;
