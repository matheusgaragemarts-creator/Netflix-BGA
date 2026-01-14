
import React, { useState } from 'react';
import { Video, Pdf, User, ProgressState, Category } from '../types.ts';

interface AdminDashboardProps {
  videos: Video[];
  pdfs: Pdf[];
  categories: Category[];
  collaborators: User[];
  allProgress: ProgressState;
  cloudConfig: any;
  onSaveCloud: (config: any) => void;
  onAddVideo: (v: Video) => void;
  onEditVideo: (v: Video) => void;
  onDeleteVideo: (id: string) => void;
  onAddPdf: (p: Pdf) => void;
  onEditPdf: (p: Pdf) => void;
  onDeletePdf: (id: string) => void;
  onAddCollaborator: (u: User) => void;
  onDeleteCollaborator: (id: string) => void;
  onAddCategory: (c: Category) => void;
  onEditCategory: (c: Category) => void;
  onDeleteCategory: (id: string) => void;
  onRestoreBackup: (data: any) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
  videos, collaborators, cloudConfig, onSaveCloud, onAddVideo, onAddCollaborator, categories
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'cloud' | 'users'>('overview');
  const [fbKey, setFbKey] = useState(cloudConfig ? JSON.stringify(cloudConfig, null, 2) : '');

  const handleSaveCloud = () => {
    try {
      const config = JSON.parse(fbKey);
      if (!config.apiKey || !config.projectId) {
        alert('Parece que o código está incompleto. Certifique-se de copiar todo o conteúdo entre as chaves { }');
        return;
      }
      onSaveCloud(config);
    } catch (e) {
      alert('Formato de configuração inválido. Cole o código JSON que o Firebase forneceu.');
    }
  };

  return (
    <div className="min-h-screen bg-black pt-24 md:pt-32 px-4 md:px-12 pb-20">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <h1 className="text-3xl font-bold">Gestão da Barbearia</h1>
          {cloudConfig && (
            <div className="flex items-center space-x-2 bg-green-500/10 text-green-500 px-4 py-2 rounded-full border border-green-500/20">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
              </span>
              <span className="text-sm font-bold uppercase tracking-widest">Sincronização Ativa</span>
            </div>
          )}
        </div>
        
        <div className="flex space-x-6 border-b border-gray-800 mb-10 overflow-x-auto no-scrollbar">
          <button onClick={() => setActiveTab('overview')} className={`pb-4 px-2 font-bold whitespace-nowrap transition-colors ${activeTab === 'overview' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-500 hover:text-white'}`}>Visão Geral</button>
          <button onClick={() => setActiveTab('cloud')} className={`pb-4 px-2 font-bold whitespace-nowrap transition-colors ${activeTab === 'cloud' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-500 hover:text-white'}`}>☁ Conexão Nuvem</button>
          <button onClick={() => setActiveTab('users')} className={`pb-4 px-2 font-bold whitespace-nowrap transition-colors ${activeTab === 'users' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-500 hover:text-white'}`}>Equipe</button>
        </div>

        {activeTab === 'cloud' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-[#181818] p-8 rounded-lg border border-gray-800">
              <h3 className="text-xl font-bold mb-4">Configurar Sincronização Automática</h3>
              <p className="text-gray-400 text-sm mb-6">
                Cole abaixo o seu <b>firebaseConfig</b>. Isso fará com que o PC e os Celulares dos barbeiros fiquem conectados via internet.
              </p>
              
              <textarea 
                value={fbKey}
                onChange={(e) => setFbKey(e.target.value)}
                placeholder='{
  "apiKey": "...",
  "authDomain": "...",
  "projectId": "...",
  "storageBucket": "...",
  "messagingSenderId": "...",
  "appId": "..."
}'
                className="w-full h-64 bg-black border border-gray-800 rounded p-4 text-mono text-sm text-green-400 outline-none focus:border-blue-500 transition-colors"
              />
              
              <button 
                onClick={handleSaveCloud}
                className="w-full mt-6 py-4 bg-blue-600 text-white rounded font-bold hover:bg-blue-700 transition-all shadow-xl active:scale-95"
              >
                Ativar e Sincronizar Agora
              </button>
            </div>

            <div className="bg-blue-600/5 p-8 rounded-lg border border-blue-500/20">
              <h3 className="text-xl font-bold mb-6 flex items-center space-x-2">
                <span className="bg-blue-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">?</span>
                <span>Onde encontro essas chaves?</span>
              </h3>
              
              <div className="space-y-6 text-sm">
                <div className="flex space-x-4">
                  <div className="font-bold text-blue-500">01.</div>
                  <div>Entre no <a href="https://console.firebase.google.com/" target="_blank" className="text-blue-400 underline font-bold">Console do Firebase</a> e clique no seu projeto.</div>
                </div>
                <div className="flex space-x-4">
                  <div className="font-bold text-blue-500">02.</div>
                  <div>Clique na <b>Engrenagem ⚙️</b> (Configurações do Projeto) no topo do menu lateral.</div>
                </div>
                <div className="flex space-x-4">
                  <div className="font-bold text-blue-500">03.</div>
                  <div>No final da página, clique no ícone <b>&lt;/&gt; (Web)</b> para registrar um novo app.</div>
                </div>
                <div className="flex space-x-4">
                  <div className="font-bold text-blue-500">04.</div>
                  <div>Copie o código que está dentro da variável <b>const firebaseConfig = &#123; ... &#125;;</b></div>
                </div>
              </div>

              <div className="mt-8 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-md">
                <p className="text-xs text-yellow-200/70 leading-relaxed italic">
                  <b>Dica:</b> Após ativar aqui no seu PC, você precisará colar esse mesmo código uma única vez no celular de cada barbeiro através da opção "Configurar Nuvem ☁" na tela de login deles.
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in duration-300">
             <div className="bg-[#181818] p-8 rounded-lg border border-gray-800 shadow-lg">
                <p className="text-gray-500 text-xs uppercase font-bold mb-2 tracking-widest">Vídeos Ativos</p>
                <p className="text-4xl font-black">{videos.length}</p>
             </div>
             <div className="bg-[#181818] p-8 rounded-lg border border-gray-800 shadow-lg">
                <p className="text-gray-500 text-xs uppercase font-bold mb-2 tracking-widest">Barbeiros na Equipe</p>
                <p className="text-4xl font-black">{collaborators.length}</p>
             </div>
             <div className="bg-[#181818] p-8 rounded-lg border border-gray-800 shadow-lg">
                <p className="text-gray-500 text-xs uppercase font-bold mb-2 tracking-widest">Status da Conexão</p>
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${cloudConfig ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]' : 'bg-yellow-500'}`}></div>
                  <p className={`text-xl font-bold ${cloudConfig ? 'text-white' : 'text-yellow-500'}`}>
                    {cloudConfig ? 'Sincronizado' : 'Modo Offline'}
                  </p>
                </div>
             </div>
          </div>
        )}

