const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

// --- [ ตั้งค่ารหัสผ่านของซีม่อน ] ---
const ADMIN_PASSWORD = "zemon1234"; 

// รายการสคริปต์
let scripts = [];

// ลิงก์รูปพื้นหลัง
const BG_URL = "https://i.ibb.co/prjHGm9h/Unknown.jpg";

// --- [ หน้าหลัก: Swift X Hub ] ---
app.get('/', (req, res) => {
    let scriptCards = scripts.length > 0 ? scripts.map((s, index) => `
        <div style="background:rgba(21, 21, 21, 0.85); border-radius:20px; overflow:hidden; border:1px solid #333; margin-bottom:25px; box-shadow: 0 8px 16px rgba(0,0,0,0.8); backdrop-filter: blur(8px);">
            <img src="${s.image}" style="width:100%; height:200px; object-fit:cover; border-bottom:1px solid #222;">
            <div style="padding:20px;">
                <h3 style="color:#ff0000; margin:0 0 10px 0; font-size:1.5rem; font-weight:bold;">${s.name}</h3>
                
                <div style="background:rgba(0,0,0,0.7); padding:12px; border-radius:10px; border:1px dashed #444; pointer-events: none; user-select: none; margin-bottom:15px;">
                    <code style="color:#bbb; font-size:0.75rem; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; display:block;">${s.code}</code>
                </div>

                <button onclick="copyToClipboard('${s.code}', this)" style="width:100%; background:#ff0000; color:#fff; border:none; padding:14px; cursor:pointer; border-radius:12px; font-weight:bold; font-size:1rem; transition: 0.2s; position:relative;">
                    <i class="fas fa-copy"></i> <span class="btn-text">คัดลอกสคริปต์</span>
                </button>
            </div>
        </div>
    `).join('') : '<p style="text-align:center; color:#fff; margin-top:50px; background:rgba(0,0,0,0.6); padding:20px; border-radius:15px; backdrop-filter: blur(5px);">ยังไม่มีสคริปต์ในขณะนี้...</p>';

    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Swift X Hub</title>
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
            <style>
                @import url('https://fonts.googleapis.com/css2?family=Kanit:wght@300;500;700&display=swap');
                body { 
                    /* ปรับ rgba เป็น 0.4 เพื่อให้รูปชัดขึ้นมาก */
                    background: linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url('${BG_URL}');
                    background-size: cover;
                    background-position: center;
                    background-attachment: fixed;
                    color:#fff; 
                    font-family: 'Kanit', sans-serif; 
                    padding:15px; 
                    margin:0; 
                }
                .container { max-width:500px; margin:auto; padding-top:20px; }
                h1 { color:#ff0000; text-align:center; font-size:2.8rem; font-weight:800; margin-bottom:5px; letter-spacing: -1px; text-shadow: 2px 2px 15px rgba(0,0,0,1); }
                h1 span { color:#fff; }
                p.subtitle { text-align:center; color:#fff; margin-bottom:35px; font-size:0.9rem; text-shadow: 1px 1px 8px rgba(0,0,0,1); font-weight: 500; }
                .copy-success { position:fixed; bottom:20px; left:50%; transform:translateX(-50%); background:#00ff00; color:#000; padding:10px 20px; border-radius:50px; font-weight:bold; display:none; z-index:1000; box-shadow:0 0 15px rgba(0,255,0,0.5); }
            </style>
            <script>
                async function copyToClipboard(text, btn) {
                    try {
                        const tempInput = document.createElement('textarea');
                        tempInput.value = text;
                        document.body.appendChild(tempInput);
                        tempInput.select();
                        document.execCommand('copy');
                        document.body.removeChild(tempInput);

                        const successMsg = document.getElementById('successToast');
                        successMsg.style.display = 'block';
                        setTimeout(() => { successMsg.style.display = 'none'; }, 3000);
                    } catch (err) {
                        console.error('คัดลอกไม่ได้นะค้าบ:', err);
                    }
                }
            </script>
        </head>
        <body>
            <div id="successToast" class="copy-success">คัดลอกสำเร็จแล้วนะค้าบซีม่อน! ✅</div>
            <div class="container">
                <h1>SWIFT X <span>HUB</span></h1>
                <p class="subtitle">แหล่งรวมสคริปต์คุณภาพสูงโดย ซีม่อน</p>
                ${scriptCards}
            </div>
        </body>
        </html>
    `);
});

// --- [ ส่วนของหน้าหลังบ้าน ] ---
const adminHeader = `
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Kanit:wght@300;500;700&display=swap');
        body { 
            background: linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('${BG_URL}');
            background-size: cover;
            background-position: center;
            background-attachment: fixed;
            color:#fff; 
            font-family: 'Kanit', sans-serif; 
            margin:0; 
        }
        .nav-btn { position:fixed; top:20px; left:20px; font-size:24px; color:#ff0000; cursor:pointer; z-index:1001; text-shadow: 2px 2px 8px rgba(0,0,0,1); }
        .sidebar { height:100%; width:0; position:fixed; z-index:1000; top:0; left:0; background:rgba(10,10,10,0.9); overflow-x:hidden; transition:0.3s; padding-top:60px; border-right:1px solid #ff0000; backdrop-filter: blur(15px); }
        .sidebar a { padding:15px 32px; text-decoration:none; font-size:18px; color:#eee; display:block; transition:0.3s; }
        .sidebar a:hover { color:#ff0000; background:rgba(255,0,0,0.1); }
        .admin-container { display:flex; justify-content:center; align-items:center; min-height:100vh; padding:20px; }
        .form-box { background:rgba(20, 20, 20, 0.85); padding:30px; border-radius:25px; border:1px solid #ff0000; width:100%; max-width:400px; box-shadow: 0 10px 40px rgba(0,0,0,0.8); backdrop-filter: blur(10px); }
        input, select { width:100%; padding:14px; margin-bottom:15px; border-radius:12px; border:1px solid #444; background:rgba(0,0,0,0.8); color:#fff; box-sizing: border-box; font-family: 'Kanit', sans-serif; outline:none; }
        input:focus { border-color:#ff0000; box-shadow: 0 0 10px rgba(255,0,0,0.2); }
        button { width:100%; padding:15px; background:#ff0000; color:#fff; border:none; border-radius:12px; font-weight:bold; cursor:pointer; font-size:1rem; font-family: 'Kanit', sans-serif; transition: 0.3s; box-shadow: 0 4px 15px rgba(255,0,0,0.4); }
        button:hover { background:#cc0000; transform: translateY(-2px); }
        button:active { transform: scale(0.98); }
    </style>
    <div class="nav-btn" onclick="toggleNav()"><i class="fas fa-bars"></i></div>
    <div id="mySidebar" class="sidebar">
        <a href="/admin"><i class="fas fa-plus-circle"></i> เพิ่มสคริปต์</a>
        <a href="/admin/delete"><i class="fas fa-trash-alt"></i> ลบสคริปต์</a>
        <a href="/"><i class="fas fa-home"></i> กลับหน้าเว็บหลัก</a>
    </div>
    <script>
        function toggleNav() {
            var s = document.getElementById("mySidebar");
            if (s.style.width === "250px") { s.style.width = "0"; } 
            else { s.style.width = "250px"; }
        }
    </script>
`;

app.get('/admin', (req, res) => {
    res.send(`
        <html>
        <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Swift X Admin</title></head>
        <body>
            ${adminHeader}
            <div class="admin-container">
                <div class="form-box">
                    <h2 style="color:#ff0000; text-align:center; margin-top:0; text-shadow: 2px 2px 8px rgba(0,0,0,0.8);">เพิ่มสคริปต์ใหม่</h2>
                    <form action="/add-script" method="POST">
                        <input type="password" name="password" placeholder="รหัสผ่านแอดมิน" required>
                        <hr style="border:0.5px solid #444; margin:20px 0;">
                        <input type="text" name="name" placeholder="ชื่อสคริปต์" required>
                        <input type="text" name="code" placeholder="โค้ดสคริปต์ (loadstring...)" required>
                        <input type="text" name="image" placeholder="ลิงก์รูปภาพ (Direct Link)" required>
                        <button type="submit">ยืนยันการเพิ่ม</button>
                    </form>
                </div>
            </div>
        </body>
        </html>
    `);
});

app.get('/admin/delete', (req, res) => {
    let options = scripts.map((s, index) => `<option value="${index}">${s.name}</option>`).join('');
    res.send(`
        <html>
        <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>ลบสคริปต์ | Swift X</title></head>
        <body>
            ${adminHeader}
            <div class="admin-container">
                <div class="form-box" style="border-color:#555;">
                    <h2 style="color:#fff; text-align:center; margin-top:0; text-shadow: 2px 2px 8px rgba(0,0,0,0.8);">ลบสคริปต์ออก</h2>
                    <form action="/delete-script" method="POST">
                        <input type="password" name="password" placeholder="รหัสผ่านแอดมิน" required>
                        <hr style="border:0.5px solid #444; margin:20px 0;">
                        <select name="scriptIndex" required>
                            ${options || '<option disabled>ไม่มีสคริปต์ให้ลบ</option>'}
                        </select>
                        <button type="submit" style="background:#333; box-shadow: none;">ยืนยันการลบ</button>
                    </form>
                </div>
            </div>
        </body>
        </html>
    `);
});

app.post('/add-script', (req, res) => {
    const { password, name, code, image } = req.body;
    if (password === ADMIN_PASSWORD) {
        scripts.unshift({ name, code, image });
        res.send("<script>alert('เพิ่มสำเร็จแล้วนะค้าบซีม่อน!'); window.location.href='/';</script>");
    } else {
        res.send("<script>alert('รหัสผ่านผิดนะค้าบ!'); window.history.back();</script>");
    }
});

app.post('/delete-script', (req, res) => {
    const { password, scriptIndex } = req.body;
    if (password === ADMIN_PASSWORD) {
        if (scriptIndex !== undefined && scripts[scriptIndex]) {
            scripts.splice(scriptIndex, 1);
            res.send("<script>alert('ลบสคริปต์ออกแล้วนะค้าบ!'); window.location.href='/';</script>");
        }
    } else {
        res.send("<script>alert('รหัสผ่านผิดนะค้าบ!'); window.history.back();</script>");
    }
});

app.listen(PORT, () => console.log('Swift X Hub is online!'));
