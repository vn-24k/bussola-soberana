import React, { useState } from 'react';
import { Compass, Flame, Volume2, VolumeX, ShieldCheck, Lock } from 'lucide-react';
import { soundFX } from '../lib/sound-fx';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  purezaStreak: number;
  sovereigntyScore: number;
  onLock?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  purezaStreak,
  sovereigntyScore,
  onLock
}) => {
  const [muted, setMuted] = useState(false);

  const toggleSound = () => {
    soundFX.playClick();
    setMuted(!muted);
  };

  const navItems = [
    { id: 'cockpit', label: 'Cockpit Diário', icon: Compass },
    { id: 'cbt', label: 'Laboratório TCC', icon: ShieldCheck },
    { id: 'sanctuary', label: 'Manifesto & Alma', icon: Flame },
    { id: 'obsidian', label: 'Ponte Obsidian', icon: Compass },
  ];

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#0B0D11]/85 border-b border-[#272B33]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          
          {/* Logo Nobre */}
          <div 
            onClick={() => { soundFX.playClick(); setActiveTab('cockpit'); }}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#D4AF37]/30 to-amber-900/20 border border-[#D4AF37]/40 flex items-center justify-center shadow-lg shadow-[#D4AF37]/10 group-hover:scale-105 transition-transform">
              <Compass className="w-5 h-5 text-[#D4AF37]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif-noble text-lg font-bold tracking-wider text-stone-100">BÚSSOLA</span>
                <span className="text-xs uppercase tracking-widest px-2 py-0.5 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/30 text-[#D4AF37] font-semibold">SOBERANA</span>
              </div>
              <p className="text-[10px] text-stone-400 tracking-wide">ItzReal Life OS • Vinícius Caetano</p>
            </div>
          </div>

          {/* Navegação Desktop */}
          <nav className="hidden md:flex items-center gap-1 bg-[#141821]/80 p-1.5 rounded-2xl border border-stone-800">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    soundFX.playClick();
                    setActiveTab(item.id);
                  }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                    isActive
                      ? 'bg-[#D4AF37] text-black shadow-md shadow-[#D4AF37]/20 font-bold'
                      : 'text-stone-300 hover:text-white hover:bg-stone-800/60'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Indicadores de Soberania & Pureza */}
          <div className="flex items-center gap-3">
            {/* Streak de Pureza */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-950/40 to-stone-900 border border-amber-600/30">
              <Flame className="w-4 h-4 text-amber-400 animate-pulse" />
              <div className="text-left">
                <div className="text-[9px] uppercase tracking-wider text-amber-300 font-semibold">Pureza Mental</div>
                <div className="text-xs font-extrabold text-white">{purezaStreak} <span className="text-[10px] text-stone-400 font-normal">dias</span></div>
              </div>
            </div>

            {/* Score Soberania */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#141821] border border-stone-800">
              <div className="w-7 h-7 rounded-lg bg-[#D4AF37]/20 border border-[#D4AF37]/40 flex items-center justify-center font-bold text-xs text-[#D4AF37]">
                {sovereigntyScore}%
              </div>
              <div className="text-left">
                <div className="text-[9px] uppercase tracking-wider text-stone-400">Soberania</div>
                <div className="text-xs font-semibold text-stone-200">Hoje</div>
              </div>
            </div>

            {/* Botão de Trancar */}
            {onLock && (
              <button
                onClick={onLock}
                title="Bloquear Bússola"
                className="p-2.5 rounded-xl bg-[#141821] border border-stone-800 text-stone-400 hover:text-rose-400 hover:border-rose-500/30 transition-all cursor-pointer"
              >
                <Lock className="w-4 h-4" />
              </button>
            )}

            {/* Som Toggle */}
            <button
              onClick={toggleSound}
              title={muted ? 'Ativar feedback sonoro' : 'Silenciar feedback sonoro'}
              className="p-2.5 rounded-xl bg-[#141821] border border-stone-800 text-stone-400 hover:text-[#D4AF37] hover:border-[#D4AF37]/30 transition-all cursor-pointer"
            >
              {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
          </div>

        </div>

        {/* Navegação Mobile */}
        <div className="md:hidden flex items-center justify-around py-2 border-t border-stone-800/80 gap-1 overflow-x-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  soundFX.playClick();
                  setActiveTab(item.id);
                }}
                className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl text-[10px] font-medium transition-all ${
                  isActive
                    ? 'text-[#D4AF37] font-bold bg-[#D4AF37]/10 border border-[#D4AF37]/20'
                    : 'text-stone-400'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>

      </div>
    </header>
  );
};
