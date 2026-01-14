
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Quiz } from '../types';

interface QuizViewProps {
  quiz: Quiz;
  onComplete: (quizId: string, score: number, passed: boolean) => void;
}

const QuizView: React.FC<QuizViewProps> = ({ quiz, onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [isFinished, setIsFinished] = useState(false);
  const navigate = useNavigate();

  const handleOptionSelect = (optionIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[currentStep] = optionIndex;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentStep < quiz.questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      const correctCount = answers.reduce((acc, ans, idx) => {
        return acc + (ans === quiz.questions[idx].correctAnswer ? 1 : 0);
      }, 0);
      const score = Math.round((correctCount / quiz.questions.length) * 100);
      const passed = score >= quiz.passingScore;
      
      setIsFinished(true);
      onComplete(quiz.id, score, passed);
    }
  };

  if (isFinished) {
    const correctCount = answers.reduce((acc, ans, idx) => {
      return acc + (ans === quiz.questions[idx].correctAnswer ? 1 : 0);
    }, 0);
    const score = Math.round((correctCount / quiz.questions.length) * 100);
    const passed = score >= quiz.passingScore;

    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="bg-[#181818] p-12 rounded-lg max-w-lg w-full text-center border border-gray-800">
          <div className={`text-6xl mb-6 ${passed ? 'text-green-500' : 'text-[#003376]'}`}>
            {passed ? '🏆' : '⚠️'}
          </div>
          <h2 className="text-3xl font-bold mb-2">{passed ? 'Parabéns!' : 'Não foi dessa vez'}</h2>
          <p className="text-gray-400 mb-8">
            Você acertou {correctCount} de {quiz.questions.length} ({score}%)
          </p>
          
          <div className="space-y-4">
            <button 
              onClick={() => navigate('/home')}
              className="w-full py-4 bg-white text-black rounded font-bold hover:bg-gray-200"
            >
              Voltar para o Início
            </button>
            {!passed && (
              <button 
                onClick={() => {
                  setCurrentStep(0);
                  setAnswers([]);
                  setIsFinished(false);
                }}
                className="w-full py-4 border border-gray-600 rounded font-bold hover:bg-white/10"
              >
                Tentar Novamente
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  const question = quiz.questions[currentStep];

  return (
    <div className="min-h-screen bg-black pt-24 md:pt-32 flex items-center justify-center px-4 pb-12">
      <div className="bg-[#181818] p-6 md:p-12 rounded-lg max-w-2xl w-full border border-gray-800 shadow-2xl">
        <div className="flex justify-between items-center mb-8">
          <span className="text-[#003376] font-bold uppercase tracking-widest text-sm">Pergunta {currentStep + 1} de {quiz.questions.length}</span>
          <div className="h-1 bg-gray-700 flex-grow mx-4 rounded-full overflow-hidden">
            <div 
              className="h-full bg-[#003376] transition-all duration-300" 
              style={{ width: `${((currentStep + 1) / quiz.questions.length) * 100}%` }}
            />
          </div>
        </div>

        <h2 className="text-2xl font-bold mb-8 leading-tight">{question.text}</h2>
        
        <div className="space-y-4 mb-12">
          {question.options.map((option, idx) => (
            <button
              key={idx}
              onClick={() => handleOptionSelect(idx)}
              className={`w-full p-4 rounded-md text-left transition-all border-2 ${
                answers[currentStep] === idx 
                ? 'bg-[#003376]/20 border-[#003376]' 
                : 'bg-white/5 border-transparent hover:bg-white/10'
              }`}
            >
              <div className="flex items-center space-x-4">
                <span className="w-8 h-8 rounded-full border border-gray-600 flex items-center justify-center font-bold text-sm shrink-0">
                  {String.fromCharCode(65 + idx)}
                </span>
                <span>{option}</span>
              </div>
            </button>
          ))}
        </div>

        <button
          onClick={handleNext}
          disabled={answers[currentStep] === undefined}
          className={`w-full py-4 rounded font-bold transition-all ${
            answers[currentStep] === undefined 
            ? 'bg-gray-700 text-gray-400 cursor-not-allowed' 
            : 'bg-[#003376] text-white hover:bg-[#001a3d]'
          }`}
        >
          {currentStep === quiz.questions.length - 1 ? 'Finalizar Quiz' : 'Próxima Pergunta'}
        </button>
      </div>
    </div>
  );
};

export default QuizView;
