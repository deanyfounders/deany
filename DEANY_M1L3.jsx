import React, { useState, useRef, useCallback } from 'react';
import { CheckCircle, XCircle, ArrowRight, Flame, Star, BookOpen, Clock, Target, GripVertical, Award, ChevronLeft, Home } from 'lucide-react';

// ═══════════════════════════════════════════════════════════════
// TOKENS
// ═══════════════════════════════════════════════════════════════
const C = {
  navy:        '#0F172A', gold:       '#B68A2D', goldLight:  '#FFF7E6',
  teal:        '#0F766E', tealLight:  '#F0FDFA', coral:      '#B85C44',
  coralLight:  '#FFF1ED', green:      '#047857', greenLight: '#ECFDF5',
  orange:      '#B7791F', orangeLight:'#FFFBEB', purple:     '#635BFF',
  magenta:     '#A855F7', dark:       '#334155', mid:        '#64748B',
  light:       '#E2E8F0', cream:      '#FBFBF8', slate:      '#F8FAFC',
};
const STYLES = `
  @keyframes slideUp { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
  @keyframes fadeIn  { from{opacity:0} to{opacity:1} }
  @keyframes shake   { 0%,100%{transform:translateX(0)} 20%{transform:translateX(-7px)} 60%{transform:translateX(7px)} }
  @keyframes pop     { 0%{transform:scale(0.5);opacity:0} 70%{transform:scale(1.15)} 100%{transform:scale(1);opacity:1} }
  @keyframes fall    { 0%{transform:translateY(-20px) rotate(0deg);opacity:1} 100%{transform:translateY(110vh) rotate(720deg);opacity:0} }
  @keyframes pulse   { 0%,100%{opacity:0.5} 50%{opacity:1} }
  @keyframes swipeL  { to{transform:translateX(-120%) rotate(-18deg);opacity:0} }
  @keyframes swipeR  { to{transform:translateX(120%)  rotate( 18deg);opacity:0} }
  .su  { animation: slideUp 0.32s ease-out both }
  .fi  { animation: fadeIn  0.22s ease-out both }
  .shk { animation: shake   0.28s ease both }
  .pop { animation: pop     0.36s cubic-bezier(.17,.67,.35,1.3) both }
  .pls { animation: pulse   1.6s ease-in-out infinite }
  .swL { animation: swipeL  0.35s ease-in both }
  .swR { animation: swipeR  0.35s ease-in both }
`;
function rgba(hex, a=1){
  const r=parseInt(hex.slice(1,3),16), g=parseInt(hex.slice(3,5),16), b=parseInt(hex.slice(5,7),16);
  return `rgba(${r},${g},${b},${a})`;
}
function md(text){
  return text.split(/(\*\*[^*]+\*\*)/).map((p,i)=>
    p.startsWith('**')&&p.endsWith('**')
      ? <strong key={i} style={{color:C.navy}}>{p.slice(2,-2)}</strong>
      : <React.Fragment key={i}>{p}</React.Fragment>
  );
}
const PAGE_BG = {background:'#FBFBF8'};
const CARD    = {background:'#FFFFFF',border:'1px solid #E2E8F0',boxShadow:'0 18px 45px rgba(15,23,42,0.06)'};

