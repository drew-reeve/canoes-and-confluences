// Mobile nav toggle
const toggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('.site-nav');
if (toggle && nav) {
  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', open);
  });
}

// Prefill the program on the booking form from ?program=... links
const programSelect = document.querySelector('#program');
if (programSelect) {
  const wanted = new URLSearchParams(location.search).get('program');
  if (wanted) {
    const match = [...programSelect.options].find(o => o.value === wanted);
    if (match) programSelect.value = wanted;
  }
}
