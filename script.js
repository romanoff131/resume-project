document.addEventListener("DOMContentLoaded", function () {
    const editableElements = document.querySelectorAll("[contenteditable='true']");

    // Загружаем сохраненные данные
    editableElements.forEach(element => {
        const key = element.dataset.placeholder; // Используем placeholder в качестве уникального ключа
        const savedContent = localStorage.getItem(key);
        if (savedContent) {
            element.innerText = savedContent;
        }

        // Автоматическое сохранение изменений
        element.addEventListener("input", function () {
            localStorage.setItem(key, element.innerText);
        });
    });

    // Кнопка скачивания PDF
    document.getElementById("download-pdf").addEventListener("click", function () {
        const { jsPDF } = window.jspdf;
        let doc = new jsPDF();

        // Загружаем кириллический шрифт (Roboto)
        fetch("https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.68/fonts/roboto/Roboto-Regular.ttf")
            .then(response => response.arrayBuffer())
            .then(fontData => {
                doc.addFileToVFS("Roboto-Regular.ttf", fontData);
                doc.addFont("Roboto-Regular.ttf", "Roboto", "normal");
                doc.setFont("Roboto");

                let y = 10;
                document.querySelectorAll("h1, h2, p, li").forEach(element => {
                    let text = element.innerText.trim();
                    if (text !== "") {
                        doc.text(text, 10, y, { maxWidth: 180 });
                        y += 10;
                    }
                });

                doc.save("resume.pdf");
            })
            .catch(error => console.error("Ошибка загрузки шрифта", error));
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