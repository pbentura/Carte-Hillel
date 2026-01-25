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



// === PDF Generation functionality ===
document.addEventListener('DOMContentLoaded', () => {
    const generatePdfBtn = document.getElementById('generatePdfBtn');
    const loadingSpinner = document.getElementById('loadingSpinner');
    
    if (generatePdfBtn) {
        generatePdfBtn.addEventListener('click', async () => {
            try {
                // Afficher le spinner de chargement
                loadingSpinner.style.display = 'flex';
                generatePdfBtn.disabled = true;
                generatePdfBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Génération...';
                
                // Récupérer la section invitation
                const invitationSection = document.getElementById('invitation');
                
                // Créer une copie de la section pour le PDF
                const clonedSection = invitationSection.cloneNode(true);
                
                // Appliquer des styles spécifiques pour le PDF optimisé pour une page A4
                clonedSection.style.padding = '20px';
                clonedSection.style.backgroundColor = 'white';
                clonedSection.style.maxWidth = '100%';
                clonedSection.style.margin = '0';
                clonedSection.style.boxShadow = 'none';
                clonedSection.style.fontSize = '12px'; // Taille de base réduite
                
                // Réduire les tailles de police pour optimiser l'espace
                const style = document.createElement('style');
                style.textContent = `
                    .pdf-optimized {
                        font-size: 11px !important;
                        line-height: 1.3 !important;
                    }
                    .pdf-optimized .hebrew {
                        font-size: 14px !important;
                    }
                    .pdf-optimized .script-title {
                        font-size: 28px !important;
                        margin-bottom: 8px !important;
                    }
                    .pdf-optimized .invitation-font {
                        font-size: 16px !important;
                        margin-bottom: 4px !important;
                    }
                    .pdf-optimized .elegant-text {
                        font-size: 14px !important;
                    }
                    .pdf-optimized .date-text {
                        font-size: 24px !important;
                        margin-bottom: 4px !important;
                    }
                    .pdf-optimized .text-2xl {
                        font-size: 18px !important;
                    }
                    .pdf-optimized .text-3xl {
                        font-size: 20px !important;
                    }
                    .pdf-optimized .text-5xl {
                        font-size: 28px !important;
                    }
                    .pdf-optimized .text-6xl {
                        font-size: 32px !important;
                    }
                    .pdf-optimized .text-7xl {
                        font-size: 36px !important;
                    }
                    .pdf-optimized .mb-10 {
                        margin-bottom: 16px !important;
                    }
                    .pdf-optimized .mb-6 {
                        margin-bottom: 12px !important;
                    }
                    .pdf-optimized .mb-4 {
                        margin-bottom: 8px !important;
                    }
                    .pdf-optimized .mb-3 {
                        margin-bottom: 6px !important;
                    }
                    .pdf-optimized .mb-1 {
                        margin-bottom: 2px !important;
                    }
                    .pdf-optimized .gap-8 {
                        gap: 16px !important;
                    }
                    .pdf-optimized .gap-x-16 {
                        gap: 24px !important;
                    }
                    .pdf-optimized .grid-cols-2 {
                        grid-template-columns: 1fr 1fr !important;
                    }
                    .pdf-optimized .text-center {
                        text-align: center !important;
                    }
                    .pdf-optimized .text-left {
                        text-align: left !important;
                    }
                    .pdf-optimized .text-right {
                        text-align: right !important;
                    }
                `;
                document.head.appendChild(style);
                clonedSection.classList.add('pdf-optimized');
                
                // Cacher les éléments non désirés dans le PDF
                const buttons = clonedSection.querySelectorAll('button, a');
                buttons.forEach(button => button.style.display = 'none');
                
                // Créer un conteneur temporaire pour le PDF
                const tempContainer = document.createElement('div');
                tempContainer.style.position = 'absolute';
                tempContainer.style.left = '-9999px';
                tempContainer.style.top = '-9999px';
                tempContainer.style.width = '190mm'; // Largeur A4 avec marges
                tempContainer.style.minHeight = '270mm'; // Hauteur A4 avec marges
                tempContainer.style.padding = '10mm';
                tempContainer.style.backgroundColor = 'white';
                tempContainer.style.overflow = 'hidden';
                tempContainer.appendChild(clonedSection);
                
                document.body.appendChild(tempContainer);
                
                // Attendre un peu pour que les styles s'appliquent
                await new Promise(resolve => setTimeout(resolve, 500));
                
                // Générer le PDF avec html2canvas et jsPDF
                const canvas = await html2canvas(clonedSection, {
                    scale: 1.5, // Qualité réduite pour optimiser la taille
                    useCORS: true,
                    logging: false,
                    backgroundColor: '#ffffff',
                    width: clonedSection.scrollWidth,
                    height: Math.min(clonedSection.scrollHeight, 1000) // Limiter la hauteur
                });
                
                const imgData = canvas.toDataURL('image/png', 0.8); // Qualité d'image réduite
                
                // Créer le PDF
                const { jsPDF } = window.jspdf;
                const pdf = new jsPDF('p', 'mm', 'a4');
                
                const imgWidth = 190; // Largeur avec marges
                const pageHeight = 277; // Hauteur avec marges
                const imgHeight = (canvas.height * imgWidth) / canvas.width;
                
                // Centrer l'image sur la page
                const xOffset = (210 - imgWidth) / 2;
                const yOffset = (297 - Math.min(imgHeight, pageHeight)) / 2;
                
                // Ajouter l'image au PDF (une seule page)
                pdf.addImage(imgData, 'PNG', xOffset, yOffset, imgWidth, Math.min(imgHeight, pageHeight));
                
                // Télécharger le PDF
                pdf.save('Invitation-Simha-Hillel.pdf');
                
                // Nettoyer
                document.body.removeChild(tempContainer);
                document.head.removeChild(style);
                
            } catch (error) {
                console.error('Erreur lors de la génération du PDF:', error);
                alert('Une erreur est survenue lors de la génération du PDF. Veuillez réessayer.');
            } finally {
                // Cacher le spinner et réactiver le bouton
                loadingSpinner.style.display = 'none';
                generatePdfBtn.disabled = false;
                generatePdfBtn.innerHTML = '<i class="fas fa-file-pdf mr-2"></i>Générer un PDF';
            }
        });
    }
});