// ═══════════════════════════════════════════════════════════════
// SHARED UI
// ═══════════════════════════════════════════════════════════════
function IslamicBg(){
  return(
    <svg className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden="true">
      <defs>
        <pattern id="ip3" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
          <path d="M30 0L60 30L30 60L0 30Z" fill="none" stroke={C.teal} strokeWidth="0.5" opacity="0.025"/>
          <circle cx="30" cy="30" r="12" fill="none" stroke={C.teal} strokeWidth="0.3" opacity="0.025"/>
          <path d="M30 18L42 30L30 42L18 30Z" fill="none" stroke={C.teal} strokeWidth="0.4" opacity="0.018"/>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#ip3)"/>
    </svg>
  );
}
function Confetti(){
  const items=useRef(Array.from({length:38},(_,i)=>({
    id:i,left:`${Math.random()*100}%`,size:13+Math.random()*12,
    dur:2+Math.random()*2.5,delay:Math.random()*0.9,
    icon:['✦','✧','☆','🌟','✨','⭐','💫'][i%7],
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
  const sz={sm:'36px',md:'48px',lg:'64px'},fs={sm:'1.1rem',md:'1.5rem',lg:'2.2rem'};
  return(
    <div className="rounded-3xl border flex items-center justify-center flex-shrink-0" style={{
      width:sz[size],height:sz[size],fontSize:fs[size],
      background:'#F8FAFC',borderColor:'#E2E8F0',
      boxShadow:'0 10px 24px rgba(15,23,42,0.05)',
    }}>🪙</div>
  );
}
function ProgressBar({qNum,totalQ,score}){
  const pct=Math.min((qNum/totalQ)*100,100);
  return(
    <div className="mb-6 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex justify-between items-center mb-3">
        <span className="text-xs font-black uppercase tracking-[0.18em]" style={{color:C.mid}}>Question {Math.min(qNum+1,totalQ)} of {totalQ}</span>
        <div className="flex items-center gap-1.5 rounded-2xl px-3 py-1" style={{background:C.goldLight,color:C.navy}}>
          <Star className="w-3.5 h-3.5" style={{color:C.gold}} fill={C.gold}/>
          <span className="text-xs font-black">{score} pts</span>
        </div>
      </div>
      <div className="h-2 rounded-full overflow-hidden" style={{background:C.light}}>
        <div className="h-full rounded-full" style={{width:`${pct}%`,background:C.teal,transition:'width 0.7s ease-out'}}/>
      </div>
    </div>
  );
}
function ModeBadge({mode,type,unscored}){
  const cfg={THINK:{bg:rgba(C.purple,0.1),color:C.purple,icon:'🧠'},PLAY:{bg:rgba(C.magenta,0.1),color:C.magenta,icon:'🎮'},SORT:{bg:rgba(C.teal,0.1),color:C.teal,icon:'📦'}};
  const m=cfg[mode]||cfg.THINK;
  return(
    <div className="flex items-center gap-2 mb-4 flex-wrap">
      <span className="text-xs font-bold px-3 py-1 rounded-full" style={{background:m.bg,color:m.color}}>{m.icon} {mode}</span>
      <span className="text-xs px-2.5 py-1 rounded-full font-medium" style={{background:rgba(C.navy,0.06),color:C.mid}}>{type}</span>
      {unscored&&<span className="text-xs px-2.5 py-1 rounded-full font-bold" style={{background:rgba(C.gold,0.15),color:C.gold}}>⚡ Discovery - not scored</span>}
    </div>
  );
}
function FeedbackPanel({correct,text,bridge,meta}){
  const scoreColor = meta
    ? meta.isUnscored ? C.teal
      : meta.ok===meta.total ? C.green
      : meta.ok>=Math.ceil(meta.total*0.67) ? C.gold
      : C.coral
    : correct ? C.green : C.coral;

  return(
    <div className="mt-5 rounded-3xl p-5 su" style={{background:correct?C.greenLight:C.coralLight,color:correct?'#064E3B':'#7F1D1D'}}>
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-0.5">
          {correct?<CheckCircle className="w-5 h-5" style={{color:C.green}}/>:<XCircle className="w-5 h-5" style={{color:C.coral}}/>}
        </div>
        <div className="flex-1">
          {meta ? (
            <div className="flex items-baseline gap-2 mb-2 flex-wrap">
              <span className="text-xl font-black" style={{color:scoreColor}}>
                {meta.ok}/{meta.total}
              </span>
              <span className="text-xs font-black uppercase tracking-[0.16em]" style={{color:scoreColor}}>
                {meta.isUnscored ? 'placed' : 'correct'}
              </span>
              {!meta.isUnscored && (
                <span className="text-xs px-2 py-0.5 rounded-full font-black" style={{
                  background: meta.ok===meta.total?C.green:meta.ok>=Math.ceil(meta.total*0.67)?C.gold:C.coral,
                  color:'white'
                }}>
                  {meta.ok===meta.total?'Perfect! ⭐':meta.ok>=Math.ceil(meta.total*0.67)?'Almost!':'Keep going'}
                </span>
              )}
            </div>
          ):(
            <div className="text-xs font-black uppercase tracking-[0.18em] mb-2" style={{color:correct?C.green:C.coral}}>{correct?'Correct':'Not quite'}</div>
          )}
          <div className="text-sm font-bold leading-6" style={{color:correct?'#064E3B':'#7F1D1D'}}>{text}</div>
          {bridge&&correct&&(
            <div className="mt-4 rounded-2xl bg-white/70 p-4 flex items-start gap-2">
              <ArrowRight className="w-4 h-4 mt-0.5 flex-shrink-0" style={{color:C.teal}}/>
              <span className="text-xs font-bold leading-5" style={{color:C.teal}}>{bridge}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── RIBA DIAGRAM ─────────────────────────────────────────────
function RibaDiagram(){
  return(
    <div className="rounded-3xl overflow-hidden mb-5 border-2" style={{borderColor:rgba(C.coral,0.3)}}>
      {/* Header */}
      <div className="px-4 py-2.5 flex items-center gap-2" style={{background:`linear-gradient(135deg,${C.coral},${C.orange})`}}>
        <span className="text-base">⚡</span>
        <span className="text-xs font-black tracking-wide text-white uppercase">Why Ribā is Unjust</span>
      </div>

      {/* Main visual */}
      <div className="p-4" style={{background:'white'}}>

        {/* The deal */}
        <div className="flex items-stretch gap-2 mb-3">
          {/* Lender box */}
          <div className="flex-1 rounded-2xl p-3 text-center border-2" style={{background:C.greenLight,borderColor:C.green}}>
            <div className="text-2xl mb-1">🏦</div>
            <div className="text-xs font-black" style={{color:C.navy}}>LENDER</div>
            <div className="mt-2 px-2 py-1 rounded-xl text-[10px] font-black" style={{background:C.green,color:'white'}}>
              ZERO RISK
            </div>
            <div className="mt-1.5 text-[9px] leading-tight" style={{color:C.green}}>
              Gets paid<br/>no matter what
            </div>
          </div>

          {/* Centre - money flows */}
          <div className="flex flex-col items-center justify-center gap-1 w-16 flex-shrink-0">
            {/* Gives AED 1000 */}
            <div className="flex items-center gap-1 w-full">
              <div className="flex-1 h-0.5 rounded" style={{background:C.teal}}/>
              <div className="text-[8px] font-black px-1.5 py-0.5 rounded-full whitespace-nowrap" style={{background:C.teal,color:'white'}}>→ 1,000</div>
            </div>
            <div className="text-[9px] font-bold" style={{color:C.mid}}>LOAN</div>
            {/* Gets AED 1200 */}
            <div className="flex items-center gap-1 w-full">
              <div className="text-[8px] font-black px-1.5 py-0.5 rounded-full whitespace-nowrap" style={{background:C.coral,color:'white'}}>1,200 ←</div>
              <div className="flex-1 h-0.5 rounded" style={{background:C.coral}}/>
            </div>
            <div className="text-[9px] font-black" style={{color:C.coral}}>ALWAYS</div>
          </div>

          {/* Borrower box */}
          <div className="flex-1 rounded-2xl p-3 text-center border-2" style={{background:C.coralLight,borderColor:C.coral}}>
            <div className="text-2xl mb-1">🧍</div>
            <div className="text-xs font-black" style={{color:C.navy}}>BORROWER</div>
            <div className="mt-2 px-2 py-1 rounded-xl text-[10px] font-black" style={{background:C.coral,color:'white'}}>
              ALL RISK
            </div>
            <div className="mt-1.5 text-[9px] leading-tight" style={{color:C.coral}}>
              Business fails?<br/>Still owes extra
            </div>
          </div>
        </div>

        {/* The injustice - visual breakdown */}
        <div className="rounded-2xl p-3 border" style={{background:rgba(C.navy,0.04),borderColor:rgba(C.navy,0.1)}}>
          <div className="text-[10px] font-black mb-2 text-center uppercase tracking-wide" style={{color:C.navy}}>What makes this unjust</div>
          <div className="grid grid-cols-2 gap-2">
            {[
              {icon:'💰',label:'No trade',desc:'No goods or service exchanged',bad:true},
              {icon:'⏱️',label:'Time = money',desc:'Profit just from time passing',bad:true},
              {icon:'⚖️',label:'One-sided',desc:'Lender profits regardless',bad:true},
              {icon:'🚫',label:'No trade',desc:'Allowed: profit from real work',bad:false},
            ].map((item,i)=>(
              <div key={i} className="flex items-start gap-1.5">
                <span className="text-sm flex-shrink-0">{item.icon}</span>
                <div>
                  <div className="text-[9px] font-black" style={{color:item.bad?C.coral:C.green}}>{item.label}</div>
                  <div className="text-[9px] leading-tight" style={{color:C.mid}}>{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contrast: ribā vs trade */}
        <div className="grid grid-cols-2 gap-2 mt-3">
          <div className="rounded-2xl p-2.5 text-center border-2" style={{background:C.coralLight,borderColor:C.coral}}>
            <div className="text-xs font-black mb-0.5" style={{color:C.coral}}>❌ Ribā</div>
            <div className="text-[10px] leading-snug" style={{color:C.dark}}>
              Money lent → Money back + extra<br/>
              <span className="font-bold">No product. No service. No trade.</span>
            </div>
          </div>
          <div className="rounded-2xl p-2.5 text-center border-2" style={{background:C.greenLight,borderColor:C.green}}>
            <div className="text-xs font-black mb-0.5" style={{color:C.green}}>✅ Halal Trade</div>
            <div className="text-[10px] leading-snug" style={{color:C.dark}}>
              Buy for 100 → Sell for 120<br/>
              <span className="font-bold">Real exchange. Real risk. Permitted.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── THREE-WAY TABLE ──────────────────────────────────────────
function ThreeWayTable(){
  const cols=[
    {title:'Ribā',arabic:'ربا',icon:'🔁',color:C.coral,bg:C.coralLight,meaning:'Exploitative increase',problem:'Zero risk for lender',test:'Guaranteed return on money lent?',example:'Savings account interest',hurt:'Borrower (all risk)',quran:'2:275'},
    {title:'Gharar',arabic:'غرر',icon:'🌫️',color:C.orange,bg:C.orangeLight,meaning:'Excessive uncertainty',problem:'Deal structure hidden',test:'Can both sides see clearly?',example:'Mystery box purchase',hurt:'Uninformed party',quran:'4:29'},
    {title:'Maysir',arabic:'ميسر',icon:'🎲',color:C.gold,bg:C.goldLight,meaning:'Gambling',problem:'No real exchange',test:'Is outcome pure chance?',example:'Lottery ticket',hurt:'Loser (and society)',quran:'5:90'},
  ];
  const rows=[{l:'Meaning',k:'meaning'},{l:'Core Problem',k:'problem'},{l:'Simple Test',k:'test'},{l:'Real Example',k:'example'},{l:'Who Gets Hurt',k:'hurt'},{l:'Quran',k:'quran'}];
  return(
    <div className="rounded-2xl overflow-hidden border mb-5" style={{borderColor:rgba(C.navy,0.1)}}>
      <div className="grid grid-cols-3">
        {cols.map(col=>(
          <div key={col.title} className="p-3 text-center border-r last:border-r-0" style={{background:col.bg,borderColor:rgba(C.navy,0.08)}}>
            <div className="text-xl mb-0.5">{col.icon}</div>
            <div className="text-sm font-bold" style={{color:col.color}}>{col.title}</div>
            <div className="text-xs font-bold" style={{color:rgba(col.color,0.65)}}>{col.arabic}</div>
          </div>
        ))}
      </div>
      {rows.map((row,ri)=>(
        <div key={row.k} className="grid grid-cols-3 border-t" style={{borderColor:rgba(C.navy,0.07),background:ri%2===0?'white':rgba(C.tealLight,0.2)}}>
          {cols.map(col=>(
            <div key={col.title} className="p-2.5 border-r last:border-r-0 text-xs" style={{borderColor:rgba(C.navy,0.07)}}>
              <div className="text-[9px] font-bold mb-0.5 uppercase tracking-wide" style={{color:C.mid}}>{row.l}</div>
              <div className="leading-snug" style={{color:row.k==='quran'?col.color:C.dark,fontWeight:row.k==='test'?'600':'400'}}>{col[row.k]}</div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

// ─── FAKE AD CARD ─────────────────────────────────────────────
function FakeAdCard(){
  return(
    <div className="rounded-2xl overflow-hidden mb-4 shadow-sm border-2" style={{borderColor:rgba(C.gold,0.4)}}>
      <div className="px-4 py-2 flex items-center justify-between" style={{background:C.navy}}>
        <span className="text-[10px] font-bold tracking-widest uppercase" style={{color:rgba(C.gold,0.7)}}>Sponsored · Investment</span>
        <span className="text-[9px] px-2 py-0.5 rounded" style={{background:rgba(C.gold,0.15),color:C.gold}}>Ad</span>
      </div>
      <div className="p-4" style={{background:`linear-gradient(135deg,${C.navy} 0%,#243558 100%)`}}>
        <div className="text-center mb-3">
          <div className="text-[10px] font-bold tracking-widest mb-1" style={{color:rgba(C.gold,0.7)}}>INVEST WITH US</div>
          <div className="text-3xl font-black" style={{color:C.gold,fontFamily:'inherit'}}>12% GUARANTEED</div>
          <div className="text-xs" style={{color:'rgba(255,255,255,0.6)'}}>Annual Returns</div>
        </div>
        <div className="space-y-1.5 mb-3">
          {['No Risk to Your Capital','Diversified Portfolio','Minimum AED 10,000'].map((f,i)=>(
            <div key={i} className="flex items-center gap-2 text-xs" style={{color:'rgba(255,255,255,0.85)'}}>
              <CheckCircle className="w-3.5 h-3.5 flex-shrink-0" style={{color:C.gold}}/>{f}
            </div>
          ))}
        </div>
        <div className="w-full py-2 rounded-xl text-xs font-bold text-center" style={{background:C.gold,color:C.navy}}>
          INVEST NOW →
        </div>
      </div>
      <div className="px-3 py-1.5 text-[9px] text-center" style={{background:rgba(C.light,0.8),color:C.mid}}>
        *Terms and conditions apply. Past performance not indicative of future results.
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// DATA
// ═══════════════════════════════════════════════════════════════
const SECTIONS=[
  {
    id:'A',title:'Ribā - The Guaranteed Increase',icon:'🔁',iconColor:C.coral,
    content:[
      "Remember that loan scenario you just sorted? Lending AED 1,000 and getting AED 1,200 back no matter what? That's **ribā (ربا)**.",
      "Ribā literally means 'increase' or 'excess.' In Islamic finance, it's a guaranteed increase on money lent - money that grows simply because time passes, with **no trade, no risk, and no effort** from the lender.",
      "Why is it prohibited? Because the lender takes **zero risk.** If the borrower's business fails, they still owe the extra. If they lose everything, they still owe the extra. The entire burden falls on the person who can least afford it.",
      "This is why a conventional savings account that pays 'interest' involves ribā. The bank takes your money, invests it, keeps most of the profit, and gives you a guaranteed fixed return. That's not trade - it's ribā.",
    ],
    ribaDiagram:true,
    quran:{
      arabic:'ٱلَّذِينَ يَأْكُلُونَ ٱلرِّبَوٰا۟ لَا يَقُومُونَ إِلَّا كَمَا يَقُومُ ٱلَّذِى يَتَخَبَّطُهُ ٱلشَّيْطَٰنُ مِنَ ٱلْمَسِّ ۚ ... وَأَحَلَّ ٱللَّهُ ٱلْبَيْعَ وَحَرَّمَ ٱلرِّبَوٰا۟',
      text:'"Those who consume ribā cannot stand [on the Day of Judgement] except as one beaten by Satan into madness. That is because they say, \'Trade is just like ribā.\' But Allah has permitted trade and has forbidden ribā."',
      ref:'Quran 2:275',
      note:"The key contrast: trade = permitted (real exchange, real risk, real value created). Ribā = forbidden (no exchange, no risk for the lender, money made from money alone).",
    },
    misconception:"'All interest is the same.' Not quite. Ribā is about a **guaranteed increase on money lent** without trade or risk. A merchant who buys for AED 100 and sells for AED 120 is NOT ribā - that's profit from real trade with real risk.",
  },
  {
    id:'B',title:'Gharar - The Fog in the Deal',icon:'🌫️',iconColor:C.orange,
    content:[
      "The second prohibition is **gharar (غرر)**. It literally means 'uncertainty' or 'hazard' - but a better translation is **'fog in the deal.'**",
      "Gharar happens when one side doesn't know what they're getting, terms are unclear, or the outcome depends on something hidden. It's not the normal uncertainty of life ('will my business succeed?'). It's **uncertainty built into the deal itself.**",
      "The key: gharar is about **hidden information in the deal structure.** Not about whether business is risky - all business is risky. Gharar is when the deal itself is a fog machine.",
    ],
    ghararTable:[
      {left:'Paying for a "mystery box" - you don\'t know what\'s inside.',right:'Buying a phone - you know exactly what you\'re getting.'},
      {left:'Investing without knowing where the money goes.',right:'Investing in a business with a clear plan (might still fail, but you know the plan).'},
      {left:'Insurance: you pay premiums, may never get anything back.',right:'A sale with a warranty: product, price, and terms are all clear.'},
    ],
  },
  {
    id:'C',title:'Maysir - The Gamble',icon:'🎲',iconColor:C.gold,
    content:[
      "The third prohibition is **maysir (ميسر)** - gambling. The most intuitive of the three. Any transaction where the outcome is based purely on chance, not skill, knowledge, or trade.",
      "Why prohibited? Because it creates wealth from nothing. No product made, no service provided, no trade occurs. One wins, the other loses - purely random. **A zero-sum game dressed as opportunity.**",
      "The simple test: is the outcome based on pure chance with no real exchange of value? If yes - maysir.",
    ],
    maysirTable:[
      {left:'Betting on a football match.',right:'Investing in a business (real trade with real risk).'},
      {left:'Casino gambling.',right:'Buying a product that might appreciate in value.'},
      {left:'Lottery tickets.',right:'Takāful - Islamic insurance where surplus is returned.'},
    ],
    threeWayCallout:true,
  },
  {
    id:'D',title:'All Three Together',icon:'⚖️',iconColor:C.teal,
    content:[
      "A single product can contain **more than one poison.** Conventional insurance involves ribā (premiums invested in interest), gharar (you don't know if you'll get anything back), and maysir (outcome feels like a gamble). You'll learn the alternative - takāful - in Module 4.",
      "If a deal contains ANY of these three, it fails the custodian test. Some deals contain all three.",
    ],
    threeWayTable:true,
    takeaway:"Three things a custodian must never allow: **Ribā** - guaranteed profit, zero risk for lender. **Gharar** - hidden information, foggy deal. **Maysir** - pure chance, no real exchange.",
  },
];

const QUESTIONS=[
  {
    id:'q1',position:'first',scored:false,
    type:'bucket3',mode:'SORT',typeLabel:'3-Bucket Sort',level:'2/5',
    question:"Before we explain the rules, trust your gut. Sort these 6 financial scenarios into the category that feels right.",
    buckets:[
      {id:'fair',   label:'Feels Fair',         icon:'✅',color:C.green, bg:C.greenLight, desc:'Seems like a normal, honest deal'},
      {id:'unclear',label:'Feels Risky/Unclear', icon:'🌫️',color:C.orange,bg:C.orangeLight,desc:"Something feels off - unclear"},
      {id:'gamble', label:'Feels Like Gambling', icon:'🎲',color:C.coral, bg:C.coralLight, desc:'This is basically a bet'},
    ],
    items:[
      {text:'You lend AED 1,000 and they MUST repay AED 1,200 regardless of what happens.',correct:'fair',trap:true,trapMsg:"Most people think a guaranteed loan repayment is fair. It SEEMS fair. But this is the most severely prohibited transaction in Islam. It's called ribā - and you're about to learn why."},
      {text:'You buy a car, inspect it, and sell it for a profit.',correct:'fair'},
      {text:'You pay AED 500 for a mystery box - could be worth AED 50 or AED 5,000.',correct:'unclear'},
      {text:'You invest AED 10,000 but nobody tells you where the money goes.',correct:'unclear'},
      {text:'You pay insurance premiums for 10 years, never claim, get nothing back.',correct:'unclear'},
      {text:'You bet AED 100 on a football match.',correct:'gamble'},
    ],
    summaryFeedback:{
      high:"Strong instincts! You can already feel the differences. Now let's name them: ribā, gharar, and maysir.",
      mid: "Good sense! Most people get the gambling ones right but struggle with the unclear ones. That's exactly what this lesson sorts out.",
      low: "No worries - that's why this lesson exists. By the end, you'll sort these instantly.",
    },
  },
  {
    id:'q2',afterSection:'A',
    type:'mcq',mode:'THINK',typeLabel:'Multiple Choice',level:'2/5',
    question:"Which BEST describes why ribā is prohibited?",
    options:[
      {id:'a',text:'Because making profit is wrong in Islam.',correct:false},
      {id:'b',text:'Because the lender profits with zero risk while the borrower bears everything.',correct:true},
      {id:'c',text:'Because lending money to people is not allowed.',correct:false},
      {id:'d',text:'Because interest rates are too high.',correct:false},
    ],
    feedback:{
      a:"That contradicts Lesson 1! The Prophet ﷺ was a merchant who made profit. Islam encourages fair profit from trade. Ribā is about RISK-FREE profit, not profit itself.",
      b:"Exactly. The issue isn't profit - Islam encourages fair profit from real trade. The issue is RISK-FREE profit from money lent. One side bears everything, the other bears nothing. That's the injustice.",
      c:"Lending is encouraged in Islam - it's called qard hasan (a good loan). What's forbidden is charging EXTRA. You can lend AED 1,000 and ask for AED 1,000 back. Not AED 1,200.",
      d:"Even 0.1% interest is ribā. It's not the rate - it's the structure. A guaranteed return on money lent with no trade or risk. The rate is irrelevant.",
    },
  },
  {
    id:'q3',afterSection:'B',
    type:'swipe',mode:'PLAY',typeLabel:'Swipe Left / Right',level:'2/5',
    question:"Swipe: is each scenario GHARAR or NORMAL RISK?",
    leftLabel:'GHARAR',leftColor:C.orange,leftBg:C.orangeLight,
    rightLabel:'NORMAL RISK',rightColor:C.green,rightBg:C.greenLight,
    cards:[
      {text:'You buy shares in a company with published financials.',answer:true,right:'✅ Published financials = transparent. Risk, not fog.',wrong:'❌ Financials are public - you see what you\'re investing in. That\'s transparent risk, not gharar.'},
      {text:"You pay for a product you've never seen and can't inspect.",answer:false,right:'✅ Can\'t see it = the deal itself is unclear. Gharar.',wrong:'❌ Not knowing what you buy IS gharar. The fog is built into the deal.'},
      {text:'You start a restaurant - it might fail.',answer:true,right:'✅ Might fail, but you know what you\'re starting. Life risk.',wrong:'❌ You know exactly what the business is. It might fail, but that\'s not gharar.'},
      {text:"You invest in a fund but nobody will tell you what it holds.",answer:false,right:"✅ Secret investments = you can't see what you agreed to. Classic gharar.",wrong:"❌ If money goes somewhere unknown, the deal is hidden. That IS gharar."},
      {text:'You sell your used car to someone who test-drove it first.',answer:true,right:'✅ Test drive = full inspection. Both sides see clearly.',wrong:'❌ Buyer inspected the car. Both know what they\'re getting. No fog.'},
      {text:'You pay someone for a job but the scope is completely undefined.',answer:false,right:'✅ Undefined scope = nobody knows what\'s being paid for. Gharar.',wrong:'❌ Scope undefined = unclear exchange. That\'s gharar by definition.'},
    ],
    summaryFeedback:{
      perfect:"Nailed it. Gharar = fog in the deal. Normal risk = you see clearly even if the outcome is uncertain.",
      good:   "Almost! Ask: can you SEE what the deal is? Yes = normal risk. No = gharar.",
      low:    "The key: gharar isn't 'things might go wrong.' It's 'I can't see what I'm agreeing to.' The FOG is the problem, not the risk.",
    },
  },
  {
    id:'q4',afterSection:'C',
    type:'verdict',mode:'SORT',typeLabel:'Give Your Verdict',level:'2/5',
    question:"You're the financial compliance judge. Review each case - then stamp your ruling.",
    cases:[
      {
        caseNum:'01',
        emoji:'🤝',
        title:'The Guaranteed Loan',
        brief:'A lender advances AED 5,000 to a farmer. Regardless of whether the harvest succeeds or fails, the farmer must repay AED 6,250 in three months.',
        verdict:'riba',
        reasoning:"Ribā. The lender is guaranteed AED 1,250 extra no matter what happens to the farmer. Zero risk for the lender - all risk for the borrower. This is exactly the structure Islam prohibits.",
      },
      {
        caseNum:'02',
        emoji:'📱',
        title:'The Vague Contract',
        brief:"A business pays a freelancer AED 3,000 per month to 'grow the brand online.' No deliverables specified. No timeline. No scope. Just a monthly transfer.",
        verdict:'gharar',
        reasoning:"Gharar. Neither party can define what 'grow the brand' actually means. The exchange itself is fog - no clarity on what is being bought or sold. That's gharar.",
      },
      {
        caseNum:'03',
        emoji:'🏆',
        title:'The Office Pot',
        brief:"Every week, 20 employees each put in AED 50. On Friday, one name is drawn at random to win the entire AED 1,000 pot. No product, no service, no trade.",
        verdict:'maysir',
        reasoning:"Maysir. Money in, random winner, nothing exchanged. The friendly setting doesn't change the structure. Dress a lottery in any clothes - it's still a lottery.",
      },
      {
        caseNum:'04',
        emoji:'📊',
        title:'The Startup Pitch',
        brief:"An entrepreneur shows a business plan, projected revenues, and risks. You invest AED 10,000 for 8% equity. The business might fail - she's upfront about that.",
        verdict:'none',
        reasoning:"Clean deal. You can see what you're investing in. Risk is shared - she might fail, you might lose. No guaranteed return is promised. This is exactly what Islam encourages.",
      },
    ],
    stampOptions:[
      {id:'riba',  label:'RIBĀ',  arabic:'ربا',  icon:'🔁',color:C.coral, bg:C.coralLight},
      {id:'gharar',label:'GHARAR',arabic:'غرر',  icon:'🌫️',color:C.orange,bg:C.orangeLight},
      {id:'maysir',label:'MAYSIR',arabic:'ميسر',icon:'🎲',color:C.gold,  bg:C.goldLight},
      {id:'none',  label:'HALAL', arabic:'حلال', icon:'✅',color:C.green, bg:C.greenLight},
    ],
    feedback:{
      perfect:"4/4 - flawless. You can identify each prohibition in a real case, and you know when a deal is clean. That's the custodian's skill.",
      good:   "Strong. The clean deal (startup) is the tricky one - real risk with full transparency is NOT gharar. That's exactly what Islamic finance encourages.",
      low:    "The pattern: ribā = guaranteed return on money. Gharar = can't see what you agreed to. Maysir = pure chance, no exchange. Halal = real trade, real risk, full clarity.",
    },
  },
  {
    id:'q5',afterSection:'D',
    type:'bucket3',mode:'SORT',typeLabel:'3-Bucket Sort',level:'2/5',
    question:"Now with the proper names: sort these scenarios into Ribā, Gharar, or Maysir.",
    buckets:[
      {id:'riba',  label:'Ribā',  icon:'🔁',color:C.coral, bg:C.coralLight, desc:'Guaranteed return on money lent'},
      {id:'gharar',label:'Gharar',icon:'🌫️',color:C.orange,bg:C.orangeLight,desc:'Hidden information, unclear deal'},
      {id:'maysir',label:'Maysir',icon:'🎲',color:C.gold,  bg:C.goldLight,  desc:'Pure chance, no real exchange'},
    ],
    items:[
      {text:'A bank pays you 3% on your savings no matter how it invests.',correct:'riba'},
      {text:'You pay for a service but the deliverables are completely undefined.',correct:'gharar'},
      {text:"You put AED 200 into a store's prize draw.",correct:'maysir'},
      {text:"You lend a friend AED 5,000 and charge AED 500 'for the inconvenience.'",correct:'riba'},
      {text:'You buy a house without ever seeing inside it.',correct:'gharar'},
      {text:'You bet your friend AED 50 on who finishes lunch first.',correct:'maysir'},
    ],
    summaryFeedback:{
      high:"All correct. You can identify which poison is which in real scenarios. That's exactly the skill this lesson builds.",
      mid: "Almost! Ribā = guaranteed money on money (both bank interest AND the friend's loan surcharge are the same prohibition). Gharar = can't see the deal. Maysir = pure chance.",
      low: "The tests: Ribā - guaranteed return on money lent? Gharar - can both sides see clearly? Maysir - pure chance? Run each scenario through these three filters.",
    },
  },
  {
    id:'q6',afterSection:'D',
    type:'word-order',mode:'THINK',typeLabel:'Drag & Drop',level:'2/5',
    question:"Drag the words into the correct order to complete the custodian's checklist:",
    sentenceParts:['Before any financial decision, a custodian checks: is there ','  in this deal? Is there ',' in the structure? Is the outcome based on ','?'],
    correctWords:['ribā','gharar','maysir'],
    wordBank:['ribā','gharar','maysir','amānah','profit'],
    feedback:{
      perfect:"Perfect. Ribā, gharar, maysir - the three-question checklist. Every deal, every time. This is the custodian's filter.",
      partial:"Almost! The three checks: ribā (guaranteed return?), gharar (hidden information?), maysir (pure chance?). Amānah is the framework that makes you ask. Profit is what you're allowed to make.",
      wrong:  "The checklist: (1) Is there RIBĀ? (2) Is there GHARAR? (3) Is it MAYSIR? Amānah is the mindset - these prohibitions are what you're checking FOR.",
    },
  },
  {
    id:'q7',afterSection:'D',
    type:'mcq',mode:'THINK',typeLabel:'Scenario - Level 3',level:'3/5',
    isCapstone:true,multiPoison:true,showFakeAd:true,
    question:"Which prohibition(s) does this investment ad most likely involve?",
    options:[
      {id:'a',text:"Only gharar - because you don't know exactly where your money goes.",correct:false},
      {id:'b',text:"Only maysir - because investing is basically gambling.",correct:false},
      {id:'c',text:"Ribā AND gharar - guaranteed returns (ribā) plus unclear portfolio (gharar).",correct:true},
      {id:'d',text:"None - this sounds like a legitimate investment.",correct:false},
    ],
    feedback:{
      a:"You spotted the gharar - well done. But you missed the bigger problem: 'guaranteed 12%' and 'no risk' = ribā. Whenever someone guarantees a return on your money with no risk, that's not investing - it's ribā.",
      b:"Investing is NOT gambling. Gambling has no real trade. The problem here is that returns are GUARANTEED (ribā) and the portfolio is unclear (gharar) - not that investing is maysir.",
      c:"Exactly. Two poisons in one deal. 'Guaranteed 12%' = ribā (risk-free return on money). 'Diversified portfolio' with no details = gharar. The ad even says 'no risk to capital' - that's literally the definition of ribā. A custodian would walk away.",
      d:"This is EXACTLY the kind of deal that seems legitimate. 'Guaranteed returns, no risk' sounds great - until you apply the custodian's checklist. Guaranteed return = ribā. Unclear portfolio = gharar. Labels don't matter - substance does.",
    },
    bridge:"Next lesson: Substance Over Labels - the #1 skill in Islamic finance. You now know WHAT is prohibited. Next you learn how to DETECT it, even when it's disguised behind marketing and fancy labels.",
  },
];

const FLOW=(()=>{
  const f=[];
  QUESTIONS.filter(q=>q.position==='first').forEach(q=>f.push({type:'question',data:q}));
  SECTIONS.forEach(sec=>{
    f.push({type:'section',data:sec});
    QUESTIONS.filter(q=>q.afterSection===sec.id).forEach(q=>f.push({type:'question',data:q}));
  });
  return f;
})();
const SCORED_COUNT=QUESTIONS.filter(q=>q.scored!==false).length;

// ═══════════════════════════════════════════════════════════════
// ROOT
// ═══════════════════════════════════════════════════════════════
export default function DEANY_M1L3({ onBack, onHome, savedProgress }){
  const [screen,      setScreen]      = useState(savedProgress ? 'lesson' : 'intro');
  const [flowIdx,     setFlowIdx]     = useState(savedProgress?.flowIdx ?? 0);
  const [score,       setScore]       = useState(savedProgress?.score ?? 0);
  const [streak,      setStreak]      = useState(savedProgress?.streak ?? 0);
  const [streakFlash, setStreakFlash] = useState(false);
  const [l3Toast,     setL3Toast]     = useState(false);
  const [multiToast,  setMultiToast]  = useState(false);
  const [confetti,    setConfetti]    = useState(false);
  const [confidence,  setConfidence]  = useState(3);
  const [results,     setResults]     = useState(savedProgress?.results ?? []);

  const qDoneNum=FLOW.slice(0,flowIdx).filter(f=>f.type==='question'&&f.data.scored!==false).length;
  const current=FLOW[flowIdx];

  const handleAnswer=useCallback((correct,pts,flags={})=>{
    const isScored=flags.scored!==false;
    if(isScored) setResults(r=>{
      const newResults=[...r,{correct}];
      // Save progress for resume
      try { localStorage.setItem('deany-progress-lesson-1-3', JSON.stringify({ flowIdx: flowIdx + 1, score: correct ? score + pts : score, streak: correct ? streak + 1 : 0, results: newResults })); } catch(e) {}
      return newResults;
    });
    if(correct&&isScored){
      setScore(s=>s+pts);
      setStreak(s=>{
        const n=s+1;
        if(n>=3){setStreakFlash(true);setTimeout(()=>setStreakFlash(false),2200);}
        return n;
      });
      if(flags.isCapstone){setL3Toast(true);setTimeout(()=>setL3Toast(false),3200);}
      if(flags.multiPoison){setMultiToast(true);setTimeout(()=>setMultiToast(false),3200);}
    } else if(isScored){
      setStreak(0);
    }
  },[flowIdx, score, streak]);

  const advance=useCallback(()=>{
    window.scrollTo({top:0,behavior:'smooth'});
    if(flowIdx<FLOW.length-1){setFlowIdx(i=>i+1);}
    else{setScreen('complete');setConfetti(true);setTimeout(()=>setConfetti(false),4500);try{localStorage.removeItem('deany-progress-lesson-1-3');}catch(e){}}
  },[flowIdx]);

  const LessonNav = () => (
    <div className="flex justify-between items-center mb-6">
      <button onClick={onBack} className="flex items-center gap-1.5 text-gray-600 hover:text-emerald-700 transition-colors text-sm font-medium">
        <ChevronLeft className="w-4 h-4" /><span>Lessons</span>
      </button>
      <button onClick={onHome} className="flex items-center gap-1.5 text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 px-3 py-1.5 rounded-full text-xs font-medium transition-all shadow-sm">
        <Home className="w-3.5 h-3.5" /><span>Home</span>
      </button>
    </div>
  );

  if(screen==='intro') return(
    <div className="min-h-screen relative overflow-hidden" style={PAGE_BG}>
      <IslamicBg/><style>{STYLES}</style>
      <div className="relative z-10 max-w-5xl mx-auto px-4 py-10">
        <LessonNav />
        <div className="text-center mb-8 su">
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-bold mb-4" style={{background:rgba(C.gold,0.14),color:C.gold}}>MODULE 1 · LESSON 3</span>
          <h1 className="text-3xl font-bold mb-2" style={{color:C.navy,fontFamily:'inherit'}}>Riba, Gharar, Maysir</h1>
          <p className="text-sm" style={{color:C.mid}}>Ribā. Gharar. Maysir. The three things a custodian must never allow.</p>
        </div>
        <div className="rounded-3xl p-6 border border-slate-200 shadow-sm su" style={CARD}>
          <div className="rounded-2xl p-4 mb-5 border" style={{background:rgba(C.tealLight,0.7),borderColor:rgba(C.teal,0.18)}}>
            <div className="text-xs font-bold mb-1" style={{color:C.teal}}>📎 Continuing from Lesson 1.2</div>
            <p className="text-xs leading-relaxed" style={{color:C.dark}}>
              Wealth is amānah - a trust you manage responsibly. But what does 'responsibly' actually mean? What specifically can a custodian <strong>never</strong> do? This lesson answers with three precise prohibitions.
            </p>
          </div>
          <div className="flex items-start gap-3 mb-5">
            <Mascot/>
            <div className="rounded-2xl rounded-tl-sm p-4 border border-gray-100 flex-1" style={{background:'rgba(255,255,255,0.85)'}}>
              <p className="text-sm" style={{color:C.dark}}>
                <strong style={{color:C.teal}}>Fulus:</strong> We start with a sorting challenge - before any definitions. Trust your gut first, then I'll name what you felt. Let's build your filter! ⚖️
              </p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 mb-5">
            {[
              {term:'Ribā',  arabic:'ربا',  icon:'🔁',color:C.coral, bg:C.coralLight},
              {term:'Gharar',arabic:'غرر',  icon:'🌫️',color:C.orange,bg:C.orangeLight},
              {term:'Maysir',arabic:'ميسر',icon:'🎲',color:C.gold,  bg:C.goldLight},
            ].map((t,i)=>(
              <div key={i} className="text-center p-3 rounded-2xl border" style={{background:t.bg,borderColor:rgba(t.color,0.25)}}>
                <div className="text-xl mb-1">{t.icon}</div>
                <div className="text-sm font-bold" style={{color:t.color}}>{t.term}</div>
                <div className="text-xs font-bold" style={{color:rgba(t.color,0.65)}}>{t.arabic}</div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-3 gap-3 mb-5">
            {[
              {icon:<Clock className="w-4 h-4"/>,label:'16 min',sub:'Duration'},
              {icon:<Target className="w-4 h-4"/>,label:'7 Qs',sub:'Questions'},
              {icon:<BookOpen className="w-4 h-4"/>,label:'L2→L3',sub:'Difficulty'},
            ].map((m,i)=>(
              <div key={i} className="text-center p-3 rounded-2xl border" style={{background:rgba(C.tealLight,0.5),borderColor:rgba(C.teal,0.12)}}>
                <div className="flex justify-center mb-1" style={{color:C.teal}}>{m.icon}</div>
                <div className="text-sm font-bold" style={{color:C.navy}}>{m.label}</div>
                <div className="text-[10px]" style={{color:C.mid}}>{m.sub}</div>
              </div>
            ))}
          </div>
          <div className="rounded-xl p-3 mb-5" style={{background:C.goldLight,border:`1px solid ${rgba(C.gold,0.28)}`}}>
            <div className="text-xs font-bold mb-1" style={{color:C.gold}}>🎯 Learning Objective</div>
            <p className="text-xs leading-relaxed" style={{color:C.dark}}>Define ribā, gharar, and maysir in plain English, explain why each is harmful, give a real-world example of each, and identify which prohibition applies to a given scenario.</p>
          </div>
          <button onClick={()=>setScreen('lesson')} className="w-full py-3.5 rounded-2xl font-bold text-sm" style={{background:C.navy,color:'white'}}>
            Begin Lesson <ArrowRight className="w-4 h-4 inline ml-1 -mt-0.5"/>
          </button>
        </div>
      </div>
    </div>
  );

  if(screen==='complete'){
    const total=SCORED_COUNT, correct=results.filter(r=>r.correct).length;
    const pct=Math.round((correct/total)*100);
    const ring=pct>=80?C.green:pct>=60?C.gold:C.teal;
    const circ=2*Math.PI*36, offset=circ-(pct/100)*circ;
    return(
      <div className="min-h-screen relative overflow-hidden" style={PAGE_BG}>
        <IslamicBg/><style>{STYLES}</style>
        {confetti&&<Confetti/>}
        <div className="relative z-10 max-w-5xl mx-auto px-4 py-10">
          <LessonNav />
          <div className="rounded-3xl p-8 border border-slate-200 shadow-sm text-center su" style={CARD}>
            <div className="text-4xl mb-3">🏆</div>
            <h1 className="text-2xl font-bold mb-1" style={{color:C.navy,fontFamily:'inherit'}}>Lesson Complete!</h1>
            <p className="text-sm mb-4" style={{color:C.mid}}>Riba, Gharar, Maysir</p>
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold mb-6" style={{background:rgba(C.gold,0.18),color:C.gold,border:`1px solid ${rgba(C.gold,0.35)}`}}>
              <Award className="w-3.5 h-3.5"/> Multiple Prohibitions Spotted! ⭐
            </div>
            <div className="relative inline-block mb-6">
              <svg width="96" height="96" className="-rotate-90">
                <circle cx="48" cy="48" r="36" fill="none" stroke={C.light} strokeWidth="6"/>
                <circle cx="48" cy="48" r="36" fill="none" stroke={ring} strokeWidth="6" strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={offset} style={{transition:'stroke-dashoffset 1.5s ease-out'}}/>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold" style={{color:C.navy,fontFamily:'inherit'}}>{correct}/{total}</span>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3 mb-6">
              {[{label:'Score',value:`${score} pts`,color:C.green,bg:C.greenLight},{label:'Accuracy',value:`${pct}%`,color:C.teal,bg:C.tealLight},{label:'Level',value:'L2→L3',color:C.purple,bg:rgba(C.purple,0.1)}].map((s,i)=>(
                <div key={i} className="p-3 rounded-2xl border" style={{background:s.bg,borderColor:rgba(s.color,0.18)}}>
                  <div className="text-lg font-bold" style={{color:s.color}}>{s.value}</div>
                  <div className="text-[10px]" style={{color:C.mid}}>{s.label}</div>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-3 gap-2 mb-6">
              {[
                {icon:'🔁',term:'Ribā',  desc:'Guaranteed return, zero risk',color:C.coral, bg:C.coralLight},
                {icon:'🌫️',term:'Gharar',desc:'Hidden info, foggy deal',     color:C.orange,bg:C.orangeLight},
                {icon:'🎲',term:'Maysir',desc:'Pure chance, no exchange',    color:C.gold,  bg:C.goldLight},
              ].map((t,i)=>(
                <div key={i} className="p-2.5 rounded-2xl border text-center" style={{background:t.bg,borderColor:rgba(t.color,0.22)}}>
                  <CheckCircle className="w-3.5 h-3.5 mx-auto mb-1" style={{color:t.color}}/>
                  <div className="text-xs font-bold" style={{color:t.color}}>{t.term}</div>
                  <div className="text-[9px] leading-tight mt-0.5" style={{color:C.mid}}>{t.desc}</div>
                </div>
              ))}
            </div>
            <div className="text-left p-4 rounded-2xl mb-6" style={{background:rgba(C.greenLight,0.7),border:`1px solid ${rgba(C.green,0.18)}`}}>
              <div className="text-xs font-bold mb-2" style={{color:C.green}}>✅ Concepts Mastered</div>
              {['Ribā = guaranteed return, zero risk for lender','Gharar = hidden information, fog in the deal','Maysir = pure chance, no real exchange','Can distinguish all three from each other','Can spot multiple prohibitions in one deal'].map((c,i)=>(
                <div key={i} className="flex items-center gap-2 py-0.5">
                  <CheckCircle className="w-3.5 h-3.5 flex-shrink-0" style={{color:C.green}}/>
                  <span className="text-xs" style={{color:C.dark}}>{c}</span>
                </div>
              ))}
            </div>
            <div className="p-4 rounded-2xl mb-6" style={{background:C.goldLight,border:`1px solid ${rgba(C.gold,0.25)}`}}>
              <div className="text-xs font-bold mb-3" style={{color:C.gold}}>How confident do you feel about the three prohibitions?</div>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-[10px] w-16 text-right" style={{color:C.mid}}>Still unsure</span>
                <input type="range" min="1" max="5" value={confidence} onChange={e=>setConfidence(+e.target.value)} className="flex-1 h-2 rounded-full appearance-none cursor-pointer" style={{accentColor:C.gold}}/>
                <span className="text-[10px] w-20" style={{color:C.mid}}>Could explain</span>
              </div>
              <p className="text-xs text-center" style={{color:C.dark}}>
                {confidence<=2?"Three new concepts is a lot. They'll solidify with practice - and keep coming back in future lessons.":confidence===3?"Solid start. You know the names and the tests. Practice will sharpen this.":"You're building real analytical skills. Ready for the next step."}
              </p>
            </div>
            <div className="p-4 rounded-2xl mb-5" style={{background:rgba(C.teal,0.07),border:`1px solid ${rgba(C.teal,0.16)}`}}>
              <div className="text-xs font-bold mb-1" style={{color:C.teal}}>Up Next</div>
              <div className="text-sm font-semibold mb-0.5" style={{color:C.navy}}>Lesson 1.4: Substance Over Labels</div>
              <div className="text-xs" style={{color:C.mid}}>You know WHAT is prohibited. Now learn how to DETECT it - even when it's disguised behind marketing and fancy labels.</div>
            </div>
            <button className="w-full py-3.5 rounded-2xl font-bold text-sm" style={{background:C.gold,color:C.navy}}>
              Next Lesson <ArrowRight className="w-4 h-4 inline ml-1 -mt-0.5"/>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return(
    <div className="min-h-screen relative overflow-hidden" style={PAGE_BG}>
      <IslamicBg/><style>{STYLES}</style>
      {streakFlash&&(
        <div className="fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-2 rounded-full shadow-sm su" style={{background:`linear-gradient(135deg,${C.orange},${C.coral})`,color:'white'}}>
          <Flame className="w-4 h-4"/><span className="text-sm font-bold">{streak} Streak! 🔥</span>
        </div>
      )}
      {l3Toast&&(
        <div className="fixed top-4 left-1/2 z-50 flex items-center gap-2 px-5 py-3 rounded-full shadow-sm su" style={{background:C.navy,color:C.gold,border:`2px solid ${rgba(C.gold,0.4)}`,transform:'translateX(-50%)'}}>
          <Award className="w-4 h-4"/><span className="text-sm font-bold">Level 3 reached! That's application thinking.</span>
        </div>
      )}
      {multiToast&&(
        <div className="fixed top-16 left-1/2 z-50 flex items-center gap-2 px-5 py-3 rounded-full shadow-sm su" style={{background:`linear-gradient(135deg,${C.coral},${C.orange})`,color:'white',transform:'translateX(-50%)'}}>
          <span className="text-sm font-bold">🎯 Multiple poisons spotted!</span>
        </div>
      )}
      <div className="relative z-10 max-w-5xl mx-auto px-4 py-6">
        <LessonNav />
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center text-base" style={{background:rgba(C.coral,0.12),color:C.coral}}>⚖️</div>
            <div>
              <div className="text-xs font-bold" style={{color:C.navy}}>Lesson 1.3</div>
              <div className="text-[10px]" style={{color:C.mid}}>Riba, Gharar, Maysir</div>
            </div>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold" style={{background:C.goldLight,color:C.gold}}>
            <Star className="w-3 h-3" fill={C.gold}/> {score}
          </div>
        </div>
        <ProgressBar qNum={qDoneNum} totalQ={SCORED_COUNT} score={score}/>
        {current.type==='section'&&<SectionCard key={`s${flowIdx}`} section={current.data} onContinue={advance}/>} 
        {current.type==='question'&&<QuestionCard key={`q${flowIdx}`} q={current.data} qNum={qDoneNum} totalQ={SCORED_COUNT} onAnswer={handleAnswer} onNext={advance}/>} 
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// SECTION CARD
// ═══════════════════════════════════════════════════════════════
function SectionCard({section,onContinue}){
  return(
    <div className="su rounded-3xl overflow-hidden border border-slate-200 shadow-sm" style={CARD}>
      <div className="px-6 py-4 flex items-center gap-3" style={{background:`linear-gradient(135deg,${C.navy},${C.teal})`}}>
        <span className="text-2xl">{section.icon}</span>
        <h2 className="text-lg font-bold text-white" style={{fontFamily:'inherit'}}>{section.title}</h2>
      </div>
      <div className="p-6">
        {section.content.map((p,i)=>(
          <p key={i} className="text-sm leading-relaxed mb-4" style={{color:C.dark}}>{md(p)}</p>
        ))}
        {section.ribaDiagram&&<RibaDiagram/>}
        {section.quran&&(
          <div className="rounded-2xl overflow-hidden mb-5 border" style={{borderColor:rgba(C.gold,0.3)}}>
            <div className="px-4 py-2 flex items-center gap-2" style={{background:`linear-gradient(135deg,${C.navy},#2a3f6a)`}}>
              <span className="text-sm">📖</span>
              <span className="text-xs font-bold tracking-wide" style={{color:rgba(C.gold,0.9)}}>Quranic Reference - {section.quran.ref}</span>
            </div>
            {/* Arabic text */}
            <div className="px-5 py-4 text-right border-b" style={{background:`linear-gradient(135deg,${C.navy},#1e3460)`,borderColor:rgba(C.gold,0.15)}}>
              <p className="text-base leading-loose font-medium" style={{color:C.gold,fontFamily:'serif',direction:'rtl',lineHeight:'2.2'}}>
                {section.quran.arabic}
              </p>
            </div>
            {/* Translation */}
            <div className="px-4 py-4" style={{background:C.goldLight}}>
              <p className="text-sm italic leading-relaxed mb-2" style={{color:C.navy,fontFamily:'inherit'}}>
                {section.quran.text}
              </p>
              <p className="text-xs font-semibold mb-2" style={{color:C.gold}}> - {section.quran.ref}</p>
              {section.quran.note&&(
                <div className="pt-2 border-t text-xs leading-relaxed" style={{borderColor:rgba(C.gold,0.25),color:C.dark}}>
                  <span className="font-bold" style={{color:C.navy}}>Key insight: </span>{section.quran.note}
                </div>
              )}
            </div>
          </div>
        )}
        {section.misconception&&(
          <div className="rounded-2xl p-4 mb-4 border-l-4" style={{background:C.coralLight,borderColor:C.coral}}>
            <div className="text-xs font-bold mb-1" style={{color:C.coral}}>⚠️ Common Misconception</div>
            <p className="text-sm leading-relaxed" style={{color:C.dark}}>{md(section.misconception)}</p>
          </div>
        )}
        {section.ghararTable&&(
          <div className="rounded-2xl overflow-hidden mb-5 border" style={{borderColor:rgba(C.navy,0.1)}}>
            <div className="grid grid-cols-2 text-xs font-bold" style={{background:C.navy,color:'white'}}>
              <div className="p-2.5">🌫️ Gharar (prohibited fog)</div>
              <div className="p-2.5 border-l" style={{borderColor:'rgba(255,255,255,0.12)'}}>✅ NOT Gharar (normal risk)</div>
            </div>
            {section.ghararTable.map((row,i)=>(
              <div key={i} className="grid grid-cols-2 text-xs border-t" style={{borderColor:rgba(C.navy,0.07),background:i%2===0?'white':rgba(C.orangeLight,0.4)}}>
                <div className="p-2.5 border-r italic" style={{borderColor:rgba(C.orange,0.18),color:C.orange}}>{row.left}</div>
                <div className="p-2.5 italic" style={{color:C.green}}>{row.right}</div>
              </div>
            ))}
          </div>
        )}
        {section.maysirTable&&(
          <div className="rounded-2xl overflow-hidden mb-4 border" style={{borderColor:rgba(C.navy,0.1)}}>
            <div className="grid grid-cols-2 text-xs font-bold" style={{background:C.navy,color:'white'}}>
              <div className="p-2.5">🎲 Clearly Maysir</div>
              <div className="p-2.5 border-l" style={{borderColor:'rgba(255,255,255,0.12)'}}>✅ Not Maysir</div>
            </div>
            {section.maysirTable.map((row,i)=>(
              <div key={i} className="grid grid-cols-2 text-xs border-t" style={{borderColor:rgba(C.navy,0.07),background:i%2===0?'white':rgba(C.goldLight,0.4)}}>
                <div className="p-2.5 border-r italic" style={{borderColor:rgba(C.gold,0.18),color:C.gold}}>{row.left}</div>
                <div className="p-2.5 italic" style={{color:C.green}}>{row.right}</div>
              </div>
            ))}
          </div>
        )}
        {section.threeWayCallout&&(
          <div className="rounded-2xl p-4 mb-4" style={{background:rgba(C.navy,0.05),border:`2px solid ${rgba(C.navy,0.12)}`}}>
            <div className="text-xs font-bold mb-2" style={{color:C.navy}}>💡 The Three-Way Distinction</div>
            {[
              {color:C.coral, label:'RIBĀ  ',text:'outcome is GUARANTEED. One side takes zero risk.'},
              {color:C.orange,label:'GHARAR',text:'outcome is HIDDEN. The deal itself is foggy.'},
              {color:C.gold,  label:'MAYSIR',text:'outcome is RANDOM. No real exchange, pure chance.'},
            ].map((r,i)=>(
              <div key={i} className="flex items-start gap-2 py-1.5 border-b last:border-0" style={{borderColor:rgba(C.navy,0.07)}}>
                <span className="text-xs font-black flex-shrink-0 mt-0.5 w-14" style={{color:r.color}}>{r.label}</span>
                <span className="text-xs" style={{color:C.dark}}>= {r.text}</span>
              </div>
            ))}
            <p className="text-xs mt-2 font-semibold" style={{color:C.navy}}>Three different problems. Three different tests.</p>
          </div>
        )}
        {section.threeWayTable&&<ThreeWayTable/>}
        {section.takeaway&&(
          <div className="rounded-2xl p-4 mb-4" style={{background:C.goldLight,border:`1px solid ${rgba(C.gold,0.28)}`}}>
            <div className="text-xs font-bold mb-1" style={{color:C.gold}}>🔑 Key Takeaway</div>
            <p className="text-sm leading-relaxed" style={{color:C.dark}}>{md(section.takeaway)}</p>
          </div>
        )}
        <button onClick={onContinue} className="w-full py-3 rounded-2xl font-bold text-sm mt-1" style={{background:C.teal,color:'white'}}>
          Continue <ArrowRight className="w-4 h-4 inline ml-1 -mt-0.5"/>
        </button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// QUESTION CARD (router)
// ═══════════════════════════════════════════════════════════════
function QuestionCard({q,qNum,totalQ,onAnswer,onNext}){
  const [done,   setDone]   = useState(false);
  const [correct,setCorrect]= useState(false);
  const [fbText, setFbText] = useState('');

  const [fbMeta,  setFbMeta]  = useState(null); // {ok, total} for sort questions
  const finish=useCallback((isCorrect,text,pts,meta)=>{
    setDone(true); setCorrect(isCorrect); setFbText(text);
    if(meta) setFbMeta(meta);
    onAnswer(isCorrect,pts,{scored:q.scored,isCapstone:q.isCapstone,multiPoison:q.multiPoison});
  },[onAnswer,q.scored,q.isCapstone,q.multiPoison]);

  return(
    <div className="su rounded-3xl overflow-hidden border border-slate-200 shadow-sm" style={CARD}>
      <div className="p-6">
        <ModeBadge mode={q.mode} type={q.typeLabel} unscored={q.scored===false}/>
        {q.showFakeAd&&<FakeAdCard/>}
        <h3 className="text-sm font-bold leading-relaxed mb-5" style={{color:C.navy}}>{q.question}</h3>
        {q.type==='mcq'          &&<MCQ         q={q} done={done} onFinish={finish}/>} 
        {q.type==='bucket3'      &&<Bucket3     q={q} done={done} onFinish={finish}/>} 
        {q.type==='swipe'        &&<SwipeCards  q={q} done={done} onFinish={finish}/>} 
        {q.type==='verdict'      &&<VerdictStamp q={q} done={done} onFinish={finish}/>} 
        {q.type==='word-order'   &&<WordOrder   q={q} done={done} onFinish={finish}/>} 
        {done&&fbText&&<FeedbackPanel correct={correct} text={fbText} bridge={q.bridge} meta={fbMeta}/>} 
        {done&&(
          <button onClick={onNext} className="w-full py-3 rounded-2xl font-bold text-sm mt-4" style={{background:C.navy,color:'white'}}>
            {qNum>=totalQ-1?'Finish Lesson':'Next'} <ArrowRight className="w-4 h-4 inline ml-1 -mt-0.5"/>
          </button>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// MCQ
// ═══════════════════════════════════════════════════════════════
function MCQ({q,done,onFinish}){
  const [sel,setSel]=useState(null);
  const [sub,setSub]=useState(false);
  const [shk,setShk]=useState(null);
  const submit=()=>{
    if(sel===null||sub)return;
    setSub(true);
    const opt=q.options[sel];
    onFinish(opt.correct,q.feedback[opt.id],opt.correct?10:0);
    if(!opt.correct){setShk(sel);setTimeout(()=>setShk(null),300);}
  };
  return(
    <>
      <div className="space-y-2">
        {q.options.map((opt,i)=>{
          const picked=sel===i;
          const show=sub&&picked;
          return(
            <button key={opt.id} disabled={done} onClick={()=>!sub&&setSel(i)}
              className={`w-full text-left p-4 rounded-2xl border-2 transition-all ${shk===i?'shk':''}`}
              style={{
                background:show?(opt.correct?C.greenLight:C.coralLight):picked?rgba(C.teal,0.08):'white',
                borderColor:show?(opt.correct?C.green:C.coral):picked?C.teal:rgba(C.navy,0.1),
                transform:picked&&!sub?'translateX(4px)':'none',
              }}>
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0" style={{background:picked?C.tealLight:C.light,color:picked?C.teal:C.mid}}>{String.fromCharCode(65+i)}</span>
                <span className="text-sm" style={{color:C.dark}}>{opt.text}</span>
              </div>
            </button>
          );
        })}
      </div>
      {!sub&&(
        <button disabled={sel===null} onClick={submit} className="w-full py-3 rounded-2xl font-bold text-sm mt-4 transition-opacity" style={{background:sel===null?C.light:C.teal,color:sel===null?C.mid:'white',opacity:sel===null?0.6:1}}>
          Check Answer
        </button>
      )}
    </>
  );
}

// ═══════════════════════════════════════════════════════════════
// BUCKET SORT
// ═══════════════════════════════════════════════════════════════
function Bucket3({q,onFinish}){
  const [placed,setPlaced]=useState({});
  const [selectedItem,setSelectedItem]=useState(null);
  const [submitted,setSubmitted]=useState(false);

  const unplaced=q.items.map((it,i)=>({it,i})).filter(({i})=>!placed[i]);
  const allPlaced=Object.keys(placed).length===q.items.length;

  const place=(bucketId)=>{
    if(selectedItem===null||submitted)return;
    setPlaced(p=>({...p,[selectedItem]:bucketId}));
    setSelectedItem(null);
  };
  const remove=(idx)=>{
    if(submitted)return;
    setPlaced(p=>{const n={...p};delete n[idx];return n;});
  };
  const submit=()=>{
    if(!allPlaced||submitted)return;
    setSubmitted(true);
    const ok=q.items.reduce((acc,it,i)=>acc+(placed[i]===it.correct?1:0),0);
    const total=q.items.length;
    const isPerfect=ok===total;
    const isGood=ok>=Math.ceil(total*0.67);
    let fb;
    if(q.summaryFeedback){fb=isPerfect?q.summaryFeedback.high:isGood?q.summaryFeedback.mid:q.summaryFeedback.low;}
    else fb=`You placed ${ok}/${total} correctly.`;
    const trap=q.items.find((it,i)=>it.trap&&placed[i]===it.correct);
    if(trap) fb=trap.trapMsg+"\n\n"+fb;
    onFinish(isPerfect,fb,isPerfect?15:isGood?8:3,{ok,total,isUnscored:q.scored===false});
  };

  return(
    <div>
      {unplaced.length>0&&(
        <div className="mb-5">
          <div className="text-xs font-bold mb-2" style={{color:C.mid}}>Tap a card, then tap a bucket</div>
          <div className="space-y-2">
            {unplaced.map(({it,i})=>(
              <button key={i} onClick={()=>setSelectedItem(i)} className="w-full p-3 rounded-2xl border-2 text-left transition-all" style={{background:selectedItem===i?C.tealLight:'white',borderColor:selectedItem===i?C.teal:rgba(C.navy,0.1)}}>
                <div className="flex items-start gap-2">
                  <GripVertical className="w-4 h-4 mt-0.5 flex-shrink-0" style={{color:C.mid}}/>
                  <span className="text-sm" style={{color:C.dark}}>{it.text}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
      <div className="grid gap-3 sm:grid-cols-3 mb-4">
        {q.buckets.map(b=>(
          <button key={b.id} onClick={()=>place(b.id)} disabled={selectedItem===null||submitted} className="rounded-2xl p-3 min-h-[140px] border-2 text-left transition-all" style={{background:b.bg,borderColor:selectedItem!==null&&!submitted?b.color:rgba(b.color,0.3),opacity:selectedItem===null&&!submitted?0.9:1}}>
            <div className="text-center mb-3">
              <div className="text-xl">{b.icon}</div>
              <div className="text-xs font-black" style={{color:b.color}}>{b.label}</div>
              <div className="text-[9px] mt-0.5" style={{color:C.mid}}>{b.desc}</div>
            </div>
            <div className="space-y-1.5">
              {Object.entries(placed).filter(([_,bid])=>bid===b.id).map(([idx])=>{
                const correct=submitted&&q.items[idx].correct===b.id;
                const wrong=submitted&&q.items[idx].correct!==b.id;
                return(
                  <div key={idx} onClick={(e)=>{e.stopPropagation();remove(idx);}} className="p-2 rounded-xl text-[10px] leading-snug" style={{background:submitted?(correct?rgba(C.green,0.16):rgba(C.coral,0.16)):'white',border:submitted?`1px solid ${correct?C.green:C.coral}`:'1px solid transparent',color:C.dark}}>
                    {q.items[idx].text}
                    {submitted&&<span className="block mt-1 font-bold" style={{color:correct?C.green:C.coral}}>{correct?'✓ Correct':`→ ${q.buckets.find(x=>x.id===q.items[idx].correct)?.label}`}</span>}
                  </div>
                );
              })}
            </div>
          </button>
        ))}
      </div>
      {!submitted&&(
        <button disabled={!allPlaced} onClick={submit} className="w-full py-3 rounded-2xl font-bold text-sm" style={{background:allPlaced?C.teal:C.light,color:allPlaced?'white':C.mid,opacity:allPlaced?1:0.6}}>
          Check Sort
        </button>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// SWIPE CARDS
// ═══════════════════════════════════════════════════════════════
function SwipeCards({q,onFinish}){
  const [idx,setIdx]=useState(0);
  const [answers,setAnswers]=useState([]);
  const [anim,setAnim]=useState('');
  const [lastFb,setLastFb]=useState(null);
  const [done,setDone]=useState(false);

  const card=q.cards[idx];
  const choose=(isRight)=>{
    if(!card||done)return;
    const correct=isRight===card.answer;
    setAnim(isRight?'swR':'swL');
    setLastFb({correct,text:correct?card.right:card.wrong});
    const newAns=[...answers,correct];
    setTimeout(()=>{
      setAnswers(newAns);setAnim('');setLastFb(null);
      if(idx<q.cards.length-1){setIdx(i=>i+1);}else{
        setDone(true);
        const ok=newAns.filter(Boolean).length,total=q.cards.length;
        const fb=ok===total?q.summaryFeedback.perfect:ok>=4?q.summaryFeedback.good:q.summaryFeedback.low;
        onFinish(ok===total,fb,ok===total?15:ok>=4?8:3,{ok,total});
      }
    },550);
  };

  if(done)return null;
  return(
    <div>
      <div className="flex justify-between text-xs font-bold mb-3">
        <span style={{color:q.leftColor}}>{q.leftLabel}</span>
        <span style={{color:C.mid}}>{idx+1}/{q.cards.length}</span>
        <span style={{color:q.rightColor}}>{q.rightLabel}</span>
      </div>
      <div className="relative h-52 mb-4">
        <div className={`absolute inset-0 rounded-3xl p-5 border-2 flex items-center justify-center text-center ${anim}`} style={{background:'white',borderColor:rgba(C.navy,0.1),boxShadow:'0 8px 28px rgba(0,0,0,0.08)'}}>
          <p className="text-lg font-bold leading-relaxed" style={{color:C.navy}}>{card.text}</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <button onClick={()=>choose(false)} className="py-4 rounded-2xl font-bold text-sm" style={{background:q.leftBg,color:q.leftColor,border:`2px solid ${q.leftColor}`}}>← {q.leftLabel}</button>
        <button onClick={()=>choose(true)} className="py-4 rounded-2xl font-bold text-sm" style={{background:q.rightBg,color:q.rightColor,border:`2px solid ${q.rightColor}`}}>{q.rightLabel} →</button>
      </div>
      {lastFb&&(
        <div className="mt-3 p-3 rounded-2xl text-xs font-medium su" style={{background:lastFb.correct?C.greenLight:C.coralLight,color:lastFb.correct?C.green:C.coral}}>
          {lastFb.text}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// VERDICT STAMP
// ═══════════════════════════════════════════════════════════════
function VerdictStamp({q,onFinish}){
  const [current,setCurrent]=useState(0);
  const [answers,setAnswers]=useState({});
  const [submitted,setSubmitted]=useState(false);

  const c=q.cases[current];
  const selected=answers[current];
  const allDone=Object.keys(answers).length===q.cases.length;

  const choose=(id)=>{
    if(submitted)return;
    setAnswers(a=>({...a,[current]:id}));
  };
  const submit=()=>{
    if(!allDone||submitted)return;
    setSubmitted(true);
    const ok=q.cases.reduce((acc,cs,i)=>acc+(answers[i]===cs.verdict?1:0),0);
    const fb=ok===4?q.feedback.perfect:ok>=3?q.feedback.good:q.feedback.low;
    onFinish(ok===4,fb,ok===4?20:ok>=3?12:5,{ok,total:q.cases.length});
  };
  return(
    <div>
      <div className="mb-3 flex justify-between items-center">
        <span className="text-xs font-bold" style={{color:C.mid}}>Case {current+1} of {q.cases.length}</span>
        <div className="flex gap-1">{q.cases.map((_,i)=><div key={i} className="w-2 h-2 rounded-full" style={{background:answers[i]?C.teal:C.light}}/> )}</div>
      </div>
      <div className="rounded-3xl p-5 mb-4 border-2" style={{background:'white',borderColor:rgba(C.navy,0.1)}}>
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl" style={{background:C.tealLight}}>{c.emoji}</div>
          <div>
            <div className="text-[10px] font-black tracking-widest" style={{color:C.mid}}>CASE {c.caseNum}</div>
            <h4 className="text-lg font-bold" style={{color:C.navy}}>{c.title}</h4>
          </div>
        </div>
        <p className="text-sm leading-relaxed" style={{color:C.dark}}>{c.brief}</p>
      </div>
      <div className="grid grid-cols-2 gap-2 mb-4">
        {q.stampOptions.map(s=>{
          const picked=selected===s.id;
          return(
            <button key={s.id} onClick={()=>choose(s.id)} disabled={submitted} className="p-3 rounded-2xl border-2 transition-all" style={{background:picked?s.bg:'white',borderColor:picked?s.color:rgba(C.navy,0.1)}}>
              <div className="text-xl mb-0.5">{s.icon}</div>
              <div className="text-xs font-black" style={{color:s.color}}>{s.label}</div>
              <div className="text-[10px] font-bold" style={{color:rgba(s.color,0.65)}}>{s.arabic}</div>
            </button>
          );
        })}
      </div>
      {selected&&(
        <div className="p-3 rounded-2xl mb-4 su" style={{background:selected===c.verdict?C.greenLight:C.coralLight,border:`1px solid ${selected===c.verdict?C.green:C.coral}`}}>
          <div className="text-xs font-bold mb-1" style={{color:selected===c.verdict?C.green:C.coral}}>{selected===c.verdict?'Correct ruling':'Not the right ruling'}</div>
          <p className="text-xs leading-relaxed" style={{color:C.dark}}>{c.reasoning}</p>
        </div>
      )}
      <div className="flex gap-2">
        <button disabled={current===0} onClick={()=>setCurrent(i=>i-1)} className="flex-1 py-2.5 rounded-2xl text-sm font-bold" style={{background:C.light,color:C.mid}}>Previous</button>
        {current<q.cases.length-1?(
          <button disabled={!selected} onClick={()=>setCurrent(i=>i+1)} className="flex-1 py-2.5 rounded-2xl text-sm font-bold" style={{background:selected?C.teal:C.light,color:selected?'white':C.mid}}>Next Case</button>
        ):(
          <button disabled={!allDone||submitted} onClick={submit} className="flex-1 py-2.5 rounded-2xl text-sm font-bold" style={{background:allDone&&!submitted?C.navy:C.light,color:allDone&&!submitted?'white':C.mid}}>Submit Verdicts</button>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// WORD ORDER
// ═══════════════════════════════════════════════════════════════
function WordOrder({q,onFinish}){
  const [slots,setSlots]=useState(Array(q.correctWords.length).fill(null));
  const [bank,setBank]=useState(q.wordBank);
  const [submitted,setSubmitted]=useState(false);

  const put=(word)=>{
    if(submitted)return;
    const empty=slots.findIndex(s=>s===null);
    if(empty===-1)return;
    const ns=[...slots];ns[empty]=word;setSlots(ns);
    setBank(b=>b.filter(w=>w!==word));
  };
  const remove=(idx)=>{
    if(submitted||!slots[idx])return;
    const word=slots[idx];
    const ns=[...slots];ns[idx]=null;setSlots(ns);
    setBank(b=>[...b,word]);
  };
  const submit=()=>{
    if(slots.some(s=>!s)||submitted)return;
    setSubmitted(true);
    const ok=slots.reduce((acc,w,i)=>acc+(w===q.correctWords[i]?1:0),0);
    const fb=ok===q.correctWords.length?q.feedback.perfect:ok>=2?q.feedback.partial:q.feedback.wrong;
    onFinish(ok===q.correctWords.length,fb,ok===q.correctWords.length?15:ok>=2?8:3,{ok,total:q.correctWords.length});
  };

  return(
    <div>
      <div className="rounded-3xl p-5 mb-4" style={{background:rgba(C.tealLight,0.55),border:`1px solid ${rgba(C.teal,0.18)}`}}>
        <p className="text-sm leading-loose" style={{color:C.dark}}>
          {q.sentenceParts[0]}
          <button onClick={()=>remove(0)} className="inline-block min-w-[70px] px-3 py-1 mx-1 rounded-2xl font-bold" style={{background:slots[0]?C.teal:'white',color:slots[0]?'white':C.mid,border:`1px solid ${slots[0]?C.teal:C.light}`}}>{slots[0]||'____'}</button>
          {q.sentenceParts[1]}
          <button onClick={()=>remove(1)} className="inline-block min-w-[70px] px-3 py-1 mx-1 rounded-2xl font-bold" style={{background:slots[1]?C.orange:'white',color:slots[1]?'white':C.mid,border:`1px solid ${slots[1]?C.orange:C.light}`}}>{slots[1]||'____'}</button>
          {q.sentenceParts[2]}
          <button onClick={()=>remove(2)} className="inline-block min-w-[70px] px-3 py-1 mx-1 rounded-2xl font-bold" style={{background:slots[2]?C.gold:'white',color:slots[2]?'white':C.mid,border:`1px solid ${slots[2]?C.gold:C.light}`}}>{slots[2]||'____'}</button>
          {q.sentenceParts[3]}
        </p>
      </div>
      <div className="flex flex-wrap gap-2 mb-4">
        {bank.map(w=>(
          <button key={w} onClick={()=>put(w)} disabled={submitted} className="px-4 py-2 rounded-2xl font-bold text-sm border-2" style={{background:'white',borderColor:rgba(C.navy,0.12),color:C.navy}}>{w}</button>
        ))}
      </div>
      {!submitted&&(
        <button disabled={slots.some(s=>!s)} onClick={submit} className="w-full py-3 rounded-2xl font-bold text-sm" style={{background:slots.some(s=>!s)?C.light:C.teal,color:slots.some(s=>!s)?C.mid:'white'}}>
          Check Checklist
        </button>
      )}
    </div>
  );
}
