import {compare,evaluateHoldem} from "@poker-apprentice/hand-evaluator";
import {getRfiAction,RfiPosition} from "./preflopRanges";

const ranks=["A","K","Q","J","T","9","8","7","6","5","4","3","2"];
const suits=["s","h","d","c"];
const suitMap:Record<string,string>={"♠":"s","♥":"h","♦":"d","♣":"c"};

export type EquityEstimate={
  equity:number;
  wins:number;
  ties:number;
  losses:number;
  samples:number;
  opponentPosition:RfiPosition;
  method:"weighted-monte-carlo";
};

function hashSeed(input:string){
 let h=2166136261;
 for(let i=0;i<input.length;i++){h^=input.charCodeAt(i);h=Math.imul(h,16777619)}
 return h>>>0;
}
function rng(seed:number){
 let x=seed||123456789;
 return()=>{x^=x<<13;x^=x>>>17;x^=x<<5;return(x>>>0)/4294967296};
}
function toCard(token:string){
 const rank=token[0],suit=suitMap[token[1]]??token[1];
 return rank+suit;
}
export function parseDisplayHand(display:string){return display.split(" ").map(toCard)}

function comboCards(handClass:string){
 const a=handClass[0],b=handClass[1],kind=handClass[2];
 const out:string[][]=[];
 if(!kind){
  for(let i=0;i<suits.length;i++)for(let j=i+1;j<suits.length;j++)out.push([a+suits[i],b+suits[j]]);
 }else if(kind==="s"){
  for(const s of suits)out.push([a+s,b+s]);
 }else{
  for(const sa of suits)for(const sb of suits)if(sa!==sb)out.push([a+sa,b+sb]);
 }
 return out;
}

function weightedOpponentCombos(position:RfiPosition,blocked:Set<string>){
 const out:{cards:string[];weight:number}[]=[];
 for(const a of ranks)for(const b of ranks){
  const ia=ranks.indexOf(a),ib=ranks.indexOf(b);
  if(ia>ib)continue;
  const classes=ia===ib?[a+b]:[a+b+"s",a+b+"o"];
  for(const handClass of classes){
   const weight=getRfiAction(position,handClass).raise/100;
   if(weight<=0)continue;
   for(const cards of comboCards(handClass)){
    if(cards.some(c=>blocked.has(c)))continue;
    out.push({cards,weight});
   }
  }
 }
 return out;
}

function drawWeighted<T extends {weight:number}>(items:T[],random:()=>number){
 const total=items.reduce((s,x)=>s+x.weight,0);
 let target=random()*total;
 for(const item of items){target-=item.weight;if(target<=0)return item}
 return items[items.length-1];
}

export function estimatePreflopEquityVsRfiRange(
 heroDisplay:string,
 opponentPosition:RfiPosition="BTN",
 samples=4000
):EquityEstimate{
 const hero=parseDisplayHand(heroDisplay);
 const blocked=new Set(hero);
 const opponents=weightedOpponentCombos(opponentPosition,blocked);
 const deck=ranks.flatMap(r=>suits.map(s=>r+s)).filter(c=>!blocked.has(c));
 const random=rng(hashSeed(heroDisplay+"|"+opponentPosition+"|"+samples));
 let wins=0,ties=0,losses=0;
 for(let n=0;n<samples;n++){
  const opponent=drawWeighted(opponents,random).cards;
  const available=deck.filter(c=>!opponent.includes(c));
  for(let i=0;i<5;i++){
   const j=i+Math.floor(random()*(available.length-i));
   [available[i],available[j]]=[available[j],available[i]];
  }
  const board=available.slice(0,5);
  const heroEval=evaluateHoldem({holeCards:hero as any,communityCards:board as any});
  const oppEval=evaluateHoldem({holeCards:opponent as any,communityCards:board as any});
  const result=compare(heroEval,oppEval);
  if(result<0)wins++;else if(result===0)ties++;else losses++;
 }
 return{equity:(wins+ties/2)/samples,wins,ties,losses,samples,opponentPosition,method:"weighted-monte-carlo"};
}
