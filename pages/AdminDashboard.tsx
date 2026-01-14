
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
  
  // Modals
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showCatModal, setShowCatModal] = useState(false);
  
  // Editing States
  const [editingVideo, setEditingVideo] = useState<Video | null>(null);
  const [editingPdf, setEditingPdf] = useState<Pdf | null>(null);
  const [editingCat, setEditingCat] = useState<Category | null>(null);

  // Form States
  const [videoData, setVideoData] = useState({ title: '', description: '', category: '', videoUrl: '', thumbnail: '' });
  const [pdfData, setPdfData] = useState({ title: '', description: '', category: '', fileUrl: '', thumbnail: '' });
  const [catName, setCatName] = useState('');
  const [newUser, setNewUser] = useState({ name: '', email: '', password: '' });
  
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const [cloudForm, setCloudForm] = useState(cloudConfig || { url: '', key: '' });

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
        return prev + 20;
      });
    }, 100);
  };

  const handleSaveCloud = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveCloud(cloudForm);
  };

  const openVideoModal = (video?: Video) => {
    if (video) {
      setEditingVideo(video);
      setVideoData({ title: video.title, description: video.description, category: video.category, videoUrl: video.videoUrl, thumbnail: video.thumbnail });
    } else {
      setEditingVideo(null);
      setVideoData({ title: '', description: '', category: categories[0]?.name || '', videoUrl: '', thumbnail: '' });
    }
    setShowVideoModal(true);
  };

  const openPdfModal = (pdf?: Pdf) => {
    if (pdf) {
      setEditingPdf(pdf);
      setPdfData({ title: pdf.title, description: pdf.description, category: pdf.category, fileUrl: pdf.fileUrl, thumbnail: pdf.thumbnail || '' });
    } else {
      setEditingPdf(null);
      setPdfData({ title: '', description: '', category: categories[0]?.name || '', fileUrl: '', thumbnail: '' });
    }
    setShowPdfModal(true);
  };

  const openCatModal = (cat?: Category) => {
    if (cat) {
      setEditingCat(cat);
      setCatName(cat.name);
    } else {
      setEditingCat(null);
      setCatName('');
    }
    setShowCatModal(true);
  };

  const handleVideoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    simulateUpload(() => {
      const video: Video = {
        id: editingVideo?.id || `v-${Date.now()}`,
        title: videoData.title,
        description: videoData.description,
        videoUrl: videoData.videoUrl || 'https://www.w3schools.com/html/mov_bbb.mp4',
        thumbnail: videoData.thumbnail || `https://picsum.photos/seed/${videoData.title}/800/450`,
        duration: 120,
        category: videoData.category || categories[0]?.name || 'Geral',
        isNew: true,
        createdAt: editingVideo?.createdAt || new Date().toISOString()
      };
      editingVideo ? onEditVideo(video) : onAddVideo(video);
      setShowVideoModal(false);
    });
  };

  const handlePdfSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    simulateUpload(() => {
      const pdf: Pdf = {
        id: editingPdf?.id || `p-${Date.now()}`,
        title: pdfData.title,
        description: pdfData.description,
        fileUrl: pdfData.fileUrl || '#',
        thumbnail: pdfData.thumbnail || `https://picsum.photos/seed/${pdfData.title}/400/600`,
        category: pdfData.category || categories[0]?.name || 'Geral',
        isNew: true,
        createdAt: editingPdf?.createdAt || new Date().toISOString()
      };
      editingPdf ? onEditPdf(pdf) : onAddPdf(pdf);
      setShowPdfModal(false);
    });
  };

  const handleCatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cat: Category = {
      id: editingCat?.id || `c-${Date.now()}`,
      name: catName.trim()
    };
    editingCat ? onEditCategory(cat) : onAddCategory(cat);
    setShowCatModal(false);
  };

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    const user: User = {
      id: `u-${Date.now()}`,
      name: newUser.name.trim(),
      email: newUser.email.toLowerCase().trim(),
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
            <h1 className="text-3xl font-bold mb-2 uppercase tracking-tighter">Gestão BGA</h1>
            <p className="text-gray-500 text-sm">Controle de conteúdos e equipe sincronizado</p>
          </div>
          <div className="flex space-x-4 mt-6 md:mt-0">
            <button onClick={() => openVideoModal()} className="px-6 py-2 bg-[#003376] text-white rounded font-bold hover:brightness-110 transition-all flex items-center gap-2">
              <Icons.Plus /> Vídeo
            </button>
            <button onClick={() => openPdfModal()} className="px-6 py-2 bg-white/10 text-white rounded font-bold hover:bg-white/20 transition-all flex items-center gap-2">
              <Icons.Plus /> PDF
            </button>
          </div>
        </div>

        <div className="flex space-x-8 border-b border-gray-800 mb-10 overflow-x-auto no-scrollbar">
          {[
            { id: 'overview', label: 'Início' },
            { id: 'content', label: 'Vídeos e PDFs' },
            { id: 'categories', label: 'Categorias' },
            { id: 'users', label: 'Equipe' },
            { id: 'cloud', label: 'Nuvem ☁' }
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`pb-4 px-2 font-black text-xs uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === tab.id ? 'text-[#003376] border-b-2 border-[#003376]' : 'text-gray-500 hover:text-white'}`}>
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { label: 'Vídeos', value: videos.length },
              { label: 'Documentos', value: pdfs.length },
              { label: 'Categorias', value: categories.length },
              { label: 'Cloud Status', value: cloudConfig ? 'ONLINE' : 'LOCAL', color: cloudConfig ? 'text-green-500' : 'text-orange-500' }
            ].map((stat, i) => (
              <div key={i} className="bg-[#181818] p-8 rounded-lg border border-gray-800 shadow-xl">
                <div className="text-gray-500 text-[10px] uppercase font-black mb-3 tracking-widest">{stat.label}</div>
                <div className={`text-4xl font-black ${stat.color || 'text-white'}`}>{stat.value}</div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'content' && (
          <div className="space-y-12 animate-in fade-in duration-500">
            <section>
              <h3 className="text-xl font-bold mb-6 uppercase tracking-tight text-gray-400">Vídeos ({videos.length})</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {videos.map(v => (
                  <div key={v.id} className="bg-[#181818] rounded border border-gray-800 overflow-hidden group relative">
                    <img src={v.thumbnail} className="w-full aspect-video object-cover" alt="" />
                    <div className="p-4">
                      <h4 className="font-bold truncate text-sm mb-1">{v.title}</h4>
                      <p className="text-[10px] font-black text-[#003376] uppercase">{v.category}</p>
                    </div>
                    <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-3">
                      <button onClick={() => openVideoModal(v)} className="p-3 bg-white/10 text-white rounded-full hover:bg-white/20 transition-all"><Icons.Edit /></button>
                      <button onClick={() => confirm('Excluir este vídeo?') && onDeleteVideo(v.id)} className="p-3 bg-red-600/20 text-red-500 rounded-full hover:bg-red-600 hover:text-white transition-all"><Icons.Trash /></button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h3 className="text-xl font-bold mb-6 uppercase tracking-tight text-gray-400">Documentos PDFs ({pdfs.length})</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {pdfs.map(p => (
                  <div key={p.id} className="bg-[#181818] rounded border border-gray-800 overflow-hidden group relative">
                    <div className="aspect-video bg-[#222] flex items-center justify-center">
                      {p.thumbnail ? <img src={p.thumbnail} className="w-full h-full object-cover" /> : <div className="text-4xl">📄</div>}
                    </div>
                    <div className="p-4">
                      <h4 className="font-bold truncate text-sm mb-1">{p.title}</h4>
                      <p className="text-[10px] font-black text-[#003376] uppercase">{p.category}</p>
                    </div>
                    <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-3">
                      <button onClick={() => openPdfModal(p)} className="p-3 bg-white/10 text-white rounded-full hover:bg-white/20 transition-all"><Icons.Edit /></button>
                      <button onClick={() => confirm('Excluir este PDF?') && onDeletePdf(p.id)} className="p-3 bg-red-600/20 text-red-500 rounded-full hover:bg-red-600 hover:text-white transition-all"><Icons.Trash /></button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {activeTab === 'categories' && (
          <div className="animate-in fade-in duration-500">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-bold uppercase text-gray-400">Suas Categorias</h3>
              <button onClick={() => openCatModal()} className="px-5 py-2 bg-[#003376] text-white rounded-sm font-bold text-xs uppercase tracking-widest hover:brightness-110 transition-all">Nova Categoria</button>
            </div>
            <div className="bg-[#181818] rounded border border-gray-800">
              <table className="w-full text-left">
                <thead className="bg-white/5 border-b border-gray-800 text-[10px] font-black uppercase text-gray-500 tracking-widest">
                  <tr>
                    <th className="px-8 py-5">Nome da Categoria</th>
                    <th className="px-8 py-5 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800/50">
                  {categories.map(cat => (
                    <tr key={cat.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-8 py-5 font-bold text-sm">{cat.name}</td>
                      <td className="px-8 py-5 text-right space-x-4">
                        <button onClick={() => openCatModal(cat)} className="text-gray-400 hover:text-white font-bold text-[10px] uppercase">Editar</button>
                        <button onClick={() => confirm('Remover categoria?') && onDeleteCategory(cat.id)} className="text-red-500/50 hover:text-red-500 font-bold text-[10px] uppercase">Excluir</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="bg-[#181818] rounded-lg border border-gray-800 overflow-hidden animate-in fade-in duration-500">
            <div className="p-8 border-b border-gray-800 flex justify-between items-center">
              <h3 className="text-xl font-bold uppercase text-gray-400">Equipe BGA</h3>
              <button onClick={() => setShowUserModal(true)} className="px-5 py-2 bg-white/10 text-white rounded-sm font-bold text-xs uppercase tracking-widest hover:bg-white/20 transition-all">Novo Barbeiro</button>
            </div>
            <table className="w-full text-left">
              <thead className="bg-white/5 text-[10px] font-black uppercase text-gray-500 tracking-widest">
                <tr>
                  <th className="px-8 py-5">Barbeiro</th>
                  <th className="px-8 py-5">E-mail</th>
                  <th className="px-8 py-5 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/50">
                {collaborators.map(u => (
                  <tr key={u.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-8 py-5 flex items-center gap-3">
                      <img src={u.avatar} className="w-8 h-8 rounded-full bg-gray-700" />
                      <span className="font-bold text-sm">{u.name}</span>
                    </td>
                    <td className="px-8 py-5 text-gray-500 text-sm">{u.email}</td>
                    <td className="px-8 py-5 text-right">
                      <button onClick={() => confirm('Remover acesso?') && onDeleteCollaborator(u.id)} className="text-red-500/50 hover:text-red-500 font-black text-[10px] uppercase">Remover</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'cloud' && (
          <div className="max-w-2xl bg-[#181818] p-10 rounded-lg border border-gray-800 shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-3 uppercase">☁ Supabase Cloud</h3>
            <p className="text-gray-400 text-sm mb-8 leading-relaxed">Conecte seu banco de dados para sincronização global entre todos os barbeiros.</p>
            <form onSubmit={handleSaveCloud} className="space-y-6">
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase mb-2 tracking-widest">Project URL</label>
                <input required type="text" value={cloudForm.url} onChange={e => setCloudForm({...cloudForm, url: e.target.value})} className="w-full bg-black border border-gray-800 rounded px-4 py-3 text-sm text-blue-400 outline-none focus:border-[#003376]" placeholder="https://xxx.supabase.co" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase mb-2 tracking-widest">API Key (Anon Key)</label>
                <input required type="password" value={cloudForm.key} onChange={e => setCloudForm({...cloudForm, key: e.target.value})} className="w-full bg-black border border-gray-800 rounded px-4 py-3 text-sm text-blue-400 outline-none focus:border-[#003376]" placeholder="eyJh..." />
              </div>
              <button type="submit" className="w-full py-4 bg-[#003376] text-white font-black uppercase tracking-widest rounded hover:brightness-110 transition-all">Salvar Conexão</button>
            </form>
          </div>
        )}
      </div>

      {/* MODAL VÍDEO */}
      {showVideoModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm overflow-y-auto">
          <div className="bg-[#181818] border border-gray-800 rounded-lg w-full max-w-lg p-8 shadow-2xl relative my-8">
            {isUploading && (
              <div className="absolute inset-0 bg-black/95 z-20 flex flex-col items-center justify-center p-8 text-center rounded-lg">
                <h3 className="text-xl font-bold mb-4 uppercase tracking-tighter">Sincronizando Conteúdo...</h3>
                <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden max-w-xs"><div className="h-full bg-blue-500 transition-all duration-300" style={{width: `${uploadProgress}%`}} /></div>
              </div>
            )}
            <h2 className="text-2xl font-bold mb-6 uppercase tracking-tight">{editingVideo ? 'Editar Vídeo' : 'Nova Aula'}</h2>
            <form onSubmit={handleVideoSubmit} className="space-y-4">
              <input required type="text" value={videoData.title} onChange={e => setVideoData({...videoData, title: e.target.value})} className="w-full bg-black/40 border border-gray-800 rounded px-4 py-3 text-white outline-none focus:border-[#003376]" placeholder="Título da Aula" />
              <textarea required rows={3} value={videoData.description} onChange={e => setVideoData({...videoData, description: e.target.value})} className="w-full bg-black/40 border border-gray-800 rounded px-4 py-3 text-white outline-none focus:border-[#003376]" placeholder="O que será ensinado?" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <select value={videoData.category} onChange={e => setVideoData({...videoData, category: e.target.value})} className="w-full bg-black/40 border border-gray-800 rounded px-4 py-3 text-white outline-none focus:border-[#003376]">
                  {categories.map(cat => <option key={cat.id} value={cat.name}>{cat.name}</option>)}
                </select>
                <input type="text" value={videoData.thumbnail} onChange={e => setVideoData({...videoData, thumbnail: e.target.value})} className="w-full bg-black/40 border border-gray-800 rounded px-4 py-3 text-white outline-none focus:border-[#003376]" placeholder="URL da Thumbnail" />
              </div>
              <input type="text" value={videoData.videoUrl} onChange={e => setVideoData({...videoData, videoUrl: e.target.value})} className="w-full bg-black/40 border border-gray-800 rounded px-4 py-3 text-white outline-none focus:border-[#003376]" placeholder="URL do Vídeo (MP4, Vimeo, Youtube)" />
              <div className="flex space-x-4 pt-4">
                <button type="submit" className="flex-grow py-3 bg-[#003376] text-white rounded font-black uppercase tracking-widest hover:brightness-110 transition-all">Salvar</button>
                <button type="button" onClick={() => setShowVideoModal(false)} className="px-6 py-3 bg-white/10 text-white rounded font-bold uppercase text-xs">Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL PDF */}
      {showPdfModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm overflow-y-auto">
          <div className="bg-[#181818] border border-gray-800 rounded-lg w-full max-w-lg p-8 shadow-2xl relative my-8">
            {isUploading && (
              <div className="absolute inset-0 bg-black/95 z-20 flex flex-col items-center justify-center p-8 text-center rounded-lg">
                <h3 className="text-xl font-bold mb-4 uppercase tracking-tighter">Sincronizando PDF...</h3>
                <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden max-w-xs"><div className="h-full bg-blue-500 transition-all duration-300" style={{width: `${uploadProgress}%`}} /></div>
              </div>
            )}
            <h2 className="text-2xl font-bold mb-6 uppercase tracking-tight">{editingPdf ? 'Editar PDF' : 'Novo Documento'}</h2>
            <form onSubmit={handlePdfSubmit} className="space-y-4">
              <input required type="text" value={pdfData.title} onChange={e => setPdfData({...pdfData, title: e.target.value})} className="w-full bg-black/40 border border-gray-800 rounded px-4 py-3 text-white outline-none focus:border-[#003376]" placeholder="Nome do Procedimento" />
              <textarea required rows={3} value={pdfData.description} onChange={e => setPdfData({...pdfData, description: e.target.value})} className="w-full bg-black/40 border border-gray-800 rounded px-4 py-3 text-white outline-none focus:border-[#003376]" placeholder="Descrição rápida" />
              <select value={pdfData.category} onChange={e => setPdfData({...pdfData, category: e.target.value})} className="w-full bg-black/40 border border-gray-800 rounded px-4 py-3 text-white outline-none focus:border-[#003376]">
                {categories.map(cat => <option key={cat.id} value={cat.name}>{cat.name}</option>)}
              </select>
              <input type="text" value={pdfData.fileUrl} onChange={e => setPdfData({...pdfData, fileUrl: e.target.value})} className="w-full bg-black/40 border border-gray-800 rounded px-4 py-3 text-white outline-none focus:border-[#003376]" placeholder="URL do Arquivo PDF" />
              <div className="flex space-x-4 pt-4">
                <button type="submit" className="flex-grow py-3 bg-[#003376] text-white rounded font-black uppercase tracking-widest hover:brightness-110 transition-all">Salvar</button>
                <button type="button" onClick={() => setShowPdfModal(false)} className="px-6 py-3 bg-white/10 text-white rounded font-bold uppercase text-xs">Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL CATEGORIA */}
      {showCatModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
          <div className="bg-[#181818] border border-gray-800 rounded-lg w-full max-w-xs p-8 shadow-2xl">
            <h2 className="text-xl font-bold mb-6 uppercase tracking-tight">{editingCat ? 'Editar Categoria' : 'Nova Categoria'}</h2>
            <form onSubmit={handleCatSubmit} className="space-y-5">
              <input required autoFocus type="text" value={catName} onChange={e => setCatName(e.target.value)} className="w-full bg-black/40 border border-gray-800 rounded px-4 py-3 text-white outline-none focus:border-[#003376]" placeholder="Ex: Cortes Modernos" />
              <div className="flex flex-col gap-2">
                <button type="submit" className="w-full py-3 bg-[#003376] text-white font-black uppercase tracking-widest rounded hover:brightness-110 transition-all">Confirmar</button>
                <button type="button" onClick={() => setShowCatModal(false)} className="w-full py-3 text-gray-500 font-bold uppercase text-[10px]">Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL USER */}
      {showUserModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
          <div className="bg-[#181818] border border-gray-800 rounded-lg w-full max-w-sm p-8 shadow-2xl">
            <h2 className="text-2xl font-bold mb-6 uppercase tracking-tight">Novo Acesso</h2>
            <form onSubmit={handleCreateUser} className="space-y-5">
              <input required autoFocus type="text" value={newUser.name} onChange={e => setNewUser({...newUser, name: e.target.value})} className="w-full bg-black/40 border border-gray-800 rounded px-4 py-3 text-white outline-none focus:border-[#003376]" placeholder="Nome do Barbeiro" />
              <input required type="email" value={newUser.email} onChange={e => setNewUser({...newUser, email: e.target.value})} className="w-full bg-black/40 border border-gray-800 rounded px-4 py-3 text-white outline-none focus:border-[#003376]" placeholder="E-mail" />
              <input required type="password" value={newUser.password} onChange={e => setNewUser({...newUser, password: e.target.value})} className="w-full bg-black/40 border border-gray-800 rounded px-4 py-3 text-white outline-none focus:border-[#003376]" placeholder="Senha de Acesso" />
              <button type="submit" className="w-full py-4 bg-[#003376] text-white font-black uppercase tracking-widest rounded hover:brightness-110 transition-all">Criar Barbeiro</button>
              <button type="button" onClick={() => setShowUserModal(false)} className="w-full py-3 text-gray-500 font-bold">Cancelar</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
