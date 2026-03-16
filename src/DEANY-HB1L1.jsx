import React, { useState, useRef, useCallback, useEffect } from 'react';
import { CheckCircle, XCircle, ArrowRight, Flame, Star, BookOpen, Clock, Target, GripVertical, Award, ChevronUp, ChevronDown, ChevronLeft, Home } from 'lucide-react';

// ================================================================
// TOKENS
// ================================================================
const C = {
  navy:       '#1B2A4A', gold:      '#C5A55A', goldLight: '#F5EDD6',
  teal:       '#2A7B88', tealLight: '#E0F2F4', coral:     '#D4654A',
  coralLight: '#FDEAE5', green:     '#3A8B5C', greenLight:'#E5F5EC',
  orange:     '#E8872B', orangeLight:'#FEF3E5',purple:    '#6B4C9A',
  dark:       '#3D3D3D', mid:       '#6B6B6B', light:     '#F2F2F2',
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
  @keyframes coralIn  { from{opacity:0} to{opacity:1} }
  .su        { animation: slideUp   0.32s ease-out both }
  .fi        { animation: fadeIn    0.22s ease-out both }
  .shk       { animation: shake     0.28s ease both }
  .pop       { animation: pop       0.36s cubic-bezier(.17,.67,.35,1.3) both }
  .pls       { animation: pulse     1.6s ease-in-out infinite }
  .focus-ring{ animation: focusRing 0.35s cubic-bezier(.4,0,.2,1) both }
  .escape-in { animation: escapeIn  0.28s cubic-bezier(.4,0,.2,1) both }
  .draw-line { animation: drawLine  1.1s cubic-bezier(.4,0,.2,1) forwards }
  .node-in   { animation: nodeIn    0.4s cubic-bezier(.34,1.56,.64,1) both }
  .coral-in  { animation: coralIn   0.6s ease-out both }

  @import url('https://fonts.googleapis.com/css2?family=Amiri:ital@0;1&display=swap');
  @font-face {
    font-family: 'AmiriArabic';
    src: url('https://fonts.gstatic.com/s/amiri/v27/J7aRnpd8CGxBHqUpvrIw74NL.woff2') format('woff2'),
         local('Amiri');
    unicode-range: U+0600-06FF, U+0750-077F, U+FB50-FDFF, U+FE70-FEFF;
  }
  /* Apply Amiri to all Arabic characters inline */
  :lang(ar), [dir="rtl"], .swt { font-family: 'Amiri', 'AmiriArabic', serif !important; }
  .swt, .honorific {
    font-family: 'Amiri', 'AmiriArabic', serif !important;
    font-size: 1.05em;
    display: inline;
  }
`;

function rgba(hex, a=1){
  const r=parseInt(hex.slice(1,3),16), g=parseInt(hex.slice(3,5),16), b=parseInt(hex.slice(5,7),16);
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
const PAGE_BG  = {background:'linear-gradient(150deg,#eef8f4 0%,#f0f9f6 35%,#edf5fb 70%,#f4f9ee 100%)'};
const CARD     = {background:'rgba(255,255,255,0.78)',backdropFilter:'blur(16px)'};

// ================================================================
// SHARED UI
// ================================================================
function IslamicBg(){
  return(
    <svg className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden="true">
      <defs>
        <pattern id="iphb" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
          <path d="M30 0L60 30L30 60L0 30Z" fill="none" stroke={C.gold} strokeWidth="0.5" opacity="0.04"/>
          <circle cx="30" cy="30" r="12" fill="none" stroke={C.gold} strokeWidth="0.3" opacity="0.04"/>
          <path d="M30 18L42 30L30 42L18 30Z" fill="none" stroke={C.teal} strokeWidth="0.4" opacity="0.03"/>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#iphb)"/>
    </svg>
  );
}
function Confetti(){
  const items=useRef(Array.from({length:42},(_,i)=>({
    id:i, left:`${Math.random()*100}%`, size:13+Math.random()*12,
    dur:2+Math.random()*2.5, delay:Math.random()*1,
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
function Mascot({size='md'}){
  const sz={sm:'36px',md:'48px',lg:'64px'}, fs={sm:'1.1rem',md:'1.5rem',lg:'2.2rem'};
  return(
    <div className="rounded-full flex items-center justify-center flex-shrink-0" style={{
      width:sz[size],height:sz[size],fontSize:fs[size],
      background:`linear-gradient(135deg,${C.gold},${C.orange})`,
      boxShadow:`0 4px 16px ${rgba(C.gold,0.45)}`,
    }}>📜</div>
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
        <div className="h-full rounded-full" style={{width:`${pct}%`,background:`linear-gradient(90deg,${C.gold},${C.orange})`,transition:'width 0.7s ease-out'}}/>
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
      {unscored&&<span className="text-xs px-2.5 py-1 rounded-full font-bold" style={{background:rgba(C.gold,0.15),color:C.gold}}>Discovery - not scored</span>}
    </div>
  );
}
function FeedbackPanel({correct,text,bridge,meta,reflection}){
  const sc=meta?(meta.ok===meta.total?C.green:meta.ok>=Math.ceil(meta.total*0.67)?C.gold:C.coral):correct?C.green:C.coral;
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
              <span className="text-xs px-2 py-0.5 rounded-full font-bold" style={{background:meta.ok===meta.total?C.green:meta.ok>=Math.ceil(meta.total*0.67)?C.gold:C.coral,color:'white'}}>
                {meta.ok===meta.total?'Perfect! ⭐':meta.ok>=Math.ceil(meta.total*0.67)?'Almost!':'Keep going'}
              </span>
            </div>
          ):(
            <div className="text-sm font-bold mb-1" style={{color:reflection?C.teal:correct?C.green:C.coral}}>
              {reflection?'Thank you for reflecting.':correct?'Correct!':'Not quite!'}
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

// ================================================================
// CREATION DIAGRAM - Section A concept card
// Amber line: the command Kun sits at the centre. It never moves.
// Everything  -  heavens, earth, water, life, Adam  -  expands from it.
// ================================================================
function CreationDiagram({onActivate}){
  const [step, setStep] = useState(0);
  const activated = useRef(false);
  const fire = ()=>{ if(!activated.current){ activated.current=true; onActivate&&onActivate(); } };

  // W=320, H=180 gives room for the full globe
  const W=320, H=180, CX=160, CY=90;
  const CR=64;   // cosmos circle radius (beats 0-2)
  const GR=82;   // globe radius (beat 3)
  const DOTS=[0,1,2,3];

  // Orthographic projection: centered on 30°E, 5°N
  // x = CX + GR * cos(lat) * sin(lon - 30°)
  // y = CY - GR * sin(lat)
  // (all angles in degrees)
  const d2r = Math.PI/180;
  const proj = (lat, lon) => ({
    x: CX + GR * Math.cos(lat*d2r) * Math.sin((lon-30)*d2r),
    y: CY - GR * Math.sin(lat*d2r),
  });

  return(
    <div style={{borderRadius:16,overflow:'hidden',marginBottom:20,
      border:`1.5px solid ${rgba(C.navy,0.1)}`,
      boxShadow:`0 2px 16px ${rgba(C.navy,0.06)}`}}>

      {/* STAGE */}
      <div style={{background:'#F7F9FC',position:'relative'}}>
        {/* Progress dots */}
        <div style={{position:'absolute',top:12,right:14,display:'flex',gap:6,zIndex:2}}>
          {DOTS.map(d=>(
            <div key={d} style={{
              width:d===step?18:6, height:6, borderRadius:3,
              background:d<step?rgba(C.gold,0.5):d===step?C.gold:rgba(C.navy,0.14),
              transition:'all 0.4s cubic-bezier(.4,0,.2,1)',
            }}/>
          ))}
        </div>

        <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{display:'block'}}>
          <defs>
            {/* Void gradient for beats 0-2 */}
            <radialGradient id="vbg" cx="50%" cy="50%" r="50%">
              <stop offset="0%"  stopColor="#1B2A4A"/>
              <stop offset="100%" stopColor="#06101e"/>
            </radialGradient>

            {/* Ocean gradient: lit from upper-left */}
            <radialGradient id="ocn" cx="35%" cy="30%" r="70%">
              <stop offset="0%"   stopColor="#1465a0"/>
              <stop offset="40%"  stopColor="#0a3d6e"/>
              <stop offset="100%" stopColor="#041e38"/>
            </radialGradient>

            {/* Land gradient: warm earth tones */}
            <radialGradient id="lnd" cx="50%" cy="50%" r="50%">
              <stop offset="0%"   stopColor="#4a7c45"/>
              <stop offset="100%" stopColor="#2d5228"/>
            </radialGradient>

            {/* Terminator: dark shadow on the right side */}
            <radialGradient id="term" cx="80%" cy="50%" r="50%">
              <stop offset="0%"   stopColor="rgba(0,0,0,0.45)"/>
              <stop offset="100%" stopColor="rgba(0,0,0,0)"/>
            </radialGradient>

            {/* Atmosphere outer glow */}
            <radialGradient id="atm" cx="50%" cy="50%" r="50%">
              <stop offset="86%" stopColor="transparent"/>
              <stop offset="94%" stopColor="rgba(80,180,255,0.25)"/>
              <stop offset="100%" stopColor="rgba(80,180,255,0.04)"/>
            </radialGradient>

            {/* Clip paths */}
            <clipPath id="cc"><circle cx={CX} cy={CY} r={CR}/></clipPath>
            <clipPath id="gc"><circle cx={CX} cy={CY} r={GR}/></clipPath>
          </defs>

          {/* ─── BEATS 0-2: cosmos circle ─── */}
          {step<3&&(
            <circle cx={CX} cy={CY} r={CR} fill="url(#vbg)"/>
          )}

          {/* Stars: beats 1-2 only */}
          {step>=1&&step<3&&(
            <g className="fi">
              {[[125,44],[184,40],[140,92],[188,86],[115,108],[200,56],[150,120],
                [120,74],[180,110],[134,58],[176,70],[144,88],[108,62],[196,98]].map(([sx,sy],i)=>(
                <circle key={i} cx={sx} cy={sy} r={0.7+i%3*0.4}
                  fill="white" opacity={0.12+i%4*0.08}
                  clipPath="url(#cc)"/>
              ))}
            </g>
          )}

          {/* Beat 2: heavens and earth  -  clean split, no water */}
          {step===2&&(
            <g className="fi">
              {/* Heavens  -  upper half, teal tint */}
              <path d={`M ${CX-CR},${CY} A ${CR},${CR} 0 0,1 ${CX+CR},${CY} Z`}
                fill="rgba(42,123,136,0.28)" clipPath="url(#cc)"/>
              {/* Earth  -  lower half, green tint */}
              <path d={`M ${CX-CR},${CY} A ${CR},${CR} 0 0,0 ${CX+CR},${CY} Z`}
                fill="rgba(58,139,92,0.28)" clipPath="url(#cc)"/>
              {/* Hairline separator */}
              <line x1={CX-CR+6} y1={CY} x2={CX+CR-6} y2={CY}
                stroke="rgba(255,255,255,0.22)" strokeWidth="0.8"
                clipPath="url(#cc)"/>
              <text x={CX} y={CY-18} textAnchor="middle" fontSize="9.5"
                fill="rgba(255,255,255,0.55)" fontFamily="system-ui,sans-serif"
                letterSpacing="0.08em">HEAVENS</text>
              <text x={CX} y={CY+26} textAnchor="middle" fontSize="9.5"
                fill="rgba(255,255,255,0.55)" fontFamily="system-ui,sans-serif"
                letterSpacing="0.08em">EARTH</text>
            </g>
          )}

          {/* Kun point  -  beats 1-2 only */}
          {step>=1&&step<3&&(
            <g style={{animation:step===1?'nodeIn 0.6s cubic-bezier(.34,1.56,.64,1) both':'none'}}>
              {/* Outer pulse ring */}
              <circle cx={CX} cy={CY} r={step===1?14:8}
                fill="none" stroke={C.gold}
                strokeWidth={step===1?1.5:1}
                opacity={step===1?0.4:0.2}
                style={{transition:'r 0.5s ease'}}/>
              {/* Core */}
              <circle cx={CX} cy={CY} r="5" fill={C.gold}/>
              {/* Labels only on step 1  -  hidden on step 2 to avoid overlap with HEAVENS/EARTH */}
              {step===1&&(
                <>
                  <text x={CX} y={CY-14} textAnchor="middle"
                    fontSize="13" fontWeight="700" fill={C.gold} fontFamily="serif">كُن</text>
                  <text x={CX} y={CY+20} textAnchor="middle"
                    fontSize="8.5" fill="rgba(255,255,255,0.38)"
                    fontFamily="system-ui,sans-serif">Be</text>
                </>
              )}
            </g>
          )}

          {/* Cosmos border ring  -  beats 0-2 */}
          {step<3&&(
            <circle cx={CX} cy={CY} r={CR}
              fill="none" stroke={rgba(C.gold,0.18)} strokeWidth="1.5"/>
          )}

          {/* ─── BEAT 3: GLOBE ─── */}
          {step>=3&&(
            <g className="fi">

              {/* Atmosphere halo  -  outermost */}
              <circle cx={CX} cy={CY} r={GR+10}
                fill="url(#atm)"/>
              <circle cx={CX} cy={CY} r={GR+5}
                fill="none" stroke="rgba(80,180,255,0.15)" strokeWidth="4"/>

              {/* Ocean base */}
              <circle cx={CX} cy={CY} r={GR} fill="url(#ocn)"/>

              {/* ── Latitude grid (very subtle) ── */}
              {/* Equator y=90, 30°N y=49, 30°S y=131 */}
              {[49, 90, 131].map((ly, i) => {
                const lat = [30,0,-30][i]*d2r;
                const hw = GR*Math.cos(lat);
                return(
                  <line key={i}
                    x1={CX-hw} y1={ly} x2={CX+hw} y2={ly}
                    stroke="rgba(255,255,255,0.06)" strokeWidth="0.8"
                    clipPath="url(#gc)"/>
                );
              })}

              {/* ── Longitude grid (ellipse arcs) ── */}
              {/* 0°E = Δλ -30° → semi-x = GR*sin30 = 41 → left half arc */}
              <path d={`M ${CX},${CY-GR} A 41,${GR} 0 0,0 ${CX},${CY+GR}`}
                fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="0.8"
                clipPath="url(#gc)"/>
              {/* 60°E = Δλ +30° → semi-x=41 → right half arc */}
              <path d={`M ${CX},${CY-GR} A 41,${GR} 0 0,1 ${CX},${CY+GR}`}
                fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="0.8"
                clipPath="url(#gc)"/>
              {/* Centre meridian: vertical line at CX */}
              <line x1={CX} y1={CY-GR} x2={CX} y2={CY+GR}
                stroke="rgba(255,255,255,0.05)" strokeWidth="0.8"
                clipPath="url(#gc)"/>

              {/* ── AFRICA ── (orthographic, centered 30°E) */}
              {/* Carefully traced silhouette - recognisable */}
              <path
                d={`
                  M ${proj(37,  -5).x},${proj(37, -5).y}
                  C ${proj(37,  10).x},${proj(37, 10).y}
                    ${proj(33,  25).x},${proj(33, 25).y}
                    ${proj(30,  32).x},${proj(30, 32).y}
                  C ${proj(22,  37).x},${proj(22, 37).y}
                    ${proj(15,  42).x},${proj(15, 42).y}
                    ${proj(12,  44).x},${proj(12, 44).y}
                  C ${proj( 8,  48).x},${proj( 8, 48).y}
                    ${proj( 5,  50).x},${proj( 5, 50).y}
                    ${proj( 0,  42).x},${proj( 0, 42).y}
                  C ${proj(-5,  35).x},${proj(-5, 35).y}
                    ${proj(-10, 18).x},${proj(-10,18).y}
                    ${proj(-17, 12).x},${proj(-17,12).y}
                  C ${proj(-25,  5).x},${proj(-25, 5).y}
                    ${proj(-30,-10).x},${proj(-30,-10).y}
                    ${proj(-30,-17).x},${proj(-30,-17).y}
                  C ${proj(-25,-28).x},${proj(-25,-28).y}
                    ${proj(-20,-32).x},${proj(-20,-32).y}
                    ${proj(-10,-35).x},${proj(-10,-35).y}
                  C ${proj(  0,-33).x},${proj(  0,-33).y}
                    ${proj( 15,-28).x},${proj( 15,-28).y}
                    ${proj( 25,-22).x},${proj( 25,-22).y}
                  C ${proj( 32,-16).x},${proj( 32,-16).y}
                    ${proj( 36, -5).x},${proj( 36, -5).y}
                    ${proj( 35,  0).x},${proj( 35,  0).y}
                  C ${proj( 33,  8).x},${proj( 33,  8).y}
                    ${proj( 30, 16).x},${proj( 30, 16).y}
                    ${proj( 30, 32).x},${proj( 30, 32).y}
                  M ${proj(37, -5).x},${proj(37, -5).y}
                  C ${proj(37, -15).x},${proj(37,-15).y}
                    ${proj(34, -12).x},${proj(34,-12).y}
                    ${proj(35,  0).x},${proj(35,  0).y}
                  Z
                `}
                fill="url(#lnd)" opacity="0.85"
                clipPath="url(#gc)"/>

              {/* ── ARABIAN PENINSULA ── */}
              <path
                d={`
                  M ${proj(29, 35).x},${proj(29, 35).y}
                  C ${proj(25, 38).x},${proj(25, 38).y}
                    ${proj(24, 44).x},${proj(24, 44).y}
                    ${proj(22, 50).x},${proj(22, 50).y}
                  C ${proj(18, 55).x},${proj(18, 55).y}
                    ${proj(14, 56).x},${proj(14, 56).y}
                    ${proj(12, 52).x},${proj(12, 52).y}
                  C ${proj(10, 48).x},${proj(10, 48).y}
                    ${proj(12, 44).x},${proj(12, 44).y}
                    ${proj(12, 44).x},${proj(12, 44).y}
                  C ${proj(15, 50).x},${proj(15, 50).y}
                    ${proj(20, 56).x},${proj(20, 56).y}
                    ${proj(24, 58).x},${proj(24, 58).y}
                  C ${proj(26, 56).x},${proj(26, 56).y}
                    ${proj(28, 52).x},${proj(28, 52).y}
                    ${proj(28, 48).x},${proj(28, 48).y}
                  C ${proj(28, 44).x},${proj(28, 44).y}
                    ${proj(29, 40).x},${proj(29, 40).y}
                    ${proj(29, 35).x},${proj(29, 35).y}
                  Z
                `}
                fill="url(#lnd)" opacity="0.85"
                clipPath="url(#gc)"/>

              {/* ── EURASIA (partial  -  top strip) ── */}
              <path
                d={`
                  M ${proj(42, -20).x},${proj(42,-20).y}
                  C ${proj(44,  10).x},${proj(44, 10).y}
                    ${proj(46,  40).x},${proj(46, 40).y}
                    ${proj(42,  60).x},${proj(42, 60).y}
                  C ${proj(40,  70).x},${proj(40, 70).y}
                    ${proj(38,  75).x},${proj(38, 75).y}
                    ${proj(35,  70).x},${proj(35, 70).y}
                  C ${proj(33,  65).x},${proj(33, 65).y}
                    ${proj(32,  55).x},${proj(32, 55).y}
                    ${proj(32,  45).x},${proj(32, 45).y}
                  C ${proj(32,  38).x},${proj(32, 38).y}
                    ${proj(34,  30).x},${proj(34, 30).y}
                    ${proj(35,  30).x},${proj(35, 30).y}
                  C ${proj(36,  25).x},${proj(36, 25).y}
                    ${proj(38,  20).x},${proj(38, 20).y}
                    ${proj(40,  10).x},${proj(40, 10).y}
                  C ${proj(40,   0).x},${proj(40,  0).y}
                    ${proj(40, -10).x},${proj(40,-10).y}
                    ${proj(42, -20).x},${proj(42,-20).y}
                  Z
                `}
                fill="url(#lnd)" opacity="0.75"
                clipPath="url(#gc)"/>

              {/* ── Specular ocean highlight (upper left) ── */}
              <ellipse cx={CX-28} cy={CY-28} rx="22" ry="14"
                fill="rgba(255,255,255,0.06)"
                transform={`rotate(-30,${CX-28},${CY-28})`}
                clipPath="url(#gc)"/>
              <ellipse cx={CX-18} cy={CY-36} rx="8" ry="5"
                fill="rgba(255,255,255,0.1)"
                transform={`rotate(-30,${CX-18},${CY-36})`}
                clipPath="url(#gc)"/>

              {/* ── Terminator (day/night shadow, right side) ── */}
              <circle cx={CX} cy={CY} r={GR} fill="url(#term)"
                clipPath="url(#gc)"/>


              {/* Globe edge */}
              <circle cx={CX} cy={CY} r={GR}
                fill="none" stroke="rgba(100,180,255,0.2)" strokeWidth="1"/>

            </g>
          )}

        </svg>
      </div>

      {/* WHITE PANEL */}
      <div style={{background:'white',borderTop:`1px solid ${rgba(C.navy,0.07)}`}}>

        {step===0&&(
          <div style={{padding:'20px 22px'}} className="su">
            <div style={{fontSize:10,fontWeight:700,letterSpacing:'0.08em',
              textTransform:'uppercase',color:C.mid,marginBottom:8}}>
              01 - before anything
            </div>
            <div style={{textAlign:'center',marginBottom:12,padding:'6px 0'}}>
              <span className="swt" style={{fontSize:28,color:C.gold,lineHeight:1.6,letterSpacing:2}}>
                اللَّٰه
              </span>
              <div className="swt" style={{fontSize:13,color:rgba(C.gold,0.6),marginTop:2}}>
                سُبْحَانَهُ وَتَعَالَى
              </div>
            </div>
            <div style={{fontSize:17,fontWeight:700,color:C.navy,
              fontFamily:'Georgia,serif',lineHeight:1.35,marginBottom:10}}>
              Before the universe existed, there was only Allah سُبْحَانَهُ وَتَعَالَى.
            </div>
            <p style={{fontSize:13,color:C.mid,lineHeight:1.65,marginBottom:20}}>
              No stars. No earth. No time. Islamic history does not begin with the Prophet صَلَّى اللَّٰهُ عَلَيْهِ وَسَلَّمَ. It does not even begin with Adam عَلَيْهِ السَّلَام. It begins at the very first moment of existence.
            </p>
            <button onClick={()=>{setStep(1);fire();}}
              style={{width:'100%',padding:'13px 0',borderRadius:10,fontSize:13,
                fontWeight:700,background:C.navy,color:'white',border:'none',cursor:'pointer'}}>
              See the moment of creation →
            </button>
          </div>
        )}

        {step===1&&(
          <div style={{padding:'20px 22px'}} className="su">
            <div style={{fontSize:10,fontWeight:700,letterSpacing:'0.08em',
              textTransform:'uppercase',color:C.gold,marginBottom:8}}>
              02 - the command
            </div>
            <div style={{fontSize:17,fontWeight:700,color:C.navy,
              fontFamily:'Georgia,serif',lineHeight:1.35,marginBottom:10}}>
              كُن  -  "Be." One word. Everything that exists follows.
            </div>
            <p style={{fontSize:13,color:C.mid,lineHeight:1.65,marginBottom:20}}>
              The gold point is that command. Every star, every mountain, every Prophet, every human being  -  all of it flows from this single point. It never moves. Everything else does.
            </p>
            <button onClick={()=>setStep(2)}
              style={{width:'100%',padding:'13px 0',borderRadius:10,fontSize:13,fontWeight:700,
                background:rgba(C.teal,0.1),color:C.teal,
                border:`1.5px solid ${rgba(C.teal,0.3)}`,cursor:'pointer'}}>
              See the heavens and earth split apart →
            </button>
          </div>
        )}

        {step===2&&(
          <div style={{padding:'20px 22px'}} className="su">
            <div style={{fontSize:10,fontWeight:700,letterSpacing:'0.08em',
              textTransform:'uppercase',color:C.teal,marginBottom:8}}>
              03 - split apart
            </div>
            <div style={{fontSize:17,fontWeight:700,color:C.navy,
              fontFamily:'Georgia,serif',lineHeight:1.35,marginBottom:12}}>
              One joined mass  -  split into heavens and earth.
            </div>
            <div style={{padding:'11px 14px',borderRadius:8,
              background:rgba(C.goldLight,0.65),border:`1px solid ${rgba(C.gold,0.28)}`,
              marginBottom:12,direction:'rtl',textAlign:'right',
              fontSize:13,lineHeight:1.9,color:C.navy,fontFamily:'serif'}}>
              أَوَلَمْ يَرَ ٱلَّذِينَ كَفَرُوٓا۟ أَنَّ ٱلسَّمَـٰوَٰتِ وَٱلْأَرْضَ كَانَتَا رَتْقًا فَفَتَقْنَـٰهُمَا
            </div>
            <p style={{fontSize:12,color:C.mid,lineHeight:1.7,marginBottom:8,fontStyle:'italic'}}>
              "Do the disbelievers not see that the heavens and the earth were joined together, and then We split them apart?"
            </p>
            <p style={{fontSize:11,color:rgba(C.navy,0.4),marginBottom:20}}>Quran 21:30</p>
            <button onClick={()=>setStep(3)}
              style={{width:'100%',padding:'13px 0',borderRadius:10,fontSize:13,fontWeight:700,
                background:C.navy,color:'white',border:'none',cursor:'pointer'}}>
              Zoom into earth →
            </button>
          </div>
        )}

        {step===3&&(
          <div style={{padding:'20px 22px'}} className="su">
            <div style={{fontSize:10,fontWeight:700,letterSpacing:'0.08em',
              textTransform:'uppercase',color:C.teal,marginBottom:8}}>
              04 - a world made ready
            </div>
            <div style={{fontSize:17,fontWeight:700,color:C.navy,
              fontFamily:'Georgia,serif',lineHeight:1.35,marginBottom:12}}>
              Water. Land. Life. The earth was prepared.
            </div>
            <div style={{padding:'10px 14px',borderRadius:8,
              background:rgba(C.tealLight,0.5),border:`1px solid ${rgba(C.teal,0.2)}`,
              marginBottom:12,direction:'rtl',textAlign:'right',
              fontSize:12,lineHeight:1.9,color:C.navy,fontFamily:'serif'}}>
              وَجَعَلْنَا مِنَ ٱلْمَآءِ كُلَّ شَىْءٍ حَىٍّ
            </div>
            <p style={{fontSize:12,color:C.mid,lineHeight:1.65,marginBottom:16,fontStyle:'italic'}}>
              "And We made from water every living thing." (Quran 21:30)
            </p>
            <div style={{padding:'12px 16px',borderRadius:10,
              background:rgba(C.goldLight,0.6),border:`1px solid ${rgba(C.gold,0.25)}`}}>
              <p style={{fontSize:12,color:C.dark,lineHeight:1.65,margin:0}}>
                The universe was not an accident. The earth was not random.
                It was all preparation.
              </p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

// ================================================================
// PROPHET CHAIN DIAGRAM
// One gold line. Six Prophets. Tap to learn about each one.
// ================================================================
function ProphetChainDiagram({onActivate}){
  const [selected, setSelected] = useState(null);
  const activated = useRef(false);

  const tap = (i) => {
    setSelected(i);
    if(!activated.current){ activated.current=true; onActivate&&onActivate(); }
  };

  const W=320, H=200;
  const PL=34, PR=30, CW=W-PL-PR; // 256
  const lineY = 100; // dead centre
  const nodeR = 13;
  const muhR  = 16;

  const xp = i => PL + (i/5)*CW;

  const PROPHETS = [
    {
      name:'Adam', arabic:'آدم', honorific:'عَلَيْهِ السَّلَام', calligraphy:'آدَمُ عَلَيْهِ السَّلَامُ', above:false, gold:false,
      role:'First human and first Prophet. Received the original message: worship Allah سُبْحَانَهُ وَتَعَالَى alone.',
      ref:'Quran 2:30',
    },
    {
      name:'Nuh',  arabic:'نوح', honorific:'عَلَيْهِ السَّلَام', calligraphy:'نُوحٌ عَلَيْهِ السَّلَامُ', above:true,  gold:false,
      role:'Called people back from idol worship. Preserved humanity through the Flood.',
      ref:'Quran 71:1',
    },
    {
      name:'Ibrahim', arabic:'إبراهيم', honorific:'عَلَيْهِ السَّلَام', calligraphy:'إِبْرَاهِيمُ عَلَيْهِ السَّلَامُ', above:false, gold:false,
      role:'Father of monotheism. Built the Kabah. Ancestor of the Arab tribes through Ismail عَلَيْهِ السَّلَام.',
      ref:'Quran 2:127',
    },
    {
      name:'Musa', arabic:'موسى', honorific:'عَلَيْهِ السَّلَام', calligraphy:'مُوسَى عَلَيْهِ السَّلَامُ', above:true,  gold:false,
      role:'Brought the Torah. Led Banu Israel  -  the largest prophetic mission before Islam.',
      ref:'Quran 20:9',
    },
    {
      name:'Isa',  arabic:'عيسى', honorific:'عَلَيْهِ السَّلَام', calligraphy:'عِيسَى عَلَيْهِ السَّلَامُ', above:false, gold:false,
      role:'Brought the Injil. Announced the coming of the final Prophet صَلَّى اللَّٰهُ عَلَيْهِ وَسَلَّمَ by name (Ahmad).',
      ref:'Quran 61:6',
    },
    {
      name:'Muhammad', arabic:'محمد', honorific:'صَلَّى اللَّٰهُ عَلَيْهِ وَسَلَّمَ', calligraphy:'مُحَمَّدٌ صَلَّى اللَّٰهُ عَلَيْهِ وَسَلَّمَ', above:true,  gold:true,
      role:'Seal of the Prophets. The final, universal message. The chain is complete.',
      ref:'Quran 33:40',
    },
  ];

  const sel = selected !== null ? PROPHETS[selected] : null;

  return(
    <div style={{
      borderRadius:16, overflow:'hidden', marginBottom:20,
      border:`1.5px solid ${rgba(C.navy,0.1)}`,
      boxShadow:`0 2px 20px ${rgba(C.navy,0.07)}`,
    }}>

      {/* ── STAGE ─────────────────────────────────────────────── */}
      <div style={{background:'#F7F9FC', position:'relative'}}>
        <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{display:'block'}}>

          {/* Subtle grid line at lineY */}
          <line x1={PL-10} y1={lineY} x2={W-PR+10} y2={lineY}
            stroke={rgba(C.navy,0.04)} strokeWidth="12" strokeLinecap="round"/>

          {/* Gold line */}
          <line x1={PL} y1={lineY} x2={W-PR} y2={lineY}
            stroke={C.gold} strokeWidth="2.5" strokeLinecap="round"/>

          {/* Prophets */}
          {PROPHETS.map((p, i) => {
            const cx  = xp(i);
            const r   = p.gold ? muhR : nodeR;
            const isSel = selected === i;

            // Label position
            const nameY = p.above ? lineY - r - 22 : lineY + r + 22;
            const arabicY = p.above ? nameY - 12 : nameY + 12;

            // Stem from node edge to label
            const stemY1 = p.above ? lineY - r - 3  : lineY + r + 3;
            const stemY2 = p.above ? lineY - r - 16 : lineY + r + 16;

            return (
              <g key={p.name}
                onClick={() => tap(i)}
                style={{cursor:'pointer'}}>

                {/* Selected ring */}
                {isSel && (
                  <circle cx={cx} cy={lineY} r={r+5}
                    fill="none"
                    stroke={p.gold ? C.gold : C.teal}
                    strokeWidth="2"
                    opacity="0.35"
                    style={{animation:'nodeIn 0.3s cubic-bezier(.34,1.56,.64,1) both'}}/>
                )}

                {/* Drop shadow */}
                <circle cx={cx+1} cy={lineY+1} r={r}
                  fill="rgba(0,0,0,0.12)"/>

                {/* Node */}
                <circle cx={cx} cy={lineY} r={r}
                  fill={isSel ? (p.gold ? C.gold : C.teal) : (p.gold ? C.gold : C.teal)}
                  opacity={isSel ? 1 : 0.75}
                  stroke="white"
                  strokeWidth="2"
                  style={{transition:'opacity 0.2s ease'}}/>

                {/* Number */}
                <text x={cx} y={lineY+4} textAnchor="middle"
                  fontSize={p.gold ? 9 : 8} fontWeight="700"
                  fill={p.gold ? C.navy : 'white'}
                  fontFamily="system-ui,sans-serif">
                  {i+1}
                </text>

                {/* Stem */}
                <line x1={cx} y1={stemY1} x2={cx} y2={stemY2}
                  stroke={isSel ? (p.gold ? C.gold : C.teal) : rgba(C.navy,0.2)}
                  strokeWidth="1"
                  style={{transition:'stroke 0.2s ease'}}/>

                {/* Name */}
                <text x={cx} y={nameY} textAnchor="middle"
                  fontSize="9" fontWeight={isSel ? '700' : '500'}
                  fill={isSel ? (p.gold ? C.gold : C.teal) : rgba(C.navy,0.45)}
                  fontFamily="system-ui,sans-serif"
                  style={{transition:'fill 0.2s ease, font-weight 0.2s ease'}}>
                  {p.name}
                </text>

                {/* Arabic name */}
                <text x={cx} y={arabicY} textAnchor="middle"
                  fontSize="8" direction="rtl"
                  fill={isSel ? (p.gold ? rgba(C.gold,0.7) : rgba(C.teal,0.65)) : rgba(C.navy,0.22)}
                  fontFamily="serif"
                  style={{transition:'fill 0.2s ease'}}>
                  {p.arabic}
                </text>

              </g>
            );
          })}

        </svg>
      </div>

      {/* ── PANEL ─────────────────────────────────────────────── */}
      <div style={{background:'white', borderTop:`1px solid ${rgba(C.navy,0.07)}`}}>
        {sel ? (
          <div style={{padding:'18px 22px'}} className="su">
            {/* Calligraphy title */}
            <div style={{textAlign:'center', marginBottom:10, padding:'8px 0 6px',
              borderBottom:`1px solid ${rgba(sel.gold ? C.gold : C.teal, 0.12)}`}}>
              <span className="honorific" style={{
                fontSize:20, color: sel.gold ? C.gold : C.teal,
                direction:'rtl', lineHeight:1.8, letterSpacing:1,
              }}>
                {sel.calligraphy}
              </span>
            </div>
            {/* Name + ref row */}
            <div style={{display:'flex', alignItems:'baseline', gap:10, marginBottom:8}}>
              <span style={{
                fontSize:17, fontWeight:700, color: sel.gold ? C.gold : C.navy,
                fontFamily:'Georgia,serif',
              }}>
                {sel.name}
              </span>
              <span className="honorific" style={{fontSize:12, color:rgba(C.navy,0.45)}}>
                {sel.honorific}
              </span>
              <span style={{marginLeft:'auto', fontSize:10, color:rgba(C.navy,0.3),
                fontWeight:600}}>{sel.ref}</span>
            </div>
            {/* Role */}
            <p style={{fontSize:13, color:C.mid, lineHeight:1.65, margin:0}}>
              {sel.role}
            </p>
          </div>
        ) : (
          <div style={{padding:'18px 22px', textAlign:'center'}}>
            <p style={{fontSize:13, color:rgba(C.navy,0.35), margin:0, fontStyle:'italic'}}>
              Tap any Prophet to learn about their role in the chain.
            </p>
          </div>
        )}
      </div>

    </div>
  );
}

// ================================================================
// QURAN CARD
// ================================================================
function QuranCard({arabic, translation, ref_text, note}){
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

// ================================================================
// QUESTION RENDERERS
// ================================================================

// --- SEQUENCE ORDER (Q1 - 6 prophets) ---
function SequenceOrder({q, onFinish}){
  const shuffleOnce=useRef(null);
  if(!shuffleOnce.current){ shuffleOnce.current=[...q.items].sort(()=>Math.random()-0.5); }
  const [order,    setOrder]    = useState(shuffleOnce.current);
  const [sub,      setSub]      = useState(false);
  const [results,  setResults]  = useState(null);
  const [dragging, setDragging] = useState(null);
  const [dragOver, setDragOver] = useState(null);
  const lockedRef = useRef(false);

  const moveUp  =(idx)=>{ if(idx===0||sub)return; const n=[...order]; [n[idx-1],n[idx]]=[n[idx],n[idx-1]]; setOrder(n); };
  const moveDown=(idx)=>{ if(idx===order.length-1||sub)return; const n=[...order]; [n[idx],n[idx+1]]=[n[idx+1],n[idx]]; setOrder(n); };

  const onDragStart=(e,idx)=>{ e.dataTransfer.effectAllowed='move'; setDragging(idx); };
  const onDragOver =(e,idx)=>{ e.preventDefault(); setDragOver(idx); };
  const onDrop     =(e,idx)=>{ e.preventDefault(); if(dragging===null||dragging===idx)return; const n=[...order]; const[m]=n.splice(dragging,1); n.splice(idx,0,m); setOrder(n); setDragging(null); setDragOver(null); };
  const onDragEnd  =()=>{ setDragging(null); setDragOver(null); };

  const submit=()=>{
    if(sub||lockedRef.current)return;
    lockedRef.current=true; setSub(true);
    const res=order.map((item,i)=>item.pos===i+1);
    setResults(res);
    const ok=res.filter(Boolean).length;
    const total=q.items.length;
    const fbText=ok===total?q.feedback.perfect:ok>=4?q.feedback.good:q.feedback.low;
    onFinish(ok>=5,fbText,ok===total?10:ok>=4?7:ok*2,{ok,total,isUnscored:false});
  };

  return(
    <div>
      <p className="text-xs mb-3" style={{color:C.mid}}>
        {sub?'Results shown. The correct chain is the foundation of this lesson.':'Drag or use arrows to arrange earliest to most recent.'}
      </p>
      <div className="space-y-2 mb-4">
        {order.map((item,i)=>{
          const isCorrect=results?results[i]:null;
          const isDrag=dragging===i, isDragTarget=dragOver===i&&dragging!==i;
          return(
            <div key={item.id}
              draggable={!sub}
              onDragStart={e=>onDragStart(e,i)} onDragOver={e=>onDragOver(e,i)}
              onDrop={e=>onDrop(e,i)} onDragEnd={onDragEnd}
              className="flex items-center gap-2 rounded-xl border-2 transition-all"
              style={{
                background:isCorrect===true?C.greenLight:isCorrect===false?C.coralLight:isDragTarget?rgba(C.gold,0.08):'white',
                borderColor:isCorrect===true?C.green:isCorrect===false?C.coral:isDrag?C.gold:isDragTarget?rgba(C.gold,0.45):'#e5e7eb',
                opacity:isDrag?0.5:1, cursor:sub?'default':'grab',
                boxShadow:isDrag?`0 8px 24px ${rgba(C.navy,0.14)}`:'none',
              }}>
              <div className="p-3 flex-shrink-0" style={{color:C.mid}}><GripVertical className="w-4 h-4"/></div>
              <div className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-[10px] font-black"
                style={{background:isCorrect===true?C.green:isCorrect===false?C.coral:rgba(C.navy,0.08),color:isCorrect!==null?'white':C.navy}}>
                {i+1}
              </div>
              <div className="flex-1 py-3 pr-2">
                <div className="text-sm font-bold" style={{color:C.dark}}>{item.name} {item.honorific}</div>
                {sub&&isCorrect===false&&(
                  <div className="text-[9px] mt-0.5" style={{color:C.mid}}>should be position <span className="font-black" style={{color:C.teal}}>#{item.pos}</span></div>
                )}
                {sub&&isCorrect===true&&(
                  <div className="text-[9px] mt-0.5 font-bold" style={{color:C.green}}>{item.contribution}</div>
                )}
              </div>
              {!sub&&(
                <div className="flex flex-col gap-0.5 pr-2 flex-shrink-0">
                  <button onClick={()=>moveUp(i)} disabled={i===0} className="w-6 h-6 rounded flex items-center justify-center" style={{background:i===0?'transparent':rgba(C.navy,0.06),color:i===0?'#ddd':C.navy}}><ChevronUp className="w-3.5 h-3.5"/></button>
                  <button onClick={()=>moveDown(i)} disabled={i===order.length-1} className="w-6 h-6 rounded flex items-center justify-center" style={{background:i===order.length-1?'transparent':rgba(C.navy,0.06),color:i===order.length-1?'#ddd':C.navy}}><ChevronDown className="w-3.5 h-3.5"/></button>
                </div>
              )}
              {sub&&isCorrect===true&&<CheckCircle className="w-4 h-4 mr-3 flex-shrink-0 pop" style={{color:C.green}}/>}
              {sub&&isCorrect===false&&<XCircle className="w-4 h-4 mr-3 flex-shrink-0" style={{color:C.coral}}/>}
            </div>
          );
        })}
      </div>
      {!sub&&(
        <button onClick={submit} className="w-full py-3 rounded-xl font-bold text-sm"
          style={{background:`linear-gradient(135deg,${C.navy},${C.teal})`,color:'white'}}>
          Check my order →
        </button>
      )}
    </div>
  );
}

// --- MCQ ---
function MCQ({q, onFinish}){
  const [sel, setSel] = useState(null);
  const [sub, setSub] = useState(false);
  const [shk, setShk] = useState(null);
  const lockedRef = useRef(false);

  const submit=()=>{
    if(sel===null||sub||lockedRef.current)return;
    lockedRef.current=true;
    const opt=q.options[sel];
    setSub(true);
    if(!opt.correct){ setShk(sel); setTimeout(()=>setShk(null),500); }
    onFinish(opt.correct, q.feedback[opt.id], opt.correct?10:0);
  };

  return(
    <div>
      <div className="grid grid-cols-1 gap-2.5 mb-4">
        {q.options.map((opt,i)=>{
          const isSel=sel===i, right=sub&&opt.correct, wrong=sub&&isSel&&!opt.correct;
          return(
            <button key={opt.id} disabled={sub} onClick={()=>!sub&&setSel(i)}
              className={`relative p-4 rounded-xl text-left text-sm font-medium border-2 transition-all ${shk===i?'shk':''}`}
              style={{
                background:right?C.greenLight:wrong?C.coralLight:isSel&&!sub?C.navy:'white',
                borderColor:right?C.green:wrong?C.coral:isSel&&!sub?C.navy:'#ddd',
                color:isSel&&!sub&&!right?'white':C.dark,
              }}>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full border-2 flex-shrink-0 mt-0.5 flex items-center justify-center text-xs font-bold"
                  style={{borderColor:right?C.green:wrong?C.coral:isSel&&!sub?'rgba(255,255,255,0.5)':'#d1d5db',
                    background:right?C.green:wrong?C.coral:'transparent',
                    color:right||wrong?'white':isSel&&!sub?'rgba(255,255,255,0.7)':'#9ca3af'}}>
                  {opt.id.toUpperCase()}
                </div>
                <span className="flex-1 leading-snug">{opt.text}</span>
                {right&&<CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5 pop" style={{color:C.green}}/>}
                {wrong&&<XCircle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{color:C.coral}}/>}
              </div>
            </button>
          );
        })}
      </div>
      {!sub&&(
        <button onClick={submit} disabled={sel===null}
          className="w-full py-3 rounded-xl font-bold text-sm"
          style={{background:sel!==null?`linear-gradient(135deg,${C.navy},${C.teal})`:C.light,color:sel!==null?'white':'#bbb',cursor:sel!==null?'pointer':'not-allowed'}}>
          Check answer →
        </button>
      )}
    </div>
  );
}

// --- TRUE / FALSE ---
function TrueFalse({q, onFinish}){
  const [sel, setSel] = useState(null);
  const [sub, setSub] = useState(false);
  const lockedRef = useRef(false);

  const submit=(choice)=>{
    if(sub||lockedRef.current)return;
    lockedRef.current=true;
    setSel(choice); setSub(true);
    const correct = choice===q.answer;
    onFinish(correct, q.feedback[choice], correct?10:0);
  };

  const btnStyle=(val)=>{
    const isTrue=val==='true';
    const chosen=sub&&sel===val;
    const isRight=chosen&&q.answer===val;
    const isWrong=chosen&&q.answer!==val;
    return {
      flex:1, padding:'18px 0', borderRadius:12, fontSize:15, fontWeight:700,
      border:'2px solid',
      borderColor:isRight?C.green:isWrong?C.coral:!sub?( isTrue?C.green:C.coral ):( isTrue?rgba(C.green,0.2):rgba(C.coral,0.2) ),
      background:isRight?C.greenLight:isWrong?C.coralLight:!sub?( isTrue?rgba(C.green,0.07):rgba(C.coral,0.07) ):'white',
      color:isTrue?C.green:C.coral,
      cursor:sub?'default':'pointer',
      transition:'all 0.2s',
    };
  };

  return(
    <div>
      <div className="rounded-xl p-4 mb-5" style={{background:rgba(C.navy,0.04),border:`1px solid ${rgba(C.navy,0.09)}`}}>
        <p className="text-sm font-medium leading-relaxed text-center" style={{color:C.dark,fontFamily:'Georgia,serif',fontSize:15}}>{q.statement}</p>
      </div>
      <div style={{display:'flex',gap:12}}>
        <button onClick={()=>submit('true')} disabled={sub} style={btnStyle('true')}>
          <div>True</div>
          {sub&&sel==='true'&&(q.answer==='true'?<CheckCircle className="w-4 h-4 mx-auto mt-1 pop" style={{color:C.green}}/>:<XCircle className="w-4 h-4 mx-auto mt-1" style={{color:C.coral}}/>)}
        </button>
        <button onClick={()=>submit('false')} disabled={sub} style={btnStyle('false')}>
          <div>False</div>
          {sub&&sel==='false'&&(q.answer==='false'?<CheckCircle className="w-4 h-4 mx-auto mt-1 pop" style={{color:C.green}}/>:<XCircle className="w-4 h-4 mx-auto mt-1" style={{color:C.coral}}/>)}
        </button>
      </div>
      {sub&&(
        <div className="mt-4 rounded-xl p-3 fi" style={{background:rgba(C.teal,0.07),border:`1px solid ${rgba(C.teal,0.18)}`}}>
          <div className="text-[10px] font-bold mb-1" style={{color:C.teal}}>Correct answer: {q.answer==='true'?'True':'False'}</div>
        </div>
      )}
    </div>
  );
}

// --- MATCH PAIRS (Q4) ---
function MatchPairs({q, onFinish}){
  const [held,     setHeld]     = useState(null);   // id of held left card
  const [matches,  setMatches]  = useState({});     // {leftId: rightId}
  const [dragOver, setDragOver] = useState(null);
  const [sub,      setSub]      = useState(false);
  const [results,  setResults]  = useState({});
  const lockedRef = useRef(false);

  const shuffledRight = useRef([...q.pairs].sort(()=>Math.random()-0.5));

  const place=(leftId, rightId)=>{
    if(sub)return;
    // remove any existing match for this right zone
    setMatches(prev=>{
      const n={...prev};
      // clear old mapping if this right was already used
      Object.keys(n).forEach(k=>{ if(n[k]===rightId) delete n[k]; });
      // if same left clicked again on same zone, unset it
      if(n[leftId]===rightId){ delete n[leftId]; }
      else { n[leftId]=rightId; }
      return n;
    });
    setHeld(null);
  };

  const allPlaced = Object.keys(matches).length===q.pairs.length;

  const submit=()=>{
    if(!allPlaced||sub||lockedRef.current)return;
    lockedRef.current=true; setSub(true);
    const res={};
    q.pairs.forEach(p=>{ res[p.leftId] = matches[p.leftId]===p.rightId; });
    setResults(res);
    const ok=Object.values(res).filter(Boolean).length;
    const total=q.pairs.length;
    const fbText=ok===total?q.feedback.perfect:ok>=3?q.feedback.good:q.feedback.low;
    onFinish(ok>=4,fbText,ok===total?10:ok>=3?6:ok*2,{ok,total,isUnscored:false});
  };

  return(
    <div>
      <p className="text-xs mb-4" style={{color:C.mid}}>
        {sub?'Results shown.':'Tap a Prophet (left), then tap the matching contribution (right). Drag also works.'}
      </p>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginBottom:16}}>
        {/* Left column - prophets */}
        <div style={{display:'flex',flexDirection:'column',gap:8}}>
          <div style={{fontSize:9,fontWeight:700,letterSpacing:'0.07em',textTransform:'uppercase',color:C.mid,marginBottom:2}}>Prophet</div>
          {q.pairs.map(p=>{
            const isHeld=held===p.leftId;
            const isMatched=matches[p.leftId]!==undefined;
            const isCorrect=sub&&results[p.leftId];
            const isWrong=sub&&results[p.leftId]===false;
            return(
              <button key={p.leftId}
                draggable={!sub}
                onDragStart={()=>setHeld(p.leftId)}
                onDragEnd={()=>setHeld(null)}
                onClick={()=>!sub&&setHeld(h=>h===p.leftId?null:p.leftId)}
                style={{
                  padding:'10px 12px', borderRadius:10, textAlign:'left', fontSize:12, fontWeight:700,
                  border:`2px solid`,
                  borderColor:isCorrect?C.green:isWrong?C.coral:isHeld?C.gold:isMatched?rgba(C.teal,0.4):'#e5e7eb',
                  background:isCorrect?C.greenLight:isWrong?C.coralLight:isHeld?C.goldLight:isMatched?rgba(C.tealLight,0.5):'white',
                  color:C.navy, cursor:sub?'default':'pointer',
                  transition:'all 0.2s',
                }}>
                <div>{p.left}</div>
                {sub&&isCorrect&&<div style={{fontSize:9,fontWeight:400,color:C.green,marginTop:2}}>{p.matchFeedback}</div>}
              </button>
            );
          })}
        </div>

        {/* Right column - contributions */}
        <div style={{display:'flex',flexDirection:'column',gap:8}}>
          <div style={{fontSize:9,fontWeight:700,letterSpacing:'0.07em',textTransform:'uppercase',color:C.mid,marginBottom:2}}>Contribution</div>
          {shuffledRight.current.map(p=>{
            const matchedLeftId=Object.keys(matches).find(k=>matches[k]===p.rightId);
            const matchedLeft=q.pairs.find(x=>x.leftId===matchedLeftId);
            const isCorrect=sub&&matchedLeftId&&results[matchedLeftId];
            const isWrong=sub&&matchedLeftId&&results[matchedLeftId]===false;
            const isDragOver=dragOver===p.rightId;
            return(
              <button key={p.rightId}
                onDragOver={e=>{e.preventDefault();setDragOver(p.rightId);}}
                onDragLeave={()=>setDragOver(null)}
                onDrop={e=>{e.preventDefault();if(held)place(held,p.rightId);setDragOver(null);}}
                onClick={()=>{ if(!sub&&held)place(held,p.rightId); }}
                style={{
                  padding:'10px 12px', borderRadius:10, textAlign:'left', fontSize:11, fontWeight:400,
                  border:`2px solid`,
                  borderColor:isCorrect?C.green:isWrong?C.coral:isDragOver?C.gold:matchedLeftId?rgba(C.teal,0.4):'#e5e7eb',
                  background:isCorrect?C.greenLight:isWrong?C.coralLight:isDragOver?rgba(C.goldLight,0.6):matchedLeftId?rgba(C.tealLight,0.4):'white',
                  color:C.dark, cursor:sub?'default':'pointer',
                  transition:'all 0.2s',
                  minHeight:58,
                }}>
                {matchedLeft&&!sub&&<div style={{fontSize:9,fontWeight:700,color:C.teal,marginBottom:2}}>{matchedLeft.left}</div>}
                <div style={{lineHeight:1.45}}>{p.right}</div>
                {sub&&isCorrect&&<CheckCircle className="w-3.5 h-3.5 mt-1 pop" style={{color:C.green}}/>}
                {sub&&isWrong&&<XCircle className="w-3.5 h-3.5 mt-1" style={{color:C.coral}}/>}
              </button>
            );
          })}
        </div>
      </div>

      {!sub&&(
        <button onClick={submit} disabled={!allPlaced}
          className="w-full py-3 rounded-xl font-bold text-sm"
          style={{background:allPlaced?`linear-gradient(135deg,${C.navy},${C.teal})`:C.light,color:allPlaced?'white':'#bbb',cursor:allPlaced?'pointer':'not-allowed'}}>
          Check my matches ({Object.keys(matches).length}/{q.pairs.length} placed) →
        </button>
      )}
    </div>
  );
}

// --- REFLECTION MULTI-SELECT (Q5) ---
function ReflectionMultiSelect({q, onFinish}){
  const [selected, setSelected] = useState(new Set());
  const [sub,      setSub]      = useState(false);
  const lockedRef = useRef(false);

  const toggle=(id)=>{ if(sub)return; setSelected(s=>{ const n=new Set(s); n.has(id)?n.delete(id):n.add(id); return n; }); };

  const submit=()=>{
    if(sub||lockedRef.current)return;
    lockedRef.current=true; setSub(true);
    onFinish(true, q.feedbackSummary, 0);
  };

  return(
    <div>
      <div className="space-y-2 mb-5">
        {q.options.map(opt=>{
          const isSel=selected.has(opt.id);
          return(
            <button key={opt.id} onClick={()=>toggle(opt.id)}
              className={`w-full p-4 rounded-xl text-left transition-all border-2`}
              style={{
                background:isSel?rgba(C.goldLight,0.8):'white',
                borderColor:isSel?C.gold:'#e5e7eb',
                cursor:sub?'default':'pointer',
              }}>
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
        <button onClick={submit} disabled={selected.size===0}
          className="w-full py-3 rounded-xl font-bold text-sm"
          style={{background:selected.size>0?`linear-gradient(135deg,${C.gold},${C.orange})`:C.light,color:selected.size>0?C.navy:'#bbb',cursor:selected.size>0?'pointer':'not-allowed'}}>
          Share my reflection →
        </button>
      )}
    </div>
  );
}

// ================================================================
// DATA
// ================================================================
const SECTIONS = [
  {
    id:'A', title:'The Creation of the Universe',
    content:[
      'Islamic history does not begin in Arabia. It does not even begin with Adam عَلَيْهِ السَّلَام. It begins at the very first moment of existence.',
      'Before the universe existed, there was only Allah سُبْحَانَهُ وَتَعَالَى. Then came the command: **كُن  -  "Be."** From that single point, the heavens and earth were created, water brought forth all life, and the stage was set for everything that follows.',
      'The Quran describes this in one verse (21:30): **a joined mass split apart, water as the source of all life, and an invitation to reflect.** This verse was revealed fourteen centuries before any of it was confirmed by science.',
    ],
    creationDiagram: true,
    quran:{
      arabic:'أَوَلَمْ يَرَ ٱلَّذِينَ كَفَرُوٓا۟ أَنَّ ٱلسَّمَـٰوَٰتِ وَٱلْأَرْضَ كَانَتَا رَتْقًا فَفَتَقْنَـٰهُمَا ۖ وَجَعَلْنَا مِنَ ٱلْمَآءِ كُلَّ شَىْءٍ حَىٍّ ۖ أَفَلَا يُؤْمِنُونَ',
      translation:'"Do the disbelievers not see that the heavens and the earth were joined together, and then We split them apart, and made from water every living thing? Then will they not believe?" (Quran 21:30)',
      ref_text:'Quran 21:30 - The origin of the universe',
      note:'Three claims in one verse: a joined mass that was split apart, water as the source of all life, and an invitation to reflect. The Quran states all three 1,400 years before modern science confirmed any of them.',
    },
  },
  {
    id:'B', title:'The Creation of Adam عَلَيْهِ السَّلَام',
    content:[
      'You just saw the earth prepared: heavens and earth split, water bringing forth all life. Into this world, Allah سُبْحَانَهُ وَتَعَالَى placed the first human being. Adam عَلَيْهِ السَّلَام was formed from clay, and Allah سُبْحَانَهُ وَتَعَالَى breathed life into him, honouring him above the angels.',
      'Adam عَلَيْهِ السَّلَام was not just the first human - he was also the **first Prophet**. Allah سُبْحَانَهُ وَتَعَالَى taught him the names of all things (Quran 2:31), established for him the principles of worship, and placed him on the earth with a purpose: to worship Allah سُبْحَانَهُ وَتَعَالَى and build a just civilisation.',
      'As generations passed, people began to stray from the truth - worshipping idols, forgetting their Creator, falling into injustice. Each time this happened, Allah سُبْحَانَهُ وَتَعَالَى sent a new Prophet to renew the message. This pattern - **humanity strays, guidance is renewed** - is what the Quran calls Sunnah Allah (سُنَّة اللَّٰه): the consistent, unchanging patterns of how Allah سُبْحَانَهُ وَتَعَالَى deals with humanity.',
    ],
    quran:{
      arabic:'وَمَا خَلَقْتُ الْجِنَّ وَالْإِنسَ إِلَّا لِيَعْبُدُونِ',
      translation:'"And I did not create the jinn and mankind except to worship Me." (Quran 51:56)',
      ref_text:'Quran 51:56 - The purpose of creation',
      note:'This worship is comprehensive - it includes prayer, character, justice, and every righteous act performed in accordance with divine guidance.',
    },
  },
  {
    id:'C', title:'The Chain of Prophets',
    content:[
      'After Adam عَلَيْهِ السَّلَام, Allah سُبْحَانَهُ وَتَعَالَى sent Prophets continuously - each one renewing the same essential message: worship Allah سُبْحَانَهُ وَتَعَالَى alone, live justly, care for the weak. The Quran mentions 25 Prophets by name.',
      'For our purposes - understanding how history led to Arabia and to the final Prophet صَلَّى اللَّٰهُ عَلَيْهِ وَسَلَّمَ - the key chain runs through six pivotal figures.',
      'The connection between Ibrahim عَلَيْهِ السَّلَام, Ismail عَلَيْهِ السَّلَام, and the Arabs is the linchpin of this module. Ismail عَلَيْهِ السَّلَام settled in the valley of Makkah, and from his descendants came the Arab tribes - including, many generations later, the Quraysh, and from the Quraysh: Muhammad ibn Abdullah صَلَّى اللَّٰهُ عَلَيْهِ وَسَلَّمَ.',
    ],
    chainDiagram: true,
    prophetTable: true,
    callout:{
      type:'insight',
      title:'Sunnah Allah in this chain',
      text:'Every time humanity drifted, guidance was sent. The drift and renewal cycle repeats. What you will see throughout this entire curriculum - from pre-Islamic Arabia through to today - is this same pattern playing out again and again.',
    },
  },
  {
    id:'D', title:'Why This Chain Matters',
    content:[
      'Understanding that Muhammad صَلَّى اللَّٰهُ عَلَيْهِ وَسَلَّمَ was the final link in a deliberate, unbroken chain changes how we read all of Islamic history.',
      'The story is not: "A new religion appeared in 610 CE." The story is: "The final renewal of humanity\'s original covenant with Allah سُبْحَانَهُ وَتَعَالَى - carried by Prophets for millennia - arrived in its complete form."',
      'This is not coincidence. It is Sunnah Allah: when the world was ready, when the language and culture of Arabic had developed to carry the final scripture, when the Arabian Peninsula sat at the crossroads of ancient civilisations - the final message was sent.',
    ],
    hadith:{
      text:'The Prophet صَلَّى اللَّٰهُ عَلَيْهِ وَسَلَّمَ said: "My similitude in comparison with the other Prophets is that of a man who built a house perfectly except for one brick. I am that brick."',
      source:'Sahih al-Bukhari, Hadith 3535',
    },
  },
];

const QUESTIONS = [
  {
    id:'q1', position:'first', scored:true,
    type:'sequence-order', mode:'SORT', typeLabel:'Arrange in order', level:'1/5',
    question:'Before we teach you anything - arrange these Prophets in the order you think they were sent, from earliest to most recent.',
    items:[
      {id:'adam',     pos:1, name:'Adam',    honorific:'عَلَيْهِ السَّلَام', contribution:'First human, first Prophet',              color:C.teal},
      {id:'nuh',      pos:2, name:'Nuh',     honorific:'عَلَيْهِ السَّلَام', contribution:'Renewed monotheism after idol worship',   color:C.teal},
      {id:'ibrahim',  pos:3, name:'Ibrahim', honorific:'عَلَيْهِ السَّلَام', contribution:'Built the Kabah, father of Arab lineage', color:C.teal},
      {id:'musa',     pos:4, name:'Musa',    honorific:'عَلَيْهِ السَّلَام', contribution:'Brought the Torah, led Banu Israel',      color:C.teal},
      {id:'isa',      pos:5, name:'Isa',     honorific:'عَلَيْهِ السَّلَام', contribution:'Brought the Injil, announced Ahmad صَلَّى اللَّٰهُ عَلَيْهِ وَسَلَّمَ',   color:C.teal},
      {id:'muhammad', pos:6, name:'Muhammad',honorific:'صَلَّى اللَّٰهُ عَلَيْهِ وَسَلَّمَ', contribution:'Seal of the Prophets, the final message', color:C.gold},
    ],
    feedback:{
      perfect:'Perfect. Adam عَلَيْهِ السَّلَام - Nuh عَلَيْهِ السَّلَام - Ibrahim عَلَيْهِ السَّلَام - Musa عَلَيْهِ السَّلَام - Isa عَلَيْهِ السَّلَام - Muhammad صَلَّى اللَّٰهُ عَلَيْهِ وَسَلَّمَ. You already carry this chain. Now let us give each link its meaning.',
      good:'Almost there! A few positions to review - come back to this after the teaching and the chain will be completely clear.',
      low:'No problem at all - this is exactly why this question runs before teaching. By the end of this lesson you will arrange them instantly.',
    },
  },
  {
    id:'q2', afterSection:'A', scored:true,
    type:'mcq', mode:'THINK', typeLabel:'Multiple choice', level:'2/5',
    question:'Quran 21:30 makes three separate claims about creation. Which of the following is NOT one of them?',
    verse:{
      arabic:'أَوَلَمْ يَرَ ٱلَّذِينَ كَفَرُوٓا۟ أَنَّ ٱلسَّمَـٰوَٰتِ وَٱلْأَرْضَ كَانَتَا رَتْقًا فَفَتَقْنَـٰهُمَا وَجَعَلْنَا مِنَ ٱلْمَآءِ كُلَّ شَىْءٍ حَىٍّ أَفَلَا يُؤْمِنُونَ',
      translation:'"Do the disbelievers not see that the heavens and the earth were joined together, and then We split them apart, and made from water every living thing? Then will they not believe?" (Quran 21:30)',
    },
    options:[
      {id:'a', text:'That the heavens and earth were once one joined mass', correct:false},
      {id:'b', text:'That Allah سُبْحَانَهُ وَتَعَالَى breathed life into Adam عَلَيْهِ السَّلَام from clay', correct:true},
      {id:'c', text:'That the heavens and earth were split apart', correct:false},
      {id:'d', text:'That all living things were made from water', correct:false},
    ],
    feedback:{
      a:'This is in 21:30 - the Arabic word ratqan means a joined, closed mass. The verse opens with this claim.',
      b:'Correct - this is NOT in 21:30. The creation of Adam عَلَيْهِ السَّلَام from clay is described elsewhere in the Quran (e.g. 15:26, 38:71). Quran 21:30 is specifically about the origin of the universe and of life through water - not about the creation of the first human.',
      c:'This is in 21:30 - fataqnahuma means "We split them apart." The splitting is the second claim in the verse.',
      d:'This is in 21:30 - "and We made from water every living thing." This is the third claim, and arguably the most striking scientific statement in the verse.',
    },
  },
  {
    id:'q3', afterSection:'B', scored:true,
    type:'mcq', mode:'THINK', typeLabel:'Multiple choice', level:'2/5',
    question:'The Quran describes the purpose for which Allah سُبْحَانَهُ وَتَعَالَى created human beings. Which of these best captures it?',
    options:[
      {id:'a', text:'To act as Allah\'s khalifah - stewards and caretakers of the earth', correct:false},
      {id:'b', text:'To worship Allah سُبْحَانَهُ وَتَعَالَى - a worship that encompasses every righteous thought, word, and action in life', correct:true},
      {id:'c', text:'To be tested in this life so that the righteous are rewarded and the wrongdoers are held to account', correct:false},
      {id:'d', text:'To build a just civilisation on earth and care for the weak', correct:false},
    ],
    feedback:{
      a:'This is genuinely in the Quran - Allah سُبْحَانَهُ وَتَعَالَى says in 2:30 "I will make upon the earth a khalifah." But khalifah describes our role and responsibility, not the purpose of our creation. Quran 51:56 answers the purpose question directly: worship. Stewardship flows from worship - it is not the root.',
      b:'Correct. Quran 51:56: "And I did not create the jinn and mankind except to worship Me." The Arabic word ibadah is far broader than ritual prayer - it covers every act done with awareness of Allah سُبْحَانَهُ وَتَعَالَى. Working honestly, raising children well, seeking knowledge, acts of justice - all of it is worship when done for the right reason.',
      c:'This is close - and it is true that this life is a test (Quran 67:2). But the test is not the purpose; it is the method. The purpose stated in 51:56 is worship. The test exists within that frame - it is how worship is proven and refined, not why creation exists.',
      d:'This too is in the Quran and deeply important - the Prophets all came to establish justice. But again, this is a consequence and expression of worship, not its replacement. 51:56 is specific: the purpose is worship, from which justice and care for others naturally follow.',
    },
  },
  {
    id:'q4', afterSection:'B', scored:true,
    type:'true-false', mode:'THINK', typeLabel:'True or False', level:'1/5',
    question:'',
    statement:'Adam عَلَيْهِ السَّلَام was the first human being on earth, but was not sent as a Prophet.',
    answer:'false',
    feedback:{
      true:'This is a common misconception. Adam عَلَيْهِ السَّلَام was both the first human and the first Prophet. Allah سُبْحَانَهُ وَتَعَالَى taught him the names of all things (Quran 2:31) and established the principles of worship through him. The prophetic chain begins with Adam عَلَيْهِ السَّلَام himself.',
      false:'Correct. Adam عَلَيْهِ السَّلَام was both the first human and the first Prophet. Allah سُبْحَانَهُ وَتَعَالَى established through him the original covenant of worship. Every Prophet after him renewed this same message.',
    },
  },
  {
    id:'q5', afterSection:'C', scored:true,
    type:'mcq', mode:'THINK', typeLabel:'Multiple choice', level:'3/5',
    question:'The Prophet صَلَّى اللَّٰهُ عَلَيْهِ وَسَلَّمَ described his relationship to the Prophets before him using a famous image. Which of these best captures what he meant?',
    options:[
      {id:'a', text:'He was a completely new builder who started from an empty piece of land', correct:false},
      {id:'b', text:'He was the final brick completing a house that all the Prophets before him had been building', correct:true},
      {id:'c', text:'He replaced the old building entirely with something better', correct:false},
      {id:'d', text:'He was the architect who designed the house, while the earlier Prophets built it', correct:false},
    ],
    feedback:{
      a:'This would make Islam a new religion with no connection to what came before. The Prophet صَلَّى اللَّٰهُ عَلَيْهِ وَسَلَّمَ said the opposite: "My similitude in comparison with the other Prophets is that of a man who built a house perfectly except for one brick. I am that brick." (Sahih al-Bukhari, 3535). He completed an existing structure.',
      b:'Correct. The Prophet صَلَّى اللَّٰهُ عَلَيْهِ وَسَلَّمَ saw himself as the final completion of a chain that began with Adam عَلَيْهِ السَّلَام. The house - the message of Tawhid - was always being built. He placed the last brick. That is why he is called Khatam al-Nabiyyin: the Seal of the Prophets.',
      c:'Islam does not replace the earlier messages - it confirms and perfects them. The Quran describes the Prophet صَلَّى اللَّٰهُ عَلَيْهِ وَسَلَّمَ as confirming what came before him (Quran 2:89, 3:3). The foundation laid by Adam عَلَيْهِ السَّلَام, Ibrahim عَلَيْهِ السَّلَام, Musa عَلَيْهِ السَّلَام and Isa عَلَيْهِ السَّلَام is the same foundation.',
      d:'This reverses the image. In the hadith, the house was built by those who came before - the Prophet صَلَّى اللَّٰهُ عَلَيْهِ وَسَلَّمَ was not the designer standing apart from the work. He was the final participant in it, completing what every Prophet before him had contributed to.',
    },
    bridge:'This is Sunnah Allah made personal: the same pattern that runs through history runs through the Prophets themselves. One message. One chain. One completion.',
  },
  {
    id:'q6', afterSection:'D', scored:true,
    type:'true-false', mode:'THINK', typeLabel:'True or False', level:'2/5',
    question:'',
    statement:'Sunnah Allah refers to Allah\'s consistent, unchanging patterns of how He deals with humanity throughout history.',
    answer:'true',
    feedback:{
      true:'Correct. From the Arabic root meaning "way" or "pattern", Sunnah Allah describes Allah\'s consistent manner of dealing with humanity across all of history. The Quran uses this concept directly (Quran 33:62; 35:43) - and the drift-and-renewal pattern you have traced is one of its clearest expressions.',
      false:'Sunnah Allah does mean this. The Quran uses the phrase (Quran 33:62; 35:43) to describe divine patterns that never change. The drift and renewal cycle you have traced through the Prophets is exactly one of these patterns.',
    },
  },
      {
    id:'q7', afterSection:'D', scored:true,
    type:'match-pairs', mode:'SORT', typeLabel:'Match pairs', level:'3/5',
    question:'Match each Prophet صَلَّى اللَّٰهُ عَلَيْهِ وَسَلَّمَ to their key role in the chain that led to Muhammad صَلَّى اللَّٰهُ عَلَيْهِ وَسَلَّمَ.',
    pairs:[
      {leftId:'adam',    left:'Adam عَلَيْهِ السَّلَام',    rightId:'r1', right:'First human and first Prophet  -  received the original message of Tawhid',         matchFeedback:'Adam عَلَيْهِ السَّلَام is the origin of the chain. The gold line begins with him.'},
      {leftId:'nuh',     left:'Nuh عَلَيْهِ السَّلَام',     rightId:'r2', right:'Called people back from widespread idol worship and preserved humanity',           matchFeedback:'Nuh عَلَيْهِ السَّلَام is the first great renewal  -  the drift-and-return pattern in its clearest form.'},
      {leftId:'ibrahim', left:'Ibrahim عَلَيْهِ السَّلَام', rightId:'r3', right:'Built the Kabah in Makkah and established the lineage leading to the Arab tribes', matchFeedback:'Ibrahim عَلَيْهِ السَّلَام connects the chain directly to Arabia  -  and to the Quraysh, and to Muhammad صَلَّى اللَّٰهُ عَلَيْهِ وَسَلَّمَ.'},
      {leftId:'musa',    left:'Musa عَلَيْهِ السَّلَام',    rightId:'r4', right:'Brought the Torah and led the largest prophetic mission before Islam',             matchFeedback:'Musa عَلَيْهِ السَّلَام established the tradition of the Banu Israel  -  the Abrahamic community that came before Islam.'},
      {leftId:'isa',     left:'Isa عَلَيْهِ السَّلَام',     rightId:'r5', right:'Brought the Injil and announced the coming of the final Prophet صَلَّى اللَّٰهُ عَلَيْهِ وَسَلَّمَ by name',       matchFeedback:'Quran 61:6: Isa عَلَيْهِ السَّلَام said "giving good tidings of a messenger to come after me, whose name is Ahmad."'},
    ],
    feedback:{
      perfect:'All five correct. You now know the chain by heart. Each Prophet is a deliberate link  -  and together they tell the story of one message, renewed again and again.',
      good:'Very close. Review the one or two you missed  -  the key is each Prophet\'s specific contribution to preparing the way for Muhammad صَلَّى اللَّٰهُ عَلَيْهِ وَسَلَّمَ.',
      low:'The chain: Adam عَلَيْهِ السَّلَام starts it, Nuh عَلَيْهِ السَّلَام renews it, Ibrahim عَلَيْهِ السَّلَام connects it to Arabia, Musa عَلَيْهِ السَّلَام builds the Abrahamic tradition, Isa عَلَيْهِ السَّلَام announces what comes next.',
    },
  },
  {    id:'q8', afterSection:'D', scored:false,
    type:'reflection-multi', mode:'THINK', typeLabel:'Personal reflection', level:'5/5',
    question:'Now that you know the full story - from creation of the universe to the chain of Prophets - which of the following resonates most? (Select all that apply.)',
    options:[
      {id:'r1', text:'I feel a sense of connection - this is my tradition, going back to the very beginning of time', feedback:'That sense of belonging is exactly what this chain is meant to give you. You are part of an unbroken line from the first moment of creation.'},
      {id:'r2', text:'I feel curious - I want to know more about the universe, creation, and each of these Prophets', feedback:'That curiosity is the beginning of knowledge. Each Prophet has a full story - we will meet several of them in detail throughout this curriculum.'},
      {id:'r3', text:'I feel surprised - I did not realise Islamic history begins with the cosmos itself', feedback:'Many people are surprised. Islam does not begin with Muhammad صَلَّى اللَّٰهُ عَلَيْهِ وَسَلَّمَ or even with Adam عَلَيْهِ السَّلَام - it begins with the first act of creation. Everything is connected.'},
      {id:'r4', text:'I feel grounded - knowing that the universe was created with purpose makes my own life feel purposeful', feedback:'That rootedness is a gift. When you see purpose in the cosmos, you can see purpose in yourself. This is one of the deepest gifts of Islamic theology.'},
      {id:'r5', text:'I have questions - some of this raises things I want to explore further', feedback:'Questions are welcome here. Write them down - some will be answered in this module, others in later tiers. The curriculum is designed for exactly that curiosity.'},
      {id:'r6', text:'I feel moved - the arc from "Be" to the final Prophet is extraordinary', feedback:'It is. From a single divine command, through thousands of years of Prophets and civilisations, to the final message. That arc is what this entire curriculum traces.'},
    ],
    feedbackSummary:'Your reflections are recorded. The arc from creation to the final Prophet is the foundation of everything that follows. Hold onto what you felt here - it will make every subsequent lesson richer.',
  },
];

const SCORED_COUNT = QUESTIONS.filter(q=>q.scored!==false).length; // 7


const FLOW=(()=>{
  const f=[];
  QUESTIONS.filter(q=>q.position==='first').forEach(q=>f.push({type:'question',data:q}));
  SECTIONS.forEach(sec=>{
    f.push({type:'section',data:sec});
    QUESTIONS.filter(q=>q.afterSection===sec.id).forEach(q=>f.push({type:'question',data:q}));
  });
  return f;
})();

// ================================================================
// SECTION CARD
// ================================================================
function SectionCard({section, onContinue}){
  const [focused,    setFocused]    = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const activate = useCallback(()=>{ setFocused(true); setHasStarted(true); },[]);
  const escape   = useCallback(()=>setFocused(false),[]);

  const ACCENTS = {A:C.gold, B:C.gold, C:C.teal};
  const accent  = ACCENTS[section.id] || C.teal;

  const textStyle = {
    transition:'filter 0.5s ease, opacity 0.5s ease',
    filter:  focused ? 'blur(2px)' : 'none',
    opacity: focused ? 0.22 : 1,
    pointerEvents: focused ? 'none' : 'auto',
    userSelect: focused ? 'none' : 'auto',
  };

  const hasDiagram = section.chainDiagram || section.creationDiagram;

  return(
    <div className="su rounded-2xl overflow-hidden shadow-lg" style={{
      background:'white',
      border: focused ? `1.5px solid ${rgba(accent,0.55)}` : `1px solid ${rgba(C.navy,0.1)}`,
      transition:'border-color 0.45s ease, box-shadow 0.45s ease',
      boxShadow: focused
        ? `0 0 0 4px ${rgba(accent,0.08)}, 0 16px 48px ${rgba(C.navy,0.1)}`
        : `0 2px 16px ${rgba(C.navy,0.06)}`,
    }}>

      {/* HEADER */}
      <div className="px-6 pt-6 pb-5" style={{
        borderBottom:`1px solid ${rgba(C.navy,0.07)}`,
        transition:'opacity 0.5s ease, filter 0.5s ease',
        ...(focused ? {opacity:0.25, filter:'blur(1.5px)', pointerEvents:'none'} : {}),
      }}>
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center text-sm font-black"
            style={{background:rgba(accent,0.12),color:accent}}>{section.id}</div>
          <div className="flex-1 min-w-0">
            <div className="text-[10px] font-bold tracking-widest uppercase mb-1" style={{color:rgba(C.navy,0.35)}}>Section {section.id}</div>
            <h2 className="text-xl font-bold leading-tight" style={{color:C.navy,fontFamily:'Georgia,serif'}}>{section.title}</h2>
          </div>
        </div>
      </div>

      <div className="px-6 pt-5 pb-6">

        {/* TEXT */}
        <div style={textStyle}>
          {section.content.map((p,i)=>(
            <p key={i} className="leading-relaxed mb-4" style={{color:C.dark,fontSize:'14px',lineHeight:'1.75'}}>{md(p)}</p>
          ))}
        </div>

        {/* DIAGRAM ZONE */}
        {hasDiagram&&(
          <div style={{position:'relative'}}>
            {focused&&(
              <button onClick={escape} className="escape-in" style={{
                position:'absolute', top:-12, right:-6, zIndex:20,
                display:'flex', alignItems:'center', gap:5,
                padding:'5px 12px', borderRadius:20, background:C.navy,
                color:'white', fontSize:11, fontWeight:700, border:'none', cursor:'pointer',
                boxShadow:`0 4px 14px ${rgba(C.navy,0.28)}`, letterSpacing:'0.03em',
              }}>
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
            <div className={focused?'focus-ring':''} style={{
              position:'relative', zIndex:focused?10:'auto', borderRadius:16,
              transition:'transform 0.45s cubic-bezier(0.34,1.4,0.64,1), box-shadow 0.45s ease',
              transform: focused?'scale(1.018)':'scale(1)',
              boxShadow: focused ? `0 12px 48px ${rgba(C.navy,0.14)}, 0 0 0 2px ${rgba(accent,0.4)}` : 'none',
            }}>
              {section.creationDiagram&&<CreationDiagram onActivate={activate}/>}
              {section.chainDiagram&&<ProphetChainDiagram onActivate={activate}/>}
            </div>
            {focused&&(
              <div className="flex gap-2 mt-4 escape-in" style={{animationDelay:'0.08s'}}>
                <button onClick={escape} style={{flex:1,padding:'10px 0',borderRadius:10,fontSize:12,fontWeight:600,background:rgba(C.navy,0.05),color:C.mid,border:`1px solid ${rgba(C.navy,0.1)}`,cursor:'pointer'}}>
                  Show lesson text
                </button>
                <button onClick={onContinue} style={{flex:1,padding:'10px 0',borderRadius:10,fontSize:12,fontWeight:600,background:`linear-gradient(135deg,${C.teal},${C.green})`,color:'white',border:'none',cursor:'pointer'}}>
                  Continue →
                </button>
              </div>
            )}
          </div>
        )}

        {/* POST-DIAGRAM CONTENT */}
        <div style={textStyle}>
          {section.quran&&<QuranCard {...section.quran}/>}

          {section.prophetTable&&(
            <div style={{marginBottom:20}}>
              <div style={{fontSize:10,fontWeight:700,letterSpacing:'0.08em',textTransform:'uppercase',color:rgba(C.navy,0.4),marginBottom:10}}>
                The key chain  -  six Prophets, one message
              </div>
              {[
                {name:'Adam عَلَيْهِ السَّلَام',    dot:C.teal,  role:'First human and first Prophet. Received the original message of Tawhid.',       ref:'2:30'},
                {name:'Nuh عَلَيْهِ السَّلَام',     dot:C.teal,  role:'Called people back from idol worship. Preserved humanity through the Flood.',    ref:'71:1'},
                {name:'Ibrahim عَلَيْهِ السَّلَام', dot:C.teal,  role:'Father of monotheism. Built the Kabah. Ancestor of the Arab lineage.',          ref:'2:127'},
                {name:'Musa عَلَيْهِ السَّلَام',    dot:C.teal,  role:'Brought the Torah. Led Banu Israel  -  the largest prophetic mission before Islam.',ref:'20:9'},
                {name:'Isa عَلَيْهِ السَّلَام',     dot:C.teal,  role:'Brought the Injil. Announced the coming of Ahmad صَلَّى اللَّٰهُ عَلَيْهِ وَسَلَّمَ by name (Quran 61:6).',      ref:'61:6'},
                {name:'Muhammad صَلَّى اللَّٰهُ عَلَيْهِ وَسَلَّمَ',dot:C.gold,  role:'Seal of the Prophets. The final, universal message. The chain is complete.',    ref:'33:40'},
              ].map((p,i)=>(
                <div key={i} style={{
                  display:'flex',alignItems:'center',gap:12,
                  padding:'9px 0',
                  borderBottom:i<5?`1px solid ${rgba(C.navy,0.06)}`:'none',
                }}>
                  {/* Number dot */}
                  <div style={{
                    width:26,height:26,borderRadius:'50%',flexShrink:0,
                    background:p.dot,opacity:0.9,
                    display:'flex',alignItems:'center',justifyContent:'center',
                    fontSize:10,fontWeight:700,color:p.dot===C.gold?C.navy:'white',
                  }}>{i+1}</div>
                  {/* Name + ref only */}
                  <span style={{fontSize:13,fontWeight:700,color:p.dot===C.gold?C.gold:C.navy}}>{p.name}</span>
                  <span style={{fontSize:10,color:rgba(C.navy,0.3),marginLeft:'auto'}}>Quran {p.ref}</span>
                </div>
              ))}
            </div>
          )}

          {section.hadith&&(
            <div className="rounded-xl p-4 mb-5" style={{background:rgba(C.navy,0.04),border:`1.5px solid ${rgba(C.navy,0.1)}`}}>
              <div className="text-xs font-bold mb-2" style={{color:C.navy}}>Hadith</div>
              <p className="text-sm italic leading-relaxed mb-1.5" style={{color:C.dark,fontFamily:'Georgia,serif'}}>{section.hadith.text}</p>
              <p className="text-xs font-semibold" style={{color:C.gold}}>{section.hadith.source}</p>
            </div>
          )}

          {section.callout&&(
            <div className="mb-4 mt-1" style={{
              background: section.callout.type==='warning' ? rgba(C.coralLight,0.5) : rgba(C.tealLight,0.5),
              borderLeft:`3px solid ${section.callout.type==='warning'?C.coral:C.teal}`,
              padding:'12px 16px', borderRadius:0,
            }}>
              <div style={{fontSize:11,fontWeight:700,color:section.callout.type==='warning'?C.coral:C.teal,letterSpacing:'0.05em',marginBottom:4,textTransform:'uppercase'}}>
                {section.callout.title}
              </div>
              <p className="text-sm leading-relaxed" style={{color:C.dark}}>{section.callout.text}</p>
            </div>
          )}
        </div>

        {!focused&&(
          <button onClick={onContinue} className="w-full py-3.5 rounded-xl font-bold text-sm mt-2"
            style={{background:`linear-gradient(135deg,${C.teal},${C.green})`,color:'white',border:'none',cursor:'pointer',letterSpacing:'0.01em'}}>
            Continue <ArrowRight className="w-4 h-4 inline ml-1 -mt-0.5"/>
          </button>
        )}
      </div>
    </div>
  );
}

// ================================================================
// QUESTION CARD
// ================================================================
function QuestionCard({q, qNum, totalQ, onAnswer, onNext}){
  const [done,    setDone]    = useState(false);
  const [correct, setCorrect] = useState(false);
  const [fbText,  setFbText]  = useState('');
  const [fbMeta,  setFbMeta]  = useState(null);

  const finish=useCallback((isCorrect,text,pts,meta)=>{
    setDone(true); setCorrect(isCorrect); setFbText(text);
    if(meta) setFbMeta(meta);
    onAnswer(isCorrect,pts,{scored:q.scored});
  },[onAnswer,q.scored]);

  const isReflection = q.type==='reflection-multi';

  return(
    <div className="su rounded-2xl overflow-hidden shadow-lg" style={{background:'white',border:`1px solid ${rgba(C.navy,0.1)}`,boxShadow:`0 2px 16px ${rgba(C.navy,0.06)}`}}>
      <div className="p-6">
        <ModeBadge mode={q.mode} type={q.typeLabel} unscored={q.scored===false}/>
        <h3 className="text-sm font-bold leading-relaxed mb-4" style={{color:C.navy}}>{q.question}</h3>

        {q.verse&&(
          <div className="rounded-xl overflow-hidden mb-5 border" style={{borderColor:rgba(C.gold,0.28)}}>
            <div className="px-4 py-3 text-right border-b" style={{background:`linear-gradient(135deg,${C.navy},#1e3460)`,borderColor:rgba(C.gold,0.15),direction:'rtl'}}>
              <p style={{color:C.gold,fontFamily:'serif',fontSize:13,lineHeight:'2',margin:0}}>{q.verse.arabic}</p>
            </div>
            <div className="px-4 py-3" style={{background:C.goldLight}}>
              <p className="text-xs italic leading-relaxed" style={{color:C.navy,fontFamily:'Georgia,serif',margin:0}}>{q.verse.translation}</p>
            </div>
          </div>
        )}

        {q.type==='sequence-order'    &&<SequenceOrder       q={q} onFinish={finish}/>}
        {q.type==='mcq'               &&<MCQ                 q={q} onFinish={finish}/>}
        {q.type==='true-false'        &&<TrueFalse           q={q} onFinish={finish}/>}
        {q.type==='match-pairs'       &&<MatchPairs          q={q} onFinish={finish}/>}
        {q.type==='reflection-multi'  &&<ReflectionMultiSelect q={q} onFinish={finish}/>}

        {done&&fbText&&<FeedbackPanel correct={correct||isReflection} text={fbText} bridge={q.bridge} meta={fbMeta} reflection={isReflection}/>}

        {done&&(
          <button onClick={onNext} className="w-full mt-4 py-3 rounded-xl font-bold text-sm su"
            style={{background:`linear-gradient(135deg,${C.gold},${C.orange})`,color:C.navy,border:'none',cursor:'pointer'}}>
            {qNum>=SCORED_COUNT?'Complete lesson':'Next'} <ArrowRight className="w-4 h-4 inline ml-1 -mt-0.5"/>
          </button>
        )}
      </div>
    </div>
  );
}

