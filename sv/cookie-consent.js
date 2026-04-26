(function () {
  'use strict';

  var STORAGE_KEY = 'renatum_consent';
  var CONSENT_TTL = 180 * 24 * 60 * 60 * 1000; // 6 months in ms

  // ── Helpers ────────────────────────────────────────────────────────────────
  function gtag() { window.dataLayer.push(arguments); }

  function applyConsent(prefs) {
    gtag('consent', 'update', {
      analytics_storage:    prefs.analytics ? 'granted' : 'denied',
      ad_storage:           prefs.marketing ? 'granted' : 'denied',
      ad_user_data:         prefs.marketing ? 'granted' : 'denied',
      ad_personalization:   prefs.marketing ? 'granted' : 'denied',
      functionality_storage: 'granted'
    });
  }

  function savePrefs(prefs) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        prefs: prefs,
        expires: Date.now() + CONSENT_TTL
      }));
    } catch(e) {}
  }

  function loadPrefs() {
    try {
      var stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
      if (!stored) return null;
      if (stored.expires && Date.now() > stored.expires) {
        localStorage.removeItem(STORAGE_KEY);
        return null;
      }
      // handle old format without expiry wrapper
      return stored.prefs || stored;
    } catch(e) { return null; }
  }

  function hideBanner() {
    var b = document.getElementById('cookie-banner');
    if (b) b.classList.remove('visible');
    setTimeout(function() { if (b) b.remove(); }, 500);
  }

  function hideModal() {
    var m = document.getElementById('cookie-modal');
    if (m) m.classList.remove('visible');
  }

  // ── Banner HTML ────────────────────────────────────────────────────────────
  function injectBanner() {
    var banner = document.createElement('div');
    banner.id = 'cookie-banner';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-label', 'Cookie-inställningar');
    banner.innerHTML =
      '<p>Vi använder cookies för att analysera trafik och förbättra din upplevelse. ' +
      'Läs mer i vår <a href="/sv/integritetspolicy">integritetspolicy</a>.</p>' +
      '<div class="cookie-actions">' +
        '<button class="cookie-btn cookie-btn-settings" id="cookie-open-settings">Anpassa</button>' +
        '<button class="cookie-btn cookie-btn-decline" id="cookie-decline">Avvisa alla</button>' +
        '<button class="cookie-btn cookie-btn-accept" id="cookie-accept">Acceptera alla</button>' +
      '</div>';
    document.body.appendChild(banner);

    // Animate in
    requestAnimationFrame(function() {
      requestAnimationFrame(function() { banner.classList.add('visible'); });
    });

    document.getElementById('cookie-accept').addEventListener('click', function() {
      var prefs = { necessary: true, analytics: true, marketing: true };
      savePrefs(prefs);
      applyConsent(prefs);
      hideBanner();
    });

    document.getElementById('cookie-decline').addEventListener('click', function() {
      var prefs = { necessary: true, analytics: false, marketing: false };
      savePrefs(prefs);
      applyConsent(prefs);
      hideBanner();
    });

    document.getElementById('cookie-open-settings').addEventListener('click', function() {
      showModal();
    });
  }

  // ── Modal HTML ─────────────────────────────────────────────────────────────
  function showModal(savedPrefs) {
    var existing = document.getElementById('cookie-modal');
    if (existing) { existing.classList.add('visible'); return; }

    var prefs = savedPrefs || loadPrefs() || {};
    var analyticsChecked = prefs.analytics ? 'checked' : '';
    var marketingChecked = prefs.marketing ? 'checked' : '';

    var modal = document.createElement('div');
    modal.id = 'cookie-modal';
    modal.innerHTML =
      '<div class="cookie-modal-box">' +
        '<h3>Cookie&#8209;inställningar</h3>' +
        '<p>Välj vilka cookies du tillåter. Du kan ändra dina val när som helst.</p>' +

        '<div class="cookie-category">' +
          '<div class="cookie-category-header">' +
            '<span class="cookie-category-title">Nödvändiga</span>' +
            '<label class="cookie-toggle">' +
              '<input type="checkbox" checked disabled>' +
              '<span class="cookie-toggle-slider"></span>' +
            '</label>' +
          '</div>' +
          '<p class="cookie-category-desc">Krävs för att sidan ska fungera. Kan inte stängas av.</p>' +
        '</div>' +

        '<div class="cookie-category">' +
          '<div class="cookie-category-header">' +
            '<span class="cookie-category-title">Analys</span>' +
            '<label class="cookie-toggle">' +
              '<input type="checkbox" id="consent-analytics" ' + analyticsChecked + '>' +
              '<span class="cookie-toggle-slider"></span>' +
            '</label>' +
          '</div>' +
          '<p class="cookie-category-desc">Hjälper oss förstå hur besökare använder sidan (Google Analytics).</p>' +
        '</div>' +

        '<div class="cookie-category">' +
          '<div class="cookie-category-header">' +
            '<span class="cookie-category-title">Marknadsföring</span>' +
            '<label class="cookie-toggle">' +
              '<input type="checkbox" id="consent-marketing" ' + marketingChecked + '>' +
              '<span class="cookie-toggle-slider"></span>' +
            '</label>' +
          '</div>' +
          '<p class="cookie-category-desc">Används för att visa relevanta annonser (Google Ads).</p>' +
        '</div>' +

        '<div class="cookie-modal-actions">' +
          '<button class="cookie-btn cookie-btn-decline" id="modal-decline">Avvisa alla</button>' +
          '<button class="cookie-btn cookie-btn-accept" id="modal-save">Spara val</button>' +
        '</div>' +
      '</div>';

    document.body.appendChild(modal);
    requestAnimationFrame(function() { modal.classList.add('visible'); });

    // Close on backdrop click
    modal.addEventListener('click', function(e) {
      if (e.target === modal) hideModal();
    });

    document.getElementById('modal-save').addEventListener('click', function() {
      var prefs = {
        necessary: true,
        analytics: document.getElementById('consent-analytics').checked,
        marketing: document.getElementById('consent-marketing').checked
      };
      savePrefs(prefs);
      applyConsent(prefs);
      hideModal();
      hideBanner();
    });

    document.getElementById('modal-decline').addEventListener('click', function() {
      var prefs = { necessary: true, analytics: false, marketing: false };
      savePrefs(prefs);
      applyConsent(prefs);
      hideModal();
      hideBanner();
    });
  }

  // ── Init ───────────────────────────────────────────────────────────────────
  function init() {
    var saved = loadPrefs();
    if (saved) {
      // Already consented — apply and load GTM silently
      applyConsent(saved);
    } else {
      // First visit — show banner, GTM waits
      injectBanner();
    }

    // Expose function for "Hantera cookies"-link in footer
    window.openCookieSettings = function() { showModal(); };
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
