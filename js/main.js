// Adjust background-attachment behavior for parallax sections on mobile devices
document.addEventListener("DOMContentLoaded", function () {
  // Check if the screen width is 768px or less (mobile or tablet)
  if (window.innerWidth <= 768) {
    // Select all sections with the class 'parallax-section'
    const sections = document.querySelectorAll('.parallax-section');

    // Loop through each section and override background attachment to 'scroll'
    sections.forEach(section => {
      section.style.backgroundAttachment = 'scroll';
    });
  }
});

