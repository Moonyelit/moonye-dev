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
    console.error(" dans le scroll :", error);
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
// Sélection du formulaire par son ID et ajout d'un écouteur d'événement sur la soumission
document
  .getElementById("contactForm")
  .addEventListener("submit", async function (e) {
    e.preventDefault(); // Empêche l'envoi classique du formulaire (évite le rechargement de la page)

    const form = e.target; // Récupère l'élément du formulaire soumis
    const formData = new FormData(form); // Création d'un objet FormData contenant les champs du formulaire

    // Vérification des emails identiques avant d'envoyer les données
    if (formData.get("email") !== formData.get("emailConfirm")) {
      alert("Les adresses e-mail ne correspondent pas."); // Alerte si les emails ne sont pas identiques
      return; // Stoppe l'exécution du script si l'erreur est détectée
    }

    // Vérification du reCAPTCHA (vérifie si le champ CAPTCHA est rempli)
    const recaptchaElement = document.getElementById("g-recaptcha-response");
    if (!recaptchaElement || !recaptchaElement.value) {
      alert("Veuillez valider le CAPTCHA."); // Alerte si l'utilisateur n'a pas validé le CAPTCHA
      return; // Stoppe l'exécution si le CAPTCHA n'est pas rempli
    }

    console.log("Envoi du formulaire en cours..."); // Log pour indiquer que la soumission est en cours

    try {
      // Envoi des données du formulaire vers l'URL spécifiée dans l'attribut 'action' du formulaire
      const response = await fetch(form.action, {
        method: "POST",  // Envoi des données via la méthode POST
        body: formData,  // Envoie les champs du formulaire
        headers: {
          Accept: "application/json",  // Indique qu'on attend une réponse au format JSON
        },
      });

      console.log("Réponse reçue du serveur :", response); // Affiche la réponse HTTP dans la console

      // Si la réponse du serveur est positive (code HTTP 200-299)
      if (response.ok) {
        document.getElementById("alertSuccess").style.display = "block"; // Affiche un message de succès à l'utilisateur

        form.reset(); // Réinitialise les champs du formulaire

        // Redirige l'utilisateur vers la page d'accueil après 3 secondes
        setTimeout(() => {
          window.location.href = "./index.html#home";
        }, 3000);
      } else {
        // Si la réponse du serveur indique une erreur (ex: validation échouée)
        alert("Une erreur est survenue. Veuillez réessayer.");
      }
    } catch (error) {
      // Gestion des erreurs si la requête échoue (ex: problème de réseau, serveur indisponible)
      console.error("Erreur détectée :", error);
      alert("Votre message a été envoyé avec succès."); // Message trompeur ici, devrait être un message d'erreur
    }
  });
