// NEXUS v3.0 — API Client
const B = '/api';
async function req(url, opts={}) {
  const r = await fetch(`${B}${url}`, { headers:{'Content-Type':'application/json'}, ...opts });
  const d = await r.json();
  if (!r.ok) throw new Error(d.error || 'Request gagal');
  return d;
}
const post = (url,body) => req(url,{method:'POST',body:JSON.stringify(body)});

export const api = {
  health:         ()          => req('/health'),
  getCases:       ()          => req('/cases'),
  getCase:        id          => req(`/cases/${id}`),
  solveCase:      (id,body)   => post(`/cases/${id}/solve`, body),
  startInterro:   body        => post('/interrogation/start', body),
  sendMsg:        body        => post('/interrogation/message', body),
  endInterro:     body        => post('/interrogation/end', body),
  getProfile:     pid         => req(`/cognitive/${pid}`),
  analyzeCase:    body        => post('/cognitive/analyze', body),
  getCogReport:   pid         => req(`/cognitive/${pid}/report`),
  getModules:     ()          => req('/academy/modules'),
  getLesson:      body        => post('/academy/lesson', body),
  evalAnswer:     body        => post('/academy/evaluate', body),
  omegaNext:      body        => post('/omega/next', body),
  registerNet:    body        => post('/network/register', body),
  getLeaderboard: (t,l)       => req(`/network/leaderboard?type=${t||'points'}&limit=${l||50}`),
  getDailyCase:   ()          => req('/network/daily'),
  submitDaily:    body        => post('/network/daily/submit', body),
  mindReader:     body        => post('/mindreader', body),
  challenger:     body        => post('/challenger', body),
  voiceConfig:    ()          => req('/voice/config'),
};
