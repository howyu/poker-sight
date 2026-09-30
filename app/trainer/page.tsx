"use client";
import {useEffect,useMemo,useState} from "react";
import SiteNav from "../SiteNav";
import {glossary} from "../../lib/poker";
import {actionLabel,buildTrainerPool,nextTrainerSpot,TrainerAction,TrainerSpot} from "../../lib/trainerEngine";

type Progress={seen:number;score:number;rfiSeen:number;rfiScore:number;defenseSeen:number;defenseScore:number;misses:Record<string,number>};
const emptyProgress:Progress={seen:0,score:0,rfiSeen:0,rfiScore:0,defenseSeen:0,defenseScore:0,misses:{}};

export default function Trainer(){
 const pool=useMemo(()=>buildTrainerPool(),[]);
 const [spot,setSpot]=useState<TrainerSpot>(pool[0]);
 const [picked,setPicked]=useState<TrainerAction|null>(null);
 const [term,setTerm]=useState<string|null>(null);
 const [modeFilter,setModeFilter]=useState<"all"|"rfi"|"defense">("all");
 const [progress,setProgress]=useState<Progress>(emptyProgress);
 useEffect(()=>{const raw=localStorage.getItem("pokersight-trainer-progress-v2");if(raw){try{setProgress({...emptyProgress,...JSON.parse(raw)})}catch{}}setSpot(nextTrainerSpot(pool));},[pool]);
 const activePool=modeFilter==="all"?pool:pool.filter(x=>x.mode===modeFilter);
 function choose(a:TrainerAction){
  if(picked)return;
  setPicked(a);
  const freq=spot.frequencies[a],ok=freq>0;
  const next={...progress,misses:{...progress.misses},seen:progress.seen+1,score:progress.score+(ok?1:0)};
  if(spot.mode==="rfi"){next.rfiSeen++;if(ok)next.rfiScore++}else{next.defenseSeen++;if(ok)next.defenseScore++}
  if(!ok)next.misses[spot.id]=(next.misses[spot.id]||0)+1;
  setProgress(next);localStorage.setItem("pokersight-trainer-progress-v2",JSON.stringify(next));
 }
 function next(){
  setPicked(null);setTerm(null);setSpot(nextTrainerSpot(activePool,spot.id));
 }
 function changeMode(v:"all"|"rfi"|"defense"){setModeFilter(v);setPicked(null);const p=v==="all"?pool:pool.filter(x=>x.mode===v);setSpot(nextTrainerSpot(p,spot.id))}
 const mix=Object.entries(spot.frequencies).filter(([,v])=>v>0).map(([a,v])=>actionLabel(a as TrainerAction,spot.mode)+" "+v+"%").join(" · ");
 const hit=progress.seen?Math.round(progress.score/progress.seen*100):0;
 const topMisses=Object.entries(progress.misses).sort((a,b)=>b[1]-a[1]).slice(0,3);
 return <main><SiteNav/><section className="pageHead trainerHead"><div><p className="eyebrow">DYNAMIC PREFLOP TRAINER</p><h1>Preflop 实战训练</h1><p>题目从当前 Range 数据动态生成，不再循环固定样例。先做决定，再看频率与解释。</p></div><div className="scoreCard"><small>总训练</small><strong>{progress.seen}</strong><span>可接受决策 {hit}%</span></div></section>
 <section className="trainerToolbar"><div className="segmented">{(["all","rfi","defense"] as const).map(v=><button key={v} className={modeFilter===v?"active":""} onClick={()=>changeMode(v)}>{v==="all"?"全部":v==="rfi"?"RFI":"Defense"}</button>)}</div><div className="trainerStats"><span>RFI {progress.rfiSeen?Math.round(progress.rfiScore/progress.rfiSeen*100):0}%</span><span>Defense {progress.defenseSeen?Math.round(progress.defenseScore/progress.defenseSeen*100):0}%</span><span>题库 {activePool.length}</span></div></section>
 <section className="trainer">
  <div className="table"><div className="seat top">{spot.mode==="defense"?"BTN":"TABLE"}<br/><small>{spot.villain}</small></div><div className="felt"><span className="pot">POT {spot.pot}</span><div className="cards"><b>{spot.hand.split(" ")[0]}</b><b>{spot.hand.split(" ")[1]}</b></div><strong>Hero · <button className="term" onClick={()=>setTerm(spot.position)}>{spot.position}</button></strong><small>{spot.stack} effective</small></div><div className="seat bottom">YOU</div></div>
  <div className="decision"><div className="spotMeta"><span>{spot.mode==="rfi"?"RFI":"DEFENSE"}</span><b>{spot.handClass}</b></div><h2>{spot.prompt}</h2><p className="terms">本题概念：{spot.terms.map(x=><button key={x} onClick={()=>setTerm(x)}>{x}</button>)}</p>
   <div className="actions">{(["fold","call","raise"] as TrainerAction[]).map(a=>{const available=spot.frequencies[a]>0;return <button key={a} disabled={!!picked} className={picked===a?(available?"correct":"wrong"):""} onClick={()=>choose(a)}>{actionLabel(a,spot.mode)}</button>})}</div>
   {picked&&<div className="feedback"><span className="badge">{spot.frequencies[picked]>0?"✓ 参考策略允许这个动作":"→ 这个动作不在参考策略中"}</span><h3>参考频率：{mix}</h3><p>{spot.why}</p><p className="note">混合策略意味着多个动作都可能正确；训练器按“该动作是否具有非零参考频率”判断可接受性，而不是强行只认一个答案。</p><button className="next" onClick={next}>下一题 →</button></div>}
  </div>
 </section>
 <section className="trainerReview"><div><small>题库覆盖</small><strong>{pool.length}</strong><span>845 个 RFI spot + 169 个 BTN→BB Defense spot</span></div><div><small>复习提示</small>{topMisses.length?topMisses.map(([id,n])=><span key={id}>{id.replaceAll("-"," ")} · 错 {n} 次</span>):<span>完成更多题目后，这里会显示最常错场景。</span>}</div></section>
 {term&&glossary[term]&&<div className="overlay" onClick={()=>setTerm(null)}><article onClick={e=>e.stopPropagation()}><button className="close" onClick={()=>setTerm(null)}>×</button><p className="eyebrow">POKER TERM</p><h2>{term} · {glossary[term].zh}</h2><strong>{glossary[term].short}</strong><p>{glossary[term].detail}</p><button className="next" onClick={()=>setTerm(null)}>知道了</button></article></div>}
 </main>
}