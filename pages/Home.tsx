
import React from 'react';
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
      <div className="mb-12 animate-in fade-in duration-700">
        <h3 className="text-xl md:text-2xl font-bold mb-4 px-4 md:px-12 flex items-center group cursor-pointer">
          {title}
          <Icons.ChevronRight />
        </h3>
        <div className="relative group/row">
          <div className="flex overflow-x-auto overflow-y-visible space-x-4 px-4 md:px-12 no-scrollbar pb-8">
            {items.map((item) => {
              const isCompleted = type === 'video' 
                ? progress.videos[item.id]?.completed 
                : progress.pdfs[item.id]?.completed;

              return (
                <div 
                  key={item.id}
                  className="relative min-w-[200px] md:min-w-[300px] aspect-video rounded-sm transition-all duration-300 transform hover:scale-110 hover:z-50 cursor-pointer shadow-2xl overflow-hidden group/card border border-white/5"
                  onClick={() => navigate(type === 'video' ? `/watch/${item.id}` : `/read/${item.id}`)}
                >
                  <img src={item.thumbnail || 'https://picsum.photos/seed/bga/400/225'} className="w-full h-full object-cover" alt={item.title} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity p-4 flex flex-col justify-end">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center scale-90"><Icons.Play /></div>
                      {isCompleted && <Icons.Check />}
                    </div>
                    <h4 className="text-sm font-black truncate uppercase">{item.title}</h4>
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
      {heroVideo ? (
        <div className="relative h-[85vh] w-full overflow-hidden mb-[-100px]">
          <img src={heroVideo.thumbnail} className="w-full h-full object-cover brightness-[0.4] scale-105" alt="hero" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-transparent to-black/30" />
          <div className="absolute bottom-[30%] left-4 md:left-12 max-w-2xl z-20">
            <h1 className="text-5xl md:text-7xl font-black mb-4 tracking-tighter uppercase leading-[0.85]">{heroVideo.title}</h1>
            <p className="text-sm md:text-lg text-gray-300 mb-8 line-clamp-3 font-medium max-w-lg">{heroVideo.description}</p>
            <div className="flex items-center space-x-3">
              <button 
                onClick={() => navigate(`/watch/${heroVideo.id}`)}
                className="flex items-center space-x-2 px-8 py-3 bg-white text-black rounded font-black hover:bg-gray-200 transition-all uppercase tracking-tighter"
              >
                <Icons.Play />
                <span>Assistir</span>
              </button>
              <button className="flex items-center space-x-2 px-8 py-3 bg-white/20 text-white rounded font-black hover:bg-white/30 transition-all uppercase tracking-tighter backdrop-blur-md">
                <Icons.Info />
                <span>Detalhes</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="h-[60vh] flex flex-col items-center justify-center text-center px-4">
          <h1 className="text-4xl font-black mb-4 text-[#003376]">BEM-VINDO À BGA</h1>
          <p className="text-gray-500 max-w-md">Conecte sua conta à nuvem para liberar os treinamentos exclusivos da sua barbearia.</p>
        </div>
      )}

      <div className="relative z-30">
        <Row title="Lançamentos de Treinamento" items={videos} type="video" />
        <Row title="Documentação de Suporte" items={pdfs} type="pdf" />
      </div>
    </div>
  );
};

export default Home;
