document.addEventListener('DOMContentLoaded', function() {
  // ── Desktop dropdown ───────────────────────────────────────────────────────
  var dropdown = document.querySelector('.nav-dropdown');
  var trigger = dropdown && dropdown.querySelector(':scope > a');
  if (trigger) {
    trigger.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      dropdown.classList.toggle('open');
    });
    document.addEventListener('click', function(e) {
      if (dropdown && !dropdown.contains(e.target)) {
        dropdown.classList.remove('open');
      }
    });
  }

  // ── Active page marking ────────────────────────────────────────────────────
  var path = window.location.pathname.replace(/\/+$/, '');
  document.querySelectorAll('.nav-links a[href]').forEach(function(a) {
    if (a.getAttribute('href') === '#') return;
    var aPath = a.pathname ? a.pathname.replace(/\/+$/, '') : '';
    if (aPath && path === aPath) {
      a.classList.add('nav-active');
    }
  });

  // ── Full nav links (shared for both .nav and .topbar hamburgers) ───────────
  var NAV_HTML =
    '<a href="/sv/markagare">Markägare</a>' +
    '<a href="/sv/foretag">Företag</a>' +
    '<a href="/sv/klimatkompensera">Privatperson</a>' +
    '<span class="mob-nav-label">Verktyg</span>' +
    '<a href="/sv/co2">CO₂-kalkylator</a>' +
    '<a href="/sv/avkastning">Avkastningskalkylator</a>' +
    '<a href="/sv/prisvardhet">Prisvärdhetskalkylator</a>' +
    '<a href="/sv/bonitet">Bonitetsberäkning</a>' +
    '<a href="/sv/vardering">Fastighetsvärdering</a>' +
    '<a href="/sv/priser">Priser</a>' +
    '<a href="/sv/om-oss">Om Renatum</a>' +
    '<a href="/sv/klimatkompensera" class="mob-nav-cta">Kom igång</a>';

  // ── .nav hamburger (homepage + inner pages) ────────────────────────────────
  var nav = document.querySelector('.nav');
  var navLinks = document.querySelector('.nav-links');
  if (nav && navLinks) {
    var btn = document.createElement('button');
    btn.className = 'nav-toggle';
    btn.setAttribute('aria-label', 'Öppna meny');
    btn.setAttribute('aria-expanded', 'false');
    btn.innerHTML = '<span></span><span></span><span></span>';
    nav.appendChild(btn);

    btn.addEventListener('click', function() {
      var isOpen = nav.classList.toggle('nav-open');
      btn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      btn.setAttribute('aria-label', isOpen ? 'Stäng meny' : 'Öppna meny');
    });

    navLinks.addEventListener('click', function(e) {
      if (e.target.tagName === 'A') {
        nav.classList.remove('nav-open');
        btn.setAttribute('aria-expanded', 'false');
        btn.setAttribute('aria-label', 'Öppna meny');
      }
    });
  }

  // ── .topbar hamburger (tool pages) ────────────────────────────────────────
  var topbar = document.querySelector('.topbar');
  if (topbar && !nav) {
    var tbBtn = document.createElement('button');
    tbBtn.className = 'nav-toggle topbar-toggle';
    tbBtn.setAttribute('aria-label', 'Öppna meny');
    tbBtn.setAttribute('aria-expanded', 'false');
    tbBtn.innerHTML = '<span></span><span></span><span></span>';
    topbar.appendChild(tbBtn);

    var overlay = document.createElement('div');
    overlay.className = 'mob-nav-overlay';
    overlay.innerHTML = NAV_HTML;
    document.body.appendChild(overlay);

    function openMenu() {
      overlay.classList.add('open');
      topbar.classList.add('nav-open');
      tbBtn.setAttribute('aria-expanded', 'true');
      tbBtn.setAttribute('aria-label', 'Stäng meny');
    }
    function closeMenu() {
      overlay.classList.remove('open');
      topbar.classList.remove('nav-open');
      tbBtn.setAttribute('aria-expanded', 'false');
      tbBtn.setAttribute('aria-label', 'Öppna meny');
    }

    tbBtn.addEventListener('click', function() {
      overlay.classList.contains('open') ? closeMenu() : openMenu();
    });

    overlay.addEventListener('click', function(e) {
      if (e.target.tagName === 'A') closeMenu();
    });
  }
});

// ── Tool lead capture (shared across all tool pages) ──────────────────────
function submitToolLead(e, form) {
  e.preventDefault();
  var fd = new FormData(form);
  var data = {};
  fd.forEach(function(v, k) { data[k] = v; });

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: 'lead_capture',
    lead_tool:       data.tool        || '',
    lead_tier:       data.tier        || '',
    lead_calc_value: data.calc_value  || '',
    lead_areal:      data.areal       || '',
    lead_has_phone:  data.phone       ? 'yes' : 'no'
  });

  fetch('https://formsubmit.co/ajax/info@renatum.com', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify({
      _subject: 'Ny lead: ' + (data.tool || 'okänt') + ' — tier ' + (data.tier || '?'),
      verktyg:  data.tool        || '',
      tier:     data.tier        || '',
      varde:    data.calc_value  || '',
      areal:    data.areal       || '',
      telefon:  data.phone       || '',
      epost:    data.email       || ''
    })
  });

  form.innerHTML = '<p style="font-family:\'DM Sans\',sans-serif;font-size:0.9rem;color:#3d5c38;font-weight:500;padding:0.5rem 0;">Tack — vi återkommer med en konkret bedömning.</p>';
}
