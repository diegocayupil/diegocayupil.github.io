/* medir.js · cuenta visitas del sitio de Diego Cayupil. Sin publicidad y sin datos personales.
 *
 * CONFIGURACIÓN: pega tus ID entre las comillas y vuelve a correr publicar.py.
 *   GA4_ID      Google Analytics 4 → Administrar → Flujos de datos → Web → «ID de medición» (empieza con G-)
 *   CLARITY_ID  Microsoft Clarity (opcional) → Settings → Overview → «Project ID» (10 letras y números)
 * Si los dos quedan vacíos, este archivo no hace nada: no carga scripts, no guarda cookies, no envía eventos.
 */
const GA4_ID = 'G-VG6P0CNRN0';
const CLARITY_ID = 'zf3mzjfpig';

(function () {
  'use strict';
  const T = window.__MEDIR_TEST || {};                 // solo para la prueba local (probar_medir.mjs); en el sitio no existe
  const ga4 = T.ga4 !== undefined ? T.ga4 : GA4_ID, clarityId = T.clarity !== undefined ? T.clarity : CLARITY_ID;
  if (!ga4 && !clarityId) return;                       // apagado
  if (navigator.globalPrivacyControl === true || T.gpc) return;   // la persona pidió no ser seguida: se respeta

  const root = document.documentElement, KEY = 'dc.medir';
  const lang = () => root.lang === 'es' ? 'es' : 'en';
  const mode = () => root.dataset.ui === 'dark' ? 'dark' : 'light';
  const page = root.dataset.page || (location.pathname.split('/').pop().replace('.html', '') || 'index');
  const tz = T.tz || (Intl.DateTimeFormat().resolvedOptions().timeZone || '');
  const europa = /^Europe\//.test(tz) || /^Atlantic\/(Canary|Madeira|Azores|Faroe|Reykjavik)$/.test(tz);
  let elegido = T.acepta ? 'si' : null; try { if (!elegido) elegido = localStorage.getItem(KEY) } catch (e) {}   // T.acepta: solo la prueba local

  // ── pie: una línea de privacidad, al final de la última vista ───────────────
  function pie() {
    const last = [...document.querySelectorAll('.slide')].pop() || document.body;
    const p = document.createElement('p'); p.className = 'medir-pie';
    const es = lang() === 'es';
    p.innerHTML = (es ? 'Este sitio mide visitas solo si aceptas; sin publicidad. ' : 'This site measures visits only if you accept. No ads. ')
      + '<button type="button" class="medir-cambiar" style="font:inherit;color:inherit;background:none;border:0;padding:0;text-decoration:underline;cursor:pointer;pointer-events:auto">' + (es ? 'Cambiar' : 'Change') + '</button>';
    p.style.cssText = 'position:absolute;left:0;right:0;bottom:10px;margin:0;text-align:center;font:500 11px/1.4 system-ui,sans-serif;opacity:.62;color:inherit;pointer-events:none;z-index:2';
    p.querySelector('button').addEventListener('click', () => { try { localStorage.removeItem(KEY) } catch (e) {} if (!document.querySelector('.medir-aviso')) aviso() });
    if (getComputedStyle(last).position === 'static') last.style.position = 'relative';
    last.appendChild(p);
  }

  // ── aviso para Europa: medir solo si acepta ─────────────────────────────────
  function aviso() {
    const es = lang() === 'es', d = document.createElement('div');
    d.className = 'medir-aviso'; d.setAttribute('role', 'dialog'); d.setAttribute('aria-label', es ? 'Aviso de medición' : 'Analytics notice');
    d.style.cssText = 'position:fixed;left:16px;bottom:16px;z-index:9999;max-width:340px;padding:14px 16px;border-radius:12px;background:#fff;color:#141A26;box-shadow:0 8px 30px rgba(0,0,0,.25);font:500 14px/1.45 system-ui,sans-serif';
    d.innerHTML = '<p style="margin:0 0 10px">' + (es ? '¿Me dejas medir tu visita? Veo qué vistas y pasos se miran, sin tu nombre y sin publicidad.'
      : 'May I measure your visit? I only see which views and steps are read: no name, no ads.') + '</p><div style="display:flex;gap:8px">'
      + '<button type="button" data-v="si" style="flex:1;padding:8px;border-radius:8px;border:0;background:#1F4E8C;color:#fff;font:600 14px system-ui,sans-serif;cursor:pointer">' + (es ? 'Aceptar' : 'Accept') + '</button>'
      + '<button type="button" data-v="no" style="flex:1;padding:8px;border-radius:8px;border:1px solid #9AA4B5;background:#fff;color:#141A26;font:600 14px system-ui,sans-serif;cursor:pointer">' + (es ? 'No, gracias' : 'No, thanks') + '</button></div>';
    d.addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; try { localStorage.setItem(KEY, b.dataset.v) } catch (x) {} d.remove(); if (b.dataset.v === 'si') medir() });
    document.body.appendChild(d);
  }

  // ── la medición ─────────────────────────────────────────────────────────────
  let activo = false;
  function medir() {
    if (activo) return; activo = true;
    if (ga4) {
      window.dataLayer = window.dataLayer || [];
      if (typeof window.gtag !== 'function') window.gtag = function () { window.dataLayer.push(arguments) };
      if (!T.noload) { const s = document.createElement('script'); s.async = true; s.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(ga4); document.head.appendChild(s) }
      gtag('consent', 'default', { ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied', analytics_storage: 'granted' });
      gtag('js', new Date());
      gtag('config', ga4, { allow_google_signals: false, allow_ad_personalization_signals: false, site_lang: lang(), site_mode: mode() });
    }
    if (clarityId && !T.noload) {
      (function (c, l, a, r, i, t, y) { c[a] = c[a] || function () { (c[a].q = c[a].q || []).push(arguments) }; t = l.createElement(r); t.async = 1; t.src = 'https://www.clarity.ms/tag/' + i; y = l.getElementsByTagName(r)[0]; y.parentNode.insertBefore(t, y) })(window, document, 'clarity', 'script', clarityId);
    }
    if (clarityId && typeof window.clarity === 'function') window.clarity('consentv2', { ad_Storage: 'denied', analytics_Storage: 'granted' });   // ya aceptó (o no está en Europa); sin publicidad. API vigente al 17-nov-2026: «consentv2» (la antigua clarity('consent') está por retirarse)
    escuchar();
  }

  function ev(name, params) {
    params = Object.assign({ page_name: page, lang: lang(), mode: mode() }, params || {});
    if (ga4 && typeof window.gtag === 'function') gtag('event', name, params);
    if (clarityId && typeof window.clarity === 'function') window.clarity('event', name);
  }

  function escuchar() {
    const slides = [...document.querySelectorAll('.slide')], N = slides.length;
    const nombre = i => { const s = slides[i]; return s ? (s.dataset.lEn || s.id || String(i + 1)) : '' };
    let actual = null, desde = 0, vioUltima = false;
    function salir() {
      if (!actual) return; const seg = Math.round((performance.now() - desde) / 1000);
      if (seg >= 1) ev('view_time', { view_index: actual.sl + 1, view_step: actual.step, view_name: nombre(actual.sl), seconds: Math.min(seg, 1800) });
    }
    function vista(sl, step) {
      step = step || 1; const k = sl + '.' + step;
      if (actual && actual.k === k) return;               // el mismo cambio dos veces: se cuenta una
      salir(); actual = { sl, step, k }; desde = performance.now();
      ev('view_change', { view_index: sl + 1, view_step: step, view_name: nombre(sl), views_total: N });
      const ns = +(slides[sl] && slides[sl].dataset.steps) || 1;
      if (!vioUltima && sl === N - 1 && step >= ns) { vioUltima = true; ev('view_last', { views_total: N }) }
      // v5.29: los pasos de un proyecto, con su nombre (para ver hasta dónde llega cada visita)
      const s = slides[sl]; if (s && s.classList.contains('pj')) { const b = s.querySelector('.pj-rail button[data-st="' + step + '"]'), t = b && (b.querySelector('.' + lang()) || b);
        ev('project_step', { project: s.id, step: step, step_name: t ? t.textContent.trim().slice(0, 60) : String(step), steps_total: ns }) }
    }
    document.addEventListener('slidechange', e => { const d = e.detail || {}; if (typeof d.sl === 'number') vista(d.sl, d.step) });
    // la vista con la que se abre la página (el sitio la anuncia antes de que este archivo cargue): se anota al tiro,
    // por el #hash o ?s= de la dirección; si después el sitio anuncia la misma, no se repite
    if (N) { const h = location.hash.slice(1) || new URLSearchParams(location.search).get('s') || '', i = slides.findIndex(s => s.id === h); vista(i >= 0 ? i : 0, 1) }
    addEventListener('pagehide', salir);
    document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden') { salir(); desde = performance.now() } else desde = performance.now() });

    // clics: CV, contacto, proyectos, idioma; la pregunta elegida en «Ask me»
    document.addEventListener('click', e => {
      const a = e.target.closest('a'), b = e.target.closest('button');
      if (a) {
        const h = a.getAttribute('href') || '';
        if (/\/cv\/[^/]*\.pdf$/i.test(h)) ev('cv_download', { cv_lang: /-ES\.pdf$/i.test(h) ? 'es' : 'en' });
        else if (/^mailto:/i.test(h)) ev('contact_click', { method: a.classList.contains('cw-open') ? 'composer' : 'email' });   // la dirección no se envía
        else if (/linkedin\.com/i.test(h)) ev('contact_click', { method: 'linkedin' });
        else if (/github\.com/i.test(h)) ev('contact_click', { method: 'github' });
        else if (/(projects|proyectos)\.html#c\d+/.test(h)) ev('project_open', { project: h.split('#')[1] });
      }
      if (b && b.dataset.lang && b.dataset.lang !== lang()) ev('lang_switch', { to: b.dataset.lang });
      if (b && b.matches('.pj-lvbtn, .pj-try')) ev('live_dashboard', { where: b.classList.contains('pj-lvbtn') ? 'header' : 'step' });
      if (b && b.matches('.pj-go1')) ev('project_start', {});
      if (b && b.matches('.qx-t')) ev('pain_select', { pain: (+b.dataset.p || 0) + 1 });
      if (b && b.matches('.cw-copy')) ev('contact_click', { method: 'copy_message' });
      if (b && b.matches('.mailline .copy')) ev('contact_click', { method: 'copy_email' });
      if (b && b.closest('.ask-sg, .aq-qs')) {            // .ask-sg hasta la v5.25; .aq-qs desde la v5.26 (solo preguntas fijas)                    // solo las preguntas escritas por Diego, nunca lo que tipea la persona
        const v = b.querySelector('.' + lang()) || b; ev('ask_question', { question: (v.textContent || '').replace('→', '').trim().slice(0, 100) });
      }
    }, true);
    document.addEventListener('submit', e => { if (e.target.closest('.ask-f')) ev('ask_typed', {}) }, true);
    document.addEventListener('toggle', e => { const d = e.target; if (d.open && d.closest && d.closest('.cw-faq')) { const q = d.querySelector('summary .' + lang()) || d.querySelector('summary'); ev('faq_open', { question: (q.textContent || '').trim().slice(0, 80) }) } }, true);   // se cuenta que preguntó; el texto no sale del navegador
    // modo claro / oscuro: solo cuando cambia después de abrir la página
    let m = mode(), t0 = performance.now();
    new MutationObserver(() => { const n = mode(); if (n !== m) { m = n; if (performance.now() - t0 > 1500) ev('mode_switch', { to: n }) } }).observe(root, { attributes: true, attributeFilter: ['data-ui'] });
  }

  function iniciar() {
    pie();
    // v5.29 (pedido de Diego): se pregunta a todos, no solo en Europa; nada se carga antes de aceptar
    if (elegido !== 'si') { if (elegido !== 'no') aviso(); return }
    medir();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', iniciar); else iniciar();
})();
