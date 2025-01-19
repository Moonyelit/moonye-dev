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
  sections.forEach((sec) => {
    let top = window.scrollY;
    let offset = sec.offsetTop - 150;
    let height = sec.offsetHeight;
    let id = sec.getAttribute("id");

    if (top >= offset && top < offset + height) {
      navLinks.forEach((links) => {
        links.classList.remove("active");
        document
          .querySelector("header nav a[href*=" + id + "]")
          .classList.add("active");
      });
    }
  });

  // =================================== sticky navbar========================
  let header = document.querySelector(".header");

  header.classList.toggle("sticky", window.scrollY > 100);

  /*========== remove menu icon navbar when click navbar link (scroll) ==========*/
  menuIcon.classList.remove("bx-x");
  navbar.classList.remove("active");
};

/*========== dark ou light mode enclenché et qui reste en fonction du choix  ==========*/

const darkModeIcon = document.querySelector("#darkMode-icon");

if(localStorage.getItem("theme") === "dark"){
  document.body.classList.add("dark-mode");
  darkModeIcon.classList.add("bx-sun");
}

darkModeIcon.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  darkModeIcon.classList.toggle("bx-sun");

  if(document.body.classList.contains("dark-mode")){
    localStorage.setItem("theme", "dark");
  }else{
    localStorage.setItem("theme", "light");
  }

});

/*========== forumulaire ==========*/

document.querySelector("form").addEventListener("submit", function (e) {
  const recaptchaResponse = document.getElementById("g-recaptcha-response").value;
  if (!recaptchaResponse) {
    e.preventDefault(); // Bloque la soumission du formulaire
    alert("Veuillez valider le CAPTCHA.");
  }
});

document.getElementById('contactForm').addEventListener('submit', async function (e) {
  e.preventDefault();

  const form = e.target;
  const formData = new FormData(form);

  try {
      const response = await fetch(form.action, {
          method: 'POST',
          body: formData,
          headers: {
              Accept: 'application/json',
          },
      });

      if (response.ok) {
          alert('Votre message a été envoyé avec succès !');
          window.location.href = 'index.html';
          form.reset(); // Réinitialiser le formulaire
      } else {
          alert('Une erreur est survenue. Veuillez réessayer.');
      }
  } catch (error) {
      alert('Erreur réseau. Veuillez vérifier votre connexion.');
  }
});
