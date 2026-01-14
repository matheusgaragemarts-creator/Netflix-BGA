
import React, { useState, useRef } from 'react';
import { Video, Pdf, User, ProgressState, Role, Category } from '../types.ts';
import { Icons } from '../constants.tsx';

interface AdminDashboardProps {
  videos: Video[];
  pdfs: Pdf[];
  categories: Category[];
  collaborators: User[];
  allProgress: ProgressState;
  onAddVideo: (video: Video) => void;
  onEditVideo: (video: Video) => void;
  onDeleteVideo: (id: string) => void;
  onAddPdf: (pdf: Pdf) => void;
  onEditPdf: (pdf: Pdf) => void;
  onDeletePdf: (id: string) => void;
  onAddCollaborator: (user: User) => void;
  onDeleteCollaborator: (id: string) => void;
  onAddCategory: (cat: Category) => void;
  onEditCategory: (cat: Category) => void;
  onDeleteCategory: (id: string) => void;
  onRestoreBackup: (data: any) => void;
  cloudConfig: any;
  onSaveCloud: (config: any) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
  videos, pdfs, categories, collaborators, allProgress,
  onAddVideo, onEditVideo, onDeleteVideo,
  onAddPdf, onEditPdf, onDeletePdf,
  onAddCollaborator, onDeleteCollaborator,
  onAddCategory, onEditCategory, onDeleteCategory,
  onRestoreBackup, cloudConfig, onSaveCloud
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'content' | 'users' | 'categories' | 'cloud'>('overview');
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showCatModal, setShowCatModal] = useState(false);
  
  const [editingVideoId, setEditingVideoId] = useState<string | null>(null);
  const [editingPdfId, setEditingPdfId] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const [newVideo, setNewVideo] = useState({ title: '', description: '', category: categories[0]?.name || '' });
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoThumbnail, setVideoThumbnail] = useState<File | null>(null);
  
  const [newPdf, setNewPdf] = useState({ title: '', description: '', category: categories[0]?.name || '' });
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfThumbnail, setPdfThumbnail] = useState<File | null>(null);

  const [newUser, setNewUser] = useState({ name: '', email: '', password: '' });
  const [newCat, setNewCat] = useState({ id: '', name: '' });
  const [isEditingCat, setIsEditingCat] = useState(false);

  const [cloudForm, setCloudForm] = useState(cloudConfig || { url: '', key: '' });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const simulateUpload = (callback: () => void) => {
    setIsUploading(true);
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => { setIsUploading(false); callback(); }, 500);
          return 100;
        }
        return prev + 15;
      });
    }, 150);
  };

  const handleExportBackup = () => {
    const backupData = { videos, pdfs, categories, collaborators, progress: allProgress, exportDate: new Date().toISOString() };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `bga_backup_${new Date().toLocaleDateString().replace(/\//g, '-')}.json`;
    link.click();
  };

  const handleSaveCloud = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveCloud(cloudForm);
  };

  const handleCreateVideo = (e: React.FormEvent) => {
    e.preventDefault();
    if (categories.length === 0) return alert('Crie uma categoria antes de adicionar vídeos.');
    simulateUpload(() => {
      const existing = videos.find(v => v.id === editingVideoId);
      const video: Video = {
        id: editingVideoId || `v-${Date.now()}`,
        title: newVideo.title,
        description: newVideo.description,
        videoUrl: videoFile ? URL.createObjectURL(videoFile) : (existing?.videoUrl || ''),
        thumbnail: videoThumbnail ? URL.createObjectURL(videoThumbnail) : (existing?.thumbnail || `https://picsum.photos/seed/${newVideo.title}/800/450`),
        duration: 120,
        category: newVideo.category || categories[0].name,
        isNew: true,
        createdAt: new Date().toISOString()
      };
      editingVideoId ? onEditVideo(video) : onAddVideo(video);
      setShowVideoModal(false); setEditingVideoId(null);
    });
  };

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    const normalizedEmail = newUser.email.toLowerCase().trim();
    const user: User = {
      id: `u-${Date.now()}`,
      name: newUser.name.trim(),
      email: normalizedEmail,
      password: newUser.password, 
      role: Role.COLABORADOR,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(newUser.name)}&background=003376&color=fff`
    };
    onAddCollaborator(user);
    setShowUserModal(false);
    setNewUser({ name: '', email: '', password: '' });
  };

  return (
    <div className="min-h-screen bg-black pt-24 md:pt-32 px-4 md:px-12 pb-20">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-12">
          <div>
            <h1 className="text-3xl font-bold mb-2 uppercase tracking-tighter">Gestão da Barbearia</h1>
            <p className="text-gray-500 text-sm">Controle de conteúdos e sincronização em tempo real</p>
          </div>
          <div className="flex space-x-4 mt-6 md:mt-0">
            <button onClick={() => { setEditingVideoId(null); setShowVideoModal(true); }} className="px-6 py-2 bg-[#003376] text-white rounded font-bold hover:brightness-110 transition-all">Novo Vídeo</button>
            <button onClick={() => { setEditingPdfId(null); setShowPdfModal(true); }} className="px-6 py-2 bg-white/10 text-white rounded font-bold">Novo PDF</button>
          </div>
        </div>

        <div className="flex space-x-8 border-b border-gray-800 mb-10 overflow-x-auto no-scrollbar">
          {[
            { id: 'overview', label: 'Início' },
            { id: 'content', label: 'Vídeos/PDFs' },
            { id: 'categories', label: 'Categorias' },
            { id: 'users', label: 'Equipe' },
            { id: 'cloud', label: 'Configurar Nuvem ☁' }
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`pb-4 px-2 font-black text-xs uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === tab.id ? 'text-[#003376] border-b-2 border-[#003376]' : 'text-gray-500 hover:text-white'}`}>
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { label: 'Aulas', value: videos.length },
              { label: 'Barbeiros', value: collaborators.length },
              { label: 'Categorias', value: categories.length },
              { label: 'Cloud Status', value: cloudConfig ? 'ONLINE' : 'OFFLINE', color: cloudConfig ? 'text-green-500' : 'text-red-500' }
            ].map((stat, i) => (
              <div key={i} className="bg-[#181818] p-8 rounded-lg border border-gray-800 shadow-xl">
                <div className="text-gray-500 text-[10px] uppercase font-black mb-3 tracking-widest">{stat.label}</div>
                <div className={`text-4xl font-black ${stat.color || 'text-white'}`}>{stat.value}</div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'cloud' && (
          <div className="max-w-2xl bg-[#181818] p-10 rounded-lg border border-gray-800 shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-3 uppercase">
              <span className="p-2 bg-blue-500/10 rounded-md">☁</span>
              Conectar ao Supabase
            </h3>
            <p className="text-gray-400 text-sm mb-8 leading-relaxed">
              Para que os conteúdos sincronizem automaticamente entre todos os aparelhos, insira as chaves do seu projeto Supabase.
            </p>
            <form onSubmit={handleSaveCloud} className="space-y-6">
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase mb-2 tracking-widest">Project URL</label>
                <input required type="text" value={cloudForm.url} onChange={e => setCloudForm({...cloudForm, url: e.target.value})} className="w-full bg-black border border-gray-800 rounded px-4 py-3 text-sm text-blue-400 outline-none focus:border-[#003376]" placeholder="https://xxx.supabase.co" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase mb-2 tracking-widest">API Key (Anon Key)</label>
                <input required type="password" value={cloudForm.key} onChange={e => setCloudForm({...cloudForm, key: e.target.value})} className="w-full bg-black border border-gray-800 rounded px-4 py-3 text-sm text-blue-400 outline-none focus:border-[#003376]" placeholder="eyJh..." />
              </div>
              <button type="submit" className="w-full py-4 bg-[#003376] text-white font-black uppercase tracking-widest rounded hover:brightness-110 active:scale-95 transition-all">
                Salvar e Conectar
              </button>
            </form>
          </div>
        )}

        {activeTab === 'content' && (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {videos.map(v => (
              <div key={v.id} className="bg-[#181818] rounded border border-gray-800 overflow-hidden group relative">
                <img src={v.thumbnail} className="w-full aspect-video object-cover" alt="" />
                <div className="p-4">
                  <h4 className="font-bold truncate text-sm mb-1">{v.title}</h4>
                  <p className="text-[10px] font-black text-[#003376] uppercase">{v.category}</p>
                </div>
                <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-4">
                  <button onClick={() => confirm('Excluir?') && onDeleteVideo(v.id)} className="p-3 bg-red-600/20 text-red-500 rounded-full hover:bg-red-600 hover:text-white transition-all"><Icons.Trash /></button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'users' && (
          <div className="bg-[#181818] rounded-lg border border-gray-800 overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-white/5 text-[10px] font-black uppercase text-gray-500 tracking-widest">
                <tr>
                  <th className="px-8 py-5">Barbeiro</th>
                  <th className="px-8 py-5">Acesso</th>
                  <th className="px-8 py-5 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/50">
                {collaborators.map(u => (
                  <tr key={u.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-8 py-5 font-bold text-sm">{u.name}</td>
                    <td className="px-8 py-5 text-gray-500 text-sm">{u.email}</td>
                    <td className="px-8 py-5 text-right">
                      <button onClick={() => onDeleteCollaborator(u.id)} className="text-red-500/50 hover:text-red-500 font-black text-[10px] uppercase transition-all">Remover</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MODAL VÍDEO (REUTILIZADO) */}
      {showVideoModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#181818] border border-gray-800 rounded-lg w-full max-w-lg p-8 shadow-2xl relative overflow-hidden">
            {isUploading && (
              <div className="absolute inset-0 bg-black/95 z-20 flex flex-col items-center justify-center p-8 text-center">
                <h3 className="text-xl font-bold mb-4 uppercase tracking-tighter">Sincronizando com a Nuvem...</h3>
                <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden"><div className="h-full bg-blue-500" style={{width: `${uploadProgress}%`}} /></div>
              </div>
            )}
            <h2 className="text-2xl font-bold mb-6 uppercase tracking-tight">Nova Aula</h2>
            <form onSubmit={handleCreateVideo} className="space-y-4">
              <input required type="text" value={newVideo.title} onChange={(e) => setNewVideo({...newVideo, title: e.target.value})} className="w-full bg-black/40 border border-gray-800 rounded px-4 py-3 text-white outline-none focus:border-[#003376]" placeholder="Título" />
              <textarea required rows={2} value={newVideo.description} onChange={(e) => setNewVideo({...newVideo, description: e.target.value})} className="w-full bg-black/40 border border-gray-800 rounded px-4 py-3 text-white outline-none focus:border-[#003376]" placeholder="Descrição" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <select value={newVideo.category} onChange={(e) => setNewVideo({...newVideo, category: e.target.value})} className="w-full bg-black/40 border border-gray-800 rounded px-4 py-3 text-white outline-none">
                  {categories.map(cat => <option key={cat.id} value={cat.name}>{cat.name}</option>)}
                </select>
                <div className="flex items-center justify-center border border-dashed border-gray-700 rounded p-2 text-[10px] text-gray-500">Thumbnail Automática</div>
              </div>
              <div className="flex space-x-4 pt-4">
                <button type="submit" className="flex-grow py-3 bg-[#003376] text-white rounded font-black uppercase tracking-widest hover:brightness-110">Salvar Aula</button>
                <button type="button" onClick={() => setShowVideoModal(false)} className="px-6 py-3 bg-white/10 text-white rounded font-bold">Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL USER (EQUIPE) */}
      {showUserModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#181818] border border-gray-800 rounded-lg w-full max-w-sm p-8 shadow-2xl">
            <h2 className="text-2xl font-bold mb-6 uppercase tracking-tight">Cadastrar Barbeiro</h2>
            <form onSubmit={handleCreateUser} className="space-y-5">
              <input required autoFocus type="text" value={newUser.name} onChange={(e) => setNewUser({...newUser, name: e.target.value})} className="w-full bg-black/40 border border-gray-800 rounded px-4 py-3 text-white outline-none focus:border-[#003376]" placeholder="Nome Completo" />
              <input required type="email" value={newUser.email} onChange={(e) => setNewUser({...newUser, email: e.target.value})} className="w-full bg-black/40 border border-gray-800 rounded px-4 py-3 text-white outline-none focus:border-[#003376]" placeholder="E-mail de Acesso" />
              <input required type="password" value={newUser.password} onChange={(e) => setNewUser({...newUser, password: e.target.value})} className="w-full bg-black/40 border border-gray-800 rounded px-4 py-3 text-white outline-none focus:border-[#003376]" placeholder="Definir Senha" />
              <button type="submit" className="w-full py-4 bg-[#003376] text-white font-black uppercase tracking-widest rounded hover:brightness-110 transition-all">Criar Acesso</button>
              <button type="button" onClick={() => setShowUserModal(false)} className="w-full py-3 text-gray-500 font-bold">Cancelar</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
