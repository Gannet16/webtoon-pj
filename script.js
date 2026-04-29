document.addEventListener("DOMContentLoaded", () => {
    const imageElement = document.getElementById("story-image");
    const textElement = document.getElementById("story-text");
    const inputElement = document.getElementById("user-input");
    const sendBtn = document.getElementById("send-btn");

    function showChoices(choices) {
        // ลบตัวเลือกเก่าออก
        document.getElementById("choices-area")?.remove();

        if (!choices || choices.length === 0) return;

        const choicesDiv = document.createElement("div");
        choicesDiv.id = "choices-area";
        choicesDiv.style.cssText = "margin-top:12px; display:flex; flex-direction:column; gap:8px;";

        const label = document.createElement("p");
        label.style.cssText = "color:#64ffda; font-size:0.85em; margin:0;";
        label.textContent = "💡 หรือเลือกจากตัวเลือกนี้:";
        choicesDiv.appendChild(label);

        choices.forEach(choice => {
            const btn = document.createElement("button");
            btn.textContent = choice;
            btn.style.cssText = `
                background: transparent;
                border: 1px solid #64ffda;
                color: #64ffda;
                padding: 8px 12px;
                border-radius: 6px;
                cursor: pointer;
                text-align: left;
                font-size: 0.9em;
                transition: background 0.2s;
            `;
            btn.onmouseover = () => btn.style.background = "rgba(100,255,218,0.1)";
            btn.onmouseout = () => btn.style.background = "transparent";
            btn.onclick = () => {
                inputElement.value = choice;
                handleAction();
            };
            choicesDiv.appendChild(btn);
        });

        textElement.parentElement.appendChild(choicesDiv);
    }

    async function handleAction() {
        const userCommand = inputElement.value.trim();
        if (userCommand === "") return;

        document.getElementById("choices-area")?.remove();

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

            // แสดงตัวเลือก
            showChoices(data.choices);

            const mangaPrompt = `manga panel, black and white, highly detailed, ${data.imagePrompt}, cinematic lighting, dramatic shadows, sci-fi historical fantasy, dynamic composition, expressive faces`;
            const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(mangaPrompt)}?width=600&height=400&nologo=true&seed=${Date.now()}`;

            imageElement.src = imageUrl;
            imageElement.onload = () => { imageElement.style.opacity = "1"; };
            imageElement.onerror = () => { imageElement.style.opacity = "1"; };

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
