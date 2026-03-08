import { useState, useEffect, useRef } from 'react'
import { api } from './api.js'

// ── Constants ───────────────────────────────────────────────
const RANKS = [
  {name:'KADET',min:0,color:'#64748b',icon:'◈'},
  {name:'DETEKTIF JUNIOR',min:600,color:'#22c55e',icon:'◉'},
  {name:'INVESTIGATOR',min:1800,color:'#3b82f6',icon:'◎'},
  {name:'ANALIS KRIMINAL',min:4000,color:'#a855f7',icon:'◑'},
  {name:'DETEKTIF UTAMA',min:8000,color:'#f59e0b',icon:'◐'},
  {name:'PIKIRAN SHERLOCK',min:15000,color:'#00f5ff',icon:'✦'},
  {name:'NEXUS ORACLE',min:30000,color:'#ff6b00',icon:'⬡'},
]
const getRank = p => { for(let i=RANKS.length-1;i>=0;i--) if(p>=RANKS[i].min) return RANKS[i]; return RANKS[0]; }
const getNext = p => RANKS.find(r=>r.min>p)||null

const TYPE_ICON = {pembunuhan:'☠',spionase:'🔍',kejahatan_finansial:'💰',orang_hilang:'👤',konspirasi:'🕸',pembunuhan_berantai:'⚡',kejahatan_siber:'🤖'}

// ── Shared Components ───────────────────────────────────────
const Scan = () => <div className="scanbar"/>

function Think({label=''}){
  return <div style={{display:'flex',alignItems:'center',gap:7,padding:'7px 10px'}}>
    {label&&<span className="mono" style={{fontSize:10,color:'var(--c)',letterSpacing:2}}>{label}</span>}
    <span className="td"/><span className="td"/><span className="td"/>
  </div>
}

function PBar({v,max=100,color='var(--i)'}){
  return <div className="pb"><div className="pf" style={{width:`${Math.min(100,(v/max)*100)}%`,background:color}}/></div>
}

function DTag({d}){
  const m={PEMULA:'tag-pemula',MAHIR:'tag-mahir',AHLI:'tag-ahli',OMEGA:'tag-omega'}
  return <span className={`tag ${m[d]||'tag-mahir'}`}>{d}</span>
}

function RankBadge({pts}){
  const r=getRank(pts)
  return <div style={{display:'inline-flex',alignItems:'center',gap:5,padding:'3px 9px',borderRadius:16,background:`${r.color}12`,border:`1px solid ${r.color}28`}}>
    <span style={{fontSize:13}}>{r.icon}</span>
    <span className="orb" style={{fontSize:8,color:r.color,letterSpacing:1}}>{r.name.split(' ')[0]}</span>
  </div>
}

function BottomNav({cur,nav}){
  const items=[
    {k:'dashboard',ico:'⬡',lbl:'Dashboard'},
    {k:'kasus',ico:'📂',lbl:'File Kasus'},
    {k:'papan',ico:'🔬',lbl:'Papan Bukti'},
    {k:'interogasi',ico:'💬',lbl:'Interogasi'},
    {k:'akademi',ico:'🎓',lbl:'Akademi'},
  ]
  return <nav className="nav-bot">
    <div style={{maxWidth:640,margin:'0 auto',display:'flex',justifyContent:'space-around',padding:'7px 0',paddingBottom:'max(7px,env(safe-area-inset-bottom))'}}>
      {items.map(it=>{
        const a=cur===it.k||(cur==='detail'&&it.k==='kasus')
        return <button key={it.k} className="nav-btn" onClick={()=>nav(it.k)} style={{opacity:a?1:.4}}>
          <span style={{fontSize:18,filter:a?'drop-shadow(0 0 5px var(--c))':'none'}}>{it.ico}</span>
          <span className="mono" style={{fontSize:8,color:a?'var(--c)':'var(--m)'}}>{it.lbl}</span>
          {a&&<div style={{width:14,height:2,background:'var(--c)',borderRadius:1}}/>}
        </button>
      })}
    </div>
  </nav>
}

// ── DASHBOARD ───────────────────────────────────────────────
function Dashboard({nav,stats,serverStatus}){
  const rank=getRank(stats.pts), next=getNext(stats.pts)
  const [time,setTime]=useState(new Date())
  useEffect(()=>{const t=setInterval(()=>setTime(new Date()),1000);return()=>clearInterval(t)},[])
  return <div className="dot-bg" style={{minHeight:'100vh',paddingBottom:88}}>
    <div className="glass sticky" style={{top:0,zIndex:50,borderBottom:'1px solid rgba(0,245,255,.07)'}}>
      <div style={{maxWidth:640,margin:'0 auto',padding:'10px 14px',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
        <div>
          <div className="orb glitch nc" style={{fontSize:20,fontWeight:900,letterSpacing:3}}>NEXUS</div>
          <div className="mono" style={{fontSize:8,color:'var(--m)',letterSpacing:3}}>PLATFORM INVESTIGASI AI v3.0</div>
        </div>
        <div style={{textAlign:'right'}}>
          <div className="mono" style={{fontSize:11,color:'var(--c)'}}>{time.toLocaleTimeString('id-ID')}</div>
          <RankBadge pts={stats.pts}/>
        </div>
      </div>
    </div>
    <div style={{maxWidth:640,margin:'0 auto',padding:'14px 14px'}}>
      <div className={`glass ${serverStatus?.aiReady?'glass-g':'glass-a'}`} style={{borderRadius:10,padding:'9px 14px',marginBottom:12,display:'flex',alignItems:'center',gap:9}}>
        <div style={{width:7,height:7,borderRadius:'50%',background:serverStatus?.aiReady?'var(--g)':'var(--a)',boxShadow:`0 0 7px ${serverStatus?.aiReady?'var(--g)':'var(--a)'}`}}/>
        <span className="mono" style={{fontSize:10,color:serverStatus?.aiReady?'var(--g)':'var(--a)',letterSpacing:1}}>
          {serverStatus?.aiReady?'AI AKTIF — LLaMA 3.3 70B via Groq':'⚠ GROQ_API_KEY belum diset — Buka file .env'}
        </span>
      </div>

      <div className="hud glass" style={{borderRadius:14,padding:'18px',marginBottom:13,overflow:'hidden',position:'relative'}}>
        <div style={{position:'absolute',top:-40,right:-40,width:180,height:180,background:'radial-gradient(rgba(99,102,241,.09),transparent 70%)',pointerEvents:'none'}}/>
        <div className="orb nc" style={{fontSize:22,fontWeight:900,marginBottom:2}}>SELAMAT DATANG</div>
        <div className="orb ni" style={{fontSize:14,marginBottom:11}}>DETEKTIF NEXUS</div>
        <div style={{fontSize:13,color:'var(--m)',lineHeight:1.8,marginBottom:16}}>
          Platform pelatihan kognitif generasi 2046. Pecahkan kasus kriminal kompleks, latih deduksi logis, dan temukan kebenaran yang tersembunyi.
        </div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:8,marginBottom:14}}>
          {[{l:'KASUS',v:stats.total||50,c:'var(--c)'},{l:'SELESAI',v:stats.solved,c:'var(--g)'},{l:'XP',v:stats.pts,c:'var(--i)'}].map(s=>(
            <div key={s.l} className="glass" style={{borderRadius:9,padding:'10px',textAlign:'center'}}>
              <div className="orb" style={{fontSize:20,fontWeight:700,color:s.c}}>{s.v.toLocaleString()}</div>
              <div style={{fontSize:8,color:'var(--m)',letterSpacing:1,marginTop:2}}>{s.l}</div>
            </div>
          ))}
        </div>
        {next&&<div style={{marginBottom:14}}>
          <div style={{display:'flex',justifyContent:'space-between',marginBottom:4}}>
            <span style={{fontSize:10,color:'var(--m)'}}>→ {next.name}</span>
            <span className="mono" style={{fontSize:10,color:'var(--c)'}}>{stats.pts}/{next.min}</span>
          </div>
          <PBar v={stats.pts-rank.min} max={next.min-rank.min}/>
        </div>}
        <button className="btn btn-c" style={{width:'100%',borderRadius:10,padding:14,fontSize:14}} onClick={()=>nav('kasus')}>◈ MULAI INVESTIGASI</button>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:9,marginBottom:9}}>
        {[
          {ico:'🔬',lbl:'Papan Bukti',dsc:'Investigasi visual interaktif',k:'papan'},
          {ico:'💬',lbl:'Ruang Interogasi',dsc:'Tersangka bertenaga AI',k:'interogasi'},
          {ico:'🧠',lbl:'Mind Reader',dsc:'Analisis teori investigasi',k:'mindreader'},
          {ico:'🎓',lbl:'Akademi Detektif',dsc:'Pelatihan kognitif lanjutan',k:'akademi'},
        ].map(m=>(
          <button key={m.k} className="glass card-hover" style={{borderRadius:11,padding:'13px 12px',textAlign:'left',border:'1px solid rgba(99,102,241,.12)'}} onClick={()=>nav(m.k)}>
            <div style={{fontSize:22,marginBottom:7}}>{m.ico}</div>
            <div style={{fontWeight:600,fontSize:13,marginBottom:3}}>{m.lbl}</div>
            <div style={{fontSize:11,color:'var(--m)'}}>{m.dsc}</div>
          </button>
        ))}
      </div>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:9}}>
        <button className="glass card-hover" style={{borderRadius:11,padding:'13px 12px',textAlign:'left',border:'1px solid rgba(99,102,241,.12)'}} onClick={()=>nav('network')}>
          <div style={{fontSize:22,marginBottom:7}}>🌍</div>
          <div style={{fontWeight:600,fontSize:13,marginBottom:3}}>Jaringan Global</div>
          <div style={{fontSize:11,color:'var(--m)'}}>Leaderboard & kasus harian</div>
        </button>
        <button className="glass card-hover" style={{borderRadius:11,padding:'13px 12px',textAlign:'left',border:'1px solid rgba(168,85,247,.2)',background:'rgba(168,85,247,.04)'}} onClick={()=>nav('omega')}>
          <div style={{fontSize:22,marginBottom:7}}>♾️</div>
          <div style={{fontWeight:600,fontSize:13,marginBottom:3,color:'var(--p)'}}>Mode Omega</div>
          <div style={{fontSize:11,color:'var(--m)'}}>Kasus tak terbatas</div>
        </button>
      </div>

      {/* Peta Kognitif teaser */}
      <div className="glass hud" style={{borderRadius:12,padding:'13px',marginTop:9}}>
        <div className="mono" style={{fontSize:9,color:'var(--c)',letterSpacing:2,marginBottom:10}}>PETA KOGNITIF</div>
        <div className="radar-grid">
          {[['Observasi',stats.cognitive?.observasi||50,'var(--c)'],['Deduksi',stats.cognitive?.deduksiLogis||50,'var(--i)'],['Anti-Bias',stats.cognitive?.ketahananBias||50,'var(--g)'],['Pola',stats.cognitive?.pengenalanPola||50,'var(--p)']].map(([l,v,c])=>(
            <div key={l} className="glass" style={{borderRadius:8,padding:'9px 10px'}}>
              <div className="radar-lbl">{l}</div>
              <div className="radar-val" style={{color:c}}>{v}<span style={{fontSize:11}}>%</span></div>
              <PBar v={v} color={c}/>
            </div>
          ))}
        </div>
        <button className="btn btn-ghost" style={{width:'100%',borderRadius:7,marginTop:10,padding:9,fontSize:11}} onClick={()=>nav('kognitif')}>
          📊 Lihat Laporan Kognitif Lengkap
        </button>
      </div>
    </div>
  </div>
}

