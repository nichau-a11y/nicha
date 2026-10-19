export type RecordRow={partnerId:string;month:string;level:string;active:number;tv:number};
export const LEVELS=['Level 1','Level 2','Level 3','Level 4','No rewards'];
export function rankRows(rows:RecordRow[]){
 const sorted=[...rows].sort((a,b)=>LEVELS.indexOf(a.level)-LEVELS.indexOf(b.level)||b.active-a.active||b.tv-a.tv||a.partnerId.localeCompare(b.partnerId));
 return sorted.map((row,i)=>({...row,rank:i+1}));
}
export function displayId(id:string){return id.length>12?`${id.slice(0,8)}…${id.slice(-4)}`:id}
