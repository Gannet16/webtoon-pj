const https = require('https');

module.exports = function (req, res) {
    // 1. รับคำสั่งจากผู้ใช้
    const userMessage = req.body.message || "สวัสดี";

    // 2. เช็ก API Key
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        return res.status(500).json({ error: "ไม่พบกุญแจ API" });
    }

    // 3. แพ็กกล่องข้อมูลเตรียมส่ง
    const payload = JSON.stringify({
        systemInstruction: { 
            parts: [{ text: "คุณคือผู้คุมเกมแนวโรแมนติกคอมเมดี้ ตัวละครหลักคือ เป้ กับ ตาล เมื่อผู้ใช้พิมพ์คำสั่ง ให้คุณตอบกลับเป็น JSON ที่มี 2 ส่วนคือ 1. text: เนื้อเรื่องตอนต่อไปภาษาไทย 2. imagePrompt: ภาษาอังกฤษสำหรับวาดภาพฉากนั้น" }]
        },
        contents: [{ parts: [{ text: userMessage }] }]
    });

    const options = {
        hostname: 'generativelanguage.googleapis.com',
        port: 443,
        path: `/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(payload)
        }
    };

    // 4. วิ่งไปหา Gemini แบบคลาสสิก (ไม่ง้อ fetch)
    const request = https.request(options, (response) => {
        let rawData = '';
        
        // ค่อยๆ รับชิ้นส่วนข้อมูลที่ Gemini ส่งกลับมา
        response.on('data', (chunk) => { 
            rawData += chunk; 
        });
        
        // รับข้อมูลครบแล้ว
        response.on('end', () => {
            try {
                // ส่งข้อมูลทั้งหมดกลับไปหน้าเว็บทันทีแบบไม่คิดเยอะ
                const parsedData = JSON.parse(rawData);
                res.status(200).json(parsedData);
            } catch (e) {
                res.status(500).json({ error: "Gemini ส่งข้อมูลกลับมาผิดรูปแบบ", details: rawData });
            }
        });
    });

    // ดักจับเวลาระบบพังกลางทาง
    request.on('error', (error) => {
        res.status(500).json({ error: "พังตอนส่งไปหา Gemini", details: error.message });
    });

    // ปล่อยยาน!
    request.write(payload);
    request.end();
};
