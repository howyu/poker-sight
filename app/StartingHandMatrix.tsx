"use client";
import {useMemo,useState} from "react";
import {getRfiAction,getRfiPercent,RfiPosition} from "../lib/preflopRanges";
import {getBtnVsBbAction,getBtnVsBbDefensePercent} from "../lib/defenseRanges";
const ranks=["A","K","Q","J","T","9","8","7","6","5","4","3","2"];
const positions=["UTG","HJ","CO","BTN","SB"] as const;
function hand(r:number,c:number){if(r===c)return ranks[r]+ranks[c];return r<c?ranks[r]+ranks[c]+"s":ranks[c]+ranks[r]+"o"}
function group(h:string){const a=h[0],b=h[1],pair=h.length===2,s=h.endsWith("s");if(pair){const i=ranks.indexOf(a);return i<=2?"premium":i<=6?"strong":"speculative"}const ai=ranks.indexOf(a),bi=ranks.indexOf(b);if(ai<=1&&bi<=3)return"strong";if(s&&Math.abs(ai-bi)<=2&&ai<=7)return"playable";if((a==="A"||a==="K")&&bi<=8)return"playable";return"marginal"}
const copy:Record<string,string>={premium:"顶级对子",strong:"强牌",playable:"可玩牌",speculative:"投机对子",marginal:"边缘牌"};
export default function StartingHandMatrix(){
 const [selected,setSelected]=useState("AA"),[mode,setMode]=useState<"strength"|"range"|"defense">("strength"),[position,setPosition]=useState<(typeof positions)[number]>("UTG");
 const cells=useMemo(()=>ranks.flatMap((_,r)=>ranks.map((_,c)=>{const h=hand(r,c);return{h,g:group(h)}})),[]);
 const g=group(selected),rfi=getRfiAction(position as RfiPosition,selected),def=getBtnVsBbAction(selected);
 const selectedLabel=mode==="strength"?copy[g]:mode==="range"?("Raise "+rfi.raise+"% · Fold "+rfi.fold+"%"):("3-Bet "+def.raise+"% · Call "+def.call+"% · Fold "+def.fold+"%");
 return <section className="matrixSection">
  <div className="matrixIntro"><div><p className="eyebrow">169 STARTING HANDS</p><h2>从牌型记忆，进阶到位置策略。</h2><p>用同一张 169 矩阵切换牌型、RFI 和 Defense，形成稳定的视觉记忆。</p></div><div className="selectedHand"><small>当前选择</small><strong>{selected}</strong><span>{selectedLabel}</span></div></div>
  <div className="matrixToolbar"><div className="segmented"><button className={mode==="strength"?"active":""} onClick={()=>setMode("strength")}>牌型记忆</button><button className={mode==="range"?"active":""} onClick={()=>setMode("range")}>RFI Range</button><button className={mode==="defense"?"active":""} onClick={()=>setMode("defense")}>Defense</button></div>{mode==="range"&&<div className="positionTabs">{positions.map(p=><button key={p} className={position===p?"active":""} onClick={()=>setPosition(p)}>{p}</button>)}</div>}</div>
  {mode==="range"&&<div className="rangeSummary"><div><b>{position}</b><span>参考开池范围约 {getRfiPercent(position as RfiPosition).toFixed(1)}%</span></div><p>100BB 6-max 来源化教学参考；rake、open size 和 solver assumptions 会改变边界牌。</p></div>}
  {mode==="defense"&&<div className="rangeSummary"><div><b>BTN Open → BB</b><span>参考防守约 {getBtnVsBbDefensePercent().toFixed(1)}%</span></div><p>Hero 固定在 BB；矩阵同时显示 3-Bet、Call 与 Fold。后续再扩展 CO→BB、SB→BB 等场景。</p></div>}
  <div className="matrixScroller"><div className={"handMatrix "+(mode!=="strength"?"rangeMode":"")}>{cells.map(({h,g})=>{const a=mode==="range"?getRfiAction(position as RfiPosition,h):mode==="defense"?getBtnVsBbAction(h):null;let cls=g;if(mode==="range")cls=a!.raise===100?"range-raise":a!.raise>0?"range-mix":"range-fold";if(mode==="defense")cls=a!.raise===100?"def-3bet":a!.call===100?"def-call":a!.fold===100?"range-fold":"def-mix";return <button key={h} className={"handCell "+cls+(selected===h?" selected":"")} onClick={()=>setSelected(h)}><b>{h}</b>{mode!=="strength"&&a&&((a.raise>0&&a.raise<100)||(mode==="defense"&&a.call>0&&a.fold>0))?<small>{mode==="defense"?a.raise+"/"+a.call:a.raise}</small>:null}</button>})}</div></div>
  {mode==="strength"?<div className="matrixLegend"><span><i className="premium"/>顶级</span><span><i className="strong"/>强牌</span><span><i className="playable"/>可玩</span><span><i className="speculative"/>对子</span><span><i className="marginal"/>边缘</span></div>:mode==="range"?<div className="matrixLegend rangeLegend"><span><i className="raise"/>Raise 100%</span><span><i className="mix"/>Mixed Raise</span><span><i className="fold"/>Fold</span></div>:<div className="matrixLegend rangeLegend"><span><i className="threebet"/>3-Bet</span><span><i className="call"/>Call</span><span><i className="defmix"/>Mixed</span><span><i className="fold"/>Fold</span></div>}
  <p className="matrixNote">{mode==="strength"?"粗略强弱只用于建立视觉记忆，不等同于任何位置的策略。":"策略数据改编自 MIT 许可的 tyloo/poker-range-analyzer；PokerSight 将其作为有来源的学习参考，不宣称跨所有牌局条件通用。"}</p>
 </section>
}