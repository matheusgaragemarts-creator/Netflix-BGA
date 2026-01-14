
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
import { initFirebase, syncCollection, saveToCloud } from './services/cloudService.ts';

const ProtectedRoute: React.FC<{ children: React.ReactNode; roles?: Role[]; user: User | null }> = ({ children, roles, user }) => {
  if (!user) return <Navigate to="/login" />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/home" />;
  return <>{children}</>;
};

const App: React.FC = () => {
  const getInitial = (key: string, defaultValue: any) => {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : defaultValue;
  };

  const [cloudConfig, setCloudConfig] = useState(() => getInitial('bga_cloud_config', null));
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

  useEffect(() => {
    if (cloudConfig) {
      const success = initFirebase(cloudConfig);
      if (success) {
        const unsubVideos = syncCollection('videos', (data) => setVideos(data as Video[]));
        const unsubPdfs = syncCollection('pdfs', (data) => setPdfs(data as Pdf[]));
        const unsubCats = syncCollection('categories', (data) => setCategories(data as Category[]));
        const unsubUsers = syncCollection('users', (data) => setCollaborators(data as User[]));
        return () => { unsubVideos(); unsubPdfs(); unsubCats(); unsubUsers(); };
      }
    }
  }, [cloudConfig]);

  useEffect(() => { localStorage.setItem('bga_progress', JSON.stringify(progress)); }, [progress]);
  useEffect(() => { localStorage.setItem('bga_videos', JSON.stringify(videos)); }, [videos]);
  useEffect(() => { localStorage.setItem('bga_pdfs', JSON.stringify(pdfs)); }, [pdfs]);
  useEffect(() => { localStorage.setItem('bga_categories', JSON.stringify(categories)); }, [categories]);
  useEffect(() => { localStorage.setItem('bga_colabs', JSON.stringify(collaborators)); }, [collaborators]);

  const handleLogin = (selectedUser: User) => {
    setUser(selectedUser);
    localStorage.setItem('bga_user', JSON.stringify(selectedUser));
    navigate(selectedUser.role === Role.ADMIN ? '/admin' : '/home');
  };

  const handleRegister = async (newUser: User) => {
    setCollaborators(prev => [...prev, newUser]);
    if (cloudConfig) await saveToCloud('users', newUser.id, newUser);
    setUser(newUser);
    localStorage.setItem('bga_user', JSON.stringify(newUser));
    navigate('/home');
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('bga_user');
    navigate('/login');
  };

  const updateCloudConfig = (config: any) => {
    setCloudConfig(config);
    localStorage.setItem('bga_cloud_config', JSON.stringify(config));
    alert('Nuvem conectada! Atualizando...');
    window.location.reload();
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#141414]">
      {user && location.pathname !== '/login' && (
        <nav className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-between px-4 md:px-12 py-4 bg-gradient-to-b from-black/80 to-transparent backdrop-blur-sm">
          <div className="flex items-center space-x-8">
            <div onClick={() => navigate('/home')} className="text-[#003376] font-black text-2xl cursor-pointer tracking-tighter">NETFLIX BGA</div>
            <div className="hidden md:flex items-center space-x-5 text-[11px] font-bold uppercase tracking-widest text-gray-400">
              <button onClick={() => navigate('/home')} className={`hover:text-white transition-colors ${location.pathname === '/home' ? 'text-white' : ''}`}>Início</button>
              <button onClick={() => navigate('/videos')} className={`hover:text-white transition-colors ${location.pathname === '/videos' ? 'text-white' : ''}`}>Vídeos</button>
              <button onClick={() => navigate('/pops')} className={`hover:text-white transition-colors ${location.pathname === '/pops' ? 'text-white' : ''}`}>POPs</button>
            </div>
          </div>
          <div className="flex items-center space-x-6">
            {cloudConfig && <div className="w-2 h-2 bg-green-500 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.8)]" title="Sincronizado na Nuvem"></div>}
            {user.role === Role.ADMIN && (
              <button onClick={() => navigate('/admin')} className="text-[10px] font-black bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded transition-all">ADMIN</button>
            )}
            <div className="relative group cursor-pointer">
              <img src={user.avatar} className="w-8 h-8 rounded border border-white/20" alt="profile" />
              <div className="absolute right-0 mt-2 w-48 bg-black/95 border border-white/10 rounded hidden group-hover:block overflow-hidden shadow-2xl">
                <button onClick={() => navigate('/meu-progresso')} className="w-full text-left p-3 hover:bg-white/10 text-xs font-bold border-b border-white/5">Meu Progresso</button>
                <button onClick={handleLogout} className="w-full text-left p-3 hover:bg-red-600/20 text-red-500 text-xs font-bold">Sair</button>
              </div>
            </div>
          </div>
        </nav>
      )}
      <main className="flex-grow">
        <Routes>
          <Route path="/login" element={<Login onLogin={handleLogin} onRegister={handleRegister} collaborators={collaborators} cloudConfig={cloudConfig} onSaveCloud={updateCloudConfig} />} />
          <Route path="/home" element={<ProtectedRoute user={user}><Home videos={videos} pdfs={pdfs} progress={progress} /></ProtectedRoute>} />
          <Route path="/videos" element={<ProtectedRoute user={user}><Videos videos={videos} categories={categories} progress={progress} /></ProtectedRoute>} />
          <Route path="/pops" element={<ProtectedRoute user={user}><Pops pdfs={pdfs} progress={progress} /></ProtectedRoute>} />
          <Route path="/meu-progresso" element={<ProtectedRoute user={user}><MyProgress progress={progress} videos={videos} pdfs={pdfs} /></ProtectedRoute>} />
          <Route path="/watch/:videoId" element={<ProtectedRoute user={user}><VideoPlayer videos={videos} progress={progress.videos} onProgressUpdate={(id, time, comp) => {
             setProgress(prev => ({ ...prev, videos: { ...prev.videos, [id]: { videoId: id, watchedTime: time, completed: prev.videos[id]?.completed || comp, lastWatched: new Date().toISOString() } } }));
          }} /></ProtectedRoute>} />
          <Route path="/admin" element={
            <ProtectedRoute user={user} roles={[Role.ADMIN]}>
              <AdminDashboard 
                videos={videos} pdfs={pdfs} categories={categories} collaborators={collaborators} allProgress={progress} cloudConfig={cloudConfig} onSaveCloud={updateCloudConfig}
                onAddVideo={async v => { setVideos(p => [v, ...p]); if (cloudConfig) await saveToCloud('videos', v.id, v); }}
                onAddCollaborator={async v => { setCollaborators(p => [...p, v]); if (cloudConfig) await saveToCloud('users', v.id, v); }}
                onAddCategory={async v => { setCategories(p => [...p, v]); if (cloudConfig) await saveToCloud('categories', v.id, v); }}
                onEditVideo={() => {}} onDeleteVideo={() => {}} onAddPdf={() => {}} onEditPdf={() => {}} onDeletePdf={() => {}} onDeleteCollaborator={() => {}} onEditCategory={() => {}} onDeleteCategory={() => {}} onRestoreBackup={() => {}}
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
