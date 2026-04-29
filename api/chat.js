export default async function handler(req, res) {
    try {
        const apiKey = process.env.GEMINI_API_KEY?.trim();
        if (!apiKey) {
            return res.status(500).json({ error: "ไม่พบกุญแจ API" });
        }

        const userMessage = req.body.message || "สวัสดี";

        // ท่าไม้ตาย: ยุบรวมคำสั่งคุมเกมและคำสั่งผู้ใช้ไว้ในข้อความก้อนเดียว
        const combinedPrompt = `[คำสั่งสำหรับ AI: คุณคือผู้คุมเกมแนวโรแมนติกคอมเมดี้ ตัวละครหลักคือ เป้ กับ ตาล เมื่อผู้ใช้พิมพ์คำสั่ง ให้คุณตอบกลับเป็น JSON ที่มี 2 ส่วนคือ 1. text: เนื้อเรื่องตอนต่อไปภาษาไทย 2. imagePrompt: ภาษาอังกฤษสำหรับวาดภาพฉากนั้น]\n\nคำสั่งจากผู้ใช้: ${userMessage}`;

        const payload = {
            contents: [{ parts: [{ text: combinedPrompt }] }]
        };

        // เปลี่ยนมาใช้รุ่น "gemini-pro" อมตะฆ่าไม่ตาย! (ใช้ v1beta)
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
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
