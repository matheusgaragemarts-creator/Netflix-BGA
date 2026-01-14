
import React, { useState } from 'react';
import { User, Role } from '../types.ts';
import { DEFAULT_ADMIN } from '../constants.tsx';

interface LoginProps {
  onLogin: (user: User) => void;
  onRegister: (user: User) => void;
  collaborators: User[];
  onSaveCloud: (config: { url: string; key: string }) => void;
  currentConfig: any;
}

const Login: React.FC<LoginProps> = ({ onLogin, onRegister, collaborators, onSaveCloud, currentConfig }) => {
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [showCloudConfig, setShowCloudConfig] = useState(false);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
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
      if (isRegisterMode) {
        // Lógica de Cadastro
        const exists = collaborators.find(c => c.email.toLowerCase().trim() === normalizedEmail);
        if (exists || normalizedEmail === DEFAULT_ADMIN.email.toLowerCase()) {
          setError('Este e-mail já possui um acesso vinculado.');
          setIsLoading(false);
          return;
        }

        const newUser: User = {
          id: `u-${Date.now()}`,
          name: name.trim(),
          email: normalizedEmail,
          password: password,
          role: Role.COLABORADOR,
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=003376&color=fff`
        };
        onRegister(newUser);
      } else {
        // Lógica de Login
        if (normalizedEmail === DEFAULT_ADMIN.email.toLowerCase().trim() && password === 'admin123') {
          onLogin(DEFAULT_ADMIN);
        } 
        else {
          const foundUser = collaborators.find(c => 
            c.email.toLowerCase().trim() === normalizedEmail
          );
          
          if (foundUser && (foundUser.password === password || (!foundUser.password && password === 'barbeiro123'))) {
             onLogin(foundUser);
          } else {
            setError('Credenciais inválidas. Verifique os dados ou a nuvem.');
            setIsLoading(false);
          }
        }
      }
    }, 800);
  };

  return (
    <div className="relative min-h-screen bg-cover bg-center flex items-center justify-center px-4" style={{ backgroundImage: "linear-gradient(rgba(0,0,0,0.8), rgba(0,0,0,0.8)), url('https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&q=80&w=1920')" }}>
      <div className="absolute top-8 left-8 md:top-12 md:left-12">
        <h1 className="text-[#003376] font-extrabold text-3xl md:text-5xl tracking-tighter drop-shadow-2xl">NETFLIX BGA</h1>
      </div>
      
      <div className="bg-black/85 p-8 md:p-14 rounded-lg w-full max-w-[450px] shadow-2xl backdrop-blur-xl border border-white/5 animate-in fade-in zoom-in-95 duration-500">
        {showCloudConfig ? (
          <form onSubmit={handleCloudSubmit} className="space-y-6 animate-in slide-in-from-right duration-300">
            <h2 className="text-2xl font-bold mb-2 uppercase tracking-tighter">☁ Sincronização</h2>
            <p className="text-gray-500 text-xs mb-8">Insira as chaves do Supabase para conectar à barbearia.</p>
            
            <input required type="text" placeholder="URL do Supabase" value={cloudForm.url} onChange={e => setCloudForm({...cloudForm, url: e.target.value})} className="w-full h-12 bg-[#333] border-none rounded px-5 text-white outline-none focus:ring-1 focus:ring-[#003376]" />
            <input required type="password" placeholder="Chave (Anon Key)" value={cloudForm.key} onChange={e => setCloudForm({...cloudForm, key: e.target.value})} className="w-full h-12 bg-[#333] border-none rounded px-5 text-white outline-none focus:ring-1 focus:ring-[#003376]" />
            
            <button type="submit" className="w-full py-4 bg-[#003376] text-white font-bold rounded uppercase tracking-widest shadow-xl hover:brightness-110 transition-all">Conectar Agora</button>
            <button type="button" onClick={() => setShowCloudConfig(false)} className="w-full text-xs text-gray-500 font-bold uppercase hover:text-white transition-colors">Voltar</button>
          </form>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <h2 className="text-3xl font-bold mb-8 uppercase tracking-tighter">
              {isRegisterMode ? 'Novo Acesso' : 'Entrar'}
            </h2>
            
            {error && <div className="bg-red-600/20 border border-red-600/50 text-red-500 p-3 rounded-md text-xs mb-6 animate-in fade-in">{error}</div>}

            {isRegisterMode && (
              <div className="animate-in slide-in-from-top duration-300 space-y-4">
                <input required type="text" placeholder="Seu Nome" value={name} onChange={(e) => setName(e.target.value)} className="w-full h-12 bg-[#333] border-none rounded px-5 text-white focus:bg-[#454545] outline-none" />
              </div>
            )}
            
            <input required type="email" placeholder="E-mail corporativo" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full h-12 bg-[#333] border-none rounded px-5 text-white focus:bg-[#454545] outline-none" />
            <input required type="password" placeholder="Sua Senha" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full h-12 bg-[#333] border-none rounded px-5 text-white focus:bg-[#454545] outline-none" />
            
            <button type="submit" disabled={isLoading} className="w-full py-4 bg-[#003376] text-white rounded font-black uppercase tracking-widest hover:bg-[#001a3d] transition-all mt-4 disabled:opacity-50 shadow-lg">
              {isLoading ? 'Aguarde...' : (isRegisterMode ? 'Criar Conta BGA' : 'Entrar')}
            </button>
            
            <div className="mt-8 pt-4 border-t border-white/5">
              <p className="text-gray-500 text-sm">
                {isRegisterMode ? 'Já é da nossa equipe?' : 'Novo por aqui?'} 
                <button 
                  type="button" 
                  onClick={() => { setIsRegisterMode(!isRegisterMode); setError(null); }}
                  className="text-white font-bold ml-2 hover:underline"
                >
                  {isRegisterMode ? 'Faça login.' : 'Cadastre seu acesso.'}
                </button>
              </p>
            </div>

            <div className="flex justify-between items-center text-[10px] mt-8 pt-4 opacity-50 hover:opacity-100 transition-opacity">
              <span className="text-gray-600 uppercase font-black">BGA v2.0</span>
              <button type="button" onClick={() => setShowCloudConfig(true)} className="text-[#003376] font-black uppercase hover:underline">Configurar Nuvem ☁</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Login;
