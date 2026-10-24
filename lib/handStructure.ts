/** Mutually exclusive teaching groups, not strength rankings or solver ranges. */
export const structureGroups = {
  'pair-high': {label:'大对子', rule:'JJ–AA', color:'#7259bd'},
  'pair-mid': {label:'中对子', rule:'77–TT', color:'#4d65ad'},
  'pair-low': {label:'小对子', rule:'22–66', color:'#477a93'},
  'broadway-suited': {label:'同花大牌', rule:'两张均为 T–A，同花', color:'#387e76'},
  'broadway-offsuit': {label:'非同花大牌', rule:'两张均为 T–A，非同花', color:'#627852'},
  'ace-suited': {label:'同花 A 小牌', rule:'A2s–A9s', color:'#927138'},
  'connector-suited': {label:'同花连张', rule:'相邻点数，排除上面各类', color:'#9b6550'},
  'gap-suited': {label:'同花隔一张', rule:'点数差 2，排除上面各类', color:'#945c80'},
  'other-suited': {label:'其他同花', rule:'剩余同花非对子', color:'#526377'},
  'other-offsuit': {label:'其他非同花', rule:'剩余非同花非对子', color:'#353b47'},
} as const;
export type StructureGroup = keyof typeof structureGroups;
const order='23456789TJQKA';
export function handStructure(h:string):StructureGroup {
  const [a,b]=h;
  if(h.length===2) return 'JQKA'.includes(a)?'pair-high':'789T'.includes(a)?'pair-mid':'pair-low';
  const suited=h.endsWith('s');
  if('TJQKA'.includes(a)&&'TJQKA'.includes(b)) return suited?'broadway-suited':'broadway-offsuit';
  if(!suited) return 'other-offsuit';
  if(a==='A') return 'ace-suited';
  const gap=Math.abs(order.indexOf(a)-order.indexOf(b));
  if(gap===1) return 'connector-suited';
  if(gap===2) return 'gap-suited';
  return 'other-suited';
}
export function handCombos(h:string){return h.length===2?6:h.endsWith('s')?4:12;}
export function handDealPercent(h:string){return handCombos(h)/1326*100;}
