
import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Pdf } from '../types';

interface PdfViewerProps {
  pdfs: Pdf[];
  onProgressUpdate: (pdfId: string, opened: boolean, completed: boolean) => void;
}

const PdfViewer: React.FC<PdfViewerProps> = ({ pdfs, onProgressUpdate }) => {
  const { pdfId } = useParams<{ pdfId: string }>();
  const navigate = useNavigate();
  const pdf = pdfs.find(p => p.id === pdfId);

  useEffect(() => {
    if (pdf) {
      onProgressUpdate(pdf.id, true, false);
      
      // Auto-complete after 30 seconds as requested in rules
      const timer = setTimeout(() => {
        onProgressUpdate(pdf.id, true, true);
      }, 30000);
      
      return () => clearTimeout(timer);
    }
  }, [pdf]);

  if (!pdf) return <div>PDF não encontrado.</div>;

  return (
    <div className="min-h-screen bg-gray-900 pt-24 md:pt-32 px-4 pb-20">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">{pdf.title}</h1>
            <p className="text-gray-400">{pdf.category} • {pdf.description}</p>
          </div>
          <button 
            onClick={() => navigate('/home')}
            className="px-6 py-2 bg-white text-black rounded font-bold hover:bg-gray-200"
          >
            Concluir Leitura
          </button>
        </div>
        
        <div className="bg-white rounded-lg shadow-2xl overflow-hidden aspect-[1/1.4] relative flex flex-col items-center justify-center">
          <div className="absolute top-4 left-0 right-0 text-center text-gray-400 text-xs">
            MODO DE VISUALIZAÇÃO DE DOCUMENTO (DEMO)
          </div>
          
          <div className="p-12 text-black w-full h-full overflow-y-auto bg-gray-50 flex flex-col space-y-6">
            <h2 className="text-4xl font-serif font-black border-b-4 border-black pb-4">PROCESSO OPERACIONAL PADRÃO</h2>
            <div className="grid grid-cols-2 gap-4 text-sm bg-gray-200 p-4 font-mono">
              <div>CÓDIGO: BGA-POP-001</div>
              <div>REVISÃO: 01</div>
              <div>DATA: 12/2024</div>
              <div>AUTOR: SEU ELIAS</div>
            </div>
            
            <section className="space-y-2">
              <h3 className="font-bold text-xl uppercase underline">1. OBJETIVO</h3>
              <p>Estabelecer as diretrizes fundamentais para a execução de serviços de alta performance na Barbearia BGA, garantindo a padronização e a satisfação do cliente.</p>
            </section>

            <section className="space-y-2">
              <h3 className="font-bold text-xl uppercase underline">2. MATERIAIS NECESSÁRIOS</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>Máquinas reguladas e lubrificadas;</li>
                <li>Tesouras de fio navalha e laser;</li>
                <li>Golas higiênicas e capas limpas;</li>
                <li>Borrifador com água purificada;</li>
                <li>Pentes guia originais.</li>
              </ul>
            </section>

            <section className="space-y-2">
              <h3 className="font-bold text-xl uppercase underline">3. PROCEDIMENTO PASSO-A-PASSO</h3>
              <p className="font-semibold">3.1 Recepção</p>
              <p>O barbeiro deve se levantar imediatamente ao ver o cliente entrar. Use o nome do cliente se conhecido. Ofereça uma bebida e acomode-o na cadeira.</p>
              <p className="font-semibold">3.2 Preparação</p>
              <p>Coloque a gola higiênica e a capa de forma firme mas confortável. Analise a estrutura craniana e o redemoinho antes de molhar o cabelo.</p>
              <p className="font-semibold">3.3 Execução</p>
              <p>Mantenha a postura ereta. Evite conversas polêmicas (futebol, política, religião) a menos que o cliente tome a iniciativa de forma amigável.</p>
            </section>

            <div className="mt-auto pt-10 text-center text-gray-400 text-[10px] italic">
              Este documento é de uso exclusivo da Barbearia BGA. Reprodução proibida.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PdfViewer;
