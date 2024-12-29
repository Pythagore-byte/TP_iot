// Animation de défilement pour les services
window.addEventListener('scroll', () => {
    const features = document.querySelector('.features');
    const rect = features.getBoundingClientRect();
    if (rect.top < window.innerHeight - 50) {
        features.style.opacity = '1';
        features.style.transform = 'translateY(0)';
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const features = document.querySelector('.features');
    features.style.opacity = '0';
    features.style.transform = 'translateY(30px)';
    features.style.transition = 'all 1s ease-in-out';
});
const currentPage = window.location.pathname.split("/").pop();
document.querySelectorAll(".nav-links a").forEach(link => {
    if (link.getAttribute("href") === currentPage) {
        link.classList.add("active");
    }
});

// Animation de la bannière
window.onload = () => {
    const bannerText = document.querySelector('.banner-content');
    bannerText.style.opacity = 0;
    bannerText.style.transition = 'opacity 2s ease-in-out';
    setTimeout(() => {
        bannerText.style.opacity = 1;
    }, 500);
};