        {activeTab === 'users' && (
           <div className="bg-[#181818] rounded-lg border border-gray-800 overflow-hidden shadow-2xl animate-in fade-in duration-300">
             <div className="p-6 border-b border-gray-800 flex justify-between items-center bg-white/5">
                <h3 className="font-bold">Colaboradores Cadastrados</h3>
                <span className="text-xs text-gray-400 bg-white/5 px-3 py-1 rounded-full">{collaborators.length} total</span>
             </div>
             <div className="overflow-x-auto">
               <table className="w-full text-left">
                 <thead className="bg-black/50 text-[10px] font-bold uppercase text-gray-500 tracking-widest">
                   <tr>
                      <th className="px-6 py-4">Barbeiro</th>
                      <th className="px-6 py-4">E-mail</th>
                      <th className="px-6 py-4">Cargo</th>
                      <th className="px-6 py-4 text-right">Gestão</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-gray-800/50">
                   {collaborators.length === 0 ? (
                     <tr>
                       <td colSpan={4} className="px-6 py-12 text-center text-gray-500 italic text-sm">Nenhum barbeiro cadastrado ainda.</td>
                     </tr>
                   ) : (
                     collaborators.map(u => (
                       <tr key={u.id} className="hover:bg-white/[0.02] transition-colors">
                         <td className="px-6 py-4 flex items-center space-x-3">
                            <img src={u.avatar} className="w-8 h-8 rounded-full border border-gray-700" alt="" />
                            <span className="font-bold text-sm">{u.name}</span>
                         </td>
                         <td className="px-6 py-4 text-gray-400 text-sm">{u.email}</td>
                         <td className="px-6 py-4">
                            <span className="text-[10px] font-bold bg-gray-700/50 px-2 py-1 rounded text-gray-300 uppercase">{u.role}</span>
                         </td>
                         <td className="px-6 py-4 text-right">
                            <button className="text-red-500/50 hover:text-red-500 font-bold text-xs uppercase tracking-tighter transition-colors">Remover</button>
                         </td>
                       </tr>
                     ))
                   )}
                 </tbody>
               </table>
             </div>
           </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
