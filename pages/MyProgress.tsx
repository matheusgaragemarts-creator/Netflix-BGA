
import React from 'react';
import { ProgressState, Video, Pdf } from '../types';
import { Icons } from '../constants';

interface MyProgressProps {
  progress: ProgressState;
  videos: Video[];
  pdfs: Pdf[];
}

const MyProgress: React.FC<MyProgressProps> = ({ progress, videos, pdfs }) => {
  const completedVideos = videos.filter(v => progress.videos[v.id]?.completed);
  const completedPdfs = pdfs.filter(p => progress.pdfs[p.id]?.completed);
  const totalItems = videos.length + pdfs.length;
  const totalCompleted = completedVideos.length + completedPdfs.length;
  const overallPercent = Math.round((totalCompleted / totalItems) * 100);

  return (
    <div className="min-h-screen bg-black pt-24 md:pt-32 px-4 md:px-12 pb-20">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Meu Progresso</h1>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-[#181818] p-8 rounded-lg border border-gray-800 flex flex-col items-center text-center">
            <div className="text-4xl font-black text-[#003376] mb-2">{overallPercent}%</div>
            <div className="text-gray-400 uppercase tracking-widest text-xs font-bold">Progresso Geral</div>
            <div className="w-full h-2 bg-gray-800 rounded-full mt-4 overflow-hidden">
              <div className="h-full bg-[#003376]" style={{ width: `${overallPercent}%` }} />
            </div>
          </div>
          
          <div className="bg-[#181818] p-8 rounded-lg border border-gray-800 flex flex-col items-center text-center">
            <div className="text-4xl font-black text-white mb-2">{completedVideos.length}/{videos.length}</div>
            <div className="text-gray-400 uppercase tracking-widest text-xs font-bold">Vídeos Assistidos</div>
          </div>

          <div className="bg-[#181818] p-8 rounded-lg border border-gray-800 flex flex-col items-center text-center">
            <div className="text-4xl font-black text-white mb-2">{completedPdfs.length}/{pdfs.length}</div>
            <div className="text-gray-400 uppercase tracking-widest text-xs font-bold">PDFs Concluídos</div>
          </div>
        </div>

        {/* Detailed Lists */}
        <div className="space-y-12">
          <section>
            <h2 className="text-2xl font-bold mb-6 border-b border-gray-800 pb-2">Seus Vídeos</h2>
            <div className="space-y-4">
              {videos.map(video => {
                const prog = progress.videos[video.id];
                const percent = prog ? Math.round((prog.watchedTime / video.duration) * 100) : 0;
                const isCompleted = prog?.completed;

                return (
                  <div key={video.id} className="bg-[#181818] p-4 rounded flex items-center group">
                    <img src={video.thumbnail} className="w-24 h-14 object-cover rounded mr-6" alt="" />
                    <div className="flex-grow">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-bold">{video.title}</h4>
                        {isCompleted && <Icons.Check />}
                      </div>
                      <p className="text-xs text-gray-500">{video.category}</p>
                      <div className="w-full h-1 bg-gray-800 rounded-full mt-2 overflow-hidden max-w-xs">
                        <div className={`h-full ${isCompleted ? 'bg-green-500' : 'bg-[#003376]'}`} style={{ width: `${Math.max(percent, isCompleted ? 100 : 0)}%` }} />
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`text-xs font-bold px-2 py-1 rounded ${isCompleted ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'}`}>
                        {isCompleted ? 'CONCLUÍDO' : `${percent}% ASSISTIDO`}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-6 border-b border-gray-800 pb-2">Suas Atividades de Quiz</h2>
            <div className="space-y-4">
              {progress.quizzes.length === 0 ? (
                <p className="text-gray-500 italic">Nenhum quiz realizado ainda.</p>
              ) : (
                progress.quizzes.map(attempt => (
                  <div key={attempt.id} className="bg-[#181818] p-4 rounded flex items-center justify-between">
                    <div>
                      <h4 className="font-bold">Tentativa de Quiz - {new Date(attempt.completedAt).toLocaleDateString()}</h4>
                      <p className="text-xs text-gray-500">ID: {attempt.quizId}</p>
                    </div>
                    <div className="flex items-center space-x-6">
                      <div className="text-center">
                        <div className={`text-xl font-bold ${attempt.passed ? 'text-green-500' : 'text-[#003376]'}`}>{attempt.score}%</div>
                        <div className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Pontuação</div>
                      </div>
                      <span className={`text-xs font-bold px-3 py-1 rounded ${attempt.passed ? 'bg-green-500/10 text-green-500' : 'bg-[#003376]/10 text-[#003376]'}`}>
                        {attempt.passed ? 'APROVADO' : 'REPROVADO'}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default MyProgress;
