document.addEventListener('DOMContentLoaded', () => {
  const menuBtn = document.querySelector('.menu-btn');
  const sidebar = document.querySelector('.sidebar');
  const lightbox = document.querySelector('[data-lightbox]');

  // 1. Load the nav.html into your sidebar
  if (sidebar) {
    fetch('nav.html')
      .then(res => {
        if (!res.ok) throw new Error('Couldn’t load nav.html');
        return res.text();
      })
      .then(html => {
        sidebar.innerHTML = html;
      })
      .catch(err => {
        console.error('Error loading navigation:', err);
        sidebar.innerHTML = '<p>Navigation failed to load.</p>';
      });
  }

  // 2. Wire up your existing toggle
  if (menuBtn && sidebar) {
    menuBtn.addEventListener('click', () => {
      sidebar.classList.toggle('sidebar-open');
    });
  }

  initialiseGallery(lightbox);
});

function initialiseGallery(lightbox) {
  const galleries = document.querySelectorAll('[data-gallery]');
  if (!galleries.length || !lightbox) return;

  const imageEl = lightbox.querySelector('.lightbox-image');
  const descriptionEl = lightbox.querySelector('.lightbox-description');
  const closeBtn = lightbox.querySelector('.lightbox-close');
  const prevBtn = lightbox.querySelector('.lightbox-prev');
  const nextBtn = lightbox.querySelector('.lightbox-next');

  let activeGalleryButtons = [];
  let activeIndex = 0;
  let isOpen = false;

  const updateLightbox = () => {
    const button = activeGalleryButtons[activeIndex];
    if (!button) return;

    const thumbImage = button.querySelector('img');
    const fullSrc = button.dataset.full || thumbImage?.src || '';
    const description = button.dataset.description || thumbImage?.alt || '';

    imageEl.src = fullSrc;
    imageEl.alt = thumbImage?.alt || '';
    descriptionEl.textContent = description;

    lightbox.classList.add('lightbox-open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.classList.add('no-scroll');
    isOpen = true;
  };

  const closeLightbox = () => {
    lightbox.classList.remove('lightbox-open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('no-scroll');
    imageEl.src = '';
    imageEl.alt = '';
    descriptionEl.textContent = '';
    isOpen = false;
  };

  const showPrev = () => {
    activeIndex = (activeIndex - 1 + activeGalleryButtons.length) % activeGalleryButtons.length;
    updateLightbox();
  };

  const showNext = () => {
    activeIndex = (activeIndex + 1) % activeGalleryButtons.length;
    updateLightbox();
  };

  galleries.forEach(gallery => {
    const buttons = Array.from(gallery.querySelectorAll('.gallery-thumb'));
    buttons.forEach((button, index) => {
      button.addEventListener('click', () => {
        activeGalleryButtons = buttons;
        activeIndex = index;
        updateLightbox();
      });
    });
  });

  closeBtn?.addEventListener('click', closeLightbox);
  prevBtn?.addEventListener('click', showPrev);
  nextBtn?.addEventListener('click', showNext);

  lightbox.addEventListener('click', event => {
    if (event.target === lightbox) {
      closeLightbox();
    }
  });

  document.addEventListener('keydown', event => {
    if (!isOpen) return;

    switch (event.key) {
      case 'Escape':
        closeLightbox();
        break;
      case 'ArrowLeft':
        showPrev();
        break;
      case 'ArrowRight':
        showNext();
        break;
      default:
        break;
    }
  });
}
