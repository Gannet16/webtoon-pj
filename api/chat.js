const https = require('https');

module.exports = function (req, res) {
    try {
        const userMessage = req.body.message;
        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            return res.status(500).json({ error: "หา API Key ไม่เจอใน Vercel!" });
        }

        const postData = JSON.stringify({
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
                // สำคัญมาก: ป้องกัน Error เวลานับความยาวตัวอักษรภาษาไทย
                'Content-Length': Buffer.byteLength(postData)
            }
        };

        const request = https.request(options, (response) => {
            let rawData = '';
            response.on('data', (chunk) => { rawData += chunk; });
            response.on('end', () => {
                const parsedData = JSON.parse(rawData);
                if (response.statusCode !== 200) {
                    return res.status(500).json({ error: "Gemini ปฏิเสธคำสั่ง", details: parsedData });
                }
                res.status(200).json(parsedData);
            });
        });

        request.on('error', (error) => {
            res.status(500).json({ error: "พังตอนส่งข้อมูลไปหา Gemini", details: error.message });
        });

        request.write(postData);
        request.end();

    } catch (error) {
        res.status(500).json({ error: "ระบบพังกลางทาง", details: error.message });
    }
};
