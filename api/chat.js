module.exports = async function (req, res) {
    // 1. รับข้อความคำสั่งจากหน้าเว็บ
    const userMessage = req.body.message;

    // 2. ดึงกุญแจ API Key จากตู้เซฟ Vercel
    const apiKey = process.env.GEMINI_API_KEY;

    try {
        // 3. ส่งคำสั่งไปหา Gemini
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                system_instruction: {
                    parts: [{ text: "คุณคือผู้คุมเกมแนวโรแมนติกคอมเมดี้ ตัวละครหลักคือ เป้ กับ ตาล เมื่อผู้ใช้พิมพ์คำสั่ง ให้คุณตอบกลับเป็น JSON ที่มี 2 ส่วนคือ 1. text: เนื้อเรื่องตอนต่อไปภาษาไทย 2. imagePrompt: ภาษาอังกฤษสำหรับวาดภาพฉากนั้น" }]
                },
                contents: [{ parts: [{ text: userMessage }] }]
            })
        });

        const data = await response.json();

        // 4. ส่งคำตอบกลับไปที่หน้าเว็บ
        res.status(200).json(data);

    } catch (error) {
        res.status(500).json({ error: 'เกิดข้อผิดพลาดในการเชื่อมต่อกับ Gemini' });
    }
};