// ── FILE KASUS ──────────────────────────────────────────────
function FileKasus({nav,onSelect,stats}){
  const [cases,setCases]=useState([])
  const [loading,setLoading]=useState(true)
  const [filter,setFilter]=useState('SEMUA')
  const [search,setSearch]=useState('')

  useEffect(()=>{
    api.getCases().then(d=>{setCases(d.cases||[]);setLoading(false)}).catch(()=>setLoading(false))
  },[])

  const filtered=cases.filter(c=>{
    const mf=filter==='SEMUA'||c.difficulty===filter
    const ms=c.title?.toLowerCase().includes(search.toLowerCase())
    return mf&&ms
  })

  return <div className="dot-bg" style={{minHeight:'100vh',paddingBottom:88}}>
    <div className="glass sticky" style={{top:0,zIndex:50,borderBottom:'1px solid rgba(0,245,255,.07)'}}>
      <div style={{maxWidth:640,margin:'0 auto',padding:'11px 14px'}}>
        <div style={{display:'flex',alignItems:'center',gap:9,marginBottom:10}}>
          <button className="btn btn-ghost" style={{borderRadius:6,padding:'6px 9px'}} onClick={()=>nav('dashboard')}>←</button>
          <span className="orb nc" style={{fontSize:14,fontWeight:700}}>FILE KASUS</span>
          <span className="mono" style={{marginLeft:'auto',fontSize:10,color:'var(--m)'}}>{cases.length} KASUS</span>
        </div>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Cari kasus investigasi..." style={{width:'100%',padding:'9px 13px',borderRadius:8,fontSize:13,marginBottom:9}}/>
        <div style={{display:'flex',gap:5,overflowX:'auto',paddingBottom:2}}>
          {['SEMUA','PEMULA','MAHIR','AHLI','OMEGA'].map(f=>(
            <button key={f} onClick={()=>setFilter(f)} style={{padding:'4px 11px',borderRadius:16,fontSize:10,whiteSpace:'nowrap',cursor:'pointer',background:filter===f?'rgba(0,245,255,.1)':'rgba(10,17,32,.7)',color:filter===f?'var(--c)':'var(--m)',border:`1px solid ${filter===f?'rgba(0,245,255,.35)':'rgba(99,102,241,.12)'}`,fontFamily:"'Rajdhani',sans-serif"}}>
              {f}
            </button>
          ))}
        </div>
      </div>
    </div>
    <div style={{maxWidth:640,margin:'0 auto',padding:'10px 14px'}}>
      {loading&&<div style={{textAlign:'center',padding:40}}><Think label="MEMUAT FILE KASUS"/></div>}
      {filtered.map((c,i)=>{
        const solved=stats.solvedCases?.includes(c.id)
        return <div key={c.id} className="glass card-hover" style={{borderRadius:12,padding:'13px',marginBottom:9,border:solved?'1px solid rgba(34,197,94,.25)':'1px solid rgba(99,102,241,.12)',animation:`fadeUp .3s ease ${i*.03}s both`}} onClick={()=>{onSelect(c.id);nav('detail')}}>
          <div style={{display:'flex',gap:10}}>
            <div style={{fontSize:22,flexShrink:0,marginTop:2}}>{TYPE_ICON[c.type]||'◈'}</div>
            <div style={{flex:1}}>
              <div style={{display:'flex',gap:6,alignItems:'center',marginBottom:4,flexWrap:'wrap'}}>
                <span style={{fontWeight:700,fontSize:14}}>{c.title}</span>
                {solved&&<span style={{fontSize:9,padding:'1px 5px',background:'rgba(34,197,94,.1)',color:'var(--g)',borderRadius:3}}>✓ SELESAI</span>}
                {c.isOmega&&<span style={{fontSize:9,padding:'1px 6px',background:'rgba(255,107,0,.1)',color:'#ff6b00',borderRadius:3,border:'1px solid rgba(255,107,0,.25)'}}>OMEGA</span>}
              </div>
              <div style={{display:'flex',gap:7,alignItems:'center',flexWrap:'wrap'}}>
                <DTag d={c.difficulty}/>
                <span className="mono" style={{fontSize:9,color:'var(--m)'}}>#{String(c.id).padStart(2,'0')}</span>
                <span className="mono" style={{fontSize:9,color:'var(--a)',marginLeft:'auto'}}>+{c.pointReward} XP</span>
              </div>
            </div>
          </div>
        </div>
      })}
    </div>
  </div>
}

