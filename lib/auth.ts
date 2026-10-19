import { cookies } from 'next/headers';
import { SignJWT,jwtVerify } from 'jose';
import { scryptSync,timingSafeEqual } from 'node:crypto';
export const cookieName='elevate_session';
const key=()=>{const s=process.env.SESSION_SECRET;if(!s||s.length<32)throw Error('SESSION_SECRET must be >=32 characters');return new TextEncoder().encode(s)};
export function checkPassword(password:string,stored:string|undefined){if(!stored)return false;const [salt,hash]=stored.split(':');if(!salt||!hash||!/^([0-9a-f]{2})+$/.test(hash))return false;const target=Buffer.from(hash,'hex');const received=scryptSync(password,salt,target.length);return target.length===received.length&&timingSafeEqual(target,received)}
export async function makeSession(role:'partner'|'admin'){return new SignJWT({role}).setProtectedHeader({alg:'HS256'}).setIssuedAt().setExpirationTime(role==='admin'?'4h':'12h').sign(key())}
export async function sessionRole():Promise<'partner'|'admin'|null>{try{const raw=(await cookies()).get(cookieName)?.value;if(!raw)return null;const {payload}=await jwtVerify(raw,key(),{algorithms:['HS256']});return payload.role==='admin'?'admin':payload.role==='partner'?'partner':null}catch{return null}}
export function sessionCookie(token:string){return {name:cookieName,value:token,httpOnly:true,secure:process.env.NODE_ENV==='production',sameSite:'lax' as const,path:'/',maxAge:12*60*60}}
