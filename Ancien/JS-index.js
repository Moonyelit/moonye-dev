// ---------------------- SCROLL en DOUCEUR ----------------------
// Gère le défilement en douceur de la page vers les différentes sections
document.addEventListener("DOMContentLoaded", () => {
    const sections = document.querySelectorAll("section");
    let currentSection = 0;

    const scrollToSection = (index) => {
        sections[index].scrollIntoView({ behavior: "smooth" });
    };

    window.addEventListener("wheel", (event) => {
        if (event.deltaY > 0) {
            if (currentSection < sections.length - 1) {
                currentSection++;
                scrollToSection(currentSection);
            }
        } else {
            if (currentSection > 0) {
                currentSection--;
                scrollToSection(currentSection);
            }
        }
    });
});

// ---------------------- ANIMATION CARRE/SPAN ----------------------
// Active une animation sur l'élément 'span' lorsqu'il entre dans la zone visible de la page
document.addEventListener("DOMContentLoaded", () => {
    const target = document.querySelector(".sectionsplit .presentation h1 span");
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                target.classList.add("animate-square");
            } else {
                target.classList.remove("animate-square");
            }
        });
    });

    observer.observe(target);
});
