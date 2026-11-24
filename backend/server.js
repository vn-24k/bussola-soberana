import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';

const PORT = process.env.PORT || 3000;
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://hfgxsloyssxwfulyzftt.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhmZ3hzbG95c3N4d2Z1bHl6ZnR0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODY4NDM3OSwiZXhwIjoyMDk0MjYwMzc5fQ.bE9L_MwwJuqf45DJUYIuerVWTwdx7Gi6MUnl1XLn-EY';

const OBSIDIAN_VAULT_PATH = '/sdcard/Documents/Obsidian VN/VN/08 - Diário/2026';

// Headers comuns com CORS liberado
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-api-key',
};

function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    ...corsHeaders,
  });
  res.end(JSON.stringify(data));
}

function sendText(res, statusCode, text, contentType = 'text/plain; charset=utf-8') {
  res.writeHead(statusCode, {
    'Content-Type': contentType,
    ...corsHeaders,
  });
  res.end(text);
}

// Auxiliar para chamadas à REST API do Supabase
async function supabaseFetch(endpoint, options = {}) {
  const url = `${SUPABASE_URL}/rest/v1/${endpoint}`;
  const headers = {
    'apikey': SUPABASE_KEY,
    'Authorization': `Bearer ${SUPABASE_KEY}`,
    'Content-Type': 'application/json',
    'Prefer': options.prefer || 'return=representation',
    ...(options.headers || {})
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  const text = await response.text();
  try {
    return { status: response.status, data: text ? JSON.parse(text) : null, ok: response.ok };
  } catch {
    return { status: response.status, data: text, ok: response.ok };
  }
}

// Dias da semana em português
const DIAS_SEMANA = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];

function getTodayInfo() {
  const now = new Date();
  // Formato YYYY-MM-DD
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  const dateStr = `${yyyy}-${mm}-${dd}`;
  const dayOfWeek = DIAS_SEMANA[now.getDay()];
  return { dateStr, dayOfWeek, year: yyyy };
}

// Calcula o Índice de Soberania (0 a 100)
function calculateScore(log) {
  let score = 0;
  // 8 Hábitos fundamentais (cada um vale 10 pontos = 80 pontos)
  if (log.habito_oracao_manha) score += 10;
  if (log.habito_oracao_noite) score += 10;
  if (log.habito_pureza) score += 15; // peso maior para pilar inegociável
  if (log.habito_jejum) score += 10;
  if (log.habito_agua || (Number(log.water_liters) >= 2.0)) score += 10;
  if (log.habito_estudo || (Number(log.study_minutes) >= 15)) score += 10;
  if (log.habito_exercicio) score += 10;
  if (log.habito_sono) score += 5;

  // 3 Prioridades (cada uma concluída vale 5 pontos = 15 pontos)
  if (log.priority_1_done) score += 5;
  if (log.priority_2_done) score += 5;
  if (log.priority_3_done) score += 5;

  return Math.min(100, score);
}

// Formata o conteúdo no padrão estrito de Markdown do Obsidian
function generateObsidianMarkdown(log) {
  const score = calculateScore(log);
  return `---
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
- [${log.habito_exercicio ? 'x' : ' '}] 🏃‍♂️ **Corpo & Treino:** 20 minutos de treino, caminhada ou corrida ${log.exercise_details ? `(${log.exercise_details})` : ''}
- [${log.habito_sono ? 'x' : ' '}] 🌙 **Descanso:** Desconectar de telas antes de dormir

---

## 🎯 3 Prioridades do Dia
- [${log.priority_1_done ? 'x' : ' '}] 1. ${log.priority_1 || 'Definir prioridade matinal'}
- [${log.priority_2_done ? 'x' : ' '}] 2. ${log.priority_2 || 'Definir prioridade operacional'}
- [${log.priority_3_done ? 'x' : ' '}] 3. ${log.priority_3 || 'Definir prioridade de expansão'}

---

## 📋 Registro de Atividades & Tarefas
${log.activity_notes ? log.activity_notes : '- Nenhuma observação adicional de atividade informada.'}

---

## 💡 Ideias, Aprendizados & Conexões
${log.ideas_learnings ? log.ideas_learnings : '- Dia de execução contínua.'}

---

## 🔍 Revisão Noturna & Gratidão
${log.evening_review ? log.evening_review : '- Revisão concluída com soberania e serenidade.'}
`;
}

