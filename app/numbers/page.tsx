import SiteNav from "../SiteNav";
import styles from "./numbers.module.css";

const draws = [
  [4, "卡顺：缺中间一张", "如 5、6、8、9 等 7"],
  [8, "两头顺", "如 5、6、7、8 等 4 或 9"],
  [9, "四张同花听牌", "同花色共 13 张，已见 4 张"],
  [12, "同花听牌 + 卡顺", "9 + 4 − 1 张重叠"],
  [15, "同花听牌 + 两头顺", "9 + 8 − 2 张重叠"],
] as const;
const sizes = [1/4,1/3,1/2,2/3,3/4,1,1.5,2];
const labels = ["1/4 底池","1/3 底池","1/2 底池","2/3 底池","3/4 底池","1 倍底池","1.5 倍底池","2 倍底池"];
const pct = (n:number) => `${(n*100).toFixed(1)}%`;
export default function Numbers(){return <main><SiteNav/><section className="pageHead"><div><p className="eyebrow">POKER MATH · QUICK REFERENCE</p><h1>值得记住的数字</h1><p>先记常用近似值，再用公式核对。下注前先确认：还有几张牌、付多少钱、能赢多大底池。</p></div></section>
<section className={styles.memory} aria-label="速记口诀"><article><strong>2 / 4</strong><b>一张 ×2，两张 ×4</b><p>补牌数 ×2 ≈ 下一张命中率；×4 ≈ 翻牌到河牌命中率。</p></article><article><strong>4 / 8 / 9</strong><b>卡顺 / 两头顺 / 同花</b><p>常见补牌数；重叠只算一次，还要排除不能赢的补牌。</p></article><article><strong>20 / 25 / 33</strong><b>面对 1/3、1/2、满池下注</b><p>跟注所需胜率约为 20%、25%、33%。不计抽水与后续下注。</p></article></section>
<h2>① 听牌：几张牌能帮我？</h2><p className={styles.note}>Out（补牌）指能让你获胜的未见牌。下表计算“命中指定补牌”的概率，不直接等于最终赢牌率；对手可能反超，成顺或成花也可能仍输。</p>
<div className={styles.scroller}><table><caption>补牌命中率 · 一位小数，按未知牌等可能计算</caption><thead><tr><th scope="col">补牌数</th><th scope="col">常见情形</th><th scope="col">翻牌 → 转牌</th><th scope="col">转牌 → 河牌</th><th scope="col">翻牌 → 河牌</th></tr></thead><tbody>{draws.map(([n,name,detail])=><tr key={n}><th scope="row">{n}</th><td><b>{name}</b><small>{detail}</small></td><td>{pct(n/47)}</td><td>{pct(n/46)}</td><td>{pct(1-(47-n)*(46-n)/(47*46))}</td></tr>)}</tbody></table></div>
<aside className={styles.callout}><b>×4 的前提：能看到后面两张牌</b><p>例如翻牌有 9 张同花补牌，看到河牌约 35%；但若跟注只买到一张转牌，应先用约 19% 计算，不能直接拿 35% 判断这次跟注。补牌很多时 ×4 误差变大：15 张是约 54%，并非 60%。</p><p>公式：下一张 = 补牌数 ÷ 未知牌数；翻牌到河牌 = 1 − (47 − 补牌数) / 47 × (46 − 补牌数) / 46。</p></aside>
<h2>② 下注比例：记住同一张表的两列</h2><p className={styles.note}>P = 对手下注前的底池；B = 本次下注；你面对单个下注、跟注额也是 B。两列分别回答“我能不能跟”和“我的纯诈唬要成功多少次”。</p>
<div className={styles.scroller}><table><caption>单挑、无抽水、无后续下注的简化模型</caption><thead><tr><th scope="col">下注 B / P</th><th scope="col">跟注所需胜率<br/><small>B / (P + 2B)</small></th><th scope="col">纯诈唬所需弃牌率<br/><small>B / (P + B)</small></th></tr></thead><tbody>{sizes.map((s,i)=><tr key={s}><th scope="row">{labels[i]}</th><td>{pct(s/(1+2*s))}</td><td>{pct(s/(1+s))}</td></tr>)}</tbody></table></div>
<section className={styles.examples}><article><h3>底池 100，对手下注 50</h3><p>你付 50，争夺跟注后的 200：<strong>50 ÷ (100 + 50 + 50) = 25%</strong>。这是盈亏平衡门槛，超过才有正期望。</p></article><article><h3>底池 100，你纯诈唬下注 50</h3><p>失败损失 50，成功赢走原底池 100：<strong>50 ÷ (100 + 50) ≈ 33%</strong>。假设被跟注后必输、没有后续行动。</p></article></section>
<aside className={styles.callout}><b>底池赔率：1/3 池 → 20%，半池 → 25%，满池 → 33%</b><p>如果你看到的“当前底池”已经含对手下注，就用：跟注额 ÷（当前底池 + 跟注额）。不要把对手下注再加两次。有加注、多人或边池时，按实际跟注成本和有资格争夺的底池重新计算。</p></aside>
<h2>③ 翻牌前：组合数与常见概率</h2><section className={styles.facts}><article><strong>1,326 → 169</strong><h3>具体组合 → 起手牌类别</h3><p>52 × 51 ÷ 2 = 1,326 种两张手牌；矩阵合并花色后有 169 类，各类出现概率并不相同。</p></article><article><strong>6 / 4 / 12</strong><h3>对子 / 同花非对子 / 非同花非对子</h3><p>AA 有 6 个组合；AKs 有 4 个；AKo 有 12 个。看到自己的牌与公共牌后，要扣除被阻断的组合。</p></article><article><strong>0.45% / 5.9%</strong><h3>拿到 AA / 任意口袋对子</h3><p>AA：6 ÷ 1,326，约每 221 手一次。任意对子：78 ÷ 1,326，约每 17 手一次。</p></article><article><strong>11.8%</strong><h3>口袋对子在翻牌中至少命中一张同点数牌</h3><p>包括三条与四条：1 − C(48,3) ÷ C(50,3)，约每 8.5 次一次。命中也不保证获胜。</p></article></section>
<p className={styles.note}>适用于标准 52 张牌德州扑克。这些是计算工具：实际决策还要考虑对手范围、位置、后续投入、抽水和胜率能否兑现；“命中听牌”与“赢下底池”是两件事。</p></main>}
