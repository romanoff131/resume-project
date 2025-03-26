document.addEventListener("DOMContentLoaded", function () {
    // ======= Редактируемые элементы =======
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
            let doc = new jsPDF();
            const fontUrl = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/fonts/Roboto-Regular.ttf";
            const font = await fetch(fontUrl).then(res => res.arrayBuffer());
            
            doc.addFileToVFS("Roboto-Regular.ttf", font);
            doc.addFont("Roboto-Regular.ttf", "Roboto", "normal");
            doc.setFont("Roboto");

            let y = 20;
            const elements = document.querySelectorAll("h1, h2, p, li");
            
            for (const element of elements) {
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
                }

                doc.setFontSize(fontSize);
                doc.setFont("Roboto", isBold ? "bold" : "normal");
                const text = element.tagName === 'LI' ? `• ${element.textContent}` : element.textContent;
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
            alert("Ошибка: " + error.message);
            console.error(error);
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