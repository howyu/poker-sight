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
Open:{zh:"开池加注",short:"这一轮还没人加注时，你做出的第一次加注。",detail:"Open Raise。常见尺度例如 2BB、2.5BB。"},
"3-Bet":{zh:"再加注",short:"面对第一次加注后的再次加注。",detail:"它不是加到 3BB，而是这一轮下注序列中的第三次投入：盲注/初始下注、Raise、Re-raise。"},
Range:{zh:"范围",short:"玩家在某个局面可能持有的一组牌。",detail:"高手更多思考范围对范围，而不是猜对方恰好是哪两张牌。"},
Equity:{zh:"权益",short:"如果牌局进行到底，你赢得底池的理论份额。",detail:"例如 40% equity 可以粗略理解为大量重复相同局面时约获得 40% 的底池权益。"},
"Pot Odds":{zh:"底池赔率",short:"你为了继续游戏需要付出的成本，相对于继续后能争夺的底池。",detail:"用于判断一次跟注在数学上是否值得，通常需要与手牌 equity 配合判断。"}
};