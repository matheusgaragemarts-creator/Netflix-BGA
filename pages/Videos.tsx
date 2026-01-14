
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Video, ProgressState, Category } from '../types';
import { Icons } from '../constants';

interface VideosProps {
  videos: Video[];
  categories: Category[];
  progress: ProgressState;
}

const Videos: React.FC<VideosProps> = ({ videos, categories, progress }) => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('Todos');

  const availableCategories = ['Todos', ...categories.map(c => c.name)];
  const filteredVideos = filter === 'Todos' ? videos : videos.filter(v => v.category === filter);

  return (
    <div className="min-h-screen bg-[#141414] pt-24 md:pt-32 px-4 md:px-12 pb-20">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 space-y-4 md:space-y-0">
          <h1 className="text-3xl md:text-4xl font-bold">Vídeos de Treinamento</h1>
          <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar pb-2">
            {availableCategories.map(cat => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-4 py-1.5 rounded-full text-sm font-bold transition-all whitespace-nowrap ${
                  filter === cat ? 'bg-[#003376] text-white' : 'bg-white/10 text-gray-400 hover:bg-white/20'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
          {filteredVideos.map((video) => {
            const isCompleted = progress.videos[video.id]?.completed;
            return (
              <div 
                key={video.id}
                className="relative group cursor-pointer"
                onClick={() => navigate(`/watch/${video.id}`)}
              >
                <div className="aspect-video rounded-sm overflow-hidden border border-gray-800 transition-transform duration-300 group-hover:scale-105">
                  <img src={video.thumbnail} className="w-full h-full object-cover" alt={video.title} />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <div className="p-2 bg-white text-black rounded-full shadow-xl">
                      <Icons.Play />
                    </div>
                  </div>
                </div>
                <div className="mt-3">
                  <h4 className="text-sm font-bold truncate group-hover:text-[#003376] transition-colors">{video.title}</h4>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">{video.category}</span>
                    {isCompleted && <Icons.Check />}
                  </div>
                </div>
                {isCompleted && (
                  <div className="absolute bottom-[44px] left-0 w-full h-1 bg-[#003376] rounded-b-sm" />
                )}
                {video.isNew && !isCompleted && (
                  <div className="absolute top-2 left-0 bg-[#003376] text-white text-[8px] font-bold px-2 py-0.5 shadow-md">
                    NOVO
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Videos;
