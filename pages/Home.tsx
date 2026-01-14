
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Video, Pdf, ProgressState } from '../types';
import { Icons } from '../constants';

interface HomeProps {
  videos: Video[];
  pdfs: Pdf[];
  progress: ProgressState;
}

const Home: React.FC<HomeProps> = ({ videos, pdfs, progress }) => {
  const navigate = useNavigate();
  const heroVideo = videos.length > 0 ? videos[0] : null;

  const Row = ({ title, items, type }: { title: string, items: any[], type: 'video' | 'pdf' }) => {
    if (items.length === 0) return null;
    return (
      <div className="mb-8 md:mb-12 animate-in fade-in duration-500">
        <h3 className="text-lg md:text-2xl font-bold mb-4 px-4 md:px-12 flex items-center group cursor-pointer relative z-10">
          {title}
          <span className="opacity-0 group-hover:opacity-100 transition-opacity ml-2 text-[#003376] text-xs mt-1">Ver tudo <Icons.ChevronRight /></span>
        </h3>
        <div className="relative">
          <div className="flex overflow-x-auto overflow-y-visible space-x-2 md:space-x-4 px-4 md:px-12 no-scrollbar pb-6 md:pb-10">
            {items.map((item) => {
              const isCompleted = type === 'video' 
                ? progress.videos[item.id]?.completed 
                : progress.pdfs[item.id]?.completed;

              const cardThumbnail = item.thumbnail || (type === 'video' ? 'https://picsum.photos/seed/vid/400/225' : 'https://picsum.photos/seed/doc/400/225');

              return (
                <div 
                  key={item.id}
                  className="relative min-w-[160px] md:min-w-[280px] h-[90px] md:h-[157px] rounded-sm transition-all duration-300 transform hover:scale-110 hover:z-50 cursor-pointer shadow-lg group"
                  onClick={() => navigate(type === 'video' ? `/watch/${item.id}` : `/read/${item.id}`)}
                >
                  <img src={cardThumbnail} className="w-full h-full object-cover rounded-sm border border-gray-800" alt={item.title} />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity p-3 flex flex-col justify-end">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="p-1 rounded-full bg-white text-black"><Icons.Play /></div>
                      {isCompleted && <div className="ml-auto"><Icons.Check /></div>}
                    </div>
                    <h4 className="text-xs md:text-sm font-bold truncate">{item.title}</h4>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="pb-20 bg-[#141414] min-h-screen">
      {/* Hero Section */}
      {heroVideo ? (
        <div className="relative h-[75vh] md:h-[95vh] w-full overflow-hidden">
          <div className="absolute inset-0">
            <img src={heroVideo.thumbnail} className="w-full h-full object-cover brightness-[0.5] scale-105" alt="hero" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-[#141414]/20 to-transparent" />
          </div>
          <div className="absolute bottom-[20%] md:bottom-[25%] left-4 md:left-12 max-w-xl z-20">
            <h1 className="text-4xl md:text-6xl font-black mb-4 tracking-tight uppercase leading-[0.9]">{heroVideo.title}</h1>
            <p className="text-sm md:text-xl text-gray-200 mb-8 line-clamp-3 max-w-lg">{heroVideo.description}</p>
            <button 
              onClick={() => navigate(`/watch/${heroVideo.id}`)}
              className="flex items-center space-x-2 px-6 py-2.5 md:px-10 md:py-3.5 bg-white text-black rounded-md font-bold hover:bg-gray-200 transition-all"
            >
              <Icons.Play />
              <span>Assistir Agora</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="relative h-[60vh] flex flex-col items-center justify-center text-center p-8 bg-gradient-to-b from-[#003376]/20 to-transparent border-b border-white/5">
          <div className="text-6xl mb-6 opacity-40">💈</div>
          <h1 className="text-4xl font-bold mb-4">Bem-vindo à Netflix BGA</h1>
          <p className="text-gray-400 max-w-md mx-auto">Sua plataforma está pronta. Comece agora acessando o Painel Administrativo para cadastrar categorias e treinamentos.</p>
        </div>
      )}

      <div className={heroVideo ? "-mt-12 md:-mt-20 relative z-30" : "pt-12"}>
        {videos.length === 0 && pdfs.length === 0 ? (
          <div className="px-4 md:px-12 py-12 text-center text-gray-600 italic">
            Nenhum conteúdo disponível no momento.
          </div>
        ) : (
          <>
            <Row title="Lançamentos" items={videos} type="video" />
            <Row title="Procedimentos Operacionais" items={pdfs} type="pdf" />
          </>
        )}
      </div>
    </div>
  );
};

export default Home;