// ── DETAIL KASUS ────────────────────────────────────────────
function DetailKasus({caseId,nav,stats,onSolve,playerId}){
  const [data,setData]=useState(null)
  const [loading,setLoading]=useState(true)
  const [tab,setTab]=useState('kasus')
  const [showSolve,setShowSolve]=useState(false)
  const [suspectPick,setSuspectPick]=useState('')
  const [theory,setTheory]=useState('')
  const [result,setResult]=useState(null)
  const [solving,setSolving]=useState(false)
  const [forensicOpen,setForensicOpen]=useState(null)
  const [suspectOpen,setSuspectOpen]=useState(null)

  useEffect(()=>{
    if(!caseId) return
    setLoading(true);setResult(null);setTab('kasus')
    api.getCase(caseId).then(d=>{setData(d.case);setLoading(false)}).catch(()=>setLoading(false))
  },[caseId])

  async function handleSolve(){
    if(!suspectPick||!theory.trim()) return
    setSolving(true)
    try{
      const d=await api.solveCase(caseId,{suspectId:suspectPick,theory,playerId})
      setResult(d.result)
      if(d.result.correct) onSolve(caseId,d.result.pointReward)
    }catch(e){console.error(e)}finally{setSolving(false);setShowSolve(false)}
  }

  if(loading) return <div style={{minHeight:'100vh',background:'var(--bg)',display:'flex',alignItems:'center',justifyContent:'center'}}><Think label="MEMUAT KASUS"/></div>
  if(!data) return <div style={{minHeight:'100vh',background:'var(--bg)',display:'flex',alignItems:'center',justifyContent:'center',color:'var(--m)'}}>Kasus tidak ditemukan</div>

  const isSolved=stats.solvedCases?.includes(caseId)
  const TABS=[{k:'kasus',l:'Kasus'},{k:'bukti',l:'Bukti'},{k:'tersangka',l:'Tersangka'},{k:'timeline',l:'Timeline'}]

  return <div className="dot-bg" style={{minHeight:'100vh',paddingBottom:100}}>
    <div className="glass sticky" style={{top:0,zIndex:50,borderBottom:'1px solid rgba(0,245,255,.07)'}}>
      <div style={{maxWidth:640,margin:'0 auto',padding:'10px 14px'}}>
        <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:10}}>
          <button className="btn btn-ghost" style={{borderRadius:6,padding:'6px 9px'}} onClick={()=>nav('kasus')}>←</button>
          <div style={{flex:1,minWidth:0}}>
            <div style={{fontWeight:700,fontSize:13,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{data.title}</div>
            <div style={{display:'flex',gap:6,marginTop:2}}><DTag d={data.difficulty}/></div>
          </div>
          <button className="btn btn-i" style={{borderRadius:7,padding:'6px 11px',fontSize:11,flexShrink:0}} onClick={()=>nav('interogasi')}>💬 Interogasi</button>
        </div>
        <div style={{display:'flex',borderBottom:'1px solid rgba(99,102,241,.1)'}}>
          {TABS.map(t=>(
            <button key={t.k} onClick={()=>setTab(t.k)} style={{flex:1,padding:'7px 2px',background:'transparent',border:'none',cursor:'pointer',fontSize:12,fontFamily:"'Rajdhani',sans-serif",color:tab===t.k?'var(--c)':'var(--m)',borderBottom:tab===t.k?'2px solid var(--c)':'2px solid transparent',transition:'all .2s'}}>{t.l}</button>
          ))}
        </div>
      </div>
    </div>
    <div style={{maxWidth:640,margin:'0 auto',padding:'12px 14px'}}>
      {result&&<div className={result.correct?'glass-g':'glass-r'} style={{borderRadius:12,padding:'14px',marginBottom:12,textAlign:'center'}}>
        {result.correct?<>
          <div style={{fontSize:30,marginBottom:7}}>🎯</div>
          <div className="orb ng" style={{fontSize:14,fontWeight:700,marginBottom:6}}>KASUS TERPECAHKAN!</div>
          <div style={{fontSize:12,color:'var(--t)',lineHeight:1.7,marginBottom:6}}>{result.explanation}</div>
          <div className="mono" style={{fontSize:11,color:'var(--g)'}}>+{result.pointReward} XP</div>
        </>:<>
          <div style={{fontSize:30,marginBottom:7}}>❌</div>
          <div className="orb nr" style={{fontSize:14,fontWeight:700,marginBottom:5}}>ANALISIS SALAH</div>
          <div style={{fontSize:12,color:'var(--m)',marginBottom:4}}>Pelaku sebenarnya: <span style={{color:'var(--r)',fontWeight:700}}>{result.culpritName}</span></div>
          <div style={{fontSize:12,lineHeight:1.6}}>{result.explanation}</div>
        </>}
      </div>}

      {tab==='kasus'&&<div className="fade-up">
        <div className="hud glass" style={{borderRadius:12,padding:'14px',marginBottom:11}}>
          <div className="mono" style={{fontSize:9,color:'var(--c)',letterSpacing:2,marginBottom:7}}>DESKRIPSI KASUS</div>
          <div style={{fontSize:13,lineHeight:1.8}}>{data.description}</div>
        </div>
        {data.victim&&<div className="glass" style={{borderRadius:10,padding:'12px',marginBottom:10}}>
          <div className="mono" style={{fontSize:9,color:'var(--r)',letterSpacing:2,marginBottom:5}}>KORBAN</div>
          <div style={{fontSize:13}}>{data.victim.name} · {data.victim.age} tahun · {data.victim.occupation}</div>
        </div>}
        {data.hiddenContradictions?.length>0&&<div className="glass-a" style={{borderRadius:10,padding:'11px',marginBottom:10}}>
          <div className="mono" style={{fontSize:9,color:'var(--a)',letterSpacing:2,marginBottom:5}}>⚠ REALITAS PALSU AKTIF</div>
          <div style={{fontSize:12,color:'var(--m)'}}>Kasus ini mengandung informasi menyesatkan. Verifikasi semua bukti secara forensik.</div>
        </div>}
        {!isSolved&&!result&&<button className="btn btn-c" style={{width:'100%',borderRadius:10,padding:13,fontSize:14,marginBottom:9}} onClick={()=>setShowSolve(true)}>🎯 Ajukan Solusi Akhir</button>}
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8}}>
          <button className="btn btn-i" style={{borderRadius:8,padding:11}} onClick={()=>nav('interogasi')}>💬 Interogasi</button>
          <button className="btn btn-ghost" style={{borderRadius:8,padding:11}} onClick={()=>nav('mindreader')}>🧠 Mind Reader</button>
        </div>
      </div>}

      {tab==='bukti'&&<div className="fade-up">
        <div className="mono" style={{fontSize:9,color:'var(--m)',letterSpacing:2,marginBottom:10}}>
          {data.evidence?.length} BARANG BUKTI · Klik untuk analisis forensik
        </div>
        {data.evidence?.map((e,i)=>(
          <div key={e.id} className="glass" style={{borderRadius:11,padding:'12px',marginBottom:8,border:`1px solid ${e.isKeyEvidence?'rgba(0,245,255,.18)':'rgba(99,102,241,.1)'}`,cursor:'pointer',animation:`fadeUp .3s ease ${i*.05}s both`}} onClick={()=>setForensicOpen(forensicOpen===e.id?null:e.id)}>
            <div style={{display:'flex',gap:9,alignItems:'flex-start'}}>
              <div style={{fontSize:18,flexShrink:0,marginTop:2}}>{e.isKeyEvidence?'🔑':'📋'}</div>
              <div style={{flex:1}}>
                <div style={{display:'flex',gap:6,alignItems:'center',marginBottom:3,flexWrap:'wrap'}}>
                  <span style={{fontWeight:600,fontSize:13,color:e.isKeyEvidence?'var(--c)':'var(--t)'}}>{e.name}</span>
                  {e.isFake&&!result&&<span style={{fontSize:9,padding:'1px 5px',background:'rgba(245,158,11,.1)',color:'var(--a)',borderRadius:3}}>⚠ Verifikasi</span>}
                  {e.isFake&&result&&<span style={{fontSize:9,padding:'1px 5px',background:'rgba(239,68,68,.1)',color:'var(--r)',borderRadius:3}}>✗ PALSU</span>}
                </div>
                <div style={{fontSize:12,color:'var(--m)',lineHeight:1.5}}>{e.description}</div>
                {forensicOpen===e.id&&<div className="glass-c" style={{marginTop:9,borderRadius:8,padding:'10px'}}>
                  <div className="mono" style={{fontSize:9,color:'var(--c)',letterSpacing:1,marginBottom:4}}>ANALISIS FORENSIK</div>
                  <div style={{fontSize:12,lineHeight:1.6}}>{e.forensicAnalysis}</div>
                </div>}
              </div>
            </div>
          </div>
        ))}
      </div>}

      {tab==='tersangka'&&<div className="fade-up">
        {data.suspects?.map((s,i)=>(
          <div key={s.id} style={{marginBottom:9,animation:`fadeUp .3s ease ${i*.06}s both`}}>
            <button className="glass" style={{width:'100%',borderRadius:12,padding:'12px',textAlign:'left',cursor:'pointer',border:suspectOpen===s.id?'1px solid rgba(0,245,255,.35)':'1px solid rgba(99,102,241,.12)',fontFamily:"'Rajdhani',sans-serif"}} onClick={()=>setSuspectOpen(suspectOpen===s.id?null:s.id)}>
              <div style={{display:'flex',alignItems:'center',gap:9}}>
                <div style={{width:42,height:42,borderRadius:'50%',background:'linear-gradient(135deg,rgba(99,102,241,.2),rgba(0,245,255,.07))',display:'flex',alignItems:'center',justifyContent:'center',fontSize:20,border:'1px solid rgba(99,102,241,.25)',flexShrink:0}}>👤</div>
                <div style={{flex:1}}>
                  <div style={{fontWeight:700,fontSize:14}}>{s.name}</div>
                  <div style={{fontSize:12,color:'var(--m)'}}>{s.occupation}</div>
                </div>
                <div style={{textAlign:'right'}}>
                  <div className="mono" style={{fontSize:9,color:s.lieScore>70?'var(--r)':s.lieScore>45?'var(--a)':'var(--g)'}}>{s.lieScore}% KEBOHONGAN</div>
                  <span style={{color:'var(--c)',fontSize:16,display:'block',transform:suspectOpen===s.id?'rotate(90deg)':'none',transition:'transform .2s'}}>›</span>
                </div>
              </div>
              {suspectOpen===s.id&&<div style={{marginTop:12,paddingTop:12,borderTop:'1px solid rgba(99,102,241,.1)'}}>
                {[{l:'MOTIF',v:s.motive,c:'var(--r)'},{l:'ALIBI',v:s.alibi,c:'var(--a)'},{l:'KEPRIBADIAN',v:s.personality,c:'var(--i)'},{l:'PROFIL',v:s.psychProfile,c:'var(--p)'},...(result?[{l:'STATUS',v:s.isGuilty?'⚠ PELAKU SEBENARNYA':'Tidak bersalah',c:s.isGuilty?'var(--r)':'var(--g)'}]:[])].map(info=>(
                  <div key={info.l} style={{marginBottom:9}}>
                    <div className="mono" style={{fontSize:9,color:info.c,letterSpacing:2,marginBottom:2}}>{info.l}</div>
                    <div style={{fontSize:13,lineHeight:1.6}}>{info.v}</div>
                  </div>
                ))}
                <div style={{display:'flex',gap:7,marginTop:10}}>
                  <button className="btn btn-i" style={{flex:1,borderRadius:6,padding:8,fontSize:11}} onClick={e=>{e.stopPropagation();nav('interogasi')}}>💬 Interogasi</button>
                  <button className="btn btn-ghost" style={{flex:1,borderRadius:6,padding:8,fontSize:11}} onClick={e=>{e.stopPropagation();nav('papan')}}>📌 Papan Bukti</button>
                </div>
              </div>}
            </button>
          </div>
        ))}
      </div>}

      {tab==='timeline'&&<div className="fade-up">
        <div className="tl-wrap">
          <div className="tl-line"/>
          {data.timeline?.map((t,i)=>(
            <div key={i} style={{marginBottom:13,position:'relative',animation:`fadeUp .3s ease ${i*.07}s both`}}>
              <div className="tl-dot" style={{top:6,borderColor:i===0?'var(--c)':i===data.timeline.length-1?'var(--r)':'var(--i)',boxShadow:`0 0 6px ${i===0?'var(--c)':i===data.timeline.length-1?'var(--r)':'var(--i)'}`}}/>
              <div className="glass" style={{borderRadius:8,padding:'9px 12px'}}><div className="mono" style={{fontSize:12,lineHeight:1.6}}>{t}</div></div>
            </div>
          ))}
        </div>
        {data.witnesses?.length>0&&<div style={{marginTop:16}}>
          <div className="mono" style={{fontSize:9,color:'var(--a)',letterSpacing:2,marginBottom:9}}>PERNYATAAN SAKSI</div>
          {data.witnesses.map((w,i)=>(
            <div key={i} className="glass" style={{borderRadius:8,padding:'10px 12px',marginBottom:7,border:`1px solid rgba(245,158,11,${w.isLying?.1:.05})`}}>
              <div style={{fontWeight:600,fontSize:12,marginBottom:3}}>{w.name} <span style={{fontSize:10,color:w.isLying?'var(--r)':'var(--g)'}}>· {w.reliability}% reliabilitas{w.isLying?' · KEMUNGKINAN BERBOHONG':''}</span></div>
              <div style={{fontSize:12,color:'var(--m)',lineHeight:1.5,fontStyle:'italic'}}>"{w.statement}"</div>
            </div>
          ))}
        </div>}
      </div>}
    </div>

    {showSolve&&<div className="modal-over" onClick={()=>setShowSolve(false)}>
      <div className="modal-box glass" style={{padding:'22px 18px'}} onClick={e=>e.stopPropagation()}>
        <div className="orb nc" style={{fontSize:15,fontWeight:700,marginBottom:3}}>🎯 Ajukan Solusi Akhir</div>
        <div style={{fontSize:12,color:'var(--r)',marginBottom:13,padding:'7px 10px',background:'rgba(239,68,68,.07)',borderRadius:7}}>⚠ Pilihan salah = 0 XP. Analisis semua bukti dan timeline sebelum menyimpulkan.</div>
        <div className="mono" style={{fontSize:9,color:'var(--c)',letterSpacing:2,marginBottom:9}}>PILIH PELAKU:</div>
        {data.suspects?.map(s=>(
          <button key={s.id} onClick={()=>setSuspectPick(s.id)} style={{width:'100%',padding:'10px 12px',marginBottom:6,borderRadius:8,textAlign:'left',cursor:'pointer',fontFamily:"'Rajdhani',sans-serif",fontSize:13,background:suspectPick===s.id?'rgba(0,245,255,.1)':'rgba(6,12,26,.9)',border:`1px solid ${suspectPick===s.id?'rgba(0,245,255,.45)':'rgba(99,102,241,.18)'}`,color:suspectPick===s.id?'var(--c)':'var(--t)'}}>
            {suspectPick===s.id?'◉':'○'} {s.name} — {s.occupation}
          </button>
        ))}
        <div className="mono" style={{fontSize:9,color:'var(--c)',letterSpacing:2,margin:'12px 0 7px'}}>TEORI ANDA:</div>
        <textarea value={theory} onChange={e=>setTheory(e.target.value)} placeholder="Jelaskan metode, motif, dan bukti yang mendukung teori Anda secara detail dan logis..." style={{width:'100%',padding:'10px 12px',borderRadius:8,minHeight:100,resize:'vertical',lineHeight:1.6,fontSize:12}}/>
        <div style={{display:'flex',gap:8,marginTop:11}}>
          <button className="btn btn-ghost" style={{flex:1,borderRadius:8,padding:11}} onClick={()=>setShowSolve(false)}>Batal</button>
          <button className="btn btn-c" style={{flex:2,borderRadius:8,padding:11,opacity:!suspectPick||!theory.trim()||solving?.5:1}} onClick={handleSolve} disabled={!suspectPick||!theory.trim()||solving}>
            {solving?'Memverifikasi...':'KONFIRMASI SOLUSI'}
          </button>
        </div>
      </div>
    </div>}
  </div>
}

