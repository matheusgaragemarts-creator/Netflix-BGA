
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Pdf, ProgressState } from '../types';
import { Icons } from '../constants';

interface PopsProps {
  pdfs: Pdf[];
  progress: ProgressState;
}

const Pops: React.FC<PopsProps> = ({ pdfs, progress }) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#141414] pt-24 md:pt-32 px-4 md:px-12 pb-20">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Procedimentos (POPs)</h1>
        <p className="text-gray-400 mb-10 max-w-2xl">
          Consulte os documentos oficiais da Barbearia BGA. Conhecimento padronizado é a base da nossa excelência.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {pdfs.map((pdf) => {
            const isCompleted = progress.pdfs[pdf.id]?.completed;
            return (
              <div 
                key={pdf.id}
                className="bg-[#181818] p-6 rounded-lg border border-gray-800 hover:border-[#003376] transition-all cursor-pointer group flex flex-col h-full"
                onClick={() => navigate(`/read/${pdf.id}`)}
              >
                <div className="mb-4 flex items-center justify-between">
                  <div className="p-3 bg-white/5 rounded-lg text-[#003376] group-hover:bg-[#003376] group-hover:text-white transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  {isCompleted && (
                    <div className="flex items-center space-x-1 text-green-500 font-bold text-xs uppercase tracking-widest">
                      <Icons.Check />
                      <span>Lido</span>
                    </div>
                  )}
                </div>
                <h3 className="text-xl font-bold mb-2 group-hover:text-white transition-colors">{pdf.title}</h3>
                <p className="text-gray-500 text-sm mb-6 line-clamp-2 flex-grow">{pdf.description}</p>
                <div className="flex items-center justify-between pt-4 border-t border-gray-800">
                  <span className="text-[10px] font-bold text-[#003376] uppercase tracking-tighter">{pdf.category}</span>
                  <div className="text-white font-bold text-sm flex items-center space-x-2 group-hover:translate-x-1 transition-transform">
                    <span>Acessar</span>
                    <Icons.ChevronRight />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Pops;
