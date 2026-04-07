const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

// ข้อมูลจำลอง (ในอนาคตถ้าซีม่อนอยากให้ข้อมูลไม่หายเวลา Restart ต้องใช้ Database นะค้าบ)
let scripts = [
    { 
        name: "ตัวอย่างสคริปต์", 
        code: "loadstring(game:HttpGet('https://raw.githubusercontent.com/...'))()", 
        image: "https://cdn.discordapp.com/attachments/..." 
    }
];

// --- [ หน้าหลัก: แสดงสคริปต์ ] ---
app.get('/', (req, res) => {
    let scriptCards = scripts.map(s => `
        <div style="background:#1a1a1a; border-radius:12px; overflow:hidden; border:1px solid #333; margin-bottom:20px;">
            <img src="${s.image}" style="width:100%; hieght:200px; object-fit:cover;">
            <div style="padding:15px;">
                <h3 style="color:#00ff00; margin:0 0 10px 0;">${s.name}</h3>
                <input type="text" value="${s.code}" readonly style="width:80%; background:#000; color:#fff; border:none; padding:5px;">
                <button onclick="navigator.clipboard.writeText('${s.code}'); alert('คัดลอกแล้ว!')" style="background:#00ff00; color:#000; border:none; padding:5px 10px; cursor:pointer; border-radius:5px;">Copy</button>
            </div>
        </div>
    `).join('');

    res.send(`
        <html>
        <head>
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>ZEMON HUB</title>
            <style>body { background:#0f0f0f; color:#fff; font-family: sans-serif; padding:20px; }</style>
        </head>
        <body>
            <h1 style="color:#00ff00; text-align:center;">ZEMON HUB</h1>
            <p style="text-align:center; color:#888;">แจกฟรีสคริปต์โดย ซีม่อน</p>
            <div style="max-width:600px; margin:auto;">${scriptCards}</div>
            <div style="text-align:center; margin-top:50px;"><a href="/admin" style="color:#555; text-decoration:none;">Admin Login</a></div>
        </body>
        </html>
    `);
});

// --- [ หน้าหลังบ้าน: สำหรับซีม่อนเติมของ ] ---
app.get('/admin', (req, res) => {
    res.send(`
        <html>
        <head><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>ZEMON Admin</title></head>
        <body style="background:#111; color:#fff; padding:20px; font-family: sans-serif;">
            <h2>สวัสดีเจ้าของเว็บ (ซีม่อน) 👋</h2>
            <form action="/add-script" method="POST" style="display:flex; flex-direction:column; gap:10px; max-width:400px;">
                <input name="name" placeholder="ชื่อสคริปต์" required style="padding:10px;">
                <input name="code" placeholder="โค้ดสคริปต์ (loadstring...)" required style="padding:10px;">
                <input name="image" placeholder="ลิงก์รูปภาพจาก Discord" required style="padding:10px;">
                <button type="submit" style="padding:15px; background:#00ff00; border:none; font-weight:bold; cursor:pointer;">เพิ่มสคริปต์เข้าหน้าเว็บ</button>
            </form>
            <br><a href="/" style="color:#aaa;">กลับหน้าหลัก</a>
        </body>
        </html>
    `);
});

// --- [ ระบบรับข้อมูลจากฟอร์ม ] ---
app.post('/add-script', (req, res) => {
    const { name, code, image } = req.body;
    scripts.push({ name, code, image });
    res.send("<script>alert('เพิ่มเรียบร้อยแล้วนะค้าบซีม่อน!'); window.location.href='/';</script>");
});

app.listen(PORT, () => console.log('Server is running!'));
