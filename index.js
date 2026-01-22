// Variables pour le contrôle du scroll
let scrollLocked = true;

// Fonction pour bloquer le scroll
function lockScroll() {
    document.body.style.overflow = 'hidden';
    document.body.style.height = '100%';
    scrollLocked = true;
}

// Fonction pour débloquer le scroll
function unlockScroll() {
    document.body.style.overflow = '';
    document.body.style.height = '';
    scrollLocked = false;
}

// Montrer ce bouton dès qu'on clique sur "invitation"
document.getElementById("invitationButton").addEventListener("click", () => {
    document.getElementById("musicControlBtn").style.display = 'block';
});

// Forcer le retour en haut de page au chargement/rafraîchissement
window.addEventListener('beforeunload', () => {
    window.scrollTo(0, 0);
});

// S'assurer qu'on est en haut au chargement
if (history.scrollRestoration) {
    history.scrollRestoration = 'manual';
}

// Bloquer le scroll au chargement de la page
document.addEventListener('DOMContentLoaded', () => {
    // Forcer le scroll en haut
    window.scrollTo(0, 0);
    setTimeout(() => {
        window.scrollTo(0, 0);
    }, 10);

    lockScroll();

    // Ajouter l'event listener sur le bouton invitation
    const invitationBtn = document.querySelector('a[href="#invitation"]');
    if (invitationBtn) {
        invitationBtn.addEventListener('click', (e) => {
            e.preventDefault(); // Empêcher le comportement par défaut du lien
            unlockScroll();

            // Faire défiler vers la section invitation avec une animation fluide
            setTimeout(() => {
                const invitationSection = document.getElementById('invitation');
                if (invitationSection) {
                    invitationSection.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }, 100);
        });
    }
});

// Au chargement de la page, s'assurer qu'on est en haut
window.addEventListener('load', () => {
    window.scrollTo(0, 0);
});

// Empêcher le scroll avec les touches du clavier
document.addEventListener('keydown', (e) => {
    if (scrollLocked) {
        const scrollKeys = ['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'Home', 'End', 'Space'];
        if (scrollKeys.includes(e.code)) {
            e.preventDefault();
        }
    }
});

// Empêcher le scroll avec la molette
document.addEventListener('wheel', (e) => {
    if (scrollLocked) {
        e.preventDefault();
    }
}, { passive: false });

// Empêcher le scroll tactile
document.addEventListener('touchmove', (e) => {
    if (scrollLocked) {
        e.preventDefault();
    }
}, { passive: false });

// Reveal on scroll (modifié pour ne fonctionner que si le scroll est débloqué)
const onScroll = () => {
    if (!scrollLocked) {
        document.querySelectorAll('.reveal').forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.top < window.innerHeight - 80) el.classList.add('visible');
        });
    }
};
onScroll();
document.addEventListener('scroll', onScroll, {passive: true});

// Countdown to a specific date
const target = new Date('2026-03-15T18:00:00');

function tick() {
    const now = new Date();
    const diff = target - now;

    if (diff <= 0) {
        document.getElementById('days').textContent = "0";
        document.getElementById('hours').textContent = "0";
        document.getElementById('minutes').textContent = "0";
        document.getElementById('seconds').textContent = "0";

        const countdown = document.getElementById('countdown');
        countdown.innerHTML = `<p class="invitation-font text-4xl text-gold mt-4">C'est aujourd'hui !</p>`;
        return;
    }

    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);

    document.getElementById('days').textContent = d;
    document.getElementById('hours').textContent = h.toString().padStart(2, '0');
    document.getElementById('minutes').textContent = m.toString().padStart(2, '0');
    document.getElementById('seconds').textContent = s.toString().padStart(2, '0');
}

setInterval(tick, 1000);
tick();

// === Music functionality avec Howler.js ===
const music = new Howl({
    src: ['musique1.mp3'],
    loop: true,
    volume: 0, // commence à 0 pour le fade-in
});

const musicControlBtn = document.getElementById('musicControlBtn');
let musicStarted = false;
let isPlaying = false;

function fadeInHowler(sound, duration = 2000) {
    sound.play();
    sound.fade(0, 1, duration); // volume de 0 -> 1
    isPlaying = true;
    updateMusicIcon();
}

function fadeOutHowler(sound, duration = 2000) {
    sound.fade(sound.volume(), 0, duration);
    setTimeout(() => {
        sound.pause();
        isPlaying = false;
        updateMusicIcon();
    }, duration);
}

function updateMusicIcon() {
    const icon = musicControlBtn.querySelector('i');
    if (isPlaying) {
        icon.className = 'fa-solid fa-volume-high text-xl';
    } else {
        icon.className = 'fa-solid fa-volume-xmark text-xl';
    }
}

