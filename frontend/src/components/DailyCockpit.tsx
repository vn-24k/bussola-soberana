import React, { useState } from 'react';
import { 
  Sun, Moon, Shield, Zap, Droplet, BookOpen, Dumbbell, BedDouble, 
  CheckCircle2, Circle, Plus, Minus, Target, Sparkles, Save, Compass, Flame, ArrowUpRight
} from 'lucide-react';
import { DailyLog } from '../lib/api';
import { soundFX } from '../lib/sound-fx';
import { SovereignCompassDial } from './SovereignCompassDial';

interface DailyCockpitProps {
  log: DailyLog;
  onUpdate: (updated: Partial<DailyLog>) => Promise<void>;
  onSyncObsidian: () => Promise<void>;
  purezaStreak: number;
}

export const DailyCockpit: React.FC<DailyCockpitProps> = ({
  log,
  onUpdate,
  onSyncObsidian,
  purezaStreak
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

  // Contagem de hábitos cumpridos
  const habitsList = [
    Boolean(log.habito_oracao_manha),
    Boolean(log.habito_oracao_noite),
    Boolean(log.habito_pureza),
    Boolean(log.habito_jejum),
    Boolean(log.habito_agua || Number(log.water_liters) >= 2.0),
    Boolean(log.habito_estudo || Number(log.study_minutes) >= 15),
    Boolean(log.habito_exercicio),
    Boolean(log.habito_sono),
  ];
  const habitsCompleted = habitsList.filter(Boolean).length;

  const habits = [
    {
      id: 'habito_pureza',
      label: 'Pureza Mental Inviolável',
      desc: '100% livre de pornografia e dopamina fácil. Foco no mundo real.',
      icon: Shield,
      color: 'text-[#D4AF37]',
      active: log.habito_pureza,
      badge: 'Pilar Inegociável',
      hero: true
    },
    {
      id: 'habito_oracao_manha',
      label: 'Oração da Manhã',
      desc: 'Gratidão, intenção sagrada e sabedoria antes de qualquer tela.',
      icon: Sun,
      color: 'text-amber-400',
      active: log.habito_oracao_manha,
    },
    {
      id: 'habito_oracao_noite',
      label: 'Oração da Noite',
      desc: 'Paz, serenidade e entrega espiritual antes de fechar os olhos.',
      icon: Moon,
      color: 'text-indigo-400',
      active: log.habito_oracao_noite,
    },
    {
      id: 'habito_jejum',
      label: 'Jejum & Autodomínio',
      desc: 'Fortalecimento do espírito: o corpo obedece à mente, e não o contrário.',
      icon: Zap,
      color: 'text-yellow-400',
      active: log.habito_jejum,
    },
    {
      id: 'habito_exercicio',
      label: 'Corpo de Guerreiro',
      desc: 'Treino físico, natação ou caminhada. O corpo é o templo da alma.',
      icon: Dumbbell,
      color: 'text-emerald-400',
      active: log.habito_exercicio,
    },
    {
      id: 'habito_sono',
      label: 'Sono & Desconexão',
      desc: 'Desligar telas antes de deitar. Recuperação biológica profunda.',
      icon: BedDouble,
      color: 'text-blue-400',
      active: log.habito_sono,
    },
  ];

  const moods = ['Focado', 'Sereno', 'Combate', 'Reflexivo', 'Cansado'];

  return (
    <div className="space-y-10 pb-20 relative z-10">
      
      {/* 1. Mostrador Central da Bússola Soberana (O Coração da Aplicação) */}
      <div className="card-soberano p-6 sm:p-10 relative overflow-hidden text-center">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-stone-800/80 pb-6 mb-2">
          <div className="text-left">
            <span className="text-[11px] font-serif-noble font-bold tracking-widest text-[#D4AF37] uppercase">
              {log.day_of_week} • {log.date}
            </span>
            <h1 className="font-serif-noble text-2xl sm:text-3xl font-extrabold text-white tracking-wide mt-1">
              Bússola Inabalável
            </h1>
            <p className="text-xs text-stone-300 italic mt-0.5 max-w-xl">
              "Não sou fruto das circunstâncias; sou fruto das minhas decisões inegociáveis."
            </p>
          </div>

          <button
            onClick={handleSaveAll}
            disabled={saving}
            className="flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-[#D4AF37] via-amber-500 to-[#B38728] text-black font-extrabold text-xs tracking-wider uppercase shadow-[0_0_25px_rgba(212,175,55,0.35)] hover:scale-[1.03] active:scale-[0.98] transition-all cursor-pointer"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Gravando...' : saveSuccess ? 'Sincronizado!' : 'Salvar no Obsidian'}
          </button>
        </div>

        {/* Mostrador Físico Rotativo */}
        <SovereignCompassDial
          score={log.sovereignty_score || 0}
          purezaStreak={purezaStreak}
          habitsCompleted={habitsCompleted}
          totalHabits={8}
        />

        {/* Nível de Energia & Humor Rápido */}
        <div className="mt-4 pt-6 border-t border-stone-800/80 grid grid-cols-1 sm:grid-cols-2 gap-6 text-left">
          <div>
            <div className="flex items-center justify-between text-xs uppercase tracking-wider text-stone-400 mb-2 font-medium">
              <span>Nível de Energia</span>
              <span className="text-[#D4AF37] font-bold text-sm">{log.energy_level || 8}/10</span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              value={log.energy_level || 8}
              onChange={(e) => onUpdate({ energy_level: Number(e.target.value) })}
              className="w-full h-2.5 bg-stone-800 rounded-lg appearance-none cursor-pointer accent-[#D4AF37]"
            />
          </div>

          <div>
            <span className="block text-xs uppercase tracking-wider text-stone-400 mb-2 font-medium">
              Estado de Espírito
            </span>
            <div className="flex flex-wrap gap-1.5">
              {moods.map((m) => (
                <button
                  key={m}
                  onClick={() => { soundFX.playClick(); onUpdate({ mood: m }); }}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    log.mood === m
                      ? 'bg-[#D4AF37] text-black font-bold shadow-md shadow-[#D4AF37]/20'
                      : 'bg-[#121620] text-stone-300 hover:bg-stone-800 border border-stone-800'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 2. Os 8 Hábitos de Ferro (Bento Grid) */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#D4AF37]/20 border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37]">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-serif-noble text-xl font-bold text-white tracking-wide">
                Os 8 Pilares de Ferro
              </h2>
              <p className="text-xs text-stone-400">Rituais diários que sustentam a soberania</p>
            </div>
          </div>
          <span className="text-xs font-serif-noble text-[#D4AF37] font-bold">{habitsCompleted}/8 Concluídos</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          
          {/* Card Especial: Pureza Mental (Destaque Principal) */}
          <div
            onClick={() => toggleHabit('habito_pureza')}
            className={`card-soberano p-6 cursor-pointer relative overflow-hidden group select-none md:col-span-2 lg:col-span-1 ${
              log.habito_pureza ? 'card-cumprido' : ''
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3.5">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border transition-all ${
                  log.habito_pureza
                    ? 'bg-[#D4AF37]/25 border-[#D4AF37] text-[#D4AF37] shadow-[0_0_15px_rgba(212,175,55,0.4)]'
                    : 'bg-[#121620] border-stone-800 text-stone-400'
                }`}>
                  <Shield className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-sm text-stone-100">Pureza Mental</h3>
                    <span className="text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
                      Inegociável
                    </span>
                  </div>
                  <p className="text-xs text-stone-400 mt-1 leading-snug">
                    100% livre de pornografia e dopamina barata.
                  </p>
                </div>
              </div>

              {log.habito_pureza ? (
                <CheckCircle2 className="w-6 h-6 text-[#D4AF37] shrink-0" />
              ) : (
                <Circle className="w-6 h-6 text-stone-600 group-hover:text-stone-400 shrink-0 transition-colors" />
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-stone-800/80 flex items-center justify-between text-[11px] text-stone-400">
              <span>Blindagem Ativa</span>
              <span className="text-amber-300 font-bold">{purezaStreak} dias consecutivos</span>
            </div>
          </div>

          {/* Card Especial: Água da Represa (Meta 2L com Nível Visual) */}
          <div className={`card-soberano p-6 relative overflow-hidden select-none ${
            (log.water_liters || 0) >= 2.0 ? 'card-cumprido' : ''
          }`}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-sky-950/40 border border-sky-500/40 flex items-center justify-center text-sky-400">
                  <Droplet className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-stone-100 flex items-center gap-2">
                    Água da Represa
                    <span className="text-[9px] uppercase px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 font-bold border border-sky-500/30">
                      Meta 2.0L
                    </span>
                  </h3>
                  <p className="text-xs text-stone-400">Pacto de pureza e hidratação</p>
                </div>
              </div>
              <span className="font-serif-noble text-xl font-black text-sky-300">{log.water_liters || 0}L</span>
            </div>

            {/* Barra de Água */}
            <div className="w-full bg-stone-900 rounded-full h-2 mb-4 overflow-hidden border border-stone-800">
              <div 
                className="bg-gradient-to-r from-sky-500 via-cyan-400 to-sky-300 h-2 rounded-full transition-all duration-300 shadow-[0_0_10px_#38BDF8]"
                style={{ width: `${Math.min(100, ((log.water_liters || 0) / 2.0) * 100)}%` }}
              />
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleWaterChange(-0.25)}
                className="flex-1 py-1.5 rounded-xl bg-[#121620] hover:bg-stone-800 border border-stone-800 text-stone-300 text-xs font-semibold flex items-center justify-center gap-1 cursor-pointer"
              >
                <Minus className="w-3.5 h-3.5" /> -250ml
              </button>
              <button
                onClick={() => handleWaterChange(0.25)}
                className="flex-1 py-1.5 rounded-xl bg-sky-950/50 hover:bg-sky-900/60 border border-sky-700/50 text-sky-200 text-xs font-semibold flex items-center justify-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> +250ml
              </button>
              <button
                onClick={() => handleWaterChange(0.5)}
                className="flex-1 py-1.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-black text-xs font-bold flex items-center justify-center gap-1 cursor-pointer shadow-md shadow-sky-500/30"
              >
                <Plus className="w-3.5 h-3.5" /> +500ml
              </button>
            </div>
          </div>

          {/* Card Especial: Estudo & Conhecimento (Meta 15m) */}
          <div className={`card-soberano p-6 relative overflow-hidden select-none ${
            (log.study_minutes || 0) >= 15 ? 'card-cumprido' : ''
          }`}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-950/40 border border-amber-500/40 flex items-center justify-center text-amber-400">
                  <BookOpen className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-stone-100 flex items-center gap-2">
                    Estudo & Código
                    <span className="text-[9px] uppercase px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
                      Meta 15m
                    </span>
                  </h3>
                  <p className="text-xs text-stone-400">Leitura, TCC ou engenharia</p>
                </div>
              </div>
              <span className="font-serif-noble text-xl font-black text-amber-300">{log.study_minutes || 0}m</span>
            </div>

            {/* Barra de Estudo */}
            <div className="w-full bg-stone-900 rounded-full h-2 mb-4 overflow-hidden border border-stone-800">
              <div 
                className="bg-gradient-to-r from-amber-500 to-yellow-300 h-2 rounded-full transition-all duration-300 shadow-[0_0_10px_#F59E0B]"
                style={{ width: `${Math.min(100, ((log.study_minutes || 0) / 15) * 100)}%` }}
              />
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleStudyChange(-5)}
                className="flex-1 py-1.5 rounded-xl bg-[#121620] hover:bg-stone-800 border border-stone-800 text-stone-300 text-xs font-semibold flex items-center justify-center gap-1 cursor-pointer"
              >
                <Minus className="w-3.5 h-3.5" /> -5m
              </button>
              <button
                onClick={() => handleStudyChange(5)}
                className="flex-1 py-1.5 rounded-xl bg-amber-950/50 hover:bg-amber-900/60 border border-amber-700/50 text-amber-200 text-xs font-semibold flex items-center justify-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> +5m
              </button>
              <button
                onClick={() => handleStudyChange(15)}
                className="flex-1 py-1.5 rounded-xl bg-[#D4AF37] hover:bg-amber-400 text-black text-xs font-bold flex items-center justify-center gap-1 cursor-pointer shadow-md shadow-[#D4AF37]/30"
              >
                <Plus className="w-3.5 h-3.5" /> +15m
              </button>
            </div>
          </div>

          {/* Demais Hábitos de Toque Direto */}
          {habits.filter(h => h.id !== 'habito_pureza').map((h) => {
            const Icon = h.icon;
            return (
              <div
                key={h.id}
                onClick={() => toggleHabit(h.id as keyof DailyLog)}
                className={`card-soberano p-6 cursor-pointer relative overflow-hidden group select-none ${
                  h.active ? 'card-cumprido' : ''
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3.5">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border transition-all ${
                      h.active 
                        ? 'bg-[#D4AF37]/25 border-[#D4AF37] text-[#D4AF37] shadow-[0_0_12px_rgba(212,175,55,0.3)]' 
                        : 'bg-[#121620] border-stone-800 text-stone-400 group-hover:border-stone-700'
                    }`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-stone-100">{h.label}</h3>
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

        </div>
      </div>

      {/* 3. As 3 Prioridades Inegociáveis (A Forja do Dia) */}
      <div className="card-soberano p-6 sm:p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/20 border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37]">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-serif-noble text-lg sm:text-xl font-bold text-white tracking-wide">
              3 Prioridades Inegociáveis
            </h2>
            <p className="text-xs text-stone-400">O que define a vitória do seu dia hoje</p>
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
                className={`flex items-center gap-3 p-4 rounded-2xl border transition-all ${
                  isDone 
                    ? 'bg-[#161D29]/80 border-[#D4AF37]/50 text-stone-300' 
                    : 'bg-[#10131A] border-stone-800 text-white'
                }`}
              >
                <button
                  onClick={() => {
                    soundFX.playToggle(!isDone);
                    onUpdate({ [doneKey]: !isDone });
                  }}
                  className="p-1 text-[#D4AF37] hover:scale-110 transition-transform cursor-pointer"
                >
                  {isDone ? (
                    <CheckCircle2 className="w-6 h-6 text-[#D4AF37]" />
                  ) : (
                    <Circle className="w-6 h-6 text-stone-600 hover:text-stone-400" />
                  )}
                </button>

                <span className="font-serif-noble font-black text-[#D4AF37] text-base w-6">{num}.</span>

                <input
                  type="text"
                  value={val}
                  placeholder={`Definir prioridade ${num}...`}
                  onChange={(e) => onUpdate({ [textKey]: e.target.value })}
                  className={`w-full bg-transparent border-0 text-sm focus:ring-0 focus:outline-none ${
                    isDone ? 'line-through text-stone-400' : 'text-stone-100 font-medium'
                  }`}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Atividades & Revisão Noturna */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card-soberano p-6">
          <h3 className="font-serif-noble font-bold text-base text-stone-200 mb-1">
            📋 Registro de Atividades do Dia
          </h3>
          <p className="text-xs text-stone-400 mb-3">O que você construiu, resolveu ou avançou hoje</p>
          <textarea
            rows={4}
            value={log.activity_notes || ''}
            onChange={(e) => onUpdate({ activity_notes: e.target.value })}
            placeholder="Ex: Treinei pernas, avancei no código do backend, organizei as contas..."
            className="w-full bg-[#0D1016] border border-stone-800 rounded-2xl p-4 text-sm text-stone-200 focus:outline-none focus:border-[#D4AF37]/50 resize-none"
          />
        </div>

        <div className="card-soberano p-6">
          <h3 className="font-serif-noble font-bold text-base text-stone-200 mb-1">
            🔍 Revisão Noturna & Gratidão
          </h3>
          <p className="text-xs text-stone-400 mb-3">Pelo que sou grato hoje? Como posso ser 1% melhor amanhã?</p>
          <textarea
            rows={4}
            value={log.evening_review || ''}
            onChange={(e) => onUpdate({ evening_review: e.target.value })}
            placeholder="Ex: Grato pelo prato de comida quente, pelo aprendizado, mente serena antes de dormir..."
            className="w-full bg-[#0D1016] border border-stone-800 rounded-2xl p-4 text-sm text-stone-200 focus:outline-none focus:border-[#D4AF37]/50 resize-none"
          />
        </div>
      </div>

    </div>
  );
};
