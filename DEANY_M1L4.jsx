import React, { useState, useRef, useCallback, useEffect } from 'react';
import { CheckCircle, XCircle, ArrowRight, Flame, Star, BookOpen, Clock, Target, GripVertical, Award, ChevronUp, ChevronDown, ChevronLeft, Home } from 'lucide-react';

// ═══════════════════════════════════════════════════════════════
// TOKENS
// ═══════════════════════════════════════════════════════════════
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
  @keyframes crackIn  { 0%{opacity:0;strokeDashoffset:100} 100%{opacity:1;strokeDashoffset:0} }
  @keyframes shatter0 { 0%{transform:translate(0,0) rotate(0deg);opacity:1} 100%{transform:translate(-28px,48px) rotate(-42deg);opacity:0} }
  @keyframes shatter1 { 0%{transform:translate(0,0) rotate(0deg);opacity:1} 100%{transform:translate(20px,52px)  rotate(30deg);opacity:0} }
  @keyframes shatter2 { 0%{transform:translate(0,0) rotate(0deg);opacity:1} 100%{transform:translate(-6px,44px)  rotate(-18deg);opacity:0} }
  @keyframes shatter3 { 0%{transform:translate(0,0) rotate(0deg);opacity:1} 100%{transform:translate(28px,40px)  rotate(50deg);opacity:0} }
  @keyframes revealSlide { from{opacity:0;transform:translateX(-12px)} to{opacity:1;transform:translateX(0)} }
  @keyframes coinMove { 0%{transform:translateX(0) translateY(0) scale(1)} 40%{transform:translateX(40px) translateY(-10px) scale(1.1)} 80%{transform:translateX(80px) translateY(0) scale(1)} 100%{transform:translateX(80px) translateY(0) scale(0);opacity:0} }
  @keyframes rowFlash { 0%{background:white} 40%{background:var(--flash-color)} 100%{background:var(--flash-color)} }
  @keyframes ribaBrand { 0%{opacity:0;transform:scale(0.6)} 100%{opacity:1;transform:scale(1)} }
  .su   { animation: slideUp   0.32s ease-out both }
  .fi   { animation: fadeIn    0.22s ease-out both }
  .shk  { animation: shake     0.28s ease both }
  .pop  { animation: pop       0.36s cubic-bezier(.17,.67,.35,1.3) both }
  .pls  { animation: pulse     1.6s ease-in-out infinite }
  .riba-brand { animation: ribaBrand 0.4s 0.15s ease-out both }
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

