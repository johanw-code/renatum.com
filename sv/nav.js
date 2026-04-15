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

  // ── Full nav links (shared for both .nav and .topbar hamburgers) ───────────
  var NAV_HTML =
    '<a href="/sv/">Hem</a>' +
    '<a href="om-oss">Om oss</a>' +
    '<a href="case">Case</a>' +
    '<a href="priser">Priser</a>' +
    '<span class="mob-nav-label">Verktyg</span>' +
    '<a href="prisvardhet">Prisvärdhetskalkylator</a>' +
    '<a href="co2">CO₂-kalkylator</a>' +
    '<a href="avkastning">Avkastningskalkylator</a>' +
    '<a href="bonitet">Bonitetsberäkning</a>' +
    '<a href="vardering">Fastighetsvärdering</a>' +
    '<a href="markagare">Ny markägare — guide</a>' +
    '<a href="faq">FAQ</a>';

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
    // Inject hamburger button into topbar
    var tbBtn = document.createElement('button');
    tbBtn.className = 'nav-toggle topbar-toggle';
    tbBtn.setAttribute('aria-label', 'Öppna meny');
    tbBtn.setAttribute('aria-expanded', 'false');
    tbBtn.innerHTML = '<span></span><span></span><span></span>';
    topbar.appendChild(tbBtn);

    // Create overlay panel
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
  form.innerHTML = '<p style="font-family:\'DM Sans\',sans-serif;font-size:0.9rem;color:#3d5c38;font-weight:500;padding:0.5rem 0;">Tack — vi hör av oss inom 24h med en konkret bedömning.</p>';
}
