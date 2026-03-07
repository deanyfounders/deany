import React, { useState, useRef, useCallback } from 'react';
import { CheckCircle, XCircle, ArrowRight, Flame, Star, BookOpen, Clock, Target, GripVertical, Award, ChevronLeft, Home } from 'lucide-react';

// ═══════════════════════════════════════════════════════════════
// TOKENS
// ═══════════════════════════════════════════════════════════════
const C = {
  navy:        '#1B2A4A', gold:       '#C5A55A', goldLight:  '#F5EDD6',
  teal:        '#2A7B88', tealLight:  '#E0F2F4', coral:      '#D4654A',
  coralLight:  '#FDEAE5', green:      '#3A8B5C', greenLight: '#E5F5EC',
  orange:      '#E8872B', orangeLight:'#FEF3E5', purple:     '#6B4C9A',
  magenta:     '#A855A0', dark:       '#3D3D3D', mid:        '#6B6B6B',
  light:       '#F2F2F2',
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
const PAGE_BG = {background:'linear-gradient(150deg,#f0fdf4 0%,#ecfdf5 30%,#f0f9ff 60%,#fefce8 100%)'};
const CARD    = {background:'rgba(255,255,255,0.72)',backdropFilter:'blur(16px)'};

// ═══════════════════════════════════════════════════════════════
// SHARED UI
// ═══════════════════════════════════════════════════════════════
function IslamicBg(){
  return(
    <svg className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden="true">
      <defs>
        <pattern id="ip3" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
          <path d="M30 0L60 30L30 60L0 30Z" fill="none" stroke={C.teal} strokeWidth="0.5" opacity="0.04"/>
          <circle cx="30" cy="30" r="12" fill="none" stroke={C.teal} strokeWidth="0.3" opacity="0.04"/>
          <path d="M30 18L42 30L30 42L18 30Z" fill="none" stroke={C.teal} strokeWidth="0.4" opacity="0.03"/>
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
    <div className="rounded-full flex items-center justify-center flex-shrink-0" style={{
      width:sz[size],height:sz[size],fontSize:fs[size],
      background:`linear-gradient(135deg,${C.gold},${C.orange})`,
      boxShadow:`0 4px 16px ${rgba(C.gold,0.45)}`,
    }}>🪙</div>
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
        <div className="h-full rounded-full" style={{width:`${pct}%`,background:`linear-gradient(90deg,${C.teal},${C.green})`,transition:'width 0.7s ease-out'}}/>
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
      {unscored&&<span className="text-xs px-2.5 py-1 rounded-full font-bold" style={{background:rgba(C.gold,0.15),color:C.gold}}>⚡ Discovery — not scored</span>}
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
    <div className="mt-4 rounded-xl p-5 border-2 su" style={{background:correct?C.greenLight:C.coralLight,borderColor:correct?C.green:C.coral}}>
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-0.5">
          {correct?<CheckCircle className="w-5 h-5" style={{color:C.green}}/>:<XCircle className="w-5 h-5" style={{color:C.coral}}/>}
        </div>
        <div className="flex-1">
          {meta ? (
            <div className="flex items-baseline gap-2 mb-1 flex-wrap">
              <span className="text-xl font-black" style={{color:scoreColor,fontFamily:'Georgia,serif'}}>
                {meta.ok}/{meta.total}
              </span>
              <span className="text-sm font-bold" style={{color:scoreColor}}>
                {meta.isUnscored ? 'placed' : 'correct'}
              </span>
              {!meta.isUnscored && (
                <span className="text-xs px-2 py-0.5 rounded-full font-bold" style={{
                  background: meta.ok===meta.total?C.green:meta.ok>=Math.ceil(meta.total*0.67)?C.gold:C.coral,
                  color:'white'
                }}>
                  {meta.ok===meta.total?'Perfect! ⭐':meta.ok>=Math.ceil(meta.total*0.67)?'Almost!':'Keep going'}
                </span>
              )}
            </div>
          ):(
            <div className="text-sm font-bold mb-1" style={{color:correct?C.green:C.coral}}>{correct?'Correct!':'Not quite!'}</div>
          )}
          <div className="text-sm leading-relaxed" style={{color:C.dark}}>{text}</div>
          {bridge&&correct&&(
            <div className="mt-3 pt-3 border-t flex items-start gap-2" style={{borderColor:rgba(C.green,0.28)}}>
              <ArrowRight className="w-4 h-4 mt-0.5 flex-shrink-0" style={{color:C.teal}}/>
              <span className="text-xs italic" style={{color:C.teal}}>{bridge}</span>
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
    <div className="rounded-2xl overflow-hidden mb-5 border-2" style={{borderColor:rgba(C.coral,0.3)}}>
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
          <div className="flex-1 rounded-xl p-3 text-center border-2" style={{background:C.greenLight,borderColor:C.green}}>
            <div className="text-2xl mb-1">🏦</div>
            <div className="text-xs font-black" style={{color:C.navy}}>LENDER</div>
            <div className="mt-2 px-2 py-1 rounded-lg text-[10px] font-black" style={{background:C.green,color:'white'}}>
              ZERO RISK
            </div>
            <div className="mt-1.5 text-[9px] leading-tight" style={{color:C.green}}>
              Gets paid<br/>no matter what
            </div>
          </div>

          {/* Centre — money flows */}
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
          <div className="flex-1 rounded-xl p-3 text-center border-2" style={{background:C.coralLight,borderColor:C.coral}}>
            <div className="text-2xl mb-1">🧍</div>
            <div className="text-xs font-black" style={{color:C.navy}}>BORROWER</div>
            <div className="mt-2 px-2 py-1 rounded-lg text-[10px] font-black" style={{background:C.coral,color:'white'}}>
              ALL RISK
            </div>
            <div className="mt-1.5 text-[9px] leading-tight" style={{color:C.coral}}>
              Business fails?<br/>Still owes extra
            </div>
          </div>
        </div>

        {/* The injustice — visual breakdown */}
        <div className="rounded-xl p-3 border" style={{background:rgba(C.navy,0.04),borderColor:rgba(C.navy,0.1)}}>
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
          <div className="rounded-xl p-2.5 text-center border-2" style={{background:C.coralLight,borderColor:C.coral}}>
            <div className="text-xs font-black mb-0.5" style={{color:C.coral}}>❌ Ribā</div>
            <div className="text-[10px] leading-snug" style={{color:C.dark}}>
              Money lent → Money back + extra<br/>
              <span className="font-bold">No product. No service. No trade.</span>
            </div>
          </div>
          <div className="rounded-xl p-2.5 text-center border-2" style={{background:C.greenLight,borderColor:C.green}}>
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
    <div className="rounded-xl overflow-hidden border mb-5" style={{borderColor:rgba(C.navy,0.1)}}>
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
    <div className="rounded-xl overflow-hidden mb-4 shadow-lg border-2" style={{borderColor:rgba(C.gold,0.4)}}>
      <div className="px-4 py-2 flex items-center justify-between" style={{background:C.navy}}>
        <span className="text-[10px] font-bold tracking-widest uppercase" style={{color:rgba(C.gold,0.7)}}>Sponsored · Investment</span>
        <span className="text-[9px] px-2 py-0.5 rounded" style={{background:rgba(C.gold,0.15),color:C.gold}}>Ad</span>
      </div>
      <div className="p-4" style={{background:`linear-gradient(135deg,${C.navy} 0%,#243558 100%)`}}>
        <div className="text-center mb-3">
          <div className="text-[10px] font-bold tracking-widest mb-1" style={{color:rgba(C.gold,0.7)}}>INVEST WITH US</div>
          <div className="text-3xl font-black" style={{color:C.gold,fontFamily:'Georgia,serif'}}>12% GUARANTEED</div>
          <div className="text-xs" style={{color:'rgba(255,255,255,0.6)'}}>Annual Returns</div>
        </div>
        <div className="space-y-1.5 mb-3">
          {['No Risk to Your Capital','Diversified Portfolio','Minimum AED 10,000'].map((f,i)=>(
            <div key={i} className="flex items-center gap-2 text-xs" style={{color:'rgba(255,255,255,0.85)'}}>
              <CheckCircle className="w-3.5 h-3.5 flex-shrink-0" style={{color:C.gold}}/>{f}
            </div>
          ))}
        </div>
        <div className="w-full py-2 rounded-lg text-xs font-bold text-center" style={{background:`linear-gradient(135deg,${C.gold},${C.orange})`,color:C.navy}}>
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
    id:'A',title:'Ribā — The Guaranteed Increase',icon:'🔁',iconColor:C.coral,
    content:[
      "Remember that loan scenario you just sorted? Lending AED 1,000 and getting AED 1,200 back no matter what? That's **ribā (ربا)**.",
      "Ribā literally means 'increase' or 'excess.' In Islamic finance, it's a guaranteed increase on money lent — money that grows simply because time passes, with **no trade, no risk, and no effort** from the lender.",
      "Why is it prohibited? Because the lender takes **zero risk.** If the borrower's business fails, they still owe the extra. If they lose everything, they still owe the extra. The entire burden falls on the person who can least afford it.",
      "This is why a conventional savings account that pays 'interest' involves ribā. The bank takes your money, invests it, keeps most of the profit, and gives you a guaranteed fixed return. That's not trade — it's ribā.",
    ],
    ribaDiagram:true,
    quran:{
      arabic:'ٱلَّذِينَ يَأْكُلُونَ ٱلرِّبَوٰا۟ لَا يَقُومُونَ إِلَّا كَمَا يَقُومُ ٱلَّذِى يَتَخَبَّطُهُ ٱلشَّيْطَٰنُ مِنَ ٱلْمَسِّ ۚ ... وَأَحَلَّ ٱللَّهُ ٱلْبَيْعَ وَحَرَّمَ ٱلرِّبَوٰا۟',
      text:'"Those who consume ribā cannot stand [on the Day of Judgement] except as one beaten by Satan into madness. That is because they say, \'Trade is just like ribā.\' But Allah has permitted trade and has forbidden ribā."',
      ref:'Quran 2:275',
      note:"The key contrast: trade = permitted (real exchange, real risk, real value created). Ribā = forbidden (no exchange, no risk for the lender, money made from money alone).",
    },
    misconception:"'All interest is the same.' Not quite. Ribā is about a **guaranteed increase on money lent** without trade or risk. A merchant who buys for AED 100 and sells for AED 120 is NOT ribā — that's profit from real trade with real risk.",
  },
  {
    id:'B',title:'Gharar — The Fog in the Deal',icon:'🌫️',iconColor:C.orange,
    content:[
      "The second prohibition is **gharar (غرر)**. It literally means 'uncertainty' or 'hazard' — but a better translation is **'fog in the deal.'**",
      "Gharar happens when one side doesn't know what they're getting, terms are unclear, or the outcome depends on something hidden. It's not the normal uncertainty of life ('will my business succeed?'). It's **uncertainty built into the deal itself.**",
      "The key: gharar is about **hidden information in the deal structure.** Not about whether business is risky — all business is risky. Gharar is when the deal itself is a fog machine.",
    ],
    ghararTable:[
      {left:'Paying for a "mystery box" — you don\'t know what\'s inside.',right:'Buying a phone — you know exactly what you\'re getting.'},
      {left:'Investing without knowing where the money goes.',right:'Investing in a business with a clear plan (might still fail, but you know the plan).'},
      {left:'Insurance: you pay premiums, may never get anything back.',right:'A sale with a warranty: product, price, and terms are all clear.'},
    ],
  },
  {
    id:'C',title:'Maysir — The Gamble',icon:'🎲',iconColor:C.gold,
    content:[
      "The third prohibition is **maysir (ميسر)** — gambling. The most intuitive of the three. Any transaction where the outcome is based purely on chance, not skill, knowledge, or trade.",
      "Why prohibited? Because it creates wealth from nothing. No product made, no service provided, no trade occurs. One wins, the other loses — purely random. **A zero-sum game dressed as opportunity.**",
      "The simple test: is the outcome based on pure chance with no real exchange of value? If yes — maysir.",
    ],
    maysirTable:[
      {left:'Betting on a football match.',right:'Investing in a business (real trade with real risk).'},
      {left:'Casino gambling.',right:'Buying a product that might appreciate in value.'},
      {left:'Lottery tickets.',right:'Takāful — Islamic insurance where surplus is returned.'},
    ],
    threeWayCallout:true,
  },
  {
    id:'D',title:'All Three Together',icon:'⚖️',iconColor:C.teal,
    content:[
      "A single product can contain **more than one poison.** Conventional insurance involves ribā (premiums invested in interest), gharar (you don't know if you'll get anything back), and maysir (outcome feels like a gamble). You'll learn the alternative — takāful — in Module 4.",
      "If a deal contains ANY of these three, it fails the custodian test. Some deals contain all three.",
    ],
    threeWayTable:true,
    takeaway:"Three things a custodian must never allow: **Ribā** — guaranteed profit, zero risk for lender. **Gharar** — hidden information, foggy deal. **Maysir** — pure chance, no real exchange.",
  },
];

const QUESTIONS=[
  {
    id:'q1',position:'first',scored:false,
    type:'bucket3',mode:'SORT',typeLabel:'3-Bucket Sort',level:'2/5',
    question:"Before we explain the rules, trust your gut. Sort these 6 financial scenarios into the category that feels right.",
    buckets:[
      {id:'fair',   label:'Feels Fair',         icon:'✅',color:C.green, bg:C.greenLight, desc:'Seems like a normal, honest deal'},
      {id:'unclear',label:'Feels Risky/Unclear', icon:'🌫️',color:C.orange,bg:C.orangeLight,desc:"Something feels off — unclear"},
      {id:'gamble', label:'Feels Like Gambling', icon:'🎲',color:C.coral, bg:C.coralLight, desc:'This is basically a bet'},
    ],
    items:[
      {text:'You lend AED 1,000 and they MUST repay AED 1,200 regardless of what happens.',correct:'fair',trap:true,trapMsg:"Most people think a guaranteed loan repayment is fair. It SEEMS fair. But this is the most severely prohibited transaction in Islam. It's called ribā — and you're about to learn why."},
      {text:'You buy a car, inspect it, and sell it for a profit.',correct:'fair'},
      {text:'You pay AED 500 for a mystery box — could be worth AED 50 or AED 5,000.',correct:'unclear'},
      {text:'You invest AED 10,000 but nobody tells you where the money goes.',correct:'unclear'},
      {text:'You pay insurance premiums for 10 years, never claim, get nothing back.',correct:'unclear'},
      {text:'You bet AED 100 on a football match.',correct:'gamble'},
    ],
    summaryFeedback:{
      high:"Strong instincts! You can already feel the differences. Now let's name them: ribā, gharar, and maysir.",
      mid: "Good sense! Most people get the gambling ones right but struggle with the unclear ones. That's exactly what this lesson sorts out.",
      low: "No worries — that's why this lesson exists. By the end, you'll sort these instantly.",
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
      b:"Exactly. The issue isn't profit — Islam encourages fair profit from real trade. The issue is RISK-FREE profit from money lent. One side bears everything, the other bears nothing. That's the injustice.",
      c:"Lending is encouraged in Islam — it's called qard hasan (a good loan). What's forbidden is charging EXTRA. You can lend AED 1,000 and ask for AED 1,000 back. Not AED 1,200.",
      d:"Even 0.1% interest is ribā. It's not the rate — it's the structure. A guaranteed return on money lent with no trade or risk. The rate is irrelevant.",
    },
  },
  {
    id:'q3',afterSection:'B',
    type:'swipe',mode:'PLAY',typeLabel:'Swipe Left / Right',level:'2/5',
    question:"Swipe: is each scenario GHARAR or NORMAL RISK?",
    leftLabel:'GHARAR',leftColor:C.orange,leftBg:C.orangeLight,
    rightLabel:'NORMAL RISK',rightColor:C.green,rightBg:C.greenLight,
    cards:[
      {text:'You buy shares in a company with published financials.',answer:true,right:'✅ Published financials = transparent. Risk, not fog.',wrong:'❌ Financials are public — you see what you\'re investing in. That\'s transparent risk, not gharar.'},
      {text:"You pay for a product you've never seen and can't inspect.",answer:false,right:'✅ Can\'t see it = the deal itself is unclear. Gharar.',wrong:'❌ Not knowing what you buy IS gharar. The fog is built into the deal.'},
      {text:'You start a restaurant — it might fail.',answer:true,right:'✅ Might fail, but you know what you\'re starting. Life risk.',wrong:'❌ You know exactly what the business is. It might fail, but that\'s not gharar.'},
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
    question:"You're the financial compliance judge. Review each case — then stamp your ruling.",
    cases:[
      {
        caseNum:'01',
        emoji:'🤝',
        title:'The Guaranteed Loan',
        brief:'A lender advances AED 5,000 to a farmer. Regardless of whether the harvest succeeds or fails, the farmer must repay AED 6,250 in three months.',
        verdict:'riba',
        reasoning:"Ribā. The lender is guaranteed AED 1,250 extra no matter what happens to the farmer. Zero risk for the lender — all risk for the borrower. This is exactly the structure Islam prohibits.",
      },
      {
        caseNum:'02',
        emoji:'📱',
        title:'The Vague Contract',
        brief:"A business pays a freelancer AED 3,000 per month to 'grow the brand online.' No deliverables specified. No timeline. No scope. Just a monthly transfer.",
        verdict:'gharar',
        reasoning:"Gharar. Neither party can define what 'grow the brand' actually means. The exchange itself is fog — no clarity on what is being bought or sold. That's gharar.",
      },
      {
        caseNum:'03',
        emoji:'🏆',
        title:'The Office Pot',
        brief:"Every week, 20 employees each put in AED 50. On Friday, one name is drawn at random to win the entire AED 1,000 pot. No product, no service, no trade.",
        verdict:'maysir',
        reasoning:"Maysir. Money in, random winner, nothing exchanged. The friendly setting doesn't change the structure. Dress a lottery in any clothes — it's still a lottery.",
      },
      {
        caseNum:'04',
        emoji:'📊',
        title:'The Startup Pitch',
        brief:"An entrepreneur shows a business plan, projected revenues, and risks. You invest AED 10,000 for 8% equity. The business might fail — she's upfront about that.",
        verdict:'none',
        reasoning:"Clean deal. You can see what you're investing in. Risk is shared — she might fail, you might lose. No guaranteed return is promised. This is exactly what Islam encourages.",
      },
    ],
    stampOptions:[
      {id:'riba',  label:'RIBĀ',  arabic:'ربا',  icon:'🔁',color:C.coral, bg:C.coralLight},
      {id:'gharar',label:'GHARAR',arabic:'غرر',  icon:'🌫️',color:C.orange,bg:C.orangeLight},
      {id:'maysir',label:'MAYSIR',arabic:'ميسر',icon:'🎲',color:C.gold,  bg:C.goldLight},
      {id:'none',  label:'HALAL', arabic:'حلال', icon:'✅',color:C.green, bg:C.greenLight},
    ],
    feedback:{
      perfect:"4/4 — flawless. You can identify each prohibition in a real case, and you know when a deal is clean. That's the custodian's skill.",
      good:   "Strong. The clean deal (startup) is the tricky one — real risk with full transparency is NOT gharar. That's exactly what Islamic finance encourages.",
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
      low: "The tests: Ribā — guaranteed return on money lent? Gharar — can both sides see clearly? Maysir — pure chance? Run each scenario through these three filters.",
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
      perfect:"Perfect. Ribā, gharar, maysir — the three-question checklist. Every deal, every time. This is the custodian's filter.",
      partial:"Almost! The three checks: ribā (guaranteed return?), gharar (hidden information?), maysir (pure chance?). Amānah is the framework that makes you ask. Profit is what you're allowed to make.",
      wrong:  "The checklist: (1) Is there RIBĀ? (2) Is there GHARAR? (3) Is it MAYSIR? Amānah is the mindset — these prohibitions are what you're checking FOR.",
    },
  },
  {
    id:'q7',afterSection:'D',
    type:'mcq',mode:'THINK',typeLabel:'Scenario — Level 3',level:'3/5',
    isCapstone:true,multiPoison:true,showFakeAd:true,
    question:"Which prohibition(s) does this investment ad most likely involve?",
    options:[
      {id:'a',text:"Only gharar — because you don't know exactly where your money goes.",correct:false},
      {id:'b',text:"Only maysir — because investing is basically gambling.",correct:false},
      {id:'c',text:"Ribā AND gharar — guaranteed returns (ribā) plus unclear portfolio (gharar).",correct:true},
      {id:'d',text:"None — this sounds like a legitimate investment.",correct:false},
    ],
    feedback:{
      a:"You spotted the gharar — well done. But you missed the bigger problem: 'guaranteed 12%' and 'no risk' = ribā. Whenever someone guarantees a return on your money with no risk, that's not investing — it's ribā.",
      b:"Investing is NOT gambling. Gambling has no real trade. The problem here is that returns are GUARANTEED (ribā) and the portfolio is unclear (gharar) — not that investing is maysir.",
      c:"Exactly. Two poisons in one deal. 'Guaranteed 12%' = ribā (risk-free return on money). 'Diversified portfolio' with no details = gharar. The ad even says 'no risk to capital' — that's literally the definition of ribā. A custodian would walk away.",
      d:"This is EXACTLY the kind of deal that seems legitimate. 'Guaranteed returns, no risk' sounds great — until you apply the custodian's checklist. Guaranteed return = ribā. Unclear portfolio = gharar. Labels don't matter — substance does.",
    },
    bridge:"Next lesson: Substance Over Labels — the #1 skill in Islamic finance. You now know WHAT is prohibited. Next you learn how to DETECT it, even when it's disguised behind marketing and fancy labels.",
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
      <div className="relative z-10 max-w-2xl mx-auto px-4 py-10">
        <LessonNav />
        <div className="text-center mb-8 su">
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-bold mb-4" style={{background:rgba(C.gold,0.14),color:C.gold}}>MODULE 1 · LESSON 3</span>
          <h1 className="text-3xl font-bold mb-2" style={{color:C.navy,fontFamily:'Georgia,serif'}}>The Three Prohibitions</h1>
          <p className="text-sm" style={{color:C.mid}}>Ribā. Gharar. Maysir. The three things a custodian must never allow.</p>
        </div>
        <div className="rounded-2xl p-6 border border-white/40 shadow-lg su" style={CARD}>
          <div className="rounded-xl p-4 mb-5 border" style={{background:rgba(C.tealLight,0.7),borderColor:rgba(C.teal,0.18)}}>
            <div className="text-xs font-bold mb-1" style={{color:C.teal}}>📎 Continuing from Lesson 1.2</div>
            <p className="text-xs leading-relaxed" style={{color:C.dark}}>
              Wealth is amānah — a trust you manage responsibly. But what does 'responsibly' actually mean? What specifically can a custodian <strong>never</strong> do? This lesson answers with three precise prohibitions.
            </p>
          </div>
          <div className="flex items-start gap-3 mb-5">
            <Mascot/>
            <div className="rounded-xl rounded-tl-sm p-4 border border-gray-100 flex-1" style={{background:'rgba(255,255,255,0.85)'}}>
              <p className="text-sm" style={{color:C.dark}}>
                <strong style={{color:C.teal}}>Fulus:</strong> We start with a sorting challenge — before any definitions. Trust your gut first, then I'll name what you felt. Let's build your filter! ⚖️
              </p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 mb-5">
            {[
              {term:'Ribā',  arabic:'ربا',  icon:'🔁',color:C.coral, bg:C.coralLight},
              {term:'Gharar',arabic:'غرر',  icon:'🌫️',color:C.orange,bg:C.orangeLight},
              {term:'Maysir',arabic:'ميسر',icon:'🎲',color:C.gold,  bg:C.goldLight},
            ].map((t,i)=>(
              <div key={i} className="text-center p-3 rounded-xl border" style={{background:t.bg,borderColor:rgba(t.color,0.25)}}>
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
              <div key={i} className="text-center p-3 rounded-xl border" style={{background:rgba(C.tealLight,0.5),borderColor:rgba(C.teal,0.12)}}>
                <div className="flex justify-center mb-1" style={{color:C.teal}}>{m.icon}</div>
                <div className="text-sm font-bold" style={{color:C.navy}}>{m.label}</div>
                <div className="text-[10px]" style={{color:C.mid}}>{m.sub}</div>
              </div>
            ))}
          </div>
          <div className="rounded-lg p-3 mb-5" style={{background:C.goldLight,border:`1px solid ${rgba(C.gold,0.28)}`}}>
            <div className="text-xs font-bold mb-1" style={{color:C.gold}}>🎯 Learning Objective</div>
            <p className="text-xs leading-relaxed" style={{color:C.dark}}>Define ribā, gharar, and maysir in plain English, explain why each is harmful, give a real-world example of each, and identify which prohibition applies to a given scenario.</p>
          </div>
          <button onClick={()=>setScreen('lesson')} className="w-full py-3.5 rounded-xl font-bold text-sm" style={{background:`linear-gradient(135deg,${C.navy},${C.teal})`,color:'white'}}>
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
        <div className="relative z-10 max-w-2xl mx-auto px-4 py-10">
          <LessonNav />
          <div className="rounded-2xl p-8 border border-white/40 shadow-xl text-center su" style={CARD}>
            <div className="text-4xl mb-3">🏆</div>
            <h1 className="text-2xl font-bold mb-1" style={{color:C.navy,fontFamily:'Georgia,serif'}}>Lesson Complete!</h1>
            <p className="text-sm mb-4" style={{color:C.mid}}>The Three Prohibitions</p>
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold mb-6" style={{background:rgba(C.gold,0.18),color:C.gold,border:`1px solid ${rgba(C.gold,0.35)}`}}>
              <Award className="w-3.5 h-3.5"/> Multiple Prohibitions Spotted! ⭐
            </div>
            <div className="relative inline-block mb-6">
              <svg width="96" height="96" className="-rotate-90">
                <circle cx="48" cy="48" r="36" fill="none" stroke={C.light} strokeWidth="6"/>
                <circle cx="48" cy="48" r="36" fill="none" stroke={ring} strokeWidth="6" strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={offset} style={{transition:'stroke-dashoffset 1.5s ease-out'}}/>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold" style={{color:C.navy,fontFamily:'Georgia,serif'}}>{correct}/{total}</span>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3 mb-6">
              {[{label:'Score',value:`${score} pts`,color:C.green,bg:C.greenLight},{label:'Accuracy',value:`${pct}%`,color:C.teal,bg:C.tealLight},{label:'Level',value:'L2→L3',color:C.purple,bg:rgba(C.purple,0.1)}].map((s,i)=>(
                <div key={i} className="p-3 rounded-xl border" style={{background:s.bg,borderColor:rgba(s.color,0.18)}}>
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
                <div key={i} className="p-2.5 rounded-xl border text-center" style={{background:t.bg,borderColor:rgba(t.color,0.22)}}>
                  <CheckCircle className="w-3.5 h-3.5 mx-auto mb-1" style={{color:t.color}}/>
                  <div className="text-xs font-bold" style={{color:t.color}}>{t.term}</div>
                  <div className="text-[9px] leading-tight mt-0.5" style={{color:C.mid}}>{t.desc}</div>
                </div>
              ))}
            </div>
            <div className="text-left p-4 rounded-xl mb-6" style={{background:rgba(C.greenLight,0.7),border:`1px solid ${rgba(C.green,0.18)}`}}>
              <div className="text-xs font-bold mb-2" style={{color:C.green}}>✅ Concepts Mastered</div>
              {['Ribā = guaranteed return, zero risk for lender','Gharar = hidden information, fog in the deal','Maysir = pure chance, no real exchange','Can distinguish all three from each other','Can spot multiple prohibitions in one deal'].map((c,i)=>(
                <div key={i} className="flex items-center gap-2 py-0.5">
                  <CheckCircle className="w-3.5 h-3.5 flex-shrink-0" style={{color:C.green}}/>
                  <span className="text-xs" style={{color:C.dark}}>{c}</span>
                </div>
              ))}
            </div>
            <div className="p-4 rounded-xl mb-6" style={{background:C.goldLight,border:`1px solid ${rgba(C.gold,0.25)}`}}>
              <div className="text-xs font-bold mb-3" style={{color:C.gold}}>How confident do you feel about the three prohibitions?</div>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-[10px] w-16 text-right" style={{color:C.mid}}>Still unsure</span>
                <input type="range" min="1" max="5" value={confidence} onChange={e=>setConfidence(+e.target.value)} className="flex-1 h-2 rounded-full appearance-none cursor-pointer" style={{accentColor:C.gold}}/>
                <span className="text-[10px] w-20" style={{color:C.mid}}>Could explain</span>
              </div>
              <p className="text-xs text-center" style={{color:C.dark}}>
                {confidence<=2?"Three new concepts is a lot. They'll solidify with practice — and keep coming back in future lessons.":confidence===3?"Solid start. You know the names and the tests. Practice will sharpen this.":"You're building real analytical skills. Ready for the next step."}
              </p>
            </div>
            <div className="p-4 rounded-xl mb-5" style={{background:rgba(C.teal,0.07),border:`1px solid ${rgba(C.teal,0.16)}`}}>
              <div className="text-xs font-bold mb-1" style={{color:C.teal}}>Up Next</div>
              <div className="text-sm font-semibold mb-0.5" style={{color:C.navy}}>Lesson 1.4: Substance Over Labels</div>
              <div className="text-xs" style={{color:C.mid}}>You know WHAT is prohibited. Now learn how to DETECT it — even when it's disguised behind marketing and fancy labels.</div>
            </div>
            <button className="w-full py-3.5 rounded-xl font-bold text-sm" style={{background:`linear-gradient(135deg,${C.gold},${C.orange})`,color:C.navy}}>
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
        <div className="fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-2 rounded-full shadow-lg su" style={{background:`linear-gradient(135deg,${C.orange},${C.coral})`,color:'white'}}>
          <Flame className="w-4 h-4"/><span className="text-sm font-bold">{streak} Streak! 🔥</span>
        </div>
      )}
      {l3Toast&&(
        <div className="fixed top-4 left-1/2 z-50 flex items-center gap-2 px-5 py-3 rounded-full shadow-xl su" style={{background:C.navy,color:C.gold,border:`2px solid ${rgba(C.gold,0.4)}`,transform:'translateX(-50%)'}}>
          <Award className="w-4 h-4"/><span className="text-sm font-bold">Level 3 reached! That's application thinking.</span>
        </div>
      )}
      {multiToast&&(
        <div className="fixed top-16 left-1/2 z-50 flex items-center gap-2 px-5 py-3 rounded-full shadow-xl su" style={{background:`linear-gradient(135deg,${C.coral},${C.orange})`,color:'white',transform:'translateX(-50%)'}}>
          <span className="text-sm font-bold">🎯 Multiple poisons spotted!</span>
        </div>
      )}
      <div className="relative z-10 max-w-2xl mx-auto px-4 py-6">
        <LessonNav />
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-base" style={{background:rgba(C.coral,0.12),color:C.coral}}>⚖️</div>
            <div>
              <div className="text-xs font-bold" style={{color:C.navy}}>Lesson 1.3</div>
              <div className="text-[10px]" style={{color:C.mid}}>The Three Prohibitions</div>
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
    <div className="su rounded-2xl overflow-hidden border border-white/40 shadow-lg" style={CARD}>
      <div className="px-6 py-4 flex items-center gap-3" style={{background:`linear-gradient(135deg,${C.navy},${C.teal})`}}>
        <span className="text-2xl">{section.icon}</span>
        <h2 className="text-lg font-bold text-white" style={{fontFamily:'Georgia,serif'}}>{section.title}</h2>
      </div>
      <div className="p-6">
        {section.content.map((p,i)=>(
          <p key={i} className="text-sm leading-relaxed mb-4" style={{color:C.dark}}>{md(p)}</p>
        ))}
        {section.ribaDiagram&&<RibaDiagram/>}
        {section.quran&&(
          <div className="rounded-xl overflow-hidden mb-5 border" style={{borderColor:rgba(C.gold,0.3)}}>
            <div className="px-4 py-2 flex items-center gap-2" style={{background:`linear-gradient(135deg,${C.navy},#2a3f6a)`}}>
              <span className="text-sm">📖</span>
              <span className="text-xs font-bold tracking-wide" style={{color:rgba(C.gold,0.9)}}>Quranic Reference — {section.quran.ref}</span>
            </div>
            {/* Arabic text */}
            <div className="px-5 py-4 text-right border-b" style={{background:`linear-gradient(135deg,${C.navy},#1e3460)`,borderColor:rgba(C.gold,0.15)}}>
              <p className="text-base leading-loose font-medium" style={{color:C.gold,fontFamily:'serif',direction:'rtl',lineHeight:'2.2'}}>
                {section.quran.arabic}
              </p>
            </div>
            {/* Translation */}
            <div className="px-4 py-4" style={{background:C.goldLight}}>
              <p className="text-sm italic leading-relaxed mb-2" style={{color:C.navy,fontFamily:'Georgia,serif'}}>
                {section.quran.text}
              </p>
              <p className="text-xs font-semibold mb-2" style={{color:C.gold}}>— {section.quran.ref}</p>
              {section.quran.note&&(
                <div className="pt-2 border-t text-xs leading-relaxed" style={{borderColor:rgba(C.gold,0.25),color:C.dark}}>
                  <span className="font-bold" style={{color:C.navy}}>Key insight: </span>{section.quran.note}
                </div>
              )}
            </div>
          </div>
        )}
        {section.misconception&&(
          <div className="rounded-xl p-4 mb-4 border-l-4" style={{background:C.coralLight,borderColor:C.coral}}>
            <div className="text-xs font-bold mb-1" style={{color:C.coral}}>⚠️ Common Misconception</div>
            <p className="text-sm leading-relaxed" style={{color:C.dark}}>{md(section.misconception)}</p>
          </div>
        )}
        {section.ghararTable&&(
          <div className="rounded-xl overflow-hidden mb-5 border" style={{borderColor:rgba(C.navy,0.1)}}>
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
          <div className="rounded-xl overflow-hidden mb-4 border" style={{borderColor:rgba(C.navy,0.1)}}>
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
          <div className="rounded-xl p-4 mb-4" style={{background:rgba(C.navy,0.05),border:`2px solid ${rgba(C.navy,0.12)}`}}>
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
          <div className="rounded-xl p-4 mb-4" style={{background:C.goldLight,border:`1px solid ${rgba(C.gold,0.28)}`}}>
            <div className="text-xs font-bold mb-1" style={{color:C.gold}}>🔑 Key Takeaway</div>
            <p className="text-sm leading-relaxed" style={{color:C.dark}}>{md(section.takeaway)}</p>
          </div>
        )}
        <button onClick={onContinue} className="w-full py-3 rounded-xl font-bold text-sm mt-1" style={{background:`linear-gradient(135deg,${C.teal},${C.green})`,color:'white'}}>
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
    <div className="su rounded-2xl overflow-hidden border border-white/40 shadow-lg" style={CARD}>
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
          <button onClick={onNext} className="w-full py-3 rounded-xl font-bold text-sm mt-4" style={{background:`linear-gradient(135deg,${C.navy},${C.teal})`,color:'white'}}>
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
              style={{
                background: right?C.greenLight:wrong?C.coralLight:isSel&&!sub?C.navy:'white',
                borderColor:right?C.green:wrong?C.coral:isSel&&!sub?C.navy:'#ddd',
                color:isSel&&!sub&&!right?'white':C.dark,
                opacity:sub&&!isSel&&!opt.correct?0.45:1,
              }}>
              <div className="flex items-start gap-2">
                <span className="text-xs font-bold mt-0.5 flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center"
                  style={{background:right?C.green:wrong?C.coral:isSel&&!sub?'rgba(255,255,255,0.25)':C.light,color:right||wrong||(isSel&&!sub)?'white':C.mid}}>
                  {right?'✓':wrong?'✗':opt.id.toUpperCase()}
                </span>
                <span className="flex-1">{opt.text}</span>
              </div>
              {right&&<div className="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center pop" style={{background:C.green}}><CheckCircle className="w-4 h-4 text-white"/></div>}
            </button>
          );
        })}
      </div>
      {!sub&&(
        <button onClick={submit} disabled={sel===null}
          className="w-full py-3 rounded-xl font-bold text-sm"
          style={{background:sel!==null?`linear-gradient(135deg,${C.gold},${C.orange})`:C.light,color:sel!==null?C.navy:'#bbb',cursor:sel!==null?'pointer':'not-allowed'}}>
          Check Answer
        </button>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// 3-BUCKET SORT
// ═══════════════════════════════════════════════════════════════
function Bucket3({q,onFinish}){
  const [pool,    setPool]    =useState(()=>[...q.items].sort(()=>Math.random()-0.5));
  const [buckets, setBuckets] =useState(()=>Object.fromEntries(q.buckets.map(b=>[b.id,[]])));
  const [held,    setHeld]    =useState(null);
  const [dragOver,setDragOver]=useState(null);
  const [sub,     setSub]     =useState(false);
  const [results, setResults] =useState({});
  const [trapMsg, setTrapMsg] =useState(null);

  const placed   =Object.values(buckets).reduce((s,a)=>s+a.length,0);
  const allPlaced=placed===q.items.length;
  const isUnscored=q.scored===false;

  const move=(item,bId)=>{
    if(sub||!item)return;
    setPool(p=>p.filter(x=>x.text!==item.text));
    setBuckets(prev=>{
      const n={...prev};
      q.buckets.forEach(b=>{n[b.id]=n[b.id].filter(x=>x.text!==item.text);});
      n[bId]=[...n[bId],item];
      return n;
    });
    setHeld(null);setDragOver(null);
  };
  const ret=(item,bId)=>{
    if(sub)return;
    setBuckets(prev=>({...prev,[bId]:prev[bId].filter(x=>x.text!==item.text)}));
    setPool(p=>[...p,item]);
  };
  const submit=()=>{
    if(!allPlaced||sub)return;
    setSub(true);
    const res={};let ok=0;
    q.buckets.forEach(b=>buckets[b.id].forEach(item=>{
      const correct=item.correct===b.id;
      res[item.text]=correct;
      if(correct)ok++;
    }));
    setResults(res);
    const trap=q.items.find(i=>i.trap);
    if(trap&&buckets['fair']?.some(x=>x.text===trap.text)){setTrapMsg(trap.trapMsg);}
    const total=q.items.length;
    const fbText=ok>=5?q.summaryFeedback.high:ok>=3?q.summaryFeedback.mid:q.summaryFeedback.low;
    const pts=isUnscored?0:ok===total?10:ok>=4?5:0;
    onFinish(isUnscored?true:ok>=4,fbText,pts,{ok,total,isUnscored});
  };

  return(
    <div>
      {trapMsg&&(
        <div className="rounded-xl p-4 mb-4 border-l-4 su" style={{background:'white',borderColor:C.coral}}>
          <div className="flex items-start gap-2">
            <span className="text-lg flex-shrink-0">⚠️</span>
            <div>
              <div className="text-xs font-bold mb-1" style={{color:C.coral}}>Interesting choice on the loan scenario!</div>
              <p className="text-xs leading-relaxed" style={{color:C.dark}}>{trapMsg}</p>
            </div>
          </div>
        </div>
      )}
      <div className="grid grid-cols-3 gap-2 mb-4">
        {q.buckets.map(bk=>(
          <div key={bk.id}
            onDragOver={e=>{e.preventDefault();setDragOver(bk.id);}}
            onDragLeave={()=>setDragOver(null)}
            onDrop={e=>{e.preventDefault();if(held)move(held,bk.id);setDragOver(null);}}
            onClick={()=>{if(held)move(held,bk.id);}}
            className="rounded-xl p-2 min-h-[120px] transition-all border-2"
            style={{background:bk.bg,borderColor:dragOver===bk.id?C.gold:bk.color,borderStyle:buckets[bk.id].length||dragOver===bk.id?'solid':'dashed',transform:dragOver===bk.id?'scale(1.02)':'scale(1)'}}>
            <div className="text-[10px] font-bold text-center mb-1" style={{color:bk.color}}>{bk.icon} {bk.label}</div>
            {bk.desc&&<div className="text-[8px] text-center mb-1.5 leading-tight" style={{color:rgba(bk.color,0.65)}}>{bk.desc}</div>}
            <div className="space-y-1">
              {buckets[bk.id].map(item=>(
                <div key={item.text} onClick={()=>!sub&&ret(item,bk.id)}
                  className={`p-1.5 rounded-lg text-[10px] font-medium border-2 cursor-pointer transition-all leading-snug ${sub&&results[item.text]===false?'shk':''}`}
                  style={{
                    background:sub?(results[item.text]?C.greenLight:C.coralLight):'white',
                    borderColor:sub?(results[item.text]?C.green:C.coral):'#e5e7eb',
                    color:C.dark,
                  }}>
                  <div className="flex items-start gap-1">
                    {sub&&results[item.text]===true &&<CheckCircle className="w-3 h-3 flex-shrink-0 mt-0.5 pop" style={{color:C.green}}/>}
                    {sub&&results[item.text]===false&&<XCircle     className="w-3 h-3 flex-shrink-0 mt-0.5"    style={{color:C.coral}}/>}
                    <span className="flex-1 leading-tight">{item.text}</span>
                    {!sub&&<span className="text-[8px] opacity-30 flex-shrink-0">✕</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      {/* Mobile tap-to-move */}
      {held&&!sub&&(
        <div className="flex gap-2 mb-3 flex-wrap su">
          {q.buckets.map(bk=>(
            <button key={bk.id} onClick={()=>move(held,bk.id)} className="flex-1 py-2 rounded-xl text-xs font-bold border-2 min-w-[80px]" style={{borderColor:bk.color,color:bk.color,background:bk.bg}}>
              {bk.icon} {bk.label}
            </button>
          ))}
        </div>
      )}
      {pool.length>0&&(
        <div className="mb-4">
          <div className="text-xs font-bold mb-2 flex items-center gap-1.5" style={{color:C.mid}}>
            <GripVertical className="w-3 h-3"/> Drag or tap to select, then tap a bucket
          </div>
          <div className="space-y-2">
            {pool.map(item=>(
              <div key={item.text} draggable onDragStart={e=>{setHeld(item);e.dataTransfer.setData('text/plain',item.text);}}
                onClick={()=>setHeld(h=>h?.text===item.text?null:item)}
                className="p-3 rounded-xl border-2 text-sm font-medium cursor-grab active:cursor-grabbing select-none transition-all"
                style={{background:'white',color:C.navy,borderColor:held?.text===item.text?C.gold:'#ddd',boxShadow:held?.text===item.text?`0 0 0 3px ${rgba(C.gold,0.28)}`:'0 1px 4px rgba(0,0,0,0.06)'}}>
                <div className="flex items-center gap-2"><GripVertical className="w-4 h-4 flex-shrink-0" style={{color:C.mid}}/>{item.text}</div>
              </div>
            ))}
          </div>
        </div>
      )}
      {!sub&&(
        <button onClick={submit} disabled={!allPlaced}
          className="w-full py-3 rounded-xl font-bold text-sm"
          style={{background:allPlaced?`linear-gradient(135deg,${C.gold},${C.orange})`:C.light,color:allPlaced?C.navy:'#bbb',cursor:allPlaced?'pointer':'not-allowed'}}>
          {isUnscored?'Check My Instincts':'Check Answer'} ({placed}/{q.items.length} placed)
        </button>
      )}
      {sub&&!isUnscored&&Object.values(results).some(v=>!v)&&(
        <div className="mt-3 p-3 rounded-xl su" style={{background:rgba(C.tealLight,0.5),border:`1px solid ${rgba(C.teal,0.18)}`}}>
          <div className="text-[10px] font-bold mb-2" style={{color:C.teal}}>✏️ Correct placement:</div>
          {q.items.filter(item=>!results[item.text]).map((item,i)=>{
            const correctBk=q.buckets.find(b=>b.id===item.correct);
            const placedInBk=q.buckets.find(b=>Object.values({...Object.fromEntries(q.buckets.map(bk=>[bk.id,buckets[bk.id]]))}).find(arr=>Array.isArray(arr)&&arr.some(x=>x.text===item.text&&b.id)));
            return(
              <div key={i} className="flex items-center gap-2 py-1 border-b last:border-0 text-[10px]" style={{borderColor:rgba(C.teal,0.1)}}>
                <XCircle className="w-3 h-3 flex-shrink-0" style={{color:C.coral}}/>
                <span className="flex-1 truncate" style={{color:C.dark}}>{item.text}</span>
                <span className="flex-shrink-0 px-1.5 py-0.5 rounded-full font-bold" style={{background:correctBk?.bg,color:correctBk?.color,border:`1px solid ${correctBk?.color}`}}>
                  {correctBk?.icon} {correctBk?.label}
                </span>
              </div>
            );
          })}
        </div>
      )}
      {/* For unscored (Q1) — show correct labels for ALL items after submit */}
      {sub&&isUnscored&&(
        <div className="mt-3 p-3 rounded-xl su" style={{background:rgba(C.navy,0.04),border:`1px solid ${rgba(C.navy,0.1)}`}}>
          <div className="text-[10px] font-bold mb-2" style={{color:C.navy}}>📋 The correct labels (you'll understand why after this lesson):</div>
          {q.items.map((item,i)=>{
            const correctBk=q.buckets.find(b=>b.id===item.correct);
            const wasCorrect=results[item.text];
            return(
              <div key={i} className="flex items-center gap-2 py-1 border-b last:border-0 text-[10px]" style={{borderColor:rgba(C.navy,0.07)}}>
                {wasCorrect
                  ?<CheckCircle className="w-3 h-3 flex-shrink-0" style={{color:C.green}}/>
                  :<XCircle    className="w-3 h-3 flex-shrink-0" style={{color:C.coral}}/>}
                <span className="flex-1 leading-tight" style={{color:C.dark}}>{item.text}</span>
                <span className="flex-shrink-0 px-1.5 py-0.5 rounded-full font-bold whitespace-nowrap" style={{background:correctBk?.bg,color:correctBk?.color,border:`1px solid ${rgba(correctBk?.color||'#000',0.4)}`}}>
                  {correctBk?.icon} {correctBk?.label}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// SWIPE CARDS (Q3 — Gharar vs Normal Risk)
// ═══════════════════════════════════════════════════════════════
function SwipeCards({q,onFinish}){
  const cards=q.cards;
  const [idx,   setIdx]   =useState(0);
  const [phase, setPhase] =useState('active'); // active | flash | summary
  const [flash, setFlash] =useState(null);
  const [log,   setLog]   =useState([]);
  const [swDir, setSwDir] =useState(null);     // 'left' | 'right' | null
  const lockedRef=useRef(false);

  const answer=useCallback((isRight)=>{
    if(lockedRef.current||phase!=='active')return;
    lockedRef.current=true;
    const card=cards[idx];
    const isCorrect=isRight===card.answer;
    setSwDir(isRight?'right':'left');
    const newLog=[...log,{card,correct:isCorrect,chose:isRight}];
    setLog(newLog);
    setFlash({correct:isCorrect,text:isCorrect?card.right:card.wrong});
    setTimeout(()=>{
      setSwDir(null);
      setPhase('flash');
      const delay = isCorrect ? 900 : 2200;
      setTimeout(()=>{
        if(idx+1<cards.length){
          lockedRef.current=false;
          setIdx(idx+1);setFlash(null);setPhase('active');
        } else {
          const cc=newLog.filter(e=>e.correct).length;
          const total=cards.length;
          const fbText=cc===total?q.summaryFeedback.perfect:cc>=4?q.summaryFeedback.good:q.summaryFeedback.low;
          onFinish(cc>=4,fbText,Math.round((cc/total)*10));
          setPhase('summary');
        }
      },delay);
    },350);
  },[idx,log,cards,phase,q.summaryFeedback,onFinish]);

  if(phase==='summary'){
    const cc=log.filter(e=>e.correct).length;
    return(
      <div className="su">
        <div className="text-center mb-4">
          <div className="text-4xl mb-1">{cc===cards.length?'🎉':cc>=4?'👍':'💪'}</div>
          <div className="text-xl font-bold" style={{color:C.navy}}>{cc}/{cards.length}</div>
        </div>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {log.map((e,i)=>(
            <div key={i} className="flex items-start gap-2 p-3 rounded-xl text-xs" style={{background:e.correct?C.greenLight:C.coralLight,border:`1px solid ${rgba(e.correct?C.green:C.coral,0.22)}`}}>
              {e.correct?<CheckCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{color:C.green}}/>:<XCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{color:C.coral}}/>}
              <div>
                <div className="font-medium" style={{color:C.dark}}>{e.card.text}</div>
                <div className="text-[10px] mt-0.5 font-semibold" style={{color:e.correct?C.green:C.coral}}>
                  Answer: {e.card.answer?q.rightLabel:q.leftLabel}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const card=cards[idx];
  const tiltClass=swDir==='left'?'swL':swDir==='right'?'swR':'';

  return(
    <div>
      {/* Zone labels */}
      <div className="flex gap-2 mb-3">
        <div className="flex-1 py-2 rounded-xl text-center text-xs font-bold border-2" style={{borderColor:q.leftColor,color:q.leftColor,background:q.leftBg}}>
          ← {q.leftLabel}
        </div>
        <div className="flex-1 py-2 rounded-xl text-center text-xs font-bold border-2" style={{borderColor:q.rightColor,color:q.rightColor,background:q.rightBg}}>
          {q.rightLabel} →
        </div>
      </div>
      {/* Dots */}
      <div className="flex justify-center gap-1.5 mb-3">
        {cards.map((_,i)=>(
          <div key={i} className="w-2 h-2 rounded-full transition-all" style={{background:i<idx?(log[i]?.correct?C.green:C.coral):i===idx?C.navy:C.light}}/>
        ))}
      </div>
      {/* Card */}
      <div className="relative mb-4 min-h-[110px]">
        {phase==='active'&&(
          <div className={`rounded-2xl border-2 p-6 text-center flex items-center justify-center min-h-[110px] ${tiltClass}`}
            style={{background:'white',borderColor:rgba(C.navy,0.16),boxShadow:'0 4px 20px rgba(0,0,0,0.08)'}}>
            <p className="text-base font-semibold leading-snug" style={{color:C.navy}}>{card.text}</p>
          </div>
        )}
        {phase==='flash'&&flash&&(
          <div className="rounded-2xl border-2 p-5 text-center min-h-[110px] flex flex-col items-center justify-center fi"
            style={{background:flash.correct?C.greenLight:C.coralLight,borderColor:flash.correct?C.green:C.coral}}>
            <div className="flex items-center gap-2 mb-1.5">
              {flash.correct?<CheckCircle className="w-5 h-5" style={{color:C.green}}/>:<XCircle className="w-5 h-5" style={{color:C.coral}}/>}
              <span className="font-bold text-sm" style={{color:flash.correct?C.green:C.coral}}>{flash.correct?'Correct!':'Not quite!'}</span>
            </div>
            <p className="text-xs leading-snug" style={{color:C.dark}}>{flash.text}</p>
          </div>
        )}
      </div>
      {/* Buttons */}
      {phase==='active'&&(
        <div className="flex gap-3">
          <button onClick={()=>answer(false)} className="flex-1 flex items-center justify-center gap-2 py-4 rounded-xl font-bold border-2 transition-all" style={{borderColor:q.leftColor,color:q.leftColor,background:q.leftBg}}>
            ← {q.leftLabel}
          </button>
          <button onClick={()=>answer(true)} className="flex-1 flex items-center justify-center gap-2 py-4 rounded-xl font-bold border-2 transition-all" style={{borderColor:q.rightColor,color:q.rightColor,background:q.rightBg}}>
            {q.rightLabel} →
          </button>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// MATCH PAIRS (Q4)
// ═══════════════════════════════════════════════════════════════
// ═══════════════════════════════════════════════════════════════
// POISON REVEAL (Q4) — tap the poison on each scenario card
// ═══════════════════════════════════════════════════════════════
// ═══════════════════════════════════════════════════════════════
// VERDICT STAMP (Q4 — Courtroom Judge)
// ═══════════════════════════════════════════════════════════════
function VerdictStamp({q,onFinish}){
  const [caseIdx,   setCaseIdx]   = useState(0);
  const [stamped,   setStamped]   = useState({});   // caseNum -> stampOptionId (correct)
  const [wrongShk,  setWrongShk]  = useState(null); // which stamp id is shaking
  const [pressing,  setPressing]  = useState(null); // which stamp is pressed down
  const [phase,     setPhase]     = useState('judge'); // judge | summary
  const lockedRef = useRef(false);
  const total = q.cases.length;

  const currentCase = q.cases[caseIdx];
  const isStamped   = !!stamped[currentCase.caseNum];
  const stampResult = stamped[currentCase.caseNum];

  const pressStamp = (opt) => {
    if(lockedRef.current || isStamped) return;
    lockedRef.current = true;
    setPressing(opt.id);

    const correct = opt.id === currentCase.verdict;

    setTimeout(()=>{
      setPressing(null);
      if(correct){
        setStamped(s=>({...s,[currentCase.caseNum]:opt.id}));
        lockedRef.current = false;
      } else {
        setWrongShk(opt.id);
        setTimeout(()=>{ setWrongShk(null); lockedRef.current = false; }, 600);
      }
    }, 180);
  };

  const nextCase = () => {
    if(caseIdx < total - 1){
      setCaseIdx(i => i + 1);
    } else {
      const ok = Object.keys(stamped).length;
      const fbText = ok===total?q.feedback.perfect:ok>=3?q.feedback.good:q.feedback.low;
      onFinish(ok>=3, fbText, ok===total?10:ok>=3?6:ok*2, {ok,total,isUnscored:false});
      setPhase('summary');
    }
  };

  if(phase==='summary'){
    const ok=Object.keys(stamped).length;
    return(
      <div className="su">
        <div className="text-center mb-5">
          <div className="text-4xl mb-2">{ok===total?'⚖️':'📋'}</div>
          <div className="text-2xl font-black" style={{color:C.navy,fontFamily:'Georgia,serif'}}>{ok}/{total}</div>
          <div className="text-sm" style={{color:C.mid}}>verdicts correctly ruled</div>
        </div>
        <div className="space-y-3">
          {q.cases.map(c=>{
            const wasCorrect=!!stamped[c.caseNum];
            const opt=q.stampOptions.find(o=>o.id===c.verdict);
            return(
              <div key={c.caseNum} className="rounded-xl overflow-hidden border-2" style={{borderColor:wasCorrect?C.green:C.coral}}>
                <div className="px-3 py-2 flex items-center gap-2" style={{background:wasCorrect?`linear-gradient(135deg,${C.green},#2d7a50)`:`linear-gradient(135deg,${C.coral},#b5553c)`}}>
                  <span className="text-sm">{c.emoji}</span>
                  <span className="text-xs font-bold text-white flex-1">{c.title}</span>
                  <span className="text-xs font-black px-2 py-0.5 rounded-full" style={{background:'rgba(255,255,255,0.2)',color:'white'}}>
                    {wasCorrect?'✓ RULED':opt.label}
                  </span>
                </div>
                <div className="p-3" style={{background:wasCorrect?rgba(C.greenLight,0.5):rgba(C.coralLight,0.5)}}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">{opt.icon}</span>
                    <span className="text-xs font-black" style={{color:opt.color}}>{opt.label}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full ml-1" style={{background:opt.bg,color:opt.color}}>{opt.arabic}</span>
                  </div>
                  <p className="text-xs leading-snug" style={{color:C.dark}}>{c.reasoning}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  const verdictOpt = q.stampOptions.find(o=>o.id===stampResult);

  return(
    <div>
      {/* Court progress */}
      <div className="flex items-center gap-2 mb-4">
        <div className="text-[10px] font-bold uppercase tracking-wider" style={{color:C.mid}}>Case</div>
        {q.cases.map((c,i)=>{
          const done=!!stamped[c.caseNum];
          const active=i===caseIdx;
          return(
            <div key={c.caseNum} className="flex-1 h-1.5 rounded-full transition-all" style={{background:done?C.green:active?C.gold:C.light}}/>
          );
        })}
        <div className="text-[10px] font-bold" style={{color:C.mid}}>{caseIdx+1}/{total}</div>
      </div>

      {/* Case File Card */}
      <div className="relative rounded-2xl overflow-hidden border-2 mb-4 transition-all" style={{
        borderColor: isStamped ? verdictOpt?.color : rgba(C.navy,0.15),
        boxShadow: isStamped ? `0 8px 32px ${rgba(verdictOpt?.color||C.navy,0.25)}` : '0 2px 12px rgba(0,0,0,0.07)',
      }}>
        {/* Case header */}
        <div className="px-4 py-3 flex items-center gap-3" style={{background:`linear-gradient(135deg,${C.navy},#253c6a)`}}>
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-base flex-shrink-0" style={{background:'rgba(255,255,255,0.1)'}}>
            {currentCase.emoji}
          </div>
          <div className="flex-1">
            <div className="text-[9px] font-bold tracking-widest uppercase mb-0.5" style={{color:rgba(C.gold,0.65)}}>
              Case #{currentCase.caseNum} — Financial Compliance Review
            </div>
            <div className="text-sm font-bold text-white">{currentCase.title}</div>
          </div>
          {!isStamped && (
            <div className="text-[9px] font-bold px-2 py-1 rounded-full" style={{background:rgba(C.gold,0.15),color:C.gold}}>
              PENDING RULING
            </div>
          )}
          {isStamped && (
            <div className="text-[9px] font-bold px-2 py-1 rounded-full pop" style={{background:'rgba(255,255,255,0.15)',color:'white'}}>
              ✓ RULED
            </div>
          )}
        </div>

        {/* Brief */}
        <div className="p-4 relative" style={{background: isStamped ? rgba(verdictOpt?.bg||C.greenLight,0.6) : 'white'}}>
          <div className="text-[9px] font-bold uppercase tracking-widest mb-2" style={{color:C.mid}}>Transaction on Record:</div>
          <p className="text-sm leading-relaxed" style={{color:C.dark, fontFamily:'Georgia,serif',fontStyle:'italic'}}>
            "{currentCase.brief}"
          </p>

          {/* Verdict stamp overlay */}
          {isStamped && (
            <div className="mt-4 su">
              <div className="flex items-center gap-3 p-3 rounded-xl border-2" style={{background:verdictOpt?.bg,borderColor:verdictOpt?.color}}>
                <span className="text-3xl">{verdictOpt?.icon}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-lg font-black" style={{color:verdictOpt?.color}}>{verdictOpt?.label}</span>
                    <span className="text-sm font-black" style={{color:rgba(verdictOpt?.color||'#000',0.6)}}>{verdictOpt?.arabic}</span>
                  </div>
                  <p className="text-xs leading-snug" style={{color:C.dark}}>{currentCase.reasoning}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Large "VERDICT" watermark text behind content */}
        {isStamped && (
          <div className="absolute top-1/2 left-1/2 pointer-events-none select-none" style={{
            transform:'translate(-50%,-55%) rotate(-12deg)',
            fontSize:'clamp(42px,12vw,72px)',fontWeight:'900',
            color:rgba(verdictOpt?.color||C.green,0.07),
            fontFamily:'Georgia,serif',letterSpacing:'0.05em',
            whiteSpace:'nowrap',zIndex:0,
          }}>
            {verdictOpt?.label}
          </div>
        )}
      </div>

      {/* Stamps — shown when not yet ruled */}
      {!isStamped && (
        <div>
          <div className="text-xs font-bold text-center mb-3" style={{color:C.mid}}>
            ⚖️ Your ruling — what prohibition applies?
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            {q.stampOptions.map(opt=>{
              const isPress = pressing === opt.id;
              const isWrong = wrongShk === opt.id;
              return(
                <button key={opt.id} onClick={()=>pressStamp(opt)}
                  className={`relative rounded-2xl text-left transition-all ${isWrong?'shk':''}`}
                  style={{
                    background: opt.bg,
                    border: `2px solid ${rgba(opt.color,0.4)}`,
                    padding: '14px',
                    transform: isPress ? 'scale(0.95)' : isWrong ? 'scale(1)' : 'scale(1)',
                    boxShadow: isPress ? 'none' : `0 4px 14px ${rgba(opt.color,0.22)}`,
                    transition: 'transform 0.12s ease, box-shadow 0.12s ease',
                  }}>
                  {/* Stamp circle */}
                  <div className="flex items-start gap-2.5">
                    <div className="w-11 h-11 rounded-full flex items-center justify-center text-2xl border-2 flex-shrink-0" style={{
                      borderColor: opt.color,
                      background: 'white',
                      boxShadow: isPress ? 'none' : `0 2px 8px ${rgba(opt.color,0.3)}`,
                    }}>
                      {opt.icon}
                    </div>
                    <div className="flex-1 pt-0.5">
                      <div className="text-sm font-black" style={{color:opt.color}}>{opt.label}</div>
                      <div className="text-[11px] font-bold" style={{color:rgba(opt.color,0.65)}}>{opt.arabic}</div>
                      <div className="text-[10px] mt-0.5" style={{color:C.mid}}>
                        {opt.id==='riba'  ?'Guaranteed increase':
                         opt.id==='gharar'?'Hidden fog':
                         opt.id==='maysir'?'Pure chance':'Clean deal'}
                      </div>
                    </div>
                  </div>
                  {/* Stamp border dashes */}
                  <div className="absolute inset-1 rounded-xl pointer-events-none" style={{border:`1px dashed ${rgba(opt.color,0.25)}`}}/>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Next button after ruling */}
      {isStamped && (
        <button onClick={nextCase}
          className="w-full py-3.5 rounded-xl font-bold text-sm mt-1 su"
          style={{background:`linear-gradient(135deg,${verdictOpt?.color||C.green},${C.navy})`,color:'white'}}>
          {caseIdx < total - 1 ? `Next Case (${caseIdx+2}/${total})` : 'See All Verdicts'}{' '}
          <ArrowRight className="w-4 h-4 inline ml-1 -mt-0.5"/>
        </button>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// WORD ORDER (Q6 — custodian's checklist)
// ═══════════════════════════════════════════════════════════════
function WordOrder({q,onFinish}){
  const [slots,  setSlots]  =useState(Array(q.correctWords.length).fill(null));
  const [bank,   setBank]   =useState(()=>[...q.wordBank]);
  const [sub,    setSub]    =useState(false);
  const [results,setResults]=useState([]);
  const [shk,    setShk]    =useState([]);

  const allFilled=slots.every(s=>s!==null);

  const placeInSlot=(word,slotIdx)=>{
    if(sub)return;
    // If slot already filled, return old word to bank
    setSlots(prev=>{
      const n=[...prev];
      if(n[slotIdx]!==null)setBank(b=>[...b,n[slotIdx]]);
      n[slotIdx]=word;
      return n;
    });
    setBank(b=>b.filter(w=>w!==word));
  };
  const removeFromSlot=(slotIdx)=>{
    if(sub)return;
    const word=slots[slotIdx];
    if(!word)return;
    setSlots(prev=>{const n=[...prev];n[slotIdx]=null;return n;});
    setBank(b=>[...b,word]);
  };
  const [draggingWord,setDraggingWord]=useState(null);

  const submit=()=>{
    if(!allFilled||sub)return;
    setSub(true);
    const res=slots.map((w,i)=>w===q.correctWords[i]);
    setResults(res);
    const ok=res.filter(Boolean).length;
    const total=q.correctWords.length;
    const fbText=ok===total?q.feedback.perfect:ok>=2?q.feedback.partial:q.feedback.wrong;
    const wrong=res.map((r,i)=>!r?i:null).filter(x=>x!==null);
    if(wrong.length){setShk(wrong);setTimeout(()=>setShk([]),600);}
    onFinish(ok===total,fbText,Math.round((ok/total)*10));
  };

  return(
    <div>
      {/* Sentence with slots */}
      <div className="rounded-xl p-5 mb-5 border leading-loose text-sm" style={{background:`linear-gradient(135deg,${rgba(C.tealLight,0.35)},${rgba(C.goldLight,0.25)})`,borderColor:rgba(C.teal,0.16),color:C.dark}}>
        {q.sentenceParts.map((part,pi)=>(
          <React.Fragment key={pi}>
            <span>{part}</span>
            {pi<q.sentenceParts.length-1&&(
              <span
                onDragOver={e=>{e.preventDefault();}}
                onDrop={e=>{e.preventDefault();if(draggingWord)placeInSlot(draggingWord,pi);setDraggingWord(null);}}
                onClick={()=>slots[pi]!==null&&!sub&&removeFromSlot(pi)}
                className={`inline-flex items-center gap-1 px-3 py-1 rounded-lg font-bold border-2 transition-all mx-0.5 align-middle ${shk.includes(pi)?'shk':''} ${!sub&&!slots[pi]?'pls':''}`}
                style={{
                  minWidth:'70px',
                  borderStyle:slots[pi]?'solid':'dashed',
                  borderColor:sub?(results[pi]?C.green:C.coral):slots[pi]?C.gold:rgba(C.teal,0.5),
                  background:sub?(results[pi]?C.greenLight:C.coralLight):slots[pi]?C.goldLight:'white',
                  color:sub?(results[pi]?C.green:C.coral):slots[pi]?C.navy:C.mid,
                  cursor:slots[pi]&&!sub?'pointer':'default',
                }}>
                {slots[pi]
                  ? <>{slots[pi]}{sub&&results[pi]&&<CheckCircle className="w-3 h-3 pop" style={{color:C.green}}/>}{sub&&!results[pi]&&<XCircle className="w-3 h-3" style={{color:C.coral}}/>}</>
                  : <span className="text-xs opacity-60">drop here</span>}
              </span>
            )}
          </React.Fragment>
        ))}
      </div>
      {/* Show correct words after wrong submission */}
      {sub&&results.some(r=>!r)&&(
        <div className="p-3 rounded-xl mb-4 su" style={{background:rgba(C.tealLight,0.5),border:`1px solid ${rgba(C.teal,0.18)}`}}>
          <div className="text-[10px] font-bold mb-1.5" style={{color:C.teal}}>Correct order:</div>
          <div className="flex gap-2 flex-wrap">
            {q.correctWords.map((w,i)=>(
              <span key={i} className="px-2.5 py-1 rounded-full text-xs font-bold" style={{background:C.greenLight,color:C.green,border:`1px solid ${rgba(C.green,0.28)}`}}>{i+1}. {w}</span>
            ))}
          </div>
        </div>
      )}
      {/* Word bank */}
      {!sub&&(
        <>
          <div className="text-xs font-bold mb-2" style={{color:C.mid}}>Word bank — drag or tap to place:</div>
          <div className="flex flex-wrap gap-2 mb-4">
            {bank.map(word=>(
              <div key={word} draggable
                onDragStart={()=>setDraggingWord(word)}
                onDragEnd={()=>setDraggingWord(null)}
                className="px-4 py-2 rounded-xl border-2 text-sm font-bold cursor-grab active:cursor-grabbing select-none transition-all"
                style={{background:'white',color:C.navy,borderColor:draggingWord===word?C.gold:'#ddd',boxShadow:draggingWord===word?`0 0 0 3px ${rgba(C.gold,0.28)}`:'0 1px 4px rgba(0,0,0,0.06)'}}>
                {word}
              </div>
            ))}
          </div>
          {/* Tap-to-slot for mobile */}
          {bank.length>0&&slots.some(s=>s===null)&&(
            <div className="mb-4">
              <div className="text-[10px] font-semibold mb-1.5" style={{color:C.mid}}>Or tap word → tap slot:</div>
              <div className="flex gap-2 flex-wrap mb-2">
                {bank.map(word=>(
                  <button key={word}
                    onClick={()=>{
                      const firstEmpty=slots.findIndex(s=>s===null);
                      if(firstEmpty!==-1)placeInSlot(word,firstEmpty);
                    }}
                    className="px-3 py-1.5 rounded-lg border text-xs font-semibold"
                    style={{background:C.tealLight,borderColor:rgba(C.teal,0.3),color:C.teal}}>
                    + {word}
                  </button>
                ))}
              </div>
            </div>
          )}
          <button onClick={submit} disabled={!allFilled}
            className="w-full py-3 rounded-xl font-bold text-sm"
            style={{background:allFilled?`linear-gradient(135deg,${C.gold},${C.orange})`:C.light,color:allFilled?C.navy:'#bbb',cursor:allFilled?'pointer':'not-allowed'}}>
            Check Answer
          </button>
        </>
      )}
    </div>
  );
}
