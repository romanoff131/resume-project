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
document.getElementById("download-pdf").addEventListener("click", async function () {
    const { jsPDF } = window.jspdf;
    let doc = new jsPDF();

    // Загружаем кастомный шрифт с поддержкой кириллицы
    const fontUrl = "https://raw.githubusercontent.com/aursoft/fontRoboto/main/Roboto-Regular.ttf";
    const font = await fetch(fontUrl).then(res => res.arrayBuffer());

    // Встраивание шрифта в jsPDF
    doc.addFileToVFS("Roboto-Regular.ttf", font);
    doc.addFont("Roboto-Regular.ttf", "Roboto", "normal");
    doc.setFont("Roboto");

    let y = 10;
    document.querySelectorAll("h1, h2, p, li").forEach(element => {
        doc.text(element.innerText, 10, y);
        y += 10;
    });

    doc.save("resume.pdf");
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