// ── RUANG INTEROGASI ─────────────────────────────────────────
function Interogasi({caseId,nav,playerId}){
  const [caseData,setCaseData]=useState(null)
  const [suspect,setSuspect]=useState(null)
  const [sessionId,setSessionId]=useState(null)
  const [msgs,setMsgs]=useState([])
  const [input,setInput]=useState('')
  const [loading,setLoading]=useState(false)
  const [stress,setStress]=useState(0)
  const [flags,setFlags]=useState([])
  const [listening,setListening]=useState(false)
  const endRef=useRef(null)
  const recRef=useRef(null)
  const QUICK=['Di mana Anda saat kejadian terjadi?','Apa hubungan Anda dengan korban?','Rekaman menunjukkan Anda di lokasi — jelaskan!','Alibi Anda tidak dapat dikonfirmasi saksi manapun.','Mengapa Anda berbohong tentang lokasi Anda?','Apa yang Anda sembunyikan dari kami?']

  useEffect(()=>{
    if(!caseId) return
    api.getCase(caseId).then(d=>setCaseData(d.case)).catch(console.error)
  },[caseId])
  useEffect(()=>{if(endRef.current) endRef.current.scrollIntoView({behavior:'smooth'})},[msgs])

  async function startInterro(s){
    setSuspect(s);setMsgs([]);setFlags([]);setStress(0)
    try{
      const d=await api.startInterro({caseId,suspectId:s.id,playerId})
      setSessionId(d.sessionId)
    }catch(e){console.error(e)}
  }

  async function send(text){
    const msg=text||input
    if(!msg.trim()||!sessionId||loading) return
    setMsgs(m=>[...m,{role:'user',content:msg,time:new Date().toLocaleTimeString('id-ID')}])
    setInput('');setLoading(true)
    try{
      const d=await api.sendMsg({sessionId,message:msg})
      setStress(d.stressLevel);setFlags(d.behaviorFlags||[])
      setMsgs(m=>[...m,{role:'assistant',content:d.response,time:new Date().toLocaleTimeString('id-ID'),flags:d.behaviorFlags}])
    }catch(e){console.error(e)}finally{setLoading(false)}
  }

  function toggleVoice(){
    if(!('webkitSpeechRecognition' in window||'SpeechRecognition' in window)){alert('Browser tidak mendukung Speech Recognition');return}
    if(listening){recRef.current?.stop();setListening(false);return}
    const SR=window.SpeechRecognition||window.webkitSpeechRecognition
    const r=new SR();r.lang='id-ID';r.continuous=false;r.interimResults=false
    r.onstart=()=>setListening(true)
    r.onresult=e=>{const t=e.results[0][0].transcript;setInput(t);send(t)}
    r.onend=()=>setListening(false)
    r.onerror=()=>setListening(false)
    recRef.current=r;r.start()
  }

  return <div style={{minHeight:'100vh',background:'var(--bg)',paddingBottom:88}}>
    <div className="glass sticky" style={{top:0,zIndex:50,borderBottom:'1px solid rgba(0,245,255,.07)'}}>
      <div style={{maxWidth:640,margin:'0 auto',padding:'11px 14px'}}>
        <div style={{display:'flex',alignItems:'center',gap:8}}>
          <button className="btn btn-ghost" style={{borderRadius:6,padding:'6px 9px'}} onClick={()=>nav(caseId?'detail':'kasus')}>←</button>
          <div>
            <div className="orb nc" style={{fontSize:14,fontWeight:700}}>RUANG INTEROGASI</div>
            {caseData&&<div style={{fontSize:10,color:'var(--m)'}}>{caseData.title}</div>}
          </div>
          {stress>0&&<div style={{marginLeft:'auto',textAlign:'right'}}>
            <div className="mono" style={{fontSize:9,color:'var(--r)',marginBottom:2}}>TEKANAN {Math.round(stress)}%</div>
            <div className="pb" style={{width:65}}><div className="pf" style={{width:`${stress}%`,background:`linear-gradient(90deg,#22c55e,#f59e0b,#ef4444)`}}/></div>
          </div>}
        </div>
      </div>
    </div>
    <div style={{maxWidth:640,margin:'0 auto',padding:'12px 14px'}}>
      {!caseId?<div className="glass" style={{borderRadius:12,padding:24,textAlign:'center'}}>
        <div style={{fontSize:36,marginBottom:12}}>⚠️</div>
        <div style={{color:'var(--m)',marginBottom:14}}>Pilih kasus terlebih dahulu</div>
        <button className="btn btn-c" style={{borderRadius:8}} onClick={()=>nav('kasus')}>Pilih Kasus</button>
      </div>:!suspect?<div>
        <div className="mono" style={{fontSize:9,color:'var(--m)',letterSpacing:2,marginBottom:11}}>PILIH TERSANGKA UNTUK DIINTEROGASI:</div>
        {(caseData?.suspects||[]).map((s,i)=>(
          <button key={s.id} className="glass" style={{width:'100%',padding:'13px',marginBottom:9,borderRadius:12,textAlign:'left',cursor:'pointer',border:'1px solid rgba(99,102,241,.15)',fontFamily:"'Rajdhani',sans-serif",animation:`fadeUp .3s ease ${i*.07}s both`}} onClick={()=>startInterro(s)}>
            <div style={{display:'flex',alignItems:'center',gap:11}}>
              <div style={{width:44,height:44,borderRadius:'50%',background:'linear-gradient(135deg,rgba(99,102,241,.2),rgba(0,245,255,.07))',display:'flex',alignItems:'center',justifyContent:'center',fontSize:22,border:'1px solid rgba(99,102,241,.25)',flexShrink:0}}>👤</div>
              <div style={{flex:1}}>
                <div style={{fontWeight:700,fontSize:14}}>{s.name}</div>
                <div style={{fontSize:12,color:'var(--m)',marginBottom:4}}>{s.occupation}</div>
                <div style={{display:'flex',gap:6}}>
                  <span style={{fontSize:10,padding:'2px 7px',borderRadius:10,background:'rgba(99,102,241,.1)',color:'#818cf8',border:'1px solid rgba(99,102,241,.2)'}}>{s.personality}</span>
                  <span className="mono" style={{fontSize:9,color:s.lieScore>70?'var(--r)':s.lieScore>45?'var(--a)':'var(--g)'}}>{s.lieScore}% kebohongan</span>
                </div>
              </div>
              <span style={{color:'var(--c)',fontSize:18}}>›</span>
            </div>
          </button>
        ))}
      </div>:<div>
        <div className="glass-c" style={{borderRadius:12,padding:'10px 14px',marginBottom:9,display:'flex',alignItems:'center',gap:10}}>
          <span style={{fontSize:22}}>👤</span>
          <div style={{flex:1}}>
            <div style={{fontWeight:700,fontSize:13,color:'var(--c)'}}>{suspect.name}</div>
            <div style={{fontSize:11,color:'var(--m)'}}>{suspect.personality}</div>
          </div>
          <button onClick={toggleVoice} style={{width:36,height:36,borderRadius:'50%',border:`1px solid ${listening?'var(--r)':'rgba(0,245,255,.3)'}`,background:listening?'rgba(239,68,68,.12)':'rgba(0,245,255,.07)',color:listening?'var(--r)':'var(--c)',cursor:'pointer',fontSize:16,display:'flex',alignItems:'center',justifyContent:'center'}}>
            {listening?'⏹':'🎙'}
          </button>
          <button className="btn btn-ghost" style={{borderRadius:6,padding:'5px 9px',fontSize:11}} onClick={()=>setSuspect(null)}>Ganti</button>
        </div>
        {flags.length>0&&<div style={{display:'flex',gap:4,flexWrap:'wrap',marginBottom:8}}>
          {flags.map((f,i)=><span key={i} className="mono" style={{fontSize:8,padding:'2px 6px',borderRadius:8,background:`${f.color}12`,color:f.color,border:`1px solid ${f.color}22`}}>{f.type}</span>)}
        </div>}
        {listening&&<div className="glass-r" style={{borderRadius:8,padding:'9px 12px',marginBottom:8,display:'flex',alignItems:'center',gap:9}}>
          <div style={{display:'flex',gap:2,height:18,alignItems:'flex-end'}}>
            {[1,2,3,4,5].map((_,j)=><div key={j} style={{width:3,background:'var(--r)',borderRadius:2,height:`${30+j*15}%`,animation:`pulse ${.4+j*.1}s ease-in-out infinite`}}/>)}
          </div>
          <span className="mono" style={{fontSize:10,color:'var(--r)'}}>MENDENGARKAN...</span>
        </div>}
        <div className="glass" style={{borderRadius:12,padding:'11px',minHeight:270,maxHeight:'44vh',overflowY:'auto',marginBottom:9,border:'1px solid rgba(99,102,241,.12)'}}>
          {msgs.length===0&&<div style={{textAlign:'center',padding:'26px 0',color:'var(--m)'}}>
            <div style={{fontSize:24,marginBottom:7}}>💬</div>
            <div style={{fontSize:13}}>Mulai interogasi. Tersangka menggunakan AI aktif.</div>
            <div style={{fontSize:11,marginTop:4,opacity:.5}}>Perhatikan kontradiksi dan tanda-tanda kebohongan</div>
          </div>}
          {msgs.map((m,i)=>(
            <div key={i} style={{marginBottom:10,display:'flex',flexDirection:'column',alignItems:m.role==='user'?'flex-end':'flex-start'}}>
              {m.role==='assistant'&&<div className="mono" style={{fontSize:9,color:'var(--m)',marginBottom:2}}>{suspect.name} · {m.time}</div>}
              <div className={m.role==='assistant'?'bubble-ai':'bubble-me'} style={{padding:'9px 12px',maxWidth:'88%',fontSize:13,lineHeight:1.65}}>{m.content}</div>
              {m.role==='assistant'&&m.flags?.length>0&&<div style={{display:'flex',gap:3,marginTop:3,flexWrap:'wrap'}}>
                {m.flags.map((f,j)=><span key={j} className="mono" style={{fontSize:7,padding:'1px 5px',borderRadius:7,background:`${f.color}10`,color:f.color,border:`1px solid ${f.color}20`}}>{f.type}</span>)}
              </div>}
              {m.role==='user'&&<div className="mono" style={{fontSize:9,color:'var(--m)',marginTop:2}}>ANDA · {m.time}</div>}
            </div>
          ))}
          {loading&&<div className="bubble-ai" style={{padding:'9px 12px',display:'inline-block'}}><Think/></div>}
          <div ref={endRef}/>
        </div>
        <div style={{marginBottom:7,display:'flex',gap:5,overflowX:'auto',paddingBottom:3}}>
          {QUICK.map(q=><button key={q} onClick={()=>setInput(q)} style={{padding:'4px 8px',borderRadius:14,fontSize:10,cursor:'pointer',background:'rgba(10,17,32,.8)',color:'var(--m)',border:'1px solid rgba(99,102,241,.15)',whiteSpace:'nowrap',fontFamily:"'Rajdhani',sans-serif"}}>
            {q.substring(0,22)}...
          </button>)}
        </div>
        <div style={{display:'flex',gap:7}}>
          <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==='Enter'&&send()} placeholder="Ajukan pertanyaan kepada tersangka..." style={{flex:1,padding:'11px 13px',borderRadius:10}} disabled={loading}/>
          <button className="btn btn-c" style={{borderRadius:10,padding:'11px 16px'}} onClick={()=>send()} disabled={loading||!input.trim()}>→</button>
        </div>
      </div>}
    </div>
  </div>
}

