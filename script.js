document.addEventListener("DOMContentLoaded", function () {
    const editableElements = document.querySelectorAll("[contenteditable='true']");

    // Загружаем сохраненные данные
    editableElements.forEach(element => {
        const savedContent = localStorage.getItem(element.innerText);
        if (savedContent) {
            element.innerText = savedContent;
        }

        // Автоматическое сохранение изменений
        element.addEventListener("input", function () {
            localStorage.setItem(element.innerText, element.innerText);
        });
    });

    // Кнопка скачивания PDF
    document.getElementById("download-pdf").addEventListener("click", function () {
        const { jsPDF } = window.jspdf;
        let doc = new jsPDF();

        let y = 10;
        document.querySelectorAll("h1, h2, p, li").forEach(element => {
            doc.text(element.innerText, 10, y);
            y += 10;
        });

        doc.save("resume.pdf");
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