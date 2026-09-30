"use client";
import {useMemo,useState} from "react";
import {getRfiAction,getRfiPercent,RfiPosition} from "../lib/preflopRanges";
const ranks=["A","K","Q","J","T","9","8","7","6","5","4","3","2"];
const positions=["UTG","HJ","CO","BTN","SB","BB"] as const;
function hand(r:number,c:number){if(r===c)return ranks[r]+ranks[c];return r<c?ranks[r]+ranks[c]+"s":ranks[c]+ranks[r]+"o"}
function group(h:string){const a=h[0],b=h[1],pair=h.length===2,s=h.endsWith("s");if(pair){const i=ranks.indexOf(a);return i<=2?"premium":i<=6?"strong":"speculative"}const ai=ranks.indexOf(a),bi=ranks.indexOf(b);if(ai<=1&&bi<=3)return"strong";if(s&&Math.abs(ai-bi)<=2&&ai<=7)return"playable";if((a==="A"||a==="K")&&bi<=8)return"playable";return"marginal"}
const copy:Record<string,string>={premium:"顶级对子",strong:"强牌",playable:"可玩牌",speculative:"投机对子",marginal:"边缘牌"};
export default function StartingHandMatrix(){
 const [selected,setSelected]=useState("AA"),[mode,setMode]=useState<"strength"|"range">("strength"),[position,setPosition]=useState<(typeof positions)[number]>("UTG");
 const cells=useMemo(()=>ranks.flatMap((_,r)=>ranks.map((_,c)=>{const h=hand(r,c);return{h,g:group(h)}})),[]);
 const g=group(selected);
 const action=position==="BB"?null:getRfiAction(position as RfiPosition,selected);
 const pct=position==="BB"?null:getRfiPercent(position as RfiPosition);
 const selectedLabel=mode==="strength"?copy[g]:position==="BB"?"Defense 需指定对手":action?("Raise "+action.raise+"% · Fold "+action.fold+"%"):"Fold 100%";
 return <section className="matrixSection">
  <div className="matrixIntro"><div><p className="eyebrow">169 STARTING HANDS</p><h2>从牌型记忆，进阶到位置 Range。</h2><p>先看 169 类起手牌的结构，再切换到 RFI 模式理解不同位置为什么越靠后可以开得越宽。</p></div><div className="selectedHand"><small>当前选择</small><strong>{selected}</strong><span>{selectedLabel}</span></div></div>
  <div className="matrixToolbar"><div className="segmented"><button className={mode==="strength"?"active":""} onClick={()=>setMode("strength")}>牌型记忆</button><button className={mode==="range"?"active":""} onClick={()=>setMode("range")}>RFI Range</button></div>{mode==="range"&&<div className="positionTabs">{positions.map(p=><button key={p} className={position===p?"active":""} onClick={()=>setPosition(p)}>{p}</button>)}</div>}</div>
  {mode==="range"&&<div className="rangeSummary"><div><b>{position}</b><span>{position==="BB"?"BB 没有 folded-to RFI 场景":("参考开池范围约 "+pct?.toFixed(1)+"%")}</span></div><p>{position==="BB"?"BB 的决策必须指定前位开池者与尺寸；后续会做 BTN vs BB、SB vs BB 等 Defense 场景。":"当前为 100BB 6-max 的来源化教学参考；不同 rake、open size 与 solver assumptions 会改变边界手牌。"}</p></div>}
  <div className="matrixScroller"><div className={"handMatrix "+(mode==="range"?"rangeMode":"")}>{cells.map(({h,g})=>{const a=position==="BB"?null:getRfiAction(position as RfiPosition,h);const cls=mode==="strength"?g:position==="BB"?"range-disabled":a&&a.raise===100?"range-raise":a&&a.raise>0?"range-mix":"range-fold";return <button key={h} className={"handCell "+cls+(selected===h?" selected":"")} onClick={()=>setSelected(h)} aria-label={"查看 "+h}><b>{h}</b>{mode==="range"&&position!=="BB"&&a&&a.raise>0&&a.raise<100?<small>{a.raise}</small>:null}</button>})}</div></div>
  {mode==="strength"?<div className="matrixLegend"><span><i className="premium"/>顶级</span><span><i className="strong"/>强牌</span><span><i className="playable"/>可玩</span><span><i className="speculative"/>对子</span><span><i className="marginal"/>边缘</span></div>:<div className="matrixLegend rangeLegend"><span><i className="raise"/>Raise 100%</span><span><i className="mix"/>Mixed Raise</span><span><i className="fold"/>Fold</span></div>}
  <p className="matrixNote">{mode==="strength"?"粗略强弱只用于建立视觉记忆，不等同于任何位置的策略。":"Range 数据改编自 MIT 许可的 tyloo/poker-range-analyzer；PokerSight 将其作为有来源的学习参考，不宣称它是跨所有牌局条件通用的唯一 GTO。详见 THIRD_PARTY_NOTICES.md。"}</p>
 </section>
}