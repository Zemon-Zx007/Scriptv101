const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

// --- [ ตั้งค่ารหัสผ่านของซีม่อนตรงนี้ ] ---
const ADMIN_PASSWORD = "zemon1234"; // ซีม่อนเปลี่ยนรหัสตรงนี้ได้ตามใจชอบเลยนะค้าบ

// ข้อมูลจำลอง (เก็บไว้ใน RAM)
let scripts = [
    { 
        name: "ZEMON HUB V1", 
        code: "loadstring(game:HttpGet('https://raw.githubusercontent.com/Zemon/Example/main/script.lua'))()", 
        image: "https://via.placeholder.com/600x300/1a1a1a/00ff00?text=ZEMON+HUB+READY" 
    }
];

// --- [ หน้าหลัก: แสดงสคริปต์ ] ---
app.get('/', (req, res) => {
    let scriptCards = scripts.map(s => `
        <div style="background:#1a1a1a; border-radius:15px; overflow:hidden; border:1px solid #333; margin-bottom:25px; box-shadow: 0 10px 20px rgba(0,0,0,0.5);">
            <img src="${s.image}" style="width:100%; height:220px; object-fit:cover; border-bottom:1px solid #333;">
            <div style="padding:20px;">
                <h3 style="color:#00ff00; margin:0 0 15px 0; font-size:1.4rem;">${s.name}</h3>
                <div style="display:flex; gap:10px; background:#000; padding:10px; border-radius:8px; align-items:center;">
                    <code style="color:#aaa; font-size:0.8rem; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; flex-grow:1;">${s.code}</code>
                    <button onclick="copyToClipboard('${s.code}')" style="background:#00ff00; color:#000; border:none; padding:8px 15px; cursor:pointer; border-radius:5px; font-weight:bold; flex-shrink:0;">Copy</button>
                </div>
            </div>
        </div>
    `).join('');

    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>ZEMON HUB | แจกสคริปต์</title>
            <style>
                @import url('https://fonts.googleapis.com/css2?family=Kanit:wght@300;500&display=swap');
                body { background:#0a0a0a; color:#fff; font-family: 'Kanit', sans-serif; padding:10px; margin:0; }
                .container { max-width:700px; margin:auto; padding:20px; }
                h1 { color:#00ff00; text-align:center; font-size:2.5rem; text-shadow: 0 0 10px rgba(0,255,0,0.3); margin-bottom:5px; }
                p.subtitle { text-align:center; color:#666; margin-bottom:40px; }
            </style>
            <script>
                function copyToClipboard(text) {
                    navigator.clipboard.writeText(text).then(() => {
                        alert('คัดลอกสคริปต์เรียบร้อยแล้วนะค้าบซีม่อน!');
                    });
                }
            </script>
        </head>
        <body>
            <div class="container">
                <h1>ZEMON <span style="color:#fff;">HUB</span></h1>
                <p class="subtitle">แหล่งรวมสคริปต์คุณภาพโดย ซีม่อน</p>
                ${scriptCards}
            </div>
        </body>
        </html>
    `);
});

// --- [ หน้าหลังบ้าน: ความลับของซีม่อน ] ---
app.get('/admin', (req, res) => {
    res.send(`
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Admin Dashboard</title>
            <style>
                body { background:#111; color:#fff; font-family: sans-serif; display:flex; justify-content:center; align-items:center; min-height:100vh; margin:0; }
                .form-box { background:#1a1a1a; padding:30px; border-radius:15px; border:1px solid #00ff00; width:90%; max-width:400px; }
                input { width:100%; padding:12px; margin-bottom:15px; border-radius:8px; border:1px solid #333; background:#000; color:#fff; box-sizing: border-box; }
                button { width:100%; padding:15px; background:#00ff00; color:#000; border:none; border-radius:8px; font-weight:bold; cursor:pointer; font-size:1rem; }
                label { display:block; margin-bottom:5px; color:#888; font-size:0.8rem; }
            </style>
        </head>
        <body>
            <div class="form-box">
                <h2 style="color:#00ff00; text-align:center;">แผงควบคุมซีม่อน</h2>
                <form action="/add-script" method="POST">
                    <label>รหัสผ่านยืนยันตัวตน</label>
                    <input type="password" name="password" required>
                    <hr style="border:0.5px solid #333; margin:20px 0;">
                    <label>ชื่อสคริปต์</label>
                    <input type="text" name="name" placeholder="เช่น Auto Farm Blox Fruit" required>
                    <label>โค้ดสคริปต์ (loadstring)</label>
                    <input type="text" name="code" placeholder="loadstring(game:HttpGet(...))()" required>
                    <label>ลิงก์รูปภาพ (Discord / Web)</label>
                    <input type="text" name="image" placeholder="https://cdn.discordapp.com/..." required>
                    <button type="submit">ยืนยันการเพิ่มสคริปต์</button>
                </form>
                <p style="text-align:center; margin-top:20px;"><a href="/" style="color:#555; text-decoration:none; font-size:0.8rem;">กลับหน้าหลัก</a></p>
            </div>
        </body>
        </html>
    `);
});

// --- [ ระบบรับข้อมูลและเช็ครหัส ] ---
app.post('/add-script', (req, res) => {
    const { password, name, code, image } = req.body;

    if (password === ADMIN_PASSWORD) {
        scripts.unshift({ name, code, image }); // ใช้ unshift เพื่อให้ตัวใหม่ขึ้นข้างบนสุด
        res.send("<script>alert('เพิ่มเรียบร้อยแล้วนะค้าบซีม่อน!'); window.location.href='/';</script>");
    } else {
        res.send("<script>alert('รหัสผ่านไม่ถูกต้องนะค้าบ!'); window.history.back();</script>");
    }
});

app.listen(PORT, () => console.log('ZEMON HUB is online!'));