// Router HTTP
const server = http.createServer(async (req, res) => {
  // Preflight CORS
  if (req.method === 'OPTIONS') {
    res.writeHead(204, corsHeaders);
    res.end();
    return;
  }

  const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
  const pathname = parsedUrl.pathname;

  try {
    // 1. Healthcheck
    if (pathname === '/api/health' && req.method === 'GET') {
      return sendJson(res, 200, {
        status: 'online',
        service: 'Bússola Soberana Cloud Core',
        environment: 'Render 24/7',
        time: new Date().toISOString()
      });
    }

    // 2. GET /api/today (Busca ou cria o dia atual)
    if (pathname === '/api/today' && req.method === 'GET') {
      const { dateStr, dayOfWeek } = getTodayInfo();
      const queryRes = await supabaseFetch(`sovereign_daily_logs?date=eq.${dateStr}&select=*`);
      
      if (queryRes.ok && queryRes.data && queryRes.data.length > 0) {
        return sendJson(res, 200, queryRes.data[0]);
      }

      // Se não existe, cria o dia de hoje
      const newEntry = {
        date: dateStr,
        day_of_week: dayOfWeek,
        energy_level: 8,
        mood: 'Focado',
        sovereignty_score: 0
      };

      const insertRes = await supabaseFetch('sovereign_daily_logs', {
        method: 'POST',
        body: JSON.stringify(newEntry)
      });

      return sendJson(res, 201, insertRes.data ? insertRes.data[0] : newEntry);
    }

    // 3. POST /api/check-in (Atualiza o check-in do dia)
    if (pathname === '/api/check-in' && req.method === 'POST') {
      let body = '';
      for await (const chunk of req) body += chunk;
      const payload = JSON.parse(body || '{}');

      const { dateStr, dayOfWeek } = getTodayInfo();
      const targetDate = payload.date || dateStr;

      // Busca dados atuais
      const currentRes = await supabaseFetch(`sovereign_daily_logs?date=eq.${targetDate}&select=*`);
      let currentLog = (currentRes.ok && currentRes.data && currentRes.data[0]) ? currentRes.data[0] : { date: targetDate, day_of_week: dayOfWeek };

      const merged = {
        ...currentLog,
        ...payload,
        updated_at: new Date().toISOString()
      };

      merged.sovereignty_score = calculateScore(merged);

      const updateRes = await supabaseFetch(`sovereign_daily_logs?date=eq.${targetDate}`, {
        method: 'PATCH',
        body: JSON.stringify(merged)
      });

      return sendJson(res, 200, updateRes.data ? updateRes.data[0] : merged);
    }

    // 4. CBT (TCC) Endpoints
    if (pathname === '/api/cbt') {
      if (req.method === 'GET') {
        const cbtRes = await supabaseFetch('cbt_entries?order=created_at.desc&limit=30');
        return sendJson(res, 200, cbtRes.data || []);
      }
      if (req.method === 'POST') {
        let body = '';
        for await (const chunk of req) body += chunk;
        const entry = JSON.parse(body || '{}');
        const insertRes = await supabaseFetch('cbt_entries', {
          method: 'POST',
          body: JSON.stringify(entry)
        });
        return sendJson(res, 201, insertRes.data ? insertRes.data[0] : entry);
      }
    }

    // 5. Book Insights Endpoints
    if (pathname === '/api/book-insights') {
      if (req.method === 'GET') {
        const bookRes = await supabaseFetch('book_insights?order=created_at.desc&limit=30');
        return sendJson(res, 200, bookRes.data || []);
      }
      if (req.method === 'POST') {
        let body = '';
        for await (const chunk of req) body += chunk;
        const entry = JSON.parse(body || '{}');
        const insertRes = await supabaseFetch('book_insights', {
          method: 'POST',
          body: JSON.stringify(entry)
        });
        return sendJson(res, 201, insertRes.data ? insertRes.data[0] : entry);
      }
    }

    // 6. Streaks Endpoints
    if (pathname === '/api/streaks') {
      if (req.method === 'GET') {
        const streakRes = await supabaseFetch('sovereign_streaks?id=eq.current&select=*');
        return sendJson(res, 200, (streakRes.data && streakRes.data[0]) || { pureza_streak_days: 7, consistency_streak_days: 7 });
      }
      if (req.method === 'POST') {
        let body = '';
        for await (const chunk of req) body += chunk;
        const payload = JSON.parse(body || '{}');
        const updateRes = await supabaseFetch('sovereign_streaks?id=eq.current', {
          method: 'PATCH',
          body: JSON.stringify({ ...payload, updated_at: new Date().toISOString() })
        });
        return sendJson(res, 200, updateRes.data ? updateRes.data[0] : payload);
      }
    }

    // 7. GET /api/export-markdown (Retorna o arquivo .md)
    if (pathname === '/api/export-markdown' && req.method === 'GET') {
      const { dateStr } = getTodayInfo();
      const targetDate = parsedUrl.searchParams.get('date') || dateStr;

      const logRes = await supabaseFetch(`sovereign_daily_logs?date=eq.${targetDate}&select=*`);
      const log = (logRes.ok && logRes.data && logRes.data[0]) ? logRes.data[0] : { date: targetDate, day_of_week: 'Hoje' };
      const markdown = generateObsidianMarkdown(log);

      return sendText(res, 200, markdown, 'text/markdown; charset=utf-8');
    }

    // 8. POST /api/sync/save-local (Salva diretamente no cofre se existir no ambiente)
    if (pathname === '/api/sync/save-local' && req.method === 'POST') {
      const { dateStr } = getTodayInfo();
      const logRes = await supabaseFetch(`sovereign_daily_logs?date=eq.${dateStr}&select=*`);
      const log = (logRes.ok && logRes.data && logRes.data[0]) ? logRes.data[0] : { date: dateStr, day_of_week: 'Hoje' };
      const markdown = generateObsidianMarkdown(log);

      let savedLocally = false;
      const targetFile = path.join(OBSIDIAN_VAULT_PATH, `${dateStr}.md`);

      try {
        if (fs.existsSync(OBSIDIAN_VAULT_PATH)) {
          fs.writeFileSync(targetFile, markdown, 'utf-8');
          savedLocally = true;
        }
      } catch (err) {
        console.error('Erro ao escrever no vault local:', err);
      }

      return sendJson(res, 200, {
        success: true,
        date: dateStr,
        savedLocally,
        filePath: savedLocally ? targetFile : null,
        markdown
      });
    }

    // 404 Fallback
    return sendJson(res, 404, { error: 'Not Found' });
  } catch (error) {
    console.error('Server error:', error);
    return sendJson(res, 500, { error: error.message });
  }
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`🧭 Bússola Soberana Backend ativo na porta ${PORT}`);
});
