// =============================
// Parallax Fix for Mobile
// =============================
document.addEventListener("DOMContentLoaded", function () {

  if (window.innerWidth <= 768) {
    const sections = document.querySelectorAll('.parallax-section');

    sections.forEach(section => {
      section.style.backgroundAttachment = 'scroll';
    });
  }

  // =============================
  // Gallery Lightbox
  // =============================

  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxClose = document.getElementById('lightboxClose');
  const galleryLinks = document.querySelectorAll('.whispers-gallery .gallery-item');

  if (galleryLinks.length > 0) {

    galleryLinks.forEach(link => {
      link.addEventListener('click', function(e) {
        e.preventDefault();
        lightboxImg.src = this.getAttribute('href');
        lightbox.classList.add('active');
      });
    });

    lightboxClose.addEventListener('click', () => {
      lightbox.classList.remove('active');
      lightboxImg.src = '';
    });

    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        lightbox.classList.remove('active');
        lightboxImg.src = '';
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        lightbox.classList.remove('active');
        lightboxImg.src = '';
      }
    });

  }

});

// ===============================
// Automatic Footer Year
// ===============================

const currentYear = document.getElementById("current-year");

if (currentYear) {
  currentYear.textContent = new Date().getFullYear();
}