// ── PAPAN BUKTI ─────────────────────────────────────────────
function PapanBukti({caseId,nav}){
  const [pins,setPins]=useState([])
  const [conns,setConns]=useState([])
  const [mode,setMode]=useState(false)
  const [sel,setSel]=useState(null)
  const [show,setShow]=useState(false)
  const [note,setNote]=useState('')
  const [type,setType]=useState('bukti')
  const [caseData,setCaseData]=useState(null)
  const TC={bukti:'#00f5ff',tersangka:'#ef4444',teori:'#a855f7',catatan:'#f59e0b'}
  const TI={bukti:'🔑',tersangka:'👤',teori:'💡',catatan:'📝'}

  useEffect(()=>{
    if(!caseId) return
    api.getCase(caseId).then(d=>{
      const c=d.case;setCaseData(c)
      if(pins.length===0){
        const p=[]
        c.evidence?.slice(0,4).forEach((e,i)=>p.push({id:`e_${e.id}`,label:e.name,type:'bukti',x:10+(i%2)*45,y:8+Math.floor(i/2)*30,detail:e.description}))
        c.suspects?.slice(0,3).forEach((s,i)=>p.push({id:`s_${s.id}`,label:s.name,type:'tersangka',x:12+i*32,y:66,detail:s.occupation}))
        setPins(p)
      }
    }).catch(console.error)
  },[caseId])

  function clickPin(pin){
    if(!mode) return
    if(!sel){setSel(pin)}else if(sel.id!==pin.id){
      if(!conns.some(c=>(c.f===sel.id&&c.t===pin.id)||(c.f===pin.id&&c.t===sel.id)))
        setConns([...conns,{f:sel.id,t:pin.id,id:Date.now()}])
      setSel(null)
    }
  }
  function addPin(){
    if(!note.trim()) return
    setPins([...pins,{id:`c_${Date.now()}`,label:note.substring(0,24),type,x:20+Math.random()*55,y:20+Math.random()*50,detail:note}])
    setNote('');setShow(false)
  }

  return <div style={{minHeight:'100vh',background:'var(--bg)',paddingBottom:88}}>
    <div className="glass sticky" style={{top:0,zIndex:50,borderBottom:'1px solid rgba(0,245,255,.07)'}}>
      <div style={{maxWidth:640,margin:'0 auto',padding:'11px 14px'}}>
        <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:9}}>
          <button className="btn btn-ghost" style={{borderRadius:6,padding:'6px 9px'}} onClick={()=>nav('dashboard')}>←</button>
          <span className="orb nc" style={{fontSize:14,fontWeight:700}}>🔬 PAPAN BUKTI</span>
          {caseData&&<span style={{fontSize:10,color:'var(--m)',marginLeft:'auto',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',maxWidth:140}}>{caseData.title}</span>}
        </div>
        <div style={{display:'flex',gap:7}}>
          <button className={`btn ${mode?'btn-r':'btn-ghost'}`} style={{borderRadius:7,flex:1,padding:9,fontSize:11}} onClick={()=>{setMode(!mode);setSel(null)}}>
            {mode?'✕ Batal':'🔗 Buat Koneksi'}
          </button>
          <button className="btn btn-c" style={{borderRadius:7,flex:1,padding:9,fontSize:11}} onClick={()=>setShow(true)}>+ Tambah Pin</button>
          {conns.length>0&&<button className="btn btn-ghost" style={{borderRadius:7,padding:'9px 11px',fontSize:11}} onClick={()=>setConns([])}>↺</button>}
        </div>
        {mode&&<div style={{marginTop:7,fontSize:11,color:'var(--a)',padding:'5px 9px',background:'rgba(245,158,11,.07)',borderRadius:5}}>
          {sel?`Pilih target untuk "${sel.label}"`:'Pilih pin pertama untuk menghubungkan'}
        </div>}
      </div>
    </div>
    <div style={{maxWidth:640,margin:'0 auto',padding:'12px 14px'}}>
      {!caseId?<div className="glass" style={{borderRadius:12,padding:28,textAlign:'center'}}>
        <div style={{fontSize:36,marginBottom:12}}>🔍</div>
        <div style={{color:'var(--m)',marginBottom:14}}>Pilih kasus untuk memulai investigasi visual</div>
        <button className="btn btn-c" style={{borderRadius:8}} onClick={()=>nav('kasus')}>Pilih Kasus</button>
      </div>:<div>
        <div className="glass" style={{borderRadius:13,height:380,position:'relative',overflow:'hidden',background:'rgba(3,6,15,.97)',backgroundImage:'radial-gradient(rgba(99,102,241,.07) 1px,transparent 1px)',backgroundSize:'20px 20px',border:'1px solid rgba(0,245,255,.09)',marginBottom:11}}>
          <svg style={{position:'absolute',inset:0,width:'100%',height:'100%',pointerEvents:'none'}}>
            {conns.map(c=>{
              const f=pins.find(p=>p.id===c.f),t=pins.find(p=>p.id===c.t)
              if(!f||!t) return null
              return <line key={c.id} stroke="rgba(0,245,255,.32)" strokeWidth="1.5" strokeDasharray="6,4" x1={`${f.x+7}%`} y1={`${f.y+7}%`} x2={`${t.x+7}%`} y2={`${t.y+7}%`}/>
            })}
          </svg>
          {pins.map(pin=>(
            <div key={pin.id} style={{position:'absolute',left:`${pin.x}%`,top:`${pin.y}%`,transform:'translate(-50%,-50%)',cursor:mode?'crosshair':'default',zIndex:sel?.id===pin.id?10:1}} onClick={()=>clickPin(pin)}>
              <div style={{background:`${TC[pin.type]}0d`,border:`1.5px solid ${sel?.id===pin.id?'#fff':TC[pin.type]}45`,borderRadius:8,padding:'5px 7px',maxWidth:88,textAlign:'center',boxShadow:sel?.id===pin.id?`0 0 14px ${TC[pin.type]}`:'none',transition:'all .2s'}}>
                <div style={{fontSize:14,marginBottom:1}}>{TI[pin.type]}</div>
                <div style={{fontSize:8,color:TC[pin.type],fontFamily:'Share Tech Mono',wordBreak:'break-word',lineHeight:1.3}}>{pin.label}</div>
              </div>
            </div>
          ))}
          {pins.length===0&&<div style={{position:'absolute',inset:0,display:'flex',alignItems:'center',justifyContent:'center',color:'var(--m)',fontSize:12}}>Tambahkan pin untuk memulai</div>}
        </div>
        {caseData?.suspects&&<div style={{display:'flex',gap:5,flexWrap:'wrap'}}>
          {caseData.suspects.map(s=>(
            <button key={s.id} onClick={()=>{if(!pins.find(p=>p.id===`s_${s.id}`)) setPins([...pins,{id:`s_${s.id}`,label:s.name,type:'tersangka',x:15+Math.random()*70,y:15+Math.random()*70,detail:s.occupation}])}} style={{padding:'4px 8px',borderRadius:5,fontSize:10,cursor:'pointer',background:'rgba(239,68,68,.07)',color:'#f87171',border:'1px solid rgba(239,68,68,.17)',fontFamily:"'Rajdhani',sans-serif"}}>
              +{s.name.split(' ')[0]}
            </button>
          ))}
        </div>}
      </div>}
    </div>
    {show&&<div className="modal-over" onClick={()=>setShow(false)}>
      <div className="modal-box glass" style={{padding:'22px 18px'}} onClick={e=>e.stopPropagation()}>
        <div className="orb nc" style={{fontSize:15,marginBottom:12}}>+ Tambah Pin Investigasi</div>
        <div style={{display:'flex',gap:6,marginBottom:11}}>
          {Object.entries(TC).map(([t,c])=>(
            <button key={t} onClick={()=>setType(t)} style={{flex:1,padding:'7px 3px',borderRadius:6,fontSize:11,cursor:'pointer',fontFamily:"'Rajdhani',sans-serif",textTransform:'capitalize',background:type===t?`${c}15`:'rgba(10,17,32,.8)',color:type===t?c:'var(--m)',border:`1px solid ${type===t?c+'45':'rgba(99,102,241,.15)'}`}}>
              {TI[t]}
            </button>
          ))}
        </div>
        <textarea value={note} onChange={e=>setNote(e.target.value)} placeholder={`Tambahkan ${type}...`} style={{width:'100%',padding:'11px',borderRadius:8,minHeight:80,resize:'none',fontSize:12}}/>
        <div style={{display:'flex',gap:8,marginTop:11}}>
          <button className="btn btn-ghost" style={{flex:1,borderRadius:8,padding:11}} onClick={()=>setShow(false)}>Batal</button>
          <button className="btn btn-c" style={{flex:2,borderRadius:8,padding:11}} onClick={addPin} disabled={!note.trim()}>Tambah</button>
        </div>
      </div>
    </div>}
  </div>
}

// ── AKADEMI DETEKTIF ─────────────────────────────────────────
function Akademi({nav,stats}){
  const [modules,setModules]=useState([])
  const [selMod,setSelMod]=useState(null)
  const [lesson,setLesson]=useState(null)
  const [loading,setLoading]=useState(false)
  const [answer,setAnswer]=useState('')
  const [evaluation,setEvaluation]=useState(null)

  useEffect(()=>{
    api.getModules().then(d=>setModules(d.modules||[])).catch(console.error)
  },[])

  async function loadLesson(mod){
    setSelMod(mod);setLesson(null);setLoading(true);setAnswer('');setEvaluation(null)
    try{
      const d=await api.getLesson({moduleId:mod.id,lessonNumber:1,playerId:stats.playerId})
      setLesson(d.lesson)
    }catch(e){console.error(e)}finally{setLoading(false)}
  }

  async function evalAnswer(){
    if(!answer.trim()||!lesson) return
    setLoading(true)
    try{
      const d=await api.evalAnswer({moduleId:selMod.id,question:lesson.caseExample?.question||'',answer})
      setEvaluation(d.evaluation)
    }catch(e){console.error(e)}finally{setLoading(false)}
  }

  const rank=getRank(stats.pts)
  const COLORS=['var(--c)','var(--a)','var(--p)','var(--i)','var(--g)']

  return <div style={{minHeight:'100vh',background:'var(--bg)',paddingBottom:88}}>
    <div className="glass sticky" style={{top:0,zIndex:50,borderBottom:'1px solid rgba(0,245,255,.07)'}}>
      <div style={{maxWidth:640,margin:'0 auto',padding:'11px 14px',display:'flex',alignItems:'center',gap:9}}>
        <button className="btn btn-ghost" style={{borderRadius:6,padding:'6px 9px'}} onClick={()=>nav('dashboard')}>←</button>
        <div>
          <div className="orb ng" style={{fontSize:14,fontWeight:700}}>🎓 AKADEMI DETEKTIF</div>
          <div style={{fontSize:10,color:'var(--m)'}}>Pelatihan Kognitif Lanjutan</div>
        </div>
        <RankBadge pts={stats.pts}/>
      </div>
    </div>
    <div style={{maxWidth:640,margin:'0 auto',padding:'14px'}}>
      {!selMod?<>
        <div className="hud glass" style={{borderRadius:12,padding:'14px',marginBottom:13}}>
          <div className="mono" style={{fontSize:9,color:'var(--m)',letterSpacing:2,marginBottom:4}}>RANK AKTIF</div>
          <div className="orb" style={{fontSize:16,fontWeight:700,color:rank.color,marginBottom:8}}>{rank.name}</div>
          <div style={{display:'flex',gap:6,alignItems:'center'}}>
            <span style={{fontSize:10,color:'var(--m)'}}>Kemajuan:</span>
            <div style={{flex:1}}><PBar v={stats.pts-(rank.min||0)} max={(getNext(stats.pts)?.min||30000)-(rank.min||0)}/></div>
            <span className="mono" style={{fontSize:9,color:'var(--c)'}}>{stats.pts} XP</span>
          </div>
        </div>
        <div className="mono" style={{fontSize:9,color:'var(--m)',letterSpacing:2,marginBottom:10}}>MODUL PELATIHAN:</div>
        {modules.map((m,i)=>(
          <button key={m.id} className="glass card-hover" style={{width:'100%',borderRadius:12,padding:'14px',marginBottom:9,textAlign:'left',cursor:'pointer',border:`1px solid rgba(99,102,241,.12)`,fontFamily:"'Rajdhani',sans-serif",animation:`fadeUp .3s ease ${i*.06}s both`}} onClick={()=>loadLesson(m)}>
            <div style={{display:'flex',alignItems:'center',gap:11}}>
              <div style={{width:46,height:46,borderRadius:10,background:`${COLORS[i%5]}12`,border:`1px solid ${COLORS[i%5]}25`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:24,flexShrink:0}}>{m.icon}</div>
              <div style={{flex:1}}>
                <div style={{fontWeight:700,fontSize:14,color:COLORS[i%5]}}>{m.title}</div>
                <div style={{fontSize:12,color:'var(--m)',marginTop:2}}>{m.desc}</div>
                <div className="mono" style={{fontSize:9,color:'var(--m)',marginTop:4}}>Level {m.level}</div>
              </div>
              <span style={{color:'var(--c)',fontSize:18}}>›</span>
            </div>
          </button>
        ))}
      </>:<div className="fade-up">
        <button className="btn btn-ghost" style={{borderRadius:7,padding:'7px 12px',fontSize:11,marginBottom:13}} onClick={()=>setSelMod(null)}>← Kembali ke Modul</button>
        <div className="glass-g" style={{borderRadius:12,padding:'12px',marginBottom:12,display:'flex',alignItems:'center',gap:11}}>
          <span style={{fontSize:28}}>{selMod.icon}</span>
          <div><div style={{fontWeight:700,fontSize:15,color:'var(--g)'}}>{selMod.title}</div><div style={{fontSize:11,color:'var(--m)'}}>{selMod.desc}</div></div>
        </div>
        {loading&&<div className="glass-g" style={{borderRadius:12,padding:20,textAlign:'center'}}><Think label="MENYIAPKAN PELAJARAN"/></div>}
        {lesson&&<>
          <div className="glass" style={{borderRadius:12,padding:'14px',marginBottom:11}}>
            <div className="orb ng" style={{fontSize:14,fontWeight:700,marginBottom:4}}>{lesson.lessonTitle}</div>
            <div style={{fontSize:12,color:'var(--a)',marginBottom:10}}>Tujuan: {lesson.objective}</div>
            <div style={{fontSize:13,lineHeight:1.85,color:'var(--t)',whiteSpace:'pre-wrap'}}>{lesson.theory}</div>
            {lesson.keyPoints?.length>0&&<div style={{marginTop:12}}>
              <div className="mono" style={{fontSize:9,color:'var(--c)',letterSpacing:2,marginBottom:7}}>POIN KUNCI:</div>
              {lesson.keyPoints.map((p,i)=>(
                <div key={i} style={{display:'flex',gap:8,marginBottom:5}}>
                  <span style={{color:'var(--g)',flexShrink:0}}>◉</span>
                  <span style={{fontSize:13,lineHeight:1.6}}>{p}</span>
                </div>
              ))}
            </div>}
          </div>
          {lesson.caseExample&&<div className="glass-a" style={{borderRadius:12,padding:'14px',marginBottom:11}}>
            <div className="mono" style={{fontSize:9,color:'var(--a)',letterSpacing:2,marginBottom:9}}>STUDI KASUS:</div>
            <div style={{fontSize:13,lineHeight:1.7,marginBottom:11}}>{lesson.caseExample.scenario}</div>
            <div style={{fontWeight:700,fontSize:13,marginBottom:9,color:'var(--a)'}}>❓ {lesson.caseExample.question}</div>
            {lesson.caseExample.options?.map(opt=>(
              <div key={opt} style={{padding:'9px 12px',marginBottom:6,borderRadius:8,background:'rgba(245,158,11,.05)',border:'1px solid rgba(245,158,11,.15)',fontSize:13}}>{opt}</div>
            ))}
            <textarea value={answer} onChange={e=>setAnswer(e.target.value)} placeholder="Tulis jawaban dan analisis Anda secara detail..." style={{width:'100%',padding:'10px',borderRadius:8,minHeight:80,resize:'vertical',fontSize:12,lineHeight:1.6,marginTop:9}}/>
            <button className="btn btn-g" style={{width:'100%',borderRadius:8,marginTop:9,padding:12,opacity:!answer.trim()||loading?.5:1}} onClick={evalAnswer} disabled={!answer.trim()||loading}>
              {loading?'Mengevaluasi...':'✓ KIRIM JAWABAN'}
            </button>
          </div>}
          {evaluation&&<div className={`fade-up ${evaluation.isCorrect?'glass-g':'glass-r'}`} style={{borderRadius:12,padding:'14px',marginBottom:11}}>
            <div className="mono" style={{fontSize:9,color:evaluation.isCorrect?'var(--g)':'var(--r)',letterSpacing:2,marginBottom:7}}>EVALUASI AI</div>
            <div style={{fontSize:14,fontWeight:700,marginBottom:7,color:evaluation.isCorrect?'var(--g)':'var(--r)'}}>
              {evaluation.isCorrect?'✓ BENAR':'✗ KURANG TEPAT'} — Skor: {evaluation.score}/100
            </div>
            <div style={{fontSize:13,lineHeight:1.7,marginBottom:7}}>{evaluation.feedback}</div>
            {evaluation.improvement&&<div style={{fontSize:12,color:'var(--m)',lineHeight:1.6}}>Perbaikan: {evaluation.improvement}</div>}
            {evaluation.xpEarned>0&&<div className="mono" style={{fontSize:11,color:'var(--g)',marginTop:7}}>+{evaluation.xpEarned} XP</div>}
          </div>}
        </>}
      </div>}
    </div>
  </div>
}

// ── MIND READER ─────────────────────────────────────────────
function MindReader({caseId,nav}){
  const [theory,setTheory]=useState('')
  const [analysis,setAnalysis]=useState('')
  const [loading,setLoading]=useState(false)
  const [score,setScore]=useState(null)

  async function analyze(){
    if(!theory.trim()||loading) return
    setLoading(true);setAnalysis('');setScore(null)
    try{
      const d=await api.mindReader({theory,caseId})
      setAnalysis(d.analysis)
      const wc=theory.split(' ').length
      setScore(Math.min(100,Math.floor(wc*1.5+(theory.includes('bukti')?20:0)+(theory.includes('motif')?15:0)+(theory.includes('alibi')?15:0))))
    }catch(e){console.error(e)}finally{setLoading(false)}
  }

  return <div style={{minHeight:'100vh',background:'var(--bg)',paddingBottom:88}}>
    <div className="glass sticky" style={{top:0,zIndex:50,borderBottom:'1px solid rgba(0,245,255,.07)'}}>
      <div style={{maxWidth:640,margin:'0 auto',padding:'11px 14px',display:'flex',alignItems:'center',gap:9}}>
        <button className="btn btn-ghost" style={{borderRadius:6,padding:'6px 9px'}} onClick={()=>nav('dashboard')}>←</button>
        <div>
          <div className="orb np" style={{fontSize:14,fontWeight:700}}>🧠 MIND READER</div>
          <div style={{fontSize:10,color:'var(--m)'}}>Analisis Neural Teori Investigasi</div>
        </div>
      </div>
    </div>
    <div style={{maxWidth:640,margin:'0 auto',padding:'14px'}}>
      <div className="hud glass" style={{borderRadius:12,padding:'14px',marginBottom:12}}>
        <div className="mono" style={{fontSize:9,color:'var(--p)',letterSpacing:2,marginBottom:7}}>MASUKKAN TEORI ANDA:</div>
        <textarea value={theory} onChange={e=>setTheory(e.target.value)} placeholder="Tulis teori investigasi lengkap Anda — siapa pelaku, motif, metode yang digunakan, bukti yang mendukung, dan bukti palsu yang teridentifikasi..." style={{width:'100%',padding:'12px',borderRadius:9,minHeight:140,resize:'vertical',lineHeight:1.7,fontSize:12}}/>
        <button className="btn btn-p" style={{width:'100%',borderRadius:8,padding:13,marginTop:10,opacity:!theory.trim()||loading?.5:1}} onClick={analyze} disabled={!theory.trim()||loading}>
          {loading?'Menganalisis Teori...':'🧠 ANALISIS MENDALAM'}
        </button>
      </div>
      {loading&&<div className="glass-p" style={{borderRadius:12,padding:20,textAlign:'center'}}><Think label="NEXUS NEURAL PROCESSING"/></div>}
      {score!==null&&analysis&&<div className="fade-up">
        <div className="glass" style={{borderRadius:12,padding:'13px',marginBottom:11}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:9}}>
            <div className="mono" style={{fontSize:9,color:'var(--m)',letterSpacing:2}}>SKOR KOGNITIF TEORI</div>
            <div className="orb" style={{fontSize:24,fontWeight:700,color:score>70?'var(--g)':score>45?'var(--a)':'var(--r)'}}>{score}<span style={{fontSize:12}}>/100</span></div>
          </div>
          <PBar v={score} color={score>70?'var(--g)':score>45?'var(--a)':'var(--r)'}/>
          <div className="mono" style={{fontSize:10,marginTop:6,color:score>70?'var(--g)':score>45?'var(--a)':'var(--r)'}}>{score>70?'ANALISIS KOMPREHENSIF':score>45?'TEORI TERBENTUK':'TEORI LEMAH — INVESTIGASI ULANG'}</div>
        </div>
        <div className="glass" style={{borderRadius:12,padding:'14px',border:'1px solid rgba(168,85,247,.2)'}}>
          <div className="mono" style={{fontSize:9,color:'var(--p)',letterSpacing:2,marginBottom:9}}>ANALISIS NEXUS:</div>
          <div style={{fontSize:13,lineHeight:1.85,whiteSpace:'pre-wrap'}}>{analysis}</div>
        </div>
      </div>}
    </div>
  </div>
}

// ── PETA KOGNITIF ────────────────────────────────────────────
function PetaKognitif({nav,stats,playerId}){
  const [report,setReport]=useState(null)
  const [loading,setLoading]=useState(false)

  async function loadReport(){
    setLoading(true)
    try{ const d=await api.getCogReport(playerId); setReport(d.report) }
    catch(e){console.error(e)}finally{setLoading(false)}
  }

  const cm=stats.cognitive||{observasi:50,deduksiLogis:50,ketahananBias:50,pengenalanPola:50}
  const items=[
    {k:'observasi',l:'Kemampuan Observasi',c:'var(--c)'},
    {k:'deduksiLogis',l:'Deduksi Logis',c:'var(--i)'},
    {k:'ketahananBias',l:'Ketahanan terhadap Bias',c:'var(--g)'},
    {k:'pengenalanPola',l:'Pengenalan Pola',c:'var(--p)'},
  ]

  return <div style={{minHeight:'100vh',background:'var(--bg)',paddingBottom:88}}>
    <div className="glass sticky" style={{top:0,zIndex:50,borderBottom:'1px solid rgba(0,245,255,.07)'}}>
      <div style={{maxWidth:640,margin:'0 auto',padding:'11px 14px',display:'flex',alignItems:'center',gap:9}}>
        <button className="btn btn-ghost" style={{borderRadius:6,padding:'6px 9px'}} onClick={()=>nav('dashboard')}>←</button>
        <div className="orb nc" style={{fontSize:14,fontWeight:700}}>📊 PETA KOGNITIF</div>
      </div>
    </div>
    <div style={{maxWidth:640,margin:'0 auto',padding:'14px'}}>
      <div className="hud glass" style={{borderRadius:12,padding:'14px',marginBottom:13}}>
        <div className="mono" style={{fontSize:9,color:'var(--m)',letterSpacing:2,marginBottom:11}}>PROFIL KOGNITIF DETEKTIF</div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:9}}>
          {items.map(it=>(
            <div key={it.k} className="glass" style={{borderRadius:9,padding:'11px'}}>
              <div className="mono" style={{fontSize:8,color:'var(--m)',letterSpacing:1,marginBottom:5}}>{it.l.toUpperCase()}</div>
              <div className="orb" style={{fontSize:22,fontWeight:700,color:it.c,marginBottom:5}}>{cm[it.k]||50}<span style={{fontSize:11}}>%</span></div>
              <PBar v={cm[it.k]||50} color={it.c}/>
            </div>
          ))}
        </div>
      </div>
      {stats.detectedBiases?.length>0&&<div className="glass-r" style={{borderRadius:12,padding:'13px',marginBottom:12}}>
        <div className="mono" style={{fontSize:9,color:'var(--r)',letterSpacing:2,marginBottom:9}}>BIAS TERDETEKSI</div>
        <div style={{display:'flex',gap:6,flexWrap:'wrap'}}>
          {stats.detectedBiases.map(b=><span key={b} style={{padding:'4px 10px',borderRadius:12,background:'rgba(239,68,68,.1)',color:'#f87171',border:'1px solid rgba(239,68,68,.2)',fontSize:12}}>{b}</span>)}
        </div>
      </div>}
      <button className="btn btn-c" style={{width:'100%',borderRadius:10,padding:13,marginBottom:12}} onClick={loadReport} disabled={loading}>
        {loading?'Memuat Laporan...':'📋 Generate Laporan Kognitif AI'}
      </button>
      {loading&&<div className="glass-c" style={{borderRadius:12,padding:18,textAlign:'center'}}><Think label="AI MENGANALISIS PROFIL ANDA"/></div>}
      {report&&<div className="glass fade-up" style={{borderRadius:12,padding:'14px',border:'1px solid rgba(0,245,255,.15)'}}>
        <div className="mono" style={{fontSize:9,color:'var(--c)',letterSpacing:2,marginBottom:9}}>LAPORAN KOGNITIF AI:</div>
        <div style={{fontSize:13,lineHeight:1.9,whiteSpace:'pre-wrap'}}>{report.narrative}</div>
      </div>}
    </div>
  </div>
}

