import { NextRequest,NextResponse } from 'next/server';
import { createHash } from 'node:crypto';
import {getPool} from '@/lib/db';
import {checkPassword,makeSession,sessionCookie} from '@/lib/auth';
export const runtime='nodejs';
export async function POST(req:NextRequest){try{
 const body=await req.json();const role=body.role==='admin'?'admin':'partner';const password=typeof body.password==='string'?body.password:'';
 const ip=(req.headers.get('x-forwarded-for')||'unknown').split(',')[0].trim();const ipHash=createHash('sha256').update(`${ip}|${process.env.SESSION_SECRET||''}`).digest('hex');const db=getPool();
 const limiter=await db.query("select count(*)::int as count from login_attempts where ip_hash=$1 and role=$2 and created_at>now()-interval '15 minutes'",[ipHash,role]);
 if(limiter.rows[0].count>=10)return NextResponse.json({error:'Too many attempts. Try again later.'},{status:429});
 const ok=role==='admin'&&body.username===process.env.ADMIN_USERNAME?checkPassword(password,process.env.ADMIN_PASSWORD_HASH):role==='partner'?checkPassword(password,process.env.PARTNER_PASSWORD_HASH):false;
 if(!ok){await db.query('insert into login_attempts(ip_hash,role) values($1,$2)',[ipHash,role]);return NextResponse.json({error:'Invalid credentials'},{status:401})}
 await db.query('delete from login_attempts where ip_hash=$1 and role=$2',[ipHash,role]);
 const res=NextResponse.json({ok:true,role});res.cookies.set(sessionCookie(await makeSession(role)));return res;
 }catch(e){console.error('Login error',e);return NextResponse.json({error:'Login service unavailable'},{status:500})}}
