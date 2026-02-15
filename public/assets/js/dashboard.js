const sidebarToggle = document.querySelector('[data-sidebar-toggle]');
const sidebar = document.querySelector('[data-sidebar]');
if (sidebarToggle && sidebar) {
  sidebarToggle.addEventListener('click', () => {
    sidebar.classList.toggle('-translate-x-full');
  });
}

const progressBars = document.querySelectorAll('[data-progress]');
progressBars.forEach((bar) => {
  const value = bar.dataset.progress;
  bar.style.width = `${value}%`;
});
