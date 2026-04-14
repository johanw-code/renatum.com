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

  // ── Mobile hamburger ───────────────────────────────────────────────────────
  var nav = document.querySelector('.nav');
  var navLinks = document.querySelector('.nav-links');
  if (!nav || !navLinks) return;

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

  // Close menu on link click
  navLinks.addEventListener('click', function(e) {
    if (e.target.tagName === 'A') {
      nav.classList.remove('nav-open');
      btn.setAttribute('aria-expanded', 'false');
      btn.setAttribute('aria-label', 'Öppna meny');
    }
  });
});
