document.addEventListener('DOMContentLoaded', () => {
  const menuBtn = document.querySelector('.menu-btn');
  const sidebar = document.querySelector('.sidebar');

  // 1. Load the nav.html into your sidebar
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

  // 2. Wire up your existing toggle
  menuBtn.addEventListener('click', () => {
    sidebar.classList.toggle('sidebar-open');
  });
});