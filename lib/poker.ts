export type Action="fold"|"call"|"raise";
export type Spot={id:number;position:string;villain:string;hand:string;stack:string;pot:string;prompt:string;answer:Action;mix:string;why:string;terms:string[]};
export const spots:Spot[]=[
{id:1,position:"BTN",villain:"CO open 2.5BB",hand:"A♠ J♠",stack:"100BB",pot:"4BB",prompt:"轮到你行动。你会怎么做？",answer:"raise",mix:"Raise 为主，少量 Call",why:"同花 AJ 在按钮位具有较强权益、位置优势和阻断效应，面对 CO 开池通常适合积极继续。",terms:["BTN","Open","BB","Range"]},
{id:2,position:"UTG",villain:"无人入池",hand:"7♣ 6♣",stack:"100BB",pot:"1.5BB",prompt:"你是第一个行动者。",answer:"fold",mix:"Fold 为主",why:"UTG 后面还有多名玩家未行动，需要更紧的起手范围；76s 虽有可玩性，但新手基准策略应避免过宽开池。",terms:["UTG","Open","Range","GTO"]},
{id:3,position:"BB",villain:"BTN open 2.5BB",hand:"K♥ Q♦",stack:"100BB",pot:"4BB",prompt:"大盲面对按钮位开池。",answer:"call",mix:"Call 为主，部分 Raise",why:"按钮位开池范围较宽，KQo 对该范围有足够权益；大盲已经投入 1BB，因此跟注价格更好。",terms:["BB","Pot Odds","Equity","3-Bet"]}
];
export const glossary:Record<string,{zh:string,short:string,detail:string}>={
GTO:{zh:"博弈论最优",short:"尽量不给对手留下可长期利用漏洞的平衡策略。",detail:"Game Theory Optimal。它不是每手牌只有一个答案，很多局面会按一定频率混合多个动作。"},
BTN:{zh:"按钮位",short:"通常是翻牌后最后行动的位置，位置优势最大。",detail:"Button。6-max 中属于后位，通常可以使用比前位更宽的起手范围。"},
UTG:{zh:"枪口位",short:"翻牌前最先行动的位置。",detail:"Under the Gun。因为后面还有很多玩家，所以通常需要较紧的开池范围。"},
BB:{zh:"大盲位",short:"强制投入大盲注的位置。",detail:"Big Blind。面对开池时，因为已经投入盲注，跟注所需的额外成本较低。"},
Open:{zh:"开池加注",short:"这一轮还没人加注时，你做出的第一次加注。",detail:"Open Raise。常见尺度例如 2BB、2.5BB、3BB。这里的 2.5BB 表示把总下注额加到大盲的 2.5 倍，并不是 2.5-Bet。"},
"3-Bet":{zh:"再加注",short:"面对第一次加注后的再次加注。",detail:"3-Bet 不是“加到 3 倍”或“加到 3BB”。它描述下注层级：盲注算第一层，Open Raise 是第二层，再次加注就是 3-Bet。比如 BTN open 到 2.5BB，BB 再加到 10BB，这仍然叫 3-Bet。"},"4-Bet":{zh:"再次再加注",short:"面对 3-Bet 后，原开池者或其他玩家继续加注。",detail:"例如 BTN open 2.5BB，BB 3-Bet 到 10BB，BTN 再加到 22BB，这一步叫 4-Bet。名称描述的是加注序列，不是下注倍数。"},"RFI":{zh:"率先入池加注",short:"前面所有人都弃牌后，你作为第一个加注者开池。",detail:"Raise First In。PokerSight 的 RFI Range 就是在这种“轮到你时前面没人进入底池”的场景下，查看不同位置应该用哪些起手牌开池。"},"Defense":{zh:"防守范围",short:"面对前位玩家的开池或加注时，你用哪些牌继续。",detail:"Defense 不是单一一张表。它取决于 Hero 位置、对手位置、open size、有效筹码和 rake。比如 BTN open→BB 与 UTG open→BB 的防守范围会明显不同。"},"SB":{zh:"小盲位",short:"强制投入 0.5BB 左右盲注的位置。",detail:"Small Blind。翻牌前通常在 BTN 后行动，翻牌后通常最先行动，因此位置劣势明显。"},"HJ":{zh:"Hijack",short:"6-max 中位于 UTG 与 CO 之间的位置。",detail:"Hijack。位置比 UTG 更靠后，因此通常可以使用略宽的开池范围。"},"CO":{zh:"Cutoff",short:"按钮位右手边的位置，是重要后位。",detail:"Cutoff。后面通常只剩 BTN、SB、BB，因此可以使用较宽的开池范围。"},"BB size":{zh:"BB 倍数",short:"用大盲注作为统一计量单位描述下注大小。",detail:"如果盲注是 10/20，那么 1BB=20，2.5BB=50，3BB=60。它是下注金额单位，和 3-Bet/4-Bet 的“Bet 层级”是两件完全不同的事。"},
Range:{zh:"范围",short:"玩家在某个局面可能持有的一组牌。",detail:"高手更多思考范围对范围，而不是猜对方恰好是哪两张牌。"},
Equity:{zh:"权益",short:"如果牌局进行到底，你赢得底池的理论份额。",detail:"例如 40% equity 可以粗略理解为大量重复相同局面时约获得 40% 的底池权益。"},
"Pot Odds":{zh:"底池赔率",short:"你为了继续游戏需要付出的成本，相对于继续后能争夺的底池。",detail:"最低所需 Equity = 跟注成本 ÷（当前底池 + 跟注成本）。例如当前底池 4BB，你还需跟 1.5BB，跟注后总底池 5.5BB，因此最低所需 Equity 约为 1.5÷5.5=27.3%。实际决策还要考虑对手范围、未来街面和 rake。"}
};