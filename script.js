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
    
            // Добавляем загруженный шрифт в jsPDF
            doc.addFileToVFS("Roboto-Regular.ttf", fontData);
            doc.addFont("Roboto-Regular.ttf", "Roboto", "normal");
            doc.setFont("Roboto");
    
            let y = 10;
            
            // Добавляем в PDF заголовок (например, "Резюме")
            doc.setFontSize(18);
            doc.text("Резюме", 10, y);
            y += 10;
            
            // Вывод всех текстовых элементов в PDF
            document.querySelectorAll("h1, h2, p, li").forEach(element => {
                let text = element.innerText.trim();
                if (text !== "") {
                    doc.setFontSize(element.tagName === "H1" ? 16 : 12);
                    doc.text(text, 10, y, { maxWidth: 180 });
                    y += 10;
                }
            });
    
            // Скачивание PDF
            doc.save("resume.pdf");
        } catch (error) {
            console.error("Ошибка загрузки шрифта или сохранения PDF-файла:", error);
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