// ── JARINGAN GLOBAL ─────────────────────────────────────────
function JaringanGlobal({nav,stats,playerId}){
  const [tab,setTab]=useState('leaderboard')
  const [lb,setLb]=useState([])
  const [daily,setDaily]=useState(null)
  const [loading,setLoading]=useState(false)
  const [netStats,setNetStats]=useState(null)

  useEffect(()=>{
    api.registerNet({playerId,name:'Detektif '+playerId.slice(-4)}).catch(console.error)
    api.getLeaderboard('points',50).then(d=>{setLb(d.leaderboard||[]);setNetStats(d.stats)}).catch(console.error)
  },[])

  async function loadDaily(){
    if(daily) return
    setLoading(true)
    try{ const d=await api.getDailyCase(); setDaily(d.case) }
    catch(e){console.error(e)}finally{setLoading(false)}
  }

  useEffect(()=>{ if(tab==='harian') loadDaily() },[tab])

  const myPos=lb.findIndex(p=>p.id===playerId)+1

  return <div style={{minHeight:'100vh',background:'var(--bg)',paddingBottom:88}}>
    <div className="glass sticky" style={{top:0,zIndex:50,borderBottom:'1px solid rgba(0,245,255,.07)'}}>
      <div style={{maxWidth:640,margin:'0 auto',padding:'11px 14px'}}>
        <div style={{display:'flex',alignItems:'center',gap:9,marginBottom:10}}>
          <button className="btn btn-ghost" style={{borderRadius:6,padding:'6px 9px'}} onClick={()=>nav('dashboard')}>←</button>
          <div>
            <div className="orb ng" style={{fontSize:14,fontWeight:700}}>🌍 JARINGAN GLOBAL</div>
            {netStats&&<div style={{fontSize:10,color:'var(--m)'}}>{netStats.totalPlayers} detektif aktif · {netStats.activeLast24h} online</div>}
          </div>
        </div>
        <div style={{display:'flex',gap:5}}>
          {['leaderboard','harian'].map(t=>(
            <button key={t} onClick={()=>setTab(t)} style={{padding:'6px 14px',borderRadius:16,fontSize:11,cursor:'pointer',fontFamily:"'Rajdhani',sans-serif",fontWeight:600,background:tab===t?'rgba(0,245,255,.1)':'rgba(10,17,32,.7)',color:tab===t?'var(--c)':'var(--m)',border:`1px solid ${tab===t?'rgba(0,245,255,.35)':'rgba(99,102,241,.12)'}`}}>
              {t==='leaderboard'?'🏆 Leaderboard':'🗓 Kasus Harian'}
            </button>
          ))}
        </div>
      </div>
    </div>
    <div style={{maxWidth:640,margin:'0 auto',padding:'12px 14px'}}>
      {tab==='leaderboard'&&<div>
        {myPos>0&&<div className="glass-c" style={{borderRadius:10,padding:'10px 14px',marginBottom:11,display:'flex',alignItems:'center',gap:9}}>
          <span style={{fontSize:22}}>🏅</span>
          <div>
            <div style={{fontSize:13,fontWeight:700}}>Posisi Anda: #{myPos}</div>
            <div style={{fontSize:11,color:'var(--m)'}}>dari {lb.length} detektif terdaftar</div>
          </div>
          <div style={{marginLeft:'auto',textAlign:'right'}}>
            <div className="orb nc" style={{fontSize:16}}>{stats.pts}</div>
            <div style={{fontSize:9,color:'var(--m)'}}>XP</div>
          </div>
        </div>}
        <div className="glass" style={{borderRadius:12,overflow:'hidden'}}>
          {lb.slice(0,20).map((p,i)=>(
            <div key={p.id} className="lb-row" style={{borderBottom:'1px solid rgba(99,102,241,.06)',background:p.id===playerId?'rgba(0,245,255,.04)':'transparent'}}>
              <div style={{width:28,textAlign:'center'}}>
                {i===0?'🥇':i===1?'🥈':i===2?'🥉':<span className="mono" style={{fontSize:11,color:'var(--m)'}}>{i+1}</span>}
              </div>
              <div style={{flex:1}}>
                <div style={{fontWeight:600,fontSize:13,color:p.id===playerId?'var(--c)':'var(--t)'}}>{p.name}</div>
                <div className="mono" style={{fontSize:9,color:'var(--m)'}}>{p.rank}</div>
              </div>
              <div style={{textAlign:'right'}}>
                <div className="orb" style={{fontSize:14,color:'var(--a)'}}>{p.points.toLocaleString()}</div>
                <div style={{fontSize:9,color:'var(--m)'}}>{p.solved} kasus</div>
              </div>
            </div>
          ))}
          {lb.length===0&&<div style={{padding:'24px',textAlign:'center',color:'var(--m)'}}>Belum ada pemain terdaftar</div>}
        </div>
      </div>}
      {tab==='harian'&&<div>
        {loading&&<div className="glass" style={{borderRadius:12,padding:24,textAlign:'center'}}><Think label="MEMUAT KASUS HARIAN"/></div>}
        {daily?<div className="fade-up">
          <div className="glass-c" style={{borderRadius:12,padding:'14px',marginBottom:11}}>
            <div className="mono" style={{fontSize:9,color:'var(--c)',letterSpacing:2,marginBottom:5}}>KASUS TANTANGAN HARIAN</div>
            <div style={{fontWeight:700,fontSize:16,marginBottom:4}}>{daily.title}</div>
            <div style={{fontSize:12,color:'var(--m)',lineHeight:1.7,marginBottom:9}}>{daily.description}</div>
            <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
              <DTag d={daily.difficulty||'MAHIR'}/>
              <span className="tag" style={{background:'rgba(0,245,255,.08)',color:'var(--c)',border:'1px solid rgba(0,245,255,.25)'}}>🗓 HARIAN</span>
            </div>
          </div>
          <button className="btn btn-c" style={{width:'100%',borderRadius:10,padding:13}} onClick={()=>nav('kasus')}>▶ Mulai Kasus Harian</button>
        </div>:!loading&&<div className="glass" style={{borderRadius:12,padding:24,textAlign:'center'}}>
          <div style={{fontSize:36,marginBottom:12}}>🗓</div>
          <div style={{color:'var(--m)'}}>Kasus harian akan tersedia segera</div>
        </div>}
      </div>}
    </div>
  </div>
}

