document.addEventListener("DOMContentLoaded", function () {
    const editableElements = document.querySelectorAll("[contenteditable='true']");

    function updatePlaceholder(element) {
        if (element.textContent.trim() === "") {
            element.classList.add("empty");
        } else {
            element.classList.remove("empty");
        }
    }

    editableElements.forEach(element => {
        const key = element.dataset.placeholder; // Используем placeholder как ключ
        const savedContent = localStorage.getItem(key);
        
        // Загружаем сохраненные данные
        if (savedContent) {
            element.innerText = savedContent;
        }

        // Проверяем пустые элементы и отображаем placeholder
        updatePlaceholder(element);

        element.addEventListener("input", function () {
            localStorage.setItem(key, element.innerText);
            updatePlaceholder(element);
        });

        element.addEventListener("blur", function () {
            updatePlaceholder(element);
        });
    });
});

    // Кнопка скачивания PDF
    document.getElementById("download-pdf").addEventListener("click", async function () {
        const { jsPDF } = window.jspdf;
        let doc = new jsPDF();
    
        try {
            // Загружаем кириллический шрифт "Roboto"
            let response = await fetch("https://cdn.jsdelivr.net/gh/diegodorado/jsPDF-Cyrillic-Roboto/Roboto-Regular.ttf");
            let fontData = await response.arrayBuffer();
            let fontBase64 = btoa(
                new Uint8Array(fontData).reduce((data, byte) => data + String.fromCharCode(byte), "")
            );
    
            // Добавляем шрифт в jsPDF
            doc.addFileToVFS("Roboto-Regular.ttf", fontBase64);
            doc.addFont("Roboto-Regular.ttf", "Roboto", "normal");
            doc.setFont("Roboto");
    
            let y = 10;
            let pageHeight = doc.internal.pageSize.height;
            let lineHeight = 7; // Высота строки
    
            // Добавляем заголовок "Резюме"
            doc.setFontSize(18);
            doc.text("Резюме", 10, y);
            y += 10;
    
            // Добавляем текст из страницы в PDF
            document.querySelectorAll("h1, h2, p, li").forEach(element => {
                let text = element.innerText.trim();
                if (text !== "") {
                    doc.setFontSize(element.tagName === "H1" ? 16 : 12);
                    
                    let splitText = doc.splitTextToSize(text, 180); // Разбиваем текст по ширине
                    splitText.forEach(line => {
                        if (y + lineHeight > pageHeight - 10) { // Проверяем, не выходит ли за границу страницы
                            doc.addPage();
                            y = 10;
                        }
                        doc.text(line, 10, y);
                        y += lineHeight;
                    });
                    y += 5; // Добавляем небольшой отступ между элементами
                }
            });
    
            // Сохраняем и скачиваем PDF
            doc.save("resume.pdf");
    
        } catch (error) {
            console.error("Ошибка загрузки шрифта или генерации PDF:", error);
        }
    });

    // Эффект Material Wave
    document.querySelector("button").addEventListener("click", function (e) {
        let ripple = document.createElement("span");
        ripple.classList.add("ripple");
        this.appendChild(ripple);

        let x = e.clientX - this.offsetLeft;
        let y = e.clientY - this.offsetTop;

        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;

        setTimeout(() => ripple.remove(), 500);
    });
});