// ═══════════════════════════════════════════════════════════════
// SHARED UI
// ═══════════════════════════════════════════════════════════════
function IslamicBg(){
  return(
    <svg className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden="true">
      <defs>
        <pattern id="ip4" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
          <path d="M30 0L60 30L30 60L0 30Z" fill="none" stroke={C.teal} strokeWidth="0.5" opacity="0.04"/>
          <circle cx="30" cy="30" r="12" fill="none" stroke={C.teal} strokeWidth="0.3" opacity="0.04"/>
          <path d="M30 18L42 30L30 42L18 30Z" fill="none" stroke={C.teal} strokeWidth="0.4" opacity="0.03"/>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#ip4)"/>
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
      {unscored&&<span className="text-xs px-2.5 py-1 rounded-full font-bold" style={{background:rgba(C.gold,0.15),color:C.gold}}>⚡ Discovery  -  not scored</span>}
    </div>
  );
}
function FeedbackPanel({correct,text,bridge,meta}){
  const sc=meta?(meta.isUnscored?C.teal:meta.ok===meta.total?C.green:meta.ok>=Math.ceil(meta.total*0.67)?C.gold:C.coral):correct?C.green:C.coral;
  return(
    <div className="mt-4 rounded-xl p-5 border-2 su" style={{background:correct?C.greenLight:C.coralLight,borderColor:correct?C.green:C.coral}}>
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-0.5">
          {correct?<CheckCircle className="w-5 h-5" style={{color:C.green}}/>:<XCircle className="w-5 h-5" style={{color:C.coral}}/>}
        </div>
        <div className="flex-1">
          {meta?(
            <div className="flex items-baseline gap-2 mb-1 flex-wrap">
              <span className="text-xl font-black" style={{color:sc,fontFamily:'Georgia,serif'}}>{meta.ok}/{meta.total}</span>
              <span className="text-sm font-bold" style={{color:sc}}>correct</span>
              {<span className="text-xs px-2 py-0.5 rounded-full font-bold" style={{background:meta.ok===meta.total?C.green:meta.ok>=Math.ceil(meta.total*0.67)?C.gold:C.coral,color:'white'}}>
                {meta.ok===meta.total?'Perfect! ⭐':meta.ok>=Math.ceil(meta.total*0.67)?'Almost!':'Keep going'}
              </span>}
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

// ═══════════════════════════════════════════════════════════════
// SECTION VISUAL COMPONENTS
// ═══════════════════════════════════════════════════════════════

// Five Questions Framework  -  Section B animated display
function FiveQFramework(){
  const [lit,setLit]=useState(-1);
  useEffect(()=>{
    let i=0;
    const t=setInterval(()=>{setLit(i);i++;if(i>4)clearInterval(t);},280);
    return()=>clearInterval(t);
  },[]);
  const qs=[
    {n:1,q:'What is the ACTUAL transaction?',tag:'SUBSTANCE',color:C.teal,bg:C.tealLight},
    {n:2,q:'Is there a guaranteed return with no risk?',tag:'RIBĀ CHECK',color:C.coral,bg:C.coralLight},
    {n:3,q:'Can both sides see what they\'re agreeing to?',tag:'GHARAR CHECK',color:C.orange,bg:C.orangeLight},
    {n:4,q:'Is the outcome based on pure chance?',tag:'MAYSIR CHECK',color:C.gold,bg:C.goldLight},
    {n:5,q:'Does a real exchange of value take place?',tag:'SUBSTANCE',color:C.teal,bg:C.tealLight},
  ];
  const substanceRows=[0,4], prohibRows=[1,2,3];
  return(
    <div className="mb-5 rounded-2xl overflow-hidden border-2" style={{borderColor:rgba(C.navy,0.12)}}>
      <div className="px-4 py-2.5 flex items-center gap-2" style={{background:`linear-gradient(135deg,${C.navy},#2a3f6a)`}}>
        <span className="text-sm">🔑</span>
        <span className="text-xs font-black tracking-wide text-white uppercase">The Five Questions Framework</span>
        <span className="ml-auto text-[10px] px-2 py-0.5 rounded-full font-bold" style={{background:'rgba(255,255,255,0.15)',color:'white'}}>portable for life</span>
      </div>
      <div className="p-4 bg-white relative">
        {/* Bracket label: substance */}
        <div className="flex items-stretch gap-2 mb-0">
          <div className="w-3 flex-shrink-0 flex flex-col items-center">
            <div className="w-0.5 flex-1 rounded-full" style={{background:rgba(C.teal,0.3)}}/>
          </div>
          <div className="flex-1 space-y-2">
            {qs.map((item,i)=>{
              const isLit=i<=lit;
              const isSubstance=substanceRows.includes(i);
              const isProhib=prohibRows.includes(i);
              return(
                <div key={i} className="flex items-center gap-2 transition-all" style={{opacity:isLit?1:0.18,transform:isLit?'translateX(0)':'translateX(-6px)',transition:'all 0.3s ease'}}>
                  <div className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-black" style={{background:isLit?item.color:C.light,color:isLit?'white':C.mid,transition:'background 0.3s'}}>
                    {item.n}
                  </div>
                  <div className="flex-1 rounded-xl px-3 py-2 flex items-center gap-2" style={{background:isLit?item.bg:'#f9f9f9',border:`1px solid ${isLit?rgba(item.color,0.25):'#eee'}`,transition:'all 0.3s'}}>
                    <span className="text-xs leading-snug flex-1" style={{color:isLit?C.dark:C.mid,fontWeight:isLit?'500':'400'}}>{item.q}</span>
                    <span className="text-[9px] font-black px-1.5 py-0.5 rounded-full flex-shrink-0 whitespace-nowrap" style={{background:isLit?rgba(item.color,0.15):'transparent',color:isLit?item.color:'transparent',transition:'all 0.3s'}}>
                      {item.tag}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        {/* Legend */}
        {lit>=4&&(
          <div className="flex gap-2 mt-3 su">
            <div className="flex items-center gap-1.5 flex-1 p-2 rounded-lg" style={{background:rgba(C.teal,0.08)}}>
              <div className="w-2 h-2 rounded-full flex-shrink-0" style={{background:C.teal}}/>
              <span className="text-[9px] font-bold" style={{color:C.teal}}>Q1 &amp; Q5 = Substance wrapper</span>
            </div>
            <div className="flex items-center gap-1.5 flex-1 p-2 rounded-lg" style={{background:rgba(C.coral,0.08)}}>
              <div className="w-2 h-2 rounded-full flex-shrink-0" style={{background:C.coral}}/>
              <span className="text-[9px] font-bold" style={{color:C.coral}}>Q2–Q4 = Prohibition checks</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Hilah Pen Sale  -  Section C visual
function HilahDiagram(){
  return(
    <div className="rounded-2xl overflow-hidden mb-5 border-2" style={{borderColor:rgba(C.coral,0.35)}}>
      <div className="px-4 py-2.5 flex items-center gap-2" style={{background:`linear-gradient(135deg,${C.coral},${C.orange})`}}>
        <span className="text-sm">⚠️</span>
        <span className="text-xs font-black tracking-wide text-white uppercase">The Classic Hilah: Pen Sale</span>
      </div>
      <div className="p-4 bg-white">
        <div className="grid grid-cols-3 gap-3 mb-3">
          {/* Bilal */}
          <div className="text-center">
            <div className="w-12 h-12 mx-auto rounded-xl flex items-center justify-center text-2xl mb-1" style={{background:C.greenLight,border:`2px solid ${C.green}`}}>🏦</div>
            <div className="text-xs font-black" style={{color:C.navy}}>Bilal</div>
            <div className="text-[9px]" style={{color:C.mid}}>Has cash</div>
          </div>
          {/* Pen */}
          <div className="text-center flex flex-col items-center justify-center">
            <div className="text-3xl mb-1">🖊️</div>
            <div className="text-[9px] font-black px-2 py-0.5 rounded-full" style={{background:C.coralLight,color:C.coral}}>PROP</div>
            <div className="text-[8px] mt-0.5" style={{color:C.mid}}>never really moves</div>
          </div>
          {/* Ali */}
          <div className="text-center">
            <div className="w-12 h-12 mx-auto rounded-xl flex items-center justify-center text-2xl mb-1" style={{background:C.coralLight,border:`2px solid ${C.coral}`}}>🧍</div>
            <div className="text-xs font-black" style={{color:C.navy}}>Ali</div>
            <div className="text-[9px]" style={{color:C.mid}}>Needs cash</div>
          </div>
        </div>
        {/* Steps */}
        <div className="space-y-1.5 mb-3">
          {[
            {step:'Step 1',label:'Pen "sold" to Ali',amount:'AED 1,200 (credit)',dir:'→',color:C.orange},
            {step:'Step 2',label:'Pen "sold back" to Bilal',amount:'AED 1,000 (cash)',dir:'←',color:C.teal},
            {step:'Result',label:'Ali now owes',amount:'AED 200 extra = INTEREST',dir:'!',color:C.coral},
          ].map((s,i)=>(
            <div key={i} className="flex items-center gap-2 rounded-xl p-2.5" style={{background:i===2?rgba(C.coral,0.06):rgba(C.navy,0.03),border:`1px solid ${i===2?rgba(C.coral,0.2):'#eee'}`}}>
              <span className="text-[9px] font-black px-1.5 py-0.5 rounded-full flex-shrink-0" style={{background:s.color,color:'white'}}>{s.step}</span>
              <span className="text-[10px] flex-1" style={{color:C.dark}}>{s.label}</span>
              <span className="text-[9px] font-bold whitespace-nowrap" style={{color:s.color}}>{s.dir} {s.amount}</span>
            </div>
          ))}
        </div>
        {/* Verdict */}
        <div className="rounded-xl p-3 text-center" style={{background:`linear-gradient(135deg,${rgba(C.coral,0.1)},${rgba(C.orange,0.08)})`,border:`2px solid ${rgba(C.coral,0.3)}`}}>
          <div className="text-sm font-black" style={{color:C.coral}}>RIBĀ IN DISGUISE</div>
          <div className="text-[10px] mt-0.5" style={{color:C.dark}}>Two "sales" = form. A loan at interest = substance.</div>
        </div>
      </div>
    </div>
  );
}

// Car Loan Five Questions Table  -  Section D
function CarLoanTable(){
  const rows=[
    {q:'1. Actual transaction?',ans:'A loan. Bank lends money. You repay more. No trade of goods.',result:'FAIL',detail:'no real trade'},
    {q:'2. Guaranteed return?',ans:'Yes  -  bank gets AED 96,000 regardless. Zero risk for the bank.',result:'FAIL',detail:'ribā'},
    {q:'3. Both sides see clearly?',ans:'Yes. Interest rate disclosed. Terms transparent.',result:'PASS',detail:'no gharar'},
    {q:'4. Pure chance?',ans:'No. Repayment schedule is fixed and agreed.',result:'PASS',detail:'no maysir'},
    {q:'5. Real exchange?',ans:'No. Only money changes hands. No goods traded between bank and you.',result:'FAIL',detail:'no substance'},
  ];
  return(
    <div className="rounded-xl overflow-hidden border mb-5" style={{borderColor:rgba(C.navy,0.1)}}>
      <div className="px-4 py-2.5 flex items-center gap-2" style={{background:rgba(C.navy,0.05)}}>
        <span className="text-sm">🚗</span>
        <span className="text-xs font-bold" style={{color:C.navy}}>Conventional Car Loan  -  Five Questions Applied</span>
      </div>
      {rows.map((r,i)=>(
        <div key={i} className="grid text-xs border-t" style={{gridTemplateColumns:'1fr auto',borderColor:rgba(C.navy,0.07),background:i%2===0?'white':rgba(C.tealLight,0.15)}}>
          <div className="p-2.5">
            <div className="font-bold mb-0.5" style={{color:C.navy}}>{r.q}</div>
            <div style={{color:C.mid}}>{r.ans}</div>
          </div>
          <div className="p-2.5 flex flex-col items-center justify-center gap-0.5 min-w-[64px]" style={{borderLeft:`1px solid ${rgba(C.navy,0.07)}`}}>
            <span className="font-black text-[10px] px-2 py-0.5 rounded-full" style={{background:r.result==='PASS'?C.greenLight:C.coralLight,color:r.result==='PASS'?C.green:C.coral}}>{r.result}</span>
            <span className="text-[8px] text-center" style={{color:C.mid}}>{r.detail}</span>
          </div>
        </div>
      ))}
      <div className="px-4 py-3 flex items-center gap-2" style={{background:rgba(C.coralLight,0.5)}}>
        <XCircle className="w-4 h-4 flex-shrink-0" style={{color:C.coral}}/>
        <span className="text-xs font-bold" style={{color:C.coral}}>Fails 3 of 5  -  contains ribā. Passes Q3 and Q4 (transparent terms, not chance-based).</span>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// SECTIONS DATA
// ═══════════════════════════════════════════════════════════════
const SECTIONS=[
  {
    id:'A',
    title:'What Is Substance Over Labels?',
    body:[
      "What you just experienced is the core principle of Islamic financial analysis. It has an Arabic name: **al-ʿibra lil-maqāsid wa-l-maʿānī, lā lil-alfāz wa-l-mabānī**. In plain English: what matters is the PURPOSE and REALITY of a deal  -  not its WORDS and APPEARANCE.",
      "This means: it does not matter what a financial product is called. It doesn't matter if it has an Islamic label, a Shariah certificate, or Arabic branding. What matters is what the deal is **actually doing**.",
      "The reverse is also true. A product with no Islamic label, offered by a conventional company, could be perfectly permissible if its structure involves real trade, fair risk-sharing, and transparent terms.",
    ],
    hadith:{
      icon:'📖',
      title:"The Prophet ﷺ on Substance",
      text:"The Prophet ﷺ prohibited bayʿ al-ʿīnah  -  a fake sale used to disguise a loan with interest. A sells an item to B for AED 120 on credit, then immediately buys it back for AED 100 cash. No real trade happened. The item was just a prop. The substance: a loan of AED 100 repaid as AED 120. Ribā in disguise.",
      ref:"Abu Dawud 3462, graded sahih by al-Albani",
    },
    callout:{
      icon:'⚠️',
      title:"The Misconception That Ruins Everything",
      text:"'If it has a Shariah label, it must be halal.' This is the single most dangerous assumption in Islamic finance. Labels are issued by people. People can be wrong, pressured, or paid. The label is the STARTING point of your analysis  -  not the end of it.",
      color:C.coral,bg:C.coralLight,
    },
  },
  {
    id:'B',
    title:'The Five Questions',
    body:[
      "So how do you look past the label? You need a tool. Here are five questions that will let you evaluate **any** financial product, regardless of what it is called.",
      "Every question maps to a prohibition you already know. Questions 2, 3, and 4 are your three-prohibition checklist from Lesson 3. Questions 1 and 5 are the **substance wrapper**  -  they force you to look at reality before and after the prohibition checks.",
      "If a product passes all five, it is likely permissible. If it fails even one, dig deeper.",
    ],
    callout:{
      icon:'💡',
      title:"The Five Questions Are Portable",
      text:"You can apply these to anything: a mortgage ad, a crypto pitch, a savings account, a business partnership, a car finance deal, an insurance policy. Five questions. Any product. For the rest of your life.",
      color:C.teal,bg:C.tealLight,
    },
    visual:'fiveQ',
  },
  {
    id:'C',
    title:'Hilah  -  The Legal Trick',
    body:[
      "Now you know what to look for. But there is one more thing: sometimes prohibited deals are deliberately disguised. This is called **hilah (حيلة, hīlah)**  -  a legal trick designed to make a prohibited transaction appear permissible by adding extra steps.",
      "The Five Questions expose a hilah every time. The pen sale fails Questions 1, 2, 3, and 5  -  four failures. The 'two sales' label could not hide the substance.",
    ],
    visual:'hilah',
    fiveQTable:{
      rows:[
        {q:'1. Actual transaction?',a:"It looks like two sales. But the pen never changes purpose or owner in reality.",result:'FAIL'},
        {q:'2. Guaranteed return, no risk?',a:"Yes. Bilal gets AED 1,200 back guaranteed. Ribā.",result:'FAIL'},
        {q:'3. Both sides see clearly?',a:"They both KNOW it is not a real sale. Gharar by intent.",result:'FAIL'},
        {q:'4. Pure chance?',a:"No maysir present.",result:'PASS'},
        {q:'5. Real exchange?',a:"No. The pen was a prop. No real value traded.",result:'FAIL'},
      ],
    },
  },
  {
    id:'D',
    title:'Using the Five Questions in Practice',
    body:[
      "Let us apply the Five Questions to a real-world product that many people encounter: a conventional car loan.",
      "Result: fails 3 of 5 questions. The loan is transparent (passes Q3 and Q4) but involves ribā (fails Q1, Q2, and Q5). In Module 3, you will learn the alternative: **murābahah**  -  where the bank actually BUYS the car and sells it to you at a markup. Real trade. Real ownership transfer. Same car, permissible structure.",
    ],
    visual:'carLoan',
    callout:{
      icon:'🔑',
      title:"Key Takeaway",
      text:"Ignore what a financial product is called. Look at what it is DOING. Use the Five Questions. If a product fails any question, it needs deeper scrutiny. If it fails multiple, walk away.",
      color:C.green,bg:C.greenLight,
    },
  },
];

// ═══════════════════════════════════════════════════════════════
// QUESTIONS DATA
// ═══════════════════════════════════════════════════════════════
const QUESTIONS=[
  {
    id:'q1',position:'first',
    type:'side-by-side',mode:'THINK',typeLabel:'Discovery Challenge',
    scored:false,
    question:"Look at these two financial products. Based on what you know so far  -  which one would you trust more with your money?",
    products:[
      {
        id:'A',
        name:'Al-Baraka Growth Account',
        label:'✅ Shariah-Compliant Certified',
        hasLabel:true,
        marketing:"'Grow your wealth the halal way! Guaranteed 8% returns annually.'",
        does:'You deposit money. Bank pays fixed 8% yearly. No loss possible.',
        risk:'None  -  returns guaranteed.',
        isCorrect:false,
      },
      {
        id:'B',
        name:'Simple Trade Fund',
        label:null,
        hasLabel:false,
        marketing:"'Invest in real businesses. Share the profits. Share the risks.'",
        does:'You buy shares in actual companies. Profit shared. Loss shared.',
        risk:'Yes  -  you could lose money.',
        isCorrect:true,
      },
    ],
    feedback:{
      A:"You chose the one with the 'Shariah-Compliant' label. That is exactly what most people do. And that is exactly the problem. Look again: 'guaranteed 8%' and 'no loss possible' = ribā. It is a guaranteed return on money with zero risk. The label says halal. The substance says ribā. Product B has no label but involves real trade and shared risk  -  which IS how Islamic finance works. This is why substance matters more than labels.",
      B:"Well spotted! Product B has no Islamic label, but it IS the more permissible structure. Real trade, real risk, shared outcomes. Product A has the label but contains ribā  -  'guaranteed 8%' with no risk = money growing from money. The label lied. You just discovered the most important principle in Islamic finance: ignore what it is CALLED. Look at what it is DOING.",
    },
  },
  {
    id:'q2',afterSection:'A',
    type:'mcq',mode:'THINK',typeLabel:'Multiple Choice',level:'2/5',
    question:"What does the substance-over-labels principle mean?",
    options:[
      {id:'a',text:'Products with Arabic names are always Shariah-compliant.',correct:false,
        feedback:"An Arabic name means nothing about compliance. A product called 'Al-Baraka' could contain pure ribā (as you just saw). And a product called 'Simple Trade Fund' in English could be perfectly permissible. Language is not a test of substance."},
      {id:'b',text:"What matters is what a deal is actually DOING, not what it is CALLED.",correct:true,
        feedback:"Exactly. Names, labels, and certificates are the starting point  -  not the conclusion. What is the money DOING? Where is it going? Who bears the risk? Those are the questions that matter."},
      {id:'c',text:'Only products with Shariah certificates can be trusted.',correct:false,
        feedback:"Certificates are useful but not infallible. The certificate tells you a scholar reviewed it. It does not guarantee you understand it, agree with the methodology, or that it suits your needs. Substance still matters."},
      {id:'d',text:"If a scholar approves it, you do not need to understand it.",correct:false,
        feedback:"This is the OPPOSITE of what Islam teaches about wealth. You are a custodian (amānah  -  Lesson 2). Custodians understand what they are managing. Blind delegation is not responsible stewardship."},
    ],
    summaryFeedback:{correct:'Exactly. Names, labels, and certificates are the starting point  -  not the conclusion.',wrong:'The substance-over-labels principle: what the deal DOES matters, not what it is called.'},
  },
  {
    id:'q3',afterSection:'B',
    type:'sequence-order',mode:'SORT',typeLabel:'Drag to Reorder',level:'2/5',
    question:"Drag the Five Questions into the correct order:",
    items:[
      {id:'s1',pos:1,text:'What is the ACTUAL transaction?',tag:'Substance',color:C.teal},
      {id:'s2',pos:2,text:'Is there a guaranteed return with no risk?',tag:'Ribā check',color:C.coral},
      {id:'s3',pos:3,text:'Can both sides see what they are agreeing to?',tag:'Gharar check',color:C.orange},
      {id:'s4',pos:4,text:'Is the outcome based on pure chance?',tag:'Maysir check',color:C.gold},
      {id:'s5',pos:5,text:'Does a real exchange of value take place?',tag:'Substance',color:C.teal},
    ],
    feedback:{
      perfect:"Perfect sequence! Start with WHAT is happening (1), check for the three prohibitions (2-3-4), then confirm REAL VALUE was exchanged (5). This is your portable toolkit.",
      good:"Almost! The logic: first understand the deal (Q1), then test for ribā (Q2), gharar (Q3), maysir (Q4), then confirm substance (Q5). Start with reality, end with reality.",
      low:"The structure: (1) What is the deal DOING? (2) Ribā check. (3) Gharar check. (4) Maysir check. (5) Was there real exchange? You start and end with substance. The three prohibitions are sandwiched in the middle.",
    },
  },
  {
    id:'q4',afterSection:'C',
    type:'cashflow-reveal',mode:'PLAY',typeLabel:'Follow the Money',level:'2/5',
    question:"Follow the money in the pen sale. Tap each step to reveal what is ACTUALLY happening:",
    steps:[
      {
        id:'st1',
        surface:"Bilal 'sells' a pen to Ali for AED 1,200 (credit).",
        reality:"Bilal is LENDING Ali money. The pen is a prop. 💸 Money will flow from Bilal → Ali.",
        icon:'🖊️',
        money:{from:'Bilal',to:'Ali',amount:'AED 1,200',note:'credit (IOU)'},
      },
      {
        id:'st2',
        surface:"Ali 'sells' the pen back to Bilal for AED 1,000 (cash).",
        reality:"Ali RECEIVES AED 1,000 cash. This is the loan amount. The pen never really moved.",
        icon:'💸',
        money:{from:'Ali',to:'Bilal',amount:'Pen back',note:'pen stays as prop'},
      },
      {
        id:'st3',
        surface:"Ali now owes Bilal AED 1,200.",
        reality:"Ali will repay AED 1,200. The AED 200 difference = interest. Classic ribā.",
        icon:'📋',
        money:{from:'Ali',to:'Bilal',amount:'AED 1,200',note:'AED 200 = interest'},
      },
      {
        id:'st4',
        surface:"Two sales completed! 🎉",
        reality:"A loan of AED 1,000 at AED 200 interest. The 'sales' were a disguise. RIBĀ IN DISGUISE.",
        icon:'🚨',
        money:null,
      },
    ],
    mcq:{
      question:"What word describes this technique of disguising a prohibited deal behind extra steps?",
      options:[
        {id:'a',text:'Amānah',correct:false,feedback:"Amānah is the custodian principle from Lesson 2  -  a positive concept. This is the opposite: a deliberate trick. The word is hilah."},
        {id:'b',text:'Hilah',correct:true,feedback:"That is hilah  -  a legal trick. Extra steps, props, and paperwork designed to make ribā look like trade. The Five Questions cut through it every time: no real exchange, guaranteed return, the pen was just a prop."},
        {id:'c',text:'Gharar',correct:false,feedback:"There IS gharar here (both know the sale is fake), but that is not the name for the technique itself. The technique of disguising a prohibited deal is called hilah."},
        {id:'d',text:'Maysir',correct:false,feedback:"Maysir is gambling  -  chance-based outcome. This is not gambling; it is a deliberate disguise. The word is hilah."},
      ],
    },
  },
  {
    id:'q5',afterSection:'D',
    type:'fiveq-checklist',mode:'THINK',typeLabel:'Pass / Fail Checklist',level:'3/5',
    question:"Apply the Five Questions to this product. For each question, tap PASS or FAIL:",
    product:{
      name:'Conventional Savings Account',
      icon:'🏦',
      terms:[
        'Deposit AED 10,000 into a savings account',
        'Guaranteed 3% annual return (AED 300/year)',
        'Capital fully protected  -  you will never lose money',
        'Bank invests your deposit in various portfolios',
      ],
    },
    rows:[
      {q:'1. What is the actual transaction?',answer:'fail',why:"You give money. Bank gives guaranteed return. No trade."},
      {q:'2. Is there a guaranteed return with no risk?',answer:'fail',why:"3% guaranteed. Capital protected. Classic ribā."},
      {q:'3. Can both sides see what they are agreeing to?',answer:'fail',why:"You do not know what the bank invests in. Gharar."},
      {q:'4. Is the outcome based on pure chance?',answer:'pass',why:"Returns are fixed, not chance-based. No maysir."},
      {q:'5. Does a real exchange of value take place?',answer:'fail',why:"Only money in, money out. No goods or services exchanged."},
    ],
    feedback:{
      perfect:"Perfectly analysed. This savings account fails FOUR of five questions: no real trade (Q1), guaranteed return (Q2), you cannot see where the money goes (Q3), and no real exchange (Q5). Only Q4 passes. You just did a full substance analysis.",
      good:"Almost! The tricky one is Q3: the bank invests your deposit but you do not know WHERE. That is gharar  -  fog in the structure. Most people miss this one because savings accounts feel transparent. The rate is clear, but the investments are hidden.",
      low:"Let us walk through it: (1) No trade, just money in/out. (2) Guaranteed 3% with protected capital = ribā. (3) You cannot see the bank's investments = gharar. (4) Returns are fixed, not chance = no maysir. (5) No goods exchanged = no substance. Fails four of five.",
    },
  },
  {
    id:'q6',afterSection:'D',
    type:'mcq',mode:'THINK',typeLabel:'Capstone  -  Level 3',level:'3/5',
    isCapstone:true,
    question:"Using the Five Questions, what is your assessment of this product?",
    productCard:{
      name:'Barakah Savings Plan',
      badge:'Shariah Certificate Displayed',
      terms:[
        'Deposit any amount. Guaranteed 6% annual return.',
        'Capital fully protected  -  you cannot lose your deposit.',
        'Returns paid monthly. No details on how funds are invested.',
        'Shariah certificate displayed on website.',
      ],
    },
    options:[
      {id:'a',text:"It is permissible  -  it has a Shariah certificate.",correct:false,
        feedback:"This is exactly the trap the entire lesson warns against. A certificate tells you someone reviewed it. It does not change the substance. Five Questions: guaranteed return = ribā. No risk = ribā. Unclear investments = gharar. The label says compliant. The substance says otherwise."},
      {id:'b',text:"It fails multiple questions: guaranteed return (ribā), capital protection (no risk), unclear investments (gharar). The certificate does not change the substance.",correct:true,
        feedback:"Excellent. The Shariah certificate is a starting point, not a conclusion. The Five Questions reveal: guaranteed 6% = ribā. Capital protected = zero risk for one side. Unclear investments = gharar. The substance contains at least two prohibitions. In the next lesson, you will apply everything you have learned to YOUR actual finances."},
      {id:'c',text:"It is only problematic because of the unclear investments (gharar). The returns are fine.",correct:false,
        feedback:"You correctly spotted the gharar (unclear investments), but you missed the bigger issue: 'guaranteed 6%' and 'capital fully protected' = ribā. A guaranteed return with no risk is the definition of ribā, regardless of the label."},
      {id:'d',text:"You cannot evaluate this without being a scholar.",correct:false,
        feedback:"You do not need to be a scholar. You have the Five Questions. (1) Deposit → guaranteed return. No trade. (2) Guaranteed, no risk? Yes. Ribā. (3) Clear? No  -  unclear investments. Gharar. (4) Chance? No maysir. (5) Real exchange? No. You can do this analysis yourself. That is the point."},
    ],
    summaryFeedback:{correct:'Excellent. The Five Questions reveal at least two prohibitions even with a Shariah certificate.',wrong:'The substance overrides the label every time. Apply the Five Questions.'},
    bridge:"Next lesson: Your Money Right Now. Everything you have learned  -  amānah, the three prohibitions, the Five Questions  -  applied to YOUR actual finances. Time to audit.",
  },
];

const SCORED_COUNT=QUESTIONS.filter(q=>q.scored!==false).length;

const FLOW=(()=>{
  const f=[];
  QUESTIONS.filter(q=>q.position==='first').forEach(q=>f.push({type:'question',data:q}));
  SECTIONS.forEach(sec=>{
    f.push({type:'section',data:sec});
    QUESTIONS.filter(q=>q.afterSection===sec.id).forEach(q=>f.push({type:'question',data:q}));
  });
  return f;
})();

// ═══════════════════════════════════════════════════════════════
// QUESTION RENDERERS
// ═══════════════════════════════════════════════════════════════

// ─── MCQ ──────────────────────────────────────────────────────
function MCQ({q,done,onFinish}){
  const [sel,setSel]=useState(null);
  const [sub,setSub]=useState(false);
  const [shk,setShk]=useState(null);
  const lockedRef=useRef(false);

  const submit=(optId)=>{
    if(lockedRef.current||sub)return;
    const opt=q.options.find(o=>o.id===optId);
    if(!opt)return;
    lockedRef.current=true;
    setSel(optId);setSub(true);
    setShk(!opt.correct?optId:null);
    if(!opt.correct)setTimeout(()=>setShk(null),500);
    const pts=opt.correct?10:0;
    onFinish(opt.correct,opt.feedback,pts);
  };

  return(
    <div>
      {q.productCard&&(
        <div className="rounded-2xl overflow-hidden border-2 mb-5 shadow-md" style={{borderColor:rgba(C.gold,0.45)}}>
          <div className="px-4 py-3 flex items-center justify-between" style={{background:`linear-gradient(135deg,${C.navy},#2a3f6a)`}}>
            <div>
              <div className="text-xs font-black tracking-wide text-white">{q.productCard.name}</div>
              <div className="text-[9px] mt-0.5" style={{color:rgba(C.gold,0.8)}}>INVESTMENT PRODUCT</div>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full" style={{background:rgba(C.green,0.25)}}>
              <CheckCircle className="w-3 h-3" style={{color:C.green}}/>
              <span className="text-[9px] font-bold" style={{color:C.greenLight}}>{q.productCard.badge}</span>
            </div>
          </div>
          <div className="p-4" style={{background:C.goldLight}}>
            <ul className="space-y-1.5">
              {q.productCard.terms.map((t,i)=>(
                <li key={i} className="flex items-start gap-2 text-xs" style={{color:C.dark}}>
                  <span className="w-4 h-4 rounded-full flex-shrink-0 flex items-center justify-center text-[9px] font-black mt-0.5" style={{background:C.gold,color:'white'}}>{i+1}</span>
                  {t}
                </li>
              ))}
            </ul>
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
              style={{
                background:isC?C.greenLight:isW?C.coralLight:'white',
                borderColor:isC?C.green:isW?C.coral:sel===opt.id&&!sub?C.gold:'#e5e7eb',
                color:C.dark,cursor:sub?'default':'pointer',
              }}>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full border-2 flex-shrink-0 mt-0.5 flex items-center justify-center text-xs font-bold"
                  style={{borderColor:isC?C.green:isW?C.coral:'#d1d5db',background:isC?C.green:isW?C.coral:'transparent',color:isC||isW?'white':'#9ca3af'}}>
                  {opt.id.toUpperCase()}
                </div>
                <span className="flex-1 leading-snug">{opt.text}</span>
                {isC&&<CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5 pop" style={{color:C.green}}/>}
                {isW&&<XCircle     className="w-4 h-4 flex-shrink-0 mt-0.5"     style={{color:C.coral}}/>}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── SIDE BY SIDE (Q1) ────────────────────────────────────────
function SideBySide({q,done,onFinish}){
  const [sel,setSel]=useState(null);
  const [sub,setSub]=useState(false);
  const [shattered,setShattered]=useState(false);
  const lockedRef=useRef(false);

  const choose=(id)=>{if(!sub)setSel(id);};
  const submit=()=>{
    if(!sel||sub||lockedRef.current)return;
    lockedRef.current=true;
    setSub(true);
    setTimeout(()=>setShattered(true),120);
    const chosen=q.products.find(p=>p.id===sel);
    onFinish(chosen.isCorrect,q.feedback[sel],0);
  };

  const pA=q.products[0],pB=q.products[1];

  return(
    <div>
      {/* Cards */}
      <div className="flex gap-3 mb-4">
        {q.products.map(prod=>{
          const isSel=sel===prod.id;
          const isOther=sel&&sel!==prod.id;
          const revealed=sub;
          const isGood=revealed&&prod.isCorrect;
          const isBad=revealed&&!prod.isCorrect;
          return(
            <div key={prod.id} onClick={()=>choose(prod.id)}
              className="flex-1 rounded-2xl overflow-hidden transition-all cursor-pointer"
              style={{
                border:`2px solid ${revealed?(isGood?C.green:C.coral):isSel?C.navy:'#d1d5db'}`,
                opacity:isOther&&!revealed?0.65:1,
                transform:isSel&&!revealed?'scale(1.02)':'scale(1)',
                boxShadow:isSel&&!revealed?`0 8px 28px ${rgba(C.navy,0.18)}`:'0 2px 8px rgba(0,0,0,0.06)',
                transition:'all 0.25s ease',
              }}>
              {/* Product A header  -  trustworthy green */}
              {prod.id==='A'?(
                <div className="px-3 py-2" style={{background:revealed?rgba(C.coral,0.12):`linear-gradient(135deg,${C.green},#2d7a50)`}}>
                  <div className="text-xs font-black" style={{color:revealed?C.coral:'white'}}>{prod.name}</div>
                  {/* Badge or RIBĀ reveal */}
                  <div className="relative mt-1.5 h-7">
                    {!shattered&&prod.hasLabel&&(
                      <div className="absolute inset-0 flex items-center gap-1 px-2 py-1 rounded-lg" style={{background:rgba(C.green,0.2),border:`1px solid ${rgba(C.green,0.4)}`}}>
                        <span className="text-[10px]">✅</span>
                        <span className="text-[9px] font-bold" style={{color:revealed?C.dark:'white'}}>Shariah-Compliant Certified</span>
                      </div>
                    )}
                    {shattered&&(
                      <>
                        {/* Shattered pieces */}
                        {[0,1,2,3].map(i=>(
                          <div key={i} className="absolute text-[9px] font-bold px-1 py-0.5 rounded" style={{
                            background:rgba(C.green,0.3),color:C.green,
                            top:i<2?'0':'50%',left:i%2===0?'0':'40%',
                            animation:`shatter${i} 0.55s ease-out both`,
                            animationDelay:`${i*0.04}s`,
                          }}>{['✅','Sha','riah','✓'][i]}</div>
                        ))}
                        {/* RIBĀ revealed */}
                        <div className="absolute inset-0 flex items-center gap-1.5 px-2 py-1 rounded-lg riba-brand" style={{background:rgba(C.coral,0.2),border:`1px solid ${C.coral}`}}>
                          <XCircle className="w-3 h-3 flex-shrink-0" style={{color:C.coral}}/>
                          <span className="text-[10px] font-black" style={{color:C.coral}}>CONTAINS RIBĀ</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              ):(
                <div className="px-3 py-2" style={{background:revealed?`linear-gradient(135deg,${C.green},#2d7a50)`:'#f9f9f9'}}>
                  <div className="text-xs font-black" style={{color:revealed?'white':C.navy}}>{prod.name}</div>
                  <div className="mt-1.5 h-7 flex items-center">
                    {revealed?(
                      <div className="flex items-center gap-1 px-2 py-1 rounded-lg su" style={{background:'rgba(255,255,255,0.25)'}}>
                        <CheckCircle className="w-3 h-3" style={{color:'white'}}/>
                        <span className="text-[9px] font-bold text-white">Real trade. Shared risk. Permissible.</span>
                      </div>
                    ):(
                      <span className="text-[9px] italic" style={{color:C.mid}}>no Islamic label</span>
                    )}
                  </div>
                </div>
              )}
              {/* Body */}
              <div className="p-3 bg-white">
                <div className="text-[10px] italic mb-2 leading-snug" style={{color:C.mid,fontFamily:'Georgia,serif'}}>"{prod.marketing}"</div>
                <div className="space-y-1.5">
                  {[
                    {label:'What it does',val:prod.does},
                    {label:'Risk to you',val:prod.risk},
                  ].map((r,i)=>(
                    <div key={i} className="text-[10px]">
                      <span className="font-bold" style={{color:C.navy}}>{r.label}: </span>
                      <span style={{color:C.dark}}>{r.val}</span>
                    </div>
                  ))}
                </div>
                {isSel&&!sub&&(
                  <div className="mt-2 text-center text-[9px] font-bold py-1 rounded-lg" style={{background:rgba(C.navy,0.08),color:C.navy}}>
                    Selected ✓
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      {/* Choose button */}
      {!sub&&(
        <button onClick={submit} disabled={!sel}
          className="w-full py-3 rounded-xl font-bold text-sm transition-all"
          style={{
            background:sel?`linear-gradient(135deg,${C.gold},${C.orange})`:C.light,
            color:sel?C.navy:'#bbb',
            cursor:sel?'pointer':'not-allowed',
          }}>
          {sel?`I choose Product ${sel} →`:'Tap a product to select'}
        </button>
      )}
    </div>
  );
}

// ─── SEQUENCE ORDER (Q3) ──────────────────────────────────────
function SequenceOrder({q,done,onFinish}){
  const shuffleOnce=useRef(null);
  if(!shuffleOnce.current){
    shuffleOnce.current=[...q.items].sort(()=>Math.random()-0.5);
  }
  const [order,setOrder]=useState(shuffleOnce.current);
  const [sub,setSub]=useState(false);
  const [results,setResults]=useState(null);
  const [dragging,setDragging]=useState(null);
  const [dragOver,setDragOver]=useState(null);
  const lockedRef=useRef(false);

  const moveUp=(idx)=>{
    if(idx===0||sub)return;
    const n=[...order];[n[idx-1],n[idx]]=[n[idx],n[idx-1]];setOrder(n);
  };
  const moveDown=(idx)=>{
    if(idx===order.length-1||sub)return;
    const n=[...order];[n[idx],n[idx+1]]=[n[idx+1],n[idx]];setOrder(n);
  };

  // Drag handlers
  const onDragStart=(e,idx)=>{e.dataTransfer.effectAllowed='move';setDragging(idx);};
  const onDragOver=(e,idx)=>{e.preventDefault();setDragOver(idx);};
  const onDrop=(e,idx)=>{
    e.preventDefault();
    if(dragging===null||dragging===idx)return;
    const n=[...order];
    const [moved]=n.splice(dragging,1);
    n.splice(idx,0,moved);
    setOrder(n);setDragging(null);setDragOver(null);
  };
  const onDragEnd=()=>{setDragging(null);setDragOver(null);};

  const submit=()=>{
    if(sub||lockedRef.current)return;
    lockedRef.current=true;setSub(true);
    const res=order.map((item,i)=>item.pos===i+1);
    setResults(res);
    const ok=res.filter(Boolean).length;
    const fbText=ok===5?q.feedback.perfect:ok>=3?q.feedback.good:q.feedback.low;
    onFinish(ok>=4,fbText,ok===5?10:ok>=3?6:ok*2,{ok,total:5,isUnscored:false});
  };

  return(
    <div>
      <p className="text-xs mb-3" style={{color:C.mid}}>
        {sub?'Results shown below.':'Drag cards or use ▲▼ arrows to reorder. Correct order = the Five Questions framework.'}
      </p>
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
              style={{
                background:isCorrect===true?C.greenLight:isCorrect===false?C.coralLight:isDragTarget?rgba(C.gold,0.1):'white',
                borderColor:isCorrect===true?C.green:isCorrect===false?C.coral:isDrag?C.gold:isDragTarget?rgba(C.gold,0.5):'#e5e7eb',
                opacity:isDrag?0.5:1,
                transform:isDragTarget?'scale(1.01)':'scale(1)',
                cursor:sub?'default':'grab',
                boxShadow:isDrag?`0 8px 24px ${rgba(C.navy,0.15)}`:'none',
              }}>
              {/* Drag handle */}
              <div className="p-3 flex-shrink-0" style={{color:C.mid}}>
                <GripVertical className="w-4 h-4"/>
              </div>
              {/* Position badge */}
              <div className="w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center text-[10px] font-black flex-shrink-0"
                style={{background:isCorrect===true?C.green:isCorrect===false?C.coral:rgba(C.navy,0.08),color:isCorrect!==null?'white':C.navy}}>
                {i+1}
              </div>
              {/* Text */}
              <div className="flex-1 py-3 pr-2">
                <div className="text-xs font-medium leading-snug" style={{color:C.dark}}>{item.text}</div>
                {sub&&(
                  <div className="text-[9px] mt-0.5 font-bold" style={{color:item.color}}>{item.tag}</div>
                )}
              </div>
              {/* Correct position */}
              {sub&&isCorrect===false&&(
                <div className="text-[9px] pr-2 flex-shrink-0 text-center" style={{color:C.mid}}>
                  <div>should be</div>
                  <div className="font-black" style={{color:C.teal}}>#{item.pos}</div>
                </div>
              )}
              {/* Up/Down arrows (mobile) */}
              {!sub&&(
                <div className="flex flex-col gap-0.5 pr-2 flex-shrink-0">
                  <button onClick={()=>moveUp(i)} disabled={i===0}
                    className="w-6 h-6 rounded flex items-center justify-center"
                    style={{background:i===0?'transparent':rgba(C.navy,0.06),color:i===0?'#ddd':C.navy}}>
                    <ChevronUp className="w-3.5 h-3.5"/>
                  </button>
                  <button onClick={()=>moveDown(i)} disabled={i===order.length-1}
                    className="w-6 h-6 rounded flex items-center justify-center"
                    style={{background:i===order.length-1?'transparent':rgba(C.navy,0.06),color:i===order.length-1?'#ddd':C.navy}}>
                    <ChevronDown className="w-3.5 h-3.5"/>
                  </button>
                </div>
              )}
              {sub&&isCorrect===true&&<CheckCircle className="w-4 h-4 mr-3 flex-shrink-0 pop" style={{color:C.green}}/>}
              {sub&&isCorrect===false&&<XCircle     className="w-4 h-4 mr-3 flex-shrink-0"     style={{color:C.coral}}/>}
            </div>
          );
        })}
      </div>
      {!sub&&(
        <button onClick={submit}
          className="w-full py-3 rounded-xl font-bold text-sm"
          style={{background:`linear-gradient(135deg,${C.teal},${C.navy})`,color:'white'}}>
          Check My Order →
        </button>
      )}
    </div>
  );
}

// ─── CASH FLOW REVEAL (Q4) ────────────────────────────────────
function CashFlowReveal({q,done,onFinish}){
  const [revealed,setRevealed]=useState(0); // how many steps revealed
  const [mcqPhase,setMcqPhase]=useState(false);
  const [mcqSel,setMcqSel]=useState(null);
  const [mcqSub,setMcqSub]=useState(false);
  const [shk,setShk]=useState(null);
  const [showRiba,setShowRiba]=useState(false);
  const lockedRef=useRef(false);

  const revealStep=()=>{
    if(revealed>=q.steps.length)return;
    const next=revealed+1;
    setRevealed(next);
    if(next===q.steps.length){
      setTimeout(()=>setShowRiba(true),300);
      setTimeout(()=>setMcqPhase(true),900);
    }
  };

  const submitMcq=(optId)=>{
    if(lockedRef.current||mcqSub)return;
    lockedRef.current=true;
    const opt=q.mcq.options.find(o=>o.id===optId);
    setMcqSel(optId);setMcqSub(true);
    if(!opt.correct){setShk(optId);setTimeout(()=>setShk(null),500);}
    onFinish(opt.correct,opt.feedback,opt.correct?10:0);
  };

  return(
    <div>
      {/* Steps */}
      <div className="space-y-3 mb-4">
        {q.steps.map((step,i)=>{
          const isRevealed=i<revealed;
          const isNext=i===revealed;
          return(
            <div key={step.id} className="rounded-xl overflow-hidden border-2 transition-all"
              style={{borderColor:isRevealed?rgba(C.coral,0.35):'#e5e7eb',opacity:isRevealed||isNext?1:0.4}}>
              {/* Surface */}
              <div className="px-4 py-3 flex items-start gap-2" style={{background:rgba(C.navy,0.03)}}>
                <span className="text-xs font-black px-1.5 py-0.5 rounded-full flex-shrink-0 mt-0.5" style={{background:C.navy,color:'white'}}>Step {i+1}</span>
                <div>
                  <div className="text-[10px] font-bold mb-0.5" style={{color:C.mid}}>WHAT IT LOOKS LIKE</div>
                  <div className="text-xs leading-snug" style={{color:C.dark}}>{step.surface}</div>
                </div>
                <span className="text-xl ml-auto flex-shrink-0">{step.icon}</span>
              </div>
              {/* Hidden reality */}
              {isRevealed?(
                <div className="px-4 py-3 su" style={{background:i===q.steps.length-1&&showRiba?rgba(C.coral,0.12):rgba(C.coralLight,0.7),borderTop:`2px solid ${rgba(C.coral,0.25)}`}}>
                  <div className="text-[10px] font-bold mb-0.5" style={{color:C.coral}}>WHAT'S ACTUALLY HAPPENING</div>
                  <div className="text-xs leading-snug font-medium" style={{color:C.dark}}>{step.reality}</div>
                  {step.money&&(
                    <div className="flex items-center gap-2 mt-2 text-[9px]">
                      <span className="px-2 py-0.5 rounded-full font-bold" style={{background:C.coral,color:'white'}}>💸 {step.money.from} → {step.money.to}</span>
                      <span style={{color:C.mid}}>{step.money.amount}</span>
                      <span className="italic" style={{color:C.mid}}>{step.money.note}</span>
                    </div>
                  )}
                  {i===q.steps.length-1&&showRiba&&(
                    <div className="mt-2 text-center py-2 rounded-lg riba-brand" style={{background:C.coral}}>
                      <span className="text-sm font-black text-white">⚠️ RIBĀ IN DISGUISE</span>
                    </div>
                  )}
                </div>
              ):(
                isNext?(
                  <button onClick={revealStep}
                    className="w-full px-4 py-3 flex items-center justify-center gap-2 pls"
                    style={{background:rgba(C.coral,0.07),borderTop:`2px dashed ${rgba(C.coral,0.3)}`}}>
                    <span className="text-xs font-bold" style={{color:C.coral}}>🔓 Tap to reveal the truth</span>
                  </button>
                ):(
                  <div className="px-4 py-3 flex items-center gap-2" style={{background:'#f9f9f9',borderTop:'1px solid #eee'}}>
                    <span className="text-xs" style={{color:'#ccc'}}>🔒 Reveal step {i} first</span>
                  </div>
                )
              )}
            </div>
          );
        })}
      </div>

      {/* Pen stays static note */}
      {revealed>=2&&(
        <div className="rounded-xl p-3 mb-4 flex items-center gap-2 su" style={{background:rgba(C.orange,0.08),border:`1px solid ${rgba(C.orange,0.2)}`}}>
          <span className="text-lg">🖊️</span>
          <span className="text-xs" style={{color:C.dark}}>Notice: <strong>money moves</strong> in every step. The pen <strong>never really moves</strong>. The pen was always just a prop.</span>
        </div>
      )}

      {/* MCQ phase */}
      {mcqPhase&&(
        <div className="mt-4 su">
          <div className="h-px mb-4" style={{background:`linear-gradient(90deg,transparent,${C.gold},transparent)`}}/>
          <div className="text-sm font-bold mb-4" style={{color:C.navy}}>{q.mcq.question}</div>
          <div className="space-y-2">
            {q.mcq.options.map(opt=>{
              const isC=mcqSub&&opt.correct,isW=mcqSub&&!opt.correct&&mcqSel===opt.id;
              return(
                <button key={opt.id} onClick={()=>!mcqSub&&submitMcq(opt.id)}
                  disabled={mcqSub}
                  className={`w-full text-left p-3.5 rounded-xl border-2 text-sm transition-all ${shk===opt.id?'shk':''}`}
                  style={{
                    background:isC?C.greenLight:isW?C.coralLight:'white',
                    borderColor:isC?C.green:isW?C.coral:'#e5e7eb',
                    color:C.dark,cursor:mcqSub?'default':'pointer',
                  }}>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full flex-shrink-0" style={{background:rgba(C.navy,0.07),color:C.navy}}>{opt.id.toUpperCase()}</span>
                    <span className="flex-1">{opt.text}</span>
                    {isC&&<CheckCircle className="w-4 h-4 pop" style={{color:C.green}}/>}
                    {isW&&<XCircle     className="w-4 h-4"     style={{color:C.coral}}/>}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── FIVE Q CHECKLIST (Q5) ────────────────────────────────────
function FiveQChecklist({q,done,onFinish}){
  const [answers,setAnswers]=useState(Array(q.rows.length).fill(null));
  const [sub,setSub]=useState(false);
  const [results,setResults]=useState(null);
  const [flashIdx,setFlashIdx]=useState(-1);
  const [showVerdict,setShowVerdict]=useState(false);
  const lockedRef=useRef(false);

  const toggle=(i,val)=>{
    if(sub)return;
    setAnswers(a=>{const n=[...a];n[i]=val;return n;});
  };

  const allAnswered=answers.every(a=>a!==null);

  const submit=()=>{
    if(!allAnswered||sub||lockedRef.current)return;
    lockedRef.current=true;setSub(true);
    const res=answers.map((a,i)=>a===q.rows[i].answer);
    setResults(res);
    // Cascade flash
    res.forEach((_,i)=>{
      setTimeout(()=>setFlashIdx(i),i*320);
    });
    setTimeout(()=>setShowVerdict(true),(res.length)*320+300);
    const ok=res.filter(Boolean).length;
    const fbText=ok===5?q.feedback.perfect:ok>=3?q.feedback.good:q.feedback.low;
    setTimeout(()=>onFinish(ok>=4,fbText,ok===5?10:ok>=3?6:ok*2,{ok,total:5,isUnscored:false}),(res.length)*320+600);
  };

  return(
    <div>
      {/* Product card */}
      <div className="rounded-2xl overflow-hidden border-2 mb-5" style={{borderColor:rgba(C.gold,0.35)}}>
        <div className="px-4 py-2.5 flex items-center gap-2" style={{background:`linear-gradient(135deg,${C.navy},#2a3f6a)`}}>
          <span className="text-xl">{q.product.icon}</span>
          <div>
            <div className="text-xs font-black text-white">{q.product.name}</div>
            <div className="text-[9px]" style={{color:rgba(C.gold,0.8)}}>Apply the Five Questions</div>
          </div>
          {showVerdict&&(
            <div className="ml-auto px-2 py-1 rounded-lg su" style={{background:rgba(C.coral,0.25)}}>
              <span className="text-[9px] font-black" style={{color:C.coral}}>Fails 4 of 5</span>
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

      {/* Checklist rows */}
      <div className="space-y-2 mb-4">
        {q.rows.map((row,i)=>{
          const ans=answers[i];
          const res=results?results[i]:null;
          const isFlashing=sub&&flashIdx===i;
          const wasFlashed=sub&&flashIdx>i;
          return(
            <div key={i} className="rounded-xl border-2 overflow-hidden transition-all"
              style={{
                borderColor:res===true?C.green:res===false?C.coral:ans?rgba(C.navy,0.2):'#e5e7eb',
                background:res===true?rgba(C.greenLight,0.6):res===false?rgba(C.coralLight,0.6):'white',
                transition:'all 0.3s ease',
              }}>
              <div className="flex items-center gap-2 p-2.5">
                <div className="flex-1">
                  <div className="text-xs font-medium leading-snug" style={{color:C.dark}}>{row.q}</div>
                  {res!==null&&(
                    <div className="text-[9px] mt-0.5 fi" style={{color:res?C.green:C.coral}}>{row.why}</div>
                  )}
                </div>
                {/* Pass/Fail toggle */}
                {!sub?(
                  <div className="flex gap-1.5 flex-shrink-0">
                    {['pass','fail'].map(val=>(
                      <button key={val} onClick={()=>toggle(i,val)}
                        className="px-3 py-1.5 rounded-lg text-xs font-bold border-2 transition-all"
                        style={{
                          background:ans===val?(val==='pass'?C.green:C.coral):'transparent',
                          borderColor:val==='pass'?C.green:C.coral,
                          color:ans===val?'white':(val==='pass'?C.green:C.coral),
                        }}>
                        {val==='pass'?'PASS':'FAIL'}
                      </button>
                    ))}
                  </div>
                ):(
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-full" style={{
                      background:row.answer==='pass'?C.greenLight:C.coralLight,
                      color:row.answer==='pass'?C.green:C.coral,
                    }}>
                      {row.answer.toUpperCase()}
                    </span>
                    {res===true&&<CheckCircle className="w-4 h-4 pop" style={{color:C.green}}/>}
                    {res===false&&<XCircle     className="w-4 h-4"     style={{color:C.coral}}/>}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {!sub&&(
        <button onClick={submit} disabled={!allAnswered}
          className="w-full py-3 rounded-xl font-bold text-sm transition-all"
          style={{
            background:allAnswered?`linear-gradient(135deg,${C.navy},${C.teal})`:C.light,
            color:allAnswered?'white':'#bbb',
            cursor:allAnswered?'pointer':'not-allowed',
          }}>
          Check All Five Answers →
        </button>
      )}
      {!allAnswered&&!sub&&(
        <p className="text-center text-xs mt-2" style={{color:C.mid}}>
          {answers.filter(a=>a).length}/5 answered
        </p>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// SECTION CARD
// ═══════════════════════════════════════════════════════════════
function SectionCard({section,onNext}){
  return(
    <div className="rounded-2xl p-6 border border-white/40 shadow-lg" style={CARD}>
      <div className="flex items-center gap-2 mb-4">
        <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-black" style={{background:`linear-gradient(135deg,${C.gold},${C.orange})`,color:'white'}}>
          {section.id}
        </div>
        <h2 className="text-base font-bold" style={{color:C.navy,fontFamily:'Georgia,serif'}}>{section.title}</h2>
      </div>

      {/* Body paragraphs */}
      <div className="space-y-3 mb-5">
        {section.body.map((para,i)=>(
          <p key={i} className="text-sm leading-relaxed" style={{color:C.dark}}>{md(para)}</p>
        ))}
      </div>

      {/* Visuals */}
      {section.visual==='fiveQ'&&<FiveQFramework/>}
      {section.visual==='hilah'&&<HilahDiagram/>}
      {section.visual==='carLoan'&&<CarLoanTable/>}

      {/* Hilah Five Q table */}
      {section.fiveQTable&&(
        <div className="rounded-xl overflow-hidden border mb-5" style={{borderColor:rgba(C.navy,0.1)}}>
          <div className="px-3 py-2 text-[10px] font-black uppercase tracking-wide" style={{background:rgba(C.navy,0.05),color:C.navy}}>
            Five Questions Applied to the Pen Sale
          </div>
          {section.fiveQTable.rows.map((r,i)=>(
            <div key={i} className="grid text-xs border-t" style={{gridTemplateColumns:'1fr auto',borderColor:rgba(C.navy,0.07),background:i%2===0?'white':rgba(C.orangeLight,0.2)}}>
              <div className="p-2.5">
                <div className="font-bold mb-0.5" style={{color:C.navy}}>{r.q}</div>
                <div style={{color:C.mid}}>{r.a}</div>
              </div>
              <div className="p-2.5 flex items-center justify-center min-w-[52px]" style={{borderLeft:`1px solid ${rgba(C.navy,0.07)}`}}>
                <span className="text-[9px] font-black px-1.5 py-0.5 rounded-full" style={{background:r.result==='PASS'?C.greenLight:C.coralLight,color:r.result==='PASS'?C.green:C.coral}}>
                  {r.result}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Hadith */}
      {section.hadith&&(
        <div className="rounded-xl overflow-hidden mb-5 border" style={{borderColor:rgba(C.gold,0.3)}}>
          <div className="px-4 py-2 flex items-center gap-2" style={{background:`linear-gradient(135deg,${C.navy},#2a3f6a)`}}>
            <span className="text-sm">{section.hadith.icon}</span>
            <span className="text-xs font-bold" style={{color:rgba(C.gold,0.9)}}>{section.hadith.title}</span>
          </div>
          <div className="px-4 py-4" style={{background:C.goldLight}}>
            <p className="text-sm italic leading-relaxed mb-2" style={{color:C.dark,fontFamily:'Georgia,serif'}}>{section.hadith.text}</p>
            <p className="text-xs font-bold" style={{color:C.gold}}> -  {section.hadith.ref}</p>
          </div>
        </div>
      )}

      {/* Callout */}
      {section.callout&&(
        <div className="rounded-xl p-4 mb-5 border-l-4" style={{background:section.callout.bg,borderColor:section.callout.color}}>
          <div className="text-xs font-bold mb-1.5" style={{color:section.callout.color}}>
            {section.callout.icon} {section.callout.title}
          </div>
          <p className="text-sm leading-relaxed" style={{color:C.dark}}>{section.callout.text}</p>
        </div>
      )}

      <button onClick={onNext} className="w-full py-3 rounded-xl font-bold text-sm" style={{background:`linear-gradient(135deg,${C.navy},${C.teal})`,color:'white'}}>
        Continue <ArrowRight className="w-4 h-4 inline ml-1 -mt-0.5"/>
      </button>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// QUESTION CARD
// ═══════════════════════════════════════════════════════════════
function QuestionCard({q,qIdx,totalQ,score,onAnswer,onNext}){
  const [done,    setDone]    = useState(false);
  const [correct, setCorrect] = useState(false);
  const [fbText,  setFbText]  = useState('');
  const [fbMeta,  setFbMeta]  = useState(null);

  const finish=useCallback((isCorrect,text,pts,meta)=>{
    setDone(true);setCorrect(isCorrect);setFbText(text);
    if(meta)setFbMeta(meta);
    onAnswer(isCorrect,pts,{scored:q.scored,isCapstone:q.isCapstone});
  },[onAnswer,q.scored,q.isCapstone]);

  return(
    <div className="rounded-2xl p-6 border border-white/40 shadow-lg" style={CARD}>
      <ModeBadge mode={q.mode} type={q.typeLabel} unscored={q.scored===false}/>
      <p className="text-base font-semibold leading-snug mb-5" style={{color:C.navy}}>{q.question}</p>

      {q.type==='side-by-side'   &&<SideBySide      q={q} done={done} onFinish={finish}/>}
      {q.type==='mcq'            &&<MCQ              q={q} done={done} onFinish={finish}/>}
      {q.type==='sequence-order' &&<SequenceOrder    q={q} done={done} onFinish={finish}/>}
      {q.type==='cashflow-reveal'&&<CashFlowReveal   q={q} done={done} onFinish={finish}/>}
      {q.type==='fiveq-checklist'&&<FiveQChecklist   q={q} done={done} onFinish={finish}/>}

      {done&&fbText&&<FeedbackPanel correct={correct} text={fbText} bridge={q.bridge} meta={fbMeta}/>}

      {done&&(
        <button onClick={onNext} className="w-full mt-4 py-3 rounded-xl font-bold text-sm su"
          style={{background:`linear-gradient(135deg,${C.green},${C.teal})`,color:'white'}}>
          Next <ArrowRight className="w-4 h-4 inline ml-1 -mt-0.5"/>
        </button>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════════════════════════
export default function DEANY_M1L4({ onBack, onHome, savedProgress }){
  const [screen,   setScreen]   = useState(savedProgress ? 'lesson' : 'intro');
  const [flowIdx,  setFlowIdx]  = useState(savedProgress?.flowIdx ?? 0);
  const [score,    setScore]    = useState(savedProgress?.score ?? 0);
  const [results,  setResults]  = useState(savedProgress?.results ?? []);
  const [streak,   setStreak]   = useState(savedProgress?.streak ?? 0);
  const [streakFlash,setStreakFlash]=useState(false);
  const [l4Toast,  setL4Toast]  = useState(false);
  const [confetti, setConfetti] = useState(false);
  const [conf,     setConf]     = useState(3);

  const qDoneNum=FLOW.slice(0,flowIdx).filter(f=>f.type==='question'&&f.data.scored!==false).length;
  const current=FLOW[flowIdx];

  const handleAnswer=useCallback((correct,pts,flags={})=>{
    const isScored=flags.scored!==false;
    if(isScored)setResults(r=>{
      const newResults=[...r,{correct}];
      try{localStorage.setItem('deany-progress-lesson-1-4',JSON.stringify({flowIdx:flowIdx+1,score:correct?score+pts:score,streak:correct?streak+1:0,results:newResults}));}catch(e){}
      return newResults;
    });
    if(correct&&isScored){
      setScore(s=>s+pts);
      setStreak(s=>{
        const n=s+1;
        if(n>=3){setStreakFlash(true);setTimeout(()=>setStreakFlash(false),2200);}
        return n;
      });
      if(flags.isCapstone){setL4Toast(true);setTimeout(()=>setL4Toast(false),3200);}
    } else if(isScored){
      setStreak(0);
    }
  },[flowIdx,score,streak]);

  const advance=useCallback(()=>{
    window.scrollTo({top:0,behavior:'smooth'});
    if(flowIdx<FLOW.length-1){setFlowIdx(i=>i+1);}
    else{setScreen('complete');setConfetti(true);setTimeout(()=>setConfetti(false),4500);try{localStorage.removeItem('deany-progress-lesson-1-4');}catch(e){}}
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
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-bold mb-4" style={{background:rgba(C.gold,0.14),color:C.gold}}>MODULE 1 · LESSON 4</span>
          <h1 className="text-3xl font-bold mb-2" style={{color:C.navy,fontFamily:'Georgia,serif'}}>Substance Over Labels</h1>
          <p className="text-sm" style={{color:C.mid}}>Ignore what a deal is called. Look at what it's doing.</p>
        </div>
        <div className="rounded-2xl p-6 border border-white/40 shadow-lg su" style={CARD}>
          <div className="rounded-xl p-4 mb-5 border" style={{background:rgba(C.tealLight,0.7),borderColor:rgba(C.teal,0.18)}}>
            <div className="text-xs font-bold mb-1" style={{color:C.teal}}>📎 Building on Lesson 1.3</div>
            <p className="text-xs leading-relaxed" style={{color:C.dark}}>
              You now know the three prohibitions: ribā, gharar, and maysir. But prohibited deals don't always announce themselves. Sometimes they <strong>hide behind labels, branding, and marketing</strong>. This lesson teaches you the single most important skill in Islamic finance: ignore the label. Look at what the deal is <strong>DOING</strong>.
            </p>
          </div>
          <div className="flex items-start gap-3 mb-5">
            <Mascot/>
            <div className="rounded-xl rounded-tl-sm p-4 border border-gray-100 flex-1" style={{background:'rgba(255,255,255,0.85)'}}>
              <p className="text-sm" style={{color:C.dark}}>
                <strong style={{color:C.teal}}>Fulus:</strong> We start with a challenge  -  two products, your instinct. Then I'll show you why the one that looks more trustworthy might be the dangerous one. Ready to see through labels? 🔍
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 mb-5">
            {[
              {icon:'🏷️',term:'Substance Over Labels',desc:'What a deal DOES matters'},
              {icon:'🔑',term:'Five Questions',desc:'Portable evaluation tool'},
              {icon:'🎭',term:'Hilah',desc:'حيلة  -  legal tricks in disguise'},
              {icon:'🔍',term:'Applied Analysis',desc:'Test any product yourself'},
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
              {icon:<Clock className="w-4 h-4"/>,label:'15 min',sub:'Duration'},
              {icon:<Target className="w-4 h-4"/>,label:'6 Qs',sub:'Questions'},
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
            <p className="text-xs leading-relaxed" style={{color:C.dark}}>Explain the substance-over-labels principle, apply the Five Questions framework to evaluate any financial product, identify a hilah (legal trick), and evaluate a labelled product for genuine compliance.</p>
          </div>
          <button onClick={()=>setScreen('lesson')} className="w-full py-3.5 rounded-xl font-bold text-sm" style={{background:`linear-gradient(135deg,${C.navy},${C.teal})`,color:'white'}}>
            Begin Lesson <ArrowRight className="w-4 h-4 inline ml-1 -mt-0.5"/>
          </button>
        </div>
      </div>
    </div>
  );

  // ── COMPLETE ─────────────────────────────────────────────────
  if(screen==='complete'){
    const total=SCORED_COUNT,correct=results.filter(r=>r.correct).length;
    const pct=Math.round((correct/total)*100);
    const ring=pct>=80?C.green:pct>=60?C.gold:C.teal;
    const circ=2*Math.PI*36,offset=circ-(pct/100)*circ;
    const confText=conf<=2?'The Five Questions take practice. Use them on anything you see this week.':conf===3?'Solid foundation. The more you use the Five Questions, the faster it gets.':'You can already see through labels. That is a real skill.';
    return(
      <div className="min-h-screen relative overflow-hidden" style={PAGE_BG}>
        <IslamicBg/><style>{STYLES}</style>
        {confetti&&<Confetti/>}
        <div className="relative z-10 max-w-2xl mx-auto px-4 py-10">
          <LessonNav />
          <div className="rounded-2xl p-8 border border-white/40 shadow-xl text-center su" style={CARD}>
            <div className="text-4xl mb-3">🔑</div>
            <h1 className="text-2xl font-bold mb-1" style={{color:C.navy,fontFamily:'Georgia,serif'}}>Lesson Complete!</h1>
            <p className="text-sm mb-4" style={{color:C.mid}}>Substance Over Labels</p>
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold mb-6" style={{background:rgba(C.gold,0.18),color:C.gold,border:`1px solid ${rgba(C.gold,0.35)}`}}>
              <Award className="w-3.5 h-3.5"/> Five Questions Unlocked ⭐
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
            {/* Concepts mastered */}
            <div className="text-left p-4 rounded-xl mb-5" style={{background:rgba(C.greenLight,0.7),border:`1px solid ${rgba(C.green,0.18)}`}}>
              <div className="text-xs font-bold mb-2" style={{color:C.green}}>✅ Concepts Mastered</div>
              {[
                'Substance over labels  -  what a deal DOES matters, not what it is CALLED',
                'The Five Questions framework  -  portable evaluation tool for any product',
                'Hilah  -  deliberate disguise of prohibited transactions',
                'Applied Five Questions to a savings account (4 fails)',
                'Evaluated a labelled product  -  Shariah certificate does not guarantee compliance',
              ].map((c,i)=>(
                <div key={i} className="flex items-start gap-2 py-0.5">
                  <CheckCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{color:C.green}}/>
                  <span className="text-xs" style={{color:C.dark}}>{c}</span>
                </div>
              ))}
            </div>
            {/* Five Questions summary */}
            <div className="rounded-xl overflow-hidden border mb-5" style={{borderColor:rgba(C.gold,0.3)}}>
              <div className="px-4 py-2 text-xs font-black" style={{background:C.navy,color:C.gold}}>🔑 Your Five Questions  -  Keep These</div>
              {[
                'What is the ACTUAL transaction?',
                'Is there a guaranteed return with no risk? (Ribā)',
                'Can both sides see what they are agreeing to? (Gharar)',
                'Is the outcome based on pure chance? (Maysir)',
                'Does a real exchange of value take place?',
              ].map((q,i)=>(
                <div key={i} className="flex items-center gap-2 px-4 py-2 border-t text-xs" style={{borderColor:rgba(C.gold,0.1),background:i%2===0?C.goldLight:rgba(C.goldLight,0.5)}}>
                  <span className="w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center text-[9px] font-black" style={{background:C.gold,color:'white'}}>{i+1}</span>
                  <span style={{color:C.dark}}>{q}</span>
                </div>
              ))}
            </div>
            {/* Confidence slider */}
            <div className="p-4 rounded-xl mb-6 text-left" style={{background:rgba(C.teal,0.07),border:`1px solid ${rgba(C.teal,0.16)}`}}>
              <div className="text-xs font-bold mb-2" style={{color:C.teal}}>How confident are you applying the Five Questions?</div>
              <input type="range" min="1" max="5" value={conf} onChange={e=>setConf(Number(e.target.value))}
                className="w-full mb-2" style={{accentColor:C.teal}}/>
              <div className="flex justify-between text-[9px] mb-2" style={{color:C.mid}}>
                {['Still learning','Developing','Getting there','Confident','Very confident'].map((l,i)=><span key={i}>{l}</span>)}
              </div>
              <p className="text-xs italic" style={{color:C.dark}}>{confText}</p>
            </div>
            {/* Next preview */}
            <div className="p-4 rounded-xl text-left" style={{background:C.goldLight,border:`1px solid ${rgba(C.gold,0.25)}`}}>
              <div className="text-xs font-bold mb-1" style={{color:C.gold}}>📍 Up Next: Lesson 1.5  -  Your Money Right Now</div>
              <p className="text-xs leading-relaxed" style={{color:C.dark}}>
                Everything you have learned  -  amānah, the three prohibitions, the Five Questions  -  applied to YOUR actual finances. Time to audit.
              </p>
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
          <Flame className="w-4 h-4" style={{color:C.coral}}/> Streak! {streak} in a row 🔥
        </div>
      )}
      {/* L4 capstone toast */}
      {l4Toast&&(
        <div className="fixed top-4 left-1/2 z-50 flex flex-col items-center gap-1 px-5 py-3 rounded-xl shadow-xl su"
          style={{background:C.navy,border:`2px solid ${rgba(C.gold,0.4)}`,transform:'translateX(-50%)'}}>
          <span className="text-xs font-black" style={{color:C.gold}}>🔑 Full Analysis Complete!</span>
          <span className="text-[10px]" style={{color:rgba(C.gold,0.75)}}>Five Questions applied perfectly</span>
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