// ── MODE OMEGA ───────────────────────────────────────────────
function ModeOmega({nav,stats,playerId}){
  const [omegaCase,setOmegaCase]=useState(null)
  const [loading,setLoading]=useState(false)
  const unlocked=stats.solved>=50||stats.pts>=30000

  async function loadOmega(){
    setLoading(true)
    try{ const d=await api.omegaNext({playerId}); setOmegaCase(d.case) }
    catch(e){console.error(e)}finally{setLoading(false)}
  }

  return <div style={{minHeight:'100vh',background:'var(--bg)',paddingBottom:88}}>
    <div className="glass sticky" style={{top:0,zIndex:50,borderBottom:'1px solid rgba(0,245,255,.07)'}}>
      <div style={{maxWidth:640,margin:'0 auto',padding:'11px 14px',display:'flex',alignItems:'center',gap:9}}>
        <button className="btn btn-ghost" style={{borderRadius:6,padding:'6px 9px'}} onClick={()=>nav('dashboard')}>←</button>
        <div>
          <div className="orb" style={{fontSize:14,fontWeight:700,color:'#ff6b00'}}>♾️ MODE OMEGA</div>
          <div style={{fontSize:10,color:'var(--m)'}}>Kasus Tak Terbatas — AI Generated</div>
        </div>
      </div>
    </div>
    <div style={{maxWidth:640,margin:'0 auto',padding:'14px'}}>
      {!unlocked?<div style={{textAlign:'center',padding:'32px 0'}}>
        <div style={{fontSize:48,marginBottom:16}}>🔒</div>
        <div className="orb" style={{fontSize:16,color:'#ff6b00',marginBottom:9}}>TERKUNCI</div>
        <div style={{fontSize:14,color:'var(--m)',lineHeight:1.8,marginBottom:16}}>
          Selesaikan <strong style={{color:'var(--c)'}}>50 kasus</strong> atau capai <strong style={{color:'var(--a)'}}>30.000 XP</strong> untuk membuka NEXUS OMEGA MODE.
        </div>
        <div style={{marginBottom:20}}>
          <div style={{display:'flex',justifyContent:'space-between',marginBottom:6}}>
            <span style={{fontSize:12,color:'var(--m)'}}>Kasus selesai</span>
            <span className="mono" style={{fontSize:12,color:'var(--c)'}}>{stats.solved}/50</span>
          </div>
          <PBar v={stats.solved} max={50} color='var(--c)'/>
          <div style={{display:'flex',justifyContent:'space-between',marginTop:9,marginBottom:6}}>
            <span style={{fontSize:12,color:'var(--m)'}}>XP terkumpul</span>
            <span className="mono" style={{fontSize:12,color:'var(--a)'}}>{stats.pts}/30000</span>
          </div>
          <PBar v={stats.pts} max={30000} color='var(--a)'/>
        </div>
        <button className="btn btn-c" style={{borderRadius:9,padding:'12px 24px'}} onClick={()=>nav('kasus')}>Lanjutkan Investigasi</button>
      </div>:<div>
        <div className="omega-glow glass" style={{borderRadius:14,padding:'18px',marginBottom:14,textAlign:'center'}}>
          <div style={{fontSize:48,marginBottom:10}}>⬡</div>
          <div className="orb" style={{fontSize:20,fontWeight:900,color:'#ff6b00',marginBottom:6}}>NEXUS OMEGA AKTIF</div>
          <div style={{fontSize:13,color:'var(--m)',lineHeight:1.8}}>AI menghasilkan kasus baru secara dinamis berdasarkan profil kognitif Anda. Semakin banyak diselesaikan, semakin kompleks kasusnya.</div>
        </div>
        <button className="btn" style={{width:'100%',borderRadius:10,padding:14,fontSize:14,background:'rgba(255,107,0,.1)',color:'#ff6b00',border:'1px solid rgba(255,107,0,.35)',marginBottom:12,fontFamily:"'Orbitron',monospace",fontWeight:700}} onClick={loadOmega} disabled={loading}>
          {loading?'AI Generating...':'♾️ GENERATE KASUS OMEGA BARU'}
        </button>
        {loading&&<div style={{textAlign:'center',padding:20}}><Think label="OMEGA ENGINE AKTIF"/></div>}
        {omegaCase&&<div className="glass omega-glow fade-up" style={{borderRadius:12,padding:'14px'}}>
          <div className="mono" style={{fontSize:9,color:'#ff6b00',letterSpacing:2,marginBottom:6}}>OMEGA CASE GENERATED</div>
          <div style={{fontWeight:700,fontSize:16,marginBottom:4}}>{omegaCase.title}</div>
          <div style={{fontSize:12,color:'var(--m)',lineHeight:1.7,marginBottom:10}}>{omegaCase.description}</div>
          <div style={{display:'flex',gap:8,marginBottom:12}}>
            <DTag d='OMEGA'/>
            <span className="mono" style={{fontSize:9,color:'#ff6b00'}}>Level {omegaCase.omegaLevel}/10</span>
            <span className="mono" style={{fontSize:9,color:'var(--a)',marginLeft:'auto'}}>+{omegaCase.pointReward} XP</span>
          </div>
          <button className="btn btn-c" style={{width:'100%',borderRadius:8,padding:12}}>▶ Mulai Investigasi OMEGA</button>
        </div>}
      </div>}
    </div>
  </div>
}

