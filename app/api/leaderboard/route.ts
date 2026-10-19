import {NextResponse} from 'next/server';import {sessionRole} from '@/lib/auth';import {getPool} from '@/lib/db';
export const runtime='nodejs';export const dynamic='force-dynamic';
export async function GET(){if(!await sessionRole())return NextResponse.json({error:'Unauthorized'},{status:401,headers:{'Cache-Control':'no-store'}});
 try{const db=getPool();const rows=await db.query(`select e.partner_id as "partnerId",e.level,e.active_traders as active,e.tv_lots::float as tv,e.rank,s.month,s.published_at as "updatedAt"
 from ranking_snapshots s join ranking_entries e on s.id=e.snapshot_id where s.active=true order by e.rank asc`);
 return NextResponse.json({rows:rows.rows},{headers:{'Cache-Control':'private, no-store'}})}catch{return NextResponse.json({error:'Database unavailable'},{status:503})}}
