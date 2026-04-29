document.addEventListener("DOMContentLoaded", () => {
    const imageElement = document.getElementById("story-image");
    const textElement = document.getElementById("story-text");
    const inputElement = document.getElementById("user-input");
    const sendBtn = document.getElementById("send-btn");

    async function handleAction() {
        const userCommand = inputElement.value.trim();
        if (userCommand === "") return;

        textElement.innerHTML += `<br><br><b>คำสั่ง:</b> <i>"${userCommand}"</i>`;
        inputElement.value = "";
        inputElement.disabled = true;
        sendBtn.disabled = true;

        const loadingSpan = document.createElement("span");
        loadingSpan.id = "loading-text";
        loadingSpan.style.color = "#64ffda";
        loadingSpan.innerHTML = "<br><br>⏳ กำลังประมวลผลปฏิบัติการ...";
        textElement.appendChild(loadingSpan);

        imageElement.style.opacity = "0.3";

        const storyBox = document.getElementById("story-content");
        if (storyBox) storyBox.scrollTop = storyBox.scrollHeight;

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: userCommand })
            });

            const data = await response.json();

            document.getElementById("loading-text")?.remove();

            textElement.innerHTML += `<br><br>${data.text}`;

            const mangaPrompt = `manga panel, black and white, highly detailed, ${data.imagePrompt}, cinematic lighting, dramatic shadows, sci-fi historical fantasy, dynamic composition, expressive faces`;
            const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(mangaPrompt)}?width=600&height=400&nologo=true&seed=${Date.now()}`;

            imageElement.src = imageUrl;

            imageElement.onload = () => {
                imageElement.style.opacity = "1";
                imageElement.alt = "manga panel";
            };

            imageElement.onerror = () => {
                imageElement.style.opacity = "1";
                imageElement.alt = "โหลดรูปไม่สำเร็จ";
            };

        } catch (error) {
            document.getElementById("loading-text")?.remove();
            imageElement.style.opacity = "1";
            textElement.innerHTML += `<br><br><b style="color:red;">เกิดข้อผิดพลาด: ไม่สามารถเชื่อมต่อระบบได้</b>`;
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
