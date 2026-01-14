
import React, { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Video, Pdf, ProgressState } from '../types';
import { Icons } from '../constants';

interface SearchResultsProps {
  videos: Video[];
  pdfs: Pdf[];
  progress: ProgressState;
}

const SearchResults: React.FC<SearchResultsProps> = ({ videos, pdfs, progress }) => {
  const { search } = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(search);
  const query = queryParams.get('q') || '';

  const results = useMemo(() => {
    if (!query) return { videos: [], pdfs: [] };

    const lowerQuery = query.toLowerCase();
    
    const filteredVideos = videos.filter(v => 
      v.title.toLowerCase().includes(lowerQuery) || 
      v.description.toLowerCase().includes(lowerQuery) ||
      v.category.toLowerCase().includes(lowerQuery)
    );

    const filteredPdfs = pdfs.filter(p => 
      p.title.toLowerCase().includes(lowerQuery) || 
      p.description.toLowerCase().includes(lowerQuery) ||
      p.category.toLowerCase().includes(lowerQuery)
    );

    return { videos: filteredVideos, pdfs: filteredPdfs };
  }, [query, videos, pdfs]);

  const totalResults = results.videos.length + results.pdfs.length;

  return (
    <div className="min-h-screen bg-[#141414] pt-24 md:pt-32 px-4 md:px-12 pb-20">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-gray-400 text-lg md:text-xl mb-8">
          Resultados para: <span className="text-white font-bold">"{query}"</span>
          {totalResults > 0 && <span className="ml-4 text-sm font-normal">({totalResults} encontrados)</span>}
        </h1>

        {totalResults === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="text-6xl mb-6">🔍</div>
            <h2 className="text-2xl font-bold mb-2">Nenhum resultado encontrado</h2>
            <p className="text-gray-500 max-w-md">
              Não encontramos nenhum conteúdo para sua busca. Tente palavras-chave diferentes ou verifique a ortografia.
            </p>
          </div>
        ) : (
          <div className="space-y-12">
            {results.videos.length > 0 && (
              <section>
                <h2 className="text-xl font-bold mb-6 text-white/90">Vídeos ({results.videos.length})</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
                  {results.videos.map((video) => {
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
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {results.pdfs.length > 0 && (
              <section>
                <h2 className="text-xl font-bold mb-6 text-white/90">Documentos ({results.pdfs.length})</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {results.pdfs.map((pdf) => {
                    const isCompleted = progress.pdfs[pdf.id]?.completed;
                    return (
                      <div 
                        key={pdf.id}
                        className="bg-[#181818] p-5 rounded-lg border border-gray-800 hover:border-[#003376] transition-all cursor-pointer group flex flex-col h-full"
                        onClick={() => navigate(`/read/${pdf.id}`)}
                      >
                        <div className="mb-4 flex items-center justify-between">
                          <div className="p-2 bg-white/5 rounded-lg text-[#003376] group-hover:bg-[#003376] group-hover:text-white transition-colors">
                            <Icons.Layout />
                          </div>
                          {isCompleted && <Icons.Check />}
                        </div>
                        <h3 className="font-bold mb-2 group-hover:text-white transition-colors truncate">{pdf.title}</h3>
                        <p className="text-gray-500 text-xs mb-6 line-clamp-2 flex-grow">{pdf.description}</p>
                        <div className="flex items-center justify-between pt-3 border-t border-gray-800">
                          <span className="text-[9px] font-bold text-[#003376] uppercase tracking-tighter">{pdf.category}</span>
                          <Icons.ChevronRight />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResults;
