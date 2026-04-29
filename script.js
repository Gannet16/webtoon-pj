document.addEventListener("DOMContentLoaded", () => {
    const imageElement = document.getElementById("story-image");
    const textElement = document.getElementById("story-text");
    const inputElement = document.getElementById("user-input");
    const sendBtn = document.getElementById("send-btn");

    async function handleAction() {
        const userCommand = inputElement.value.trim();
        if (userCommand === "") return;

        textElement.innerHTML += `<br><br><b>คุณสั่งการ:</b> <i>"${userCommand}"</i>`;
        inputElement.value = "";
        inputElement.disabled = true;
        sendBtn.disabled = true;

        const loadingSpan = document.createElement("span");
        loadingSpan.id = "loading-text";
        loadingSpan.style.color = "#007bff";
        loadingSpan.innerHTML = "<br><br>⏳ ระบบกำลังคิดเนื้อเรื่องและวาดภาพ...";
        textElement.appendChild(loadingSpan);

        // ให้รูปภาพแสดงสถานะว่ากำลังวาดรูป
        imageElement.src = "https://placehold.co/600x400/cccccc/666666?text=Drawing+Image...";

        const storyBox = document.querySelector('.story-content');
        if (storyBox) storyBox.scrollTop = storyBox.scrollHeight;

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: userCommand })
            });

            const data = await response.json();

            // ลบ loading
            document.getElementById("loading-text")?.remove();

            // แสดงเนื้อเรื่องภาษาไทย
            textElement.innerHTML += `<br><br><b>เรื่องราว:</b> ${data.text}`;
            
            // 🎨 ปลุกเสกรูปภาพของจริงด้วย Pollinations.ai
            imageElement.src = `https://image.pollinations.ai/prompt/${encodeURIComponent(data.imagePrompt)}?width=600&height=400&nologo=true`;

        } catch (error) {
            document.getElementById("loading-text")?.remove();
            textElement.innerHTML += `<br><br><b style="color:red;">เกิดข้อผิดพลาด: ไม่สามารถเชื่อมต่อสมอง AI ได้</b>`;
            // ถ้า Error ให้กลับไปแสดงรูปเทาๆ
            imageElement.src = "https://placehold.co/600x400/ffcccc/ff0000?text=Error";
        }

        inputElement.disabled = false;
        sendBtn.disabled = false;
        inputElement.focus();
        if (storyBox) storyBox.scrollTop = storyBox.scrollHeight;
    }

    sendBtn.addEventListener("click", handleAction);
    inputElement.addEventListener("keypress", (event) => {
        if (event.key === "Enter") handleAction();
    });
});
