import React, { useState } from 'react';
import { 
  Sun, Moon, Shield, Zap, Droplet, BookOpen, Dumbbell, BedDouble, 
  CheckCircle2, Circle, Plus, Minus, Target, Sparkles, Save, Compass
} from 'lucide-react';
import { DailyLog } from '../lib/api';
import { soundFX } from '../lib/sound-fx';

interface DailyCockpitProps {
  log: DailyLog;
  onUpdate: (updated: Partial<DailyLog>) => Promise<void>;
  onSyncObsidian: () => Promise<void>;
}

export const DailyCockpit: React.FC<DailyCockpitProps> = ({
  log,
  onUpdate,
  onSyncObsidian
}) => {
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const toggleHabit = async (field: keyof DailyLog) => {
    const newVal = !log[field];
    soundFX.playToggle(newVal as boolean);
    await onUpdate({ [field]: newVal });
  };

  const handleWaterChange = async (delta: number) => {
    const current = Number(log.water_liters || 0);
    const updated = Math.max(0, Math.min(5.0, Number((current + delta).toFixed(1))));
    soundFX.playClick();
    if (updated >= 2.0 && current < 2.0) {
      soundFX.playWarmChime();
    }
    await onUpdate({ 
      water_liters: updated,
      habito_agua: updated >= 2.0
    });
  };

  const handleStudyChange = async (delta: number) => {
    const current = Number(log.study_minutes || 0);
    const updated = Math.max(0, current + delta);
    soundFX.playClick();
    if (updated >= 15 && current < 15) {
      soundFX.playWarmChime();
    }
    await onUpdate({
      study_minutes: updated,
      habito_estudo: updated >= 15
    });
  };

  const handleSaveAll = async () => {
    setSaving(true);
    soundFX.playClick();
    try {
      await onUpdate(log);
      await onSyncObsidian();
      soundFX.playWarmChime();
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } finally {
      setSaving(false);
    }
  };

  const habits = [
    {
      id: 'habito_oracao_manha',
      label: 'Oração da Manhã',
      desc: 'Gratidão, intenção sagrada e sabedoria ao acordar',
      icon: Sun,
      color: 'text-amber-400',
      active: log.habito_oracao_manha,
    },
    {
      id: 'habito_oracao_noite',
      label: 'Oração da Noite',
      desc: 'Paz, serenidade e entrega antes de dormir',
      icon: Moon,
      color: 'text-indigo-400',
      active: log.habito_oracao_noite,
    },
    {
      id: 'habito_pureza',
      label: 'Pureza Mental',
      desc: '100% livre de pornografia e focado no mundo real',
      icon: Shield,
      color: 'text-[#D4AF37]',
      active: log.habito_pureza,
      badge: 'Pilar Inegociável',
    },
    {
      id: 'habito_jejum',
      label: 'Jejum & Autodomínio',
      desc: 'Fortalecimento do espírito e controle da mente',
      icon: Zap,
      color: 'text-yellow-400',
      active: log.habito_jejum,
    },
    {
      id: 'habito_exercicio',
      label: 'Corpo & Treino',
      desc: '20 minutos de caminhada, natação ou exercício',
      icon: Dumbbell,
      color: 'text-emerald-400',
      active: log.habito_exercicio,
    },
    {
      id: 'habito_sono',
      label: 'Sono & Desconexão',
      desc: 'Desconectar de telas antes de deitar',
      icon: BedDouble,
      color: 'text-blue-400',
      active: log.habito_sono,
    },
  ];

  const moods = ['Focado', 'Sereno', 'Combate', 'Reflexivo', 'Cansado'];

  return (
    <div className="space-y-8 pb-16">
      
      {/* Banner Principal com Data e Princípio */}
      <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-[#161B26] via-[#10131A] to-[#0A0C10] border border-[#D4AF37]/25 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#D4AF37] font-semibold mb-2">
              <Compass className="w-4 h-4" />
              <span>{log.day_of_week} • {log.date}</span>
            </div>
            <h1 className="font-serif-noble text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-wide">
              Cockpit da Bússola Inabalável
            </h1>
            <p className="mt-2 text-sm text-stone-300 max-w-2xl leading-relaxed italic">
              "Quando a motivação acaba, o princípio sustenta. Não sou fruto das circunstâncias; sou fruto das minhas decisões inegociáveis."
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <button
              onClick={handleSaveAll}
              disabled={saving}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-[#D4AF37] to-amber-600 text-black font-extrabold text-sm tracking-wide shadow-lg shadow-[#D4AF37]/20 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Gravando...' : saveSuccess ? 'Sincronizado!' : 'Salvar & Sincronizar'}
            </button>
          </div>
        </div>

        {/* Nível de Energia & Humor Rápido */}
        <div className="mt-6 pt-6 border-t border-stone-800/80 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs uppercase tracking-wider text-stone-400 mb-2 font-medium">
              Nível de Energia: <span className="text-[#D4AF37] font-bold text-sm">{log.energy_level || 8}/10</span>
            </label>
            <input
              type="range"
              min="1"
              max="10"
              value={log.energy_level || 8}
              onChange={(e) => onUpdate({ energy_level: Number(e.target.value) })}
              className="w-full h-2 bg-stone-800 rounded-lg appearance-none cursor-pointer accent-[#D4AF37]"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-stone-400 mb-2 font-medium">
              Estado de Espírito / Humor:
            </label>
            <div className="flex flex-wrap gap-1.5">
              {moods.map((m) => (
                <button
                  key={m}
                  onClick={() => { soundFX.playClick(); onUpdate({ mood: m }); }}
                  className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all ${
                    log.mood === m
                      ? 'bg-[#D4AF37] text-black font-bold'
                      : 'bg-[#181C26] text-stone-300 hover:bg-stone-800 border border-stone-800'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Grid dos 8 Hábitos Inegociáveis (Bento Grid) */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#D4AF37]" />
            <h2 className="font-serif-noble text-xl font-bold text-white tracking-wide">Os 8 Hábitos de Ferro</h2>
          </div>
          <span className="text-xs text-stone-400">Marque ao cumprir cada ritual</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          
          {/* Hábitos de Toque Simples */}
          {habits.map((h) => {
            const Icon = h.icon;
            return (
              <div
                key={h.id}
                onClick={() => toggleHabit(h.id as keyof DailyLog)}
                className={`card-soberano p-5 cursor-pointer relative overflow-hidden group select-none ${
                  h.active ? 'border-[#D4AF37]/50 bg-[#161C26]/90 shadow-md shadow-[#D4AF37]/10' : ''
                }`}
              >
                {h.active && (
                  <div className="absolute top-0 right-0 w-24 h-24 bg-[#D4AF37]/10 rounded-full blur-xl -mr-6 -mt-6 pointer-events-none" />
                )}

                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-11 h-11 rounded-2xl flex items-center justify-center border transition-all ${
                      h.active 
                        ? 'bg-[#D4AF37]/20 border-[#D4AF37]/60 text-[#D4AF37]' 
                        : 'bg-[#141821] border-stone-800 text-stone-400 group-hover:border-stone-700'
                    }`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-stone-100 flex items-center gap-2">
                        {h.label}
                        {h.badge && (
                          <span className="text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
                            {h.badge}
                          </span>
                        )}
                      </h3>
                      <p className="text-xs text-stone-400 mt-0.5 leading-snug">{h.desc}</p>
                    </div>
                  </div>

                  <div className="mt-1">
                    {h.active ? (
                      <CheckCircle2 className="w-6 h-6 text-[#D4AF37]" />
                    ) : (
                      <Circle className="w-6 h-6 text-stone-600 group-hover:text-stone-400 transition-colors" />
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Card Interativo: Água 2L (Pacto com a Água) */}
          <div className={`card-soberano p-5 relative overflow-hidden ${
            (log.water_liters || 0) >= 2.0 ? 'border-sky-500/50 bg-[#101B2B]/90' : ''
          }`}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-sky-950/40 border border-sky-500/40 flex items-center justify-center text-sky-400">
                  <Droplet className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-stone-100 flex items-center gap-2">
                    Água da Represa
                    <span className="text-[9px] uppercase px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 font-bold border border-sky-500/30">
                      Meta: 2.0L
                    </span>
                  </h3>
                  <p className="text-xs text-stone-400">Hidratação e limpeza celular</p>
                </div>
              </div>
              <span className="text-lg font-extrabold text-sky-300">{log.water_liters || 0}L</span>
            </div>

            {/* Barra de Progresso de Água */}
            <div className="w-full bg-stone-800/80 rounded-full h-2 mb-4 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-sky-500 to-cyan-400 h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(100, ((log.water_liters || 0) / 2.0) * 100)}%` }}
              />
            </div>

            {/* Controles de Água */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleWaterChange(-0.25)}
                className="flex-1 py-1.5 rounded-xl bg-[#141821] hover:bg-stone-800 border border-stone-800 text-stone-300 text-xs font-semibold flex items-center justify-center gap-1"
              >
                <Minus className="w-3.5 h-3.5" /> -250ml
              </button>
              <button
                onClick={() => handleWaterChange(0.25)}
                className="flex-1 py-1.5 rounded-xl bg-sky-900/40 hover:bg-sky-800/50 border border-sky-700/50 text-sky-200 text-xs font-semibold flex items-center justify-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> +250ml
              </button>
              <button
                onClick={() => handleWaterChange(0.5)}
                className="flex-1 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-black text-xs font-bold flex items-center justify-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> +500ml
              </button>
            </div>
          </div>

          {/* Card Interativo: Estudo 15min */}
          <div className={`card-soberano p-5 relative overflow-hidden ${
            (log.study_minutes || 0) >= 15 ? 'border-amber-500/50 bg-[#1E1912]/90' : ''
          }`}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-amber-950/40 border border-amber-500/40 flex items-center justify-center text-amber-400">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-stone-100 flex items-center gap-2">
                    Estudo & Conhecimento
                    <span className="text-[9px] uppercase px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
                      Meta: 15m
                    </span>
                  </h3>
                  <p className="text-xs text-stone-400">Leitura, TCC ou engenharia</p>
                </div>
              </div>
              <span className="text-lg font-extrabold text-amber-300">{log.study_minutes || 0} min</span>
            </div>

            {/* Barra de Progresso de Estudo */}
            <div className="w-full bg-stone-800/80 rounded-full h-2 mb-4 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-amber-500 to-yellow-400 h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(100, ((log.study_minutes || 0) / 15) * 100)}%` }}
              />
            </div>

            {/* Controles de Estudo */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleStudyChange(-5)}
                className="flex-1 py-1.5 rounded-xl bg-[#141821] hover:bg-stone-800 border border-stone-800 text-stone-300 text-xs font-semibold flex items-center justify-center gap-1"
              >
                <Minus className="w-3.5 h-3.5" /> -5m
              </button>
              <button
                onClick={() => handleStudyChange(5)}
                className="flex-1 py-1.5 rounded-xl bg-amber-900/40 hover:bg-amber-800/50 border border-amber-700/50 text-amber-200 text-xs font-semibold flex items-center justify-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> +5m
              </button>
              <button
                onClick={() => handleStudyChange(15)}
                className="flex-1 py-1.5 rounded-xl bg-[#D4AF37] hover:bg-amber-400 text-black text-xs font-bold flex items-center justify-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> +15m
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* 3 Prioridades Inegociáveis do Dia */}
      <div className="card-soberano p-6 sm:p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/20 border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37]">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-serif-noble text-lg sm:text-xl font-bold text-white tracking-wide">
              3 Prioridades Inegociáveis de Hoje
            </h2>
            <p className="text-xs text-stone-400">Se você cumprir apenas estas três, o seu dia foi vitorioso</p>
          </div>
        </div>

        <div className="space-y-4">
          {[1, 2, 3].map((num) => {
            const textKey = `priority_${num}` as keyof DailyLog;
            const doneKey = `priority_${num}_done` as keyof DailyLog;
            const isDone = Boolean(log[doneKey]);
            const val = (log[textKey] as string) || '';

            return (
              <div
                key={num}
                className={`flex items-center gap-3 p-3.5 rounded-2xl border transition-all ${
                  isDone 
                    ? 'bg-amber-950/20 border-[#D4AF37]/40 text-stone-300' 
                    : 'bg-[#10131A] border-stone-800 text-white'
                }`}
              >
                <button
                  onClick={() => {
                    soundFX.playToggle(!isDone);
                    onUpdate({ [doneKey]: !isDone });
                  }}
                  className="p-1 text-[#D4AF37] hover:scale-110 transition-transform"
                >
                  {isDone ? (
                    <CheckCircle2 className="w-6 h-6 text-[#D4AF37]" />
                  ) : (
                    <Circle className="w-6 h-6 text-stone-600 hover:text-stone-400" />
                  )}
                </button>

                <span className="font-serif-noble font-bold text-[#D4AF37] text-sm w-5">{num}.</span>

                <input
                  type="text"
                  value={val}
                  placeholder={`Definir prioridade ${num}...`}
                  onChange={(e) => onUpdate({ [textKey]: e.target.value })}
                  className={`w-full bg-transparent border-0 text-sm focus:ring-0 focus:outline-none ${
                    isDone ? 'line-through text-stone-400' : 'text-stone-100'
                  }`}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Bloco de Reflexão Noturna & Atividades */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card-soberano p-6">
          <h3 className="font-serif-noble font-bold text-base text-stone-200 mb-2">
            📋 Registro de Atividades do Dia
          </h3>
          <p className="text-xs text-stone-400 mb-3">O que você construiu, resolveu ou avançou hoje</p>
          <textarea
            rows={4}
            value={log.activity_notes || ''}
            onChange={(e) => onUpdate({ activity_notes: e.target.value })}
            placeholder="Ex: Treinei pernas, avancei no código do backend, organizei as contas..."
            className="w-full bg-[#10131A] border border-stone-800 rounded-2xl p-4 text-sm text-stone-200 focus:outline-none focus:border-[#D4AF37]/50 resize-none"
          />
        </div>

        <div className="card-soberano p-6">
          <h3 className="font-serif-noble font-bold text-base text-stone-200 mb-2">
            🔍 Revisão Noturna & Gratidão
          </h3>
          <p className="text-xs text-stone-400 mb-3">Pelo que sou grato hoje? Como posso ser 1% melhor amanhã?</p>
          <textarea
            rows={4}
            value={log.evening_review || ''}
            onChange={(e) => onUpdate({ evening_review: e.target.value })}
            placeholder="Ex: Grato pelo prato de comida quente, pelo aprendizado, mente serena antes de dormir..."
            className="w-full bg-[#10131A] border border-stone-800 rounded-2xl p-4 text-sm text-stone-200 focus:outline-none focus:border-[#D4AF37]/50 resize-none"
          />
        </div>
      </div>

    </div>
  );
};
