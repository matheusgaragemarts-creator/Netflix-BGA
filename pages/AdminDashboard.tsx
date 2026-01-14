
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
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
  videos, 
  pdfs, 
  categories,
  collaborators, 
  allProgress,
  onAddVideo,
  onEditVideo,
  onDeleteVideo,
  onAddPdf,
  onEditPdf,
  onDeletePdf,
  onAddCollaborator,
  onDeleteCollaborator,
  onAddCategory,
  onEditCategory,
  onDeleteCategory,
  onRestoreBackup
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'content' | 'users' | 'categories'>('overview');
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

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        if (confirm('Restaurar este backup substituirá todos os dados atuais. Deseja continuar?')) onRestoreBackup(data);
      } catch (err) { alert('Arquivo de backup inválido.'); }
    };
    reader.readAsText(file);
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

  const handleCreatePdf = (e: React.FormEvent) => {
    e.preventDefault();
    if (categories.length === 0) return alert('Crie uma categoria antes de adicionar PDFs.');
    simulateUpload(() => {
      const existing = pdfs.find(p => p.id === editingPdfId);
      const pdf: Pdf = {
        id: editingPdfId || `p-${Date.now()}`,
        title: newPdf.title,
        description: newPdf.description,
        fileUrl: pdfFile ? URL.createObjectURL(pdfFile) : (existing?.fileUrl || ''),
        category: newPdf.category || categories[0].name,
        isNew: true,
        createdAt: new Date().toISOString(),
        thumbnail: pdfThumbnail ? URL.createObjectURL(pdfThumbnail) : (existing?.thumbnail || 'https://picsum.photos/seed/doc/400/225'),
      };
      editingPdfId ? onEditPdf(pdf) : onAddPdf(pdf);
      setShowPdfModal(false); setEditingPdfId(null);
    });
  };

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    // Normalização Crítica: E-mail sempre minúsculo e sem espaços
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
    alert(`Acesso criado com sucesso para ${user.name}!`);
  };

  const startEditCategory = (cat: Category) => {
    setNewCat(cat); setIsEditingCat(true); setShowCatModal(true);
  };

  const handleSaveCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditingCat) onEditCategory(newCat as Category);
    else onAddCategory({ id: `cat-${Date.now()}`, name: newCat.name });
    setShowCatModal(false); setNewCat({ id: '', name: '' }); setIsEditingCat(false);
  };

  return (
    <div className="min-h-screen bg-black pt-24 md:pt-32 px-4 md:px-12 pb-20">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-12">
          <div>
            <h1 className="text-3xl font-bold mb-2">Painel Administrativo</h1>
            <p className="text-gray-400">Configuração inicial e gestão de conteúdos da Barbearia BGA</p>
          </div>
          <div className="flex space-x-4 mt-6 md:mt-0">
            <button onClick={() => { setEditingVideoId(null); setShowVideoModal(true); }} className="px-6 py-2 bg-[#003376] text-white rounded font-bold">Novo Vídeo</button>
            <button onClick={() => { setEditingPdfId(null); setShowPdfModal(true); }} className="px-6 py-2 bg-white/10 text-white rounded font-bold">Novo PDF</button>
          </div>
        </div>

        <div className="flex space-x-8 border-b border-gray-800 mb-10 overflow-x-auto">
          {['overview', 'content', 'categories', 'users'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab as any)} className={`pb-4 px-2 font-bold capitalize transition-all ${activeTab === tab ? 'text-[#003376] border-b-2 border-[#003376]' : 'text-gray-500 hover:text-white'}`}>
              {tab === 'overview' ? 'Visão Geral' : tab === 'content' ? 'Conteúdos' : tab === 'categories' ? 'Categorias' : 'Equipe'}
            </button>
          ))}
        </div>

        {activeTab === 'overview' && (
          <div className="space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { label: 'Vídeos', value: videos.length },
                { label: 'PDFs', value: pdfs.length },
                { label: 'Equipe', value: collaborators.length },
                { label: 'Categorias', value: categories.length }
              ].map((stat, i) => (
                <div key={i} className="bg-[#181818] p-6 rounded-lg border border-gray-800">
                  <div className="text-gray-500 text-[10px] uppercase font-bold mb-2 tracking-widest">{stat.label}</div>
                  <div className="text-3xl font-black">{stat.value}</div>
                </div>
              ))}
            </div>

            <div className="bg-[#181818] rounded-lg border border-gray-800 p-8">
              <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-blue-500/10 text-blue-500 rounded-full">⚡</div>
                  <div>
                    <h3 className="text-xl font-bold">Manutenção e Segurança</h3>
                    <p className="text-gray-400 text-sm">Use o backup para salvar seu trabalho externamente.</p>
                  </div>
                </div>
                <div className="flex space-x-4">
                  <input type="file" accept=".json" className="hidden" ref={fileInputRef} onChange={handleImportBackup} />
                  <button onClick={() => fileInputRef.current?.click()} className="px-6 py-2 bg-white/5 border border-gray-800 rounded font-bold text-sm">Importar</button>
                  <button onClick={handleExportBackup} className="px-6 py-2 bg-[#003376] text-white rounded font-bold text-sm">Exportar Backup</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'content' && (
          <div className="space-y-8">
             <section>
              <h3 className="text-xl font-bold mb-6">Todos os Vídeos ({videos.length})</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {videos.length === 0 ? (
                  <p className="text-gray-600 italic">Nenhum vídeo cadastrado.</p>
                ) : (
                  videos.map(v => (
                    <div key={v.id} className="bg-[#181818] rounded border border-gray-800 overflow-hidden group">
                      <div className="relative h-40">
                        <img src={v.thumbnail} className="w-full h-full object-cover" alt="" />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center space-x-4 transition-opacity">
                          <button onClick={() => { setEditingVideoId(v.id); setNewVideo({title: v.title, description: v.description, category: v.category}); setShowVideoModal(true); }} className="p-2 bg-white text-black rounded-full"><Icons.Edit /></button>
                          <button onClick={() => confirm('Excluir?') && onDeleteVideo(v.id)} className="p-2 bg-red-600 text-white rounded-full"><Icons.Trash /></button>
                        </div>
                      </div>
                      <div className="p-4">
                        <h4 className="font-bold truncate">{v.title}</h4>
                        <span className="text-[10px] text-[#003376] font-bold uppercase">{v.category}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>
          </div>
        )}

        {activeTab === 'categories' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold">Categorias do Sistema</h3>
              <button onClick={() => { setIsEditingCat(false); setNewCat({id: '', name: ''}); setShowCatModal(true); }} className="px-4 py-2 bg-[#003376] text-white rounded font-bold flex items-center space-x-2"><Icons.Plus /> <span>Nova Categoria</span></button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {categories.map(cat => (
                <div key={cat.id} className="bg-[#181818] p-4 rounded border border-gray-800 flex justify-between items-center group">
                  <span className="font-bold">{cat.name}</span>
                  <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => startEditCategory(cat)} className="text-gray-400 hover:text-white"><Icons.Edit /></button>
                    <button onClick={() => confirm('Excluir?') && onDeleteCategory(cat.id)} className="text-gray-400 hover:text-red-500"><Icons.Trash /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold">Equipe da Barbearia</h3>
              <button onClick={() => setShowUserModal(true)} className="px-4 py-2 bg-[#003376] text-white rounded font-bold flex items-center space-x-2"><Icons.Plus /> <span>Novo Barbeiro</span></button>
            </div>
            <div className="bg-[#181818] rounded-lg border border-gray-800 overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-white/5 text-gray-400 text-xs uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-4">Barbeiro</th>
                    <th className="px-6 py-4">E-mail de Acesso</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {collaborators.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center text-gray-500 italic">Nenhum barbeiro cadastrado além do administrador.</td>
                    </tr>
                  ) : (
                    collaborators.map(user => (
                      <tr key={user.id} className="hover:bg-white/5 transition-colors group">
                        <td className="px-6 py-4 flex items-center space-x-3">
                          <img src={user.avatar} className="w-8 h-8 rounded-full border border-gray-700" alt="" />
                          <span className="font-bold text-sm">{user.name}</span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-400">{user.email}</td>
                        <td className="px-6 py-4">
                          <span className="px-2 py-0.5 bg-green-500/10 text-green-500 text-[10px] font-bold rounded">ATIVO</span>
                        </td>
                        <td className="px-6 py-4">
                          <button onClick={() => confirm(`Remover acesso de ${user.name}?`) && onDeleteCollaborator(user.id)} className="text-gray-500 hover:text-red-500 transition-colors">
                            <Icons.Trash />
                          </button>
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

      {/* MODAL CATEGORIA */}
      {showCatModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#181818] border border-gray-800 rounded-lg w-full max-w-sm p-8 shadow-2xl">
            <h2 className="text-2xl font-bold mb-6">{isEditingCat ? 'Editar' : 'Nova'} Categoria</h2>
            <form onSubmit={handleSaveCategory} className="space-y-6">
              <input required autoFocus type="text" value={newCat.name} onChange={(e) => setNewCat({...newCat, name: e.target.value})} className="w-full bg-black/40 border border-gray-800 rounded px-4 py-3 text-white outline-none focus:border-[#003376]" placeholder="Ex: Técnicas, Barba, etc." />
              <div className="flex space-x-4">
                <button type="submit" className="flex-grow py-3 bg-[#003376] text-white rounded font-bold">Salvar</button>
                <button type="button" onClick={() => setShowCatModal(false)} className="px-6 py-3 bg-white/10 text-white rounded font-bold">Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL VÍDEO */}
      {showVideoModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#181818] border border-gray-800 rounded-lg w-full max-w-lg p-8 shadow-2xl relative overflow-hidden">
            {isUploading && (
              <div className="absolute inset-0 bg-black/90 z-20 flex flex-col items-center justify-center p-8 text-center">
                <h3 className="text-xl font-bold mb-4">Salvando Treinamento...</h3>
                <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden"><div className="h-full bg-[#003376]" style={{width: `${uploadProgress}%`}} /></div>
              </div>
            )}
            <h2 className="text-2xl font-bold mb-6">{editingVideoId ? 'Editar' : 'Novo'} Vídeo</h2>
            {categories.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-yellow-500 mb-4 font-bold">Atenção: Você não tem categorias criadas.</p>
                <button type="button" onClick={() => { setShowVideoModal(false); setShowCatModal(true); }} className="text-[#003376] underline">Clique aqui para criar uma categoria primeiro.</button>
              </div>
            ) : (
              <form onSubmit={handleCreateVideo} className="space-y-4">
                <input required type="text" value={newVideo.title} onChange={(e) => setNewVideo({...newVideo, title: e.target.value})} className="w-full bg-black/40 border border-gray-800 rounded px-4 py-3 text-white outline-none" placeholder="Título" />
                <textarea required rows={2} value={newVideo.description} onChange={(e) => setNewVideo({...newVideo, description: e.target.value})} className="w-full bg-black/40 border border-gray-800 rounded px-4 py-3 text-white outline-none" placeholder="Descrição" />
                <div className="grid grid-cols-2 gap-4">
                  <select value={newVideo.category} onChange={(e) => setNewVideo({...newVideo, category: e.target.value})} className="w-full bg-black/40 border border-gray-800 rounded px-4 py-3 text-white outline-none">
                    {categories.map(cat => <option key={cat.id} value={cat.name}>{cat.name}</option>)}
                  </select>
                  <input type="file" accept="video/*" onChange={(e) => setVideoFile(e.target.files?.[0] || null)} className="w-full bg-black/40 border border-gray-800 rounded px-2 py-2 text-[10px]" />
                </div>
                <input type="file" accept="image/*" onChange={(e) => setVideoThumbnail(e.target.files?.[0] || null)} className="w-full bg-black/40 border border-gray-800 rounded px-2 py-2 text-[10px]" />
                <div className="flex space-x-4 pt-4">
                  <button type="submit" className="flex-grow py-3 bg-[#003376] text-white rounded font-bold">Salvar</button>
                  <button type="button" onClick={() => setShowVideoModal(false)} className="px-6 py-3 bg-white/10 text-white rounded font-bold">Cancelar</button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* MODAL USER (EQUIPE) */}
      {showUserModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#181818] border border-gray-800 rounded-lg w-full max-w-sm p-8 shadow-2xl">
            <h2 className="text-2xl font-bold mb-6">Cadastrar Barbeiro</h2>
            <form onSubmit={handleCreateUser} className="space-y-5">
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-2">Nome do Barbeiro</label>
                <input required autoFocus type="text" value={newUser.name} onChange={(e) => setNewUser({...newUser, name: e.target.value})} className="w-full bg-black/40 border border-gray-800 rounded px-4 py-3 text-white outline-none focus:border-[#003376]" placeholder="Ex: João da Silva" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-2">E-mail de Acesso</label>
                <input required type="email" value={newUser.email} onChange={(e) => setNewUser({...newUser, email: e.target.value})} className="w-full bg-black/40 border border-gray-800 rounded px-4 py-3 text-white outline-none focus:border-[#003376]" placeholder="joao@bga.com" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-2">Definir Senha</label>
                <input required type="password" value={newUser.password} onChange={(e) => setNewUser({...newUser, password: e.target.value})} className="w-full bg-black/40 border border-gray-800 rounded px-4 py-3 text-white outline-none focus:border-[#003376]" placeholder="Senha de acesso" />
              </div>
              <p className="text-[10px] text-gray-500 italic">Nota: Certifique-se de informar ao barbeiro a senha definida.</p>
              <div className="flex space-x-4 pt-4">
                <button type="submit" className="flex-grow py-3 bg-[#003376] text-white rounded font-bold hover:bg-[#001a3d] transition-colors">Criar Acesso</button>
                <button type="button" onClick={() => setShowUserModal(false)} className="px-6 py-3 bg-white/10 text-white rounded font-bold">Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