// ── ROOT APP ────────────────────────────────────────────────
export default function App(){
  const [screen,setScreen]=useState('dashboard')
  const [selCase,setSelCase]=useState(null)
  const [serverStatus,setServerStatus]=useState(null)
  const [stats,setStats]=useState({
    pts:0, solved:0, total:50,
    solvedCases:[],
    playerId:'nexus_'+Math.random().toString(36).slice(2,9),
    cognitive:{observasi:50,deduksiLogis:50,ketahananBias:50,pengenalanPola:50},
    detectedBiases:[],
  })

  useEffect(()=>{
    api.health().then(d=>setServerStatus(d)).catch(()=>setServerStatus({aiReady:false}))
  },[])

  function nav(s){ setScreen(s); window.scrollTo({top:0,behavior:'smooth'}) }
  function onSolve(caseId,pts){
    setStats(p=>p.solvedCases.includes(caseId)?p:{...p,pts:p.pts+pts,solved:p.solved+1,solvedCases:[...p.solvedCases,caseId]})
  }

  const sp={nav,stats,serverStatus,caseId:selCase,onSolve,playerId:stats.playerId}

  return <>
    <Scan/>
    <div style={{maxWidth:640,margin:'0 auto'}}>
      {screen==='dashboard'&&<Dashboard {...sp}/>}
      {screen==='kasus'&&<FileKasus {...sp} onSelect={setSelCase}/>}
      {screen==='detail'&&<DetailKasus {...sp}/>}
      {screen==='interogasi'&&<Interogasi {...sp}/>}
      {screen==='papan'&&<PapanBukti {...sp}/>}
      {screen==='akademi'&&<Akademi {...sp}/>}
      {screen==='mindreader'&&<MindReader {...sp}/>}
      {screen==='kognitif'&&<PetaKognitif {...sp}/>}
      {screen==='network'&&<JaringanGlobal {...sp}/>}
      {screen==='omega'&&<ModeOmega {...sp}/>}
    </div>
    <BottomNav cur={screen} nav={nav}/>
    <div style={{position:'fixed',bottom:80,right:14,display:'flex',flexDirection:'column',gap:7,zIndex:200}}>
      <button onClick={()=>nav('omega')} style={{width:44,height:44,borderRadius:'50%',border:'1px solid rgba(255,107,0,.35)',background:'rgba(255,107,0,.1)',color:'#ff6b00',cursor:'pointer',fontSize:16,display:'flex',alignItems:'center',justifyContent:'center'}}>♾️</button>
      <button onClick={()=>nav('mindreader')} style={{width:44,height:44,borderRadius:'50%',border:'1px solid rgba(168,85,247,.35)',background:'rgba(168,85,247,.1)',color:'var(--p)',cursor:'pointer',fontSize:16,display:'flex',alignItems:'center',justifyContent:'center'}}>🧠</button>
    </div>
  </>
}
