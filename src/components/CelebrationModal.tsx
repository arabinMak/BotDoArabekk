import { useEffect, useState } from 'react';
import { X, Sparkles } from 'lucide-react';

interface CelebrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  dayNumber: number;
  isChallengComplete?: boolean;
}

export default function CelebrationModal({ isOpen, onClose, dayNumber, isChallengComplete }: CelebrationModalProps) {
  const [confetti, setConfetti] = useState<Array<{ id: number; left: number; delay: number; duration: number }>>([]);

  useEffect(() => {
    if (isOpen) {
      const pieces = Array.from({ length: 30 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 0.5,
        duration: 2 + Math.random() * 2,
      }));
      setConfetti(pieces);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const motivationalQuotes = [
    'A leveza vem de quem não desiste.',
    'Cada pequeno passo é uma grande vitória.',
    'Você está provando que consegue.',
    'A transformação acontece todos os dias.',
    'Continue, você está incrível!',
    'Seu corpo agradece cada escolha consciente.',
    'Persistência é o segredo da leveza.',
  ];

  const randomQuote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 animate-scaleIn">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#9B9B9B] hover:text-[#3E3E3E] transition-colors"
          aria-label="Fechar"
        >
          <X className="w-6 h-6" />
        </button>

        {confetti.map((piece) => (
          <div
            key={piece.id}
            className="absolute w-2 h-2 bg-gradient-to-br from-[#A7D9C9] to-[#E6B89C] rounded-full animate-confetti"
            style={{
              left: `${piece.left}%`,
              top: '-10px',
              animationDelay: `${piece.delay}s`,
              animationDuration: `${piece.duration}s`,
            }}
          />
        ))}

        <div className="text-center">
          <div className="mb-6">
            <Sparkles className="w-16 h-16 mx-auto text-[#A7D9C9] animate-pulse" strokeWidth={2} />
          </div>

          {isChallengComplete ? (
            <>
              <h2 className="text-[28px] font-bold text-[#3E3E3E] mb-3" style={{ fontFamily: 'Nunito Sans, sans-serif' }}>
                Parabéns!
              </h2>
              <p className="text-[18px] text-[#3E3E3E] font-semibold mb-4" style={{ fontFamily: 'Open Sans, sans-serif' }}>
                Você completou o Desafio Corpo Leve!
              </p>
              <p className="text-[14px] text-[#6B6B6B] leading-relaxed mb-6" style={{ fontFamily: 'Open Sans, sans-serif' }}>
                7 dias de dedicação, disciplina e amor próprio. Você provou que a transformação é possível! Continue essa jornada de leveza.
              </p>
              <div className="text-[48px] mb-6">🎉</div>
            </>
          ) : (
            <>
              <h2 className="text-[24px] font-bold text-[#3E3E3E] mb-3" style={{ fontFamily: 'Nunito Sans, sans-serif' }}>
                Dia {dayNumber} concluído!
              </h2>
              <p className="text-[15px] text-[#6B6B6B] leading-relaxed mb-6" style={{ fontFamily: 'Open Sans, sans-serif' }}>
                Você completou todas as refeições de hoje. Sinta o progresso e orgulhe-se de cada passo.
              </p>
              <div className="bg-gradient-to-r from-[#A7D9C9]/10 to-[#B5E0B8]/10 rounded-2xl p-4 mb-6 border border-[#A7D9C9]/20">
                <p className="text-[14px] text-[#3E3E3E] font-medium italic" style={{ fontFamily: 'Open Sans, sans-serif' }}>
                  "{randomQuote}"
                </p>
              </div>
              <p className="text-[14px] text-[#A7D9C9] font-semibold" style={{ fontFamily: 'Inter, sans-serif' }}>
                Amanhã tem novas receitas esperando por você!
              </p>
            </>
          )}

          <button
            onClick={onClose}
            className="mt-6 w-full bg-gradient-to-r from-[#A7D9C9] to-[#B5E0B8] text-white font-semibold py-4 rounded-xl hover:shadow-lg hover:from-[#8BC4B4] hover:to-[#9DD4A3] transition-all text-[15px]"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            {isChallengComplete ? 'Finalizar' : 'Continuar'}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes confetti {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }

        .animate-scaleIn {
          animation: scaleIn 0.4s ease-out;
        }

        .animate-confetti {
          animation: confetti forwards;
        }
      `}</style>
    </div>
  );
}
