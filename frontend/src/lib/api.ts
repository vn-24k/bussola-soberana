// Comunicação unificada com o Backend e Supabase
const API_URL = (import.meta as unknown as { env?: Record<string, string> }).env?.VITE_API_URL || (typeof window !== 'undefined' && window.location.hostname === 'localhost' ? 'http://localhost:3000' : '');

export interface DailyLog {
  id?: string;
  date: string;
  day_of_week: string;
  habito_oracao_manha: boolean;
  habito_oracao_noite: boolean;
  habito_pureza: boolean;
  habito_jejum: boolean;
  habito_agua: boolean;
  water_liters: number;
  habito_estudo: boolean;
  study_minutes: number;
  habito_exercicio: boolean;
  exercise_details: string;
  habito_sono: boolean;
  energy_level: number;
  mood: string;
  priority_1: string;
  priority_1_done: boolean;
  priority_2: string;
  priority_2_done: boolean;
  priority_3: string;
  priority_3_done: boolean;
  activity_notes: string;
  ideas_learnings: string;
  evening_review: string;
  sovereignty_score?: number;
  synced_to_obsidian?: boolean;
}

export interface CBTEntry {
  id?: string;
  date: string;
  situation: string;
  automatic_thought: string;
  cognitive_distortion: string;
  rational_response: string;
  outcome_emotion: string;
  created_at?: string;
}

export interface BookInsight {
  id?: string;
  date: string;
  title: string;
  category: string;
  content: string;
  target_chapter: string;
  created_at?: string;
}

export interface Streaks {
  pureza_streak_days: number;
  consistency_streak_days: number;
}

export async function fetchTodayLog(): Promise<DailyLog> {
  const url = API_URL ? `${API_URL}/api/today` : 'https://hfgxsloyssxwfulyzftt.supabase.co/rest/v1/sovereign_daily_logs';
  try {
    if (API_URL) {
      const res = await fetch(url);
      if (res.ok) return await res.json();
    }
    // Fallback direto ao Supabase
    const dateStr = new Date().toISOString().split('T')[0];
    const sbRes = await fetch(`https://hfgxsloyssxwfulyzftt.supabase.co/rest/v1/sovereign_daily_logs?date=eq.${dateStr}&select=*`, {
      headers: {
        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhmZ3hzbG95c3N4d2Z1bHl6ZnR0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg2ODQzNzksImV4cCI6MjA5NDI2MDM3OX0.zDw_CGyNPMs4KGEWmDnQMzgh-SccxalFlB2c07CfJv4',
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhmZ3hzbG95c3N4d2Z1bHl6ZnR0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg2ODQzNzksImV4cCI6MjA5NDI2MDM3OX0.zDw_CGyNPMs4KGEWmDnQMzgh-SccxalFlB2c07CfJv4'
      }
    });
    const data = await sbRes.json();
    if (data && data.length > 0) return data[0];
  } catch (err) {
    console.warn('Erro ao carregar log do dia:', err);
  }

  // Fallback padrão se não houver conexão
  const now = new Date();
  const dias = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
  return {
    date: now.toISOString().split('T')[0],
    day_of_week: dias[now.getDay()],
    habito_oracao_manha: false,
    habito_oracao_noite: false,
    habito_pureza: false,
    habito_jejum: false,
    habito_agua: false,
    water_liters: 0,
    habito_estudo: false,
    study_minutes: 0,
    habito_exercicio: false,
    exercise_details: '',
    habito_sono: false,
    energy_level: 8,
    mood: 'Focado',
    priority_1: '',
    priority_1_done: false,
    priority_2: '',
    priority_2_done: false,
    priority_3: '',
    priority_3_done: false,
    activity_notes: '',
    ideas_learnings: '',
    evening_review: '',
    sovereignty_score: 0
  };
}

