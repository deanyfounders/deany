import React, { useState, useRef, useCallback, useEffect } from 'react';
import { CheckCircle, XCircle, ArrowRight, Flame, Star, BookOpen, Clock, Target, GripVertical, Award, ChevronUp, ChevronDown, ChevronLeft, Home } from 'lucide-react';

// ===============================================================
// TOKENS
// ===============================================================
const C = {
  navy:'#1B2A4A', gold:'#C5A55A', goldLight:'#F5EDD6',
  teal:'#2A7B88', tealLight:'#E0F2F4', coral:'#D4654A',
  coralLight:'#FDEAE5', green:'#3A8B5C', greenLight:'#E5F5EC',
  orange:'#E8872B', orangeLight:'#FEF3E5', purple:'#6B4C9A',
  magenta:'#A855A0', dark:'#3D3D3D', mid:'#6B6B6B', light:'#F2F2F2',
};
const STYLES = `
  @keyframes slideUp  { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
  @keyframes fadeIn   { from{opacity:0} to{opacity:1} }
  @keyframes shake    { 0%,100%{transform:translateX(0)} 20%{transform:translateX(-7px)} 60%{transform:translateX(7px)} }
  @keyframes pop      { 0%{transform:scale(0.5);opacity:0} 70%{transform:scale(1.15)} 100%{transform:scale(1);opacity:1} }
  @keyframes fall     { 0%{transform:translateY(-20px) rotate(0deg);opacity:1} 100%{transform:translateY(110vh) rotate(720deg);opacity:0} }
  @keyframes pulse    { 0%,100%{opacity:0.5} 50%{opacity:1} }
  @keyframes badgePop { 0%{transform:scale(0);opacity:0} 60%{transform:scale(1.18)} 100%{transform:scale(1);opacity:1} }
  @keyframes rowPulse { 0%,100%{background:transparent} 40%{background:var(--pc)} }
  @keyframes piechart { from{opacity:0;transform:scale(0.88)} to{opacity:1;transform:scale(1)} }
  .su   { animation: slideUp  0.32s ease-out both }
  .fi   { animation: fadeIn   0.22s ease-out both }
  .shk  { animation: shake    0.28s ease both }
  .pop  { animation: pop      0.36s cubic-bezier(.17,.67,.35,1.3) both }
  .pls  { animation: pulse    1.6s ease-in-out infinite }
  .badge-pop { animation: badgePop 0.55s cubic-bezier(.17,.67,.35,1.3) 0.3s both }
  .pie-in    { animation: piechart 0.35s ease-out both }
`;
function rgba(hex,a=1){
  const r=parseInt(hex.slice(1,3),16),g=parseInt(hex.slice(3,5),16),b=parseInt(hex.slice(5,7),16);
  return `rgba(${r},${g},${b},${a})`;
}
function md(text){
  return text.split(/(\*\*[^*]+\*\*)/).map((p,i)=>
    p.startsWith('**')&&p.endsWith('**')
      ?<strong key={i} style={{color:C.navy}}>{p.slice(2,-2)}</strong>
      :<React.Fragment key={i}>{p}</React.Fragment>
  );
}
const PAGE_BG={background:'linear-gradient(150deg,#f0fdf4 0%,#ecfdf5 30%,#f0f9ff 60%,#fefce8 100%)'};
const CARD={background:'rgba(255,255,255,0.72)',backdropFilter:'blur(16px)'};

