// ----------------------------
// Gestion du diaporama d'images
// ----------------------------

let currentImageIndex = 0; // Index de l'image actuelle
const images = document.querySelectorAll('.image-diapo img'); // Sélectionne toutes les images du diaporama
const overlayText = document.getElementById('overlay-text'); // Sélectionne l'élément texte de l'overlay

// ----------------------------
// Fonction : Afficher une image en fonction de son index
// Parcourt toutes les images et n'affiche que celle avec l'index correspondant
// ----------------------------
function showImage(index) {
    images.forEach((img, i) => {
        if (i === index) {
            img.classList.add('active-image'); // Affiche l'image
            img.classList.remove('hidden-image'); // Retire la classe pour cacher l'image
        } else {
            img.classList.remove('active-image'); // Cache les autres images
            img.classList.add('hidden-image');
        }
    });
    
    // Met à jour le texte de l'overlay en fonction de l'image active
    overlayText.textContent = images[index].getAttribute('data-overlay');
}

// ----------------------------
// Fonction : Passer à l'image suivante
// Cette fonction gère la navigation vers l'image suivante avec une boucle
// ----------------------------
function nextImage() {
    currentImageIndex = (currentImageIndex + 1) % images.length; // Passe à l'image suivante avec un retour en boucle
    showImage(currentImageIndex);
}

// ----------------------------
// Fonction : Revenir à l'image précédente
// Gère la navigation vers l'image précédente
// ----------------------------
function prevImage() {
    currentImageIndex = (currentImageIndex - 1 + images.length) % images.length; // Reculer dans le diaporama
    showImage(currentImageIndex);
}

// ----------------------------
// Initialisation : Affichage de la première image et mise à jour de l'overlay
// ----------------------------
document.addEventListener('DOMContentLoaded', () => {
    showImage(currentImageIndex); // Affiche la première image et son texte d'overlay
});

// ----------------------------
// Gestion du défilement fluide
// Gère le défilement fluide entre les différentes sections lors du défilement de la souris
// ----------------------------
document.addEventListener("DOMContentLoaded", () => {
    const sections = document.querySelectorAll("section"); // Sélectionne toutes les sections de la page
    let currentSection = 0; // Index de la section actuelle

    // Fonction pour défiler vers une section spécifique
    const scrollToSection = (index) => {
        sections[index].scrollIntoView({ behavior: "smooth" }); // Défile de façon fluide vers la section
    };

    // Écoute les événements de défilement (molette de la souris)
    window.addEventListener("wheel", (event) => {
        if (event.deltaY > 0) { // Défilement vers le bas
            if (currentSection < sections.length - 1) {
                currentSection++;
                scrollToSection(currentSection); // Défile vers la section suivante
            }
        } else { // Défilement vers le haut
            if (currentSection > 0) {
                currentSection--;
                scrollToSection(currentSection); // Défile vers la section précédente
            }
        }
    });
});

// ----------------------------
// Animation des barres de compétences
// Animation qui démarre lorsque les barres de compétences deviennent visibles à l'écran
// ----------------------------
document.addEventListener("DOMContentLoaded", () => {
    const skillBars = document.querySelectorAll(".progress div"); // Sélectionne les barres de compétences

    const options = {
        root: null,
        threshold: 0.1 // Déclenche lorsque 10% de l'élément est visible
    };

    // IntersectionObserver pour démarrer l'animation des barres quand elles sont visibles
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animationPlayState = 'running'; // L'animation démarre
                observer.unobserve(entry.target); // Désactive l'observation après l'animation
            }
        });
    }, options);

    // Met en pause l'animation des barres de compétences jusqu'à ce qu'elles soient visibles
    skillBars.forEach(skill => {
        skill.style.animationPlayState = 'paused'; 
        observer.observe(skill);
    });
});

// ----------------------------
// Gestion des détails de la timeline
// Fonctionnalité pour ouvrir/fermer les détails d'une entrée de la timeline lorsque l'utilisateur clique
// ----------------------------
function toggleDetails(id) {
    // Fermer tous les détails d'abord
    const allDetails = document.querySelectorAll('.details');
    allDetails.forEach((detail) => {
		detail.style.maxHeight = null; 
        detail.classList.remove('open');
    });

    // Ouvrir la section spécifique cliquée
    const detailToOpen = document.getElementById(id);
    detailToOpen.classList.add('open');
    detailToOpen.style.maxHeight = detailToOpen.scrollHeight + "px";
}

// ----------------------------
// Ajouter des événements de clics sur les points et les titres de la timeline
// Pour chaque point de la timeline, gère l'ouverture de la section correspondante au clic
// ----------------------------
document.querySelectorAll('.timeline-dot, .date').forEach((element) => {
    element.addEventListener('click', (e) => {
        const id = e.target.closest('.timeline-point').dataset.id + '-details'; // Récupère l'ID de la section à ouvrir
        toggleDetails(id); // Ouvre la section correspondante
    });
});

// ----------------------------
// Diaporama d'images (détails)
// Gère le diaporama pour chaque conteneur d'images indépendamment
// ----------------------------
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.image-diapo').forEach(diapo => {
        let currentImageIndex = 0;
        const images = diapo.querySelectorAll('img');
        const overlayText = diapo.querySelector('.overlay-text');

        // Vérifie si la première image a bien la classe 'active-image', sinon l'ajouter
        if (!images[0].classList.contains('active-image')) {
            images[0].classList.add('active-image');
        }

        // Fonction pour afficher l'image en fonction de l'index
        function showImage(index) {
            images.forEach((img, i) => {
                img.classList.toggle('active-image', i === index);
                img.classList.toggle('hidden-image', i !== index);
            });
            overlayText.textContent = images[index].getAttribute('data-overlay');
        }

        // Navigation à l'image suivante
        diapo.querySelector('.arrow.right').addEventListener('click', () => {
            currentImageIndex = (currentImageIndex + 1) % images.length;
            showImage(currentImageIndex);
        });

        // Navigation à l'image précédente
        diapo.querySelector('.arrow.left').addEventListener('click', () => {
            currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
            showImage(currentImageIndex);
        });

        // Initialisation de l'image à afficher
        showImage(currentImageIndex);
    });
});

// ----------------------------
// Debugging - Diaporama "Septembre 2024"
// Ajout d'un log pour vérifier que la navigation fonctionne pour le conteneur "Septembre 2024"
// ----------------------------
diapo.querySelector('.arrow.right').addEventListener('click', () => {
    console.log('Next image clicked in "Septembre 2024"');
    currentImageIndex = (currentImageIndex + 1) % images.length;
    showImage(currentImageIndex);
});

// ----------------------------
// Désactiver les flèches si une seule image dans le diaporama
// Si le conteneur d'images ne contient qu'une image, cacher les flèches de navigation
// ----------------------------
document.querySelectorAll('.image-diapo').forEach(diapo => {
    const images = diapo.querySelectorAll('img');
    if (images.length === 1) {
        diapo.querySelector('.arrow.left').style.display = 'none';
        diapo.querySelector('.arrow.right').style.display = 'none';
    }
});
