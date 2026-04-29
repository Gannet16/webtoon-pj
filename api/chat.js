export default async function handler(req, res) {
    try {
        // 1. รับข้อความ (ถ้า Vercel แกะมาให้แล้วก็ใช้เลย ถ้ายังก็แกะเอง)
        const userMessage = req.body.message || "สวัสดี";
        
        // 2. เช็กกุญแจ API
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            return res.status(500).json({ error: "ไม่พบกุญแจ API ใน Vercel" });
        }

        // 3. เตรียมคำสั่งส่งหา Gemini
        const payload = {
            system_instruction: { 
                parts: [{ text: "คุณคือผู้คุมเกมแนวโรแมนติกคอมเมดี้ ตัวละครหลักคือ เป้ กับ ตาล เมื่อผู้ใช้พิมพ์คำสั่ง ให้คุณตอบกลับเป็น JSON ที่มี 2 ส่วนคือ 1. text: เนื้อเรื่องตอนต่อไปภาษาไทย 2. imagePrompt: ภาษาอังกฤษสำหรับวาดภาพฉากนั้น" }]
            },
            contents: [{ parts: [{ text: userMessage }] }]
        };

        // 4. วิ่งไปหา Gemini
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        // 5. อ่านข้อมูลกลับมาเป็น "ข้อความดิบ" ก่อน (กันระบบช็อก)
        const rawText = await response.text();

        // 6. ค่อยๆ แปลงข้อความดิบเป็น JSON แบบปลอดภัย
        let data;
        try {
            data = JSON.parse(rawText);
        } catch (err) {
            return res.status(500).json({ error: "Gemini ส่งข้อมูลผิดรูปแบบ", details: rawText });
        }

        // 7. ส่งเนื้อเรื่องกลับไปที่หน้าเว็บ!
        return res.status(200).json(data);

    } catch (error) {
        return res.status(500).json({ error: "ระบบพังกลางทาง", details: error.message });
    }
}
