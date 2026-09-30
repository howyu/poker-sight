"use client";
import {useEffect,useMemo,useState} from "react";
import SiteNav from "../SiteNav";
import {glossary} from "../../lib/poker";
import {actionLabel,buildTrainerPool,getActionTrail,nextAdaptiveSpot,nextTrainerSpot,TrainerAction,TrainerSpot} from "../../lib/trainerEngine";
import {calculatePotOdds,formatPercent,formatRatio} from "../../lib/pokerMath";
import {estimatePreflopEquityVsRfiRange} from "../../lib/equityRange";

type Progress={seen:number;score:number;rfiSeen:number;rfiScore:number;defenseSeen:number;defenseScore:number;misses:Record<string,number>};
const emptyProgress:Progress={seen:0,score:0,rfiSeen:0,rfiScore:0,defenseSeen:0,defenseScore:0,misses:{}};

export default function Trainer(){
 const pool=useMemo(()=>buildTrainerPool(),[]);
 const [spot,setSpot]=useState<TrainerSpot>(pool[0]);
 const [picked,setPicked]=useState<TrainerAction|null>(null);
 const [term,setTerm]=useState<string|null>(null);
 const [modeFilter,setModeFilter]=useState<"all"|"rfi"|"defense"|"review">("all");
 const [progress,setProgress]=useState<Progress>(emptyProgress);
 const [showMethod,setShowMethod]=useState(false);
 const [showMath,setShowMath]=useState(false);
 const [sessionSeen,setSessionSeen]=useState(0);
 const [sessionScore,setSessionScore]=useState(0);
 const sessionSize=10;
 useEffect(()=>{const raw=localStorage.getItem("pokersight-trainer-progress-v2");if(raw){try{setProgress({...emptyProgress,...JSON.parse(raw)})}catch{}}setSpot(nextTrainerSpot(pool));},[pool]);
 const activePool=modeFilter==="all"||modeFilter==="review"?pool:pool.filter(x=>x.mode===modeFilter);
 function choose(a:TrainerAction){
  if(picked)return;
  setPicked(a);
  const freq=spot.frequencies[a],ok=freq>0;
  const next={...progress,misses:{...progress.misses},seen:progress.seen+1,score:progress.score+(ok?1:0)};
  if(spot.mode==="rfi"){next.rfiSeen++;if(ok)next.rfiScore++}else{next.defenseSeen++;if(ok)next.defenseScore++}
  if(!ok)next.misses[spot.id]=(next.misses[spot.id]||0)+1;
  setProgress(next);localStorage.setItem("pokersight-trainer-progress-v2",JSON.stringify(next));setSessionSeen(v=>v+1);if(ok)setSessionScore(v=>v+1);
 }
 function next(){
  if(sessionSeen>=sessionSize)return;
  setPicked(null);setTerm(null);setSpot(nextAdaptiveSpot(activePool,progress.misses,spot.id,modeFilter==="review"));
 }
 function changeMode(v:"all"|"rfi"|"defense"|"review"){setModeFilter(v);setPicked(null);setSessionSeen(0);setSessionScore(0);const p=v==="all"||v==="review"?pool:pool.filter(x=>x.mode===v);setSpot(nextAdaptiveSpot(p,progress.misses,spot.id,v==="review"))}
 function restartSession(){setPicked(null);setSessionSeen(0);setSessionScore(0);setSpot(nextAdaptiveSpot(activePool,progress.misses,spot.id,modeFilter==="review"))}
 const mix=Object.entries(spot.frequencies).filter(([,v])=>v>0).map(([a,v])=>actionLabel(a as TrainerAction,spot.mode)+" "+v+"%").join(" · ");
 const actionTrail=getActionTrail(spot);
 const potOdds=spot.mode==="defense"?calculatePotOdds(4,1.5):null;
 const equity=picked&&spot.mode==="defense"?estimatePreflopEquityVsRfiRange(spot.hand,"BTN",3000):null;
 const quickEquity=potOdds?(potOdds.breakEvenEquity<0.235?"≈ 1/5":potOdds.breakEvenEquity<0.27?"≈ 1/4":potOdds.breakEvenEquity<0.295?"≈ 2/7":potOdds.breakEvenEquity<0.315?"≈ 3/10":potOdds.breakEvenEquity<0.36?"≈ 1/3":potOdds.breakEvenEquity<0.45?"≈ 2/5":"≈ 1/2"):null;
 const decisionFlow=spot.mode==="rfi"?["位置","前面动作","手牌","RFI Range","Raise / Fold"]:["位置","前面动作","手牌","对手 Range","价格","Equity","EV"];
 const hit=progress.seen?Math.round(progress.score/progress.seen*100):0;
 const topMisses=Object.entries(progress.misses).sort((a,b)=>b[1]-a[1]).slice(0,3);
 return <main><SiteNav/><section className="pageHead trainerHead compactTrainerHead"><div><p className="eyebrow">DYNAMIC PREFLOP TRAINER</p><h1>Preflop 实战训练</h1><p>从现有 Range 数据动态出题。先做决定，再看频率与解释。</p></div><div className="scoreCard"><small>总训练</small><strong>{progress.seen}</strong><span>可接受决策 {hit}%</span></div></section>
 <section className="trainerToolbar"><div className="segmented">{(["all","rfi","defense","review"] as const).map(v=><button key={v} disabled={v==="review"&&Object.keys(progress.misses).length===0} className={modeFilter===v?"active":""} onClick={()=>changeMode(v)}>{v==="all"?"全部":v==="rfi"?"RFI":v==="defense"?"Defense":"错题重练"}</button>)}</div><div className="trainerStats"><span>RFI {progress.rfiSeen?Math.round(progress.rfiScore/progress.rfiSeen*100):0}%</span><span>Defense {progress.defenseSeen?Math.round(progress.defenseScore/progress.defenseSeen*100):0}%</span><span>Session {sessionSeen}/{sessionSize}</span><span>本轮 {sessionSeen?Math.round(sessionScore/sessionSeen*100):0}%</span><button className="methodButton" onClick={()=>setShowMethod(true)}>这些频率怎么来的？</button></div></section>
 <section className="trainer">
  <div className="table"><div className="seat top">{spot.mode==="defense"?"BTN":"TABLE"}<br/><small>{spot.villain}</small></div><div className="felt"><span className="pot">POT {spot.pot}</span><div className="cards"><b>{spot.hand.split(" ")[0]}</b><b>{spot.hand.split(" ")[1]}</b></div><strong>Hero · <button className="term" onClick={()=>setTerm(spot.position)}>{spot.position}</button></strong><small>{spot.stack} effective</small></div><div className="seat bottom">YOU</div></div>
  <div className="decision"><div className="spotMeta"><span>{spot.mode==="rfi"?"RFI":"DEFENSE"}</span><b>{spot.handClass}</b></div><div className="decisionFlow" aria-label="Decision flow">{decisionFlow.map((step,i)=><span key={step} className={(picked||i<3)?"flowDone":i===3?"flowCurrent":""}><b>{i+1}</b>{step}</span>)}</div><div className="actionTrail" aria-label="Preflop action order">{actionTrail.map((item,i)=><div key={item.position} className={"actionStep "+(item.hero?"heroStep ":"")+(item.active?"activeStep":"")}><span>{item.position}</span><b>{item.action}</b>{i<actionTrail.length-1&&<i>→</i>}</div>)}</div><h2>{spot.prompt}</h2><p className="terms">本题概念：{spot.terms.map(x=><button key={x} onClick={()=>setTerm(x)}>{x}</button>)}</p>
   <div className="actions">{(["fold","call","raise"] as TrainerAction[]).map(a=>{const available=spot.frequencies[a]>0;return <button key={a} disabled={!!picked} className={picked===a?(available?"correct":"wrong"):""} onClick={()=>choose(a)}>{actionLabel(a,spot.mode)}</button>})}</div>
   {picked&&<div className="feedback"><span className="badge">{spot.frequencies[picked]>0?"✓ 参考策略允许这个动作":"→ 这个动作不在参考策略中"}</span><h3>参考频率：{mix}</h3><p>{spot.why}</p>{potOdds&&<><div className="mathStrip"><span><small>跟注成本</small><b>{potOdds.callCost.toFixed(1)} BB</b></span><span><small>底池赔率</small><b>{formatRatio(potOdds.rewardToRisk)}</b></span><span><small>最低权益</small><b>{formatPercent(potOdds.breakEvenEquity)} <em>{quickEquity}</em></b></span>{equity&&<><span><small>vs BTN RFI Equity</small><b>{formatPercent(equity.equity)}</b></span><span><small>高于门槛</small><b>{formatPercent(equity.equity-potOdds.breakEvenEquity)}</b></span><span><small>估算方法</small><b>{equity.samples.toLocaleString()} samples</b></span></>}</div><button className="mathExplainButton" onClick={()=>setShowMath(true)}>这些数字怎么算的？</button></>}<p className="note">Equity 使用 Hero 当前具体花色，对 BTN RFI 开池范围按 Raise 频率加权抽样，并随机发满 5 张公共牌。它是可复现的 Monte Carlo 估算，不是 JEV 输出；Pot Odds 门槛则由底池与跟注成本直接计算。</p>{sessionSeen>=sessionSize?<button className="next" onClick={restartSession}>本轮完成 · 再来 10 题 →</button>:<button className="next" onClick={next}>下一题 →</button>}</div>}
  </div>
 </section>
 <section className="trainerReview compactReview"><div><small>训练机制</small><strong>10</strong><span>每轮 10 题 · 错题自动加权</span></div><div><small>常错</small>{topMisses.length?topMisses.map(([id,n])=><span key={id}>{id.replaceAll("-"," ")} · 错 {n} 次</span>):<span>暂无错题；产生错题后可切到“错题重练”。</span>}</div></section>
 {showMath&&potOdds&&<div className="overlay" onClick={()=>setShowMath(false)}><article onClick={e=>e.stopPropagation()}><button className="close" onClick={()=>setShowMath(false)}>×</button><p className="eyebrow">POKER MATH</p><h2>这几个数字是怎么来的？</h2><div className="mathSteps"><div><b>1. 底池赔率 2.67:1</b><p>你行动前底池是 4BB，还需要补 1.5BB 才能跟注。底池赔率看的是“可赢到的底池 ÷ 你要付出的成本”：4 ÷ 1.5 = 2.67，所以写成 2.67:1。</p></div><div><b>2. 最低权益 27.3% · 实战速记≈2/7</b><p>最低所需 Equity = 跟注成本 ÷ 跟注后的总底池 = 1.5 ÷ (4 + 1.5) = 27.3%。实战不用追求小数点：把它记成约 28%，也就是约 2/7。常用锚点：1/5≈20%、1/4=25%、2/7≈28.6%、1/3≈33%、2/5=40%。</p></div>{equity&&<><div><b>3. vs BTN RFI Equity {formatPercent(equity.equity)}</b><p>这不是胜率表里的固定数字。PokerSight 用你当前两张具体手牌，对 BTN 的 RFI 开池 Range 按 Raise 频率加权抽样，再随机跑完公共牌，共模拟 {equity.samples.toLocaleString()} 次，估算你平均能获得多少底池权益。</p></div><div><b>4. 高于门槛 {formatPercent(equity.equity-potOdds.breakEvenEquity)}</b><p>这里只是做差：{formatPercent(equity.equity)} − {formatPercent(potOdds.breakEvenEquity)} = {formatPercent(equity.equity-potOdds.breakEvenEquity)}。它表示 Equity 比最低跟注门槛多出的“余量”，不是额外胜率，也还不是 EV。</p></div></>}</div><p className="note">这里先忽略未来街面策略、位置劣势、rake、实现 Equity 的难度等因素，所以它是学习用的基础数学判断，不等于完整 GTO 结论。</p><button className="next" onClick={()=>setShowMath(false)}>知道了</button></article></div>}{showMethod&&<div className="overlay" onClick={()=>setShowMethod(false)}><article onClick={e=>e.stopPropagation()}><button className="close" onClick={()=>setShowMethod(false)}>×</button><p className="eyebrow">STRATEGY SOURCE</p><h2>这些“概率”目前不是 JEV 实时算出来的</h2><strong>它们是训练数据中的动作频率。</strong><p>当前 RFI 与 BTN→BB Defense 频率来自我们已接入并注明来源的开源 preflop range 数据。PokerSight 把每个起手牌对应的 Raise / Call / Fold 百分比读出来，用于出题和反馈；页面本身没有运行 solver，也没有调用 JEV。</p><p>例如某手牌显示 Raise 25% · Fold 75%，意思是该参考策略在这个固定场景下以约 25% 频率加注、75% 频率弃牌。它不是“这手牌有 25% 胜率”。真正的 Equity、EV 和 JEV 决策层仍属于后续功能。</p><p className="note">当前假设以现有来源数据为准，不能把这些频率理解为所有筹码深度、rake、open size 和牌局环境下都通用的唯一答案。</p><button className="next" onClick={()=>setShowMethod(false)}>知道了</button></article></div>}{term&&glossary[term]&&<div className="overlay" onClick={()=>setTerm(null)}><article onClick={e=>e.stopPropagation()}><button className="close" onClick={()=>setTerm(null)}>×</button><p className="eyebrow">POKER TERM</p><h2>{term} · {glossary[term].zh}</h2><strong>{glossary[term].short}</strong><p>{glossary[term].detail}</p><button className="next" onClick={()=>setTerm(null)}>知道了</button></article></div>}
 </main>
}