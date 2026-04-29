export default async function handler(req, res) {
    try {
        // ดึง API Key จาก Vercel Environment Variables เพื่อความปลอดภัย
        const apiKey = process.env.GROQ_API_KEY;

        const userMessage = req.body.message || "ผู้กองกฤษณ์นำหน่วยพยัคฆ์ทมิฬเดินฝ่าพายุฝนเข้าไปในหุบเขาที่ไม่มีในแผนที่";

        // แกนเรื่องใหม่: ลับแล ปฏิบัติการรุ่งอรุณสยาม
        const combinedPrompt = `[คำสั่งสำหรับ AI: คุณคือผู้คุมเกมแนว Sci-Fi Fantasy อิงประวัติศาสตร์ เรื่อง "ลับแล: ปฏิบัติการรุ่งอรุณสยาม" 
แกนเรื่อง: หน่วยปฏิบัติการพิเศษ "พยัคฆ์ทมิฬ" จากยุคปัจจุบัน นำโดย "ผู้กองกฤษณ์" หลุดข้ามมิติเวลาผ่านวิหารศิลาแลงและหมอกสีฟ้าเรืองแสง ไปโผล่ในยุคอยุธยาศตวรรษที่ 18 ที่กำลังเกิดสงคราม
เมื่อผู้ใช้พิมพ์คำสั่ง ให้ตอบกลับเป็น JSON เท่านั้น ห้ามใส่ backtick หรือ markdown ใดๆ
JSON ต้องมี 2 ส่วน:
1. "text": เนื้อเรื่องตอนต่อไปภาษาไทย 2-3 ประโยค บรรยายความตื่นเต้น การปะทะระหว่างอาวุธยุคปัจจุบันกับทหารโบราณ หรือความลี้ลับของป่าควอนตัม
2. "imagePrompt": บรรยายฉากนั้นเป็นภาษาอังกฤษแบบละเอียดมาก ระบุ: ตัวละครทำอะไร อยู่ที่ไหน อารมณ์ สีหน้า ท่าทาง และบรรยากาศ เช่น "Captain Krit in modern tactical gear and assault rifle, standing in a dense mystical forest with glowing blue quantum fog, ancient Thai temple ruins in the background, cinematic lighting, epic sci-fi historical fantasy concept art"]

คำสั่งจากผู้ใช้: ${userMessage}`;

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
