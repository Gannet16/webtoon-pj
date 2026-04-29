export default async function handler(req, res) {
    try {
        const apiKey = process.env.GROQ_API_KEY;
        const userMessage = req.body.message || "สำรวจพื้นที่";

        const combinedPrompt = `คุณคือผู้คุมเกมแนว Sci-Fi Fantasy เรื่อง "ลับแล: ปฏิบัติการรุ่งอรุณสยาม"
แกนเรื่อง: หน่วยปฏิบัติการพิเศษ "พยัคฆ์ทมิฬ" นำโดย "ผู้กองกฤษณ์" หลุดข้ามมิติเวลาผ่านวิหารศิลาแลงและหมอกสีฟ้าเรืองแสง ไปโผล่ในยุคอยุธยาศตวรรษที่ 18

ตอบกลับเป็น JSON เท่านั้น ห้ามใส่ backtick หรือ markdown ใดๆ รูปแบบ:
{"text":"เนื้อเรื่องภาษาไทย 2-3 ประโยค","imagePrompt":"English scene description"}

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
                    messages: [{ role: "user", content: combinedPrompt }],
                    response_format: { type: "json_object" }
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {
            return res.status(response.status).json({ error: "Groq API Error", details: data });
        }

        let raw = data.choices?.[0]?.message?.content || "{}";
        raw = raw.replace(/```json/g, "").replace(/```/g, "").trim();

        let parsed;
        try {
            parsed = JSON.parse(raw);
        } catch (e) {
            parsed = { text: raw, imagePrompt: "Thai warrior in mystical ancient forest" };
        }

        return res.status(200).json(parsed);

    } catch (error) {
        return res.status(500).json({ error: "ระบบเซิร์ฟเวอร์ขัดข้อง", details: error.message });
    }
}
