import React, { useState } from 'react';
import { FileText, Copy, Download, Check, Sparkles, FolderSync, ShieldCheck, Terminal } from 'lucide-react';
import { DailyLog } from '../lib/api';
import { soundFX } from '../lib/sound-fx';

interface ObsidianBridgeProps {
  log: DailyLog;
  onSyncLocal: () => Promise<void>;
}

export const ObsidianBridge: React.FC<ObsidianBridgeProps> = ({ log, onSyncLocal }) => {
  const [copied, setCopied] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [syncSuccess, setSyncSuccess] = useState(false);

  // Calcula o score de soberania
  const calculateScore = () => {
    let score = 0;
    if (log.habito_oracao_manha) score += 10;
    if (log.habito_oracao_noite) score += 10;
    if (log.habito_pureza) score += 15;
    if (log.habito_jejum) score += 10;
    if (log.habito_agua || (Number(log.water_liters) >= 2.0)) score += 10;
    if (log.habito_estudo || (Number(log.study_minutes) >= 15)) score += 10;
    if (log.habito_exercicio) score += 10;
    if (log.habito_sono) score += 5;
    if (log.priority_1_done) score += 5;
    if (log.priority_2_done) score += 5;
    if (log.priority_3_done) score += 5;
    return Math.min(100, score);
  };

  const score = calculateScore();

  const markdownContent = `---
tipo: diario
tags:
  - diario
  - habitos
  - reflexao
  - bussola-soberana
data: ${log.date}
dia_semana: ${log.day_of_week}
status: ${score >= 70 ? 'concluido' : 'em_progresso'}
score_soberania: ${score}%
habito_oracao_manha: ${Boolean(log.habito_oracao_manha)}
habito_oracao_noite: ${Boolean(log.habito_oracao_noite)}
habito_pureza: ${Boolean(log.habito_pureza)}
habito_jejum: ${Boolean(log.habito_jejum)}
habito_agua: ${Boolean(log.habito_agua || Number(log.water_liters) >= 2.0)}
habito_estudo: ${Boolean(log.habito_estudo || Number(log.study_minutes) >= 15)}
habito_exercicio: ${Boolean(log.habito_exercicio)}
habito_sono: ${Boolean(log.habito_sono)}
humor: ⚡ ${log.mood || 'Focado'}
energia: ${log.energy_level || 8}/10
---

# 📅 Diário: ${log.date} (${log.day_of_week})

> *"Foco em consistência, progresso gradual e aprendizado contínuo. Não sou fruto das circunstâncias; sou fruto das minhas decisões inegociáveis."*  
> 🧭 **Princípios Inegociáveis:** [[Bússola Inabalável|Minha Bússola & Código]]  
> 📊 **Índice de Soberania de Hoje:** **${score}%**  
> 💧 **Água Ingerida:** ${log.water_liters || 0} Litros | 📚 **Estudo:** ${log.study_minutes || 0} min  
> 🙏 **Guia de Oração:** [[02 - Áreas da Vida/Espiritualidade/Espiritualidade & Oração Diária|Espiritualidade & Oração Diária]]

---

## ⚡ Hábitos de Hoje (Bússola Inabalável)
- [${log.habito_oracao_manha ? 'x' : ' '}] 🙏 **Oração da Manhã:** Gratidão, intenção e sabedoria ao acordar
- [${log.habito_oracao_noite ? 'x' : ' '}] 🙏 **Oração da Noite:** Paz, serenidade e entrega antes de dormir
- [${log.habito_pureza ? 'x' : ' '}] 🛡️ **Pureza Mental:** Dia 100% livre de pornografia e focado no mundo real
- [${log.habito_jejum ? 'x' : ' '}] ⚡ **Jejum de Sexta:** Fortalecimento do espírito e domínio da mente
- [${log.habito_agua || Number(log.water_liters) >= 2.0 ? 'x' : ' '}] 💧 **Água:** Beber 2 Litros ao longo do dia (${log.water_liters || 0}L concluídos)
- [${log.habito_estudo || Number(log.study_minutes) >= 15 ? 'x' : ' '}] 📚 **Estudo:** 15 minutos lendo ou aprendendo algo novo (${log.study_minutes || 0}m)
- [${log.habito_exercicio ? 'x' : ' '}] 🏃‍♂️ **Corpo & Treino:** 20 minutos de treino, caminhada ou natação
- [${log.habito_sono ? 'x' : ' '}] 🌙 **Descanso:** Desconectar de telas antes de dormir

---

## 🎯 3 Prioridades do Dia
- [${log.priority_1_done ? 'x' : ' '}] 1. ${log.priority_1 || 'Definir prioridade matinal'}
- [${log.priority_2_done ? 'x' : ' '}] 2. ${log.priority_2 || 'Definir prioridade operacional'}
- [${log.priority_3_done ? 'x' : ' '}] 3. ${log.priority_3 || 'Definir prioridade de expansão'}

---

## 📋 Registro de Atividades & Tarefas
${log.activity_notes ? log.activity_notes : '- Nenhuma observação adicional informada no check-in.'}

---

## 💡 Ideias, Aprendizados & Conexões
${log.ideas_learnings ? log.ideas_learnings : '- Dia de execução contínua.'}

---

## 🔍 Revisão Noturna & Gratidão
${log.evening_review ? log.evening_review : '- Revisão concluída com sobriedade.'}
`;

  const copyToClipboard = () => {
    soundFX.playClick();
    navigator.clipboard.writeText(markdownContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const downloadFile = () => {
    soundFX.playClick();
    const blob = new Blob([markdownContent], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${log.date}.md`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleSync = async () => {
    soundFX.playClick();
    setSyncing(true);
    try {
      await onSyncLocal();
      soundFX.playWarmChime();
      setSyncSuccess(true);
      setTimeout(() => setSyncSuccess(false), 3000);
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* Top Banner */}
      <div className="card-soberano p-6 sm:p-8 bg-gradient-to-br from-[#121A24] via-[#0E141C] to-[#0A0C10] border-sky-600/30">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-sky-400 font-semibold mb-2">
              <FolderSync className="w-4 h-4" />
              <span>Ponte de Sincronização • Segundo Cérebro</span>
            </div>
            <h1 className="font-serif-noble text-2xl sm:text-3xl font-bold text-white tracking-wide">
              Obsidian Bridge
            </h1>
            <p className="mt-1 text-sm text-stone-300 max-w-2xl leading-relaxed italic">
              Conexão direta entre o seu check-in diário e o cofre do Obsidian em <code>08 - Diário/2026/{log.date}.md</code>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={copyToClipboard}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#141821] hover:bg-stone-800 border border-stone-800 text-stone-200 text-xs font-semibold cursor-pointer"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copiado!' : 'Copiar Markdown'}
            </button>

            <button
              onClick={downloadFile}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#141821] hover:bg-stone-800 border border-stone-800 text-stone-200 text-xs font-semibold cursor-pointer"
            >
              <Download className="w-4 h-4" />
              Baixar .md
            </button>

            <button
              onClick={handleSync}
              disabled={syncing}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-amber-600 text-black font-extrabold text-xs shadow-lg shadow-[#D4AF37]/20 hover:scale-[1.02] cursor-pointer"
            >
              <FolderSync className="w-4 h-4" />
              {syncing ? 'Sincronizando...' : syncSuccess ? 'Injetado no Vault!' : 'Injetar no Obsidian'}
            </button>
          </div>
        </div>
      </div>

      {/* Visualizador de Código Markdown */}
      <div className="card-soberano p-6 space-y-4">
        <div className="flex items-center justify-between text-xs text-stone-400 border-b border-stone-800 pb-3">
          <div className="flex items-center gap-2 font-mono text-stone-300">
            <FileText className="w-4 h-4 text-[#D4AF37]" />
            <span>08 - Diário/2026/{log.date}.md</span>
          </div>
          <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30 text-[10px]">
            YAML Schema Validado
          </span>
        </div>

        <pre className="p-4 rounded-xl bg-[#080A0D] border border-stone-900 font-mono text-xs text-stone-300 overflow-x-auto leading-relaxed max-h-[500px]">
          {markdownContent}
        </pre>
      </div>

      {/* Como Funciona a Automação no Termux */}
      <div className="card-soberano p-6 bg-[#0E1117] border-stone-800 space-y-3">
        <div className="flex items-center gap-2 text-stone-300">
          <Terminal className="w-4 h-4 text-[#D4AF37]" />
          <h3 className="font-serif-noble font-bold text-sm text-white">Comando de Sincronização Rápida no Termux</h3>
        </div>
        <p className="text-xs text-stone-400">
          Você pode rodar no seu terminal do Linux PRoot a qualquer momento para puxar os dados salvos na nuvem direto para o seu cofre:
        </p>
        <div className="p-3 rounded-xl bg-black/60 border border-stone-800 font-mono text-xs text-[#D4AF37] flex items-center justify-between">
          <span>obsidian-sovereign-sync</span>
          <span className="text-[10px] text-stone-400">CLI</span>
        </div>
      </div>

    </div>
  );
};
