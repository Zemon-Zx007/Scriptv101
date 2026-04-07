const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

// --- [ ตั้งค่ารหัสผ่านของซีม่อน ] ---
const ADMIN_PASSWORD = "zemon1234"; 

// ข้อมูลเริ่มต้น
let scripts = [
    { 
        name: "Swift X Hub V1", 
        code: "loadstring(game:HttpGet('https://raw.githubusercontent.com/Zemon/Example/main/script.lua'))()", 
        image: "https://i.ibb.co/h1tScGHD/Lightning-Update-Blox-Fruits.jpg" 
    }
];

// --- [ หน้าหลัก: Swift X Hub ] ---
app.get('/', (req, res) => {
    let scriptCards = scripts.map(s => `
        <div style="background:#151515; border-radius:20px; overflow:hidden; border:1px solid #222; margin-bottom:25px; box-shadow: 0 8px 16px rgba(0,0,0,0.6);">
            <img src="${s.image}" style="width:100%; height:200px; object-fit:cover; border-bottom:1px solid #222;">
            <div style="padding:20px;">
                <h3 style="color:#ff0000; margin:0 0 5px 0; font-size:1.5rem; font-weight:bold;">${s.name}</h3>
                
                <button onclick="copyToClipboard('${s.code}')" style="width:100%; background:#ff0000; color:#fff; border:none; padding:12px; cursor:pointer; border-radius:10px; font-weight:bold; font-size:1rem; margin-bottom:15px; margin-top:10px; transition: 0.3s active;">
                    <i class="fas fa-copy"></i> คัดลอกสคริปต์
                </button>

                <div style="background:#0a0a0a; padding:10px; border-radius:8px; border:1px dashed #333; pointer-events: none; user-select: none;">
                    <code style="color:#666; font-size:0.75rem; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; display:block;">${s.code}</code>
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
            <title>Swift X Hub | แจกสคริปต์</title>
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
            <style>
                @import url('https://fonts.googleapis.com/css2?family=Kanit:wght@300;500;700&display=swap');
                body { background:#0a0a0a; color:#fff; font-family: 'Kanit', sans-serif; padding:15px; margin:0; }
                .container { max-width:500px; margin:auto; padding-top:20px; }
                h1 { color:#ff0000; text-align:center; font-size:2.8rem; font-weight:800; margin-bottom:5px; letter-spacing: -1px; }
                h1 span { color:#fff; }
                p.subtitle { text-align:center; color:#555; margin-bottom:35px; font-size:0.9rem; }
                button:active { transform: scale(0.98); background:#cc0000; }
            </style>
            <script>
                function copyToClipboard(text) {
                    const el = document.createElement('textarea');
                    el.value = text;
                    document.body.appendChild(el);
                    el.select();
                    document.execCommand('copy');
                    document.body.removeChild(el);
                    alert('คัดลอกสคริปต์ Swift X เรียบร้อยแล้วนะค้าบซีม่อน!');
                }
            </script>
        </head>
        <body>
            <div class="container">
                <h1>SWIFT X <span>HUB</span></h1>
                <p class="subtitle">แหล่งรวมสคริปต์คุณภาพสูงโดย ซีม่อน</p>
                ${scriptCards}
            </div>
        </body>
        </html>
    `);
});

// --- [ หน้าหลังบ้าน: ปรับโทนแดง ] ---
app.get('/admin', (req, res) => {
    res.send(`
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Swift X Admin</title>
            <style>
                body { background:#0a0a0a; color:#fff; font-family: sans-serif; display:flex; justify-content:center; align-items:center; min-height:100vh; margin:0; }
                .form-box { background:#151515; padding:30px; border-radius:20px; border:1px solid #ff0000; width:90%; max-width:400px; box-shadow: 0 0 20px rgba(255,0,0,0.1); }
                input { width:100%; padding:14px; margin-bottom:15px; border-radius:10px; border:1px solid #333; background:#000; color:#fff; box-sizing: border-box; outline:none; }
                input:focus { border-color: #ff0000; }
                button { width:100%; padding:15px; background:#ff0000; color:#fff; border:none; border-radius:10px; font-weight:bold; cursor:pointer; font-size:1rem; }
                label { display:block; margin-bottom:5px; color:#666; font-size:0.8rem; }
            </style>
        </head>
        <body>
            <div class="form-box">
                <h2 style="color:#ff0000; text-align:center; margin-top:0;">แผงควบคุม SWIFT X</h2>
                <form action="/add-script" method="POST">
                    <label>รหัสผ่านแอดมิน</label>
                    <input type="password" name="password" required>
                    <hr style="border:0.5px solid #222; margin:20px 0;">
                    <label>ชื่อสคริปต์</label>
                    <input type="text" name="name" placeholder="เช่น Blox Fruits Auto Farm" required>
                    <label>โค้ดสคริปต์</label>
                    <input type="text" name="code" placeholder="loadstring..." required>
                    <label>ลิงก์ตรงรูปภาพ (Direct Link)</label>
                    <input type="text" name="image" placeholder="https://i.ibb.co/..." required>
                    <button type="submit">เพิ่มสคริปต์ใหม่</button>
                </form>
                <p style="text-align:center; margin-top:20px;"><a href="/" style="color:#444; text-decoration:none; font-size:0.8rem;">กลับหน้าหลัก</a></p>
            </div>
        </body>
        </html>
    `);
});

app.post('/add-script', (req, res) => {
    const { password, name, code, image } = req.body;
    if (password === ADMIN_PASSWORD) {
        scripts.unshift({ name, code, image });
        res.send("<script>alert('เพิ่มสคริปต์สำเร็จแล้วนะค้าบซีม่อน!'); window.location.href='/';</script>");
    } else {
        res.send("<script>alert('รหัสผ่านผิดนะค้าบ!'); window.history.back();</script>");
    }
});

app.listen(PORT, () => console.log('Swift X Hub is online!'));
