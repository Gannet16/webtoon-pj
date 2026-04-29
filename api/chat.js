export default async function handler(req, res) {
    try {
        const apiKey = process.env.GEMINI_API_KEY?.trim();
        if (!apiKey) {
            return res.status(500).json({ error: "ไม่พบกุญแจ API" });
        }

        const userMessage = req.body.message || "สวัสดี";

        // 1. ใช้คำสั่งแบบมีขีดล่าง (system_instruction)
        const payload = {
            system_instruction: { 
                parts: [{ text: "คุณคือผู้คุมเกมแนวโรแมนติกคอมเมดี้ ตัวละครหลักคือ เป้ กับ ตาล เมื่อผู้ใช้พิมพ์คำสั่ง ให้คุณตอบกลับเป็น JSON ที่มี 2 ส่วนคือ 1. text: เนื้อเรื่องตอนต่อไปภาษาไทย 2. imagePrompt: ภาษาอังกฤษสำหรับวาดภาพฉากนั้น" }]
            },
            contents: [{ parts: [{ text: userMessage }] }]
        };

        // 2. ใช้ลิงก์เวอร์ชัน v1 (Official) ที่หารุ่น AI เจอแน่นอน
        const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (!response.ok) {
            return res.status(response.status).json({ error: "Google API Error", details: data });
        }

        return res.status(200).json(data);

    } catch (error) {
        return res.status(500).json({ error: "ระบบเซิร์ฟเวอร์ขัดข้อง", details: error.message });
    }
}
