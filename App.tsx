
import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation, Location, NavigateFunction } from 'react-router-dom';
import { User, Role, ProgressState, Video, Pdf, Quiz, Category } from './types.ts';
import { DEFAULT_ADMIN, MOCK_VIDEOS, MOCK_PDFS, MOCK_QUIZ, MOCK_CATEGORIES, Icons } from './constants.tsx';
import Home from './pages/Home.tsx';
import VideoPlayer from './pages/VideoPlayer.tsx';
import PdfViewer from './pages/PdfViewer.tsx';
import QuizView from './pages/QuizView.tsx';
import AdminDashboard from './pages/AdminDashboard.tsx';
import Login from './pages/Login.tsx';
import MyProgress from './pages/MyProgress.tsx';
import Videos from './pages/Videos.tsx';
import Pops from './pages/Pops.tsx';
import SearchResults from './pages/SearchResults.tsx';
import { initSupabase, syncTable, saveToCloud, deleteFromCloud } from './services/supabaseService.ts';

const ProtectedRoute: React.FC<{ children: React.ReactNode; roles?: Role[]; user: User | null }> = ({ children, roles, user }) => {
  if (!user) return <Navigate to="/login" />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/home" />;
  return <>{children}</>;
};

const Navbar: React.FC<{ 
  user: User | null; 
  location: Location; 
  navigate: NavigateFunction; 
  handleLogout: () => void;
  isCloudActive: boolean;
}> = ({ user, location, navigate, handleLogout, isCloudActive }) => {
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  if (!user || location.pathname === '/login') return null;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchVisible(false);
      setSearchQuery('');
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-between px-4 md:px-12 py-3 md:py-5 bg-gradient-to-b from-black/90 via-black/40 to-transparent transition-all duration-300 backdrop-blur-[2px]">
      <div className="flex items-center space-x-6 md:space-x-10">
        <div 
          onClick={() => navigate(user.role === Role.ADMIN ? '/admin' : '/home')}
          className="text-[#003376] font-black text-xl md:text-3xl cursor-pointer tracking-tighter hover:brightness-125 transition-all flex items-center gap-2"
        >
          NETFLIX BGA
          {isCloudActive && <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_5px_rgba(34,197,94,0.8)]" title="Nuvem Conectada"></div>}
        </div>
        <div className="hidden lg:flex items-center space-x-6 text-sm font-semibold">
          <button onClick={() => navigate('/home')} className={`transition-colors hover:text-gray-300 ${location.pathname === '/home' ? 'text-white' : 'text-gray-400'}`}>Início</button>
          <button onClick={() => navigate('/videos')} className={`transition-colors hover:text-gray-300 ${location.pathname === '/videos' ? 'text-white' : 'text-gray-400'}`}>Vídeos</button>
          <button onClick={() => navigate('/pops')} className={`transition-colors hover:text-gray-300 ${location.pathname === '/pops' ? 'text-white' : 'text-gray-400'}`}>POPs</button>
          <button onClick={() => navigate('/meu-progresso')} className={`transition-colors hover:text-gray-300 ${location.pathname === '/meu-progresso' ? 'text-white' : 'text-gray-400'}`}>Meu Progresso</button>
          {user.role === Role.ADMIN && (
            <button onClick={() => navigate('/admin')} className={`transition-colors hover:text-gray-300 ${location.pathname === '/admin' ? 'text-white' : 'text-gray-400'}`}>Admin</button>
          )}
        </div>
      </div>

      <div className="flex items-center space-x-4 md:space-x-6">
        <div className="relative flex items-center group">
          <button onClick={() => setIsSearchVisible(!isSearchVisible)} className="text-white hover:text-[#003376] transition-colors p-1"><Icons.Search /></button>
          {isSearchVisible && (
            <form onSubmit={handleSearchSubmit}>
              <input
                type="text"
                placeholder="Títulos, aulas..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-black/80 border border-white/20 text-white text-sm px-3 py-1.5 transition-all outline-none rounded-sm w-40 md:w-64"
                autoFocus
                onBlur={() => !searchQuery && setIsSearchVisible(false)}
              />
            </form>
          )}
        </div>
        <button className="text-white hover:text-[#003376] transition-colors"><Icons.Bell /></button>
        <div className="relative group cursor-pointer">
          <img src={user.avatar} className="w-8 h-8 rounded-sm ring-1 ring-white/20 group-hover:ring-[#003376] transition-all" alt="profile" />
          <div className="absolute right-0 mt-3 w-56 bg-[#181818] border border-gray-800 rounded shadow-2xl hidden group-hover:block overflow-hidden transition-all animate-in fade-in slide-in-from-top-2">
            <div className="p-4 border-b border-gray-800 text-sm bg-black/20">
              <p className="font-bold text-white truncate">{user.name}</p>
              <p className="text-gray-500 text-xs truncate">{user.email}</p>
            </div>
            <div className="p-1">
               <button onClick={handleLogout} className="w-full text-left p-3 hover:bg-[#003376]/20 hover:text-white text-gray-400 text-sm flex items-center space-x-3 transition-colors rounded-sm">
                <Icons.Logout />
                <span className="font-medium">Sair da BGA</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

const App: React.FC = () => {
  const getInitial = (key: string, defaultValue: any) => {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : defaultValue;
  };

  const [supabaseConfig, setSupabaseConfig] = useState(() => getInitial('bga_supabase_config', null));
  const [user, setUser] = useState<User | null>(() => getInitial('bga_user', null));
  const [videos, setVideos] = useState<Video[]>(() => getInitial('bga_videos', MOCK_VIDEOS));
  const [pdfs, setPdfs] = useState<Pdf[]>(() => getInitial('bga_pdfs', MOCK_PDFS));
  const [categories, setCategories] = useState<Category[]>(() => getInitial('bga_categories', MOCK_CATEGORIES));
  const [collaborators, setCollaborators] = useState<User[]>(() => getInitial('bga_colabs', []));
  const [progress, setProgress] = useState<ProgressState>(() => getInitial('bga_progress', {
    videos: {}, pdfs: {}, quizzes: []
  }));

  const navigate = useNavigate();
  const location = useLocation();

  // Inicializar e Sincronizar Supabase
  useEffect(() => {
    if (supabaseConfig?.url && supabaseConfig?.key) {
      const success = initSupabase(supabaseConfig.url, supabaseConfig.key);
      if (success) {
        const unsubVideos = syncTable('videos', (data) => setVideos(data));
        const unsubPdfs = syncTable('pdfs', (data) => setPdfs(data));
        const unsubCats = syncTable('categories', (data) => setCategories(data));
        const unsubUsers = syncTable('users', (data) => setCollaborators(data));
        
        return () => {
          unsubVideos(); unsubPdfs(); unsubCats(); unsubUsers();
        };
      }
    }
  }, [supabaseConfig]);

  useEffect(() => { localStorage.setItem('bga_progress', JSON.stringify(progress)); }, [progress]);
  
  // Persistência local como fallback
  useEffect(() => {
    if (!supabaseConfig) {
      localStorage.setItem('bga_videos', JSON.stringify(videos));
      localStorage.setItem('bga_pdfs', JSON.stringify(pdfs));
      localStorage.setItem('bga_categories', JSON.stringify(categories));
      localStorage.setItem('bga_colabs', JSON.stringify(collaborators));
    }
  }, [videos, pdfs, categories, collaborators, supabaseConfig]);

  const handleLogin = (selectedUser: User) => {
    setUser(selectedUser);
    localStorage.setItem('bga_user', JSON.stringify(selectedUser));
    navigate(selectedUser.role === Role.ADMIN ? '/admin' : '/home');
  };

  const handleRegister = async (newUser: User) => {
    setCollaborators(prev => [...prev, newUser]);
    if (supabaseConfig) await saveToCloud('users', newUser);
    setUser(newUser);
    localStorage.setItem('bga_user', JSON.stringify(newUser));
    navigate('/home');
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('bga_user');
    navigate('/login');
  };

  const updateCloudConfig = (config: { url: string; key: string }) => {
    setSupabaseConfig(config);
    localStorage.setItem('bga_supabase_config', JSON.stringify(config));
    alert('Conexão Cloud configurada com sucesso!');
    window.location.reload();
  };

  // Funções CRUD com Nuvem
  const handleAddVideo = async (newVideo: Video) => {
    setVideos(prev => [newVideo, ...prev]);
    if (supabaseConfig) await saveToCloud('videos', newVideo);
  };
  const handleEditVideo = async (updated: Video) => {
    setVideos(prev => prev.map(v => v.id === updated.id ? updated : v));
    if (supabaseConfig) await saveToCloud('videos', updated);
  };
  const handleDeleteVideo = async (id: string) => {
    setVideos(prev => prev.filter(v => v.id !== id));
    if (supabaseConfig) await deleteFromCloud('videos', id);
  };

  const handleAddPdf = async (newPdf: Pdf) => {
    setPdfs(prev => [newPdf, ...prev]);
    if (supabaseConfig) await saveToCloud('pdfs', newPdf);
  };
  const handleEditPdf = async (updated: Pdf) => {
    setPdfs(prev => prev.map(p => p.id === updated.id ? updated : p));
    if (supabaseConfig) await saveToCloud('pdfs', updated);
  };
  const handleDeletePdf = async (id: string) => {
    setPdfs(prev => prev.filter(p => p.id !== id));
    if (supabaseConfig) await deleteFromCloud('pdfs', id);
  };

  const handleAddCollaborator = async (newColab: User) => {
    setCollaborators(prev => [...prev, newColab]);
    if (supabaseConfig) await saveToCloud('users', newColab);
  };
  const handleDeleteCollaborator = async (id: string) => {
    setCollaborators(prev => prev.filter(c => c.id !== id));
    if (supabaseConfig) await deleteFromCloud('users', id);
  };

  const handleAddCategory = async (newCat: Category) => {
    setCategories(prev => [...prev, newCat]);
    if (supabaseConfig) await saveToCloud('categories', newCat);
  };
  const handleEditCategory = async (updatedCat: Category) => {
    setCategories(prev => prev.map(c => c.id === updatedCat.id ? updatedCat : c));
    if (supabaseConfig) await saveToCloud('categories', updatedCat);
  };
  const handleDeleteCategory = async (catId: string) => {
    setCategories(prev => prev.filter(c => c.id !== catId));
    if (supabaseConfig) await deleteFromCloud('categories', catId);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#141414]">
      <Navbar 
        user={user} 
        location={location} 
        navigate={navigate} 
        handleLogout={handleLogout} 
        isCloudActive={!!supabaseConfig}
      />
      <main className="flex-grow">
        <Routes>
          <Route path="/login" element={<Login onLogin={handleLogin} onRegister={handleRegister} collaborators={collaborators} onSaveCloud={updateCloudConfig} currentConfig={supabaseConfig} />} />
          <Route path="/home" element={<ProtectedRoute user={user}><Home videos={videos} pdfs={pdfs} progress={progress} /></ProtectedRoute>} />
          <Route path="/videos" element={<ProtectedRoute user={user}><Videos videos={videos} categories={categories} progress={progress} /></ProtectedRoute>} />
          <Route path="/pops" element={<ProtectedRoute user={user}><Pops pdfs={pdfs} progress={progress} /></ProtectedRoute>} />
          <Route path="/search" element={<ProtectedRoute user={user}><SearchResults videos={videos} pdfs={pdfs} progress={progress} /></ProtectedRoute>} />
          <Route path="/meu-progresso" element={<ProtectedRoute user={user}><MyProgress progress={progress} videos={videos} pdfs={pdfs} /></ProtectedRoute>} />
          <Route path="/watch/:videoId" element={<ProtectedRoute user={user}><VideoPlayer videos={videos} progress={progress.videos} onProgressUpdate={(id, t, c) => {
            setProgress(prev => ({ ...prev, videos: { ...prev.videos, [id]: { videoId: id, watchedTime: t, completed: prev.videos[id]?.completed || c, lastWatched: new Date().toISOString() } } }));
          }} /></ProtectedRoute>} />
          <Route path="/read/:pdfId" element={<ProtectedRoute user={user}><PdfViewer pdfs={pdfs} onProgressUpdate={(id, o, c) => {
            setProgress(prev => ({ ...prev, pdfs: { ...prev.pdfs, [id]: { pdfId: id, opened: prev.pdfs[id]?.opened || o, completed: prev.pdfs[id]?.completed || c, lastOpened: new Date().toISOString() } } }));
          }} /></ProtectedRoute>} />
          <Route path="/quiz/:quizId" element={<ProtectedRoute user={user}><QuizView quiz={MOCK_QUIZ} onComplete={(qid, s, p) => {
            setProgress(prev => ({ ...prev, quizzes: [...prev.quizzes, { id: `att-${Date.now()}`, quizId: qid, score: s, passed: p, completedAt: new Date().toISOString() }] }));
          }} /></ProtectedRoute>} />
          <Route path="/admin" element={
            <ProtectedRoute user={user} roles={[Role.ADMIN]}>
              <AdminDashboard 
                videos={videos} pdfs={pdfs} categories={categories} collaborators={collaborators} allProgress={progress}
                onAddVideo={handleAddVideo} onEditVideo={handleEditVideo} onDeleteVideo={handleDeleteVideo}
                onAddPdf={handleAddPdf} onEditPdf={handleEditPdf} onDeletePdf={handleDeletePdf}
                onAddCollaborator={handleAddCollaborator} onDeleteCollaborator={handleDeleteCollaborator}
                onAddCategory={handleAddCategory} onEditCategory={handleEditCategory} onDeleteCategory={handleDeleteCategory}
                onRestoreBackup={() => {}}
                cloudConfig={supabaseConfig}
                onSaveCloud={updateCloudConfig}
              />
            </ProtectedRoute>
          } />
          <Route path="/" element={<Navigate to="/home" />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;
