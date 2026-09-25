/**
 * Buttery Smooth Scroll & Mobile Menu Controller
 * Menggunakan requestAnimationFrame dengan kurva easeInOutCubic
 * untuk memastikan transisi scroll benar-benar halus (silky smooth)
 * di semua browser dan monitor (60Hz, 120Hz, 144Hz).
 */

function initSmoothScroll() {
  const navToggle = document.getElementById('nav-toggle');
  let isScrolling = false;

  function smoothScrollTo(targetY, duration = 750) {
    const startY = window.pageYOffset;
    const distance = targetY - startY;
    if (Math.abs(distance) < 2) return;

    let startTime = null;
    isScrolling = true;

    // Izinkan user menginterupsi animasi jika memutar scroll wheel atau menyentuh layar
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

      // Kurva Easing: easeInOutCubic (akselerasi halus di awal, deselerasi lembut di akhir)
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

  // Pasang handler ke semua link anchor internal (#)
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

        // Hitung posisi tepat dengan kompensasi fixed navbar
        const navHeight = 70;
        const targetY = (href === '#home')
          ? 0
          : Math.max(0, target.getBoundingClientRect().top + window.pageYOffset - navHeight);

        smoothScrollTo(targetY, 700);
      }
    });
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initSmoothScroll);
} else {
  initSmoothScroll();
}
