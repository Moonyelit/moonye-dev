/*========== menu icon navbar ==========*/
let menuIcon = document.querySelector("#menu-icon");
let navbar = document.querySelector(".navbar");

menuIcon.onclick = () => {
  menuIcon.classList.toggle("bx-x");
  navbar.classList.toggle("active");
};

/*========== scroll sections active link ==========*/
let sections = document.querySelectorAll("section");
let navLinks = document.querySelectorAll("header nav a");

window.onscroll = () => {
  try {
    sections.forEach((sec) => {
      let top = window.scrollY;
      let offset = sec.offsetTop - 150;
      let height = sec.offsetHeight;
      let id = sec.getAttribute("id");

      if (top >= offset && top < offset + height) {
        navLinks.forEach((links) => {
          links.classList.remove("active");
          document
            .querySelector(`header nav a[href*="${id}"]`)
            .classList.add("active");
        });
      }
    });

    // Sticky navbar
    let header = document.querySelector(".header");
    header.classList.toggle("sticky", window.scrollY > 100);

    // Remove menu icon navbar when clicking navbar link (scroll)
    menuIcon.classList.remove("bx-x");
    navbar.classList.remove("active");
  } catch (error) {
    console.error("Erreur dans le scroll :", error);
  }
};

/*========== dark ou light mode enclenché et qui reste en fonction du choix  ==========*/
const darkModeIcon = document.querySelector("#darkMode-icon");

if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark-mode");
  darkModeIcon.classList.add("bx-sun");
}

darkModeIcon.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  darkModeIcon.classList.toggle("bx-sun");

  localStorage.setItem(
    "theme",
    document.body.classList.contains("dark-mode") ? "dark" : "light"
  );
});

/*========== formulaire ==========*/
document
  .getElementById("contactForm")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    const form = e.target;
    const formData = new FormData(form);

    // Vérification des emails identiques
    if (formData.get("email") !== formData.get("emailConfirm")) {
      alert("Les adresses e-mail ne correspondent pas.");
      return;
    }

    // Vérification du reCAPTCHA
    const recaptchaElement = document.getElementById("g-recaptcha-response");
    if (!recaptchaElement || !recaptchaElement.value) {
      alert("Veuillez valider le CAPTCHA.");
      return;
    }

    console.log("Envoi du formulaire en cours...");

    try {
      const response = await fetch(form.action, {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
        },
      });

      console.log("Réponse reçue du serveur :", response);

      if (response.ok) {
        document.getElementById("alertSuccess").style.display = "block";

        // Réinitialisation du formulaire
        form.reset();

        // Attendre quelques secondes avant la redirection
        setTimeout(() => {
          window.location.href = "./index.html#home";
        }, 3000);
      } else {
        alert("Une erreur est survenue. Veuillez réessayer.");
      }
    } catch (error) {
      console.error("Erreur détectée :", error);
      alert("Erreur réseau. Veuillez vérifier votre connexion.");
    }
  });
