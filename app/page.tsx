import Link from "next/link";import SiteNav from "./SiteNav";
const seats=[
  {pos:"UTG",name:"Player 1",stack:"100 BB",action:"Fold",cls:"seat-utg"},
  {pos:"HJ",name:"Player 2",stack:"98 BB",action:"Open 2.5BB",cls:"seat-hj"},
  {pos:"CO",name:"Player 3",stack:"104 BB",action:"Fold",cls:"seat-co"},
  {pos:"BTN",name:"Player 4",stack:"100 BB",action:"Dealer",cls:"seat-btn",dealer:true},
  {pos:"SB",name:"Player 5",stack:"99.5 BB",action:"0.5 BB",cls:"seat-sb",blind:true},
  {pos:"BB",name:"You",stack:"99 BB",action:"1 BB",cls:"seat-hero hero",blind:true}
];
export default function Home(){return <main><SiteNav/><section className="homeDashboard">
 <aside className="homeSidebar">
  <div className="homeIntro"><p className="eyebrow">POKER STUDY SYSTEM</p><h1>练决策，记范围，理解每一步为什么。</h1><p>训练、169 矩阵、术语与规则，围绕同一套 6-max Preflop 学习流程展开。</p></div>
  <div className="homeActions">
   <Link href="/trainer" className="homeAction primary"><small>01 · TRAINER</small><b>开始训练</b><span>做题 →</span></Link>
   <Link href="/matrix" className="homeAction"><small>02 · MATRIX</small><b>169 起手牌矩阵</b><span>查看 →</span></Link>
   <Link href="/learn" className="homeAction"><small>03 · LEARN</small><b>术语与规则</b><span>学习 →</span></Link>
  </div>
  <div className="homeStatus"><span><b>当前</b>M1 · Preflop Foundation</span><span><b>下一步</b>Defense Scenarios</span><span><b>模式</b>Study only</span></div>
 </aside>
 <section className="homeTableSection compactHomeTable">
  <div className="homeTableCopy"><p className="eyebrow">6-MAX POSITION MAP</p><h2>先建立位置感，再学习范围。</h2><p>UTG → HJ → CO → BTN → SB → BB。Hero 固定在下方，其他位置围绕 Hero 形成稳定视角。</p></div>
  <div className="pokerStage"><div className="pokerRail"><div className="pokerFelt"><div className="feltMark">POKERSIGHT</div><div className="potDisplay"><small>POT</small><strong>4 BB</strong><span>Preflop</span></div><div className="boardGhost"><i/><i/><i/><i/><i/></div></div></div>{seats.map(s=><Link href="/learn" key={s.pos} className={"tableSeat "+s.cls}><div className="avatar">{s.pos==="BB"?"YOU":s.pos}</div><div className="seatMeta"><div className="seatLine"><strong>{s.pos}</strong>{s.dealer&&<span className="dealerChip">D</span>}{s.blind&&<span className="blindChip">{s.pos}</span>}</div><span>{s.name}</span><small>{s.stack}</small></div><em className={"actionTag "+(s.action.includes("Open")?"active":"")}>{s.action}</em></Link>)}</div>
 </section>
 </section></main>}