// ================================================================
// MAIN APP
// ================================================================
export default function DEANY_HB1_L1({onBack, onHome}){
  const [screen,       setScreen]      = useState('intro');
  const [flowIdx,      setFlowIdx]     = useState(0);
  const [score,        setScore]       = useState(0);
  const [results,      setResults]     = useState([]);
  const [streak,       setStreak]      = useState(0);
  const [streakFlash,  setStreakFlash] = useState(false);
  const [confetti,     setConfetti]    = useState(false);
  const [confidence,   setConfidence]  = useState(3);

  const qDoneNum = FLOW.slice(0,flowIdx).filter(f=>f.type==='question'&&f.data.scored!==false).length;
  const current  = FLOW[flowIdx];

  const handleAnswer=useCallback((correct,pts,flags={})=>{
    const isScored=flags.scored!==false;
    if(isScored) setResults(r=>[...r,{correct}]);
    if(correct&&isScored){
      setScore(s=>s+pts);
      setStreak(s=>{ const n=s+1; if(n>=3){setStreakFlash(true);setTimeout(()=>setStreakFlash(false),2200);} return n; });
    } else if(isScored){ setStreak(0); }
  },[]);

  const advance=useCallback(()=>{
    window.scrollTo({top:0,behavior:'smooth'});
    if(flowIdx<FLOW.length-1){ setFlowIdx(i=>i+1); }
    else{ setScreen('complete'); setConfetti(true); setTimeout(()=>setConfetti(false),5000); }
  },[flowIdx]);

  const goBack = onBack || (()=>{});
  const goHome = onHome || (()=>{});

  // ── INTRO ──────────────────────────────────────────────────────
  if(screen==='intro') return(
    <div className="min-h-screen relative overflow-hidden" style={PAGE_BG}>
      <IslamicBg/><style>{STYLES}</style>
      <div className="relative z-10 max-w-2xl mx-auto px-4 py-10">
        <div className="flex justify-between items-center mb-6">
          <button onClick={goBack} className="flex items-center gap-1.5 text-sm font-medium" style={{color:C.mid}}
            onMouseEnter={e=>e.currentTarget.style.color=C.navy} onMouseLeave={e=>e.currentTarget.style.color=C.mid}>
            <ChevronLeft className="w-4 h-4"/><span>Back</span>
          </button>
          <button onClick={goHome} className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-white shadow-md"
            style={{background:`linear-gradient(135deg,${C.teal},${C.navy})`}}>
            <Home className="w-4 h-4"/><span>Home</span>
          </button>
        </div>
        <div className="text-center mb-8 su">
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-bold mb-3" style={{background:rgba(C.teal,0.1),color:C.teal,letterSpacing:'0.06em'}}>
            H-B1 · LESSON 1.1
          </span>
          <h1 className="text-3xl font-bold mb-2" style={{color:C.navy,fontFamily:'Georgia,serif'}}>Before Arabia: The Story of Humanity</h1>
          <p className="text-sm" style={{color:C.mid}}>From the first human to the final Prophet. The chain that connects it all.</p>
        </div>
        <div className="rounded-2xl p-6 border border-white/40 shadow-lg su" style={CARD}>
          <div className="rounded-xl p-4 mb-5 border" style={{background:rgba(C.tealLight,0.55),borderColor:rgba(C.teal,0.18)}}>
            <div className="text-xs font-bold mb-1" style={{color:C.teal}}>Welcome to DEANY Islamic History</div>
            <p className="text-xs leading-relaxed" style={{color:C.dark}}>
              Before we meet Arabia, we must understand something larger: the full story of humanity begins with Adam عَلَيْهِ السَّلَام, and flows - through a chain of Prophets - directly to the final Messenger صَلَّى اللَّٰهُ عَلَيْهِ وَسَلَّمَ. This lesson starts at the very beginning.
            </p>
          </div>
          <div className="flex items-start gap-3 mb-5">
            <Mascot/>
            <div className="rounded-xl rounded-tl-sm p-4 border border-gray-100 flex-1" style={{background:'rgba(255,255,255,0.85)'}}>
              <p className="text-sm" style={{color:C.dark}}>
                <strong style={{color:C.teal}}>Fulus:</strong> We start with a challenge before I teach you anything - arrange six Prophets in the order you think they came. Trust your instincts first, then I will show you why the order matters. 📜
              </p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 mb-5">
            {[
              {icon:'⛓️',term:'The Chain',desc:'From Adam عَلَيْهِ السَّلَام to Muhammad صَلَّى اللَّٰهُ عَلَيْهِ وَسَلَّمَ'},
              {icon:'🔁',term:'Sunnah Allah',desc:'Drift, renewal, pattern'},
              {icon:'🕌',term:'The Purpose',desc:'Why history was prepared'},
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
          <button onClick={()=>setScreen('lesson')} className="w-full py-3.5 rounded-xl font-bold text-sm"
            style={{background:`linear-gradient(135deg,${C.navy},${C.teal})`,color:'white',border:'none',cursor:'pointer'}}>
            Begin Lesson <ArrowRight className="w-4 h-4 inline ml-1 -mt-0.5"/>
          </button>
        </div>
      </div>
    </div>
  );

  // ── COMPLETE ───────────────────────────────────────────────────
  if(screen==='complete'){
    const total=SCORED_COUNT, correct=results.filter(r=>r.correct).length;
    const pct=Math.round((correct/total)*100);
    const ring=pct>=80?C.green:pct>=60?C.gold:C.teal;
    const circ=2*Math.PI*36, offset=circ-(pct/100)*circ;
    return(
      <div className="min-h-screen relative overflow-hidden" style={PAGE_BG}>
        <IslamicBg/><style>{STYLES}</style>
        {confetti&&<Confetti/>}
        <div className="relative z-10 max-w-2xl mx-auto px-4 py-10">
          <div className="flex justify-between items-center mb-6">
            <button onClick={goBack} className="flex items-center gap-1.5 text-sm font-medium" style={{color:C.mid}}>
              <ChevronLeft className="w-4 h-4"/><span>Lessons</span>
            </button>
            <button onClick={goHome} className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-white shadow-md"
              style={{background:`linear-gradient(135deg,${C.teal},${C.navy})`}}>
              <Home className="w-4 h-4"/><span>Home</span>
            </button>
          </div>
          <div className="rounded-2xl p-8 border border-white/40 shadow-xl text-center su" style={CARD}>
            <div className="text-4xl mb-3">⛓️</div>
            <h1 className="text-2xl font-bold mb-1" style={{color:C.navy,fontFamily:'Georgia,serif'}}>Lesson Complete!</h1>
            <p className="text-sm mb-4" style={{color:C.mid}}>Before Arabia: The Story of Humanity</p>
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold mb-6"
              style={{background:rgba(C.gold,0.18),color:C.gold,border:`1px solid ${rgba(C.gold,0.35)}`}}>
              <Award className="w-3.5 h-3.5"/> Chain Keeper ⭐
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
                'The creation of Adam عَلَيْهِ السَّلَام and his role as first human and first Prophet',
                'The chain of Prophets: Adam - Nuh - Ibrahim - Musa - Isa - Muhammad صَلَّى اللَّٰهُ عَلَيْهِ وَسَلَّمَ',
                'Sunnah Allah: the divine pattern of drift and renewal',
                'The connection: Ibrahim عَلَيْهِ السَّلَام - Ismail عَلَيْهِ السَّلَام - Arabs - Muhammad صَلَّى اللَّٰهُ عَلَيْهِ وَسَلَّمَ',
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
                {confidence<=2?'The chain of Prophets takes time to settle. It will come back throughout this module.':confidence===3?'Solid foundation. Each subsequent lesson will reinforce the chain.':'You have the foundation. Everything from here builds on this.'}
              </p>
            </div>
            <div className="p-4 rounded-xl mb-5" style={{background:rgba(C.teal,0.07),border:`1px solid ${rgba(C.teal,0.16)}`}}>
              <div className="text-xs font-bold mb-1" style={{color:C.teal}}>Up next</div>
              <div className="text-sm font-semibold mb-0.5" style={{color:C.navy}}>L1.2: The Land and Its People</div>
              <div className="text-xs" style={{color:C.mid}}>We arrive in Arabia. What kind of land was it? Who lived there? Why did it matter to the ancient world?</div>
            </div>
            <button className="w-full py-3.5 rounded-xl font-bold text-sm pls"
              style={{background:`linear-gradient(135deg,${C.gold},${C.orange})`,color:C.navy,border:'none',cursor:'pointer'}}>
              Next Lesson <ArrowRight className="w-4 h-4 inline ml-1 -mt-0.5"/>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── LESSON ─────────────────────────────────────────────────────
  return(
    <div className="min-h-screen relative overflow-hidden" style={PAGE_BG}>
      <IslamicBg/><style>{STYLES}</style>

      {streakFlash&&(
        <div className="fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-2 rounded-full shadow-lg su"
          style={{background:`linear-gradient(135deg,${C.gold},${C.orange})`,color:C.navy}}>
          <Flame className="w-4 h-4"/><span className="text-sm font-bold">{streak} Streak! 🔥</span>
        </div>
      )}

      <div className="relative z-10 max-w-2xl mx-auto px-4 py-8">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <button onClick={goBack} className="flex items-center justify-center w-8 h-8 rounded-lg"
              style={{background:rgba(C.navy,0.06)}}
              onMouseEnter={e=>e.currentTarget.style.background=rgba(C.navy,0.12)}
              onMouseLeave={e=>e.currentTarget.style.background=rgba(C.navy,0.06)}>
              <ChevronLeft className="w-4 h-4" style={{color:C.navy}}/>
            </button>
            <div>
              <div className="text-xs font-bold" style={{color:C.navy}}>Lesson H-B1.1</div>
              <div className="text-[10px]" style={{color:C.mid}}>Before Arabia: The Story of Humanity</div>
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
