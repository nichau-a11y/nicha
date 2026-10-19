# Exness Elevate — คู่มือ Deploy (ฉบับสำหรับผู้ดูแล)

โปรเจกต์ Next.js แบบมี backend จริง ไม่ใช่ HTML static: หน้า Landing, Partner Login (shared password), Partner Leaderboard และ Admin CSV uploader + ปุ่ม Publish.

**ข้อมูลสำคัญ** CSV จริง 130 รายการอยู่ใน `import-data/Exness_Elevate_Oct_2026.csv` สำหรับอัปโหลดผ่าน Admin หลัง Deploy เท่านั้น. ห้ามนำเข้าโฟลเดอร์ `public/` หรืออัปโหลดลง GitHub repository สาธารณะ.

## A. ตั้งค่า Supabase
1. สมัคร https://supabase.com และกด **New project**.
2. เปิด **SQL Editor** → **New query** → คัดลอกไฟล์ `sql/schema.sql` ทั้งหมด → Run.
3. เปิดปุ่ม **Connect** บนหน้า Project → เลือก **Transaction pooler** แล้วคัดลอก PostgreSQL connection URI. หากรหัสผ่านมีอักขระพิเศษ ให้ URL encode. ควรใช้โหมด SSL.

## B. กำหนดรหัสผ่านก่อนเริ่ม
1. ติดตั้ง Node.js LTS และเปิด Terminal ในโฟลเดอร์ที่แตก ZIP.
2. สร้าง hash สำหรับ partner password อย่างน้อย 12 ตัวอักษร: `node scripts/gen-secret.mjs "YOUR_PARTNER_PASSWORD"`
3. สร้าง hash สำหรับ admin password (คนละรหัส): `node scripts/gen-secret.mjs "YOUR_ADMIN_PASSWORD"`
4. สร้าง secret สำหรับเซสชัน: `node scripts/gen-secret.mjs`
5. สร้างไฟล์ `.env.local` จาก `.env.example` และใส่ค่าทั้ง 5 ช่อง: DATABASE_URL, PARTNER_PASSWORD_HASH, ADMIN_PASSWORD_HASH, SESSION_SECRET, ADMIN_USERNAME. เก็บไว้เป็นความลับ และไม่ใส่ใน source code.

## C. ทดสอบในคอม
1. `npm install`
2. `npm run dev`
3. เปิด `http://localhost:3000` → Landing Page.
4. เปิด `/admin` แล้วเข้าด้วย admin username/password.
5. Upload CSV จากโฟลเดอร์ `import-data` → ตรวจพรีวิว → **Publish**.
6. เปิด `/login` แล้วเข้าด้วย partner shared password → ดูข้อมูลและตรวจสอบอันดับ.
7. `npm run build` เพื่อตรวจ TypeScript และ build.

## D. นำขึ้นเว็บไซต์จริง (Vercel)
1. สร้าง **Private** repository ใน https://github.com แล้ว push โฟลเดอร์โปรเจกต์ (ไฟล์ CSV จริงถูก ignore ด้วย `.gitignore`). อย่า push `.env.local`.
2. ไป https://vercel.com → **Add New > Project** → Import repository.
3. Framework: **Next.js**.
4. Vercel Project → **Settings > Environment Variables** ตั้งค่า: `DATABASE_URL`, `PARTNER_PASSWORD_HASH`, `ADMIN_PASSWORD_HASH`, `SESSION_SECRET`, `ADMIN_USERNAME` (กำหนดใน Production). ใช้ค่าเดียวกับใน `.env.local`.
5. กด **Deploy** และทดสอบ `/admin`, `/login`, `/leaderboard` ผ่าน HTTPS.
6. ใส่ Domain เองผ่าน **Project > Settings > Domains** (ไม่บังคับ).
7. เปลี่ยน Password / Session secret ได้โดยแก้ Environment Variables แล้ว redeploy. การเปลี่ยน SESSION_SECRET ทำให้ session เดิมใช้ไม่ได้.

## E. อัปเดตข้อมูลเดือนถัดไป
1. เตรียม CSV ที่มีหัวคอลัมน์เรียงแบบ: `month,User Partner Uid,TV Lots Qualified,Active Traders Qualified,Level`
2. `month` ต้องเป็นเดือนเดียวกันทั้งไฟล์; Partner UID ห้ามซ้ำภายในเดือน; Active Traders เป็นจำนวนเต็ม; TV เป็นตัวเลข >= 0.
3. Admin → Upload CSV → ตรวจ 5 อันดับแรกและจำนวนแถว → Publish.
4. ผู้ใช้เปิดหน้า Leaderboard หรือ Refresh ใหม่ จะเห็นผลล่าสุด.

## ระบบรักษาความปลอดภัยและข้อจำกัด
- Partner login เป็นรหัสผ่านร่วมกัน จึง **ไม่ได้ระบุตัวตนแต่ละคน**. ทุกคนที่ทราบรหัสจะเข้าถึงข้อมูลเผยแพร่ชุดเดียวกัน.
- Server ยืนยันรหัสผ่านด้วย scrypt hash, signed HttpOnly Secure cookie ใน Production, login IP rate limit ผ่านฐานข้อมูล, session หมดอายุ 12 ชม. Partner / 4 ชม. Admin.
- CSV เก็บใน PostgreSQL server-side เท่านั้น ไม่ใส่ใน public directory; Endpoint ของตาราง ranking ตรวจสิทธิ์ทุกครั้ง และส่งเฉพาะข้อมูลที่เผยแพร่แล้ว.
- ขณะนี้มี **การเก็บ snapshot และประวัติ upload/publish ใน DB** แต่ยังไม่มีปุ่ม rollback ใน Admin UI. Rollback ใช้วิธี DB operator หรือเพิ่มหน้าเลือก snapshot ในเวอร์ชันต่อไป.
- UI ไม่แก้กติกาแคมเปญหรือรางวัลจาก Admin; หากเปลี่ยนข้อความ Landing ต้องแก้ `app/page.tsx` และ redeploy.
- เซสชัน signed ไม่ถูก revoke ทันทีเมื่อมีการเปลี่ยน shared password; เปลี่ยน SESSION_SECRET พร้อมกันถ้าต้องตัดการเข้าถึงเก่า.
- Login attempts มีการจำกัด 10 ครั้งต่อ IP ใน 15 นาทีตามที่ backend เห็น IP; production traffic ที่ใช้ shared IP หรือ proxy ควรติดตั้ง WAF/rate limiter เพิ่ม.
- โปรเจกต์ไม่เชื่อมกับระบบ Exness จริง และไม่ได้รับการอนุมัติแบรนด์/การรักษาความลับโดยองค์กรโดยอัตโนมัติ ก่อนใช้งานจริงโปรดขออนุญาตสำหรับการใช้แบรนด์และเผยแพร่ข้อมูล.
- อย่าส่งรหัสผ่านหรือ DATABASE_URL ในแชต; จัดการผ่าน Vercel environment variables.
