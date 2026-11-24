import React, { useState, useEffect } from 'react';
import { Compass, Flame, Shield, Droplets, Sun, Moon, Dumbbell, BookOpen, Zap } from 'lucide-react';
import { soundFX } from '../lib/sound-fx';

interface SovereignCompassDialProps {
  score: number;
  purezaStreak: number;
  habitsCompleted: number;
  totalHabits: number;
}

export const SovereignCompassDial: React.FC<SovereignCompassDialProps> = ({
  score,
  purezaStreak,
  habitsCompleted,
  totalHabits
}) => {
  const [needleAngle, setNeedleAngle] = useState(0);

  // Efeito magnético suave: a agulha oscila levemente ou acompanha orientação
  useEffect(() => {
    const interval = setInterval(() => {
      // Pequena oscilação magnética natural (+- 3 graus)
      const drift = (Math.random() - 0.5) * 4;
      // O ângulo base aponta para o progresso do dia (de 0 a 360 graus)
      const targetAngle = (score / 100) * 360 + drift;
      setNeedleAngle(targetAngle);
    }, 2500);

    return () => clearInterval(interval);
  }, [score]);

  // Circunferência do anel de progresso (raio = 110)
  const radius = 105;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="relative flex flex-col items-center justify-center py-6 select-none">
      
      {/* Halo de luz dourada em volta da bússola */}
      <div 
        className="absolute w-72 h-72 sm:w-80 sm:h-80 rounded-full blur-3xl pointer-events-none transition-all duration-1000"
        style={{
          background: `radial-gradient(circle, rgba(212, 175, 55, ${0.12 + (score / 100) * 0.18}) 0%, rgba(11, 13, 17, 0) 70%)`
        }}
      />

      {/* Caixa do Mostrador (Dial) */}
      <div className="relative w-72 h-72 sm:w-84 sm:h-84 flex items-center justify-center">
        
        {/* Anel Externo de Bronze & Graduações */}
        <div className="absolute inset-0 rounded-full border-2 border-[#D4AF37]/30 bg-gradient-to-br from-[#1A1F2B]/90 via-[#10141D]/95 to-[#080B10] shadow-[0_20px_50px_rgba(0,0,0,0.8),inset_0_2px_6px_rgba(255,255,255,0.08)] backdrop-blur-xl">
          
          {/* Marcas dos 8 Rumos Sagrados (Pontos da Bússola) */}
          <div className="absolute top-2.5 left-1/2 -translate-x-1/2 flex flex-col items-center">
            <span className="text-[10px] font-serif-noble font-black tracking-widest text-[#D4AF37]">N • PUREZA</span>
            <div className="w-1 h-2 bg-[#D4AF37] rounded-full mt-0.5 shadow-[0_0_8px_#D4AF37]" />
          </div>

          <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex flex-col items-center">
            <div className="w-1 h-2 bg-stone-600 rounded-full mb-0.5" />
            <span className="text-[10px] font-serif-noble font-bold tracking-widest text-stone-400">S • SONO</span>
          </div>

          <div className="absolute left-2.5 top-1/2 -translate-y-1/2 flex items-center">
            <span className="text-[10px] font-serif-noble font-bold tracking-widest text-stone-400">O • JEJUM</span>
            <div className="w-2 h-1 bg-stone-600 rounded-full ml-1" />
          </div>

          <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center">
            <div className="w-2 h-1 bg-sky-400 rounded-full mr-1 shadow-[0_0_8px_#38BDF8]" />
            <span className="text-[10px] font-serif-noble font-bold tracking-widest text-sky-400">L • ÁGUA</span>
          </div>

        </div>

        {/* SVG com Anel de Progresso Dinâmico de Soberania */}
        <svg className="absolute w-64 h-64 sm:w-76 sm:h-76 -rotate-90">
          {/* Anel de fundo */}
          <circle
            cx="50%"
            cy="50%"
            r={radius}
            fill="transparent"
            stroke="rgba(255, 255, 255, 0.05)"
            strokeWidth="6"
          />
          {/* Anel ativo de Ouro */}
          <circle
            cx="50%"
            cy="50%"
            r={radius}
            fill="transparent"
            stroke="url(#goldGradient)"
            strokeWidth="7"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
          <defs>
            <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#D4AF37" />
              <stop offset="50%" stopColor="#F5D77F" />
              <stop offset="100%" stopColor="#B38728" />
            </linearGradient>
          </defs>
        </svg>

        {/* Agulha Magnética Giratória em 3D */}
        <div 
          className="absolute w-44 h-44 sm:w-52 sm:h-52 pointer-events-none transition-transform duration-1000 ease-out flex items-center justify-center"
          style={{ transform: `rotate(${needleAngle}deg)` }}
        >
          {/* Agulha Norte (Ouro & Vermelho Nobre) */}
          <div className="absolute top-1 w-3 h-20 sm:h-24 bg-gradient-to-t from-[#B38728] to-[#FFD700] rounded-t-full shadow-[0_0_12px_rgba(212,175,55,0.7)] clip-needle-north" />
          {/* Agulha Sul (Aço Frio) */}
          <div className="absolute bottom-1 w-3 h-20 sm:h-24 bg-gradient-to-b from-[#333A48] to-[#1C212B] rounded-b-full clip-needle-south" />
        </div>

        {/* Núcleo Central: O Escudo de Soberania & Pontuação */}
        <div 
          onClick={() => soundFX.playWarmChime()}
          className="relative z-10 w-28 h-28 sm:w-34 sm:h-34 rounded-full bg-gradient-to-br from-[#1B212D] via-[#10141C] to-[#0A0D12] border-2 border-[#D4AF37]/60 flex flex-col items-center justify-center shadow-[0_8px_32px_rgba(0,0,0,0.9),inset_0_2px_4px_rgba(255,255,255,0.15)] cursor-pointer group active:scale-95 transition-all"
        >
          <div className="text-[10px] uppercase tracking-widest text-[#D4AF37] font-semibold flex items-center gap-1">
            <Compass className="w-3 h-3 group-hover:rotate-45 transition-transform" />
            <span>Soberania</span>
          </div>

          <div className="font-serif-noble text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-stone-100 to-[#D4AF37] leading-none my-0.5">
            {score}%
          </div>

          <div className="text-[10px] text-stone-400 font-medium">
            {habitsCompleted} de {totalHabits} rituais
          </div>
        </div>

      </div>

      {/* Legenda de Status Subordinado */}
      <div className="mt-4 flex items-center gap-4 text-xs">
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#141A24] border border-[#D4AF37]/30 text-stone-300">
          <Flame className="w-3.5 h-3.5 text-amber-400" />
          <span>Pureza: <strong className="text-white">{purezaStreak} dias limpo</strong></span>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#141A24] border border-sky-500/30 text-stone-300">
          <Droplets className="w-3.5 h-3.5 text-sky-400" />
          <span>Pacto da Água: <strong className="text-sky-300">{score >= 50 ? 'Firme' : 'Em curso'}</strong></span>
        </div>
      </div>

    </div>
  );
};
