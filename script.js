document.addEventListener('DOMContentLoaded', () => {
    const menuBtn = document.querySelector('.menu-btn');
    const sidebar = document.querySelector('.sidebar');
  
    menuBtn.addEventListener('click', () => {
      // Toggle the 'sidebar-open' class on/off
      sidebar.classList.toggle('sidebar-open');
    });
  });