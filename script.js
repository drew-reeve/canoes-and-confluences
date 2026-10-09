// Mobile nav toggle (closes after tapping a link, since links jump within the page)
const toggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('.site-nav');
if (toggle && nav) {
  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', open);
  });
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    nav.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
  }));
}

// "Plan a trail program" etc. link to /?setting=trail#contact: preselect that option
const settingSelect = document.querySelector('#setting');
if (settingSelect) {
  const wanted = new URLSearchParams(location.search).get('setting');
  const match = wanted && [...settingSelect.options].find(o => o.dataset.slug === wanted);
  if (match) match.selected = true;
}

// Descriptive email subject, e.g. "Inquiry: On the trail | Jane Smith, Kamiah Elementary"
const form = document.querySelector('form[name="contact"]');
if (form) {
  form.addEventListener('submit', () => {
    const v = n => (form.elements[n] && form.elements[n].value.trim()) || '';
    const who = [v('name'), v('Organization')].filter(Boolean).join(', ');
    form.elements['subject'].value = ['Inquiry: ' + (v('Interested in') || 'general'), who].filter(Boolean).join(' | ');
  });
}
