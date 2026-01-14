
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

  // Inicializa Firebase se houver config
  useEffect(() => {
    if (cloudConfig) {
      const success = initFirebase(cloudConfig);
      if (success) {
        // Sincroniza em tempo real com a Nuvem
        const unsubVideos = syncCollection('videos', (data) => setVideos(data as Video[]));
        const unsubPdfs = syncCollection('pdfs', (data) => setPdfs(data as Pdf[]));
        const unsubCats = syncCollection('categories', (data) => setCategories(data as Category[]));
        const unsubUsers = syncCollection('users', (data) => setCollaborators(data as User[]));
        
        return () => {
          unsubVideos(); unsubPdfs(); unsubCats(); unsubUsers();
        };
      }
    }
  }, [cloudConfig]);

  // Persistência Local
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
    alert('Configuração de Nuvem salva! Reiniciando sincronização...');
    window.location.reload();
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#141414]">
      {user && location.pathname !== '/login' && (
        <nav className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-between px-4 md:px-12 py-3 md:py-5 bg-black/90 border-b border-white/5 backdrop-blur-md">
          <div className="flex items-center space-x-6">
            <div onClick={() => navigate('/home')} className="text-[#003376] font-black text-2xl cursor-pointer">NETFLIX BGA</div>
            {cloudConfig && <div className="text-[10px] bg-green-500/10 text-green-500 px-2 py-0.5 rounded-full font-bold">● ONLINE (NUVEM)</div>}
          </div>
          <div className="flex items-center space-x-6">
            <button onClick={() => navigate('/videos')} className="text-xs font-bold text-gray-400 hover:text-white">VÍDEOS</button>
            {user.role === Role.ADMIN && <button onClick={() => navigate('/admin')} className="text-xs font-bold text-blue-400">PAINEL ADMIN</button>}
            <button onClick={handleLogout} className="text-xs font-bold text-red-500">SAIR</button>
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
                // Outras funções de edição/deleção...
                onEditVideo={v => {}} onDeleteVideo={id => {}} onAddPdf={v => {}} onEditPdf={v => {}} onDeletePdf={id => {}} onDeleteCollaborator={id => {}} onEditCategory={v => {}} onDeleteCategory={id => {}} onRestoreBackup={d => {}}
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
