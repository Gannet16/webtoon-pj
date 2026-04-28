document.addEventListener("DOMContentLoaded", () => {
    // ดึงส่วนประกอบต่างๆ จากหน้าจอ HTML มาไว้ในตัวแปร
    const imageElement = document.getElementById("story-image");
    const textElement = document.getElementById("story-text");
    const inputElement = document.getElementById("user-input");
    const sendBtn = document.getElementById("send-btn");

    // เตรียมข้อมูลจำลอง (Mock Data) สมมติว่าเป็นคำตอบที่ได้จาก Jem
    const mockResponses = [
        {
            text: "เป้ตกใจสุดขีด กระโดดหลบไปด้านข้างด้วยความว่องไว ปล่อยให้ตาลพุ่งทะยานข้ามรถบะหมี่ไปหน้าคะมำกับพุ่มไม้ดัดรูปช้างอย่างจัง! สมุดเลคเชอร์กระจายเต็มพื้น",
            imageUrl: "https://via.placeholder.com/600x400/ffe6e6/333333?text=Manga+Panel+1:+Pae+dodging,+Taan+flying"
        },
        {
            text: "ตาลโมโหจัดที่เป้ห่วงรถมากกว่าคน เธอคว้าก้อนหินปาใส่เป้สุดแรง แต่ก้อนหินดันพลาดไปโดนกระจกรถบะหมี่แตกละเอียด! เป้ยืนอ้าปากค้างช็อกสุดขีด",
            imageUrl: "https://via.placeholder.com/600x400/e6f2ff/333333?text=Manga+Panel+2:+Rock+shattering+car+mirror"
        },
        {
            text: "เป้ฟิวส์ขาด กระโดดกะจะถีบตาล แต่ตาลหลบทัน ทำให้เป้พุ่งเข้าไปเสียบคาพุ่มไม้ดัดแทน โผล่มาแค่ขาสองข้างชี้ฟ้า ส่วนตาลรีบสับเกียร์หมาวิ่งหนีไปเลย!",
            imageUrl: "https://via.placeholder.com/600x400/e6ffe6/333333?text=Manga+Panel+3:+Pae+stuck+in+bush,+Taan+running"
        }
    ];

    let currentTurn = 0;

    // ฟังก์ชันสำหรับจัดการเมื่อกดปุ่มส่งคำสั่ง
    function handleAction() {
        const userCommand = inputElement.value.trim();
        if (userCommand === "") return; // ถ้าไม่ได้พิมพ์อะไรให้หยุดทำงาน

        // 1. แสดงสิ่งที่ผู้ใช้พิมพ์ลงไปในหน้าจอ และปิดปุ่มชั่วคราว
        textElement.innerHTML += `<br><br><b>คุณสั่งการ:</b> <i>"${userCommand}"</i>`;
        inputElement.value = "";
        inputElement.disabled = true;
        sendBtn.disabled = true;

        // 2. แสดงสถานะกำลังโหลด (จำลองว่า AI กำลังเจนรูป)
        const loadingHtml = `<br><br><span id="loading-text" style="color:#007bff;">⏳ Jem กำลังแต่งเรื่องและวาดภาพ...</span>`;
        textElement.innerHTML += loadingHtml;
        imageElement.src = "https://via.placeholder.com/600x400/cccccc/666666?text=Generating+Next+Scene...";
        
        // เลื่อนหน้าจอลงมาล่างสุด
        const storyBox = document.querySelector('.story-content');
        storyBox.scrollTop = storyBox.scrollHeight;

        // 3. จำลองการรอ API (หน่วงเวลา 2 วินาที)
        setTimeout(() => {
            // ลบข้อความกำลังโหลดออก
            document.getElementById("loading-text").remove();

            // ดึงข้อมูล Mockup มาแสดง (วนลูป 3 ฉากที่เตรียมไว้)
            const reply = mockResponses[currentTurn % mockResponses.length];
            currentTurn++;

            // แสดงเรื่องราวและรูปภาพใหม่
            textElement.innerHTML += `<br><br><b>เรื่องราว:</b> ${reply.text}`;
            imageElement.src = reply.imageUrl;

            // เปิดให้พิมพ์คำสั่งต่อไปได้
            inputElement.disabled = false;
            sendBtn.disabled = false;
            inputElement.focus();
            
            // เลื่อนหน้าจอลงมาล่างสุดอีกครั้ง
            storyBox.scrollTop = storyBox.scrollHeight;

        }, 2000); // 2000 มิลลิวินาที = 2 วินาที
    }

    // สั่งให้ปุ่มทำงานเมื่อถูกคลิก
    sendBtn.addEventListener("click", handleAction);

    // สั่งให้ทำงานเมื่อกดปุ่ม Enter บนคีย์บอร์ด
    inputElement.addEventListener("keypress", (event) => {
        if (event.key === "Enter") {
            handleAction();
        }
    });
});