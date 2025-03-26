// Проверяем, когда DOM загрузится
document.addEventListener("DOMContentLoaded", function () {
    // ======= Работа с contenteditable и localStorage =======
    const editableElements = document.querySelectorAll("[contenteditable='true']");

    function updatePlaceholder(element) {
        if (element.textContent.trim() === "") {
            element.classList.add("empty");
        } else {
            element.classList.remove("empty");
        }
    }

    editableElements.forEach(element => {
        if (!element.dataset.placeholder) return; // Предотвращаем ошибку при отсутствии data-placeholder
        const key = element.dataset.placeholder;
        const savedContent = localStorage.getItem(key);

        if (savedContent) {
            element.innerText = savedContent;
        }

        updatePlaceholder(element);

        element.addEventListener("input", function () {
            localStorage.setItem(key, element.innerText);
            updatePlaceholder(element);
        });

        element.addEventListener("blur", function () {
            updatePlaceholder(element);
        });
    });

    // ======= Проверяем, загружена ли jsPDF =======
    if (!window.jspdf) {
        console.error("Ошибка: библиотека jsPDF не загружена.");
        return;
    }

   // Кнопка скачивания PDF
   document.getElementById("download-pdf")?.addEventListener("click", async function () {
    try {
        const { jsPDF } = window.jspdf;
        let doc = new jsPDF();
        
        // Загрузка шрифта
        const fontUrl = "https://raw.githubusercontent.com/aursoft/fontRoboto/main/Roboto-Regular.ttf";
        const fontResponse = await fetch(fontUrl);
        const font = await fontResponse.arrayBuffer();
        
        doc.addFileToVFS("Roboto-Regular.ttf", font);
        doc.addFont("Roboto-Regular.ttf", "Roboto", "normal");
        doc.setFont("Roboto");

        let y = 20;
        const lineHeight = 10;
        const pageWidth = doc.internal.pageSize.width - 20;

        const elements = document.querySelectorAll("h1, h2, p, li");
        
        for (const element of elements) {
            // Определение стилей
            let fontSize = 12;
            let isBold = false;
            
            switch(element.tagName) {
                case 'H1':
                    fontSize = 22;
                    isBold = true;
                    break;
                case 'H2':
                    fontSize = 18;
                    isBold = true;
                    break;
                case 'LI':
                    doc.text('- ', 10, y);
                    break;
            }

            // Настройка шрифта
            doc.setFontSize(fontSize);
            doc.setFont("Roboto", isBold ? 'bold' : 'normal');

            // Обработка текста
            const text = element.innerText;
            const lines = doc.splitTextToSize(text, pageWidth);
            
            // Добавление текста
            for (const line of lines) {
                if (y > doc.internal.pageSize.height - 20) {
                    doc.addPage();
                    y = 20;
                }
                doc.text(line, element.tagName === 'LI' ? 15 : 10, y);
                y += lineHeight;
            }
            y += lineHeight * 0.5; // Межблочный интервал
        }

        doc.save("resume.pdf");
    } catch (error) {
        console.error('Ошибка генерации PDF:', error);
    }
});

    // ======= Эффект Material Wave для всех кнопок =======
    document.querySelectorAll("button").forEach(button => {
        button.addEventListener("click", function (e) {
            let ripple = document.createElement("span");
            ripple.classList.add("ripple");
            this.appendChild(ripple);

            let x = e.clientX - this.getBoundingClientRect().left;
            let y = e.clientY - this.getBoundingClientRect().top;

            ripple.style.left = `${x}px`;
            ripple.style.top = `${y}px`;

            setTimeout(() => ripple.remove(), 500);
        });
    });
});