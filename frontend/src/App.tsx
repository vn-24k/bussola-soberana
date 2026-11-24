import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { DailyCockpit } from './components/DailyCockpit';
import { CBTWorkshop } from './components/CBTWorkshop';
import { SanctuaryView } from './components/SanctuaryView';
import { ObsidianBridge } from './components/ObsidianBridge';
import { fetchTodayLog, saveCheckIn, fetchStreaks, DailyLog, getStoredPIN, setStoredPIN } from './lib/api';
import { PinLockScreen } from './components/PinLockScreen';

export default function App() {
  const [activeTab, setActiveTab] = useState('cockpit');
  const [log, setLog] = useState<DailyLog | null>(null);
  const [purezaStreak, setPurezaStreak] = useState(7);
  const [loading, setLoading] = useState(true);
  const [isUnlocked, setIsUnlocked] = useState(false);

  useEffect(() => {
    const savedPin = getStoredPIN();
    if (savedPin === '24816') {
      setIsUnlocked(true);
    }
  }, []);

  const handleUnlock = (enteredPin: string) => {
    if (enteredPin === '24816') {
      setStoredPIN('24816');
      setIsUnlocked(true);
    }
  };

  const handleLock = () => {
    setStoredPIN('');
    setIsUnlocked(false);
  };

  // Carrega dados iniciais
  useEffect(() => {
    if (!isUnlocked) return;
    async function init() {
      try {
        const [todayLog, streaks] = await Promise.all([
          fetchTodayLog(),
          fetchStreaks()
        ]);
        setLog(todayLog);
        setPurezaStreak(streaks.pureza_streak_days || 7);
      } catch (err) {
        console.error('Erro na inicialização:', err);
      } finally {
        setLoading(false);
      }
    }
    init();
  }, [isUnlocked]);

  const handleUpdate = async (updatedFields: Partial<DailyLog>) => {
    if (!log) return;
    const merged = { ...log, ...updatedFields };
    setLog(merged);
    try {
      const saved = await saveCheckIn(merged);
      setLog(saved);
    } catch (e) {
      console.warn('Erro ao salvar check-in:', e);
    }
  };

  const handleSyncObsidian = async () => {
    if (!log) return;
    try {
      await fetch('http://localhost:3000/api/sync/save-local', { 
        method: 'POST',
        headers: { 'x-sovereign-pin': '24816' }
      }).catch(() => {});
    } catch {
      //
    }
  };

  if (!isUnlocked) {
    return <PinLockScreen onUnlock={handleUnlock} />;
  }

  if (loading || !log) {
    return (
      <div className="min-h-screen bg-[#0B0D11] flex flex-col items-center justify-center text-stone-400 gap-3">
        <div className="w-12 h-12 rounded-2xl bg-[#D4AF37]/20 border border-[#D4AF37]/40 flex items-center justify-center animate-spin">
          <div className="w-4 h-4 rounded-full bg-[#D4AF37]" />
        </div>
        <p className="font-serif-noble text-sm text-[#D4AF37] tracking-wider">CARREGANDO BÚSSOLA SOBERANA...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0D11] text-stone-200">
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        purezaStreak={purezaStreak}
        sovereigntyScore={log.sovereignty_score || 0}
        onLock={handleLock}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        {activeTab === 'cockpit' && (
          <DailyCockpit
            log={log}
            onUpdate={handleUpdate}
            onSyncObsidian={handleSyncObsidian}
          />
        )}

        {activeTab === 'cbt' && <CBTWorkshop />}

        {activeTab === 'sanctuary' && <SanctuaryView />}

        {activeTab === 'obsidian' && (
          <ObsidianBridge
            log={log}
            onSyncLocal={handleSyncObsidian}
          />
        )}
      </main>
    </div>
  );
}
