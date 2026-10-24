import SiteNav from "../SiteNav";
import styles from "./showdown.module.css";

const hands = [
  ["皇家同花顺", "A♠ K♠ Q♠ J♠ 10♠", "同花色的 A K Q J 10，是最大的同花顺。"],
  ["同花顺", "9♥ 8♥ 7♥ 6♥ 5♥", "五张同花色且连续；比较最高张。"],
  ["四条", "Q♠ Q♥ Q♦ Q♣ 9♠", "先比四张相同牌的点数，再比剩余一张（踢脚）。"],
  ["葫芦", "8♠ 8♥ 8♦ A♣ A♥", "先比三条，再比对子；88822 大于 777AA。"],
  ["同花", "A♦ J♦ 8♦ 6♦ 3♦", "五张同花色；从最大张起逐张比较，不比较花色。"],
  ["顺子", "8♠ 7♥ 6♦ 5♣ 4♥", "五张连续；比较最高张，花色无关。"],
  ["三条", "7♠ 7♥ 7♦ A♣ K♥", "先比三条，再按从大到小比较两张踢脚。"],
  ["两对", "K♠ K♥ 5♦ 5♣ A♥", "依次比大对子、小对子、最后一张踢脚。"],
  ["一对", "10♠ 10♥ A♦ J♣ 8♥", "先比对子，再从大到小比较三张踢脚。"],
  ["高牌", "A♠ J♥ 9♦ 6♣ 3♥", "没有以上牌型；五张从大到小逐张比较。"],
];
const examples = [
  {title:"同样一对，比踢脚", board:"A♠ 9♥ 7♦ 4♣ 2♥", a:"A♥ K♣", b:"A♦ Q♣", bestA:"A♠ A♥ K♣ 9♥ 7♦", bestB:"A♠ A♦ Q♣ 9♥ 7♦", result:"甲胜：同为一对 A，第一张踢脚 K > Q。"},
  {title:"两对，先比较大对子", board:"K♠ Q♥ 5♦ 2♣ 9♥", a:"K♥ 2♦", b:"Q♣ 9♣", bestA:"K♠ K♥ Q♥ 2♣ 2♦", bestB:"Q♥ Q♣ 9♥ 9♣ K♠", result:"甲胜：K 和 2 两对，大于 Q 和 9 两对，先比 K > Q。"},
  {title:"公共牌就是最好的五张", board:"A♠ K♥ Q♦ J♣ 10♥", a:"8♥ 8♣", b:"2♦ 3♦", bestA:"A♠ K♥ Q♦ J♣ 10♥", bestB:"A♠ K♥ Q♦ J♣ 10♥", result:"平局：双方都是 A 高顺子，手里的对子不参与比较。"},
  {title:"踢脚被公共牌盖过", board:"A♠ A♥ K♦ Q♣ J♥", a:"9♥ 8♣", b:"7♦ 6♦", bestA:"A♠ A♥ K♦ Q♣ J♥", bestB:"A♠ A♥ K♦ Q♣ J♥", result:"平局：双方最佳五张完全相同，不再比较第六、第七张。"},
];
function Cards({value}: {value:string}) {return <div className={styles.cards}>{value.split(" ").map((card,i)=><span key={i} className={/[♥♦]/.test(card)?styles.red:undefined}>{card}</span>)}</div>}
export default function Showdown(){return <main><SiteNav/><section className="pageHead"><div><p className="eyebrow">SHOWDOWN · BEST FIVE</p><h1>摊牌：五张牌怎么比大小</h1><p>从两张手牌和五张公共牌中，选出最强的五张。先比牌型，再比点数。</p></div></section>
<section className={styles.principles} aria-label="比较原则"><article><b>① 七选五</b><p>可以使用 0、1 或 2 张手牌，不必强行使用自己的牌。</p></article><article><b>② 先牌型，后点数</b><p>任意一对都胜过高牌；相同牌型按对应规则逐项比较。</p></article><article><b>③ 五张一样大就平局</b><p>花色不分大小，不比较第六、第七张；平局者平分有资格争夺的底池。</p></article></section>
<h2 className={styles.heading}>牌型顺序 <small>由强到弱 ↓</small></h2><p className={styles.note}>点数：A ＞ K ＞ Q ＞ J ＞ 10 ＞ … ＞ 2。皇家同花顺是同花顺的最高形式。</p>
<section className={styles.rankings} aria-label="牌型大小排序">{hands.map(([name,cards,rule],i)=><article className={styles.rank} key={name}><span className={styles.number}>{String(i+1).padStart(2,"0")}</span><h3>{name}</h3><Cards value={cards}/><p>{rule}</p></article>)}</section>
<section className={styles.notice}><h2>A 在顺子中有两个位置</h2><p>A K Q J 10 是最大的顺子；5 4 3 2 A 是最小的顺子（5 高）。A 不能绕圈连接，所以 Q K A 2 3 不是顺子。同花顺也遵循这条规则。</p></section>
<h2 className={styles.heading}>看四组摊牌，理解怎么比较</h2><section className={styles.examples}>{examples.map(e=><article className={styles.example} key={e.title}><h3>{e.title}</h3><small>公共牌</small><Cards value={e.board}/><div className={styles.players}><div><b>甲 · 手牌</b><Cards value={e.a}/><small>最佳五张</small><Cards value={e.bestA}/></div><div><b>乙 · 手牌</b><Cards value={e.b}/><small>最佳五张</small><Cards value={e.bestB}/></div></div><p className={styles.result}>{e.result}</p></article>)}</section><p className={styles.note}>这里讲的是标准德州扑克。若所有对手都弃牌，剩下的玩家直接赢得底池，无须等到摊牌。</p></main>}
