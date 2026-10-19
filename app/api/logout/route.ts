import {NextResponse} from 'next/server';import {cookieName} from '@/lib/auth';
export async function POST(){const res=NextResponse.json({ok:true});res.cookies.set({name:cookieName,value:'',maxAge:0,path:'/',httpOnly:true,secure:process.env.NODE_ENV==='production',sameSite:'lax'});return res}
