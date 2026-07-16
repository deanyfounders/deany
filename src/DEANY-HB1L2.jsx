import React, { useState, useRef, useCallback, useEffect } from 'react';
import { CheckCircle, XCircle, ArrowRight, Flame, Star, BookOpen, Clock, Target, Award } from 'lucide-react';

// ================================================================
// TOKENS
// ================================================================
const C = {
  navy:'#0F172A', gold:'#C9972B', goldLight:'#FFF4D8',
  teal:'#0F766E', tealLight:'#E6F7F3', coral:'#C75B4C',
  coralLight:'#FCEBE7', green:'#2F855A', greenLight:'#E8F6EE',
  orange:'#D97706', orangeLight:'#FFF3E1', purple:'#6D4CC2',
  sand:'#E8D7B0', sandLight:'#F8F0DC',
  dark:'#263142', mid:'#64748B', light:'#EEE6D4',
  cream:'#F8F5EC', ivory:'#FFFDF7', pearl:'#FDFBF6', border:'#E8DFC9',
};
const STYLES = `
  @keyframes slideUp  { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
  @keyframes fadeIn   { from{opacity:0} to{opacity:1} }
  @keyframes shake    { 0%,100%{transform:translateX(0)} 20%{transform:translateX(-7px)} 60%{transform:translateX(7px)} }
  @keyframes pop      { 0%{transform:scale(0.5);opacity:0} 70%{transform:scale(1.15)} 100%{transform:scale(1);opacity:1} }
  @keyframes fall     { 0%{transform:translateY(-20px) rotate(0deg);opacity:1} 100%{transform:translateY(110vh) rotate(720deg);opacity:0} }
  @keyframes pulse    { 0%,100%{opacity:0.55} 50%{opacity:1} }
  @keyframes focusRing{ 0%{opacity:0;transform:scale(0.98)} 100%{opacity:1;transform:scale(1)} }
  @keyframes escapeIn { from{opacity:0;transform:translateY(-6px) scale(0.92)} to{opacity:1;transform:translateY(0) scale(1)} }
  @keyframes drawLine { from{stroke-dashoffset:900} to{stroke-dashoffset:0} }
  @keyframes nodeIn   { from{opacity:0;transform:scale(0.4)} to{opacity:1;transform:scale(1)} }
  .su        { animation: slideUp   0.32s ease-out both }
  .fi        { animation: fadeIn    0.22s ease-out both }
  .shk       { animation: shake     0.28s ease both }
  .pop       { animation: pop       0.36s cubic-bezier(.17,.67,.35,1.3) both }
  .pls       { animation: pulse     1.6s ease-in-out infinite }
  .focus-ring{ animation: focusRing 0.35s cubic-bezier(.4,0,.2,1) both }
  .escape-in { animation: escapeIn  0.28s cubic-bezier(.4,0,.2,1) both }
  .draw-line { animation: drawLine  1.2s cubic-bezier(.4,0,.2,1) forwards }
  .node-in   { animation: nodeIn    0.4s cubic-bezier(.34,1.56,.64,1) both }
  @keyframes flowDash { to { stroke-dashoffset: -24 } }
  .flow-dash { animation: flowDash 2.4s linear infinite }
  @keyframes routeIn  { from{opacity:0} to{opacity:1} }
  .route-in  { animation: routeIn   0.6s ease-out both }
  @keyframes dqShake { 0%,100%{transform:translateX(0)} 20%{transform:translateX(-7px)} 40%{transform:translateX(6px)} 60%{transform:translateX(-4px)} 80%{transform:translateX(3px)} }
  .dq-shk { animation: dqShake 0.34s ease-in-out }
  @keyframes dqStar { 0%{transform:scale(0) rotate(0deg);opacity:0} 35%{transform:scale(1.25) rotate(20deg);opacity:1} 100%{transform:scale(0.6) rotate(45deg);opacity:0} }
  @media (prefers-reduced-motion: reduce){ .dq-shk{animation:none} .shk{animation:none} }

  @import url('https://fonts.googleapis.com/css2?family=Amiri:ital@0;1&display=swap');
  @font-face {
    font-family: 'AmiriArabic';
    src: url('https://fonts.gstatic.com/s/amiri/v27/J7aRnpd8CGxBHqUpvrIw74NL.woff2') format('woff2'),
         local('Amiri');
    unicode-range: U+0600-06FF, U+0750-077F, U+FB50-FDFF, U+FE70-FEFF;
  }
  /* Apply Amiri to all Arabic characters inline */
  :lang(ar), [dir="rtl"], .swt, .honorific { font-family: 'Amiri', 'AmiriArabic', serif !important; }
  /* Auto-apply calligraphic font to all Arabic unicode characters */
  * { font-family: inherit; }
  .swt {
    font-family: 'Amiri', 'AmiriArabic', serif;
    font-size: 1.08em;
    letter-spacing: 0;
    display: inline;
  }
`;
function rgba(hex,a=1){
  const r=parseInt(hex.slice(1,3),16),g=parseInt(hex.slice(3,5),16),b=parseInt(hex.slice(5,7),16);
  return `rgba(${r},${g},${b},${a})`;
}
function md(text){
  const SWT = 'سُبْحَانَهُ وَتَعَالَى';
  const SAW = 'صَلَّى اللَّٰهُ عَلَيْهِ وَسَلَّمَ';
  const AS  = 'عَلَيْهِ السَّلَام';
  const SWT_re = SWT.replace(/[.*+?^${}()|[\\]\\]/g,'\\$&');
  const SAW_re = SAW.replace(/[.*+?^${}()|[\\]\\]/g,'\\$&');
  const AS_re  = AS.replace(/[.*+?^${}()|[\\]\\]/g,'\\$&');
  const parts = text.split(new RegExp('(' + SWT_re + '|' + SAW_re + '|' + AS_re + '|\\*\\*[^*]+\\*\\*)', 'g'));
  return parts.map((p,i)=>{
    if(p===SWT) return <span key={i} className="swt">{SWT}</span>;
    if(p===SAW) return <span key={i} className="honorific">{SAW}</span>;
    if(p===AS)  return <span key={i} className="honorific">{AS}</span>;
    if(p.startsWith('**')&&p.endsWith('**')) return <strong key={i} style={{color:C.navy}}>{p.slice(2,-2)}</strong>;
    return <React.Fragment key={i}>{p}</React.Fragment>;
  });
}
const PAGE_BG = {
  background:'radial-gradient(circle at 50% -10%, rgba(15,118,110,0.16), transparent 34%), radial-gradient(circle at 86% 12%, rgba(201,151,43,0.14), transparent 24%), linear-gradient(180deg,#F8F5EC 0%,#FDFBF6 48%,#F7FBF8 100%)'
};
const CARD    = {
  background:'rgba(255,255,255,0.84)',
  backdropFilter:'blur(22px)',
  border:`1px solid ${rgba(C.border,0.78)}`,
  boxShadow:`0 28px 80px ${rgba(C.navy,0.10)}`
};

// ================================================================
// INTERACTION ENGINE (combined question UI spec)
// ================================================================
const MT = { press:120, selectColor:120, correctFlashHold:300, wrongShake:340,
  fadeToDone:250, sheetSlide:300, progressSpring:400, matchSeal:550,
  tileFlight:250, correctRevealDelay:380 };

const EDGE      = '#D9CFB6';
const TEAL_EDGE = '#0B5049';
const GOLD_EDGE = '#9A7420';
const GREEN_EDGE= '#1F5C3D';
const CORAL_EDGE= '#9E3F31';

const reducedMotion = () => typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

let _sndCtx = null; let _lastTone = 0;
function _audio(){
  if (typeof window === 'undefined') return null;
  if (!_sndCtx){ try { _sndCtx = new (window.AudioContext || window.webkitAudioContext)(); } catch(e){ _sndCtx = null; } }
  if (_sndCtx && _sndCtx.state === 'suspended') _sndCtx.resume();
  return _sndCtx;
}
function _tone(f, d, g, t){
  const c = _audio(); if (!c) return;
  const now = Date.now(); if (now - _lastTone < 30) return; _lastTone = now;
  const o = c.createOscillator(), gn = c.createGain();
  o.type = t || 'sine'; o.frequency.value = f;
  gn.gain.setValueAtTime(g, c.currentTime);
  gn.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + d);
  o.connect(gn); gn.connect(c.destination);
  o.start(); o.stop(c.currentTime + d + 0.02);
}
const snd = {
  tick: () => _tone(1800, 0.03, 0.05),
  pop:  () => _tone(1100, 0.05, 0.05),
  blip: () => { _tone(880, 0.07, 0.06); setTimeout(() => _tone(1320, 0.09, 0.06), 70); },
  buzz: () => _tone(150, 0.09, 0.05, 'square'),
  fanfare: () => [660, 880, 1100, 1320].forEach((f, i) => setTimeout(() => _tone(f, 0.12, 0.05), i * 90)),
};
// haptics: works on Android Chrome; iOS Safari/PWA has NO web vibration API,
// this no-ops there. Capacitor Haptics drops in behind this signature later.
function haptic(ms){ if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(ms); }

function StarSeal({x, y}){
  if (reducedMotion()) return null;
  return (
    <div style={{position:'absolute', left:x-15, top:y-15, width:30, height:30, pointerEvents:'none', zIndex:6, animation:`dqStar ${MT.matchSeal}ms ease-out both`}}>
      <svg width="30" height="30" viewBox="0 0 30 30" aria-hidden="true">
        <path d="M15 2 L18 12 L28 15 L18 18 L15 28 L12 18 L2 15 L12 12 Z" fill={C.gold}/>
      </svg>
    </div>
  );
}
function useStars(){
  const [stars, setStars] = useState([]);
  const spawn = useCallback((x, y) => {
    const id = Math.random().toString(36).slice(2);
    setStars(s => [...s, {id, x, y}]);
    setTimeout(() => setStars(s => s.filter(st => st.id !== id)), MT.matchSeal + 80);
  }, []);
  return [stars, spawn];
}

function chunky(state, extra){
  const base = {
    background:'white', border:`2px solid ${C.border}`, borderBottomWidth:4,
    borderBottomColor:EDGE, borderRadius:14, color:C.dark, cursor:'pointer',
    userSelect:'none', WebkitUserSelect:'none', touchAction:'manipulation',
    transition:`background ${MT.selectColor}ms, border-color ${MT.selectColor}ms, color ${MT.selectColor}ms, opacity ${MT.fadeToDone}ms, transform ${MT.press}ms`,
  };
  const states = {
    idle: {},
    sel:  { background:C.tealLight, borderColor:C.teal, borderBottomColor:TEAL_EDGE, color:C.teal },
    gsel: { background:C.goldLight, borderColor:C.gold, borderBottomColor:GOLD_EDGE, color:C.navy },
    good: { background:C.greenLight, borderColor:C.green, borderBottomColor:GREEN_EDGE, color:C.green, transform:'scale(1.03)' },
    bad:  { background:C.coralLight, borderColor:C.coral, borderBottomColor:CORAL_EDGE, color:C.coral },
    done: { opacity:0.4, borderColor:rgba(C.border,0.6), borderBottomColor:rgba(C.border,0.6), color:C.mid, pointerEvents:'none' },
    dim:  { opacity:0.45, pointerEvents:'none' },
  };
  return { ...base, ...(states[state] || {}), ...(extra || {}) };
}

function ChunkyBtn({label, onClick, enabled = true, fill = C.teal, edge = TEAL_EDGE, ink = 'white', className = ''}){
  const [down, setDown] = useState(false);
  return (
    <div role="button" tabIndex={enabled ? 0 : -1} aria-disabled={!enabled}
      onClick={enabled ? onClick : undefined}
      onPointerDown={() => enabled && setDown(true)}
      onPointerUp={() => setDown(false)} onPointerLeave={() => setDown(false)}
      className={className}
      style={{
        background: enabled ? fill : C.light, color: enabled ? ink : '#bbb',
        borderBottom: `${down ? 2 : 4}px solid ${enabled ? edge : rgba(C.border,0.9)}`,
        transform: down ? 'translateY(2px)' : 'none',
        borderRadius:14, textAlign:'center', fontSize:14, fontWeight:700,
        padding:'13px 0 11px', cursor: enabled ? 'pointer' : 'not-allowed',
        userSelect:'none', touchAction:'manipulation', width:'100%',
        transition:`background 150ms, color 150ms, transform ${MT.press}ms`,
      }}>
      {label}
    </div>
  );
}


