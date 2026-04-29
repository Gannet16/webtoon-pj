export default async function handler(req, res) {
    try {
        const apiKey = process.env.GROQ_API_KEY;
        if (!apiKey) {
            return res.status(500).json({ error: "ไม่พบ GROQ_API_KEY ใน Vercel" });
        }

        const userMessage = req.body.message || "สวัสดี";

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
                    temperature: 0.7, // เพิ่มจินตนาการให้นิยายสนุกขึ้น
                    messages: [
                        { 
                            // แอบกระซิบกติกาให้ AI รู้ตัวเดียว (ไม่ให้ปนกับคำสั่งผู้ใช้)
                            role: "system", 
                            content: "คุณคือผู้คุมเกมสวมบทบาทแนวโรแมนติกคอมเมดี้ ตัวละครหลักคือ 'เป้' (ชายหนุ่มกวนๆ) กับ 'ตาล' (หญิงสาวน่ารัก) หน้าที่คุณคือแต่งเนื้อเรื่องตอนต่อไปตามที่ผู้ใช้ออกคำสั่งให้สนุกและตลกขบขัน\n\n**ข้อบังคับสูงสุด:** ให้ตอบกลับเป็น JSON ดิบๆ เท่านั้น ห้ามอธิบายกติกาซ้ำ ห้ามมีข้อความอื่นนอกวงเล็บปีกกา ห้ามใช้ Markdown (
http://googleusercontent.com/immersive_entry_chip/0

3. กด **Commit changes...** 4. รอ Vercel อัปเดต 1 นาที แล้วกลับไปกดรีเฟรช (F5) พิมพ์คำสั่งทดสอบใหม่ได้เลยครับ!

รอบนี้รับรองว่าเนื้อเรื่องจะออกมาเป็นนิยายจริงๆ ไม่มีคำว่า "คุณคือผู้คุมเกม..." โผล่มาให้รกตาแล้วครับ ส่วนรูปภาพก็ทำงานได้สุดยอดมากครับ มาเป็นสไตล์อนิเมะเท่ๆ เลย! ลองดูนะครับคุณเป้! 🚀
