import React, { useState, useEffect } from 'react';
import { ShieldCheck, Plus, Brain, Sparkles, Check, ChevronRight, History, Trash2 } from 'lucide-react';
import { CBTEntry, fetchCBTEntries, createCBTEntry } from '../lib/api';
import { soundFX } from '../lib/sound-fx';

const DISTORCOES = [
  { id: 'catastrofizacao', name: 'Catastrofização', desc: 'Esperar o pior cenário possível sem evidências reais.' },
  { id: 'leitura_mental', name: 'Leitura Mental', desc: 'Achar que sabe o que os outros estão pensando contra você.' },
  { id: 'tudo_ou_nada', name: 'Pensamento Tudo ou Nada', desc: 'Ver as coisas como 100% perfeitas ou fracasso total.' },
  { id: 'filtro_negativo', name: 'Filtro Negativo', desc: 'Focar apenas no ponto negativo e ignorar todas as bênçãos.' },
  { id: 'raciocinio_emocional', name: 'Raciocínio Emocional', desc: 'Achar que se você sente medo ou culpa, a culpa é real.' },
  { id: 'deveria', name: 'Afirmações de "Deveria"', desc: 'Cobranças irreais com "eu deveria", gerando frustração.' },
];

export const CBTWorkshop: React.FC = () => {
  const [entries, setEntries] = useState<CBTEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);

  // Form State
  const [situation, setSituation] = useState('');
  const [automaticThought, setAutomaticThought] = useState('');
  const [distortion, setDistortion] = useState(DISTORCOES[0].name);
  const [rationalResponse, setRationalResponse] = useState('');
  const [outcome, setOutcome] = useState('Alívio imediato e mente serena');

  const loadData = async () => {
    setLoading(true);
    const data = await fetchCBTEntries();
    setEntries(data);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!situation || !automaticThought || !rationalResponse) return;

    soundFX.playClick();
    const newEntry: CBTEntry = {
      date: new Date().toISOString().split('T')[0],
      situation,
      automatic_thought: automaticThought,
      cognitive_distortion: distortion,
      rational_response: rationalResponse,
      outcome_emotion: outcome,
    };

    await createCBTEntry(newEntry);
    soundFX.playWarmChime();
    setSituation('');
    setAutomaticThought('');
    setRationalResponse('');
    setIsCreating(false);
    loadData();
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* Cabeçalho */}
      <div className="card-soberano p-6 sm:p-8 bg-gradient-to-br from-[#161C26] via-[#10141D] to-[#0B0D12]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#D4AF37] font-semibold mb-2">
              <Brain className="w-4 h-4" />
              <span>Terapia Cognitivo-Comportamental • Reprogramação Diária</span>
            </div>
            <h1 className="font-serif-noble text-2xl sm:text-3xl font-bold text-white tracking-wide">
              Laboratório TCC: Mente Livre
            </h1>
            <p className="mt-1 text-sm text-stone-300 max-w-2xl leading-relaxed italic">
              "Coloque o pensamento no tribunal dos fatos: Qual é a evidência real disso? Estou operando com base na realidade ou na memória de dor?"
            </p>
          </div>

          <button
            onClick={() => {
              soundFX.playClick();
              setIsCreating(!isCreating);
            }}
            className="flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-[#D4AF37] hover:bg-amber-400 text-black font-extrabold text-sm tracking-wide shadow-lg shadow-[#D4AF37]/20 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            {isCreating ? 'Fechar Formulário' : 'Nova Reestruturação'}
          </button>
        </div>
      </div>

      {/* Formulário Wizard de Reestruturação */}
      {isCreating && (
        <form onSubmit={handleSubmit} className="card-soberano p-6 sm:p-8 border-[#D4AF37]/40 space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-stone-800">
            <div className="w-9 h-9 rounded-xl bg-[#D4AF37]/20 border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif-noble font-bold text-lg text-white">
                Desmontar Pensamento Automático
              </h2>
              <p className="text-xs text-stone-400">Transforme ansiedade e ruído mental em clareza objetiva</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Passo 1: A Situação */}
            <div>
              <label className="block text-xs uppercase tracking-wider text-stone-300 font-bold mb-2">
                1. Situação Real (Fato Objetivo)
              </label>
              <textarea
                rows={3}
                required
                value={situation}
                onChange={(e) => setSituation(e.target.value)}
                placeholder="O que aconteceu de fato? (Ex: Mensagem não respondida, imprevisto de trabalho, dor de cabeça...)"
                className="w-full bg-[#10131A] border border-stone-800 rounded-2xl p-4 text-sm text-stone-200 focus:outline-none focus:border-[#D4AF37]/50 resize-none"
              />
            </div>

            {/* Passo 2: Pensamento Automático */}
            <div>
              <label className="block text-xs uppercase tracking-wider text-stone-300 font-bold mb-2">
                2. Pensamento Automático (O Que a Mente Gritou)
              </label>
              <textarea
                rows={3}
                required
                value={automaticThought}
                onChange={(e) => setAutomaticThought(e.target.value)}
                placeholder="Ex: 'Tudo vai dar errado', 'Eles estão me julgando', 'Não sou capaz'..."
                className="w-full bg-[#10131A] border border-stone-800 rounded-2xl p-4 text-sm text-stone-200 focus:outline-none focus:border-red-500/50 resize-none"
              />
            </div>

          </div>

          {/* Passo 3: Identificar a Distorção Cognitiva */}
          <div>
            <label className="block text-xs uppercase tracking-wider text-stone-300 font-bold mb-3">
              3. Identifique a Armadilha da Mente (Distorção Cognitiva)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {DISTORCOES.map((d) => (
                <div
                  key={d.id}
                  onClick={() => {
                    soundFX.playClick();
                    setDistortion(d.name);
                  }}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                    distortion === d.name
                      ? 'bg-[#D4AF37]/15 border-[#D4AF37] text-white shadow-md shadow-[#D4AF37]/10'
                      : 'bg-[#10131A] border-stone-800 text-stone-400 hover:border-stone-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-xs text-stone-200">{d.name}</span>
                    {distortion === d.name && <Check className="w-4 h-4 text-[#D4AF37]" />}
                  </div>
                  <p className="text-[11px] text-stone-400 leading-snug">{d.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Passo 4: Resposta Racional da Bússola */}
          <div>
            <label className="block text-xs uppercase tracking-wider text-[#D4AF37] font-bold mb-2">
              4. Resposta Racional (O Homem Livre e Lúcido Falando)
            </label>
            <textarea
              rows={4}
              required
              value={rationalResponse}
              onChange={(e) => setRationalResponse(e.target.value)}
              placeholder="Ex: Os fatos mostram que eu já superei desafios muito maiores. O silêncio da outra pessoa é circunstancial. Eu tenho o controle das minhas ações e estou no comando."
              className="w-full bg-[#10131A] border border-[#D4AF37]/40 rounded-2xl p-4 text-sm text-stone-100 focus:outline-none focus:border-[#D4AF37] resize-none"
            />
          </div>

          {/* Resultado Emocional */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            <div className="w-full sm:w-auto flex items-center gap-2">
              <span className="text-xs text-stone-400">Resultado Emocional:</span>
              <input
                type="text"
                value={outcome}
                onChange={(e) => setOutcome(e.target.value)}
                className="bg-[#10131A] border border-stone-800 rounded-xl px-3 py-1.5 text-xs text-stone-200 focus:outline-none focus:border-[#D4AF37]/50"
              />
            </div>

            <button
              type="submit"
              className="w-full sm:w-auto px-8 py-3 rounded-2xl bg-gradient-to-r from-[#D4AF37] to-amber-600 text-black font-extrabold text-sm tracking-wide shadow-lg shadow-[#D4AF37]/20 hover:scale-[1.02] cursor-pointer"
            >
              Gravar Vitória Cognitiva
            </button>
          </div>

        </form>
      )}

      {/* Histórico das Vitórias Mentais */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <History className="w-5 h-5 text-[#D4AF37]" />
          <h2 className="font-serif-noble text-xl font-bold text-white tracking-wide">
            Arquivo de Blindagem & Vitórias
          </h2>
        </div>

        {loading ? (
          <div className="card-soberano p-8 text-center text-stone-400">Carregando registros...</div>
        ) : entries.length === 0 ? (
          <div className="card-soberano p-8 text-center text-stone-400">
            Nenhuma reestruturação cognitiva registrada ainda. Clique em "Nova Reestruturação" para começar.
          </div>
        ) : (
          <div className="space-y-4">
            {entries.map((entry) => (
              <div key={entry.id} className="card-soberano p-6 space-y-4">
                <div className="flex items-center justify-between text-xs text-stone-400 border-b border-stone-800/80 pb-3">
                  <span className="text-stone-300 font-semibold">{entry.date}</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 font-bold">
                    {entry.cognitive_distortion}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-[#0D1016] p-4 rounded-xl border border-stone-800/60">
                    <div className="text-[10px] uppercase font-bold text-red-400 mb-1">Pensamento Automático:</div>
                    <p className="text-xs text-stone-300 italic leading-relaxed">"{entry.automatic_thought}"</p>
                    <div className="mt-2 text-[10px] text-stone-400">
                      <strong>Fato:</strong> {entry.situation}
                    </div>
                  </div>

                  <div className="bg-[#121722] p-4 rounded-xl border border-[#D4AF37]/30">
                    <div className="text-[10px] uppercase font-bold text-[#D4AF37] mb-1">Resposta Racional da Bússola:</div>
                    <p className="text-xs text-stone-100 font-medium leading-relaxed">{entry.rational_response}</p>
                    {entry.outcome_emotion && (
                      <div className="mt-2 text-[10px] text-emerald-400 font-semibold">
                        ✓ {entry.outcome_emotion}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
