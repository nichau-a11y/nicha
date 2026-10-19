import { randomBytes, scryptSync } from 'node:crypto';
const pw=process.argv[2];
if(pw){if(pw.length<12)throw Error('Use >= 12 character password');const salt=randomBytes(16).toString('hex');console.log(`${salt}:${scryptSync(pw,salt,64).toString('hex')}`)}
else console.log(randomBytes(32).toString('base64url'));
