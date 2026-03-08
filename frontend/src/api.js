const baseURL = '';

export const api = {
  health: () => fetch(`${baseURL}/api/health`).then(r => r.json()),
  getCases: () => fetch(`${baseURL}/api/cases`).then(r => r.json()),
  getCase: (id) => fetch(`${baseURL}/api/cases/${id}`).then(r => r.json()),
  solveCase: (id, data) => fetch(`${baseURL}/api/cases/${id}/solve`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(r => r.json()),
  
  startInterro: (data) => fetch(`${baseURL}/api/interrogation/start`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(r => r.json()),
  
  sendMsg: (data) => fetch(`${baseURL}/api/interrogation/message`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(r => r.json()),
  
  mindReader: (data) => fetch(`${baseURL}/api/mindreader`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(r => r.json()),
  
  getModules: () => fetch(`${baseURL}/api/academy/modules`).then(r => r.json()),
  getLesson: (data) => fetch(`${baseURL}/api/academy/lesson`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(r => r.json()),
  evalAnswer: (data) => fetch(`${baseURL}/api/academy/evaluate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(r => r.json()),
  
  getCogReport: (pid) => fetch(`${baseURL}/api/cognitive/${pid}/report`).then(r => r.json()),
  
  omegaNext: (data) => fetch(`${baseURL}/api/omega/next`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(r => r.json()),
  
  registerNet: (data) => fetch(`${baseURL}/api/network/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(r => r.json()),
  getLeaderboard: (sort, limit) => fetch(`${baseURL}/api/network/leaderboard?sort=${sort}&limit=${limit}`).then(r => r.json()),
  getDailyCase: () => fetch(`${baseURL}/api/network/daily`).then(r => r.json()),
};
