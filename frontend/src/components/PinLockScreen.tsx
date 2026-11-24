import React, { useState } from 'react';
import { Shield, Lock, ArrowRight, AlertCircle } from 'lucide-react';
import { soundFX } from '../lib/sound-fx';

interface PinLockScreenProps {
  onUnlock: (pin: string) => void;
}

export const PinLockScreen: React.FC<PinLockScreenProps> = ({ onUnlock }) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  const handleKeyClick = (digit: string) => {
    soundFX.playClick();
    setError(false);
    if (pin.length < 5) {
      const nextPin = pin + digit;
      setPin(nextPin);
      if (nextPin.length === 5) {
        verifyPin(nextPin);
      }
    }
  };

  const handleBackspace = () => {
    soundFX.playClick();
    setPin(pin.slice(0, -1));
    setError(false);
  };

  const verifyPin = (candidatePin: string) => {
    if (candidatePin === '24816') {
      soundFX.playWarmChime();
      onUnlock(candidatePin);
    } else {
      soundFX.playToggle(false);
      setError(true);
      setTimeout(() => {
        setPin('');
      }, 800);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0D11] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm card-soberano p-8 border-[#D4AF37]/35 shadow-2xl text-center space-y-6">
        
        {/* Ícone de Escudo e Cadeado */}
        <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-[#D4AF37]/25 to-amber-900/30 border border-[#D4AF37]/50 flex items-center justify-center text-[#D4AF37] mx-auto shadow-lg shadow-[#D4AF37]/15">
          <Shield className="w-8 h-8" />
        </div>

        <div>
          <h1 className="font-serif-noble text-2xl font-bold text-white tracking-wide">
            BÚSSOLA SOBERANA
          </h1>
          <p className="text-xs text-stone-400 mt-1">
            Sistema Restrito • Digite a Chave de Soberania
          </p>
        </div>

        {/* Indicadores de Dígitos (Bolinhas) */}
        <div className="flex justify-center gap-3 py-2">
          {[0, 1, 2, 3, 4].map((idx) => {
            const isFilled = idx < pin.length;
            return (
              <div
                key={idx}
                className={`w-3.5 h-3.5 rounded-full transition-all duration-200 ${
                  error
                    ? 'bg-rose-500 border border-rose-400 scale-110'
                    : isFilled
                    ? 'bg-[#D4AF37] scale-110 shadow-md shadow-[#D4AF37]/50'
                    : 'bg-stone-800 border border-stone-700'
                }`}
              />
            );
          })}
        </div>

        {error && (
          <div className="flex items-center justify-center gap-1.5 text-xs text-rose-400 font-semibold animate-shake">
            <AlertCircle className="w-4 h-4" />
            <span>Chave inválida. Acesso negado.</span>
          </div>
        )}

        {/* Teclado Numérico */}
        <div className="grid grid-cols-3 gap-2.5 pt-2">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
            <button
              key={digit}
              type="button"
              onClick={() => handleKeyClick(digit)}
              className="h-14 rounded-2xl bg-[#141821] hover:bg-[#1C2230] active:scale-95 border border-stone-800 text-stone-100 font-bold text-lg transition-all flex items-center justify-center cursor-pointer"
            >
              {digit}
            </button>
          ))}
          <button
            type="button"
            onClick={handleBackspace}
            className="h-14 rounded-2xl bg-[#141821] hover:bg-stone-800 active:scale-95 border border-stone-800 text-stone-400 text-xs font-semibold transition-all flex items-center justify-center cursor-pointer"
          >
            Apagar
          </button>
          <button
            type="button"
            onClick={() => handleKeyClick('0')}
            className="h-14 rounded-2xl bg-[#141821] hover:bg-[#1C2230] active:scale-95 border border-stone-800 text-stone-100 font-bold text-lg transition-all flex items-center justify-center cursor-pointer"
          >
            0
          </button>
          <button
            type="button"
            onClick={() => pin.length === 5 && verifyPin(pin)}
            className="h-14 rounded-2xl bg-[#D4AF37] hover:bg-amber-400 active:scale-95 text-black font-extrabold text-sm transition-all flex items-center justify-center cursor-pointer"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

        <div className="text-[10px] text-stone-500 pt-2">
          Blindagem criptografada • ItzReal Life OS
        </div>

      </div>
    </div>
  );
};
