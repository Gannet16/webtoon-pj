document.addEventListener("DOMContentLoaded", () => {
    const imageElement = document.getElementById("story-image");
    const textElement = document.getElementById("story-text");
    const inputElement = document.getElementById("user-input");
    const sendBtn = document.getElementById("send-btn");

    async function handleAction() {
        const userCommand = inputElement.value.trim();
        if (userCommand === "") return;

        // 1. แสดงสิ่งที่ผู้ใช้พิมพ์ และปิดปุ่มชั่วคราว
        textElement.innerHTML += `<br><br><b>คุณสั่งการ:</b> <i>"${userCommand}"</i>`;
        inputElement.value = "";
        inputElement.disabled = true;
        sendBtn.disabled = true;

        // 2. แสดงสถานะกำลังโหลด
        const loadingHtml = `<br><br><span id="loading-text" style="color:#007bff;">⏳ Jem ตัวจริงกำลังคิดเนื้อเรื่อง...</span>`;
        textElement.innerHTML += loadingHtml;
        
        // แก้ปัญหาที่ 1 (พี่ต๊อดแนะนำ): เปลี่ยนเว็บรูปภาพจำลองเป็น placehold.co
        imageElement.src = "https://placehold.co/600x400/cccccc/666666?text=AI+is+thinking...";
        
        const storyBox = document.querySelector('.story-content');
        storyBox.scrollTop = storyBox.scrollHeight;

        try {
            // 3. วิ่งไปเคาะประตูห้องลับ (Vercel Backend)
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: userCommand })
            });

            const data = await response.json();
            
            // แก้ปัญหาที่ 2 (พี่ต๊อดแนะนำ): ใส่เครื่องหมาย ? เพื่อดัก Error กันระบบระเบิด
            document.getElementById("loading-text")?.remove();

            // 4. แกะกล่องของขวัญที่เจม (Gemini) ส่งกลับมา
            let aiResponseText = data.candidates[0].content.parts[0].text;
            
            // ลบเครื่องหมายครอบ JSON ออก (ถ้ามี)
            aiResponseText = aiResponseText.replace(/```json/g, '').replace(/```/g, '').trim();
            const result = JSON.parse(aiResponseText);

            // 5. แสดงเนื้อเรื่องใหม่
            textElement.innerHTML += `<br><br><b>เรื่องราว:</b> ${result.text}`;
            
            // แสดง Prompt ภาษาอังกฤษ (ใช้เว็บใหม่ที่พี่ต๊อดแนะนำ)
            imageElement.src = `https://placehold.co/600x400/e6f2ff/333333?text=Prompt:+${encodeURIComponent(result.imagePrompt)}`;

        } catch (error) {
            document.getElementById("loading-text")?.remove();
            textElement.innerHTML += `<br><br><b style="color:red;">เกิดข้อผิดพลาด: ไม่สามารถเชื่อมต่อสมอง AI ได้</b>`;
        }

        // เปิดให้พิมพ์คำสั่งต่อไปได้
        inputElement.disabled = false;
        sendBtn.disabled = false;
        inputElement.focus();
        storyBox.scrollTop = storyBox.scrollHeight;
    }

    sendBtn.addEventListener("click", handleAction);
    inputElement.addEventListener("keypress", (event) => {
        if (event.key === "Enter") handleAction();
    });
});
