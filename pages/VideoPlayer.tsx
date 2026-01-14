
import React, { useRef, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Video, VideoProgress } from '../types';
import { Icons } from '../constants';

interface VideoPlayerProps {
  videos: Video[];
  progress: Record<string, VideoProgress>;
  onProgressUpdate: (videoId: string, watchedTime: number, completed: boolean) => void;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ videos, progress, onProgressUpdate }) => {
  const { videoId } = useParams<{ videoId: string }>();
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [showQuizPrompt, setShowQuizPrompt] = useState(false);
  
  const video = videos.find(v => v.id === videoId);
  const currentProgress = progress[videoId || ''];

  useEffect(() => {
    if (!video) return;

    const vElement = videoRef.current;
    if (!vElement) return;

    // Set initial time from progress
    if (currentProgress && currentProgress.watchedTime < video.duration * 0.95) {
      vElement.currentTime = currentProgress.watchedTime;
    }

    const interval = setInterval(() => {
      if (!vElement.paused) {
        const completed = vElement.currentTime >= video.duration * 0.9;
        onProgressUpdate(video.id, Math.floor(vElement.currentTime), completed);
        
        if (completed && video.quizId) {
          setShowQuizPrompt(true);
        }
      }
    }, 5000); // Save progress every 5 seconds

    return () => clearInterval(interval);
  }, [video]);

  if (!video) return <div>Vídeo não encontrado.</div>;

  return (
    <div className="fixed inset-0 bg-black z-[100] flex flex-col">
      <div className="absolute top-0 left-0 right-0 p-8 flex items-center justify-between z-10 bg-gradient-to-b from-black/80 to-transparent">
        <button 
          onClick={() => navigate('/home')}
          className="p-2 hover:bg-white/20 rounded-full text-white transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
        <h2 className="text-xl font-bold">{video.title}</h2>
        <div className="w-10"></div>
      </div>

      <video 
        ref={videoRef}
        src={video.videoUrl}
        className="w-full h-full object-contain"
        controls
        autoPlay
      />

      {showQuizPrompt && (
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 bg-black/90 border border-gray-700 p-6 rounded-lg shadow-2xl animate-bounce flex items-center space-x-6">
          <div>
            <h3 className="text-lg font-bold">Vídeo Concluído!</h3>
            <p className="text-gray-400 text-sm">Pronto para testar seus conhecimentos?</p>
          </div>
          <button 
            onClick={() => navigate(`/quiz/${video.quizId}`)}
            className="px-6 py-3 bg-[#003376] text-white rounded font-bold hover:bg-[#001a3d] transition-colors"
          >
            Iniciar Quiz
          </button>
          <button 
            onClick={() => setShowQuizPrompt(false)}
            className="text-gray-500 hover:text-white"
          >
            Pular
          </button>
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;
