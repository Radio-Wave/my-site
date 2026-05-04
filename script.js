document.addEventListener('DOMContentLoaded', () => {
  const menuBtn = document.querySelector('.menu-btn');
  const sidebar = document.querySelector('.sidebar');
  const lightbox = ensureLightbox();

  if (sidebar) {
    fetch('nav.html')
      .then(r => r.text())
      .then(html => { sidebar.innerHTML = html; });
  }

  if (menuBtn && sidebar) {
    menuBtn.addEventListener('click', () => {
      const isOpen = sidebar.classList.toggle('sidebar-open');
      menuBtn.setAttribute('aria-expanded', isOpen);
    });
  }

  initialiseGallery(lightbox);
});

function ensureLightbox() {
  const existing = document.querySelector('[data-lightbox]');
  if (existing) return existing;

  const lightbox = document.createElement('div');
  lightbox.className = 'lightbox';
  lightbox.setAttribute('data-lightbox', '');
  lightbox.setAttribute('aria-hidden', true);

  lightbox.innerHTML = `
    <button type="button" class="lightbox-button lightbox-close" aria-label="Close gallery">&times;</button>
    <button type="button" class="lightbox-button lightbox-prev" aria-label="Previous image">&#8249;</button>
    <figure class="lightbox-figure">
      <img class="lightbox-image" src="" alt="">
      <figcaption class="lightbox-description" aria-live="polite"></figcaption>
    </figure>
    <button type="button" class="lightbox-button lightbox-next" aria-label="Next image">&#8250;</button>
  `;

  document.body.appendChild(lightbox);
  return lightbox;
}

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

  const isOpen = () => lightbox.classList.contains('lightbox-open');

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
    lightbox.setAttribute('aria-hidden', false);
    document.body.classList.add('no-scroll');
  };

  const closeLightbox = () => {
    lightbox.classList.remove('lightbox-open');
    lightbox.setAttribute('aria-hidden', true);
    document.body.classList.remove('no-scroll');
    imageEl.src = '';
    imageEl.alt = '';
    descriptionEl.textContent = '';
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
    if (event.target === lightbox) closeLightbox();
  });

  let touchStartX = 0;
  lightbox.addEventListener('touchstart', event => {
    touchStartX = event.changedTouches[0].clientX;
  }, { passive: true });

  lightbox.addEventListener('touchend', event => {
    if (!isOpen()) return;
    const delta = event.changedTouches[0].clientX - touchStartX;
    if (Math.abs(delta) < 40) return;
    if (delta < 0) showNext();
    else showPrev();
  }, { passive: true });

  document.addEventListener('keydown', event => {
    if (!isOpen()) return;
    switch (event.key) {
      case 'Escape':    closeLightbox(); break;
      case 'ArrowLeft': showPrev();      break;
      case 'ArrowRight': showNext();     break;
    }
  });
}
