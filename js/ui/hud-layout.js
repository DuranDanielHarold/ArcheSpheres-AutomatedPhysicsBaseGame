/* Experimental UI layout toggle. No gameplay state or simulation hooks. */
(function () {
  'use strict';
  function mount() {
    if (document.body.dataset.uiLayoutMounted === '1') return;
    document.body.dataset.uiLayoutMounted = '1';
    const toggle = document.createElement('button');
    toggle.id = 'ui-layout-toggle';
    toggle.type = 'button';
    toggle.setAttribute('aria-pressed', 'false');
    toggle.textContent = 'EXPERIMENT UI';
    toggle.title = 'Toggle experimental responsive UI styling';
    toggle.addEventListener('click', function () {
      const enabled = document.body.classList.toggle('ui-overhaul');
      toggle.setAttribute('aria-pressed', String(enabled));
      toggle.textContent = enabled ? 'LEGACY UI' : 'EXPERIMENT UI';
    });
    document.body.appendChild(toggle);
    if (new URLSearchParams(window.location.search).get('ui') === 'experimental') {
      document.body.classList.add('ui-overhaul');
      toggle.setAttribute('aria-pressed', 'true');
      toggle.textContent = 'LEGACY UI';
    }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount, { once: true });
  else mount();
})();
