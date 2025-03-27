document.addEventListener("DOMContentLoaded", function () {
    const editableElements = document.querySelectorAll("[contenteditable='true']");

    function updatePlaceholder(element) {
        element.classList.toggle("empty", element.textContent.trim() === "");
    }

    editableElements.forEach(element => {
        if (!element.dataset.placeholder) return;
        const key = element.dataset.placeholder;
        element.textContent = localStorage.getItem(key) || "";
        updatePlaceholder(element);

        element.addEventListener("input", () => {
            localStorage.setItem(key, element.textContent);
            updatePlaceholder(element);
        });

        element.addEventListener("blur", () => updatePlaceholder(element));
    });

    // ======= Генерация PDF =======
    document.getElementById("download-pdf").addEventListener("click", async function () {
        try {
            if (!window.jspdf) throw new Error("Библиотека jsPDF не загружена");

            const { jsPDF } = window.jspdf;
            let doc = new jsPDF({
                orientation: "portrait",
                unit: "mm",
                format: "a4"
            });

            // Использование стандартного шрифта
            doc.setFont("helvetica", "normal");
            doc.setFontSize(12);

            let y = 20;
            const elements = document.querySelectorAll("h1, h2, p, li");

            for (const element of elements) {
                let fontSize = 12;
                let fontStyle = "normal";

                if (element.tagName === 'H1') {
                    fontSize = 22;
                    fontStyle = "bold";
                } else if (element.tagName === 'H2') {
                    fontSize = 18;
                    fontStyle = "bold";
                }

                doc.setFont("helvetica", fontStyle);
                doc.setFontSize(fontSize);

                const text = element.tagName === 'LI' 
                    ? `• ${element.textContent}` 
                    : element.textContent;

                const lines = doc.splitTextToSize(text, 180);

                for (const line of lines) {
                    if (y > 280) {
                        doc.addPage();
                        y = 20;
                    }
                    doc.text(line, 15, y);
                    y += 10;
                }
                y += 5;
            }

            doc.save("resume.pdf");
        } catch (error) {
            alert("Ошибка генерации: " + error.message);
            console.error("Ошибка PDF:", error);
        }
    });

    // ======= Эффект Ripple =======
    document.querySelectorAll("button").forEach(button => {
        button.addEventListener("click", function (e) {
            const ripple = document.createElement("div");
            ripple.className = "ripple";

            const rect = button.getBoundingClientRect();
            ripple.style.left = `${e.clientX - rect.left}px`;
            ripple.style.top = `${e.clientY - rect.top}px`;

            this.appendChild(ripple);
            setTimeout(() => ripple.remove(), 600);
        });
    });
});