export async function saveCheckIn(data: Partial<DailyLog>): Promise<DailyLog> {
  if (API_URL) {
    try {
      const res = await fetch(`${API_URL}/api/check-in`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('Backend indisponível, salvando direto no Supabase:', e);
    }
  }

  // Salva no Supabase direto
  const targetDate = data.date || new Date().toISOString().split('T')[0];
  const sbRes = await fetch(`https://hfgxsloyssxwfulyzftt.supabase.co/rest/v1/sovereign_daily_logs?date=eq.${targetDate}`, {
    method: 'PATCH',
    headers: {
      'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhmZ3hzbG95c3N4d2Z1bHl6ZnR0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg2ODQzNzksImV4cCI6MjA5NDI2MDM3OX0.zDw_CGyNPMs4KGEWmDnQMzgh-SccxalFlB2c07CfJv4',
      'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhmZ3hzbG95c3N4d2Z1bHl6ZnR0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg2ODQzNzksImV4cCI6MjA5NDI2MDM3OX0.zDw_CGyNPMs4KGEWmDnQMzgh-SccxalFlB2c07CfJv4',
      'Content-Type': 'application/json',
      'Prefer': 'return=representation'
    },
    body: JSON.stringify(data)
  });
  const resData = await sbRes.json();
  return (resData && resData[0]) ? resData[0] : (data as DailyLog);
}

export async function fetchCBTEntries(): Promise<CBTEntry[]> {
  try {
    const sbRes = await fetch('https://hfgxsloyssxwfulyzftt.supabase.co/rest/v1/cbt_entries?order=created_at.desc&limit=30', {
      headers: {
        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhmZ3hzbG95c3N4d2Z1bHl6ZnR0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg2ODQzNzksImV4cCI6MjA5NDI2MDM3OX0.zDw_CGyNPMs4KGEWmDnQMzgh-SccxalFlB2c07CfJv4',
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhmZ3hzbG95c3N4d2Z1bHl6ZnR0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg2ODQzNzksImV4cCI6MjA5NDI2MDM3OX0.zDw_CGyNPMs4KGEWmDnQMzgh-SccxalFlB2c07CfJv4'
      }
    });
    return await sbRes.json();
  } catch {
    return [];
  }
}

export async function createCBTEntry(entry: CBTEntry): Promise<void> {
  await fetch('https://hfgxsloyssxwfulyzftt.supabase.co/rest/v1/cbt_entries', {
    method: 'POST',
    headers: {
      'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhmZ3hzbG95c3N4d2Z1bHl6ZnR0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg2ODQzNzksImV4cCI6MjA5NDI2MDM3OX0.zDw_CGyNPMs4KGEWmDnQMzgh-SccxalFlB2c07CfJv4',
      'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhmZ3hzbG95c3N4d2Z1bHl6ZnR0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg2ODQzNzksImV4cCI6MjA5NDI2MDM3OX0.zDw_CGyNPMs4KGEWmDnQMzgh-SccxalFlB2c07CfJv4',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(entry)
  });
}

export async function fetchStreaks(): Promise<Streaks> {
  try {
    const sbRes = await fetch('https://hfgxsloyssxwfulyzftt.supabase.co/rest/v1/sovereign_streaks?id=eq.current&select=*', {
      headers: {
        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhmZ3hzbG95c3N4d2Z1bHl6ZnR0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg2ODQzNzksImV4cCI6MjA5NDI2MDM3OX0.zDw_CGyNPMs4KGEWmDnQMzgh-SccxalFlB2c07CfJv4',
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhmZ3hzbG95c3N4d2Z1bHl6ZnR0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg2ODQzNzksImV4cCI6MjA5NDI2MDM3OX0.zDw_CGyNPMs4KGEWmDnQMzgh-SccxalFlB2c07CfJv4'
      }
    });
    const d = await sbRes.json();
    if (d && d.length > 0) return d[0];
  } catch {
    //
  }
  return { pureza_streak_days: 7, consistency_streak_days: 7 };
}
