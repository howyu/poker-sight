export type PotOddsResult={
  potBeforeCall:number;
  callCost:number;
  potAfterCall:number;
  rewardToRisk:number;
  breakEvenEquity:number;
};

export function calculatePotOdds(potBeforeCall:number,callCost:number):PotOddsResult{
  const potAfterCall=potBeforeCall+callCost;
  return {
    potBeforeCall,
    callCost,
    potAfterCall,
    rewardToRisk:potBeforeCall/callCost,
    breakEvenEquity:callCost/potAfterCall
  };
}

export function formatPercent(value:number,digits=1){
  return (value*100).toFixed(digits)+"%";
}

export function formatRatio(value:number,digits=2){
  return value.toFixed(digits)+":1";
}

export type SimplifiedCallEvResult={
  callEv:number;
  foldEv:0;
  edgeBb:number;
};

export function calculateSimplifiedCallEv(equity:number,potBeforeCall:number,callCost:number):SimplifiedCallEvResult{
  const potAfterCall=potBeforeCall+callCost;
  const callEv=equity*potAfterCall-callCost;
  return {callEv,foldEv:0,edgeBb:callEv};
}

export function formatBb(value:number,digits=2){
  const sign=value>0?"+":"";
  return sign+value.toFixed(digits)+" BB";
}
