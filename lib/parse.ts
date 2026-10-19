import {parse} from 'csv-parse/sync';
import {LEVELS,rankRows, type RecordRow} from './ranking';
const cols=['month','Partner Wallet Number','TV Lots Qualified','Active Traders Qualified','Level'];
const numeric=(v:string)=>{const s=String(v??'').replaceAll(',','').trim();if(!/^\d+(\.\d+)?$/.test(s))throw Error('Invalid numeric cell');const x=Number(s);if(!Number.isFinite(x)||x<0)return NaN;return x};
export function parseCsv(raw:string){if(raw.length>2_000_000)throw Error('CSV too large (maximum 2MB)');const rows=parse(raw.replace(/^\uFEFF/,''),{columns:true,skip_empty_lines:true,bom:true,relax_quotes:false}) as Record<string,string>[];
 if(!rows.length||rows.length>5000)throw Error('CSV must have 1 to 5000 rows');
 if(cols.some(c=>!(c in rows[0])))throw Error(`Missing headers: ${cols.filter(c=>!(c in rows[0])).join(', ')}`);
 const seen=new Set<string>();const out:RecordRow[]=[];
 for(const [i,r] of rows.entries()){const month=r.month?.trim(),partnerId=r['Partner Wallet Number']?.trim(),level=r.Level?.trim();
 if(!month||!partnerId||partnerId.length>120||!level||!LEVELS.includes(level))throw Error(`Invalid row ${i+2}: month, Partner Wallet Number or Level`);
 const active=numeric(r['Active Traders Qualified']),tv=numeric(r['TV Lots Qualified']);if(!Number.isInteger(active)||!Number.isFinite(tv))throw Error(`Invalid row ${i+2}: Active Traders / TV Lots`);
 const k=month+'|'+partnerId;if(seen.has(k))throw Error(`Duplicate partner/month at row ${i+2}`);seen.add(k);
 out.push({month,partnerId,level,active,tv});}
 if(new Set(out.map(r=>r.month)).size!==1)throw Error('One reporting month per upload');return rankRows(out);
}
