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

    // ======= Кнопка скачивания PDF =======
    document.getElementById("download-pdf").addEventListener("click", async function () {
        const { jsPDF } = window.jspdf;
        let doc = new jsPDF();

        try {
            let response = await fetch("https://cdn.jsdelivr.net/gh/diegodorado/jsPDF-Cyrillic-Roboto/Roboto-Regular.ttf");
            if (!response.ok) throw new Error("Ошибка загрузки шрифта.");

            let fontData = await response.arrayBuffer();
            let fontBase64 = btoa(String.fromCharCode(...new Uint8Array(fontData)));

            doc.addFileToVFS("Roboto-Regular.ttf", fontBase64);
            doc.addFont("Roboto-Regular.ttf", "Roboto", "normal");
            doc.setFont("Roboto");

            let y = 10;
            let pageHeight = doc.internal.pageSize.height;
            let lineHeight = 7;

            doc.setFontSize(18);
            doc.text("Резюме", 10, y);
            y += 10;

            document.querySelectorAll("h1, h2, p, li, [contenteditable='true']").forEach(element => {
                let text = element.innerText.trim();
                if (text !== "") {
                    doc.setFontSize(element.tagName === "H1" ? 16 : 12);

                    let splitText = doc.splitTextToSize(text, 180);
                    splitText.forEach(line => {
                        if (y + lineHeight > pageHeight - 10) {
                            doc.addPage();
                            y = 10;
                        }
                        doc.text(line, 10, y);
                        y += lineHeight;
                    });
                    y += 5;
                }
            });

            doc.save("resume.pdf");

        } catch (error) {
            console.error("Ошибка генерации PDF:", error);
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