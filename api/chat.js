export default async function handler(req, res) {
    try {
        const apiKey = "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";

        const userMessage = req.body.message || "สวัสดี";

        const combinedPrompt = `[คำสั่งสำหรับ AI: คุณคือผู้คุมเกมแนวโรแมนติกคอมเมดี้ ตัวละครหลักคือ เป้ กับ ตาล เมื่อผู้ใช้พิมพ์คำสั่ง ให้คุณตอบกลับเป็น JSON เท่านั้น ห้ามใส่ backtick หรือ markdown ใดๆ ตอบแค่ JSON ดิบๆ ที่มี 2 ส่วนคือ 1. text: เนื้อเรื่องตอนต่อไปภาษาไทย 2. imagePrompt: ภาษาอังกฤษสำหรับวาดภาพฉากนั้น]\n\nคำสั่งจากผู้ใช้: ${userMessage}`;

        const response = await fetch(
            "https://api.groq.com/openai/v1/chat/completions",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    model: "llama-3.3-70b-versatile",
                    messages: [{ role: "user", content: combinedPrompt }]
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {
            return res.status(response.status).json({ error: "Groq API Error", details: data });
        }

        // ลอก backtick และ markdown ออก แล้ว parse เป็น JSON
        let raw = data.choices?.[0]?.message?.content || "{}";
        raw = raw.replace(/```json/g, "").replace(/```/g, "").trim();

        let parsed;
        try {
            parsed = JSON.parse(raw);
        } catch (e) {
            parsed = { text: raw, imagePrompt: "" };
        }

        return res.status(200).json(parsed);

    } catch (error) {
        return res.status(500).json({ error: "ระบบเซิร์ฟเวอร์ขัดข้อง", details: error.message });
    }
}
