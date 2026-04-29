module.exports = async function (req, res) {
    try {
        const userMessage = req.body.message;
        const apiKey = process.env.GEMINI_API_KEY;

        // ดักจับที่ 1: เช็คว่ามีกุญแจไหม
        if (!apiKey) {
            return res.status(500).json({ error: "หา API Key ไม่เจอใน Vercel!" });
        }

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                systemInstruction: { 
                    parts: [{ text: "คุณคือผู้คุมเกมแนวโรแมนติกคอมเมดี้ ตัวละครหลักคือ เป้ กับ ตาล เมื่อผู้ใช้พิมพ์คำสั่ง ให้คุณตอบกลับเป็น JSON ที่มี 2 ส่วนคือ 1. text: เนื้อเรื่องตอนต่อไปภาษาไทย 2. imagePrompt: ภาษาอังกฤษสำหรับวาดภาพฉากนั้น" }]
                },
                contents: [{ parts: [{ text: userMessage }] }]
            })
        });

        const data = await response.json();

        // ดักจับที่ 2: เช็คว่า Gemini ด่ากลับมาไหม
        if (!response.ok) {
            return res.status(500).json({ error: "Gemini ปฏิเสธคำสั่ง", details: data });
        }

        res.status(200).json(data);

    } catch (error) {
        // ดักจับที่ 3: เช็คว่าระบบพังเรื่องอะไร
        res.status(500).json({ error: "ระบบพังกลางทาง", details: error.message });
    }
};