function toggleMusic() {
    if (isPlaying) {
        fadeOutHowler(music, 1000);
    } else {
        fadeInHowler(music, 1000);
    }
}

function checkSectionInView() {
    if (scrollLocked) return;

    const invitationSection = document.getElementById('invitation');
    if (!invitationSection) return;

    const rect = invitationSection.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    const isVisible = rect.top < windowHeight * 0.7 && rect.bottom > windowHeight * 0.3;

    if (isVisible && !musicStarted) {
        musicStarted = true;

        // Afficher le bouton
        musicControlBtn.classList.remove('hidden');

        // Lancer la musique avec fade-in
        fadeInHowler(music, 2000);
    }
}

// Event listener bouton
musicControlBtn.addEventListener('click', toggleMusic);

// Détection scroll / resize
window.addEventListener('scroll', checkSectionInView, {passive: true});
window.addEventListener('resize', checkSectionInView);

// Init icône
updateMusicIcon();

// === RSVP Form functionality ===
document.addEventListener('DOMContentLoaded', () => {
    const presenceOui = document.getElementById('presenceOui');
    const presenceNon = document.getElementById('presenceNon');
    const nombrePersonnes = document.getElementById('nombrePersonnes');
    const nombrePersonnesHint = document.getElementById('nombrePersonnesHint');
    const rsvpForm = document.getElementById('rsvpForm');
    const confirmationMessage = document.getElementById('confirmationMessage');

    // Fonction pour gérer l'état du champ nombre de personnes
    function updateNombrePersonnesState() {
        if (presenceOui && presenceOui.checked) {
            nombrePersonnes.disabled = false;
            nombrePersonnes.classList.remove('disabled:opacity-50', 'disabled:cursor-not-allowed', 'disabled:bg-gray-100');
            nombrePersonnesHint.textContent = '';
            nombrePersonnesHint.classList.add('hidden');
        } else if (presenceNon && presenceNon.checked) {
            nombrePersonnes.disabled = true;
            nombrePersonnes.value = '';
            nombrePersonnes.classList.add('disabled:opacity-50', 'disabled:cursor-not-allowed', 'disabled:bg-gray-100');
            nombrePersonnesHint.textContent = 'Ce champ n\'est pas requis si vous ne pouvez pas venir';
            nombrePersonnesHint.classList.remove('hidden');
        } else {
            nombrePersonnes.disabled = true;
            nombrePersonnesHint.textContent = 'Veuillez d\'abord indiquer votre présence';
            nombrePersonnesHint.classList.remove('hidden');
        }
    }

    // Écouteurs d'événements pour les boutons radio
    if (presenceOui) {
        presenceOui.addEventListener('change', updateNombrePersonnesState);
    }
    if (presenceNon) {
        presenceNon.addEventListener('change', updateNombrePersonnesState);
    }

    // Gestion de la soumission du formulaire
    if (rsvpForm) {
        rsvpForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Récupérer les données du formulaire
            const formData = new FormData(rsvpForm);
            const data = {
                nomPrenom: formData.get('nomPrenom'),
                presence: formData.get('presence'),
                nombrePersonnes: formData.get('nombrePersonnes') || '0',
                message: formData.get('message') || ''
            };

            // Afficher les données dans la console (pour debug)
            console.log('Données du formulaire:', data);

            // Désactiver le bouton pendant l'envoi
            const submitBtn = rsvpForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Envoi en cours...';

            try {
                // Envoi des données au webhook n8n
                // Note: mode 'no-cors' car le webhook n8n ne renvoie pas les headers CORS
                // await fetch('https://n8n.pbentura.cloud/webhook/75611bf0-6f53-4166-a69e-0a34077f9bc1', {
                await fetch('https://n8n.pbentura.cloud/webhook-test/75611bf0-6f53-4166-a69e-0a34077f9bc1', {
                    method: 'POST',
                    mode: 'no-cors',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data)
                });

                // Note: En mode no-cors, on ne peut pas vérifier response.ok
                // On suppose que l'envoi a réussi si aucune exception n'est levée
                console.log('Réponse envoyée avec succès!');

                // Cacher le formulaire et afficher le message de confirmation
                rsvpForm.classList.add('hidden');
                confirmationMessage.classList.remove('hidden');

                // Animation d'apparition
                confirmationMessage.style.opacity = '0';
                confirmationMessage.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    confirmationMessage.style.transition = 'all 0.5s ease';
                    confirmationMessage.style.opacity = '1';
                    confirmationMessage.style.transform = 'translateY(0)';
                }, 50);

            } catch (error) {
                console.error('Erreur:', error);
                
                // Réactiver le bouton
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnText;

                // Afficher un message d'erreur
                alert('Une erreur est survenue lors de l\'envoi. Veuillez réessayer.');
            }
        });
    }
});
