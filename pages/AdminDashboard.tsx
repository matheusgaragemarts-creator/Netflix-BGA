
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
  const [activeTab, setActiveTab] = useState<'stats' | 'cloud' | 'users'>('stats');
  const [fbKey, setFbKey] = useState(cloudConfig ? JSON.stringify(cloudConfig, null, 2) : '');

  const handleSaveCloud = () => {
    try {
      const config = JSON.parse(fbKey);
      onSaveCloud(config);
    } catch (e) { alert('JSON Inválido'); }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-32 px-4 md:px-12 pb-20">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-12">
          <h1 className="text-3xl font-black uppercase tracking-tighter">Painel de Gestão</h1>
          <div className="flex bg-white/5 p-1 rounded-lg">
            {['stats', 'users', 'cloud'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`px-6 py-2 rounded-md text-[10px] font-black uppercase tracking-widest transition-all ${
                  activeTab === tab ? 'bg-[#003376] text-white shadow-lg' : 'text-gray-500 hover:text-white'
                }`}
              >
                {tab === 'stats' ? 'Geral' : tab === 'users' ? 'Equipe' : 'Nuvem'}
              </button>
            ))}
          </div>
        </div>

        {activeTab === 'stats' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in duration-500">
            <div className="bg-[#141414] p-10 rounded border border-white/5 flex flex-col items-center">
              <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-4">Conteúdos</span>
              <span className="text-6xl font-black">{videos.length}</span>
            </div>
            <div className="bg-[#141414] p-10 rounded border border-white/5 flex flex-col items-center">
              <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-4">Equipe</span>
              <span className="text-6xl font-black">{collaborators.length}</span>
            </div>
            <div className="bg-[#141414] p-10 rounded border border-white/5 flex flex-col items-center">
              <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-4">Status Cloud</span>
              <span className={`text-xl font-black mt-4 ${cloudConfig ? 'text-green-500' : 'text-orange-500'}`}>
                {cloudConfig ? 'ONLINE' : 'LOCAL'}
              </span>
            </div>
          </div>
        )}

        {activeTab === 'cloud' && (
          <div className="max-w-2xl mx-auto bg-[#141414] p-10 rounded border border-white/5 animate-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-xl font-black mb-2 uppercase">Conectar com Firebase</h2>
            <p className="text-gray-500 text-sm mb-8">Cole o código de configuração para habilitar a sincronização entre aparelhos.</p>
            <textarea 
              value={fbKey}
              onChange={(e) => setFbKey(e.target.value)}
              className="w-full h-48 bg-black border border-white/10 rounded p-4 text-xs font-mono text-green-500 outline-none focus:border-[#003376]"
              placeholder='{ "apiKey": "..." }'
            />
            <button onClick={handleSaveCloud} className="w-full mt-6 py-4 bg-[#003376] text-white font-black uppercase tracking-widest rounded hover:brightness-110 transition-all">
              Salvar Configurações
            </button>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="bg-[#141414] rounded border border-white/5 overflow-hidden animate-in fade-in duration-500">
            <table className="w-full text-left">
              <thead className="bg-white/5 text-[10px] font-black uppercase text-gray-500 tracking-widest border-b border-white/5">
                <tr>
                  <th className="px-8 py-5">Barbeiro</th>
                  <th className="px-8 py-5">E-mail</th>
                  <th className="px-8 py-5 text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {collaborators.map(u => (
                  <tr key={u.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-8 py-5 font-bold">{u.name}</td>
                    <td className="px-8 py-5 text-gray-500">{u.email}</td>
                    <td className="px-8 py-5 text-right">
                      <button className="text-red-500/50 hover:text-red-500 font-black text-[10px] uppercase">Remover</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
