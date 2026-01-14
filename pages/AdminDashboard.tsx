
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
      onSaveCloud(config);
    } catch (e) {
      alert('Formato de configuração inválido. Cole o JSON do Firebase corretamente.');
    }
  };

  return (
    <div className="min-h-screen bg-black pt-24 md:pt-32 px-4 md:px-12 pb-20">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Gestão da Barbearia</h1>
        
        <div className="flex space-x-6 border-b border-gray-800 mb-10">
          <button onClick={() => setActiveTab('overview')} className={`pb-4 px-2 font-bold ${activeTab === 'overview' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-500'}`}>Visão Geral</button>
          <button onClick={() => setActiveTab('cloud')} className={`pb-4 px-2 font-bold ${activeTab === 'cloud' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-500'}`}>☁ Conexão Nuvem</button>
          <button onClick={() => setActiveTab('users')} className={`pb-4 px-2 font-bold ${activeTab === 'users' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-500'}`}>Equipe</button>
        </div>

        {activeTab === 'cloud' && (
          <div className="bg-[#181818] p-8 rounded-lg border border-gray-800 animate-in fade-in duration-300">
            <h3 className="text-xl font-bold mb-4">Sincronização Automática (Google Firebase)</h3>
            <p className="text-gray-400 text-sm mb-8 leading-relaxed">
              Para que o seu PC e o celular dos barbeiros conversem automaticamente, cole abaixo o <b>firebaseConfig</b> que você obtém no Console do Firebase.
            </p>
            
            <textarea 
              value={fbKey}
              onChange={(e) => setFbKey(e.target.value)}
              placeholder='{ "apiKey": "...", "authDomain": "...", ... }'
              className="w-full h-48 bg-black border border-gray-800 rounded p-4 text-mono text-sm text-green-500 outline-none focus:border-blue-500"
            />
            
            <div className="mt-8 flex items-center justify-between">
              <div className="text-xs text-gray-500">
                Ainda não tem as chaves? <a href="https://console.firebase.google.com/" target="_blank" className="text-blue-500 underline">Crie um projeto gratuito aqui</a>.
              </div>
              <button 
                onClick={handleSaveCloud}
                className="px-8 py-3 bg-blue-600 text-white rounded font-bold hover:bg-blue-700 transition-colors shadow-lg"
              >
                Ativar Sincronização Automática
              </button>
            </div>
          </div>
        )}

        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             <div className="bg-[#181818] p-6 rounded border border-gray-800">
                <p className="text-gray-500 text-xs uppercase font-bold mb-1">Vídeos</p>
                <p className="text-3xl font-black">{videos.length}</p>
             </div>
             <div className="bg-[#181818] p-6 rounded border border-gray-800">
                <p className="text-gray-500 text-xs uppercase font-bold mb-1">Equipe</p>
                <p className="text-3xl font-black">{collaborators.length}</p>
             </div>
             <div className="bg-[#181818] p-6 rounded border border-gray-800">
                <p className="text-gray-500 text-xs uppercase font-bold mb-1">Modo de Operação</p>
                <p className={`text-xl font-bold ${cloudConfig ? 'text-green-500' : 'text-yellow-500'}`}>
                  {cloudConfig ? '● NUVEM ATIVA' : '○ LOCAL (SEM SYNC)'}
                </p>
             </div>
          </div>
        )}

        {activeTab === 'users' && (
           <div className="bg-[#181818] rounded border border-gray-800 overflow-hidden">
             <table className="w-full text-left">
               <thead className="bg-white/5 text-[10px] font-bold uppercase text-gray-500">
                 <tr>
                    <th className="px-6 py-4">Nome</th>
                    <th className="px-6 py-4">E-mail</th>
                    <th className="px-6 py-4 text-right">Ações</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-gray-800">
                 {collaborators.map(u => (
                   <tr key={u.id} className="hover:bg-white/5">
                     <td className="px-6 py-4 font-bold">{u.name}</td>
                     <td className="px-6 py-4 text-gray-400">{u.email}</td>
                     <td className="px-6 py-4 text-right"><button className="text-red-500 font-bold text-xs">REMOVER</button></td>
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
