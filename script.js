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
    const match = [...programSelect.options].find(o => o.dataset.slug === wanted);
    if (match) match.selected = true;
  }
}

// Tailor the thank-you page to the form that was sent
const thanksTitle = document.querySelector('#thanks-title');
if (thanksTitle) {
  const messages = {
    booking:    ['Booking request sent', 'Laurie will reply within 3 business days with availability and a quote, or a little longer if she is out in the field.'],
    question:   ['Question sent', 'Laurie will get back to you soon.'],
    lesson:     ['Lesson request sent', 'Thanks for shaping what comes next. You will hear when new lessons are released.'],
    newsletter: ["You're on the list", 'Watch your inbox for new programs, lessons, and upcoming talks.']
  };
  const m = messages[new URLSearchParams(location.search).get('form')];
  if (m) {
    thanksTitle.textContent = m[0];
    document.querySelector('#thanks-text').textContent = m[1];
  }
}

// Build a descriptive email subject from the form contents, so each
// notification is easy to scan in the inbox, e.g.
// "Booking request: The Lolo Trail | Jane Smith, Kamiah Elementary | late March"
const subjectBuilders = {
  booking: f => ['Booking request: ' + (val(f, 'Program') || 'program not chosen'),
                 [val(f, 'name'), val(f, 'Organization')].filter(Boolean).join(', '),
                 val(f, 'Preferred dates')],
  question: f => ['Question (' + (val(f, 'Topic') || 'general') + ')', val(f, 'name')],
  'lesson-request': f => ['Lesson request', val(f, 'name'), val(f, 'Grade level')],
  newsletter: f => ['New email list signup', val(f, 'email')]
};
function val(form, name) {
  const el = form.elements[name];
  return el && el.value ? el.value.trim() : '';
}
document.querySelectorAll('form[data-netlify]').forEach(form => {
  form.addEventListener('submit', () => {
    const build = subjectBuilders[form.getAttribute('name')];
    const subject = form.elements['subject'];
    if (build && subject) subject.value = build(form).filter(Boolean).join(' | ');
  });
});
