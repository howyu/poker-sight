const {evaluateHoldem,compare}=require('@poker-apprentice/hand-evaluator');
const fs=require('node:fs');const ranks='AKQJT98765432',suits='shdc';const deck=Array.from(ranks).flatMap(r=>Array.from(suits).map(s=>r+s));
let x=20261024;function random(){x^=x<<13;x^=x>>>17;x^=x<<5;return (x>>>0)/4294967296}
const samples=Number(process.env.EQUITY_SAMPLES||100000);const hands={};let started=Date.now();
for(let r=0;r<13;r++)for(let c=0;c<13;c++){
const h=r===c?ranks[r]+ranks[c]:r<c?ranks[r]+ranks[c]+'s':ranks[c]+ranks[r]+'o';
const hero=[h[0]+'s',h[1]+(h.endsWith('s')?'s':'h')];const available=deck.filter(c=>!hero.includes(c));let wins=0,ties=0;
for(let i=0;i<samples;i++){
// Partial Fisher–Yates draws 2 opponent and 5 community cards without replacement.
for(let j=0;j<7;j++){const k=j+Math.floor(random()*(50-j));const v=available[j];available[j]=available[k];available[k]=v;}
const board=available.slice(2,7);const result=compare(evaluateHoldem({holeCards:hero,communityCards:board}),evaluateHoldem({holeCards:available.slice(0,2),communityCards:board}));
if(result<0)wins++;else if(result===0)ties++;
}
hands[h]={win:wins/samples,tie:ties/samples,equity:(wins+ties/2)/samples};
if(Object.keys(hands).length%26===0)process.stdout.write(Object.keys(hands).length+' hands '+Math.round((Date.now()-started)/1000)+'s\n');
}
fs.writeFileSync('lib/preflopRandomEquity.json',JSON.stringify({method:'seeded-monte-carlo',seed:20261024,samplesPerHand:samples,opponents:1,range:'uniform-random-legal-combinations',hands},null,2)+'\n');
console.log('Complete',Math.round((Date.now()-started)/1000)+'s');
