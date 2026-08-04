const menuButton = document.querySelector('.menu-button');
const nav = document.querySelector('.nav');
const navLinks = document.querySelectorAll('.nav a');
const year = document.querySelector('#year');

menuButton.addEventListener('click', () => {
  const isOpen = nav.classList.toggle('active');
  menuButton.setAttribute('aria-expanded', String(isOpen));
});

navLinks.forEach((link) => {
  link.addEventListener('click', () => {
    nav.classList.remove('active');
    menuButton.setAttribute('aria-expanded', 'false');
  });
});

year.textContent = new Date().getFullYear();
