/**
 * Interactive Features & Buttery Smooth Scroll Controller
 * - Smooth scroll with easeInOutCubic
 * - Mobile menu close-on-outside-click and Escape key
 * - Active nav link indicator on scroll
 * - Modern 3D Parallax Tilt effect on About Photo Frame (desktop only)
 */

function initPortfolioApp() {
  const navToggle = document.getElementById('nav-toggle');
  const navbar = document.getElementById('navbar');

  /* ===== 1. BUTTERY SMOOTH SCROLL ===== */
  let isScrolling = false;

  function smoothScrollTo(targetY, duration = 750) {
    const startY = window.pageYOffset;
    const distance = targetY - startY;
    if (Math.abs(distance) < 2) return;

    let startTime = null;
    isScrolling = true;

    function cancelScroll() {
      isScrolling = false;
      window.removeEventListener('wheel', cancelScroll);
      window.removeEventListener('touchstart', cancelScroll);
    }
    window.addEventListener('wheel', cancelScroll, { passive: true });
    window.addEventListener('touchstart', cancelScroll, { passive: true });

    function step(currentTime) {
      if (!isScrolling) return;
      if (!startTime) startTime = currentTime;
      
      const timeElapsed = currentTime - startTime;
      const progress = Math.min(timeElapsed / duration, 1);

      // Kurva Easing: easeInOutCubic
      const ease = progress < 0.5
        ? 4 * progress * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 3) / 2;

      window.scrollTo(0, startY + (distance * ease));

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        cancelScroll();
      }
    }

    requestAnimationFrame(step);
  }

  // Pasang handler ke semua anchor internal (#)
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (!href || href === '#') return;

      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();

        // Tutup menu mobile jika sedang terbuka
        if (navToggle && navToggle.checked) {
          navToggle.checked = false;
        }

        // Kompensasi tinggi fixed navbar
        const navHeight = 72;
        const targetY = (href === '#home')
          ? 0
          : Math.max(0, target.getBoundingClientRect().top + window.pageYOffset - navHeight);

        smoothScrollTo(targetY, 700);
      }
    });
  });

  /* ===== 2. MOBILE MENU OUTSIDE CLICK & ESCAPE KEY ===== */
  document.addEventListener('click', (e) => {
    if (navToggle && navToggle.checked) {
      if (!navbar.contains(e.target)) {
        navToggle.checked = false;
      }
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navToggle && navToggle.checked) {
      navToggle.checked = false;
    }
  });

  /* ===== 3. ACTIVE NAV LINK HIGHLIGHT ON SCROLL ===== */
  const sections = document.querySelectorAll('section[id]');
  const desktopLinks = document.querySelectorAll('.nav-links a');
  const mobileLinks = document.querySelectorAll('.mobile-menu a');

  function updateActiveNav() {
    const scrollY = window.pageYOffset + 120;

    sections.forEach(section => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop;
      const sectionId = section.getAttribute('id');

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        desktopLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${sectionId}`);
        });
        mobileLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${sectionId}`);
        });
      }
    });
  }

  window.addEventListener('scroll', updateActiveNav, { passive: true });
  updateActiveNav();

  /* ===== 4. 3D TILT EFFECT ON ABOUT PHOTO (DESKTOP) ===== */
  const photoFrame = document.getElementById('aboutPhotoFrame');
  if (photoFrame && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    photoFrame.addEventListener('mousemove', (e) => {
      const rect = photoFrame.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = ((y - centerY) / centerY) * -9; // Max 9 deg
      const rotateY = ((x - centerX) / centerX) * 9;

      photoFrame.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });

    photoFrame.addEventListener('mouseleave', () => {
      photoFrame.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
      photoFrame.style.transition = 'transform 0.5s ease';
    });

    photoFrame.addEventListener('mouseenter', () => {
      photoFrame.style.transition = 'none';
    });
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initPortfolioApp);
} else {
  initPortfolioApp();
}
