
import React, { useState } from 'react';
import { User, Role } from '../types.ts';
import { DEFAULT_ADMIN } from '../constants.tsx';

interface LoginProps {
  onLogin: (user: User) => void;
  onRegister: (user: User) => void;
  collaborators: User[];
  cloudConfig: any;
  onSaveCloud: (config: any) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin, onRegister, collaborators, cloudConfig, onSaveCloud }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [showCloudConfig, setShowCloudConfig] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fbKey, setFbKey] = useState(cloudConfig ? JSON.stringify(cloudConfig, null, 2) : '');
  const [error, setError] = useState<string | null>(null);

  const handleSaveCloud = () => {
    try {
      onSaveCloud(JSON.parse(fbKey));
      setShowCloudConfig(false);
    } catch (e) { alert('JSON inválido.'); }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const normalizedEmail = email.toLowerCase().trim();

    if (isLogin) {
      if (normalizedEmail === DEFAULT_ADMIN.email && password === 'admin123') {
        onLogin(DEFAULT_ADMIN);
        return;
      }
      const found = collaborators.find(c => c.email.toLowerCase().trim() === normalizedEmail);
      if (found && password === (found.password || 'barbeiro123')) {
        onLogin(found);
      } else {
        setError('Acesso negado. Verifique os dados ou a conexão com a nuvem.');
      }
    } else {
      const newUser: User = {
        id: `u-${Date.now()}`,
        name: name.trim(),
        email: normalizedEmail,
        password: password,
        role: Role.COLABORADOR,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=003376&color=fff`
      };
      onRegister(newUser);
    }
  };

  return (
    <div className="min-h-screen bg-cover bg-center flex items-center justify-center p-4" style={{ backgroundImage: "linear-gradient(rgba(0,0,0,0.85), rgba(0,0,0,0.85)), url('https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&q=80&w=1920')" }}>
      <div className="bg-black/90 p-8 md:p-12 rounded-lg w-full max-w-md border border-white/10 shadow-2xl">
        <h1 className="text-3xl font-black text-[#003376] mb-8 text-center">NETFLIX BGA</h1>
        
        {showCloudConfig ? (
          <div className="space-y-4 animate-in slide-in-from-right duration-300">
            <h2 className="text-xl font-bold">Conectar à Barbearia</h2>
            <p className="text-xs text-gray-500">Cole o código da nuvem fornecido pelo seu gestor.</p>
            <textarea 
              value={fbKey}
              onChange={(e) => setFbKey(e.target.value)}
              className="w-full h-32 bg-white/5 border border-white/10 rounded p-3 text-xs text-green-400 outline-none"
              placeholder='{ "apiKey": "..." }'
            />
            <button onClick={handleSaveCloud} className="w-full py-3 bg-[#003376] rounded font-bold">Salvar e Conectar</button>
            <button onClick={() => setShowCloudConfig(false)} className="w-full text-xs text-gray-500">Voltar</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <h2 className="text-2xl font-bold mb-6">{isLogin ? 'Entrar' : 'Cadastre-se'}</h2>
            {error && <div className="p-3 bg-orange-600/20 text-orange-500 text-xs rounded border border-orange-600/50">{error}</div>}
            
            {!isLogin && (
              <input required type="text" placeholder="Seu Nome" value={name} onChange={e => setName(e.target.value)} className="w-full h-12 bg-white/10 rounded px-4 outline-none focus:ring-1 ring-blue-500" />
            )}
            <input required type="email" placeholder="E-mail" value={email} onChange={e => setEmail(e.target.value)} className="w-full h-12 bg-white/10 rounded px-4 outline-none focus:ring-1 ring-blue-500" />
            <input required type="password" placeholder="Senha" value={password} onChange={e => setPassword(e.target.value)} className="w-full h-12 bg-white/10 rounded px-4 outline-none focus:ring-1 ring-blue-500" />
            
            <button type="submit" className="w-full py-3 bg-[#003376] rounded font-bold hover:brightness-110 transition-all">{isLogin ? 'ENTRAR' : 'CRIAR CONTA'}</button>
            
            <div className="flex justify-between items-center text-xs mt-6">
              <button type="button" onClick={() => setIsLogin(!isLogin)} className="text-gray-400 hover:text-white transition-colors">
                {isLogin ? 'Criar nova conta' : 'Já tenho conta'}
              </button>
              <button type="button" onClick={() => setShowCloudConfig(true)} className="text-[#003376] font-bold">Configurar Nuvem ☁</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Login;