// ===============================================================
// SHARED UI
// ===============================================================
function IslamicBg(){
  return(
    <svg className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden="true">
      <defs>
        <pattern id="ip5" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
          <path d="M30 0L60 30L30 60L0 30Z" fill="none" stroke={C.teal} strokeWidth="0.5" opacity="0.04"/>
          <circle cx="30" cy="30" r="12" fill="none" stroke={C.teal} strokeWidth="0.3" opacity="0.04"/>
          <path d="M30 18L42 30L30 42L18 30Z" fill="none" stroke={C.teal} strokeWidth="0.4" opacity="0.03"/>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#ip5)"/>
    </svg>
  );
}
function Confetti(){
  const items=useRef(Array.from({length:48},(_,i)=>({
    id:i,left:`${Math.random()*100}%`,size:12+Math.random()*14,
    dur:2+Math.random()*2.5,delay:Math.random()*1.2,
    icon:['✦','✧','☆','🌟','✨','⭐','💫','🏆','🥇'][i%9],
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
      {unscored&&<span className="text-xs px-2.5 py-1 rounded-full font-bold" style={{background:rgba(C.gold,0.15),color:C.gold}}>⚡ Discovery - not scored</span>}
    </div>
  );
}
function FeedbackPanel({correct,text,bridge,meta,reflection,discovery}){
  const sc=meta?(meta.ok===meta.total?C.green:meta.ok>=Math.ceil(meta.total*0.67)?C.gold:C.coral):correct?C.green:C.coral;
  const bg=discovery?rgba(C.navy,0.04):reflection?C.tealLight:correct?C.greenLight:C.coralLight;
  const bc=discovery?rgba(C.navy,0.18):reflection?C.teal:correct?C.green:C.coral;
  const icon=discovery?<span className="text-lg">🗺️</span>:reflection?<span className="text-lg">💙</span>:correct?<CheckCircle className="w-5 h-5" style={{color:C.green}}/>:<XCircle className="w-5 h-5" style={{color:C.coral}}/>;
  const label=discovery?'Awareness map':reflection?'Thank you for reflecting.':correct?'Correct!':'Not quite!';
  const labelColor=discovery?C.navy:reflection?C.teal:correct?C.green:C.coral;
  return(
    <div className="mt-4 rounded-xl p-5 border-2 su" style={{background:bg,borderColor:bc}}>
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-0.5">{icon}</div>
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
            <div className="text-sm font-bold mb-1" style={{color:labelColor}}>{label}</div>
          )}
          <div className="text-sm leading-relaxed" style={{color:C.dark}}>{text}</div>
          {bridge&&(
            <div className="mt-3 pt-3 border-t flex items-start gap-2" style={{borderColor:rgba(bc,0.28)}}>
              <ArrowRight className="w-4 h-4 mt-0.5 flex-shrink-0" style={{color:C.teal}}/>
              <span className="text-xs italic" style={{color:C.teal}}>{bridge}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ===============================================================
// SECTION VISUAL COMPONENTS
// ===============================================================

// Three-way CUC system (Section A)
function ThreeCatTable(){
  const cats=[
    {cat:'COMPLIANT',icon:'✅',color:C.green,bg:C.greenLight,meaning:'Passes the Five Questions. No prohibitions detected.',example:'Salary account (no interest). Service contracts. Equity investments with clear terms.'},
    {cat:'UNCERTAIN',icon:'❓',color:C.gold,bg:C.goldLight,meaning:'Needs deeper analysis. Might be fine, might not.',example:'BNPL (depends on late fee structure). Products with Shariah certificates you have not verified.'},
    {cat:'CONVENTIONAL',icon:'❌',color:C.coral,bg:C.coralLight,meaning:'Fails one or more of the Five Questions. Contains a prohibition.',example:'Savings account earning interest. Conventional loan. Standard insurance.'},
  ];
  return(
    <div className="rounded-2xl overflow-hidden mb-5 border-2" style={{borderColor:rgba(C.navy,0.1)}}>
      <div className="px-4 py-2.5 flex items-center gap-2" style={{background:`linear-gradient(135deg,${C.navy},#2a3f6a)`}}>
        <span className="text-sm">🗂️</span>
        <span className="text-xs font-black tracking-wide text-white uppercase">The Three Categories</span>
      </div>
      <div className="divide-y" style={{divideColor:rgba(C.navy,0.06)}}>
        {cats.map((c,i)=>(
          <div key={i} className="p-4 flex items-start gap-3" style={{background:c.bg}}>
            <div className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-xl" style={{background:'rgba(255,255,255,0.6)',border:`2px solid ${rgba(c.color,0.3)}`}}>
              {c.icon}
            </div>
            <div className="flex-1">
              <div className="text-sm font-black mb-0.5" style={{color:c.color}}>{c.cat}</div>
              <div className="text-xs leading-snug mb-1" style={{color:C.dark}}>{c.meaning}</div>
              <div className="text-[10px] italic" style={{color:C.mid}}>e.g. {c.example}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Insurance Five Q table (Section B)
function InsuranceFiveQTable(){
  const rows=[
    {q:'1. Actual transaction?',a:'You pay premiums. If something happens, insurer pays. If nothing happens, you lose premiums.',v:'Unclear exchange'},
    {q:'2. Guaranteed return, no risk?',a:'Insurer invests premiums in interest-bearing instruments.',v:'Riba in background'},
    {q:'3. Both sides see clearly?',a:"You don't know if you'll ever benefit. You don't control when or how claims are processed.",v:'Gharar'},
    {q:'4. Pure chance?',a:'Whether you claim depends entirely on whether an accident happens. Random.',v:'Maysir element'},
    {q:'5. Real exchange?',a:'You pay money. You might get money back. Or you might get nothing forever.',v:'No guaranteed exchange'},
  ];
  return(
    <div className="rounded-xl overflow-hidden border mb-5" style={{borderColor:rgba(C.navy,0.1)}}>
      <div className="px-4 py-2.5 flex items-center gap-2" style={{background:rgba(C.coral,0.08)}}>
        <span className="text-sm">🚗</span>
        <span className="text-xs font-bold" style={{color:C.navy}}>Yusuf's Car Insurance - Five Questions Applied</span>
      </div>
      {rows.map((r,i)=>(
        <div key={i} className="grid text-xs border-t" style={{gridTemplateColumns:'1fr auto',borderColor:rgba(C.navy,0.07),background:i%2===0?'white':rgba(C.coralLight,0.2)}}>
          <div className="p-2.5">
            <div className="font-bold mb-0.5" style={{color:C.navy}}>{r.q}</div>
            <div style={{color:C.mid}}>{r.a}</div>
          </div>
          <div className="p-2.5 flex items-center justify-center min-w-[72px]" style={{borderLeft:`1px solid ${rgba(C.navy,0.07)}`}}>
            <span className="text-[9px] font-black px-1.5 py-0.5 rounded-full text-center" style={{background:C.coralLight,color:C.coral}}>{r.v}</span>
          </div>
        </div>
      ))}
      <div className="px-4 py-2.5 flex items-center gap-2" style={{background:rgba(C.coralLight,0.5)}}>
        <XCircle className="w-3.5 h-3.5 flex-shrink-0" style={{color:C.coral}}/>
        <span className="text-xs font-bold" style={{color:C.coral}}>Fails all five. The only product in the module to do so.</span>
      </div>
    </div>
  );
}

// Yusuf's visual map table (Section C)
function YusufMapTable(){
  const rows=[
    {cat:'COMPLIANT',icon:'✅',color:C.green,bg:C.greenLight,products:'Salary account, phone plan, gym',value:'~20%'},
    {cat:'UNCERTAIN',icon:'❓',color:C.gold,bg:C.goldLight,products:'BNPL (Tabby)',value:'~5%'},
    {cat:'CONVENTIONAL',icon:'❌',color:C.coral,bg:C.coralLight,products:'Savings account, car loan, car insurance, emergency fund',value:'~75%'},
  ];
  return(
    <div className="rounded-xl overflow-hidden border mb-5" style={{borderColor:rgba(C.navy,0.1)}}>
      <div className="px-4 py-2 text-xs font-black uppercase tracking-wide" style={{background:C.navy,color:C.gold}}>Yusuf's Financial Map</div>
      {rows.map((r,i)=>(
        <div key={i} className="flex items-center gap-3 p-3 border-t text-xs" style={{background:r.bg,borderColor:rgba(C.navy,0.07)}}>
          <span className="text-lg flex-shrink-0">{r.icon}</span>
          <div className="flex-1">
            <div className="font-black text-[10px] mb-0.5" style={{color:r.color}}>{r.cat}</div>
            <div style={{color:C.dark}}>{r.products}</div>
          </div>
          <div className="text-sm font-black flex-shrink-0 w-12 text-center" style={{color:r.color}}>{r.value}</div>
        </div>
      ))}
      <div className="px-4 py-3" style={{background:rgba(C.navy,0.03)}}>
        <p className="text-xs leading-relaxed" style={{color:C.dark}}>75% conventional looks alarming. But Yusuf is exactly where most people are. The difference is that now he can <strong style={{color:C.navy}}>see it</strong>. And visibility is the first step to change.</p>
      </div>
    </div>
  );
}

// Prioritisation framework (Section D)
function PrioritisationFramework(){
  const steps=[
    {n:1,icon:'⚡',label:'Easiest Win',color:C.green,bg:C.greenLight,desc:'Products you can change NOW with minimal disruption.',example:"Emergency fund: move to a non-interest account. Takes 30 minutes."},
    {n:2,icon:'⚖️',label:'Biggest Amount',color:C.teal,bg:C.tealLight,desc:'The largest conventional balance has the most impact.',example:'Savings account: AED 25,000 earning interest. Research Islamic savings.'},
    {n:3,icon:'🔒',label:'Locked Contracts',color:C.orange,bg:C.orangeLight,desc:'Products you are contractually committed to. Plan for when they expire.',example:'Car loan: AED 45,000 remaining. Plan for Islamic refinancing.'},
    {n:4,icon:'⚖️',label:'Legal Requirements',color:C.coral,bg:C.coralLight,desc:'Products you legally must have. Find Islamic alternatives if available.',example:'Car insurance: legally required. Research takaful options. Switch at renewal.'},
  ];
  return(
    <div className="rounded-2xl overflow-hidden mb-5 border-2" style={{borderColor:rgba(C.navy,0.1)}}>
      <div className="px-4 py-2.5 flex items-center gap-2" style={{background:`linear-gradient(135deg,${C.navy},#2a3f6a)`}}>
        <span className="text-sm">📋</span>
        <span className="text-xs font-black tracking-wide text-white uppercase">Prioritisation Framework</span>
        <span className="ml-auto text-[10px] px-2 py-0.5 rounded-full font-bold" style={{background:'rgba(255,255,255,0.15)',color:'white'}}>actionability first</span>
      </div>
      <div className="bg-white divide-y" style={{divideColor:rgba(C.navy,0.05)}}>
        {steps.map((s,i)=>(
          <div key={i} className="flex items-start gap-3 p-4">
            <div className="flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center text-lg" style={{background:s.bg,border:`2px solid ${rgba(s.color,0.3)}`}}>{s.icon}</div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-xs font-black" style={{color:s.color}}>{s.n}. {s.label}</span>
              </div>
              <div className="text-xs leading-snug mb-1" style={{color:C.dark}}>{s.desc}</div>
              <div className="text-[10px] italic px-2 py-1 rounded-lg" style={{background:s.bg,color:s.color}}>{s.example}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="px-4 py-3" style={{background:rgba(C.goldLight,0.6)}}>
        <p className="text-xs font-bold" style={{color:C.gold}}>Key insight: prioritise by ACTIONABILITY, not severity. Start with what moves.</p>
      </div>
    </div>
  );
}

// Personal audit card (Section E)
function PersonalAuditCard(){
  const items=[
    {icon:'🏦',label:'Bank accounts',q:'Do any earn interest?'},
    {icon:'🚗',label:'Loans',q:'Car, personal, student? Are they interest-based?'},
    {icon:'🛡️',label:'Insurance',q:'Car, health, home, life? Conventional or takaful?'},
    {icon:'📈',label:'Investments',q:'Do you know what you are invested in? Have you screened?'},
    {icon:'📱',label:'Buy Now Pay Later',q:'Do you use BNPL? What are the late fee terms?'},
    {icon:'💳',label:'Credit cards',q:'Do you carry a balance? Is there interest?'},
  ];
  return(
    <div className="rounded-2xl overflow-hidden mb-5 border-2" style={{borderColor:rgba(C.teal,0.25)}}>
      <div className="px-4 py-2.5 flex items-center gap-2" style={{background:`linear-gradient(135deg,${C.teal},${C.navy})`}}>
        <span className="text-sm">🔍</span>
        <span className="text-xs font-black tracking-wide text-white uppercase">Your Personal Audit</span>
        <span className="ml-auto text-[10px] px-2 py-0.5 rounded-full font-bold" style={{background:'rgba(255,255,255,0.15)',color:'white'}}>think silently</span>
      </div>
      <div className="p-4 bg-white">
        <div className="grid grid-cols-1 gap-2">
          {items.map((item,i)=>(
            <div key={i} className="flex items-start gap-3 p-3 rounded-xl" style={{background:rgba(C.tealLight,0.4)}}>
              <span className="text-lg flex-shrink-0">{item.icon}</span>
              <div>
                <div className="text-xs font-bold" style={{color:C.navy}}>{item.label}</div>
                <div className="text-xs" style={{color:C.mid}}>{item.q}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 p-3 rounded-xl" style={{background:rgba(C.goldLight,0.7),border:`1px solid ${rgba(C.gold,0.2)}`}}>
          <p className="text-xs leading-relaxed" style={{color:C.dark}}>
            If this makes you feel uncomfortable, that is normal. Remember Lesson 1: Islam is pro-wealth. Remember Lesson 2: you are a custodian, not a criminal. This audit is an act of <strong style={{color:C.navy}}>responsibility</strong>, not self-punishment.
          </p>
        </div>
      </div>
    </div>
  );
}

// Module 1 key takeaway (Section F)
function M1TakeawayCard(){
  const points=[
    {n:1,lesson:'L1',text:'Islam is pro-wealth. Financial engagement is worship, not sin.'},
    {n:2,lesson:'L2',text:'Your wealth is amanah - a trust. You are a custodian.'},
    {n:3,lesson:'L3',text:'Three things are never allowed: riba, gharar, maysir.'},
    {n:4,lesson:'L4',text:'Labels lie. Use the Five Questions to check substance.'},
    {n:5,lesson:'L5',text:'You know where your money stands right now.'},
  ];
  return(
    <div className="rounded-2xl overflow-hidden mb-5 border-2" style={{borderColor:rgba(C.gold,0.35)}}>
      <div className="px-4 py-2.5 flex items-center gap-2" style={{background:`linear-gradient(135deg,${C.navy},#2a3f6a)`}}>
        <span className="text-sm">🗝️</span>
        <span className="text-xs font-black tracking-wide text-white uppercase">Module 1 - What You Now Have</span>
      </div>
      <div className="bg-white divide-y" style={{divideColor:rgba(C.navy,0.06)}}>
        {points.map((p,i)=>(
          <div key={i} className="flex items-center gap-3 px-4 py-3">
            <div className="w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center text-[9px] font-black" style={{background:`linear-gradient(135deg,${C.gold},${C.orange})`,color:'white'}}>{p.n}</div>
            <div className="text-[10px] font-bold flex-shrink-0 px-1.5 py-0.5 rounded-full" style={{background:rgba(C.teal,0.1),color:C.teal}}>{p.lesson}</div>
            <div className="text-xs flex-1" style={{color:C.dark}}>{p.text}</div>
          </div>
        ))}
      </div>
      <div className="px-4 py-3" style={{background:C.goldLight}}>
        <p className="text-xs leading-relaxed" style={{color:C.dark}}>
          <strong style={{color:C.navy}}>Module 2 begins the HOW:</strong> how do valid trades work? What makes a sale permissible? This is where you start building alternatives to the conventional products in your audit.
        </p>
      </div>
    </div>
  );
}

// ===============================================================
// QUESTIONS DATA
// ===============================================================

const BANK_ITEMS=[
  {id:'salary', icon:'💼', name:'Salary Account',    detail:'Current account. No interest paid.',          amount:'',        category:'clean',     label:'Clean - no concern'},
  {id:'savings',icon:'🏦', name:'Savings Account',   detail:'AED 25,000. Earns 3.5% guaranteed interest.', amount:'AED 25,000', category:'concern',label:'Riba'},
  {id:'carloan',icon:'🚗', name:'Car Loan',           detail:'AED 45,000 remaining. 4.9% interest rate.',   amount:'AED 45,000', category:'concern',label:'Riba'},
  {id:'phone',  icon:'📱', name:'Phone Plan',         detail:'AED 299/month. 24-month contract.',           amount:'AED 299/mo',  category:'clean', label:'Clean - service contract'},
  {id:'insure', icon:'🛡️', name:'Car Insurance',     detail:'AED 2,800/year. Conventional insurer.',       amount:'AED 2,800/yr',category:'concern',label:'Riba + Gharar + Maysir'},
  {id:'efund',  icon:'💰', name:'Emergency Fund',     detail:'AED 10,000 in a locked deposit. 2% interest.',amount:'AED 10,000',  category:'concern',label:'Riba (even at 2%)'},
  {id:'gym',    icon:'🏋️', name:'Gym Membership',    detail:'AED 350/month. Direct debit.',                amount:'AED 350/mo',  category:'clean', label:'Clean - service'},
  {id:'bnpl',   icon:'📦', name:'BNPL (Tabby)',        detail:'AED 1,200 split into 4 payments. 0% if on time. Late fee applies.',amount:'AED 1,200',category:'uncertain',label:'Uncertain - needs analysis'},
];

const QUESTIONS=[
  {
    id:'q1',position:'first',
    type:'bank-statement',mode:'PLAY',typeLabel:'Spot the Concerns',
    scored:false,
    question:"Below is a simplified financial summary for Yusuf. Tap any items you think might have an Islamic finance concern. Trust your instincts - you don't need to name the concern yet.",
    feedbackByCount:{
      great:"Excellent instincts! You spotted the interest-bearing accounts, the conventional loan, and the insurance. Your toolkit from Lessons 1 to 4 is already working. Now let us classify these properly.",
      good:"Good start! The savings account and car loan are the most obvious - guaranteed interest = riba. Insurance is the sneaky one: it combines all three prohibitions. And that emergency fund earning 2%? That is riba too, even though the rate is small.",
      low:"That is completely fine - this is why we are doing this exercise. By the end of this lesson, you will be able to spot every concern in this list. Let us learn the system.",
      cautious:"You are being very cautious - which is understandable! But not everything is a concern. A phone plan is a service contract. A gym membership is the same. A salary account with no interest is clean. Let us learn how to distinguish.",
      tone:"Remember: this is not a guilt list. This is an awareness map. Yusuf is not a bad person. He just did not have the toolkit you now have. Neither did you, until this week. Now you do.",
    },
  },
  {
    id:'q2',afterSection:'A',
    type:'bucket3cuc',mode:'SORT',typeLabel:'3-Bucket Sort',level:'2/5',
    question:"Classify each of Yusuf's financial products into the correct category.",
    items:[
      {id:'i1',text:'Salary Account (no interest)',correct:'compliant',why:'No interest, no prohibitions. Clean.'},
      {id:'i2',text:'Savings Account (3.5% interest)',correct:'conventional',why:'Guaranteed interest = riba.'},
      {id:'i3',text:'Car Loan (4.9% interest)',correct:'conventional',why:'Interest-based loan = riba.'},
      {id:'i4',text:'Phone Plan (service contract)',correct:'compliant',why:'Service for payment. No prohibition.'},
      {id:'i5',text:'Car Insurance (conventional)',correct:'conventional',why:'Contains riba + gharar + maysir.'},
      {id:'i6',text:'Emergency Fund (2% interest)',correct:'conventional',why:'Even small interest = riba. Rate is irrelevant.'},
      {id:'i7',text:'Gym Membership',correct:'compliant',why:'Service for payment. Clean.'},
      {id:'i8',text:'BNPL - Tabby (0%, late fee)',correct:'uncertain',why:'Needs analysis: is the late fee structure problematic?'},
    ],
    buckets:[
      {id:'compliant',  label:'Compliant',   icon:'✅',color:C.green, bg:C.greenLight, desc:'Passes the Five Questions'},
      {id:'uncertain',  label:'Uncertain',   icon:'❓',color:C.gold,  bg:C.goldLight,  desc:'Needs deeper analysis'},
      {id:'conventional',label:'Conventional',icon:'❌',color:C.coral, bg:C.coralLight, desc:'Fails at least one question'},
    ],
    feedback:{
      perfect:"Perfect classification. Three compliant, four conventional, one uncertain. You can already map a full financial life. That is a real skill.",
      good:"Almost there! Common miss: the emergency fund (2% feels tiny but it is still riba - the rate does not matter, the structure does) or BNPL (it is uncertain, not conventional - because the base product might be fine, but the late fee needs checking).",
      mid:"Good effort on a complex task! The key: anything with guaranteed interest = conventional (riba). Services you pay for = compliant. And BNPL is the tricky one - uncertain because it depends on the fine print.",
      low:"This is a lot of items! The simple test: if it pays or charges interest, it is conventional. If it is a service (phone, gym), it is compliant. If it is a grey area (BNPL), it is uncertain.",
    },
  },
  {
    id:'q3',afterSection:'B',
    type:'fiveq-checklist',mode:'THINK',typeLabel:'Pass / Fail Checklist',level:'3/5',
    question:"Apply the Five Questions to Yusuf's savings account. Answer YES or NO for each:",
    product:{
      name:"Yusuf's Savings Account",
      icon:'🏦',
      terms:[
        'Balance: AED 25,000',
        'Rate: 3.5% guaranteed annual return',
        'Capital protected - you will never lose money',
        "Bank invests deposits in 'conventional portfolios'",
      ],
    },
    rows:[
      {q:'1. Is there an actual trade of goods or services happening?', answer:'no', why:"Money in, interest out. No trade of goods or services."},
      {q:'2. Is one side guaranteed a return with no risk of loss?',    answer:'yes',why:"3.5% guaranteed. Capital protected. Classic riba."},
      {q:'3. Can both parties see clearly where the money goes?',       answer:'no', why:"Bank invests in 'conventional portfolios' - no specifics. Gharar."},
      {q:'4. Does the outcome depend entirely on chance?',              answer:'no', why:"Returns are fixed, not chance-based. No maysir."},
      {q:'5. Does a real exchange of value take place?',                answer:'no', why:"Only money changes hands. No goods or services exchanged."},
    ],
    feedback:{
      perfect:"Perfectly analysed. Four 'no' answers and one 'yes' - the savings account fails on almost every question. It is one of the most common conventional products and one of the first many people address. In Module 2, you will learn how Islamic savings alternatives actually work.",
      good:"Almost! The one most people get wrong: Question 3. The bank says it invests your money in 'conventional portfolios' but gives you no detail. Where exactly? In what? You cannot see. That is gharar - answer is NO.",
      low:"Let us walk through: (1) No real trade - just money in, interest out. (2) 3.5% guaranteed, capital safe - YES, one side is protected. (3) You do not know where the bank invests - NO clarity. (4) Fixed rate, no randomness - NO, it is not chance-based. (5) No goods exchanged - NO real exchange.",
    },
    verdictText:"Fails 4 of 5",
  },
  {
    id:'q4',afterSection:'C',
    type:'pie-chart-builder',mode:'PLAY',typeLabel:'Build the Financial Map',level:'3/5',
    question:"Sort each product into its category and watch Yusuf's financial map take shape in real time.",
    items:[
      {id:'p1',text:'Salary Account',    detail:'Current account',       correct:'compliant',   pieWeight:5},
      {id:'p2',text:'Savings Account',   detail:'AED 25,000 @ 3.5%',     correct:'conventional',pieWeight:25},
      {id:'p3',text:'Car Loan',          detail:'AED 45,000 @ 4.9%',     correct:'conventional',pieWeight:45},
      {id:'p4',text:'Phone Plan',        detail:'AED 299/month',          correct:'compliant',   pieWeight:5},
      {id:'p5',text:'Car Insurance',     detail:'AED 2,800/year',         correct:'conventional',pieWeight:3},
      {id:'p6',text:'Emergency Fund',    detail:'AED 10,000 @ 2%',        correct:'conventional',pieWeight:2},
      {id:'p7',text:'Gym Membership',    detail:'AED 350/month',          correct:'compliant',   pieWeight:10},
      {id:'p8',text:'BNPL (Tabby)',       detail:'AED 1,200 outstanding',  correct:'uncertain',   pieWeight:5},
    ],
    buckets:[
      {id:'compliant',   label:'Compliant',    icon:'✅',color:C.green, bg:C.greenLight},
      {id:'uncertain',   label:'Uncertain',    icon:'❓',color:C.gold,  bg:C.goldLight},
      {id:'conventional',label:'Conventional', icon:'❌',color:C.coral, bg:C.coralLight},
    ],
    feedback:{
      perfect:"Here is Yusuf's reality: 75% conventional, 20% compliant, 5% uncertain. That is not a failure - it is a starting point. Most people have never even SEEN this breakdown. Yusuf now has a map. And so will you.",
      good:"Almost there. Check the items you missed. The pie chart shows where Yusuf stands - and once you see the proportions, you understand why even small changes matter.",
      low:"That is a tricky exercise with 8 items. The rule of thumb: anything with interest = conventional. Services = compliant. Grey areas = uncertain.",
    },
  },
  {
    id:'q5',afterSection:'D',
    type:'priority-ranking',mode:'SORT',typeLabel:'Priority Ranking',level:'3/5',
    question:"Rank Yusuf's four conventional products from what he should address FIRST to LAST:",
    items:[
      {id:'r1',pos:1,text:'Emergency Fund',     detail:'AED 10,000, 2% interest', tag:'Easiest win - fix in one day',    color:C.green},
      {id:'r2',pos:2,text:'Savings Account',    detail:'AED 25,000, 3.5% interest',tag:'Biggest amount - research alternatives',color:C.teal},
      {id:'r3',pos:3,text:'Car Loan',           detail:'AED 45,000, 4.9% interest',tag:'Locked contract - plan for when it ends',color:C.orange},
      {id:'r4',pos:4,text:'Car Insurance',      detail:'AED 2,800/year, conventional',tag:'Legal requirement - switch at renewal',color:C.coral},
    ],
    feedback:{
      perfect:"Perfect prioritisation. Start with what you CAN change now, not what seems worst. The emergency fund is a 30-minute fix. The insurance needs a renewal cycle. Quick wins build momentum.",
      good:"Good thinking! The key: prioritise by ACTIONABILITY, not severity. Insurance has three prohibitions but you are legally locked. The emergency fund has one prohibition but you can fix it today. Action beats theory.",
      low:"The framework: (1) Easiest win first - emergency fund. (2) Biggest balance - savings. (3) Locked contracts - car loan. (4) Legal requirements - insurance. Start with what moves, not what is worst.",
    },
  },
  {
    id:'q6',afterSection:'E',
    type:'confidence-slider',mode:'THINK',typeLabel:'Personal Reflection',level:'3/5',
    scored:false,
    question:"After thinking about your own finances, how do you feel right now?",
    positions:[
      {val:1,label:'Overwhelmed',sublabel:'I have a lot to address',
        feedback:"That is completely understandable. You have just seen your finances through a new lens. The good news: you do not have to fix everything at once. Start with ONE product - the easiest win. One step. That is all. Module 2 will give you the knowledge to understand the alternatives."},
      {val:2,label:'Concerned',sublabel:'But at least I can see it now',
        feedback:"You have the right instinct. Concern means you care. And 'at least I can see it' is EXACTLY the point of this lesson. You went from not knowing to knowing. That is a huge step. Everything from here is actionable."},
      {val:3,label:'Neutral',sublabel:'I expected this',
        feedback:"You expected this - which means your instincts were already good. Now you have the TOOLS to do something about it. Module 2 gives you the trade knowledge to understand Islamic alternatives."},
      {val:4,label:'Encouraged',sublabel:'I have a plan forming',
        feedback:"That is the custodian mindset in action. You see the situation, you are forming a plan, and you know you have the Five Questions to guide you. You are ahead of where most people ever get."},
      {val:5,label:'Confident',sublabel:'I know my next steps',
        feedback:"Excellent. You have absorbed the entire Module 1 toolkit. Amanah, three prohibitions, Five Questions, and now a personal audit. You are ready for Module 2."},
    ],
  },
  {
    id:'q7',afterSection:'F',
    type:'mcq',mode:'THINK',typeLabel:'Module Capstone - Level 4',level:'4/5',
    isCapstone:true,
    isModuleCapstone:true,
    question:"Your sister asks for your advice. She shows you this brochure. Using everything from Module 1, which response is best?",
    brochure:{
      name:'Green Crescent Investment Plan',
      badge:'Shariah Approved',
      terms:[
        'Guaranteed 10% annual return on your investment.',
        'Capital 100% protected - you will never lose money.',
        'Approved by our internal Shariah advisor.',
        'Your funds are invested in a diversified global portfolio.',
        'Withdraw any time with no penalty.',
      ],
    },
    sister:"Should I invest?",
    options:[
      {id:'a',text:"Yes, I think it is fine. It has a Shariah advisor and the brochure explicitly says halal. That is usually enough of a guarantee - advisors exist precisely to check these things, so I would trust their approval and tell her to go ahead.",correct:false,
        feedback:"This is the trap the entire module warns against. A label and an advisor do not change the substance. Guaranteed 10% with zero risk = riba. Capital protection = no risk for one side. Unclear portfolio = gharar. The brochure contains at least two prohibitions. The label lied."},
      {id:'b',text:"No, I would tell her to avoid it entirely. Honestly, Muslims should be very cautious about any kind of investment product - there are too many ways things can go wrong, and it is safer to just keep money in cash and avoid financial products altogether.",correct:false,
        feedback:"This is the Lesson 1 misconception! Islam is not anti-investment. The Prophet was a merchant. Khadija (ra) was a businesswoman. The issue is not investing - it is the STRUCTURE of this particular product. Guaranteed return with zero risk = riba. Investing with real trade and shared risk = perfectly permissible."},
      {id:'c',text:"I would want to look more closely before saying yes. A guaranteed 10% return with capital protection raises a riba question - one side has no risk at all. The portfolio is described as 'diversified global' but there is no detail on what it actually holds, which is a gharar concern. And a Shariah label is a starting point, not a conclusion - we learned that in Lesson 4. I would be cautious.",correct:true,
        feedback:"THIS is the Module 1 graduate response. You did not just react - you ANALYSED. You used the Five Questions. You spotted riba (guaranteed return, zero risk). You spotted gharar (unclear portfolio). You questioned the label (substance over labels). And you did it for someone else, which means you truly OWN this knowledge. You are ready for Module 2."},
      {id:'d',text:"Honestly I am not sure what to tell her. Islamic finance rules around investments are quite technical and nuanced - I do not think I have enough knowledge yet to give her a proper answer, and I would not want to give her the wrong advice on something this important.",correct:false,
        feedback:"You CAN evaluate this. You have the Five Questions. (1) Actual transaction? Deposit to guaranteed return. No trade. (2) Guaranteed, no risk? Yes. Riba. (3) Clear? No - 'diversified global portfolio' tells you nothing. Gharar. (4) Chance? No maysir. (5) Real exchange? No goods. You just did the analysis in 30 seconds. You are more capable than you think."},
    ],
    bridge:"Module 2: Trade Essentials. You know what is prohibited. Now learn what is PERMITTED. How do valid trades work? What makes a sale legitimate? This is where you start building alternatives.",
  },
];

const SCORED_COUNT=QUESTIONS.filter(q=>q.scored!==false).length; // 5

const FLOW=(()=>{
  const f=[];
  QUESTIONS.filter(q=>q.position==='first').forEach(q=>f.push({type:'question',data:q}));
  const SECTIONS=[
    {id:'A',title:'Compliant, Uncertain, Conventional',
      body:["Now let us turn instinct into system. Every financial product in your life falls into one of three categories. The goal is not to judge your past - it is to give you **clarity** about where you stand right now.",
            "Critical: **CONVENTIONAL does not mean you are a bad Muslim.** It means this product, as it stands, has a structural issue. Maybe you did not know. Maybe there was no alternative available. Maybe you are locked into a contract. Awareness is the first step. Change happens gradually, not overnight."],
      visual:'threeCat',
      callout:{icon:'💡',title:'The Awareness Rule',text:"The goal of this lesson is NOT to make you feel guilty about your current finances. The goal is to give you CLARITY. Once you know where you stand, you can make informed decisions going forward. Nobody expects you to close every account tomorrow. But now you KNOW - and knowing is the custodian's responsibility.",color:C.teal,bg:C.tealLight}},
    {id:'B',title:'Depth Check - One Product at a Time',
      body:["The three-category sort is your quick scan. But for products in the 'conventional' or 'uncertain' bucket, you need a deeper analysis. That is where the Five Questions come in again.",
            "Let us demonstrate with Yusuf's car insurance:"],
      visual:'insuranceFiveQ',
      callout:{icon:'💡',title:"You Are Not Expected to Cancel Your Insurance Today",text:"In many countries, car insurance is legally required. You cannot drive without it. If no takaful option is available to you, conventional insurance may be a necessity. Awareness does not mean instant action. It means: you know the issue, you look for alternatives when they exist, and you make the best decision available.",color:C.teal,bg:C.tealLight}},
    {id:'C',title:"Visualising Yusuf's Financial Map",
      body:["Once you have classified every product, you can see your financial health at a glance.",
            "75% conventional. That looks alarming. But remember: Yusuf is not a bad person. He is exactly where most people are. The difference is that NOW he can see it. And that visibility is the first step to change.",
            "The goal is not to get to 100% compliant overnight. It is to move the dial gradually: shift one product at a time, starting with the easiest wins."],
      visual:'yusufMap'},
    {id:'D',title:'What to Address First',
      body:["Yusuf has four conventional products. He cannot address all of them at once. So where does he start?",
            "Notice: the priority is NOT based on severity. It is based on **actionability**. The car insurance might be the worst offender (three prohibitions), but you cannot cancel it tomorrow. The emergency fund is a smaller issue but you can fix it TODAY. Start with what moves."],
      visual:'prioritisation'},
    {id:'E',title:'Now It Is Your Turn',
      body:["We have mapped Yusuf's finances. Now think about your own. You do not have to share anything with this app. But in your mind, run through your financial products."],
      visual:'personalAudit'},
    {id:'F',title:'What You Have Built',
      body:["Over five lessons, you have built a complete toolkit. You are now ready for the one question that closes this module."],
      visual:'m1takeaway'},
  ];
  SECTIONS.forEach(sec=>{
    f.push({type:'section',data:sec});
    QUESTIONS.filter(q=>q.afterSection===sec.id).forEach(q=>f.push({type:'question',data:q}));
  });
  return f;
})();

// ===============================================================
// PIE CHART HELPERS
// ===============================================================
function polarToCartesian(cx,cy,r,angleDeg){
  const rad=((angleDeg-90)*Math.PI)/180;
  return{x:cx+r*Math.cos(rad),y:cy+r*Math.sin(rad)};
}
function arcPath(cx,cy,r,startDeg,endDeg){
  if(endDeg-startDeg>=359.9){
    return `M ${cx-r} ${cy} A ${r} ${r} 0 1 1 ${cx+r} ${cy} A ${r} ${r} 0 1 1 ${cx-r} ${cy} Z`;
  }
  const s=polarToCartesian(cx,cy,r,startDeg);
  const e=polarToCartesian(cx,cy,r,endDeg);
  const large=endDeg-startDeg>180?1:0;
  return `M ${cx} ${cy} L ${s.x.toFixed(2)} ${s.y.toFixed(2)} A ${r} ${r} 0 ${large} 1 ${e.x.toFixed(2)} ${e.y.toFixed(2)} Z`;
}

function LivePieChart({compliantW,uncertainW,conventionalW,submitted}){
  const cx=80,cy=80,r=70;
  const total=compliantW+uncertainW+conventionalW;
  if(total===0){
    return(
      <svg width="160" height="160" aria-label="Pie chart - drag items to build">
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#e5e7eb" strokeWidth="2" strokeDasharray="6 4"/>
        <text x={cx} y={cy-8} textAnchor="middle" fontSize="10" fill={C.mid}>Drag items</text>
        <text x={cx} y={cy+8} textAnchor="middle" fontSize="10" fill={C.mid}>to build</text>
      </svg>
    );
  }
  const slices=[
    {w:compliantW,   color:C.green, label:'✅'},
    {w:uncertainW,   color:C.gold,  label:'❓'},
    {w:conventionalW,color:C.coral, label:'❌'},
  ];
  let angle=0;
  const drawn=slices.map(s=>{
    const pct=s.w/total;
    const start=angle;
    const end=angle+pct*360;
    angle=end;
    return{...s,pct,start,end};
  }).filter(s=>s.w>0);

  return(
    <svg width="160" height="160" aria-label={`Pie chart: compliant ${Math.round(compliantW/total*100)}%, uncertain ${Math.round(uncertainW/total*100)}%, conventional ${Math.round(conventionalW/total*100)}%`}>
      {drawn.map((s,i)=>{
        const mid=(s.start+s.end)/2;
        const lp=polarToCartesian(cx,cy,r*0.62,mid);
        const pct=Math.round(s.pct*100);
        return(
          <g key={i}>
            <path d={arcPath(cx,cy,r,s.start,s.end)} fill={s.color} opacity="0.9"/>
            {pct>=6&&(
              <text x={lp.x.toFixed(1)} y={lp.y.toFixed(1)} textAnchor="middle" dy="4" fontSize="11" fontWeight="bold" fill="white">
                {pct}%
              </text>
            )}
          </g>
        );
      })}
      {submitted&&(
        <g>
          <rect x="0" y="0" width="160" height="160" fill="rgba(27,42,74,0.72)" rx="80"/>
          <text x={cx} y={cy-14} textAnchor="middle" fontSize="9" fill={C.gold} fontWeight="bold">This is Yusuf.</text>
          <text x={cx} y={cy+2}  textAnchor="middle" fontSize="8" fill="white">Your numbers will</text>
          <text x={cx} y={cy+16} textAnchor="middle" fontSize="8" fill="white">be different.</text>
        </g>
      )}
    </svg>
  );
}

// ===============================================================
// RENDERERS
// ===============================================================

// --- BANK STATEMENT (Q1) --------------------------------------
function BankStatement({q,onFinish}){
  const [flagged,setFlagged]=useState(new Set());
  const [sub,setSub]=useState(false);
  const [results,setResults]=useState(null);
  const lockedRef=useRef(false);

  const toggle=(id)=>{
    if(sub)return;
    setFlagged(prev=>{
      const n=new Set(prev);
      n.has(id)?n.delete(id):n.add(id);
      return n;
    });
  };

  const submit=()=>{
    if(lockedRef.current||sub)return;
    if(flagged.size===0)return;
    lockedRef.current=true;setSub(true);
    const res={};
    BANK_ITEMS.forEach(item=>{
      const wasFlagged=flagged.has(item.id);
      if(item.category==='concern'){res[item.id]=wasFlagged?'correct':'missed';}
      else if(item.category==='uncertain'){res[item.id]=wasFlagged?'uncertain-flagged':'uncertain-missed';}
      else{res[item.id]=wasFlagged?'false-flag':'ok';}
    });
    setResults(res);
    const correctFlags=[...flagged].filter(id=>BANK_ITEMS.find(i=>i.id===id&&i.category==='concern')).length;
    const falseFlags=[...flagged].filter(id=>BANK_ITEMS.find(i=>i.id===id&&i.category==='clean')).length;
    let fb='';
    if(falseFlags>=3) fb=q.feedbackByCount.cautious;
    else if(correctFlags>=4) fb=q.feedbackByCount.great;
    else if(correctFlags>=2) fb=q.feedbackByCount.good;
    else fb=q.feedbackByCount.low;
    fb=fb+' '+q.feedbackByCount.tone;
    onFinish(true,fb,0);
  };

  // Per-result styles applied after submit
  const resBg={
    correct:         rgba(C.greenLight,0.85),
    'false-flag':    rgba(C.coralLight,0.6),
    missed:          rgba(C.orangeLight,0.7),
    'uncertain-flagged': rgba(C.goldLight,0.8),
    'uncertain-missed':  rgba(C.goldLight,0.5),
    ok:              rgba(C.greenLight,0.45),
  };
  const resBorder={
    correct:C.green,'false-flag':C.coral,missed:C.orange,
    'uncertain-flagged':C.gold,'uncertain-missed':C.gold,ok:C.green,
  };

  return(
    <div>
      {/* Bank app header */}
      <div className="rounded-t-2xl px-4 py-3 flex items-center gap-3" style={{background:`linear-gradient(135deg,${C.navy},#253660)`}}>
        <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm" style={{background:rgba(C.gold,0.2)}}>🏦</div>
        <div>
          <div className="text-xs font-black text-white">Financial Summary</div>
          <div className="text-[10px]" style={{color:rgba(C.gold,0.8)}}>Yusuf Al-Rahman</div>
        </div>
        {!sub&&(
          <div className="ml-auto text-[10px] font-bold px-2 py-1 rounded-full" style={{background:rgba(C.gold,0.15),color:C.gold}}>
            {flagged.size} flagged
          </div>
        )}
        {sub&&(
          <div className="ml-auto text-[10px] font-bold px-2 py-1 rounded-full" style={{background:rgba(C.green,0.2),color:C.green}}>
            Results shown
          </div>
        )}
      </div>
      {/* Rows */}
      <div className="rounded-b-2xl overflow-hidden border-2 border-t-0 mb-4" style={{borderColor:rgba(C.navy,0.15)}}>
        {BANK_ITEMS.map((item,i)=>{
          const isFlagged=flagged.has(item.id);
          const res=results?results[item.id]:null;
          const borderL=res?resBorder[res]:isFlagged?C.coral:'transparent';
          return(
            <div key={item.id}
              onClick={()=>toggle(item.id)}
              className="flex items-center gap-3 px-4 py-3 border-b transition-all"
              style={{
                background:res?resBg[res]:isFlagged?rgba(C.coralLight,0.5):'white',
                borderBottomColor:rgba(C.navy,0.07),
                borderLeft:`4px solid ${borderL}`,
                cursor:sub?'default':'pointer',
              }}>
              <span className="text-lg flex-shrink-0">{item.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-bold" style={{color:C.navy}}>{item.name}</div>
                <div className="text-[10px] leading-tight" style={{color:C.mid}}>{item.detail}</div>
                {/* Result label - shown on ALL rows after submit */}
                {res==='correct'&&(
                  <div className="text-[9px] font-bold mt-0.5 su" style={{color:C.green}}>✓ Concern correctly flagged: {item.label}</div>
                )}
                {res==='ok'&&(
                  <div className="text-[9px] font-bold mt-0.5 su" style={{color:C.green}}>✓ Correctly left unflagged - {item.label.toLowerCase()}</div>
                )}
                {res==='missed'&&(
                  <div className="text-[9px] font-bold mt-0.5 su" style={{color:C.orange}}>⚠ Missed - this one has a concern: {item.label}</div>
                )}
                {res==='false-flag'&&(
                  <div className="text-[9px] font-bold mt-0.5 su" style={{color:C.coral}}>✗ Incorrectly flagged - this one is fine: {item.label.toLowerCase()}</div>
                )}
                {res==='uncertain-flagged'&&(
                  <div className="text-[9px] font-bold mt-0.5 su" style={{color:C.gold}}>❓ Good instinct - this one is uncertain and needs deeper analysis</div>
                )}
                {res==='uncertain-missed'&&(
                  <div className="text-[9px] font-bold mt-0.5 su" style={{color:C.gold}}>❓ Worth checking - late fees and the structure need a closer look</div>
                )}
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                {item.amount&&<span className="text-[10px] font-bold" style={{color:C.dark}}>{item.amount}</span>}
                {!sub?(
                  <div className="w-8 h-8 rounded-full flex items-center justify-center transition-all" style={{background:isFlagged?rgba(C.coral,0.15):'rgba(0,0,0,0.04)',border:`2px solid ${isFlagged?C.coral:'#ddd'}`}}>
                    <span style={{color:isFlagged?C.coral:'#bbb',fontSize:'14px'}}>🚩</span>
                  </div>
                ):(
                  res==='correct'   ?<CheckCircle className="w-4 h-4 pop" style={{color:C.green}}/>:
                  res==='ok'        ?<CheckCircle className="w-4 h-4 pop" style={{color:C.green}}/>:
                  res==='false-flag'?<XCircle     className="w-4 h-4"     style={{color:C.coral}}/>:
                  res==='missed'    ?<XCircle     className="w-4 h-4"     style={{color:C.orange}}/>:
                  <span className="text-sm">❓</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
      {!sub&&(
        <button onClick={submit} disabled={flagged.size===0}
          className="w-full py-3 rounded-xl font-bold text-sm transition-all"
          style={{background:flagged.size>0?`linear-gradient(135deg,${C.gold},${C.orange})`:C.light,color:flagged.size>0?C.navy:'#bbb',cursor:flagged.size>0?'pointer':'not-allowed'}}>
          Review My Flags ({flagged.size} selected) →
        </button>
      )}
    </div>
  );
}

// --- MCQ (Q7 + pattern) ----------------------------------------
function MCQ({q,onFinish}){
  const [sel,setSel]=useState(null);
  const [sub,setSub]=useState(false);
  const [shk,setShk]=useState(null);
  const lockedRef=useRef(false);

  const submit=(optId)=>{
    if(lockedRef.current||sub)return;
    const opt=q.options.find(o=>o.id===optId);
    if(!opt)return;
    lockedRef.current=true;setSel(optId);setSub(true);
    if(!opt.correct){setShk(optId);setTimeout(()=>setShk(null),500);}
    onFinish(opt.correct,opt.feedback,opt.correct?10:0);
  };

  return(
    <div>
      {/* Brochure card */}
      {q.brochure&&(
        <div className="rounded-2xl overflow-hidden border-2 mb-4 shadow-lg" style={{borderColor:rgba(C.green,0.4)}}>
          <div className="px-4 py-3 flex items-center justify-between" style={{background:`linear-gradient(135deg,${C.green},#2d7a50)`}}>
            <div>
              <div className="text-xs font-black text-white">{q.brochure.name}</div>
              <div className="text-[9px] mt-0.5" style={{color:'rgba(255,255,255,0.7)'}}>INVESTMENT PRODUCT</div>
            </div>
            <div className="flex items-center gap-1 px-2 py-1 rounded-full" style={{background:'rgba(255,255,255,0.2)'}}>
              <CheckCircle className="w-3 h-3 text-white"/>
              <span className="text-[9px] font-bold text-white">{q.brochure.badge}</span>
            </div>
          </div>
          <div className="p-4" style={{background:C.greenLight}}>
            <ul className="space-y-1.5">
              {q.brochure.terms.map((t,i)=>(
                <li key={i} className="flex items-start gap-2 text-xs" style={{color:C.dark}}>
                  <span className="w-4 h-4 rounded-full flex-shrink-0 flex items-center justify-center text-[9px] font-black" style={{background:C.green,color:'white',marginTop:'1px'}}>{i+1}</span>
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
      {/* Sister speech bubble */}
      {q.sister&&(
        <div className="flex items-start gap-3 mb-5">
          <div className="w-9 h-9 rounded-full flex items-center justify-center text-lg flex-shrink-0" style={{background:'#f3e8ff',border:'2px solid #c4b5fd'}}>👩</div>
          <div className="rounded-2xl rounded-tl-sm px-4 py-3 max-w-xs" style={{background:'#f3e8ff',border:'1px solid #c4b5fd'}}>
            <div className="text-xs font-bold mb-0.5" style={{color:'#7c3aed'}}>Your sister</div>
            <div className="text-sm font-medium" style={{color:C.dark}}>"{q.sister}"</div>
          </div>
        </div>
      )}
      <div className="space-y-2.5">
        {q.options.map(opt=>{
          const isC=sub&&opt.correct,isW=sub&&!opt.correct&&sel===opt.id;
          return(
            <button key={opt.id} onClick={()=>!sub&&submit(opt.id)}
              disabled={sub}
              className={`w-full text-left p-4 rounded-xl border-2 transition-all text-sm ${shk===opt.id?'shk':''}`}
              style={{background:isC?C.greenLight:isW?C.coralLight:'white',borderColor:isC?C.green:isW?C.coral:'#e5e7eb',color:C.dark,cursor:sub?'default':'pointer'}}>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full border-2 flex-shrink-0 mt-0.5 flex items-center justify-center text-xs font-bold"
                  style={{borderColor:isC?C.green:isW?C.coral:'#d1d5db',background:isC?C.green:isW?C.coral:'transparent',color:isC||isW?'white':'#9ca3af'}}>
                  {opt.id.toUpperCase()}
                </div>
                <span className="flex-1 leading-snug">{opt.text}</span>
                {isC&&<CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5 pop" style={{color:C.green}}/>}
                {isW&&<XCircle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{color:C.coral}}/>}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// --- BUCKET3 CUC (Q2) -----------------------------------------
function Bucket3CUC({q,onFinish}){
  const [pool,setPool]=useState(()=>[...q.items].sort(()=>Math.random()-0.5));
  const [buckets,setBuckets]=useState(()=>Object.fromEntries(q.buckets.map(b=>[b.id,[]])));
  const [held,setHeld]=useState(null);
  const [dragOver,setDragOver]=useState(null);
  const [sub,setSub]=useState(false);
  const [results,setResults]=useState({});
  const lockedRef=useRef(false);

  const placed=Object.values(buckets).reduce((s,a)=>s+a.length,0);
  const allPlaced=placed===q.items.length;

  const move=(item,bId)=>{
    if(sub||!item)return;
    setPool(p=>p.filter(x=>x.id!==item.id));
    setBuckets(prev=>{
      const n={...prev};
      q.buckets.forEach(b=>{n[b.id]=n[b.id].filter(x=>x.id!==item.id);});
      n[bId]=[...n[bId],item];
      return n;
    });
    setHeld(null);setDragOver(null);
  };
  const ret=(item,bId)=>{
    if(sub)return;
    setBuckets(prev=>({...prev,[bId]:prev[bId].filter(x=>x.id!==item.id)}));
    setPool(p=>[...p,item]);
  };

  const submit=()=>{
    if(!allPlaced||sub||lockedRef.current)return;
    lockedRef.current=true;setSub(true);
    const res={};let ok=0;
    q.buckets.forEach(b=>buckets[b.id].forEach(item=>{
      const correct=item.correct===b.id;
      res[item.id]=correct;
      if(correct)ok++;
    }));
    setResults(res);
    const total=q.items.length;
    const fbText=ok===total?q.feedback.perfect:ok>=6?q.feedback.good:ok>=4?q.feedback.mid:q.feedback.low;
    const pts=ok===total?10:ok>=6?7:ok>=4?4:2;
    onFinish(ok>=6,fbText,pts,{ok,total,isUnscored:false});
  };

  return(
    <div>
      <div className="grid grid-cols-3 gap-2 mb-4">
        {q.buckets.map(bk=>(
          <div key={bk.id}
            onDragOver={e=>{e.preventDefault();setDragOver(bk.id);}}
            onDragLeave={()=>setDragOver(null)}
            onDrop={e=>{e.preventDefault();if(held)move(held,bk.id);setDragOver(null);}}
            onClick={()=>{if(held)move(held,bk.id);}}
            className="rounded-xl p-2 min-h-[120px] transition-all border-2"
            style={{background:bk.bg,borderColor:dragOver===bk.id?C.gold:bk.color,borderStyle:buckets[bk.id].length||dragOver===bk.id?'solid':'dashed',transform:dragOver===bk.id?'scale(1.02)':'scale(1)'}}>
            <div className="text-[10px] font-bold text-center mb-1.5" style={{color:bk.color}}>{bk.icon} {bk.label}</div>
            <div className="space-y-1">
              {buckets[bk.id].map(item=>(
                <div key={item.id} onClick={e=>{e.stopPropagation();!sub&&ret(item,bk.id);}}
                  className="p-1.5 rounded-lg text-[10px] font-medium border-2 cursor-pointer leading-snug"
                  style={{background:sub?(results[item.id]?C.greenLight:C.coralLight):'white',borderColor:sub?(results[item.id]?C.green:C.coral):'#e5e7eb',color:C.dark}}>
                  <div className="flex items-start gap-1">
                    {sub&&results[item.id]===true &&<CheckCircle className="w-3 h-3 flex-shrink-0 mt-0.5 pop" style={{color:C.green}}/>}
                    {sub&&results[item.id]===false&&<XCircle className="w-3 h-3 flex-shrink-0 mt-0.5" style={{color:C.coral}}/>}
                    <span className="flex-1 leading-tight">{item.text}</span>
                    {!sub&&<span className="text-[8px] opacity-30 flex-shrink-0">x</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      {/* Mobile tap selection */}
      {held&&!sub&&(
        <div className="flex gap-2 mb-3 su">
          {q.buckets.map(bk=>(
            <button key={bk.id} onClick={()=>move(held,bk.id)} className="flex-1 py-2 rounded-xl text-xs font-bold border-2" style={{borderColor:bk.color,color:bk.color,background:bk.bg}}>
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
              <div key={item.id} draggable onDragStart={e=>{setHeld(item);e.dataTransfer.setData('text/plain',item.id);}}
                onClick={()=>setHeld(h=>h?.id===item.id?null:item)}
                className="p-3 rounded-xl border-2 text-sm font-medium cursor-grab select-none transition-all"
                style={{background:'white',color:C.navy,borderColor:held?.id===item.id?C.gold:'#ddd',boxShadow:held?.id===item.id?`0 0 0 3px ${rgba(C.gold,0.28)}`:'0 1px 4px rgba(0,0,0,0.06)'}}>
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
          Check Answer ({placed}/{q.items.length} placed)
        </button>
      )}
      {sub&&Object.values(results).some(v=>!v)&&(
        <div className="mt-3 p-3 rounded-xl su" style={{background:rgba(C.tealLight,0.5),border:`1px solid ${rgba(C.teal,0.18)}`}}>
          <div className="text-[10px] font-bold mb-2" style={{color:C.teal}}>Correct classification:</div>
          {q.items.filter(item=>!results[item.id]).map((item,i)=>{
            const correctBk=q.buckets.find(b=>b.id===item.correct);
            return(
              <div key={i} className="flex items-center gap-2 py-1 border-b last:border-0 text-[10px]" style={{borderColor:rgba(C.teal,0.1)}}>
                <XCircle className="w-3 h-3 flex-shrink-0" style={{color:C.coral}}/>
                <span className="flex-1" style={{color:C.dark}}>{item.text}</span>
                <span className="px-1.5 py-0.5 rounded-full font-bold text-[9px]" style={{background:correctBk?.bg,color:correctBk?.color}}>
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

// --- FIVE Q CHECKLIST (Q3) ------------------------------------
function FiveQChecklist({q,onFinish}){
  const [answers,setAnswers]=useState(Array(q.rows.length).fill(null));
  const [sub,setSub]=useState(false);
  const [results,setResults]=useState(null);
  const [flashIdx,setFlashIdx]=useState(-1);
  const [showVerdict,setShowVerdict]=useState(false);
  const lockedRef=useRef(false);

  const toggle=(i,val)=>{if(!sub)setAnswers(a=>{const n=[...a];n[i]=val;return n;});};
  const allAnswered=answers.every(a=>a!==null);

  const submit=()=>{
    if(!allAnswered||sub||lockedRef.current)return;
    lockedRef.current=true;setSub(true);
    const res=answers.map((a,i)=>a===q.rows[i].answer);
    setResults(res);
    res.forEach((_,i)=>setTimeout(()=>setFlashIdx(i),i*320));
    setTimeout(()=>setShowVerdict(true),res.length*320+300);
    const ok=res.filter(Boolean).length;
    const fbText=ok===5?q.feedback.perfect:ok>=3?q.feedback.good:q.feedback.low;
    setTimeout(()=>onFinish(ok>=4,fbText,ok===5?10:ok>=3?6:ok*2,{ok,total:5,isUnscored:false}),res.length*320+600);
  };

  return(
    <div>
      <div className="rounded-2xl overflow-hidden border-2 mb-5" style={{borderColor:rgba(C.gold,0.35)}}>
        <div className="px-4 py-2.5 flex items-center gap-2" style={{background:`linear-gradient(135deg,${C.navy},#2a3f6a)`}}>
          <span className="text-xl">{q.product.icon}</span>
          <div>
            <div className="text-xs font-black text-white">{q.product.name}</div>
            <div className="text-[9px]" style={{color:rgba(C.gold,0.8)}}>Apply the Five Questions</div>
          </div>
          {showVerdict&&(
            <div className="ml-auto px-2 py-1 rounded-lg su" style={{background:rgba(C.coral,0.25)}}>
              <span className="text-[9px] font-black" style={{color:C.coral}}>{q.verdictText}</span>
            </div>
          )}
        </div>
        <div className="p-3 bg-white">
          <ul className="space-y-1">
            {q.product.terms.map((t,i)=>(
              <li key={i} className="flex items-start gap-1.5 text-xs" style={{color:C.dark}}>
                <span className="text-[10px] font-bold flex-shrink-0 mt-0.5" style={{color:C.gold}}>•</span>{t}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="space-y-2 mb-4">
        {q.rows.map((row,i)=>{
          const ans=answers[i];
          const res=results?results[i]:null;
          return(
            <div key={i} className="rounded-xl border-2 overflow-hidden transition-all"
              style={{borderColor:res===true?C.green:res===false?C.coral:ans?rgba(C.navy,0.2):'#e5e7eb',background:res===true?rgba(C.greenLight,0.6):res===false?rgba(C.coralLight,0.6):'white',transition:'all 0.3s ease'}}>
              <div className="flex items-center gap-2 p-2.5">
                <div className="flex-1">
                  <div className="text-xs font-medium leading-snug" style={{color:C.dark}}>{row.q}</div>
                  {res!==null&&<div className="text-[9px] mt-0.5 fi" style={{color:res?C.green:C.coral}}>{row.why}</div>}
                </div>
                {!sub?(
                  <div className="flex gap-1.5 flex-shrink-0">
                    {['yes','no'].map(val=>(
                      <button key={val} onClick={()=>toggle(i,val)}
                        className="px-3 py-1.5 rounded-lg text-xs font-bold border-2 transition-all"
                        style={{background:ans===val?(val==='yes'?C.green:C.coral):'transparent',borderColor:val==='yes'?C.green:C.coral,color:ans===val?'white':(val==='yes'?C.green:C.coral)}}>
                        {val==='yes'?'YES':'NO'}
                      </button>
                    ))}
                  </div>
                ):(
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-full" style={{background:row.answer==='yes'?C.greenLight:C.coralLight,color:row.answer==='yes'?C.green:C.coral}}>
                      {row.answer.toUpperCase()}
                    </span>
                    {res===true&&<CheckCircle className="w-4 h-4 pop" style={{color:C.green}}/>}
                    {res===false&&<XCircle className="w-4 h-4" style={{color:C.coral}}/>}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      {!sub&&(
        <>
          <button onClick={submit} disabled={!allAnswered}
            className="w-full py-3 rounded-xl font-bold text-sm transition-all"
            style={{background:allAnswered?`linear-gradient(135deg,${C.navy},${C.teal})`:C.light,color:allAnswered?'white':'#bbb',cursor:allAnswered?'pointer':'not-allowed'}}>
            Check All Five Answers →
          </button>
          {!allAnswered&&<p className="text-center text-xs mt-2" style={{color:C.mid}}>{answers.filter(a=>a).length}/5 answered</p>}
        </>
      )}
    </div>
  );
}

// --- PIE CHART BUILDER (Q4) ------------------------------------
function PieChartBuilder({q,onFinish}){
  const [pool,setPool]=useState(()=>[...q.items].sort(()=>Math.random()-0.5));
  const [buckets,setBuckets]=useState(()=>Object.fromEntries(q.buckets.map(b=>[b.id,[]])));
  const [held,setHeld]=useState(null);
  const [dragOver,setDragOver]=useState(null);
  const [sub,setSub]=useState(false);
  const [results,setResults]=useState({});
  const [showOverlay,setShowOverlay]=useState(false);
  const lockedRef=useRef(false);

  const placed=Object.values(buckets).reduce((s,a)=>s+a.length,0);
  const allPlaced=placed===q.items.length;

  const move=(item,bId)=>{
    if(sub||!item)return;
    setPool(p=>p.filter(x=>x.id!==item.id));
    setBuckets(prev=>{
      const n={...prev};
      q.buckets.forEach(b=>{n[b.id]=n[b.id].filter(x=>x.id!==item.id);});
      n[bId]=[...n[bId],item];
      return n;
    });
    setHeld(null);setDragOver(null);
  };
  const ret=(item,bId)=>{
    if(sub)return;
    setBuckets(prev=>({...prev,[bId]:prev[bId].filter(x=>x.id!==item.id)}));
    setPool(p=>[...p,item]);
  };

  const calcPieWeights=()=>{
    let compliantW=0,uncertainW=0,conventionalW=0;
    q.items.forEach(item=>{
      const inBucket=q.buckets.find(b=>buckets[b.id].some(x=>x.id===item.id));
      if(inBucket){
        if(inBucket.id==='compliant')compliantW+=item.pieWeight;
        else if(inBucket.id==='uncertain')uncertainW+=item.pieWeight;
        else conventionalW+=item.pieWeight;
      }
    });
    return{compliantW,uncertainW,conventionalW};
  };
  const{compliantW,uncertainW,conventionalW}=calcPieWeights();

  const submit=()=>{
    if(!allPlaced||sub||lockedRef.current)return;
    lockedRef.current=true;setSub(true);
    const res={};let ok=0;
    q.buckets.forEach(b=>buckets[b.id].forEach(item=>{
      const correct=item.correct===b.id;
      res[item.id]=correct;
      if(correct)ok++;
    }));
    setResults(res);
    setTimeout(()=>setShowOverlay(true),600);
    const total=q.items.length;
    const fbText=ok===total?q.feedback.perfect:ok>=6?q.feedback.good:q.feedback.low;
    const pts=ok===total?10:ok>=6?7:ok>=4?4:2;
    setTimeout(()=>onFinish(ok>=6,fbText,pts,{ok,total,isUnscored:false}),800);
  };

  return(
    <div>
      {/* Pie + buckets top section */}
      <div className="flex gap-3 mb-4">
        {/* Live pie */}
        <div className="flex-shrink-0 flex flex-col items-center gap-2">
          <div className="rounded-2xl p-2 border-2" style={{borderColor:rgba(C.navy,0.1),background:'white'}}>
            <LivePieChart compliantW={compliantW} uncertainW={uncertainW} conventionalW={conventionalW} submitted={showOverlay}/>
          </div>
          <div className="text-[9px] text-center" style={{color:C.mid}}>Live map</div>
        </div>
        {/* Bucket columns */}
        <div className="flex-1 flex flex-col gap-2">
          {q.buckets.map(bk=>(
            <div key={bk.id}
              onDragOver={e=>{e.preventDefault();setDragOver(bk.id);}}
              onDragLeave={()=>setDragOver(null)}
              onDrop={e=>{e.preventDefault();if(held)move(held,bk.id);setDragOver(null);}}
              onClick={()=>{if(held)move(held,bk.id);}}
              className="rounded-xl p-2 min-h-[52px] transition-all border-2 flex-1"
              style={{background:bk.bg,borderColor:dragOver===bk.id?C.gold:bk.color,borderStyle:buckets[bk.id].length||dragOver===bk.id?'solid':'dashed',transform:dragOver===bk.id?'scale(1.01)':'scale(1)'}}>
              <div className="text-[10px] font-bold mb-1" style={{color:bk.color}}>{bk.icon} {bk.label} <span style={{color:rgba(bk.color,0.6)}}>{buckets[bk.id].length>0&&`(${buckets[bk.id].length})`}</span></div>
              <div className="flex flex-wrap gap-1">
                {buckets[bk.id].map(item=>(
                  <div key={item.id} onClick={e=>{e.stopPropagation();!sub&&ret(item,bk.id);}}
                    className="px-1.5 py-0.5 rounded-lg text-[9px] font-medium cursor-pointer border"
                    style={{background:sub?(results[item.id]?C.greenLight:C.coralLight):'rgba(255,255,255,0.7)',borderColor:sub?(results[item.id]?C.green:C.coral):rgba(bk.color,0.3),color:C.dark}}>
                    {item.text.split(' ').slice(0,2).join(' ')}
                    {sub&&results[item.id]===true&&' ✓'}
                    {sub&&results[item.id]===false&&' ✗'}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Mobile selection hint */}
      {held&&!sub&&(
        <div className="flex gap-2 mb-3 su">
          {q.buckets.map(bk=>(
            <button key={bk.id} onClick={()=>move(held,bk.id)} className="flex-1 py-2 rounded-xl text-xs font-bold border-2" style={{borderColor:bk.color,color:bk.color,background:bk.bg}}>
              {bk.icon} {bk.label}
            </button>
          ))}
        </div>
      )}
      {/* Card pool */}
      {pool.length>0&&(
        <div className="mb-4">
          <div className="text-xs font-bold mb-2 flex items-center gap-1.5" style={{color:C.mid}}>
            <GripVertical className="w-3 h-3"/> Drag or tap a card, then tap a bucket
          </div>
          <div className="grid grid-cols-2 gap-2">
            {pool.map(item=>(
              <div key={item.id} draggable onDragStart={e=>{setHeld(item);e.dataTransfer.setData('text/plain',item.id);}}
                onClick={()=>setHeld(h=>h?.id===item.id?null:item)}
                className="p-3 rounded-xl border-2 cursor-grab select-none transition-all"
                style={{background:'white',borderColor:held?.id===item.id?C.gold:'#ddd',boxShadow:held?.id===item.id?`0 0 0 3px ${rgba(C.gold,0.28)}`:'0 1px 4px rgba(0,0,0,0.06)'}}>
                <div className="text-xs font-bold" style={{color:C.navy}}>{item.text}</div>
                <div className="text-[9px] mt-0.5" style={{color:C.mid}}>{item.detail}</div>
              </div>
            ))}
          </div>
        </div>
      )}
      {!sub&&(
        <button onClick={submit} disabled={!allPlaced}
          className="w-full py-3 rounded-xl font-bold text-sm"
          style={{background:allPlaced?`linear-gradient(135deg,${C.gold},${C.orange})`:C.light,color:allPlaced?C.navy:'#bbb',cursor:allPlaced?'pointer':'not-allowed'}}>
          Build the Map ({placed}/8 placed) →
        </button>
      )}
    </div>
  );
}

// --- PRIORITY RANKING (Q5) ------------------------------------
function PriorityRanking({q,onFinish}){
  const shuffleOnce=useRef(null);
  if(!shuffleOnce.current){shuffleOnce.current=[...q.items].sort(()=>Math.random()-0.5);}
  const [order,setOrder]=useState(shuffleOnce.current);
  const [sub,setSub]=useState(false);
  const [results,setResults]=useState(null);
  const [dragging,setDragging]=useState(null);
  const [dragOver,setDragOver]=useState(null);
  const lockedRef=useRef(false);

  const moveUp=(idx)=>{if(idx===0||sub)return;const n=[...order];[n[idx-1],n[idx]]=[n[idx],n[idx-1]];setOrder(n);};
  const moveDown=(idx)=>{if(idx===order.length-1||sub)return;const n=[...order];[n[idx],n[idx+1]]=[n[idx+1],n[idx]];setOrder(n);};

  const onDragStart=(e,idx)=>{e.dataTransfer.effectAllowed='move';setDragging(idx);};
  const onDragOver=(e,idx)=>{e.preventDefault();setDragOver(idx);};
  const onDrop=(e,idx)=>{
    e.preventDefault();
    if(dragging===null||dragging===idx)return;
    const n=[...order];const[moved]=n.splice(dragging,1);n.splice(idx,0,moved);
    setOrder(n);setDragging(null);setDragOver(null);
  };
  const onDragEnd=()=>{setDragging(null);setDragOver(null);};

  const submit=()=>{
    if(sub||lockedRef.current)return;
    lockedRef.current=true;setSub(true);
    const res=order.map((item,i)=>item.pos===i+1);
    setResults(res);
    const ok=res.filter(Boolean).length;
    const fbText=ok===4?q.feedback.perfect:ok>=2?q.feedback.good:q.feedback.low;
    onFinish(ok>=3,fbText,ok===4?10:ok>=2?6:2,{ok,total:4,isUnscored:false});
  };

  return(
    <div>
      <p className="text-xs mb-3" style={{color:C.mid}}>{sub?'Results shown. Key: prioritise by actionability, not severity.':'Drag or use the arrows to rank from "address first" (top) to "address last" (bottom).'}</p>
      <div className="space-y-2 mb-4">
        {order.map((item,i)=>{
          const isCorrect=results?results[i]:null;
          const isDrag=dragging===i,isDragTarget=dragOver===i&&dragging!==i;
          return(
            <div key={item.id}
              draggable={!sub}
              onDragStart={e=>onDragStart(e,i)}
              onDragOver={e=>onDragOver(e,i)}
              onDrop={e=>onDrop(e,i)}
              onDragEnd={onDragEnd}
              className="flex items-center gap-2 rounded-xl border-2 transition-all"
              style={{background:isCorrect===true?C.greenLight:isCorrect===false?C.coralLight:isDragTarget?rgba(C.gold,0.1):'white',borderColor:isCorrect===true?C.green:isCorrect===false?C.coral:isDrag?C.gold:isDragTarget?rgba(C.gold,0.5):'#e5e7eb',opacity:isDrag?0.5:1,cursor:sub?'default':'grab',boxShadow:isDrag?`0 8px 24px ${rgba(C.navy,0.15)}`:'none'}}>
              <div className="p-3 flex-shrink-0" style={{color:C.mid}}><GripVertical className="w-4 h-4"/></div>
              <div className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-[10px] font-black"
                style={{background:isCorrect===true?C.green:isCorrect===false?C.coral:rgba(C.navy,0.08),color:isCorrect!==null?'white':C.navy}}>
                {i+1}
              </div>
              <div className="flex-1 py-3 pr-2">
                <div className="text-xs font-bold" style={{color:C.dark}}>{item.text}</div>
                <div className="text-[9px]" style={{color:C.mid}}>{item.detail}</div>
                {sub&&<div className="text-[9px] font-bold mt-0.5" style={{color:item.color}}>{item.tag}</div>}
              </div>
              {sub&&isCorrect===false&&<div className="text-[9px] pr-2 text-center flex-shrink-0" style={{color:C.mid}}>should be<br/><span className="font-black" style={{color:C.teal}}>#{item.pos}</span></div>}
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
        <button onClick={submit} className="w-full py-3 rounded-xl font-bold text-sm" style={{background:`linear-gradient(135deg,${C.teal},${C.navy})`,color:'white'}}>
          Submit My Priority Order →
        </button>
      )}
    </div>
  );
}

// --- CONFIDENCE SLIDER (Q6) -----------------------------------
function ConfidenceSlider({q,onFinish}){
  const [val,setVal]=useState(3);
  const [sub,setSub]=useState(false);
  const lockedRef=useRef(false);
  const pos=q.positions.find(p=>p.val===val)||q.positions[2];

  const submit=()=>{
    if(lockedRef.current||sub)return;
    lockedRef.current=true;setSub(true);
    onFinish(true,pos.feedback,0);
  };

  return(
    <div>
      {/* Slider */}
      <div className="rounded-2xl p-6 mb-4 border-2" style={{background:rgba(C.tealLight,0.4),borderColor:rgba(C.teal,0.2)}}>
        <div className="text-center mb-6">
          <div className="text-2xl mb-1">{['😔','😟','😐','🙂','😊'][val-1]}</div>
          <div className="text-base font-bold" style={{color:C.navy,fontFamily:'Georgia,serif'}}>{pos.label}</div>
          <div className="text-sm italic" style={{color:C.mid}}>{pos.sublabel}</div>
        </div>
        <input type="range" min="1" max="5" value={val}
          onChange={e=>!sub&&setVal(Number(e.target.value))}
          disabled={sub}
          className="w-full mb-4"
          style={{accentColor:C.gold,height:'6px'}}/>
        <div className="flex justify-between">
          {q.positions.map((p,i)=>(
            <button key={i} onClick={()=>!sub&&setVal(p.val)}
              className="flex flex-col items-center gap-0.5 cursor-pointer transition-all"
              style={{opacity:val===p.val?1:0.45}}>
              <div className="w-2.5 h-2.5 rounded-full transition-all" style={{background:val===p.val?C.gold:'#d1d5db',transform:val===p.val?'scale(1.4)':'scale(1)'}}/>
              <span className="text-[8px] font-bold text-center leading-tight max-w-[44px]" style={{color:val===p.val?C.gold:C.mid}}>{p.label}</span>
            </button>
          ))}
        </div>
      </div>
      {!sub&&(
        <button onClick={submit} className="w-full py-3 rounded-xl font-bold text-sm" style={{background:`linear-gradient(135deg,${C.navy},${C.teal})`,color:'white'}}>
          Continue →
        </button>
      )}
    </div>
  );
}

// ===============================================================
// SECTION CARD
// ===============================================================
function SectionCard({section,onNext}){
  return(
    <div className="rounded-2xl p-6 border border-white/40 shadow-lg" style={CARD}>
      <div className="flex items-center gap-2 mb-4">
        <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-black" style={{background:`linear-gradient(135deg,${C.gold},${C.orange})`,color:'white'}}>{section.id}</div>
        <h2 className="text-base font-bold" style={{color:C.navy,fontFamily:'Georgia,serif'}}>{section.title}</h2>
      </div>
      <div className="space-y-3 mb-5">
        {section.body.map((para,i)=>(
          <p key={i} className="text-sm leading-relaxed" style={{color:C.dark}}>{md(para)}</p>
        ))}
      </div>
      {section.visual==='threeCat'&&<ThreeCatTable/>}
      {section.visual==='insuranceFiveQ'&&<InsuranceFiveQTable/>}
      {section.visual==='yusufMap'&&<YusufMapTable/>}
      {section.visual==='prioritisation'&&<PrioritisationFramework/>}
      {section.visual==='personalAudit'&&<PersonalAuditCard/>}
      {section.visual==='m1takeaway'&&<M1TakeawayCard/>}
      {section.callout&&(
        <div className="rounded-xl p-4 mb-5 border-l-4" style={{background:section.callout.bg,borderColor:section.callout.color}}>
          <div className="text-xs font-bold mb-1.5" style={{color:section.callout.color}}>{section.callout.icon} {section.callout.title}</div>
          <p className="text-sm leading-relaxed" style={{color:C.dark}}>{section.callout.text}</p>
        </div>
      )}
      <button onClick={onNext} className="w-full py-3 rounded-xl font-bold text-sm" style={{background:`linear-gradient(135deg,${C.navy},${C.teal})`,color:'white'}}>
        Continue <ArrowRight className="w-4 h-4 inline ml-1 -mt-0.5"/>
      </button>
    </div>
  );
}

// ===============================================================
// QUESTION CARD
// ===============================================================
function QuestionCard({q,qIdx,totalQ,score,onAnswer,onNext}){
  const [done,setDone]=useState(false);
  const [correct,setCorrect]=useState(false);
  const [fbText,setFbText]=useState('');
  const [fbMeta,setFbMeta]=useState(null);

  const finish=useCallback((isCorrect,text,pts,meta)=>{
    setDone(true);setCorrect(isCorrect);setFbText(text);
    if(meta)setFbMeta(meta);
    onAnswer(isCorrect,pts,{scored:q.scored,isCapstone:q.isCapstone,isModuleCapstone:q.isModuleCapstone});
  },[onAnswer,q.scored,q.isCapstone,q.isModuleCapstone]);

  const isReflection=q.type==='confidence-slider';

  return(
    <div className="rounded-2xl p-6 border border-white/40 shadow-lg" style={CARD}>
      <ModeBadge mode={q.mode} type={q.typeLabel} unscored={q.scored===false}/>
      <p className="text-base font-semibold leading-snug mb-5" style={{color:C.navy}}>{q.question}</p>

      {q.type==='bank-statement'  &&<BankStatement       q={q} onFinish={finish}/>}
      {q.type==='mcq'             &&<MCQ                 q={q} onFinish={finish}/>}
      {q.type==='bucket3cuc'      &&<Bucket3CUC           q={q} onFinish={finish}/>}
      {q.type==='fiveq-checklist' &&<FiveQChecklist       q={q} onFinish={finish}/>}
      {q.type==='pie-chart-builder'&&<PieChartBuilder     q={q} onFinish={finish}/>}
      {q.type==='priority-ranking'&&<PriorityRanking      q={q} onFinish={finish}/>}
      {q.type==='confidence-slider'&&<ConfidenceSlider    q={q} onFinish={finish}/>}

      {done&&fbText&&<FeedbackPanel correct={correct||isReflection} text={fbText} bridge={q.bridge} meta={fbMeta} reflection={isReflection} discovery={q.type==='bank-statement'}/>}

      {done&&(
        <button onClick={onNext} className="w-full mt-4 py-3 rounded-xl font-bold text-sm su"
          style={{background:`linear-gradient(135deg,${C.green},${C.teal})`,color:'white'}}>
          Next <ArrowRight className="w-4 h-4 inline ml-1 -mt-0.5"/>
        </button>
      )}
    </div>
  );
}

// ===============================================================
// MAIN APP
// ===============================================================
export default function DEANY_M1L5({ onBack, onHome, savedProgress }){
  const [screen,      setScreen]      = useState(savedProgress ? 'lesson' : 'intro');
  const [flowIdx,     setFlowIdx]     = useState(savedProgress?.flowIdx ?? 0);
  const [score,       setScore]       = useState(savedProgress?.score ?? 0);
  const [results,     setResults]     = useState(savedProgress?.results ?? []);
  const [streak,      setStreak]      = useState(savedProgress?.streak ?? 0);
  const [streakFlash, setStreakFlash] = useState(false);
  const [moduleToast, setModuleToast] = useState(false);
  const [confetti,    setConfetti]    = useState(false);

  const qDoneNum=FLOW.slice(0,flowIdx).filter(f=>f.type==='question'&&f.data.scored!==false).length;
  const current=FLOW[flowIdx];

  const handleAnswer=useCallback((correct,pts,flags={})=>{
    const isScored=flags.scored!==false;
    if(isScored)setResults(r=>{
      const newResults=[...r,{correct}];
      try{localStorage.setItem('deany-progress-lesson-1-5',JSON.stringify({flowIdx:flowIdx+1,score:correct?score+pts:score,streak:correct?streak+1:0,results:newResults}));}catch(e){}
      return newResults;
    });
    if(correct&&isScored){
      setScore(s=>s+pts);
      setStreak(s=>{
        const n=s+1;
        if(n>=3){setStreakFlash(true);setTimeout(()=>setStreakFlash(false),2200);}
        return n;
      });
      if(flags.isModuleCapstone){
        setTimeout(()=>{setModuleToast(true);setTimeout(()=>setModuleToast(false),3500);},400);
      }
    } else if(isScored){
      setStreak(0);
    }
  },[flowIdx,score,streak]);

  const advance=useCallback(()=>{
    window.scrollTo({top:0,behavior:'smooth'});
    if(flowIdx<FLOW.length-1){setFlowIdx(i=>i+1);}
    else{setScreen('complete');setConfetti(true);setTimeout(()=>setConfetti(false),6000);try{localStorage.removeItem('deany-progress-lesson-1-5');}catch(e){}}
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

  // ── INTRO ────────────────────────────────────────────────────
  if(screen==='intro') return(
    <div className="min-h-screen relative overflow-hidden" style={PAGE_BG}>
      <IslamicBg/><style>{STYLES}</style>
      <div className="relative z-10 max-w-2xl mx-auto px-4 py-10">
        <LessonNav />
        <div className="text-center mb-8 su">
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-bold mb-3" style={{background:rgba(C.gold,0.14),color:C.gold}}>MODULE 1 CAPSTONE · LESSON 5</span>
          <h1 className="text-3xl font-bold mb-2" style={{color:C.navy,fontFamily:'Georgia,serif'}}>Your Money Right Now</h1>
          <p className="text-sm" style={{color:C.mid}}>Not guilt. Awareness. The toolkit meets real life.</p>
        </div>
        <div className="rounded-2xl p-6 border border-white/40 shadow-lg su" style={CARD}>
          <div className="rounded-xl p-4 mb-5 border" style={{background:rgba(C.goldLight,0.7),borderColor:rgba(C.gold,0.2)}}>
            <div className="text-xs font-bold mb-1" style={{color:C.gold}}>🗝️ You've Built the Complete Toolkit</div>
            <p className="text-xs leading-relaxed" style={{color:C.dark}}>
              Islam is pro-wealth (L1). Wealth is a trust (L2). Three things are never allowed: riba, gharar, maysir (L3). Labels lie - check the substance using the Five Questions (L4). Now it is time to use all of that on the only case study that truly matters: <strong style={{color:C.navy}}>your own money.</strong>
            </p>
          </div>
          <div className="flex items-start gap-3 mb-5">
            <Mascot/>
            <div className="rounded-xl rounded-tl-sm p-4 border border-gray-100 flex-1" style={{background:'rgba(255,255,255,0.85)'}}>
              <p className="text-sm" style={{color:C.dark}}>
                <strong style={{color:C.teal}}>Fulus:</strong> We start with Yusuf's bank statement - you flag what looks concerning before I teach you the system. No wrong answers. This is awareness, not a test. 🔍
              </p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3 mb-5">
            {[
              {icon:'🗂️',term:'3 Categories',desc:'Compliant / Uncertain / Conventional'},
              {icon:'📊',term:'Live Pie Chart',desc:'Build Yusuf\'s financial map'},
              {icon:'📋',term:'Personal Audit',desc:'Apply everything to you'},
            ].map((t,i)=>(
              <div key={i} className="text-center p-3 rounded-xl border" style={{background:rgba(C.tealLight,0.4),borderColor:rgba(C.teal,0.2)}}>
                <div className="text-xl mb-1">{t.icon}</div>
                <div className="text-xs font-bold" style={{color:C.navy}}>{t.term}</div>
                <div className="text-[10px]" style={{color:C.mid}}>{t.desc}</div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-3 gap-3 mb-5">
            {[
              {icon:<Clock className="w-4 h-4"/>,label:'18 min',sub:'Duration'},
              {icon:<Target className="w-4 h-4"/>,label:'7 Qs',sub:'Questions'},
              {icon:<BookOpen className="w-4 h-4"/>,label:'L2 to L4',sub:'Difficulty'},
            ].map((m,i)=>(
              <div key={i} className="text-center p-3 rounded-xl border" style={{background:rgba(C.tealLight,0.5),borderColor:rgba(C.teal,0.12)}}>
                <div className="flex justify-center mb-1" style={{color:C.teal}}>{m.icon}</div>
                <div className="text-sm font-bold" style={{color:C.navy}}>{m.label}</div>
                <div className="text-[10px]" style={{color:C.mid}}>{m.sub}</div>
              </div>
            ))}
          </div>
          <div className="rounded-xl p-3 mb-5 border-l-4" style={{background:rgba(C.tealLight,0.5),borderColor:C.teal}}>
            <div className="text-xs font-bold mb-1" style={{color:C.teal}}>⚠️ Tone note</div>
            <p className="text-xs leading-relaxed" style={{color:C.dark}}>This lesson is NOT about guilt. Every piece of feedback is designed to inform, not shame. You are a custodian - awareness is your responsibility. Change is yours to decide.</p>
          </div>
          <div className="rounded-lg p-3 mb-5" style={{background:C.goldLight,border:`1px solid ${rgba(C.gold,0.28)}`}}>
            <div className="text-xs font-bold mb-1" style={{color:C.gold}}>🎯 Learning Objective</div>
            <p className="text-xs leading-relaxed" style={{color:C.dark}}>Classify your own financial products as compliant, uncertain, or conventional - apply the Five Questions to real finances - create a priority list - and understand that awareness is the first step, not overnight change.</p>
          </div>
          <button onClick={()=>setScreen('lesson')} className="w-full py-3.5 rounded-xl font-bold text-sm" style={{background:`linear-gradient(135deg,${C.navy},${C.teal})`,color:'white'}}>
            Begin Lesson <ArrowRight className="w-4 h-4 inline ml-1 -mt-0.5"/>
          </button>
        </div>
      </div>
    </div>
  );

  // ── MODULE COMPLETE ─────────────────────────────────────────
  if(screen==='complete'){
    const total=SCORED_COUNT,correct=results.filter(r=>r.correct).length;
    const pct=Math.round((correct/total)*100);
    const ring=pct>=80?C.green:pct>=60?C.gold:C.teal;
    const circ=2*Math.PI*42,offset=circ-(pct/100)*circ;
    return(
      <div className="min-h-screen relative overflow-hidden" style={PAGE_BG}>
        <IslamicBg/><style>{STYLES}</style>
        {confetti&&<Confetti/>}
        <div className="relative z-10 max-w-2xl mx-auto px-4 py-10">
          <LessonNav />
          <div className="rounded-2xl p-8 border border-white/40 shadow-xl su" style={CARD}>
            {/* Module complete header */}
            <div className="text-center mb-6">
              <div className="inline-block px-4 py-1.5 rounded-full text-xs font-bold mb-4" style={{background:rgba(C.gold,0.18),color:C.gold,border:`1px solid ${rgba(C.gold,0.3)}`}}>
                MODULE 1 COMPLETE
              </div>
              <h1 className="text-2xl font-bold mb-1" style={{color:C.navy,fontFamily:'Georgia,serif'}}>Foundations Built</h1>
              <p className="text-sm mb-6" style={{color:C.mid}}>Why This Matters - all five lessons done.</p>
              {/* Amānah Guardian Badge */}
              <div className="flex flex-col items-center mb-6 badge-pop">
                <div className="w-28 h-28 rounded-full flex flex-col items-center justify-center border-4 shadow-lg" style={{borderColor:C.gold,background:`linear-gradient(135deg,${C.goldLight},rgba(255,255,255,0.9))`,boxShadow:`0 0 32px ${rgba(C.gold,0.4)}, 0 0 0 8px ${rgba(C.gold,0.12)}`}}>
                  <div className="text-3xl mb-0.5">⭐</div>
                  <div className="text-[9px] font-black tracking-wide text-center leading-tight px-2" style={{color:C.navy}}>AMANAH<br/>GUARDIAN</div>
                </div>
                <div className="text-xs font-bold mt-2" style={{color:C.gold}}>Your first badge</div>
                <div className="text-[10px]" style={{color:C.mid}}>Module 1: Why This Matters - Completed</div>
              </div>
            </div>
            {/* Score ring */}
            <div className="flex flex-col items-center mb-6">
              <div className="relative inline-block mb-3">
                <svg width="108" height="108" className="-rotate-90">
                  <circle cx="54" cy="54" r="42" fill="none" stroke={C.light} strokeWidth="7"/>
                  <circle cx="54" cy="54" r="42" fill="none" stroke={ring} strokeWidth="7" strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={offset} style={{transition:'stroke-dashoffset 1.8s ease-out'}}/>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-bold" style={{color:C.navy,fontFamily:'Georgia,serif'}}>{correct}/{total}</span>
                  <span className="text-[9px]" style={{color:C.mid}}>lesson score</span>
                </div>
              </div>
            </div>
            {/* Stats grid */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              {[{label:'Score',value:`${score} pts`,color:C.green,bg:C.greenLight},{label:'Accuracy',value:`${pct}%`,color:C.teal,bg:C.tealLight},{label:'Level Reached',value:'L4 SYNTHESIS',color:C.purple,bg:rgba(C.purple,0.1)}].map((s,i)=>(
                <div key={i} className="p-3 rounded-xl border text-center" style={{background:s.bg,borderColor:rgba(s.color,0.18)}}>
                  <div className="text-sm font-bold" style={{color:s.color}}>{s.value}</div>
                  <div className="text-[10px]" style={{color:C.mid}}>{s.label}</div>
                </div>
              ))}
            </div>
            {/* Module concepts mastered */}
            <div className="text-left p-4 rounded-xl mb-5" style={{background:rgba(C.greenLight,0.7),border:`1px solid ${rgba(C.green,0.18)}`}}>
              <div className="text-xs font-bold mb-3" style={{color:C.green}}>✅ Module 1 - Concepts Mastered</div>
              {[
                'L1: Islam is pro-wealth and pro-commerce. Financial engagement is worship.',
                'L2: Wealth is amanah - a trust. You are a custodian, not an owner.',
                'L3: Three prohibitions: riba, gharar, maysir - and how to detect them.',
                'L4: Substance over labels. The Five Questions to evaluate any product.',
                'L5: Personal audit: compliant / uncertain / conventional classification.',
                'L5: Prioritisation by actionability - start with easiest wins.',
                'L5: Advised someone else using the full Module 1 framework.',
              ].map((c,i)=>(
                <div key={i} className="flex items-start gap-2 py-0.5">
                  <CheckCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{color:C.green}}/>
                  <span className="text-xs" style={{color:C.dark}}>{c}</span>
                </div>
              ))}
            </div>
            {/* Module 2 preview */}
            <div className="p-4 rounded-xl mb-6" style={{background:C.goldLight,border:`1px solid ${rgba(C.gold,0.25)}`}}>
              <div className="text-xs font-bold mb-1" style={{color:C.gold}}>📍 Up Next: Module 2 - Trade Essentials</div>
              <p className="text-xs leading-relaxed" style={{color:C.dark}}>
                You know what is prohibited. Now learn what is PERMITTED. How do valid trades work? What makes a sale legitimate? This is where you start building alternatives to the conventional products in your audit.
              </p>
            </div>
            {/* CTAs */}
            <div className="space-y-3">
              <button className="w-full py-3.5 rounded-xl font-bold text-sm pls" style={{background:`linear-gradient(135deg,${C.gold},${C.orange})`,color:C.navy}}>
                Continue to Module 2 <ArrowRight className="w-4 h-4 inline ml-1 -mt-0.5"/>
              </button>
              <button className="w-full py-3 rounded-xl font-bold text-sm" style={{background:'transparent',color:C.navy,border:`2px solid ${rgba(C.navy,0.25)}`}}>
                Review Module 1
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── LESSON ───────────────────────────────────────────────────
  return(
    <div className="min-h-screen relative overflow-hidden" style={PAGE_BG}>
      <IslamicBg/><style>{STYLES}</style>

      {/* Streak flash */}
      {streakFlash&&(
        <div className="fixed top-4 left-1/2 z-50 flex items-center gap-2 px-5 py-3 rounded-full shadow-xl su"
          style={{background:C.navy,color:C.gold,border:`2px solid ${rgba(C.gold,0.4)}`,transform:'translateX(-50%)'}}>
          <Flame className="w-4 h-4" style={{color:C.coral}}/> {streak} in a row 🔥
        </div>
      )}
      {/* Module capstone toast */}
      {moduleToast&&(
        <div className="fixed top-4 left-1/2 z-50 su" style={{transform:'translateX(-50%)'}}>
          <div className="flex flex-col items-center gap-1 px-6 py-4 rounded-2xl shadow-2xl" style={{background:C.navy,border:`2px solid ${rgba(C.gold,0.5)}`}}>
            <span className="text-lg">🏆</span>
            <span className="text-xs font-black" style={{color:C.gold}}>MODULE 1 COMPLETE</span>
            <span className="text-[10px]" style={{color:rgba(C.gold,0.75)}}>Foundations Built - Amanah Guardian earned</span>
          </div>
        </div>
      )}

      <div className="relative z-10 max-w-2xl mx-auto px-4 py-8">
        <LessonNav />
        <ProgressBar qNum={qDoneNum} totalQ={SCORED_COUNT} score={score}/>
        {current.type==='section'&&(
          <SectionCard key={`sec-${current.data.id}`} section={current.data} onNext={advance}/>
        )}
        {current.type==='question'&&(
          <QuestionCard
            key={`q-${current.data.id}`}
            q={current.data}
            qIdx={qDoneNum}
            totalQ={SCORED_COUNT}
            score={score}
            onAnswer={handleAnswer}
            onNext={advance}
          />
        )}
      </div>
    </div>
  );
}
