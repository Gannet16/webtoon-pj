export default async function handler(req, res) {
    try {
        // 1. เช็กกุญแจ API 
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            return res.status(500).json({ error: "ไม่พบกุญแจ GEMINI_API_KEY ใน Vercel" });
        }

        // 2. รับคำสั่งจากหน้าเว็บ
        const userMessage = req.body.message || "สวัสดี";

        // 3. เตรียมข้อมูลคำสั่งส่งหา Gemini
        const payload = {
            system_instruction: { 
                parts: [{ text: "คุณคือผู้คุมเกมแนวโรแมนติกคอมเมดี้ ตัวละครหลักคือ เป้ กับ ตาล เมื่อผู้ใช้พิมพ์คำสั่ง ให้คุณตอบกลับเป็น JSON ที่มี 2 ส่วนคือ 1. text: เนื้อเรื่องตอนต่อไปภาษาไทย 2. imagePrompt: ภาษาอังกฤษสำหรับวาดภาพฉากนั้น" }]
            },
            contents: [{ parts: [{ text: userMessage }] }]
        };

        // 4. ส่งข้อมูลไปหา Gemini (เปลี่ยนชื่อรุ่นเป็น gemini-1.5-flash-latest)
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        // 5. รับผลลัพธ์และส่งกลับหน้าเว็บ
        const data = await response.json();
        return res.status(200).json(data);

    } catch (error) {
        return res.status(500).json({ error: "ระบบเซิร์ฟเวอร์ขัดข้อง", details: error.message });
    }
}
