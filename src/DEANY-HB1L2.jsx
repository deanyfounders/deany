import React, { useState, useRef, useCallback } from 'react';
import { CheckCircle, XCircle, ArrowRight, Flame, Star, BookOpen, Clock, Target, Award, ChevronLeft, Home } from 'lucide-react';

// ================================================================
// TOKENS
// ================================================================
const C = {
  navy:'#1B2A4A', gold:'#C5A55A', goldLight:'#F5EDD6',
  teal:'#2A7B88', tealLight:'#E0F2F4', coral:'#D4654A',
  coralLight:'#FDEAE5', green:'#3A8B5C', greenLight:'#E5F5EC',
  orange:'#E8872B', orangeLight:'#FEF3E5', purple:'#6B4C9A',
  sand:'#E8D5A3', sandLight:'#F7F0DC',
  dark:'#3D3D3D', mid:'#6B6B6B', light:'#F2F2F2',
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
const PAGE_BG = {background:'linear-gradient(150deg,#eef8f4 0%,#f0f9f6 35%,#edf5fb 70%,#f4f9ee 100%)'};
const CARD    = {background:'rgba(255,255,255,0.78)',backdropFilter:'blur(16px)'};

// ================================================================
// SHARED UI
// ================================================================
function IslamicBg(){
  return(
    <svg className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden="true">
      <defs>
        <pattern id="iphb2" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
          <path d="M30 0L60 30L30 60L0 30Z" fill="none" stroke={C.gold} strokeWidth="0.5" opacity="0.04"/>
          <circle cx="30" cy="30" r="12" fill="none" stroke={C.gold} strokeWidth="0.3" opacity="0.04"/>
          <path d="M30 18L42 30L30 42L18 30Z" fill="none" stroke={C.teal} strokeWidth="0.4" opacity="0.03"/>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#iphb2)"/>
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
                {meta.ok===meta.total?'Perfect! ⭐':meta.ok>=Math.ceil(meta.total*0.6)?'Almost!':'Keep going'}
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

// ================================================================
// ARABIA DIAGRAM  -  Section A
// Amber line: the north-south trade route, the spine of Arabian
// commerce. The east-west route crosses it at Makkah.
// That crossing was not accidental.
// ================================================================
function ArabiaDiagram({onActivate}){
  const [step,setStep]=useState(0);
  const activated=useRef(false);
  const fire=()=>{ if(!activated.current){activated.current=true;onActivate&&onActivate();} };
  const DOTS=[0,1,2,3];
  const W=320,H=210;

  // Geographically accurate Arabian Peninsula outline
  // West: Red Sea coast (Aqaba → Hijaz → Yemen). East: Persian Gulf indent → Oman horn.
  // South: Aden → Oman. Coordinates fit 320×210 viewBox.
  const peninsula = [
    "M 72,14",          // NW: Gulf of Aqaba / Jordan border
    "C 68,28 62,46 58,62",   // Hijaz coast curving SSE
    "C 54,78 50,94 48,108",  // Central Hijaz (Red Sea side)
    "C 44,126 42,142 48,158", // South Hijaz → Asir coast
    "C 54,170 64,182 80,192", // Asir → Yemen coast bending east
    "C 96,200 112,204 130,200", // Bab al-Mandab / Aden
    "C 150,194 170,190 190,186", // Southern coast Hadramawt
    "C 210,180 230,172 248,160", // Dhofar → toward Oman
    "C 260,150 270,138 278,124", // Oman horn (Ras al-Hadd)
    "C 284,112 286,100 282,88",  // Oman NE coast curving into Gulf
    "C 278,76 272,66 264,58",    // UAE coast
    "C 254,50 242,44 228,40",    // Qatar / Bahrain indent
    "C 218,36 208,34 198,36",    // Gulf deepest point (Qatar tip)
    "C 188,38 180,42 174,46",    // Bahrain area curving back
    "C 168,50 164,54 162,58",    // Kuwait coast
    "C 158,64 152,60 146,52",    // Shatt al-Arab approach
    "C 140,44 134,36 128,28",    // Southern Iraq / Kuwait NW
    "L 120,18",                   // NE: Iraq/Euphrates region
    "C 108,16 92,14 72,14",      // Northern border back to start
    "Z"
  ].join(" ");

  // Key coordinates — positioned to match geographic reality
  const makkah   = {x:62,  y:108}; // Hijaz coast
  const madinah  = {x:68,  y:72};  // North of Makkah
  const yemenPt  = {x:100, y:196}; // Yemen south coast
  const syriaDir = {x:74,  y:8};   // Syria direction (off map top)
  const pgulf    = {x:278, y:100}; // Persian Gulf (east)
  const redSea   = {x:30,  y:108}; // Red Sea (west, off map)

  // Route path strings
  const nsRoute = `M${yemenPt.x},${yemenPt.y} L${makkah.x},${makkah.y} L${syriaDir.x},${syriaDir.y}`;
  const ewRoute = `M${pgulf.x},${pgulf.y} L${makkah.x},${makkah.y} L${redSea.x},${redSea.y}`;

  return(
    <div style={{borderRadius:16,overflow:'hidden',marginBottom:20,border:`1.5px solid ${rgba(C.navy,0.1)}`,boxShadow:`0 2px 16px ${rgba(C.navy,0.06)}`}}>
      {/* STAGE */}
      <div style={{background:'#F7F9FC',position:'relative'}}>
        <div style={{position:'absolute',top:12,right:14,display:'flex',gap:6,zIndex:2}}>
          {DOTS.map(d=>(
            <div key={d} style={{width:d===step?18:6,height:6,borderRadius:3,background:d<step?rgba(C.gold,0.5):d===step?C.gold:rgba(C.navy,0.14),transition:'all 0.4s cubic-bezier(.4,0,.2,1)'}}/>
          ))}
        </div>
        <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{display:'block'}}>

          {/* Ocean background  -  subtle blue-grey */}
          <rect x="0" y="0" width={W} height={H} fill="rgba(200,220,235,0.25)"/>

          {/* Peninsula fill */}
          <path d={peninsula} fill={rgba(C.sand,0.55)} stroke={rgba(C.navy,0.2)} strokeWidth="1"/>

          {/* Region labels  -  step 0 always visible */}
          <text x="60" y="92" textAnchor="middle" fontSize="8" fontWeight="600"
            fill={rgba(C.navy,0.5)} fontFamily="system-ui,sans-serif">HIJAZ</text>
          <text x="170" y="110" textAnchor="middle" fontSize="8" fontWeight="600"
            fill={rgba(C.navy,0.4)} fontFamily="system-ui,sans-serif">NAJD</text>
          <text x="105" y="184" textAnchor="middle" fontSize="7.5" fontWeight="600"
            fill={rgba(C.navy,0.4)} fontFamily="system-ui,sans-serif">YEMEN</text>
          <text x="240" y="156" textAnchor="middle" fontSize="7" fontWeight="600"
            fill={rgba(C.navy,0.3)} fontFamily="system-ui,sans-serif">OMAN</text>

          {/* Red Sea label */}
          <text x="24" y="115" textAnchor="middle" fontSize="7" fill={rgba(C.teal,0.55)}
            fontFamily="system-ui,sans-serif" transform="rotate(-90,24,115)">RED SEA</text>

          {/* Persian Gulf label  -  step 2+ */}
          {step>=2&&(
            <text x="230" y="36" textAnchor="middle" fontSize="6.5" fill={rgba(C.teal,0.5)}
              fontFamily="system-ui,sans-serif" style={{animation:'fadeIn 0.4s ease both'}}>PERSIAN GULF</text>
          )}

          {/* Makkah dot  -  always present */}
          <circle cx={makkah.x} cy={makkah.y} r={step>=3?8:5}
            fill={step>=3?C.gold:rgba(C.navy,0.65)}
            stroke="white" strokeWidth="1.5"
            style={{transition:'r 0.4s ease, fill 0.4s ease'}}/>
          <circle cx={makkah.x} cy={makkah.y} r={step>=3?14:0}
            fill="none" stroke={C.gold} strokeWidth="1.5" opacity="0.35"
            style={{transition:'r 0.5s ease'}}/>
          <text x={makkah.x+10} y={makkah.y-8} textAnchor="start" fontSize="9" fontWeight="700"
            fill={step>=3?C.gold:rgba(C.navy,0.65)}
            fontFamily="system-ui,sans-serif"
            style={{transition:'fill 0.4s ease'}}>Makkah</text>

          {/* Yathrib dot  -  step 0+ */}
          <circle cx={madinah.x} cy={madinah.y} r="3.5" fill={rgba(C.navy,0.4)} stroke="white" strokeWidth="1"/>
          <text x={madinah.x+8} y={madinah.y+4} textAnchor="start" fontSize="8"
            fill={rgba(C.navy,0.4)} fontFamily="system-ui,sans-serif">Yathrib</text>

          {/* Yemen point */}
          <circle cx={yemenPt.x} cy={yemenPt.y} r="3" fill={rgba(C.navy,0.3)}/>

          {/* N-S gold route  -  draws in at step 1 */}
          {step>=1&&(
            <path d={nsRoute} fill="none" stroke={C.gold} strokeWidth="2.5"
              strokeLinecap="round" strokeDasharray="900" className="draw-line"/>
          )}
          {/* N-S direction labels */}
          {step>=1&&(
            <>
              <text x={syriaDir.x+5} y={syriaDir.y+16} fontSize="8" fill={rgba(C.gold,0.8)}
                fontFamily="system-ui,sans-serif" style={{animation:'fadeIn 0.5s ease both'}}>Syria / Byzantine</text>
              <text x={yemenPt.x+6} y={yemenPt.y-4} fontSize="8" fill={rgba(C.gold,0.8)}
                fontFamily="system-ui,sans-serif" style={{animation:'fadeIn 0.5s ease both'}}>Yemen (spices, gold)</text>
            </>
          )}

          {/* E-W teal route  -  draws in at step 2 */}
          {step>=2&&(
            <path d={ewRoute} fill="none" stroke={C.teal} strokeWidth="2.5"
              strokeLinecap="round" strokeDasharray="900" className="draw-line"
              style={{animationDelay:'0.1s'}}/>
          )}
          {step>=2&&(
            <>
              <text x={pgulf.x-5} y={pgulf.y+14} textAnchor="end" fontSize="8"
                fill={rgba(C.teal,0.75)} fontFamily="system-ui,sans-serif"
                style={{animation:'fadeIn 0.5s ease both'}}>India / Persia</text>
              <text x={redSea.x+5} y={redSea.y+14} textAnchor="start" fontSize="8"
                fill={rgba(C.teal,0.75)} fontFamily="system-ui,sans-serif"
                style={{animation:'fadeIn 0.5s ease both'}}>Red Sea ports</text>
            </>
          )}

          {/* Step 3: Makkah glow and crossroads label */}
          {step>=3&&(
            <text x={makkah.x+18} y={makkah.y+6} textAnchor="start" fontSize="8.5" fontWeight="700"
              fill={C.gold} fontFamily="system-ui,sans-serif"
              style={{animation:'nodeIn 0.4s ease both'}}>Crossroads</text>
          )}

        </svg>
      </div>

      {/* WHITE PANEL */}
      <div style={{background:'white',borderTop:`1px solid ${rgba(C.navy,0.07)}`}}>

        {step===0&&(
          <div style={{padding:'20px 22px'}} className="su">
            <div style={{fontSize:10,fontWeight:700,letterSpacing:'0.08em',textTransform:'uppercase',color:C.mid,marginBottom:8}}>
              01 - the land
            </div>
            <div style={{fontSize:17,fontWeight:700,color:C.navy,fontFamily:'Georgia,serif',lineHeight:1.35,marginBottom:10}}>
              The Arabian Peninsula  -  vast, dry, and at the centre of the ancient world.
            </div>
            <p style={{fontSize:13,color:C.mid,lineHeight:1.65,marginBottom:20}}>
              Roughly the size of Western Europe. The Hijaz is the thin western coastal strip  -  home to Makkah and Yathrib (the city later known as Madinah). The Najd is the dry interior. Yemen in the south was the most fertile corner.
            </p>
            <button onClick={()=>{setStep(1);fire();}}
              style={{width:'100%',padding:'13px 0',borderRadius:10,fontSize:13,fontWeight:700,background:C.navy,color:'white',border:'none',cursor:'pointer'}}>
              See the north-south trade route →
            </button>
          </div>
        )}

        {step===1&&(
          <div style={{padding:'20px 22px'}} className="su">
            <div style={{fontSize:10,fontWeight:700,letterSpacing:'0.08em',textTransform:'uppercase',color:C.gold,marginBottom:8}}>
              02 - the gold route
            </div>
            <div style={{fontSize:17,fontWeight:700,color:C.navy,fontFamily:'Georgia,serif',lineHeight:1.35,marginBottom:10}}>
              From Yemen to Syria  -  the great incense route.
            </div>
            <p style={{fontSize:13,color:C.mid,lineHeight:1.65,marginBottom:20}}>
              Every year, caravans loaded with frankincense, myrrh, gold, and spices made the long journey north. This single route made the Hijaz indispensable. Whoever controlled it controlled the wealth of Arabia.
            </p>
            <button onClick={()=>setStep(2)}
              style={{width:'100%',padding:'13px 0',borderRadius:10,fontSize:13,fontWeight:700,background:rgba(C.teal,0.1),color:C.teal,border:`1.5px solid ${rgba(C.teal,0.3)}`,cursor:'pointer'}}>
              See the east-west route →
            </button>
          </div>
        )}

        {step===2&&(
          <div style={{padding:'20px 22px'}} className="su">
            <div style={{fontSize:10,fontWeight:700,letterSpacing:'0.08em',textTransform:'uppercase',color:C.teal,marginBottom:8}}>
              03 - the teal route
            </div>
            <div style={{fontSize:17,fontWeight:700,color:C.navy,fontFamily:'Georgia,serif',lineHeight:1.35,marginBottom:10}}>
              Persian Gulf to the Red Sea  -  the route from the east.
            </div>
            <p style={{fontSize:13,color:C.mid,lineHeight:1.65,marginBottom:20}}>
              Goods from India and Persia entered Arabia through the Gulf. They crossed the peninsula toward the Red Sea ports  -  and through them, into Egypt and the Byzantine world. Two great routes. They crossed at one point.
            </p>
            <button onClick={()=>setStep(3)}
              style={{width:'100%',padding:'13px 0',borderRadius:10,fontSize:13,fontWeight:700,background:C.navy,color:'white',border:'none',cursor:'pointer'}}>
              See where they meet →
            </button>
          </div>
        )}

        {step===3&&(
          <div style={{padding:'20px 22px'}} className="su">
            <div style={{fontSize:10,fontWeight:700,letterSpacing:'0.08em',textTransform:'uppercase',color:C.mid,marginBottom:8}}>
              04 - the point
            </div>
            <div style={{fontSize:17,fontWeight:700,color:C.navy,fontFamily:'Georgia,serif',lineHeight:1.35,marginBottom:14}}>
              Makkah sat at the exact crossing point. That was not a coincidence.
            </div>
            <div style={{padding:'14px 16px',borderRadius:10,background:C.navy,marginBottom:14}}>
              <p style={{fontSize:13,fontWeight:700,color:'white',fontFamily:'Georgia,serif',lineHeight:1.55,margin:0,textAlign:'center'}}>
                Every caravan passed near Makkah.<br/>
                <span style={{color:C.gold}}>The Quraysh controlled the crossroads.</span>
              </p>
            </div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
              <div style={{padding:'12px',borderRadius:10,background:rgba(C.goldLight,0.6),border:`1px solid ${rgba(C.gold,0.2)}`}}>
                <div style={{fontSize:9,fontWeight:700,textTransform:'uppercase',letterSpacing:'0.06em',color:C.gold,marginBottom:5}}>North-South</div>
                <p style={{fontSize:11,color:C.dark,lineHeight:1.55,margin:0}}>Yemen spices and incense to Syria and the Byzantine Empire.</p>
              </div>
              <div style={{padding:'12px',borderRadius:10,background:rgba(C.tealLight,0.5),border:`1px solid ${rgba(C.teal,0.18)}`}}>
                <div style={{fontSize:9,fontWeight:700,textTransform:'uppercase',letterSpacing:'0.06em',color:C.teal,marginBottom:5}}>East-West</div>
                <p style={{fontSize:11,color:C.dark,lineHeight:1.55,margin:0}}>Indian and Persian goods to Red Sea ports and Africa.</p>
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
// Three interlocking principles of the tribal code.
// Tap each to understand how they worked.
// ================================================================
function TribalDiagram({onActivate}){
  const [selected,setSelected]=useState(null);
  const activated=useRef(false);
  const tap=(i)=>{
    setSelected(i===selected?null:i);
    if(!activated.current){activated.current=true;onActivate&&onActivate();}
  };

  const W=320,H=160,CX=160,CY=80;

  const PRINCIPLES=[
    {
      id:0, name:'Asabiyyah', arabic:'عصبية', x:80, y:55, color:C.teal,
      english:'Group Loyalty',
      desc:'You defended your tribe regardless of right or wrong. The tribe\'s honour was your honour. Its enemies were your enemies. Identity was entirely collective.',
      example:'A Bedouin poet would boast of his tribe the way a modern person might speak of their nation.',
    },
    {
      id:1, name:'Muruah', arabic:'مروءة', x:240, y:55, color:C.orange,
      english:'Honour Code',
      desc:'Generosity, courage, and hospitality were the highest virtues. A man\'s reputation for these was everything. To be called stingy or cowardly was the deepest insult.',
      example:'Hosting a stranger lavishly, even at personal cost, was not kindness  -  it was obligation. To refuse was disgrace.',
    },
    {
      id:2, name:"Tha'r", arabic:'ثأر', x:160, y:132, color:C.coral,
      english:'Blood Vengeance',
      desc:'Injury to one tribe member required revenge on the offending tribe. This was a moral obligation, not a choice. It kept the peace through deterrence  -  but could trap tribes in cycles of violence for generations.',
      example:'A single killing could ignite a blood feud lasting decades, with each side obligated to avenge the last death.',
    },
  ];

  const sel = selected!==null ? PRINCIPLES[selected] : null;

  return(
    <div style={{borderRadius:16,overflow:'hidden',marginBottom:20,border:`1.5px solid ${rgba(C.navy,0.1)}`,boxShadow:`0 2px 16px ${rgba(C.navy,0.06)}`}}>
      {/* STAGE */}
      <div style={{background:'#F7F9FC'}}>
        <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{display:'block'}}>

          {/* Connector lines between principles */}
          {[[0,1],[1,2],[0,2]].map(([a,b],i)=>(
            <line key={i}
              x1={PRINCIPLES[a].x} y1={PRINCIPLES[a].y}
              x2={PRINCIPLES[b].x} y2={PRINCIPLES[b].y}
              stroke={rgba(C.navy,0.08)} strokeWidth="1.5"
              strokeDasharray="4,4"/>
          ))}

          {/* Centre label */}
          <text x={CX} y={CY+4} textAnchor="middle" fontSize="9" fontWeight="600"
            fill={rgba(C.navy,0.28)} fontFamily="system-ui,sans-serif">The tribal code</text>

          {/* Principle nodes */}
          {PRINCIPLES.map((p,i)=>{
            const isSel=selected===i;
            return(
              <g key={p.id} onClick={()=>tap(i)} style={{cursor:'pointer'}}>
                {/* Selection ring */}
                {isSel&&(
                  <circle cx={p.x} cy={p.y} r={28}
                    fill="none" stroke={p.color} strokeWidth="2" opacity="0.25"
                    style={{animation:'nodeIn 0.3s ease both'}}/>
                )}
                {/* Node */}
                <circle cx={p.x} cy={p.y} r={isSel?20:16}
                  fill={p.color} opacity={isSel?0.95:0.7}
                  stroke="white" strokeWidth="2"
                  style={{transition:'r 0.2s ease, opacity 0.2s ease'}}/>
                {/* Arabic name */}
                <text x={p.x} y={p.y-1} textAnchor="middle" fontSize="11" fontWeight="700"
                  fill="white" fontFamily="serif" direction="rtl">{p.arabic}</text>
                {/* English label */}
                <text x={p.x} y={p.y+(p.id===2?-32:32)} textAnchor="middle" fontSize="9"
                  fontWeight={isSel?'700':'500'}
                  fill={isSel?p.color:rgba(C.navy,0.5)}
                  fontFamily="system-ui,sans-serif"
                  style={{transition:'fill 0.2s ease'}}>
                  {p.name}
                </text>
                <text x={p.x} y={p.y+(p.id===2?-21:43)} textAnchor="middle" fontSize="8"
                  fill={rgba(C.navy,0.35)} fontFamily="system-ui,sans-serif">{p.english}</text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* PANEL */}
      <div style={{background:'white',borderTop:`1px solid ${rgba(C.navy,0.07)}`}}>
        {sel?(
          <div style={{padding:'18px 22px'}} className="su">
            <div style={{display:'flex',alignItems:'baseline',gap:10,marginBottom:8}}>
              <span style={{fontSize:17,fontWeight:700,color:sel.color,fontFamily:'Georgia,serif'}}>{sel.name}</span>
              <span style={{fontSize:13,color:rgba(C.navy,0.35),fontFamily:'serif',direction:'rtl'}}>{sel.arabic}</span>
              <span style={{marginLeft:'auto',fontSize:11,fontWeight:600,color:sel.color}}>{sel.english}</span>
            </div>
            <p style={{fontSize:13,color:C.mid,lineHeight:1.65,marginBottom:8}}>{sel.desc}</p>
            <div style={{padding:'10px 14px',borderRadius:8,background:rgba(sel.color,0.06),border:`1px solid ${rgba(sel.color,0.18)}`}}>
              <div style={{fontSize:9,fontWeight:700,textTransform:'uppercase',letterSpacing:'0.06em',color:sel.color,marginBottom:4}}>Example</div>
              <p style={{fontSize:12,color:C.dark,lineHeight:1.55,margin:0,fontStyle:'italic'}}>{sel.example}</p>
            </div>
          </div>
        ):(
          <div style={{padding:'18px 22px',textAlign:'center'}}>
            <p style={{fontSize:13,color:rgba(C.navy,0.35),margin:0,fontStyle:'italic'}}>
              Tap each principle to understand how the tribal system worked.
            </p>
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
  const [shk,setShk]=useState(null);
  const lockedRef=useRef(false);
  const submit=()=>{
    if(sel===null||sub||lockedRef.current)return;
    lockedRef.current=true;
    const opt=q.options[sel];
    setSub(true);
    if(!opt.correct){setShk(sel);setTimeout(()=>setShk(null),500);}
    onFinish(opt.correct,q.feedback[opt.id],opt.correct?10:0);
  };
  return(
    <div>
      <div className="grid grid-cols-1 gap-2.5 mb-4">
        {q.options.map((opt,i)=>{
          const isSel=sel===i,right=sub&&opt.correct,wrong=sub&&isSel&&!opt.correct;
          return(
            <button key={opt.id} disabled={sub} onClick={()=>!sub&&setSel(i)}
              className={`relative p-4 rounded-xl text-left text-sm font-medium border-2 transition-all ${shk===i?'shk':''}`}
              style={{background:right?C.greenLight:wrong?C.coralLight:isSel&&!sub?C.navy:'white',borderColor:right?C.green:wrong?C.coral:isSel&&!sub?C.navy:'#ddd',color:isSel&&!sub&&!right?'white':C.dark}}>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full border-2 flex-shrink-0 mt-0.5 flex items-center justify-center text-xs font-bold"
                  style={{borderColor:right?C.green:wrong?C.coral:isSel&&!sub?'rgba(255,255,255,0.5)':'#d1d5db',background:right?C.green:wrong?C.coral:'transparent',color:right||wrong?'white':isSel&&!sub?'rgba(255,255,255,0.7)':'#9ca3af'}}>
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
                {answered.correct?'Correct!':'Not quite!'}
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
          <button onClick={()=>choose('true')} style={{flex:1,padding:'16px 0',borderRadius:12,fontSize:14,fontWeight:700,border:'2px solid',borderColor:C.green,background:rgba(C.green,0.07),color:C.green,cursor:'pointer',transition:'all 0.15s'}}>
            True
          </button>
          <button onClick={()=>choose('false')} style={{flex:1,padding:'16px 0',borderRadius:12,fontSize:14,fontWeight:700,border:'2px solid',borderColor:C.coral,background:rgba(C.coral,0.07),color:C.coral,cursor:'pointer',transition:'all 0.15s'}}>
            False
          </button>
        </div>
      )}

      {/* Next button — shown after answering */}
      {answered&&(
        <button onClick={next} className="w-full py-3 rounded-xl font-bold text-sm su"
          style={{background:`linear-gradient(135deg,${C.gold},${C.orange})`,color:C.navy,border:'none',cursor:'pointer'}}>
          {isLast?'See all results':'Next statement'} <ArrowRight className="w-4 h-4 inline ml-1 -mt-0.5"/>
        </button>
      )}
    </div>
  );
}

// --- BUCKET SORT (Q3) ---
function BucketSort({q,onFinish}){
  const [assignments,setAssignments]=useState({});
  const [held,setHeld]=useState(null);
  const [submitted,setSubmitted]=useState(false);
  const [results,setResults]=useState({});
  const lockedRef=useRef(false);

  const allPlaced=q.cards.length===Object.keys(assignments).length;

  const selectCard=(cardId)=>{
    if(submitted)return;
    setHeld(h=>h===cardId?null:cardId);
  };
  const assignToBucket=(bucketId)=>{
    if(!held||submitted)return;
    setAssignments(prev=>({...prev,[held]:bucketId}));
    setHeld(null);
  };
  const removeAssignment=(cardId)=>{
    if(submitted)return;
    setAssignments(prev=>{const n={...prev};delete n[cardId];return n;});
    setHeld(cardId);
  };

  const submit=()=>{
    if(!allPlaced||submitted||lockedRef.current)return;
    lockedRef.current=true;
    const res={};
    q.cards.forEach(c=>{ res[c.id]=assignments[c.id]===c.bucket; });
    setResults(res);
    setSubmitted(true);
    const ok=Object.values(res).filter(Boolean).length;
    const total=q.cards.length;
    onFinish(ok>=5,ok===total?q.feedback.perfect:ok>=4?q.feedback.good:q.feedback.low,ok===total?10:ok>=4?7:ok*2,{ok,total});
  };

  const unassigned=q.cards.filter(c=>!assignments[c.id]);

  return(
    <div>
      <p className="text-xs mb-4" style={{color:C.mid}}>
        {submitted?'Results shown below.':'Tap a card to pick it up, then tap a bucket to place it.'}
      </p>

      {/* Buckets */}
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:8,marginBottom:16}}>
        {q.buckets.map(b=>{
          const cards=q.cards.filter(c=>assignments[c.id]===b.id);
          const isTarget=held!==null&&!submitted;
          return(
            <div key={b.id}
              onClick={()=>assignToBucket(b.id)}
              style={{
                borderRadius:12,border:`2px dashed ${isTarget?b.color:rgba(b.color,0.4)}`,
                background:isTarget?rgba(b.color,0.06):'white',
                padding:'10px 8px',minHeight:80,cursor:isTarget?'pointer':'default',
                transition:'all 0.2s ease',
              }}>
              <div style={{fontSize:10,fontWeight:700,textTransform:'uppercase',letterSpacing:'0.06em',color:b.color,marginBottom:6,textAlign:'center'}}>{b.label}</div>
              {cards.map(c=>{
                const isCorrect=submitted?results[c.id]:null;
                return(
                  <div key={c.id}
                    onClick={e=>{e.stopPropagation();removeAssignment(c.id);}}
                    style={{
                      fontSize:11,fontWeight:600,padding:'5px 7px',borderRadius:7,marginBottom:4,
                      background:isCorrect===true?C.greenLight:isCorrect===false?C.coralLight:rgba(b.color,0.1),
                      color:isCorrect===true?C.green:isCorrect===false?C.coral:b.color,
                      border:`1px solid ${isCorrect===true?C.green:isCorrect===false?C.coral:rgba(b.color,0.25)}`,
                      cursor:submitted?'default':'pointer',
                      display:'flex',alignItems:'center',gap:4,
                    }}>
                    {isCorrect===true&&<CheckCircle className="w-3 h-3 flex-shrink-0"/>}
                    {isCorrect===false&&<XCircle className="w-3 h-3 flex-shrink-0"/>}
                    {c.label}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>

      {/* Unassigned cards */}
      {!submitted&&unassigned.length>0&&(
        <div style={{marginBottom:14}}>
          <p className="text-[10px] font-bold uppercase tracking-wider mb-2" style={{color:rgba(C.navy,0.35)}}>Cards to sort</p>
          <div style={{display:'flex',flexWrap:'wrap',gap:8}}>
            {unassigned.map(c=>(
              <button key={c.id}
                onClick={()=>selectCard(c.id)}
                style={{
                  fontSize:12,fontWeight:600,padding:'8px 14px',borderRadius:20,
                  background:held===c.id?C.navy:rgba(C.navy,0.06),
                  color:held===c.id?'white':C.dark,
                  border:`1.5px solid ${held===c.id?C.navy:'#ddd'}`,
                  cursor:'pointer',transition:'all 0.15s',
                }}>
                {c.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Submit */}
      {!submitted&&(
        <button onClick={submit} disabled={!allPlaced}
          className="w-full py-3 rounded-xl font-bold text-sm"
          style={{background:allPlaced?`linear-gradient(135deg,${C.navy},${C.teal})`:C.light,color:allPlaced?'white':'#bbb',cursor:allPlaced?'pointer':'not-allowed'}}>
          Check my sorting ({Object.keys(assignments).length}/{q.cards.length} placed) →
        </button>
      )}

      {/* Per-card feedback after submit */}
      {submitted&&(
        <div className="space-y-2 mt-3">
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
    const n=[...sels];n[i]=val;setSels(n);
  };

  const submit=()=>{
    if(!allFilled||submitted||lockedRef.current)return;
    lockedRef.current=true;
    const res=sels.map((s,i)=>s===q.blanks[i].answer);
    setResults(res);
    setSubmitted(true);
    const ok=res.filter(Boolean).length;
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
        <button onClick={submit} disabled={!allFilled}
          className="w-full py-3 rounded-xl font-bold text-sm"
          style={{background:allFilled?`linear-gradient(135deg,${C.navy},${C.teal})`:C.light,color:allFilled?'white':'#bbb',cursor:allFilled?'pointer':'not-allowed'}}>
          Check my answers →
        </button>
      )}
    </div>
  );
}

// --- REFLECTION MULTI SELECT ---
function ReflectionMultiSelect({q,onFinish}){
  const [selected,setSelected]=useState(new Set());
  const [sub,setSub]=useState(false);
  const lockedRef=useRef(false);
  const toggle=(id)=>{ if(sub)return; setSelected(s=>{const n=new Set(s);n.has(id)?n.delete(id):n.add(id);return n;}); };
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
              className="w-full p-4 rounded-xl text-left transition-all border-2"
              style={{background:isSel?rgba(C.goldLight,0.8):'white',borderColor:isSel?C.gold:'#e5e7eb',cursor:sub?'default':'pointer'}}>
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
    <div className="su rounded-2xl overflow-hidden shadow-lg" style={{background:'white',border:focused?`1.5px solid ${rgba(accent,0.55)}`:`1px solid ${rgba(C.navy,0.1)}`,transition:'border-color 0.45s ease, box-shadow 0.45s ease',boxShadow:focused?`0 0 0 4px ${rgba(accent,0.08)}, 0 16px 48px ${rgba(C.navy,0.1)}`:`0 2px 16px ${rgba(C.navy,0.06)}`}}>

      {/* HEADER */}
      <div className="px-6 pt-6 pb-5" style={{borderBottom:`1px solid ${rgba(C.navy,0.07)}`,transition:'opacity 0.5s ease, filter 0.5s ease',...(focused?{opacity:0.25,filter:'blur(1.5px)',pointerEvents:'none'}:{})}}>
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center text-sm font-black" style={{background:rgba(accent,0.12),color:accent}}>{section.id}</div>
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
function QuestionCard({q,qNum,totalQ,onAnswer,onNext}){
  const [done,    setDone]    = useState(false);
  const [correct, setCorrect] = useState(false);
  const [fbText,  setFbText]  = useState('');
  const [fbMeta,  setFbMeta]  = useState(null);

  const finish=useCallback((isCorrect,text,pts,meta)=>{
    setDone(true);setCorrect(isCorrect);setFbText(text);
    if(meta)setFbMeta(meta);
    onAnswer(isCorrect,pts,{scored:q.scored});
  },[onAnswer,q.scored]);

  const isReflection=q.type==='reflection-multi';

  return(
    <div className="su rounded-2xl overflow-hidden shadow-lg" style={{background:'white',border:`1px solid ${rgba(C.navy,0.1)}`,boxShadow:`0 2px 16px ${rgba(C.navy,0.06)}`}}>
      <div className="p-6">
        <ModeBadge mode={q.mode} type={q.typeLabel} unscored={q.scored===false}/>
        <h3 className="text-sm font-bold leading-relaxed mb-4" style={{color:C.navy}}>{q.question}</h3>

        {q.type==='rapid-fire-tf'    &&<RapidFireTF        q={q} onFinish={finish}/>}
        {q.type==='mcq'              &&<MCQ                q={q} onFinish={finish}/>}
        {q.type==='bucket-sort'      &&<BucketSort         q={q} onFinish={finish}/>}
        {q.type==='fill-in-blank'    &&<FillInBlank        q={q} onFinish={finish}/>}
        {q.type==='reflection-multi' &&<ReflectionMultiSelect q={q} onFinish={finish}/>}

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
export default function DEANY_HB1_L2({onBack, onHome}){
  const [screen,      setScreen]     = useState('intro');
  const [flowIdx,     setFlowIdx]    = useState(0);
  const [score,       setScore]      = useState(0);
  const [results,     setResults]    = useState([]);
  const [streak,      setStreak]     = useState(0);
  const [streakFlash, setStreakFlash]= useState(false);
  const [confetti,    setConfetti]   = useState(false);
  const [confidence,  setConfidence] = useState(3);

  const qDoneNum=FLOW.slice(0,flowIdx).filter(f=>f.type==='question'&&f.data.scored!==false).length;
  const current=FLOW[flowIdx];

  const handleAnswer=useCallback((correct,pts,flags={})=>{
    const isScored=flags.scored!==false;
    if(isScored)setResults(r=>[...r,{correct}]);
    if(correct&&isScored){
      setScore(s=>s+pts);
      setStreak(s=>{const n=s+1;if(n>=3){setStreakFlash(true);setTimeout(()=>setStreakFlash(false),2200);}return n;});
    } else if(isScored){setStreak(0);}
  },[]);

  const advance=useCallback(()=>{
    window.scrollTo({top:0,behavior:'smooth'});
    if(flowIdx<FLOW.length-1){setFlowIdx(i=>i+1);}
    else{setScreen('complete');setConfetti(true);setTimeout(()=>setConfetti(false),5000);}
  },[flowIdx]);

  const goBack = onBack || (()=>{});
  const goHome = onHome || (()=>{});

  // ── INTRO ─────────────────────────────────────────────────────
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
            H-B1 · LESSON 1.2
          </span>
          <h1 className="text-3xl font-bold mb-2" style={{color:C.navy,fontFamily:'Georgia,serif'}}>The Land and Its People</h1>
          <p className="text-sm" style={{color:C.mid}}>Geography, trade routes, and the tribal world that shaped pre-Islamic Arabia.</p>
        </div>
        <div className="rounded-2xl p-6 border border-white/40 shadow-lg su" style={CARD}>
          <div className="rounded-xl p-4 mb-5 border" style={{background:rgba(C.tealLight,0.55),borderColor:rgba(C.teal,0.18)}}>
            <div className="text-xs font-bold mb-1" style={{color:C.teal}}>From L1.1</div>
            <p className="text-xs leading-relaxed" style={{color:C.dark}}>
              In the last lesson, you learned that the Prophet Muhammad صَلَّى اللَّٰهُ عَلَيْهِ وَسَلَّمَ was the final link in a chain of Prophets stretching back to Adam عَلَيْهِ السَّلَام  -  and that his ancestor Ismail عَلَيْهِ السَّلَام settled in Arabia. Now we arrive in Arabia itself. What kind of land was it? Who lived there? Why did it matter to the ancient world?
            </p>
          </div>
          <div className="flex items-start gap-3 mb-5">
            <div className="rounded-full flex items-center justify-center flex-shrink-0" style={{width:'48px',height:'48px',fontSize:'1.5rem',background:`linear-gradient(135deg,${C.teal},${C.navy})`,boxShadow:`0 4px 16px ${rgba(C.teal,0.4)}`}}>🗺️</div>
            <div className="rounded-xl rounded-tl-sm p-4 border border-gray-100 flex-1" style={{background:'rgba(255,255,255,0.85)'}}>
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
          <button onClick={()=>setScreen('lesson')} className="w-full py-3.5 rounded-xl font-bold text-sm"
            style={{background:`linear-gradient(135deg,${C.navy},${C.teal})`,color:'white',border:'none',cursor:'pointer'}}>
            Begin Lesson <ArrowRight className="w-4 h-4 inline ml-1 -mt-0.5"/>
          </button>
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
            <div className="text-4xl mb-3">🗺️</div>
            <h1 className="text-2xl font-bold mb-1" style={{color:C.navy,fontFamily:'Georgia,serif'}}>Lesson Complete!</h1>
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
            <button className="w-full py-3.5 rounded-xl font-bold text-sm pls"
              style={{background:`linear-gradient(135deg,${C.gold},${C.orange})`,color:C.navy,border:'none',cursor:'pointer'}}>
              Next Lesson <ArrowRight className="w-4 h-4 inline ml-1 -mt-0.5"/>
            </button>
          </div>
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

      <div className="relative z-10 max-w-2xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <button onClick={goBack} className="flex items-center justify-center w-8 h-8 rounded-lg"
              style={{background:rgba(C.navy,0.06)}}
              onMouseEnter={e=>e.currentTarget.style.background=rgba(C.navy,0.12)}
              onMouseLeave={e=>e.currentTarget.style.background=rgba(C.navy,0.06)}>
              <ChevronLeft className="w-4 h-4" style={{color:C.navy}}/>
            </button>
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