// ================================================================
// SHARED UI
// ================================================================
function IslamicBg(){
  return(
    <svg className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden="true">
      <defs>
        <radialGradient id="deanyGlow" cx="50%" cy="0%" r="70%">
          <stop offset="0%" stopColor={C.teal} stopOpacity="0.10"/>
          <stop offset="55%" stopColor={C.gold} stopOpacity="0.035"/>
          <stop offset="100%" stopColor="white" stopOpacity="0"/>
        </radialGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#deanyGlow)"/>
    </svg>
  );
}
function Confetti(){
  const items=useRef(Array.from({length:40},(_,i)=>({
    id:i,left:`${Math.random()*100}%`,size:12+Math.random()*12,
    dur:2+Math.random()*2.5,delay:Math.random()*1,
    icon:['✦','✧','☆','🌟','✨','⭐','💫','🏆'][i%8],
  })));
  return(
    <div className="fixed inset-0 pointer-events-none" style={{zIndex:200}}>
      {items.current.map(p=>(
        <div key={p.id} className="absolute" style={{left:p.left,top:'-20px',fontSize:p.size,animation:`fall ${p.dur}s ease-out ${p.delay}s both`}}>{p.icon}</div>
      ))}
    </div>
  );
}
function ProgressBar({qNum,totalQ,score}){
  const pct=Math.min((qNum/totalQ)*100,100);
  return(
    <div className="mb-6">
      <div className="flex justify-between items-center mb-1.5">
        <span className="text-xs font-semibold" style={{color:C.mid}}>Question {Math.min(qNum+1,totalQ)} of {totalQ}</span>
        <div className="flex items-center gap-1.5">
          <Star className="w-3.5 h-3.5" style={{color:C.gold}} fill={C.gold}/>
          <span className="text-xs font-bold" style={{color:C.navy}}>{score} pts</span>
        </div>
      </div>
      <div className="h-2 rounded-full overflow-hidden" style={{background:C.light}}>
        <div className="h-full rounded-full" style={{width:`${pct}%`,background:`linear-gradient(90deg,${C.gold},${C.orange})`,transition:`width ${MT.progressSpring}ms cubic-bezier(0.34,1.4,0.64,1)`}}/>
      </div>
    </div>
  );
}
function ModeBadge({mode,type,unscored}){
  const cfg={THINK:{bg:rgba(C.purple,0.1),color:C.purple,icon:'🧠'},PLAY:{bg:rgba(C.teal,0.1),color:C.teal,icon:'🎮'},SORT:{bg:rgba(C.orange,0.1),color:C.orange,icon:'📦'}};
  const m=cfg[mode]||cfg.THINK;
  return(
    <div className="flex items-center gap-2 mb-4 flex-wrap">
      <span className="text-xs font-bold px-3 py-1 rounded-full" style={{background:m.bg,color:m.color}}>{m.icon} {mode}</span>
      <span className="text-xs px-2.5 py-1 rounded-full font-medium" style={{background:rgba(C.navy,0.06),color:C.mid}}>{type}</span>
      {unscored&&<span className="text-xs px-2.5 py-1 rounded-full font-bold" style={{background:rgba(C.gold,0.15),color:C.gold}}>Not scored</span>}
    </div>
  );
}
function FeedbackPanel({correct,text,bridge,meta,reflection}){
  const sc=meta?(meta.ok===meta.total?C.green:meta.ok>=Math.ceil(meta.total*0.6)?C.gold:C.coral):correct?C.green:C.coral;
  const bg=reflection?C.tealLight:correct?C.greenLight:C.coralLight;
  const bc=reflection?C.teal:correct?C.green:C.coral;
  return(
    <div className="mt-4 rounded-xl p-5 border-2 su" style={{background:bg,borderColor:bc}}>
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-0.5">
          {reflection?<span className="text-lg">💙</span>:correct?<CheckCircle className="w-5 h-5" style={{color:C.green}}/>:<XCircle className="w-5 h-5" style={{color:C.coral}}/>}
        </div>
        <div className="flex-1">
          {meta?(
            <div className="flex items-baseline gap-2 mb-1 flex-wrap">
              <span className="text-xl font-black" style={{color:sc,fontFamily:'Georgia,serif'}}>{meta.ok}/{meta.total}</span>
              <span className="text-sm font-bold" style={{color:sc}}>correct</span>
              <span className="text-xs px-2 py-0.5 rounded-full font-bold" style={{background:meta.ok===meta.total?C.green:meta.ok>=Math.ceil(meta.total*0.6)?C.gold:C.coral,color:'white'}}>
                {meta.ok===meta.total?'Perfect':meta.ok>=Math.ceil(meta.total*0.6)?'Almost':'Keep going'}
              </span>
            </div>
          ):(
            <div className="text-sm font-bold mb-1" style={{color:reflection?C.teal:correct?C.green:C.coral}}>
              {reflection?'Thank you for reflecting.':correct?'Correct':'Not quite'}
            </div>
          )}
          <div className="text-sm leading-relaxed" style={{color:C.dark}}>{md(text)}</div>
          {bridge&&correct&&(
            <div className="mt-3 pt-3 border-t flex items-start gap-2" style={{borderColor:rgba(bc,0.28)}}>
              <ArrowRight className="w-4 h-4 mt-0.5 flex-shrink-0" style={{color:C.teal}}/>
              <span className="text-xs italic" style={{color:C.teal}}>{md(bridge)}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
function QuranCard({arabic,translation,ref_text,note}){
  return(
    <div className="rounded-xl overflow-hidden mb-5 border" style={{borderColor:rgba(C.gold,0.3)}}>
      <div className="px-4 py-2.5 flex items-center gap-2" style={{background:`linear-gradient(135deg,${C.navy},#2a3f6a)`}}>
        <span style={{fontSize:14}}>📖</span>
        <span className="text-xs font-bold tracking-wide" style={{color:rgba(C.gold,0.9)}}>{ref_text}</span>
      </div>
      <div className="px-5 py-4 text-right border-b" style={{background:`linear-gradient(135deg,${C.navy},#1e3460)`,borderColor:rgba(C.gold,0.15)}}>
        <p style={{color:C.gold,fontFamily:'serif',direction:'rtl',lineHeight:'2.2',fontSize:15,fontWeight:500}}>{arabic}</p>
      </div>
      <div className="px-4 py-4" style={{background:C.goldLight}}>
        <p className="text-sm italic leading-relaxed mb-2" style={{color:C.navy,fontFamily:'Georgia,serif'}}>{translation}</p>
        {note&&<div className="pt-2 border-t text-xs leading-relaxed" style={{borderColor:rgba(C.gold,0.25),color:C.dark}}>{note}</div>}
      </div>
    </div>
  );
}

const ARABIA_REFERENCE_MAP = 'data:image/webp;base64,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';

// ================================================================
// ARABIA DIAGRAM  -  Section A
// Routes are drawn as twin parallel dotted lines with an open
// middle, so the historical map underneath stays fully readable.
// Gold pair: Yemen to Syria. Teal pair: Persian Gulf to Red Sea.
// A single smooth camera pans and zooms to each step's region.
// ================================================================
function ArabiaDiagram({onActivate}){
  const [step,setStep]=useState(0);
  const [cam,setCam]=useState({scale:1,ox:50,oy:33.35});
  const activated=useRef(false);
  const fire=()=>{ if(!activated.current){activated.current=true;onActivate&&onActivate();} };
  const DOTS=[0,1,2,3];
  const VIEW_W=100;
  const VIEW_H=66.7;

  // Coordinates are percentage-based against the antique map itself.
  const pts = {
    makkah:   {x:31.9, y:51.3},
    yathrib:  {x:30.8, y:42.6},
    yemen:    {x:36.8, y:60.6},
    syria:    {x:28.8, y:29.4},
    gulf:     {x:51.5, y:41.6},
    redSea:   {x:26.2, y:51.2},
    aila:     {x:23.9, y:36.5},
  };

  // Camera targets - focus point and zoom level per step.
  const CAMERAS=[
    {scale:1.35, ox:29.5, oy:45.5},   // 0: the Hijaz corridor
    {scale:1.45, ox:32.0, oy:45.0},   // 1: the north-south route
    {scale:1.42, ox:38.5, oy:47.0},   // 2: the east-west route
    {scale:1.90, ox:31.9, oy:51.3},   // 3: Makkah, the crossing point
  ];

  useEffect(()=>{
    setCam(CAMERAS[step]);
  },[step]);

  // One smooth pan-and-zoom: translate + scale in a single
  // transition, clamped so the map never shows past its edges.
  const camTransform=(c)=>{
    const s=c.scale;
    const fx=c.ox;
    const fy=(c.oy/VIEW_H)*100;
    const minT=100*(1-s);
    const tx=Math.min(0,Math.max(minT,50-fx*s));
    const ty=Math.min(0,Math.max(minT,50-fy*s));
    return `translate(${tx}%, ${ty}%) scale(${s})`;
  };

  const hijazCorridor = `M ${pts.aila.x} ${pts.aila.y} C 27.6 39.2, ${pts.yathrib.x-0.3} ${pts.yathrib.y-0.3}, ${pts.yathrib.x} ${pts.yathrib.y} C ${pts.yathrib.x+0.5} 45.7, ${pts.makkah.x-0.4} 48.5, ${pts.makkah.x} ${pts.makkah.y} C 32.7 55.2, 34.2 58.2, ${pts.yemen.x-1.2} ${pts.yemen.y-0.6}`;
  const northSouthRoute = `M ${pts.yemen.x} ${pts.yemen.y} C 34.7 58.4, 32.9 55.2, ${pts.makkah.x} ${pts.makkah.y} C 31.0 48.5, 30.5 45.2, ${pts.yathrib.x} ${pts.yathrib.y} C 29.8 38.6, 26.4 33.4, ${pts.syria.x} ${pts.syria.y}`;
  const eastWestRoute = `M ${pts.gulf.x} ${pts.gulf.y} C 47.5 43.4, 42.0 47.5, 37.5 49.6 C 34.9 50.8, 33.0 51.3, ${pts.makkah.x} ${pts.makkah.y} C 30.0 51.4, 28.1 51.3, ${pts.redSea.x} ${pts.redSea.y}`;

  // Twin parallel dotted lines with nothing in the middle.
  // dx/dy is the perpendicular offset of each rail from the
  // centerline. Each dot sits on a white under-dot so it stays
  // crisp against the busy map, and both layers animate together
  // so the dots drift toward the destination.
  const DottedPair=({d,color,dx=0,dy=0})=>(
    <g>
      {[[-dx,-dy],[dx,dy]].map(([ox,oy],k)=>(
        <g key={k} transform={`translate(${ox} ${oy})`}>
          <path d={d} fill="none" stroke="rgba(255,255,255,0.92)" strokeWidth="0.64" strokeLinecap="round" strokeDasharray="0.05 1.15" className="flow-dash"/>
          <path d={d} fill="none" stroke={color} strokeWidth="0.34" strokeLinecap="round" strokeDasharray="0.05 1.15" className="flow-dash"/>
        </g>
      ))}
    </g>
  );

  // Invisible centerline that only carries the arrowhead marker.
  const ArrowCap=({d,markerId,color})=>(
    <path d={d} fill="none" stroke={color} strokeOpacity="0.01" strokeWidth="0.01" markerEnd={`url(#${markerId})`}/>
  );

  // Small pill that names the cargo moving along a route.
  const CargoTag=({x,y,w,label,color})=>(
    <g className="node-in">
      <rect x={x} y={y} width={w} height="3.0" rx="1.5" fill="rgba(255,255,255,0.90)" stroke={rgba(color,0.45)} strokeWidth="0.14"/>
      <text x={x+w/2} y={y+2.05} textAnchor="middle" fontSize="1.0" fontWeight="850" fill={color} fontFamily="system-ui,sans-serif">{label}</text>
    </g>
  );

  const CityPin=({p,primary=false,label,dx=1,dy=-1})=>(
    <g className="node-in">
      <circle cx={p.x} cy={p.y} r={primary?0.78:0.55} fill={primary?C.gold:C.navy} stroke="rgba(255,255,255,0.95)" strokeWidth="0.2"/>
      <text x={p.x+dx} y={p.y+dy} fontSize={primary?1.2:1.06} fontWeight="850" fill={primary?C.gold:rgba(C.navy,0.70)} fontFamily="system-ui,sans-serif" paintOrder="stroke" stroke="rgba(255,255,255,0.88)" strokeWidth="0.42" strokeLinejoin="round">
        {label}
      </text>
    </g>
  );

  const RouteEndpoint=({p,label,color,align='start',dy=-1})=>(
    <g className="node-in">
      <circle cx={p.x} cy={p.y} r="0.5" fill={color} stroke="rgba(255,255,255,0.95)" strokeWidth="0.18"/>
      <text x={p.x+(align==='end'?-1.0:1.0)} y={p.y+dy} textAnchor={align} fontSize="1.06" fontWeight="850" fill={color} fontFamily="system-ui,sans-serif" paintOrder="stroke" stroke="rgba(255,255,255,0.90)" strokeWidth="0.34" strokeLinejoin="round">
        {label}
      </text>
    </g>
  );

  return(
    <div style={{borderRadius:24,overflow:'hidden',marginBottom:22,border:`1px solid ${rgba(C.border,0.95)}`,boxShadow:`0 24px 70px ${rgba(C.navy,0.10)}`,background:'white'}}>
      <div style={{background:`linear-gradient(145deg,${rgba(C.teal,0.08)},${rgba(C.gold,0.08)} 55%,${rgba(C.navy,0.04)})`,position:'relative'}}>
        <div style={{position:'absolute',top:14,right:16,display:'flex',gap:7,zIndex:3,padding:'7px 9px',borderRadius:999,background:'rgba(255,255,255,0.70)',border:`1px solid ${rgba(C.border,0.8)}`,backdropFilter:'blur(10px)'}}>
          {DOTS.map(d=>(
            <div key={d} style={{width:d===step?22:7,height:7,borderRadius:999,background:d<step?rgba(C.gold,0.55):d===step?C.gold:rgba(C.navy,0.14),transition:'all 0.4s cubic-bezier(.4,0,.2,1)'}}/>
          ))}
        </div>

        <div style={{position:'relative',width:'100%',aspectRatio:'1535 / 1024',overflow:'hidden'}}>
          <div style={{position:'absolute',inset:0,transform:camTransform(cam),transformOrigin:'0 0',transition:'transform 1.05s cubic-bezier(.3,0,.2,1)'}}>
            <img
              src={ARABIA_REFERENCE_MAP}
              alt="Historical map of Arabia and the surrounding regions"
              style={{position:'absolute',inset:0,width:'100%',height:'100%',objectFit:'cover',display:'block'}}
            />

            <svg viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} preserveAspectRatio="none" style={{position:'absolute',inset:0,width:'100%',height:'100%',display:'block'}}>
              <defs>
                <marker id="arrowGold" viewBox="0 0 12 12" refX="9" refY="6" markerWidth="3.2" markerHeight="3.2" markerUnits="userSpaceOnUse" orient="auto-start-reverse">
                  <path d="M 1.5 1.5 L 10.5 6 L 1.5 10.5 z" fill={C.gold} stroke="rgba(255,255,255,0.9)" strokeWidth="1.1" strokeLinejoin="round"/>
                </marker>
                <marker id="arrowTeal" viewBox="0 0 12 12" refX="9" refY="6" markerWidth="3.2" markerHeight="3.2" markerUnits="userSpaceOnUse" orient="auto-start-reverse">
                  <path d="M 1.5 1.5 L 10.5 6 L 1.5 10.5 z" fill={C.teal} stroke="rgba(255,255,255,0.9)" strokeWidth="1.1" strokeLinejoin="round"/>
                </marker>
              </defs>

              {step===0&&(
                <g className="route-in">
                  <DottedPair d={hijazCorridor} color={C.teal} dx={1.7} dy={0}/>
                  <g className="node-in">
                    <rect x="18.2" y="31.2" width="15.7" height="4.4" rx="1.8" fill="rgba(255,255,255,0.78)" stroke={rgba(C.teal,0.38)} strokeWidth="0.14"/>
                    <path d="M 30.3 35.6 L 30.8 40.4" fill="none" stroke={rgba(C.teal,0.48)} strokeWidth="0.16"/>
                    <text x="20.1" y="34.1" fontSize="1.16" fontWeight="900" fill={C.teal} fontFamily="system-ui,sans-serif">Hijaz corridor</text>
                  </g>
                </g>
              )}

              {step>=1&&(
                <g className="route-in">
                  <DottedPair d={northSouthRoute} color={C.gold} dx={0.9} dy={0}/>
                  <ArrowCap d={northSouthRoute} markerId="arrowGold" color={C.gold}/>
                  <RouteEndpoint p={pts.yemen} label="Yemen" color={C.gold} dy="-1.0"/>
                  <RouteEndpoint p={pts.syria} label="Syria" color={C.gold} dy="-1.0"/>
                  <CargoTag x={15.6} y={43.9} w={14.2} label="incense · gold · spices" color={C.gold}/>
                </g>
              )}

              {step>=2&&(
                <g className="route-in" style={{animationDelay:'0.1s'}}>
                  <DottedPair d={eastWestRoute} color={C.teal} dx={0} dy={0.9}/>
                  <ArrowCap d={eastWestRoute} markerId="arrowTeal" color={C.teal}/>
                  <RouteEndpoint p={pts.gulf} label="Persian Gulf" color={C.teal} dy="-1.1"/>
                  <RouteEndpoint p={pts.redSea} label="Red Sea port" color={C.teal} align="end" dy="-1.1"/>
                  <CargoTag x={38.6} y={53.4} w={12.0} label="silk · Indian goods" color={C.teal}/>
                </g>
              )}

              <CityPin p={pts.makkah} primary={step>=3} label="Makkah" dx="1.0" dy="-1.0"/>
              <CityPin p={pts.yathrib} label="Yathrib" dx="0.9" dy="0.4"/>

              {step>=3&&(
                <>
                  <g className="node-in">
                    <rect x="34.4" y="53.2" width="10.2" height="3.3" rx="1.65" fill="rgba(15,23,42,0.78)" stroke="rgba(255,255,255,0.45)" strokeWidth="0.12"/>
                    <text x="35.7" y="55.45" fontSize="0.92" fontWeight="900" fill="#ffffff" fontFamily="system-ui,sans-serif">crossroads</text>
                  </g>
                </>
              )}
            </svg>
          </div>
        </div>
      </div>

      <div style={{background:'rgba(255,255,255,0.94)',borderTop:`1px solid ${rgba(C.border,0.9)}`}}>
        {step===0&&(
          <div style={{padding:'24px 26px'}} className="su">
            <div style={{fontSize:10,fontWeight:800,letterSpacing:'0.14em',textTransform:'uppercase',color:C.mid,marginBottom:9}}>
              01 - the land
            </div>
            <div style={{fontSize:19,fontWeight:800,color:C.navy,fontFamily:'Georgia,serif',lineHeight:1.32,marginBottom:11}}>
              The Arabian Peninsula  -  vast, dry, and at the centre of the ancient world.
            </div>
            <p style={{fontSize:13.5,color:C.mid,lineHeight:1.75,marginBottom:22}}>
              Roughly the size of Western Europe. The Hijaz is the thin western coastal strip  -  home to Makkah and Yathrib (the city later known as Madinah). The Najd is the dry interior. Yemen in the south was the most fertile corner.
            </p>
            <button onClick={()=>{setStep(1);fire();}}
              style={{width:'100%',padding:'14px 0',borderRadius:14,fontSize:13,fontWeight:800,background:`linear-gradient(135deg,${C.navy},${C.teal})`,color:'white',border:'none',cursor:'pointer',boxShadow:`0 14px 32px ${rgba(C.navy,0.18)}`}}>
              See the north-south trade route →
            </button>
          </div>
        )}

        {step===1&&(
          <div style={{padding:'24px 26px'}} className="su">
            <div style={{fontSize:10,fontWeight:800,letterSpacing:'0.14em',textTransform:'uppercase',color:C.gold,marginBottom:9}}>
              02 - the gold route
            </div>
            <div style={{fontSize:19,fontWeight:800,color:C.navy,fontFamily:'Georgia,serif',lineHeight:1.32,marginBottom:11}}>
              From Yemen to Syria  -  the great incense route.
            </div>
            <p style={{fontSize:13.5,color:C.mid,lineHeight:1.75,marginBottom:22}}>
              Every year, caravans loaded with frankincense, myrrh, gold, and spices made the long journey north. This single route made the Hijaz indispensable. Whoever controlled it controlled the wealth of Arabia.
            </p>
            <button onClick={()=>setStep(2)}
              style={{width:'100%',padding:'14px 0',borderRadius:14,fontSize:13,fontWeight:800,background:rgba(C.teal,0.1),color:C.teal,border:`1.5px solid ${rgba(C.teal,0.3)}`,cursor:'pointer',boxShadow:`0 12px 24px ${rgba(C.teal,0.08)}`}}>
              See the east-west route →
            </button>
          </div>
        )}

        {step===2&&(
          <div style={{padding:'24px 26px'}} className="su">
            <div style={{fontSize:10,fontWeight:800,letterSpacing:'0.14em',textTransform:'uppercase',color:C.teal,marginBottom:9}}>
              03 - the teal route
            </div>
            <div style={{fontSize:19,fontWeight:800,color:C.navy,fontFamily:'Georgia,serif',lineHeight:1.32,marginBottom:11}}>
              Persian Gulf to the Red Sea  -  the route from the east.
            </div>
            <p style={{fontSize:13.5,color:C.mid,lineHeight:1.75,marginBottom:22}}>
              Goods from India and Persia entered Arabia through the Gulf. They crossed the peninsula toward the Red Sea ports  -  and through them, into Egypt and the Byzantine world. Two great routes. They crossed at one point.
            </p>
            <button onClick={()=>setStep(3)}
              style={{width:'100%',padding:'14px 0',borderRadius:14,fontSize:13,fontWeight:800,background:`linear-gradient(135deg,${C.navy},${C.teal})`,color:'white',border:'none',cursor:'pointer',boxShadow:`0 14px 32px ${rgba(C.navy,0.18)}`}}>
              See where they meet →
            </button>
          </div>
        )}

        {step===3&&(
          <div style={{padding:'24px 26px'}} className="su">
            <div style={{fontSize:10,fontWeight:800,letterSpacing:'0.14em',textTransform:'uppercase',color:C.mid,marginBottom:9}}>
              04 - the point
            </div>
            <div style={{fontSize:19,fontWeight:800,color:C.navy,fontFamily:'Georgia,serif',lineHeight:1.32,marginBottom:15}}>
              Makkah sat at the exact crossing point. That was not a coincidence.
            </div>
            <div style={{padding:'16px 18px',borderRadius:16,background:`linear-gradient(135deg,${C.navy},#172554)`,marginBottom:16,boxShadow:`0 16px 36px ${rgba(C.navy,0.18)}`}}>
              <p style={{fontSize:13.5,fontWeight:800,color:'white',fontFamily:'Georgia,serif',lineHeight:1.58,margin:0,textAlign:'center'}}>
                Every caravan passed near Makkah.<br/>
                <span style={{color:C.gold}}>The Quraysh controlled the crossroads.</span>
              </p>
            </div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
              <div style={{padding:'14px',borderRadius:16,background:rgba(C.goldLight,0.72),border:`1px solid ${rgba(C.gold,0.22)}`}}>
                <div style={{fontSize:9,fontWeight:800,textTransform:'uppercase',letterSpacing:'0.08em',color:C.gold,marginBottom:6}}>North-South</div>
                <p style={{fontSize:11.5,color:C.dark,lineHeight:1.6,margin:0}}>Yemen spices and incense to Syria and the Byzantine Empire.</p>
              </div>
              <div style={{padding:'14px',borderRadius:16,background:rgba(C.tealLight,0.58),border:`1px solid ${rgba(C.teal,0.18)}`}}>
                <div style={{fontSize:9,fontWeight:800,textTransform:'uppercase',letterSpacing:'0.08em',color:C.teal,marginBottom:6}}>East-West</div>
                <p style={{fontSize:11.5,color:C.dark,lineHeight:1.6,margin:0}}>Indian and Persian goods to Red Sea ports and Africa.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ================================================================
// TRIBAL DIAGRAM  -  Section B
// Three interlocking principles of the tribal code, presented as
// calligraphic medallions on a triangle. Tap each to open it.
// Visited medallions are marked; once all three are explored the
// triangle completes. All principle text is unchanged.
// ================================================================
function TribalDiagram({onActivate}){
  const [selected,setSelected]=useState(null);
  const [visited,setVisited]=useState([false,false,false]);
  const activated=useRef(false);
  const tap=(i)=>{
    setSelected(i===selected?null:i);
    setVisited(v=>{ if(v[i])return v; const n=[...v]; n[i]=true; return n; });
    if(!activated.current){activated.current=true;onActivate&&onActivate();}
  };

  const W=320,H=196,CX=160,CY=92;

  const PRINCIPLES=[
    {
      id:0, name:'Asabiyyah', arabic:'عصبية', x:82, y:64, color:C.teal,
      english:'Group Loyalty',
      desc:'You defended your tribe regardless of right or wrong. The tribe\'s honour was your honour. Its enemies were your enemies. Identity was entirely collective.',
      example:'A Bedouin poet would boast of his tribe the way a modern person might speak of their nation.',
    },
    {
      id:1, name:'Muruah', arabic:'مروءة', x:238, y:64, color:C.orange,
      english:'Honour Code',
      desc:'Generosity, courage, and hospitality were the highest virtues. A man\'s reputation for these was everything. To be called stingy or cowardly was the deepest insult.',
      example:'Hosting a stranger lavishly, even at personal cost, was not kindness  -  it was obligation. To refuse was disgrace.',
    },
    {
      id:2, name:"Tha'r", arabic:'ثأر', x:160, y:152, color:C.coral,
      english:'Blood Vengeance',
      desc:'Injury to one tribe member required revenge on the offending tribe. This was a moral obligation, not a choice. It kept the peace through deterrence  -  but could trap tribes in cycles of violence for generations.',
      example:'A single killing could ignite a blood feud lasting decades, with each side obligated to avenge the last death.',
    },
  ];

  const sel = selected!==null ? PRINCIPLES[selected] : null;
  const allVisited = visited.every(Boolean);
  const visitedCount = visited.filter(Boolean).length;
  const EDGES=[[0,1],[1,2],[0,2]];

  return(
    <div style={{borderRadius:24,overflow:'hidden',marginBottom:22,border:`1px solid ${rgba(C.border,0.95)}`,boxShadow:`0 24px 70px ${rgba(C.navy,0.10)}`,background:'white'}}>
      {/* STAGE */}
      <div style={{background:`linear-gradient(155deg,${C.ivory},${C.pearl} 45%,${rgba(C.sand,0.24)})`,position:'relative'}}>
        <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{display:'block'}}>
          <defs>
            <radialGradient id="tribalGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={rgba(C.gold,0.10)}/>
              <stop offset="100%" stopColor={rgba(C.gold,0)}/>
            </radialGradient>
          </defs>

          {/* Soft centre wash + faint eight-point star backdrop */}
          <circle cx={CX} cy={CY} r="78" fill="url(#tribalGlow)"/>
          <g opacity="0.05" transform={`translate(${CX} ${CY})`}>
            {[0,45].map(r=>(
              <rect key={r} x="-52" y="-52" width="104" height="104" fill="none" stroke={C.navy} strokeWidth="1" transform={`rotate(${r})`} rx="10"/>
            ))}
          </g>

          {/* Connector triangle */}
          {EDGES.map(([a,b],k)=>{
            const active = selected===a||selected===b;
            const edgeColor = active ? PRINCIPLES[selected].color : C.navy;
            return(
              <g key={k}>
                <line x1={PRINCIPLES[a].x} y1={PRINCIPLES[a].y} x2={PRINCIPLES[b].x} y2={PRINCIPLES[b].y}
                  stroke={rgba(C.navy, allVisited?0.14:0.07)} strokeWidth="1.4"
                  strokeDasharray={allVisited?'none':'3 3'}
                  style={{transition:'stroke 0.4s ease'}}/>
                {active&&(
                  <line x1={PRINCIPLES[a].x} y1={PRINCIPLES[a].y} x2={PRINCIPLES[b].x} y2={PRINCIPLES[b].y}
                    stroke={rgba(edgeColor,0.38)} strokeWidth="1.6" strokeDasharray="3 3" className="flow-dash"/>
                )}
              </g>
            );
          })}

          {/* Centre label */}
          <text x={CX} y={CY-2} textAnchor="middle" fontSize="8.5" fontWeight="700" letterSpacing="0.16em"
            fill={allVisited?C.gold:rgba(C.navy,0.30)} fontFamily="system-ui,sans-serif"
            style={{transition:'fill 0.5s ease',textTransform:'uppercase'}}>THE TRIBAL CODE</text>
          {allVisited&&(
            <g className="pop">
              <path d={`M ${CX} ${CY+5} l 3.4 3.4 l -3.4 3.4 l -3.4 -3.4 z`} fill={C.gold} opacity="0.85"/>
            </g>
          )}

          {/* Principle medallions */}
          {PRINCIPLES.map((p,i)=>{
            const isSel=selected===i;
            const dim = selected!==null && !isSel;
            const labelAbove = p.id===2;
            return(
              <g key={p.id} onClick={()=>tap(i)} style={{cursor:'pointer',opacity:dim?0.45:1,transition:'opacity 0.35s ease'}}>
                {/* Halo ring, selected only */}
                <circle cx={p.x} cy={p.y} r={isSel?30:24} fill="none"
                  stroke={rgba(p.color,isSel?0.30:0)} strokeWidth="1.2"
                  style={{transition:'r 0.3s cubic-bezier(.34,1.4,.64,1), stroke 0.3s ease'}}/>
                {/* Medallion */}
                <circle cx={p.x} cy={p.y} r={isSel?25:22} fill={C.ivory}
                  stroke={p.color} strokeWidth={isSel?1.8:1.2}
                  style={{transition:'r 0.3s cubic-bezier(.34,1.4,.64,1), stroke-width 0.3s ease',filter:isSel?`drop-shadow(0 4px 10px ${rgba(p.color,0.28)})`:'none'}}/>
                {/* Inner hairline */}
                <circle cx={p.x} cy={p.y} r={isSel?21:18.5} fill="none" stroke={rgba(p.color,0.28)} strokeWidth="0.6"
                  style={{transition:'r 0.3s cubic-bezier(.34,1.4,.64,1)'}}/>
                {/* Arabic calligraphy */}
                <text x={p.x} y={p.y+5.5} textAnchor="middle" fontSize={isSel?17:15} fontWeight="700"
                  fill={p.color} fontFamily="'Amiri','AmiriArabic',serif" direction="rtl"
                  style={{transition:'font-size 0.3s ease'}}>{p.arabic}</text>
                {/* Visited tick */}
                {visited[i]&&(
                  <g className="pop">
                    <circle cx={p.x+16} cy={p.y-16} r="4.6" fill={p.color} stroke="white" strokeWidth="1.2"/>
                    <path d={`M ${p.x+13.9} ${p.y-16} l 1.5 1.6 l 2.7 -3.1`} fill="none" stroke="white" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                  </g>
                )}
                {/* Name + english */}
                <text x={p.x} y={p.y+(labelAbove?-32:37)} textAnchor="middle" fontSize="10"
                  fontWeight="800" fill={isSel?p.color:rgba(C.navy,0.72)}
                  fontFamily="Georgia,serif" style={{transition:'fill 0.25s ease'}}>{p.name}</text>
                <text x={p.x} y={p.y+(labelAbove?-42:47)} textAnchor="middle" fontSize="7.2" fontWeight="700"
                  letterSpacing="0.1em" fill={rgba(C.navy,0.38)} fontFamily="system-ui,sans-serif"
                  style={{textTransform:'uppercase'}}>{p.english}</text>
              </g>
            );
          })}
        </svg>

        {/* Progress chip */}
        <div style={{position:'absolute',top:12,right:14,display:'flex',alignItems:'center',gap:6,padding:'6px 10px',borderRadius:999,background:'rgba(255,255,255,0.72)',border:`1px solid ${rgba(C.border,0.9)}`,backdropFilter:'blur(8px)'}}>
          {PRINCIPLES.map((p,i)=>(
            <div key={i} style={{width:7,height:7,borderRadius:999,background:visited[i]?p.color:rgba(C.navy,0.12),transition:'background 0.3s ease'}}/>
          ))}
          <span style={{fontSize:9.5,fontWeight:800,color:allVisited?C.gold:rgba(C.navy,0.45),marginLeft:2}}>{visitedCount} of 3</span>
        </div>
      </div>

      {/* PANEL */}
      <div style={{background:'white',borderTop:`1px solid ${rgba(C.navy,0.07)}`}}>
        {sel?(
          <div key={sel.id} style={{padding:'20px 24px'}} className="su">
            <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:11}}>
              <div style={{width:4,alignSelf:'stretch',borderRadius:2,background:sel.color}}/>
              <div>
                <div style={{fontSize:18,fontWeight:800,color:C.navy,fontFamily:'Georgia,serif',lineHeight:1.15}}>{sel.name}</div>
                <div style={{fontSize:10,fontWeight:800,letterSpacing:'0.1em',textTransform:'uppercase',color:sel.color,marginTop:3}}>{sel.english}</div>
              </div>
              <span style={{marginLeft:'auto',fontSize:24,color:sel.color,fontFamily:"'Amiri','AmiriArabic',serif",direction:'rtl',lineHeight:1}}>{sel.arabic}</span>
            </div>
            <p style={{fontSize:13.5,color:C.mid,lineHeight:1.72,marginBottom:12}}>{sel.desc}</p>
            <div style={{padding:'12px 16px',borderRadius:12,background:rgba(sel.color,0.055),borderLeft:`3px solid ${rgba(sel.color,0.55)}`}}>
              <div style={{fontSize:9,fontWeight:800,textTransform:'uppercase',letterSpacing:'0.08em',color:sel.color,marginBottom:5}}>Example</div>
              <p style={{fontSize:12.5,color:C.dark,lineHeight:1.62,margin:0,fontStyle:'italic'}}>{sel.example}</p>
            </div>
          </div>
        ):(
          <div style={{padding:'20px 24px',textAlign:'center'}} className="su">
            <p style={{fontSize:13,color:rgba(C.navy,0.42),margin:'0 0 14px',fontStyle:'italic'}}>
              Tap each principle to understand how the tribal system worked.
            </p>
            <div style={{display:'flex',justifyContent:'center',gap:8,flexWrap:'wrap'}}>
              {PRINCIPLES.map((p,i)=>(
                <button key={i} onClick={()=>tap(i)}
                  style={{display:'flex',alignItems:'center',gap:7,padding:'8px 14px',borderRadius:999,fontSize:11.5,fontWeight:800,color:p.color,background:rgba(p.color,0.07),border:`1px solid ${rgba(p.color,0.28)}`,cursor:'pointer'}}>
                  <span style={{fontFamily:"'Amiri','AmiriArabic',serif",fontSize:14,lineHeight:1}}>{p.arabic}</span>
                  {p.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ================================================================
// QUESTION RENDERERS
// ================================================================

// --- MCQ ---
function MCQ({q,onFinish}){
  const [sel,setSel]=useState(null);
  const [sub,setSub]=useState(false);
  const [reveal,setReveal]=useState(false);
  const [stars,spawn]=useStars();
  const boardRef=useRef(null);
  const cardRefs=useRef({});
  const lockedRef=useRef(false);

  const tap=(i)=>{
    if(sub)return;
    snd.tick(); haptic(5);
    setSel(sel===i?null:i);
  };
  const submit=()=>{
    if(sel===null||sub||lockedRef.current)return;
    lockedRef.current=true;
    const opt=q.options[sel];
    setSub(true);
    if(opt.correct){
      snd.blip(); haptic(10);
      const el=cardRefs.current[sel], b=boardRef.current;
      if(el&&b){
        const r=el.getBoundingClientRect(), rb=b.getBoundingClientRect();
        spawn(r.right-rb.left-24, r.top-rb.top+r.height/2);
      }
      onFinish(true,q.feedback[opt.id],10);
    } else {
      snd.buzz(); haptic(30);
      setTimeout(()=>{
        setReveal(true);
        onFinish(false,q.feedback[opt.id],0);
      },MT.correctRevealDelay);
    }
  };
  const stateFor=(i)=>{
    const opt=q.options[i];
    if(!sub) return sel===i?'sel':'idle';
    if(q.options[sel].correct) return opt.correct?'good':'dim';
    if(i===sel) return reveal?'dim':'bad';
    if(opt.correct) return reveal?'good':'idle';
    return reveal?'dim':'idle';
  };
  return(
    <div>
      <div ref={boardRef} className="grid grid-cols-1 gap-2.5 mb-4" style={{position:'relative'}}>
        {q.options.map((opt,i)=>{
          const st=stateFor(i);
          const shaking=sub&&!q.options[sel].correct&&i===sel&&!reveal;
          const badge={
            idle:{border:C.border,bg:'transparent',ink:'#9ca3af'},
            sel:{border:C.teal,bg:C.teal,ink:'white'},
            good:{border:C.green,bg:C.green,ink:'white'},
            bad:{border:C.coral,bg:C.coral,ink:'white'},
            dim:{border:C.border,bg:'transparent',ink:'#9ca3af'},
          }[st]||{border:C.border,bg:'transparent',ink:'#9ca3af'};
          return(
            <div key={opt.id}
              ref={el=>{cardRefs.current[i]=el;}}
              onClick={()=>tap(i)}
              className={shaking?'dq-shk':''}
              style={chunky(st,{padding:'14px 14px',fontSize:14,fontWeight:500,textAlign:'left'})}>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full flex-shrink-0 mt-0.5 flex items-center justify-center text-xs font-bold"
                  style={{border:`2px solid ${badge.border}`,background:badge.bg,color:badge.ink,transition:`all ${MT.selectColor}ms`}}>
                  {opt.id.toUpperCase()}
                </div>
                <span className="flex-1 leading-snug">{opt.text}</span>
                {sub&&st==='good'&&<CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5 pop" style={{color:C.green}}/>}
                {sub&&st==='bad'&&<XCircle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{color:C.coral}}/>}
              </div>
            </div>
          );
        })}
        {stars.map(s=><StarSeal key={s.id} x={s.x} y={s.y}/>)}
      </div>
      {!sub&&<ChunkyBtn label="Check" onClick={submit} enabled={sel!==null}/>}
    </div>
  );
}

// --- RAPID FIRE TRUE/FALSE (Q1) ---
function RapidFireTF({q,onFinish}){
  const [idx,setIdx]=useState(0);
  const [answers,setAnswers]=useState([]);
  const [answered,setAnswered]=useState(null); // {correct, stmt} for current question
  const [done,setDone]=useState(false);
  const lockedRef=useRef(false);

  const choose=(val)=>{
    if(done||answered!==null) return;
    const stmt=q.statements[idx];
    const correct=val===stmt.answer;
    if(correct){snd.blip();haptic(10);}else{snd.buzz();haptic(30);}
    const newAnswers=[...answers,{val,correct,stmt}];
    setAnswers(newAnswers);
    setAnswered({correct,stmt});
  };

  const next=()=>{
    if(idx<q.statements.length-1){
      setIdx(idx+1);
      setAnswered(null);
    } else {
      setDone(true);
      if(!lockedRef.current){
        lockedRef.current=true;
        const ok=answers.filter(a=>a.correct).length;
        onFinish(ok>=4,q.feedbackText,ok*2,{ok,total:q.statements.length});
      }
    }
  };

  const stmt=q.statements[idx];
  const isLast=idx===q.statements.length-1;

  if(done){
    return(
      <div className="su">
        <p className="text-xs font-semibold mb-3" style={{color:C.mid}}>Results — all {q.statements.length} statements:</p>
        <div className="space-y-2">
          {answers.map((a,i)=>(
            <div key={i} className="flex items-start gap-3 p-3 rounded-xl border"
              style={{background:a.correct?C.greenLight:C.coralLight,borderColor:a.correct?C.green:C.coral}}>
              {a.correct?<CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5 pop" style={{color:C.green}}/>:<XCircle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{color:C.coral}}/>}
              <div className="flex-1">
                <p className="text-xs font-medium leading-snug mb-1" style={{color:C.dark}}>{a.stmt.text}</p>
                <p className="text-[11px] leading-relaxed" style={{color:a.correct?C.green:C.coral}}>{a.stmt.feedback}</p>
              </div>
              <span className="text-xs font-bold flex-shrink-0 px-2 py-0.5 rounded-full"
                style={{background:a.correct?C.green:C.coral,color:'white'}}>
                {a.stmt.answer==='true'?'T':'F'}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return(
    <div>
      {/* Progress dots */}
      <div className="flex items-center gap-1.5 mb-4">
        {q.statements.map((_,i)=>(
          <div key={i} style={{
            width:i===idx?24:8,height:8,borderRadius:4,
            background:i<answers.length?(answers[i].correct?C.green:C.coral):i===idx?C.gold:rgba(C.navy,0.12),
            transition:'all 0.3s ease',
          }}/>
        ))}
        <span className="text-xs ml-auto" style={{color:C.mid}}>{idx+1} of {q.statements.length}</span>
      </div>

      {/* Statement card */}
      <div className="rounded-xl p-5 mb-4 border" style={{background:rgba(C.navy,0.03),borderColor:rgba(C.navy,0.09)}}>
        <p className="text-sm font-medium leading-relaxed text-center" style={{color:C.dark,fontFamily:'Georgia,serif',fontSize:15}}>{stmt.text}</p>
      </div>

      {/* Feedback — shown after answering */}
      {answered&&(
        <div className="rounded-xl p-4 mb-4 border-2 fi"
          style={{background:answered.correct?C.greenLight:C.coralLight,borderColor:answered.correct?C.green:C.coral}}>
          <div className="flex items-start gap-3">
            {answered.correct
              ?<CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5 pop" style={{color:C.green}}/>
              :<XCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{color:C.coral}}/>}
            <div>
              <div className="text-sm font-bold mb-1" style={{color:answered.correct?C.green:C.coral}}>
                {answered.correct?'Correct':'Not quite'}
                <span className="ml-2 text-xs font-semibold" style={{color:C.mid}}>
                  Answer: {stmt.answer==='true'?'True':'False'}
                </span>
              </div>
              <p className="text-sm leading-relaxed" style={{color:C.dark}}>{stmt.feedback}</p>
            </div>
          </div>
        </div>
      )}

      {/* True / False buttons — hidden after answering */}
      {!answered&&(
        <div style={{display:'flex',gap:12}}>
          <div role="button" onClick={()=>{snd.tick();choose('true');}}
            style={chunky('idle',{flex:1,padding:'16px 0',fontSize:14,fontWeight:700,textAlign:'center',color:C.green,borderColor:rgba(C.green,0.45),borderBottomColor:rgba(C.green,0.65)})}>
            True
          </div>
          <div role="button" onClick={()=>{snd.tick();choose('false');}}
            style={chunky('idle',{flex:1,padding:'16px 0',fontSize:14,fontWeight:700,textAlign:'center',color:C.coral,borderColor:rgba(C.coral,0.45),borderBottomColor:rgba(C.coral,0.65)})}>
            False
          </div>
        </div>
      )}

      {/* Next button — shown after answering */}
      {answered&&(
        <ChunkyBtn className="su" onClick={next} fill={C.gold} edge={GOLD_EDGE} ink={C.navy}
          label={<span>{isLast?'See all results':'Next statement'} <ArrowRight className="w-4 h-4 inline ml-1 -mt-0.5"/></span>}/>
      )}
    </div>
  );
}

// --- BUCKET SORT (Q3) ---
function BucketSort({q,onFinish}){
  const [idx,setIdx]=useState(0);
  const [assignments,setAssignments]=useState({});
  const [submitted,setSubmitted]=useState(false);
  const [results,setResults]=useState({});
  const lockedRef=useRef(false);

  const finishAll=(finalAssignments)=>{
    if(lockedRef.current)return;
    lockedRef.current=true;
    const res={};
    q.cards.forEach(c=>{ res[c.id]=finalAssignments[c.id]===c.bucket; });
    setResults(res);
    setSubmitted(true);
    const ok=Object.values(res).filter(Boolean).length;
    const total=q.cards.length;
    if(ok>=5){snd.blip();haptic(10);}else{snd.buzz();haptic(30);}
    onFinish(ok>=5,ok===total?q.feedback.perfect:ok>=4?q.feedback.good:q.feedback.low,ok===total?10:ok>=4?7:ok*2,{ok,total});
  };

  const pick=(bucketId)=>{
    if(submitted)return;
    snd.pop(); haptic(5);
    const card=q.cards[idx];
    const next={...assignments,[card.id]:bucketId};
    setAssignments(next);
    if(idx<q.cards.length-1){ setIdx(idx+1); }
    else { finishAll(next); }
  };
  const back=()=>{
    if(submitted||idx===0)return;
    snd.tick();
    const prev=q.cards[idx-1];
    setAssignments(a=>{const n={...a};delete n[prev.id];return n;});
    setIdx(idx-1);
  };

  if(submitted){
    return(
      <div className="space-y-2 mt-1 su">
        {q.cards.map(c=>(
          <div key={c.id} className="flex items-start gap-2 p-2.5 rounded-lg border fi"
            style={{background:results[c.id]?C.greenLight:C.coralLight,borderColor:results[c.id]?C.green:C.coral}}>
            {results[c.id]?<CheckCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{color:C.green}}/>:<XCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{color:C.coral}}/>}
            <div>
              <span className="text-xs font-bold" style={{color:results[c.id]?C.green:C.coral}}>{c.label}</span>
              <span className="text-xs ml-1.5" style={{color:C.mid}}>{c.feedback}</span>
            </div>
          </div>
        ))}
      </div>
    );
  }

  const card=q.cards[idx];
  return(
    <div>
      <div className="flex items-center gap-1.5 mb-4">
        {q.cards.map((_,i)=>(
          <div key={i} style={{width:i===idx?24:8,height:8,borderRadius:4,background:i<idx?C.teal:i===idx?C.gold:rgba(C.navy,0.12),transition:'all 0.3s ease'}}/>
        ))}
        <span className="text-xs ml-auto" style={{color:C.mid}}>{idx+1} of {q.cards.length}</span>
      </div>
      <div className="rounded-xl p-5 mb-4 border" style={{background:rgba(C.navy,0.03),borderColor:rgba(C.navy,0.09)}}>
        <p className="text-sm font-medium leading-relaxed text-center" style={{color:C.dark,fontFamily:'Georgia,serif',fontSize:15}}>{card.label}</p>
      </div>
      <p className="text-xs mb-2 font-semibold" style={{color:C.mid}}>Which bucket does this belong to?</p>
      <div style={{display:'flex',flexDirection:'column',gap:10}}>
        {q.buckets.map(b=>(
          <div key={b.id} role="button" onClick={()=>pick(b.id)}
            style={chunky('idle',{padding:'14px 16px',fontSize:13,fontWeight:700,color:b.color,borderColor:rgba(b.color,0.45),borderBottomColor:rgba(b.color,0.65)})}>
            {b.label}
          </div>
        ))}
      </div>
      {idx>0&&(
        <div role="button" onClick={back} className="text-center mt-3"
          style={{fontSize:12,fontWeight:600,color:C.mid,cursor:'pointer',userSelect:'none'}}>
          Back one card
        </div>
      )}
    </div>
  );
}

// --- FILL IN BLANK (Q5) ---
function FillInBlank({q,onFinish}){
  const [sels,setSels]=useState(Array(q.blanks.length).fill(''));
  const [submitted,setSubmitted]=useState(false);
  const [results,setResults]=useState([]);
  const lockedRef=useRef(false);

  const allFilled=sels.every(s=>s!=='');

  const set=(i,val)=>{
    snd.tick(); haptic(5);
    const n=[...sels];n[i]=val;setSels(n);
  };

  const submit=()=>{
    if(!allFilled||submitted||lockedRef.current)return;
    lockedRef.current=true;
    const res=sels.map((s,i)=>s===q.blanks[i].answer);
    setResults(res);
    setSubmitted(true);
    const ok=res.filter(Boolean).length;
    if(ok===q.blanks.length){snd.blip();haptic(10);}else{snd.buzz();haptic(30);}
    onFinish(ok===q.blanks.length,ok===q.blanks.length?q.feedback.perfect:ok>=3?q.feedback.good:q.feedback.low,ok===q.blanks.length?10:ok>=3?7:ok*2,{ok,total:q.blanks.length});
  };

  // Split passage at blank markers [B0], [B1], [B2], [B3]
  const parts=q.passage.split(/(\[B\d\])/);

  return(
    <div>
      <div className="rounded-xl p-4 mb-5 border" style={{background:rgba(C.navy,0.03),borderColor:rgba(C.navy,0.09)}}>
        <p className="text-sm leading-relaxed" style={{color:C.dark,lineHeight:2}}>
          {parts.map((part,i)=>{
            const match=part.match(/\[B(\d)\]/);
            if(!match) return <span key={i}>{part}</span>;
            const bi=parseInt(match[1]);
            const blank=q.blanks[bi];
            const val=sels[bi];
            const isCorrect=submitted&&results[bi];
            const isWrong=submitted&&!results[bi];
            return(
              <select key={i} value={val} disabled={submitted}
                onChange={e=>set(bi,e.target.value)}
                style={{
                  display:'inline-block',marginInline:4,padding:'2px 6px',
                  borderRadius:6,border:`2px solid`,
                  borderColor:isCorrect?C.green:isWrong?C.coral:val?C.teal:'#d1d5db',
                  background:isCorrect?C.greenLight:isWrong?C.coralLight:val?rgba(C.teal,0.07):'white',
                  color:isCorrect?C.green:isWrong?C.coral:val?C.teal:C.mid,
                  fontSize:13,fontWeight:600,cursor:'pointer',
                  appearance:'auto',
                }}>
                <option value=""> -  choose  - </option>
                {blank.options.map(o=>(
                  <option key={o} value={o}>{o}</option>
                ))}
              </select>
            );
          })}
        </p>
      </div>

      {submitted&&(
        <div className="space-y-2 mb-4">
          {q.blanks.map((b,i)=>(
            <div key={i} className="flex items-center gap-2 text-xs fi">
              {results[i]
                ?<CheckCircle className="w-3.5 h-3.5 flex-shrink-0" style={{color:C.green}}/>
                :<XCircle className="w-3.5 h-3.5 flex-shrink-0" style={{color:C.coral}}/>}
              <span style={{color:results[i]?C.green:C.coral,fontWeight:600}}>{b.answer}</span>
              <span style={{color:C.mid}}> -  {b.feedback}</span>
            </div>
          ))}
        </div>
      )}

      {!submitted&&(
        <ChunkyBtn onClick={submit} enabled={allFilled} label="Check my answers"/>
      )}
    </div>
  );
}

// --- REFLECTION MULTI SELECT ---
function ReflectionMultiSelect({q,onFinish}){
  const [selected,setSelected]=useState(new Set());
  const [sub,setSub]=useState(false);
  const lockedRef=useRef(false);
  const toggle=(id)=>{ if(sub)return; snd.tick(); haptic(5); setSelected(s=>{const n=new Set(s);n.has(id)?n.delete(id):n.add(id);return n;}); };
  const submit=()=>{
    if(sub||lockedRef.current)return;
    lockedRef.current=true;setSub(true);
    onFinish(true,q.feedbackSummary,0);
  };
  return(
    <div>
      <div className="space-y-2 mb-5">
        {q.options.map(opt=>{
          const isSel=selected.has(opt.id);
          return(
            <button key={opt.id} onClick={()=>toggle(opt.id)}
              className="w-full text-left"
              style={chunky(isSel?'gsel':'idle',{padding:'16px',cursor:sub?'default':'pointer'})}>
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded border-2 flex-shrink-0 mt-0.5 flex items-center justify-center transition-all"
                  style={{borderColor:isSel?C.gold:'#d1d5db',background:isSel?C.gold:'white'}}>
                  {isSel&&<svg width="10" height="8" viewBox="0 0 10 8"><path d="M1 4l3 3 5-6" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/></svg>}
                </div>
                <div className="flex-1">
                  <div className="text-sm leading-relaxed" style={{color:C.dark}}>{opt.text}</div>
                  {sub&&isSel&&opt.feedback&&(
                    <div className="text-xs mt-2 fi leading-relaxed" style={{color:C.teal,fontStyle:'italic'}}>{opt.feedback}</div>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>
      {!sub&&(
        <ChunkyBtn onClick={submit} enabled={selected.size>0} fill={C.gold} edge={GOLD_EDGE} ink={C.navy} label="Share my reflection"/>
      )}
    </div>
  );
}

// ================================================================
// DATA
// ================================================================
const SECTIONS = [
  {
    id:'A', title:'The Arabian Peninsula',
    content:[
      'Islamic history did not emerge from the margins of the ancient world. The Arabian Peninsula sat at its very centre  -  a vast landmass roughly the size of Western Europe, bordered by the Red Sea to the west, the Persian Gulf to the east, and the Indian Ocean to the south.',
      'Most of it was desert: harsh, dry, and unforgiving. The interior  -  called the **Najd**  -  was home to nomadic Bedouin tribes who moved with their livestock across the land. The fertile southwest, **Yemen**, supported settled agriculture and was the source of the famous incense route. And the **Hijaz**  -  the thin western coastal strip  -  contained the two cities that would change the world: Makkah and Yathrib (later renamed Madinah after the Hijra).',
      'Makkah\'s position was not an accident. It sat at the intersection of two great trade arteries that connected the ancient world\'s superpowers. Every caravan moving between the great empires passed near it. And whoever controlled this crossroads controlled the wealth of Arabia.',
    ],
    arabiaDiagram: true,
    callout:{
      type:'insight',
      title:'Surat Quraysh  -  Quran 106',
      text:'"For the accustomed security of the Quraysh  -  their accustomed security in the caravan journeys of winter and summer  -  let them worship the Lord of this House." (Quran 106:1-3). The Quran itself references the two seasonal caravans  -  winter to Yemen, summer to Syria  -  that were the backbone of Meccan power.',
    },
  },
  {
    id:'B', title:'The Tribal System',
    content:[
      'In the absence of a central government, pre-Islamic Arabia was organised entirely around tribes. A tribe was not just a family  -  it was a complete social, legal, and military system. Your tribe determined your identity, your safety, your legal rights, and your obligations.',
      'This system produced a society of extraordinary courage and hospitality. The same values that made Arab culture celebrated in poetry also made it capable of extreme violence and deep injustice toward those without tribal protection. **A slave had no tribe. A woman had limited standing. A stranger was vulnerable.**',
      'This is the world the Prophet صَلَّى اللَّٰهُ عَلَيْهِ وَسَلَّمَ was born into. And one of the most remarkable things he achieved was transforming it  -  redirecting these fierce tribal loyalties toward a single Ummah, united not by blood but by faith.',
    ],
    tribalDiagram: true,
  },
  {
    id:'C', title:'Arabia Between Two Superpowers',
    content:[
      'Pre-Islamic Arabia did not exist in isolation. It sat between the two dominant empires of the ancient world: the **Byzantine (Eastern Roman) Empire** to the northwest, controlling Syria, Egypt, and Anatolia  -  and the **Sasanian (Persian) Empire** to the northeast, controlling Iraq, Iran, and Central Asia.',
      'Both empires had fought each other for centuries and were, by the early 600s CE, exhausted by war. Arabia was the gap between them  -  technically outside both empires\' control, but economically vital to both. Arab tribes on the northern borders often served as buffer states or mercenary allies. The Arabs were not isolated: they were **connected to, but not controlled by**, the great civilisations of their time.',
      'This matters because when Islam emerged, it spread not into a vacuum but into a world already structured by these imperial relationships. Within decades of the Prophet\'s صَلَّى اللَّٰهُ عَلَيْهِ وَسَلَّمَ death, the Muslim armies would shatter both empires  -  not because they came from nowhere, but because they came from the exact geographic and economic heart of the ancient world.',
    ],
  },
];

const QUESTIONS = [
  {
    id:'q1', afterSection:'A', scored:true,
    type:'rapid-fire-tf', mode:'PLAY', typeLabel:'Rapid True or False', level:'1/5',
    question:'Five quick statements about Arabian geography. True or False?',
    feedbackText:'Geography is the foundation of everything that follows in this module. The location of Makkah, the desert interior, the trade routes  -  all of it shaped how Islam emerged and spread.',
    statements:[
      {
        text:'The Arabian Peninsula is bordered by the Red Sea to the west.',
        answer:'true',
        feedback:'True. The Red Sea forms the western border, making it a natural gateway between Africa, Egypt, and the peninsula.',
      },
      {
        text:'Most of the interior of Arabia is fertile farmland.',
        answer:'false',
        feedback:'False. The interior (Najd) is arid desert. Only Yemen in the southwest had reliable agriculture  -  earning it the ancient nickname "Arabia Felix" (Fertile Arabia).',
      },
      {
        text:'Makkah is located in the Hijaz region.',
        answer:'true',
        feedback:'True. The Hijaz is the western coastal strip. Makkah and Yathrib (later: Madinah) are both located here. The name means "barrier"  -  the region sits between the coastal plains and the desert interior.',
      },
      {
        text:'Yemen is in the southwest of the Arabian Peninsula.',
        answer:'true',
        feedback:'True. Yemen\'s location in the southwest gave it access to the Indian Ocean trade and made it the source of the famous incense route northward.',
      },
      {
        text:'Arabia was isolated from the major ancient trade routes.',
        answer:'false',
        feedback:'False. Arabia was at the intersection of major trade routes connecting the Byzantine Empire, Persia, India, and East Africa. This centrality was one reason the final message was sent here.',
      },
    ],
  },
  {
    id:'q2', afterSection:'A', scored:true,
    type:'mcq', mode:'THINK', typeLabel:'Multiple choice', level:'2/5',
    question:'Why was Makkah particularly important to ancient trade routes?',
    options:[
      {id:'a', text:'It was the largest and most populous city on the Arabian Peninsula', correct:false},
      {id:'b', text:'It sat at the crossroads of north-south and east-west trade arteries', correct:true},
      {id:'c', text:'It had the most fertile land and freshwater sources in Arabia', correct:false},
      {id:'d', text:'It was the closest Arab settlement to the Persian Empire', correct:false},
    ],
    feedback:{
      a:'Makkah was not the largest city. Cities like Sanaa in Yemen or towns along the Euphrates were more populated. Makkah\'s significance was geographic and religious, not demographic.',
      b:'Correct. The north-south incense route (Yemen to Syria) and the east-west route (Persian Gulf to Red Sea) both passed near Makkah. The Quraysh leveraged this position to build a commercial and religious empire  -  and it is why Makkah became the undisputed centre of Arabia.',
      c:'Makkah\'s valley is actually quite arid. The Quran records Ibrahim عَلَيْهِ السَّلَام describing it as "an uncultivated valley" (14:37). Its importance was geographic and spiritual, not agricultural.',
      d:'Makkah is in the Hijaz on the western side of Arabia  -  it is actually distant from Persia. The Persian Gulf coast (eastern Arabia) was far closer to Persian influence.',
    },
    bridge:'The Quraysh built their entire identity on controlling this crossroads. In L1.5 you will see exactly how they turned geographic advantage into political and religious power.',
  },
  {
    id:'q3', afterSection:'B', scored:true,
    type:'bucket-sort', mode:'SORT', typeLabel:'Sort into categories', level:'2/5',
    question:'Sort these six features of pre-Islamic Arabia into the correct category.',
    buckets:[
      {id:'geo',    label:'Geographic',     color:C.teal},
      {id:'eco',    label:'Economic',       color:C.gold},
      {id:'social', label:'Social/Tribal',  color:C.navy},
    ],
    cards:[
      {id:'c1', label:'Desert interior (Najd)',       bucket:'geo',    feedback:'A geographic feature  -  the arid central plateau that shaped Bedouin nomadic life.'},
      {id:'c2', label:'Control of trade routes',      bucket:'eco',    feedback:'Economic  -  controlling the routes was the Quraysh\'s primary commercial advantage.'},
      {id:'c3', label:"Asabiyyah (tribal loyalty)",   bucket:'social', feedback:'Social  -  the defining glue of tribal Arabia, governing relationships and obligations.'},
      {id:'c4', label:'The Hijaz coastal strip',      bucket:'geo',    feedback:'Geographic  -  the western coastal region containing Makkah and Yathrib (later renamed Madinah).'},
      {id:'c5', label:'Caravan trade networks',       bucket:'eco',    feedback:'Economic  -  referenced directly in the Quran (Surat Quraysh 106:2): caravans of winter and summer.'},
      {id:'c6', label:"Blood vengeance (Tha'r)",      bucket:'social', feedback:'Social  -  a tribal obligation that locked communities in cycles of vengeance, replaced by Islamic justice.'},
    ],
    feedback:{
      perfect:'All six sorted correctly. These three categories  -  geographic, economic, social  -  are the lens through which you will read all of pre-Islamic Arabian history.',
      good:'Almost there. Review the one or two you missed. The key: Najd and Hijaz are geographic; trade routes and caravans are economic; Asabiyyah and Tha\'r are social.',
      low:'The pattern: land features are geographic; commerce features are economic; tribal codes are social. Go back to the teaching content and it will click.',
    },
  },
  {
    id:'q4', afterSection:'C', scored:true,
    type:'mcq', mode:'THINK', typeLabel:'Multiple choice', level:'3/5',
    question:'A historian argues: "Pre-Islamic Arabs were fully isolated from the civilised world." Based on what you have learned, what is the most accurate response?',
    options:[
      {id:'a', text:'This is correct  -  the vast desert formed a complete barrier between Arabia and other civilisations', correct:false},
      {id:'b', text:'This is partially correct  -  Arabs were geographically isolated but had some limited trade contact', correct:false},
      {id:'c', text:'This is incorrect  -  Arabia sat between the Byzantine and Sasanian Empires and was central to ancient trade routes', correct:true},
      {id:'d', text:'This is incorrect  -  Arabia was in fact fully part of the Byzantine Empire', correct:false},
    ],
    feedback:{
      a:'The desert created challenges but not isolation. Arab traders routinely crossed it. Makkah\'s entire economy depended on trade with Syria (Byzantine) and Yemen  -  neither is inside Arabia\'s desert interior.',
      b:'This underestimates the connection. Arabs were not peripheral  -  they were the essential economic link between major empires. Northern tribes had formal alliances with both Byzantine and Sasanian powers.',
      c:'Correct. Arabia was geographically central  -  positioned between the two dominant empires of the age. When Islam spread, it expanded into a world it was already economically and diplomatically connected to. This position explains the speed of early Islamic expansion.',
      d:'The Hijaz was never under Byzantine control. Some northern Arab tribes had Byzantine alliances (the Ghassanids), but Makkah and the Hijaz were politically independent. This matters: the message came through a community that answered to no empire.',
    },
    bridge:'In L1.3 you will examine what life inside this connected but ungoverned society actually looked like  -  and the Quran\'s name for it.',
  },
  {
    id:'q5', afterSection:'C', scored:true,
    type:'fill-in-blank', mode:'THINK', typeLabel:'Fill in the blanks', level:'3/5',
    question:'Complete the passage with the correct terms.',
    passage:'The Arabian Peninsula sits between the [B0] Empire to the northwest and the [B1] Empire to the northeast. The region containing Makkah and Yathrib is called the [B2]. The most powerful tribe controlling the trade routes of this region was the [B3].',
    blanks:[
      {
        answer:'Byzantine',
        options:['Byzantine','Ottoman','Abbasid'],
        feedback:'The Byzantine (Eastern Roman) Empire controlled Syria, Egypt, and Anatolia to the northwest.',
      },
      {
        answer:'Sasanian',
        options:['Sasanian','Mongol','Umayyad'],
        feedback:'The Sasanian (Persian) Empire controlled Iraq, Iran, and Central Asia to the northeast.',
      },
      {
        answer:'Hijaz',
        options:['Hijaz','Najd','Yemen'],
        feedback:'The Hijaz is the western coastal strip containing Makkah and Yathrib. Its name means "barrier"  -  sitting between the coastal plains and the desert interior.',
      },
      {
        answer:'Quraysh',
        options:['Quraysh','Ansar','Khazraj'],
        feedback:'The Quraysh controlled the Ka\'bah and the trade routes. Their commercial and religious power made them Arabia\'s dominant tribe.',
      },
    ],
    feedback:{
      perfect:'All four correct. You now hold the geographic and political framework for everything that follows in this module.',
      good:'Almost  -  review the one or two you missed. These four terms will reappear throughout the entire H-B1 module.',
      low:'The key facts: Byzantine (northwest), Sasanian (northeast), Hijaz (region of Makkah), Quraysh (dominant tribe). Go back to Section C and they will all click into place.',
    },
  },
  {
    id:'q6', afterSection:'C', scored:false,
    type:'reflection-multi', mode:'THINK', typeLabel:'Personal reflection', level:'5/5',
    question:'After this lesson, which of the following resonates with you? (Select all that apply  -  not graded.)',
    options:[
      {id:'r1', text:'I now understand why Makkah specifically was where it was  -  the geography makes sense',         feedback:'The location was not arbitrary. Ibrahim عَلَيْهِ السَّلَام described it as an uncultivated valley (14:37)  -  and yet it became the centre of the world. The crossroads made it inevitable.'},
      {id:'r2', text:'The tribal system feels familiar  -  I can see versions of it in the world today',               feedback:'Asabiyyah, Muruah, and Tha\'r did not disappear  -  they were transformed. Islam redirected these loyalties toward a community defined by faith, not blood.'},
      {id:'r3', text:'I had not realised how connected Arabia was to the Byzantine and Persian worlds',              feedback:'Most people imagine a remote desert. The reality is that Arabia was the economic backbone of the ancient world. That is why Islam spread so rapidly  -  into a world it was already woven into.'},
      {id:'r4', text:'The idea of Surat Quraysh  -  that Allah سُبْحَانَهُ وَتَعَالَى is the source of their security  -  is powerful',     feedback:'That is the verse\'s entire point. The Quraysh had built a commercial empire  -  and the Quran reminded them: the source of that empire is the Lord of the Ka\'bah. Worship Him.'},
      {id:'r5', text:'I want to understand more about the specific tribes and their relationships',                  feedback:'That depth comes in L1.5 when we examine the Quraysh in detail  -  their clans, their structure, and why their strengths made them the fiercest opponents of the Prophet صَلَّى اللَّٰهُ عَلَيْهِ وَسَلَّمَ.'},
      {id:'r6', text:'The idea that geography shaped everything  -  trade, power, religion  -  is something I find compelling', feedback:'Geography as theology. The crossroads was not a coincidence  -  it was preparation. The world was arranged so that the final message would emerge from its centre.'},
    ],
    feedbackSummary:'Your reflections are noted. The land, the tribes, the trade routes, the empires  -  none of it is background noise. All of it is preparation. L1.3 takes you inside this society to examine what daily life actually looked like before the revelation.',
  },
];

const SCORED_COUNT = QUESTIONS.filter(q=>q.scored!==false).length; // 5

const FLOW = (()=>{
  const f=[];
  SECTIONS.forEach(sec=>{
    f.push({type:'section',data:sec});
    QUESTIONS.filter(q=>q.afterSection===sec.id).forEach(q=>f.push({type:'question',data:q}));
  });
  return f;
})();

// ================================================================
// SECTION CARD
// ================================================================
function SectionCard({section,onContinue}){
  const [focused,    setFocused]    = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const activate = useCallback(()=>{ setFocused(true); setHasStarted(true); },[]);
  const escape   = useCallback(()=>setFocused(false),[]);

  const ACCENTS={A:C.teal,B:C.orange,C:C.navy};
  const accent=ACCENTS[section.id]||C.teal;

  const textStyle={
    transition:'filter 0.5s ease, opacity 0.5s ease',
    filter:focused?'blur(2px)':'none',
    opacity:focused?0.22:1,
    pointerEvents:focused?'none':'auto',
    userSelect:focused?'none':'auto',
  };
  const hasDiagram=section.arabiaDiagram||section.tribalDiagram;

  return(
    <div className="su rounded-[22px] overflow-hidden" style={{background:'rgba(255,255,255,0.88)',backdropFilter:'blur(18px)',border:focused?`1.5px solid ${rgba(accent,0.55)}`:`1px solid ${rgba(C.border,0.9)}`,transition:'border-color 0.45s ease, box-shadow 0.45s ease, transform 0.45s ease',boxShadow:focused?`0 0 0 4px ${rgba(accent,0.08)}, 0 28px 80px ${rgba(C.navy,0.14)}`:`0 20px 60px ${rgba(C.navy,0.09)}`}}>

      {/* HEADER */}
      <div className="px-5 pt-6 pb-5" style={{borderBottom:`1px solid ${rgba(C.border,0.75)}`,background:`linear-gradient(135deg,${rgba(accent,0.08)},rgba(255,255,255,0.20))`,transition:'opacity 0.5s ease, filter 0.5s ease',...(focused?{opacity:0.25,filter:'blur(1.5px)',pointerEvents:'none'}:{})}}>
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-11 h-11 rounded-2xl flex items-center justify-center text-sm font-black" style={{background:`linear-gradient(135deg,${rgba(accent,0.18)},rgba(255,255,255,0.82))`,color:accent,border:`1px solid ${rgba(accent,0.20)}`,boxShadow:`inset 0 1px 0 rgba(255,255,255,0.65)`}}>{section.id}</div>
          <div className="flex-1 min-w-0">
            <div className="text-[10px] font-bold tracking-widest uppercase mb-1" style={{color:rgba(C.navy,0.35)}}>Section {section.id}</div>
            <h2 className="text-xl font-black leading-tight" style={{color:C.navy,fontFamily:'Georgia,serif',letterSpacing:'-0.02em'}}>{section.title}</h2>
          </div>
        </div>
      </div>

      <div className="px-5 pt-5 pb-6">
        {/* TEXT */}
        <div style={textStyle}>
          {section.content.map((p,i)=>(
            <p key={i} className="leading-relaxed mb-4" style={{color:C.dark,fontSize:'15px',lineHeight:'1.86'}}>{md(p)}</p>
          ))}
        </div>

        {/* DIAGRAM ZONE */}
        {hasDiagram&&(
          <div style={{position:'relative'}}>
            {focused&&(
              <button onClick={escape} className="escape-in" style={{position:'absolute',top:-12,right:-6,zIndex:20,display:'flex',alignItems:'center',gap:5,padding:'5px 12px',borderRadius:20,background:C.navy,color:'white',fontSize:11,fontWeight:700,border:'none',cursor:'pointer',boxShadow:`0 4px 14px ${rgba(C.navy,0.28)}`,letterSpacing:'0.03em'}}>
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none" style={{flexShrink:0}}>
                  <path d="M7 5H2M2 5L4.5 2.5M2 5L4.5 7.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Back to lesson
              </button>
            )}
            {!hasStarted&&(
              <div className="flex items-center gap-2 mb-3 su">
                <div style={{flex:1,height:1,background:`linear-gradient(90deg,transparent,${rgba(accent,0.25)})`}}/>
                <span style={{fontSize:11,color:rgba(accent,0.7),fontWeight:600,letterSpacing:'0.04em'}}>interactive concept</span>
                <div style={{width:5,height:5,borderRadius:'50%',background:accent,opacity:0.7,animation:'pulse 1.8s ease-in-out infinite'}}/>
                <div style={{flex:1,height:1,background:`linear-gradient(90deg,${rgba(accent,0.25)},transparent)`}}/>
              </div>
            )}
            <div className={focused?'focus-ring':''} style={{position:'relative',zIndex:focused?10:'auto',borderRadius:16,transition:'transform 0.45s cubic-bezier(0.34,1.4,0.64,1), box-shadow 0.45s ease',transform:focused?'scale(1.018)':'scale(1)',boxShadow:focused?`0 12px 48px ${rgba(C.navy,0.14)}, 0 0 0 2px ${rgba(accent,0.4)}`:'none'}}>
              {section.arabiaDiagram&&<ArabiaDiagram onActivate={activate}/>}
              {section.tribalDiagram&&<TribalDiagram onActivate={activate}/>}
            </div>
            {focused&&(
              <div className="flex gap-2 mt-4 escape-in" style={{animationDelay:'0.08s'}}>
                <button onClick={escape} style={{flex:1,padding:'10px 0',borderRadius:10,fontSize:12,fontWeight:600,background:rgba(C.navy,0.05),color:C.mid,border:`1px solid ${rgba(C.navy,0.1)}`,cursor:'pointer'}}>Show lesson text</button>
                <button onClick={onContinue} style={{flex:1,padding:'10px 0',borderRadius:10,fontSize:12,fontWeight:600,background:`linear-gradient(135deg,${C.teal},${C.green})`,color:'white',border:'none',cursor:'pointer'}}>Continue →</button>
              </div>
            )}
          </div>
        )}

        {/* POST-DIAGRAM CONTENT */}
        <div style={textStyle}>
          {section.quran&&<QuranCard {...section.quran}/>}
          {section.callout&&(
            <div className="mb-4 mt-1" style={{background:section.callout.type==='warning'?rgba(C.coralLight,0.5):rgba(C.tealLight,0.5),borderLeft:`3px solid ${section.callout.type==='warning'?C.coral:C.teal}`,padding:'12px 16px',borderRadius:0}}>
              <div style={{fontSize:11,fontWeight:700,color:section.callout.type==='warning'?C.coral:C.teal,letterSpacing:'0.05em',marginBottom:4,textTransform:'uppercase'}}>{section.callout.title}</div>
              <p className="text-sm leading-relaxed" style={{color:C.dark}}>{section.callout.text}</p>
            </div>
          )}
        </div>

        {!focused&&(
          <div className="mt-3">
            <ChunkyBtn onClick={onContinue}
              label={<span>Continue <ArrowRight className="w-4 h-4 inline ml-1 -mt-0.5"/></span>}/>
          </div>
        )}
      </div>
    </div>
  );
}

// ================================================================
// QUESTION CARD
// ================================================================
function QuestionCard({q,qNum,totalQ,onAnswer,onNext}){
  const [done,    setDone]    = useState(false);
  const [correct, setCorrect] = useState(false);
  const [fbText,  setFbText]  = useState('');
  const [fbMeta,  setFbMeta]  = useState(null);

  const finish=useCallback((isCorrect,text,pts,meta)=>{
    setDone(true);setCorrect(isCorrect);setFbText(text);
    if(meta)setFbMeta(meta);
    onAnswer(isCorrect,pts,{scored:q.scored,q});
  },[onAnswer,q.scored]);

  const isReflection=q.type==='reflection-multi';

  return(
    <div className="su rounded-[22px] overflow-hidden" style={{background:'rgba(255,255,255,0.88)',backdropFilter:'blur(18px)',border:`1px solid ${rgba(C.border,0.9)}`,boxShadow:`0 20px 60px ${rgba(C.navy,0.09)}`}}>
      <div className="p-5">
        <ModeBadge mode={q.mode} type={q.typeLabel} unscored={q.scored===false}/>
        <h3 className="text-lg font-black leading-snug mb-5" style={{color:C.navy,fontFamily:'Georgia,serif',letterSpacing:'-0.01em'}}>{q.question}</h3>

        {q.type==='rapid-fire-tf'    &&<RapidFireTF        q={q} onFinish={finish}/>}
        {q.type==='mcq'              &&<MCQ                q={q} onFinish={finish}/>}
        {q.type==='bucket-sort'      &&<BucketSort         q={q} onFinish={finish}/>}
        {q.type==='fill-in-blank'    &&<FillInBlank        q={q} onFinish={finish}/>}
        {q.type==='reflection-multi' &&<ReflectionMultiSelect q={q} onFinish={finish}/>}

        {done&&fbText&&<FeedbackPanel correct={correct||isReflection} text={fbText} bridge={q.bridge} meta={fbMeta} reflection={isReflection}/>}

        {done&&(
          <div className="mt-4 su">
            <ChunkyBtn onClick={onNext} fill={C.gold} edge={GOLD_EDGE} ink={C.navy}
              label={<span>{qNum>=SCORED_COUNT?'Complete lesson':'Next'} <ArrowRight className="w-4 h-4 inline ml-1 -mt-0.5"/></span>}/>
          </div>
        )}
      </div>
    </div>
  );
}

// ================================================================
// MAIN APP
// ================================================================
export default function DEANY_HB1_L2({onBack, onHome}={}){
  const [screen,      setScreen]     = useState('intro');
  const [flowIdx,     setFlowIdx]    = useState(0);
  const [score,       setScore]      = useState(0);
  const [results,     setResults]    = useState([]);
  const [streak,      setStreak]     = useState(0);
  const [streakFlash, setStreakFlash]= useState(false);
  const [confetti,    setConfetti]   = useState(false);
  const [confidence,  setConfidence] = useState(3);
  const [wrongQs,     setWrongQs]    = useState([]);
  const [retryIdx,    setRetryIdx]   = useState(0);
  const [retryFixed,  setRetryFixed] = useState(0);
  const [retryDone,   setRetryDone]  = useState(false);

  const qDoneNum=FLOW.slice(0,flowIdx).filter(f=>f.type==='question'&&f.data.scored!==false).length;
  const current=FLOW[flowIdx];

  const handleAnswer=useCallback((correct,pts,flags={})=>{
    const isScored=flags.scored!==false;
    if(isScored)setResults(r=>[...r,{correct}]);
    if(correct&&isScored){
      setScore(s=>s+pts);
      setStreak(s=>{const n=s+1;if(n>=3){setStreakFlash(true);setTimeout(()=>setStreakFlash(false),2200);}return n;});
    } else if(isScored){setStreak(0);}
    if(!correct&&isScored&&flags.q){setWrongQs(w=>[...w,flags.q]);}
  },[]);

  const advance=useCallback(()=>{
    window.scrollTo({top:0,behavior:'smooth'});
    if(flowIdx<FLOW.length-1){setFlowIdx(i=>i+1);}
    else{setScreen('complete');snd.fanfare();haptic(20);setConfetti(true);setTimeout(()=>setConfetti(false),5000);}
  },[flowIdx]);

  const startRetry=useCallback(()=>{
    window.scrollTo({top:0,behavior:'smooth'});
    setRetryIdx(0);setRetryFixed(0);setScreen('retry');
  },[]);
  const retryAnswer=useCallback((correct)=>{ if(correct)setRetryFixed(f=>f+1); },[]);
  const retryNext=useCallback(()=>{
    window.scrollTo({top:0,behavior:'smooth'});
    if(retryIdx<wrongQs.length-1){setRetryIdx(i=>i+1);}
    else{setRetryDone(true);setScreen('complete');}
  },[retryIdx,wrongQs.length]);

  // ── INTRO ─────────────────────────────────────────────────────
  if(screen==='intro') return(
    <div className="min-h-screen relative overflow-hidden" style={PAGE_BG}>
      <IslamicBg/><style>{STYLES}</style>
      <div className="relative z-10 max-w-md mx-auto px-4 py-7">
        {onBack&&(
          <button type="button" onClick={onBack} aria-label="Back" className="flex items-center gap-1 mb-4 text-sm font-medium" style={{color:C.mid,background:'none',border:'none',cursor:'pointer'}}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 3l-5 5 5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg> Back
          </button>
        )}
        <div className="text-center mb-9 su">
          <span className="inline-block px-4 py-2 rounded-full text-xs font-black mb-4" style={{background:'rgba(255,255,255,0.75)',color:C.teal,letterSpacing:'0.10em',border:`1px solid ${rgba(C.border,0.9)}`,boxShadow:`0 10px 24px ${rgba(C.navy,0.06)}`}}>
            H-B1 · LESSON 1.2
          </span>
          <h1 className="text-3xl font-black mb-3" style={{color:C.navy,fontFamily:'Georgia,serif',letterSpacing:'-0.055em'}}>The Land and Its People</h1>
          <p className="text-base leading-7 max-w-xl mx-auto" style={{color:C.mid}}>Geography, trade routes, and the tribal world that shaped pre-Islamic Arabia.</p>
        </div>
        <div className="rounded-[24px] p-5 border su" style={CARD}>
          <div className="rounded-xl p-4 mb-5 border" style={{background:rgba(C.tealLight,0.55),borderColor:rgba(C.teal,0.18)}}>
            <div className="text-xs font-bold mb-1" style={{color:C.teal}}>From L1.1</div>
            <p className="text-xs leading-relaxed" style={{color:C.dark}}>
              In the last lesson, you learned that the Prophet Muhammad صَلَّى اللَّٰهُ عَلَيْهِ وَسَلَّمَ was the final link in a chain of Prophets stretching back to Adam عَلَيْهِ السَّلَام  -  and that his ancestor Ismail عَلَيْهِ السَّلَام settled in Arabia. Now we arrive in Arabia itself. What kind of land was it? Who lived there? Why did it matter to the ancient world?
            </p>
          </div>
          <div className="flex items-start gap-3 mb-5">
            <div className="rounded-full flex items-center justify-center flex-shrink-0" style={{width:'54px',height:'54px',fontSize:'1.65rem',background:`linear-gradient(135deg,${C.teal},${C.navy})`,boxShadow:`0 16px 34px ${rgba(C.teal,0.24)}`,border:`1px solid ${rgba(C.teal,0.32)}`}}>🗺️</div>
            <div className="rounded-2xl rounded-tl-sm p-5 border flex-1" style={{background:'rgba(255,255,255,0.78)',borderColor:rgba(C.border,0.9),boxShadow:`0 14px 34px ${rgba(C.navy,0.06)}`}}>
              <p className="text-sm" style={{color:C.dark}}>
                <strong style={{color:C.teal}}>Fulus:</strong> Arabia was not a backwater  -  it sat at the crossroads of the ancient world. By the end of this lesson, you will understand exactly why this land was the place the final message was sent. 🗺️
              </p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 mb-5">
            {[
              {icon:'🗺️', term:'The Peninsula', desc:'Geography shapes everything'},
              {icon:'⚔️', term:'The Tribes',    desc:'Loyalty, honour, vengeance'},
              {icon:'🏛️', term:'Two Empires',   desc:'Byzantine and Sasanian'},
            ].map((t,i)=>(
              <div key={i} className="text-center p-3 rounded-xl border" style={{background:rgba(C.tealLight,0.35),borderColor:rgba(C.teal,0.18)}}>
                <div className="text-xl mb-1">{t.icon}</div>
                <div className="text-xs font-bold" style={{color:C.navy}}>{t.term}</div>
                <div className="text-[10px]" style={{color:C.mid}}>{t.desc}</div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-3 gap-3 mb-5">
            {[
              {icon:<Clock className="w-4 h-4"/>, label:'12 min', sub:'Duration'},
              {icon:<Target className="w-4 h-4"/>, label:'5 Qs', sub:'Questions'},
              {icon:<BookOpen className="w-4 h-4"/>, label:'L1 - L3', sub:'Difficulty'},
            ].map((m,i)=>(
              <div key={i} className="text-center p-3 rounded-xl border" style={{background:rgba(C.tealLight,0.25),borderColor:rgba(C.teal,0.1)}}>
                <div className="flex justify-center mb-1" style={{color:C.teal}}>{m.icon}</div>
                <div className="text-sm font-bold" style={{color:C.navy}}>{m.label}</div>
                <div className="text-[10px]" style={{color:C.mid}}>{m.sub}</div>
              </div>
            ))}
          </div>
          <ChunkyBtn onClick={()=>setScreen('lesson')}
            label={<span>Begin Lesson <ArrowRight className="w-4 h-4 inline ml-1 -mt-0.5"/></span>}/>
        </div>
      </div>
    </div>
  );

  // ── COMPLETE ──────────────────────────────────────────────────
  if(screen==='complete'){
    const total=SCORED_COUNT, correct=results.filter(r=>r.correct).length;
    const pct=Math.round((correct/total)*100);
    const ring=pct>=80?C.green:pct>=60?C.gold:C.teal;
    const circ=2*Math.PI*36, offset=circ-(pct/100)*circ;
    return(
      <div className="min-h-screen relative overflow-hidden" style={PAGE_BG}>
        <IslamicBg/><style>{STYLES}</style>
        {confetti&&<Confetti/>}
        <div className="relative z-10 max-w-md mx-auto px-4 py-7">
          <div className="rounded-[24px] p-6 border text-center su" style={CARD}>
            <div className="text-4xl mb-3">🗺️</div>
            <h1 className="text-2xl font-bold mb-1" style={{color:C.navy,fontFamily:'Georgia,serif'}}>Lesson complete</h1>
            <p className="text-sm mb-4" style={{color:C.mid}}>The Land and Its People</p>
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold mb-6"
              style={{background:rgba(C.teal,0.15),color:C.teal,border:`1px solid ${rgba(C.teal,0.3)}`}}>
              <Award className="w-3.5 h-3.5"/> Arabia Unlocked 🗺️
            </div>
            <div className="relative inline-block mb-6">
              <svg width="96" height="96" className="-rotate-90">
                <circle cx="48" cy="48" r="36" fill="none" stroke={C.light} strokeWidth="6"/>
                <circle cx="48" cy="48" r="36" fill="none" stroke={ring} strokeWidth="6" strokeLinecap="round"
                  strokeDasharray={circ} strokeDashoffset={offset} style={{transition:'stroke-dashoffset 1.5s ease-out'}}/>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold" style={{color:C.navy,fontFamily:'Georgia,serif'}}>{correct}/{total}</span>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3 mb-6">
              {[{label:'Score',value:`${score} pts`,color:C.green,bg:C.greenLight},{label:'Accuracy',value:`${pct}%`,color:C.gold,bg:C.goldLight},{label:'Level',value:'L1-L3',color:C.purple,bg:rgba(C.purple,0.1)}].map((s,i)=>(
                <div key={i} className="p-3 rounded-xl border" style={{background:s.bg,borderColor:rgba(s.color,0.18)}}>
                  <div className="text-lg font-bold" style={{color:s.color}}>{s.value}</div>
                  <div className="text-[10px]" style={{color:C.mid}}>{s.label}</div>
                </div>
              ))}
            </div>
            <div className="text-left p-4 rounded-xl mb-5" style={{background:rgba(C.greenLight,0.7),border:`1px solid ${rgba(C.green,0.18)}`}}>
              <div className="text-xs font-bold mb-2" style={{color:C.green}}>Concepts mastered</div>
              {[
                'Arabian Peninsula geography: Hijaz, Najd, Yemen and their significance',
                'The two trade routes crossing at Makkah: north-south and east-west',
                'The tribal code: Asabiyyah, Muruah, and Tha\'r',
                'Arabia between the Byzantine and Sasanian Empires',
              ].map((c,i)=>(
                <div key={i} className="flex items-start gap-2 py-0.5">
                  <CheckCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{color:C.green}}/>
                  <span className="text-xs" style={{color:C.dark}}>{c}</span>
                </div>
              ))}
            </div>
            <div className="rounded-xl p-4 mb-5" style={{background:C.goldLight,border:`1px solid ${rgba(C.gold,0.25)}`}}>
              <div className="text-xs font-bold mb-1.5" style={{color:C.gold}}>How confident do you feel?</div>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-[10px] w-16 text-right" style={{color:C.mid}}>Still unsure</span>
                <input type="range" min="1" max="5" value={confidence} onChange={e=>setConfidence(+e.target.value)}
                  className="flex-1 h-2 rounded-full cursor-pointer" style={{accentColor:C.gold}}/>
                <span className="text-[10px] w-20" style={{color:C.mid}}>Very confident</span>
              </div>
              <p className="text-xs text-center" style={{color:C.dark}}>
                {confidence<=2?'The geography takes time to settle. It will come back in every subsequent lesson.':confidence===3?'Good foundation. L1.3 will build directly on what you just learned.':'You have the picture clearly. Everything from here will feel grounded.'}
              </p>
            </div>
            <div className="p-4 rounded-xl mb-5" style={{background:rgba(C.teal,0.07),border:`1px solid ${rgba(C.teal,0.16)}`}}>
              <div className="text-xs font-bold mb-1" style={{color:C.teal}}>Up next</div>
              <div className="text-sm font-semibold mb-0.5" style={{color:C.navy}}>L1.3: Jahiliyyah  -  Life Without Revelation</div>
              <div className="text-xs" style={{color:C.mid}}>We go inside this society: what did people worship? What did they value? What did they get wrong  -  and what did they get right?</div>
            </div>
            {wrongQs.length>0&&!retryDone&&(
              <div className="mb-3">
                <ChunkyBtn onClick={startRetry}
                  label={`Redo the ${wrongQs.length} you missed`}/>
              </div>
            )}
            {retryDone&&(
              <div className="flex items-center justify-center gap-1.5 mb-3 text-xs font-bold" style={{color:C.green}}>
                <CheckCircle className="w-3.5 h-3.5"/> Retry: fixed {retryFixed} of {wrongQs.length}
              </div>
            )}
            <ChunkyBtn className="pls" fill={C.gold} edge={GOLD_EDGE} ink={C.navy}
              onClick={()=>onHome&&onHome()}
              label={<span>Next Lesson <ArrowRight className="w-4 h-4 inline ml-1 -mt-0.5"/></span>}/>
          </div>
        </div>
      </div>
    );
  }

  // ── RETRY MISSED QUESTIONS ────────────────────────────────────
  if(screen==='retry'){
    const rq=wrongQs[retryIdx];
    return(
      <div className="min-h-screen relative overflow-hidden" style={PAGE_BG}>
        <IslamicBg/><style>{STYLES}</style>
        <div className="relative z-10 max-w-md mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold px-3 py-1.5 rounded-full" style={{background:rgba(C.teal,0.12),color:C.teal,border:`1px solid ${rgba(C.teal,0.25)}`}}>
              Retry · {retryIdx+1} of {wrongQs.length}
            </span>
            <span className="text-[10px]" style={{color:C.mid}}>Practice run - your score stands</span>
          </div>
          <QuestionCard key={'retry'+retryIdx} q={rq} qNum={0} totalQ={wrongQs.length}
            onAnswer={retryAnswer} onNext={retryNext}/>
        </div>
      </div>
    );
  }

  // ── LESSON ────────────────────────────────────────────────────
  return(
    <div className="min-h-screen relative overflow-hidden" style={PAGE_BG}>
      <IslamicBg/><style>{STYLES}</style>

      {streakFlash&&(
        <div className="fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-2 rounded-full shadow-lg su"
          style={{background:`linear-gradient(135deg,${C.gold},${C.orange})`,color:C.navy}}>
          <Flame className="w-4 h-4"/><span className="text-sm font-bold">{streak} Streak! 🔥</span>
        </div>
      )}

      <div className="relative z-10 max-w-md mx-auto px-4 py-6">
        <div className="sticky top-4 z-30 flex items-center justify-between mb-5 rounded-2xl px-4 py-3" style={{background:'rgba(255,255,255,0.74)',backdropFilter:'blur(16px)',border:`1px solid ${rgba(C.border,0.86)}`,boxShadow:`0 16px 40px ${rgba(C.navy,0.08)}`}}>
          <div className="flex items-center gap-2">
            {onBack&&(
              <button type="button" onClick={onBack} aria-label="Back" className="flex items-center justify-center" style={{width:32,height:32,borderRadius:999,color:C.mid,background:'none',border:'none',cursor:'pointer'}}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 3l-5 5 5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
            )}
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm" style={{background:rgba(C.teal,0.15),color:C.teal}}>🗺️</div>
            <div>
              <div className="text-xs font-bold" style={{color:C.navy}}>Lesson H-B1.2</div>
              <div className="text-[10px]" style={{color:C.mid}}>The Land and Its People</div>
            </div>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold" style={{background:C.goldLight,color:C.gold}}>
            <Star className="w-3 h-3" fill={C.gold}/> {score}
          </div>
        </div>

        <ProgressBar qNum={qDoneNum} totalQ={SCORED_COUNT} score={score}/>

        {current.type==='section'&&(
          <SectionCard key={`s${flowIdx}`} section={current.data} onContinue={advance}/>
        )}
        {current.type==='question'&&(
          <QuestionCard key={`q${flowIdx}`} q={current.data} qNum={qDoneNum} totalQ={SCORED_COUNT} onAnswer={handleAnswer} onNext={advance}/>
        )}
      </div>
    </div>
  );
}
