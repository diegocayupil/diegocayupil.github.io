/* app.js · versión móvil (maqueta) del sitio de Diego Cayupil.
 * Cada vista cabe en la pantalla: no hay scroll de página, se navega tocando.
 * Rutas con # (#/casos, #/metodo/definir…), así el botón «atrás» del teléfono funciona y cada vista tiene su enlace.
 * Los textos están en contenido.js. La medición es la del sitio (../assets/medir.js), solo si la visita acepta.
 */
(() => {
  'use strict';
  const C = window.CONTENIDO;
  const doc = document, root = doc.documentElement, app = doc.getElementById('app');
  if (!C || !app) return;
  const $ = (s, el) => (el || doc).querySelector(s);
  const $$ = (s, el) => [...(el || doc).querySelectorAll(s)];
  const qs = new URLSearchParams(location.search);
  const CAP = qs.has('captura');
  const REDUCE = CAP || matchMedia('(prefers-reduced-motion: reduce)').matches;
  const store = {
    get(k, ses) { try { return (ses ? sessionStorage : localStorage).getItem(k) } catch (e) { return null } },
    set(k, v, ses) { try { (ses ? sessionStorage : localStorage).setItem(k, v) } catch (e) {} }
  };
  const MAIL = 'diego.cayupil2@gmail.com';
  const LINKEDIN = 'https://www.linkedin.com/in/diego-cayupil-covarrubia-0a651b14a/';
  const CV = { es: '../assets/cv/Diego-Cayupil-CV-ES.pdf', en: '../assets/cv/Diego-Cayupil-CV-EN.pdf' };
  const IMG = {
    p1: { src: '../assets/casos/c008/p1.webp', th: '../assets/casos/c008/p1-800.webp', w: 1600, h: 900 },
    p3: { src: '../assets/casos/c008/p3.webp', th: 'img/p3-800.webp', w: 1600, h: 900 },
    modelo: { src: '../assets/casos/c008/modelo.webp', th: 'img/modelo-800.webp', w: 1600, h: 742 }
  };

  // idioma: ?lang=, lo que la visita eligió antes en el sitio, o el del teléfono
  let L = qs.get('lang');
  if (L !== 'es' && L !== 'en') L = store.get('dc5.lang');
  if (L !== 'es' && L !== 'en') L = (navigator.languages || [navigator.language || '']).some(x => /^es\b/i.test(x)) ? 'es' : 'en';
  let t = C[L];
  const nb = s => String(s == null ? '' : s).replace(/ (%|pts\b|pp\b)/g, ' $1');
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
  const pct = n => n + (L === 'es' ? ' %' : '%');

  // ── íconos (24 × 24, de trazo) ──────────────────────────────────────────────
  const I = {
    home: '<path d="M4 10.2 12 4l8 6.2V19a1 1 0 0 1-1 1h-4.5v-5.5h-5V20H5a1 1 0 0 1-1-1z"/>',
    cases: '<rect x="3.5" y="7" width="17" height="12.5" rx="2.5"/><path d="M9 7V5.6c0-.9.7-1.6 1.6-1.6h2.8c.9 0 1.6.7 1.6 1.6V7M3.5 12.5h17"/>',
    method: '<path d="M9 6.5h10.5M9 12h10.5M9 17.5h10.5"/><circle cx="5" cy="6.5" r="1.2"/><circle cx="5" cy="12" r="1.2"/><circle cx="5" cy="17.5" r="1.2"/>',
    user: '<circle cx="12" cy="8.2" r="3.7"/><path d="M4.8 20c1.1-3.6 3.8-5.4 7.2-5.4s6.1 1.8 7.2 5.4"/>',
    mail: '<rect x="3.5" y="5.5" width="17" height="13" rx="2.5"/><path d="m4.5 7 7.5 5.6L19.5 7"/>',
    chat: '<path d="M4.5 5.5h15v10h-8.2L7 19v-3.5H4.5z"/>',
    back: '<path d="M14.5 5.5 8 12l6.5 6.5"/>',
    next: '<path d="M9.5 5.5 16 12l-6.5 6.5"/>',
    close: '<path d="M6.5 6.5l11 11M17.5 6.5l-11 11"/>',
    arrow: '<path d="M5 12h13.5M13 6.5l5.5 5.5-5.5 5.5"/>',
    down: '<path d="M12 4.5v11M7 11l5 5 5-5M5.5 19.5h13"/>',
    south: '<path d="M12 5v14M6.5 13.5 12 19l5.5-5.5"/>',
    play: '<path d="M8.5 6v12l9.5-6z" fill="currentColor" stroke="none"/>',
    target: '<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="4.2"/><circle cx="12" cy="12" r=".9" fill="currentColor"/>',
    steps: '<path d="M4 19.5h4.5V15H13v-4.5h4.5V6H20"/>',
    copy: '<rect x="8.5" y="8.5" width="11" height="11" rx="2"/><path d="M15.5 8.5V6a1.5 1.5 0 0 0-1.5-1.5H6A1.5 1.5 0 0 0 4.5 6v8A1.5 1.5 0 0 0 6 15.5h2.5"/>',
    ext: '<path d="M13.5 4.5h6v6M19.5 4.5l-8 8M18 14v4.5a1 1 0 0 1-1 1H5.5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1H10"/>',
    linkedin: '<rect x="3.5" y="3.5" width="17" height="17" rx="3.5"/><path d="M8 10.5V16M8 7.8v.1M11.5 16v-5.5M11.5 13.2c0-1.7.9-2.7 2.3-2.7s2.2.9 2.2 2.7V16"/>',
    q: '<circle cx="12" cy="12" r="8.5"/><path d="M9.7 9.6a2.4 2.4 0 1 1 3.4 2.2c-.7.4-1.1.9-1.1 1.7v.4M12 16.6v.1"/>',
    pen: '<path d="M5 19l1-4L16 5l3 3L9 18z"/><path d="m14 7 3 3"/>',
    check: '<path d="m5.5 12.5 4 4 9-9"/>',
    x: '<path d="M7 7l10 10M17 7 7 17"/>',
    pin: '<path d="M12 20.5s-6-5.2-6-10.2a6 6 0 0 1 12 0c0 5-6 10.2-6 10.2z"/><circle cx="12" cy="10.2" r="2.1"/>',
    globe: '<circle cx="12" cy="12" r="8.5"/><path d="M3.5 12h17M12 3.5c2.4 2.4 3.4 5.3 3.4 8.5s-1 6.1-3.4 8.5c-2.4-2.4-3.4-5.3-3.4-8.5s1-6.1 3.4-8.5z"/>',
    talk: '<path d="M4 5.5h10v7H8.5L6 14.5v-2H4zM14 9.5h6v6.5h-2v2l-2.5-2H10v-2.5"/>',
    expand: '<path d="M4.5 9.5v-5h5M19.5 9.5v-5h-5M4.5 14.5v5h5M19.5 14.5v5h-5"/>',
    rotate: '<path d="M4.5 12a7.5 7.5 0 1 0 2.2-5.3M4.5 4.5v4h4"/>',
    clock: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
    loop: '<path d="M4.5 12a7.5 7.5 0 0 1 13-5.1M19.5 12a7.5 7.5 0 0 1-13 5.1M17.5 3.5v3.6h-3.6M6.5 20.5v-3.6h3.6"/>',
    ai: '<path d="M12 4l1.7 4.6L18.5 10l-4.8 1.6L12 16l-1.7-4.4L5.5 10l4.8-1.4z"/><path d="M18.5 15.5l.7 1.8 1.8.7-1.8.7-.7 1.8-.7-1.8-1.8-.7 1.8-.7z"/>'
  };
  const ic = (n, c) => `<svg class="ic${c ? ' ' + c : ''}" viewBox="0 0 24 24" aria-hidden="true" focusable="false">${I[n]}</svg>`;

  // flor de sakura: el mismo pétalo del sitio
  const PET = 'M0 0C-3.4-2.4-4.6-7-1.7-10.4L0-8.8 1.7-10.4C4.6-7 3.4-2.4 0 0Z';
  const flower = (x, y, s, r, c) => `<g transform="translate(${x} ${y}) scale(${s}) rotate(${r})" fill="${c}">${[0, 72, 144, 216, 288].map(a => `<path transform="rotate(${a})" d="${PET}"/>`).join('')}<circle r="1.4" fill="#B8476F"/></g>`;
  const SAKURA = `<svg class="sakura" viewBox="0 0 160 120" aria-hidden="true">${flower(120, 36, 2.3, 12, '#F3B9CB')}${flower(80, 74, 1.35, 40, '#F7CDD9')}${flower(142, 88, 1.1, -20, '#E97FA3')}${flower(52, 26, .8, 5, '#F3B9CB')}</svg>`;

  // un trazo simple: el fill rate que cae al final (esquema, no datos)
  function spark(cls) {
    const v = [95.2, 94.9, 95.4, 95.1, 95.3, 94.8, 95, 94.6, 93.9, 92.2, 88], W = 96, H = 34, lo = 87, hi = 96.2;
    const X = i => 3 + i * (W - 8) / (v.length - 1), Y = y => 3 + (hi - y) / (hi - lo) * (H - 6);
    const d = v.map((y, i) => (i ? 'L' : 'M') + X(i).toFixed(1) + ' ' + Y(y).toFixed(1)).join('');
    return `<svg class="spark ${cls || ''}" viewBox="0 0 ${W} ${H}" aria-hidden="true"><path class="tg" d="M0 ${Y(95).toFixed(1)}H${W}"/><path class="ln" d="${d}"/><circle cx="${X(v.length - 1).toFixed(1)}" cy="${Y(88).toFixed(1)}" r="3.2"/></svg>`;
  }

  // ── pantallas y rutas ───────────────────────────────────────────────────────
  const SCR = ['home', 'pains', 'cases', 'method', 'phase', 'about', 'contact', 'compose', 'ask'];
  const META = {
    home: { tab: 0, depth: 0, en: 'Home' },
    pains: { tab: 0, depth: 1, en: 'Where it hurts', up: '#/' },
    cases: { tab: 1, depth: 0, en: 'Cases' },
    method: { tab: 2, depth: 0, en: 'Method' },
    phase: { tab: 2, depth: 1, en: 'Phase', up: '#/metodo' },
    about: { tab: 3, depth: 0, en: 'About' },
    contact: { tab: 4, depth: 0, en: 'Contact' },
    compose: { tab: 4, depth: 1, en: 'Write to me', up: '#/contacto' },
    ask: { tab: -1, depth: 1, en: 'Ask me', up: '#/' }
  };
  const TABS = [['#/', 'home'], ['#/casos', 'cases'], ['#/metodo', 'method'], ['#/sobre-mi', 'user'], ['#/contacto', 'mail']];
  const PH = ['definir', 'revisar', 'modelar', 'analizar', 'comunicar'];
  const ABOUT = ['hago', 'trayectoria', 'herramientas'];
  const NST = 9;   // historias del caso: portada, 7 pasos y cierre

  app.innerHTML = '<header class="bar" id="bar"></header><main class="stage" id="stage"></main><nav class="tabs" id="tabs"></nav>'
    + '<section class="story slide" id="story" data-l-en="Case 01 story" role="dialog" aria-modal="true" aria-labelledby="st-l" tabindex="-1" hidden></section>'
    + '<div class="lb" id="lb" role="dialog" aria-modal="true" tabindex="-1" hidden></div><div class="toast" id="toast" role="status" aria-live="polite"></div>';
  const stage = $('#stage'), bar = $('#bar'), tabsEl = $('#tabs'), storyEl = $('#story'), lb = $('#lb'), toastEl = $('#toast');
  const els = {};
  SCR.forEach(n => {
    const s = doc.createElement('section');
    s.className = 'scr slide s-' + n; s.dataset.lEn = META[n].en; s.dataset.fit = ''; s.inert = true;
    stage.appendChild(s); els[n] = s;
  });

  const int = (v, lo, hi, d) => { const n = parseInt(v, 10); return Number.isFinite(n) ? Math.min(hi, Math.max(lo, n)) : d };
  function parse(h) {
    const s = (h || '').replace(/^#\/?/, '').split('/').filter(Boolean);
    const r = { name: 'home', p: {}, story: null };
    switch (s[0]) {
      case 'dolores': r.name = 'pains'; r.p.i = int(s[1], 1, 4, 1) - 1; break;
      case 'casos': r.name = 'cases'; if (s[1] === 'fill-rate') r.story = { i: int(s[2], 0, NST - 1, 0), img: IMG[s[3]] ? s[3] : null }; break;
      case 'metodo':
        if (PH.includes(s[1])) { r.name = 'phase'; r.p.id = s[1]; r.p.i = int(s[2], 1, 4, 1) - 1 }
        else { r.name = 'method'; r.p.ia = s[1] === 'ia' }
        break;
      case 'sobre-mi': r.name = 'about'; r.p.tab = Math.max(0, ABOUT.indexOf(s[1])); break;
      case 'contacto': if (s[1] === 'escribir') { r.name = 'compose'; r.p.step = int(s[2], 1, 4, 1) } else r.name = 'contact'; break;
      case 'preguntame': r.name = 'ask'; r.p.q = s[1] ? int(s[1], 1, C.es.ask.qa.length, 1) - 1 : -1; break;
    }
    return r;
  }
  const keyOf = r => ({ pains: r.p.i, method: r.p.ia ? 1 : 0, phase: r.p.id, about: r.p.tab, compose: r.p.step, ask: r.p.q })[r.name];

  // borrador del correo: se guarda mientras dura la visita
  const draft = (() => { try { const d = JSON.parse(store.get('dcm.draft', 1) || '[]'); return [0, 1, 2].map(i => typeof d[i] === 'string' ? d[i] : '') } catch (e) { return ['', '', ''] } })();
  const saveDraft = () => store.set('dcm.draft', JSON.stringify(draft), 1);
  const vals = () => draft.map(v => v.trim() || '…');
  const mailto = () => `mailto:${MAIL}?subject=${encodeURIComponent(t.compose.subject)}&body=${encodeURIComponent(t.compose.body(vals()))}`;
  function mailHtml() {
    const c = t.compose;
    return esc(c.body(['\u0001', '\u0002', '\u0003'])).replace(/[\u0001-\u0003]/g, ch => {
      const i = ch.charCodeAt(0) - 1, v = draft[i].trim();
      return v ? `<b>${esc(v)}</b>` : `<span class="ph">${esc(c.steps[i][2])}</span>`;
    });
  }

  // ── cómo se ve cada pantalla ────────────────────────────────────────────────
  const metaRow = () => { const h = t.home; return `<ul class="meta" data-opt="4"><li>${ic('pin')}${h.meta[0]}</li><li>${ic('globe')}${h.meta[1]}</li><li>${ic('talk')}${h.meta[2]}</li></ul>` };
  const tablist = (labels, sel, href, extra) => `<div class="seg" role="tablist">${labels.map((x, j) => `<button type="button" role="tab" aria-selected="${j === sel}" tabindex="${j === sel ? 0 : -1}" data-rep="${href(j)}">${extra ? extra(j) : ''}${x}</button>`).join('')}</div>`;

  const R = {
    home() {
      const h = t.home;
      const tile = (to, icon, x) => `<a class="tile" href="${to}"><span class="ti">${ic(icon)}</span><b>${x.t}</b><i data-opt="3">${x.s}</i></a>`;
      return `<div class="pad home">
        <p class="eb" data-opt="2">${h.eb.map((x, i) => `<span><b>${i + 1}</b>${x}</span>`).join('<i>+</i>')}</p>
        <h1 class="h1" tabindex="-1">${h.h1a}<mark>${h.h1m}</mark><span class="serif">${h.h1b}</span></h1>
        <p class="lead" data-opt="5">${h.lead}</p>
        <div class="who"><p class="status"><span class="dot"></span>${h.status}</p>${metaRow()}</div>
        <div class="launch">${SAKURA}
          <p class="q">${h.q}</p>
          <a class="tile-main" href="#/casos/fill-rate"><span class="play">${ic('play')}</span><span class="tx"><b>${h.main.t}</b><span class="s" data-opt="1">${nb(h.main.s)}</span><span class="n">${h.main.n}</span></span>${spark()}</a>
          <div class="tiles">${tile('#/dolores', 'target', h.tiles[0])}${tile('#/metodo', 'steps', h.tiles[1])}${tile('#/sobre-mi', 'user', h.tiles[2])}</div>
          <div class="cta"><a class="btn line" href="${t.ui.cvFile}" download>${ic('down')}${t.ui.cv}</a><a class="btn dark" href="#/contacto/escribir">${t.ui.write}${ic('arrow')}</a></div>
        </div></div>`;
    },
    pains(p) {
      const P = t.pains, d = P.list[p.i];
      return `<div class="pad pains">
        <h1 class="h2" tabindex="-1">${P.h}<span class="serif" data-opt="2.5">${P.hs}</span></h1>
        <p class="sub" data-opt="3">${P.lead}</p>
        ${tablist(P.list.map(x => x.n), p.i, j => '#/dolores/' + (j + 1))}
        <article class="pcard" role="tabpanel" aria-label="${esc(d.n)}" data-part>
          <p class="quote">${nb(d.q)}</p>
          <ol class="flow">
            <li class="no"><span class="k">${ic('x')}${P.k[0]}</span><b>${nb(d.a)}</b><span class="mini" data-opt="2">${nb(d.av)}</span></li>
            <li class="do"><span class="k">${ic('pen')}${P.k[1]}</span><b>${nb(d.b)}</b><span class="mini" data-opt="2">${nb(d.bv)}</span></li>
            <li class="ok"><span class="k">${ic('check')}${P.k[2]}</span><b>${nb(d.c)}</b><span class="mini" data-opt="2">${nb(d.cv)}</span></li>
          </ol>
        </article>
        <a class="btn dark wide" href="#/contacto/escribir" data-pain="${p.i}">${P.cta}${ic('arrow')}</a>
      </div>`;
    },
    cases() {
      const c = t.cases, f = c.feat;
      return `<div class="pad cases">
        <h1 class="h2" tabindex="-1">${c.h}<span class="serif">${c.hs}</span></h1>
        <a class="feat" href="#/casos/fill-rate">
          <span class="feat-top"><span class="k">${f.k}</span><span class="tag">${f.tag}</span></span>
          <span class="feat-t">${nb(f.t)}</span>
          <span class="feat-vis" data-opt="2">${spark('big')}<span class="fv"><b>${pct(95)}</b>${ic('arrow')}<b class="rd">${pct(88)}</b></span></span>
          <span class="feat-s" data-opt="3">${f.s}</span>
          <span class="feat-go"><span class="play">${ic('play')}</span>${f.go}<em>${f.n}</em></span>
        </a>
        <div class="soonhd"><p class="q">${c.soonH}</p><p class="q n">${c.soonN}</p></div>
        <ul class="soon" aria-label="${c.soonH}">${c.list.map(x => `<li><span class="ind">${x[0]}</span><p>${nb(x[1])}</p><span class="badge">${c.soon}</span></li>`).join('')}</ul>
      </div>`;
    },
    method(p) {
      const M = t.method, seg = tablist(M.seg, p.ia ? 1 : 0, j => '#/metodo' + (j ? '/ia' : ''), j => j ? ic('ai') : '');
      if (!p.ia) return `<div class="pad method">${seg}
        <h1 class="h2" tabindex="-1">${M.h}<span class="serif">${M.hs}</span></h1>
        <p class="sub" data-opt="3">${M.lead}</p>
        <ol class="phases" data-part>${M.phases.map(x => `<li><a href="#/metodo/${x.id}"><span class="n">${x.n}</span><span class="nm"><b>${x.name}</b><i>${x.en}</i></span><span class="ln" data-opt="2">${nb(x.line)}</span>${ic('next')}</a></li>`).join('')}</ol>
      </div>`;
      const A = M.ai;
      return `<div class="pad method ia">${seg}
        <h1 class="h2" tabindex="-1">${A.h}<span class="serif">${A.hs}</span></h1>
        <p class="sub" data-opt="3">${A.lead}</p>
        <ol class="ai">${A.steps.map((s, j) => `<li class="${j === 1 ? 'bot' : 'me'}"><span class="hd"><i>${j + 1}</i><b>${s[0]}</b><em>${s[1]}</em></span><span class="art">${nb(s[2])}</span><span class="cap" data-opt="1">${s[3]}</span></li>`).join('')}</ol>
        <p class="loopl" data-opt="2.5">${ic('loop')}${A.loop}</p>
        <p class="tools" data-opt="0.5"><span>${A.with}</span>${A.tools.map(x => `<i>${x}</i>`).join('')}</p>
        <p class="never" data-opt="2"><b>${ic('x')}${A.never}</b><span>${A.neverL}</span></p>
      </div>`;
    },
    phase(p) {
      const P = t.phase, k = PH.indexOf(p.id), x = P.list[p.id], ph = t.method.phases[k], nx = t.method.phases[k + 1];
      const head = (j, label) => `<p class="k"><span>${label}</span><span>${j + 1}/4</span></p>`;
      const mItem = (m, j) => /^\d$/.test(m[0]) ? `<li><span class="n">${m[0]}</span><b>${nb(m[1])}</b></li>` : `<li><span class="n">${j + 1}</span><b>${nb(m[0])}</b><i>${nb(m[1])}</i></li>`;
      const cards = [
        `<article class="pc" data-fit aria-label="${P.cards[0]}">${head(0, ph.n + ' · ' + ph.en)}
          <h1 class="h2" tabindex="-1">${x.h}<span class="serif">${x.hs}</span></h1>
          <p class="pp" data-opt="2">${nb(x.p)}</p>
          <div class="io"><div class="in"><span>${P.io[0]}</span><p>${nb(x.io[0])}</p></div><span class="arr">${ic('south')}</span><div class="out"><span>${P.io[1]}</span><p>${nb(x.io[1])}</p></div></div>
          <p class="swipe" data-opt="1">${t.ui.swipeHint}${ic('arrow')}</p></article>`,
        `<article class="pc" data-fit aria-label="${P.cards[1]}">${head(1, P.cards[1])}
          <h2 class="h3">${x.mh}<span class="serif">${x.mhs}</span></h2>
          ${x.m ? `<ol class="mlist">${x.m.map(mItem).join('')}</ol>` : ''}
          ${x.mx ? `<p class="pp" data-opt="2">${nb(x.mp)}</p><div class="mx2"><p class="bad">${ic('x')}<span>${nb(x.mx[0])}</span></p><p class="good">${ic('check')}<span>${nb(x.mx[1])}</span></p></div><p class="chips" data-opt="1">${x.chips.map(c => `<i>${c}</i>`).join('')}</p>` : ''}</article>`,
        `<article class="pc" data-fit aria-label="${P.cards[2]}">${head(2, P.cards[2])}
          <h2 class="h3">${P.pairsH}<span class="serif">${P.pairsHs}</span></h2>
          <ul class="pairs">${x.pairs.map(q => `<li><span class="tp" data-opt="1">${q[0]}</span><span class="x">${ic('x')}<span>${nb(q[1])}</span></span><span class="v">${ic('check')}<span>${nb(q[2])}</span></span></li>`).join('')}</ul></article>`,
        `<article class="pc" data-fit aria-label="${P.cards[3]}">${head(3, P.doneK)}
          <h2 class="h3">${x.dh}<span class="serif">${x.dhs}</span></h2>
          <ul class="checks">${x.done.map(d => `<li>${ic('check')}<b>${nb(d[0])}</b><span data-opt="1">${nb(d[1])}</span></li>`).join('')}</ul>
          <div class="pc-acts">${nx ? `<a class="btn dark wide" href="#/metodo/${nx.id}">${P.next}: ${nx.name}${ic('arrow')}</a>` : `<a class="btn dark wide" href="#/casos/fill-rate">${P.last}${ic('arrow')}</a>`}<a class="btn line wide" href="${x.page}" data-opt="2">${P.full}${ic('ext')}</a></div></article>`
      ];
      return `<div class="pad phase"><div class="car" tabindex="0" aria-label="${esc(ph.name)}">${cards.join('')}</div>
        <div class="dots">${cards.map((_, j) => `<button type="button" data-card="${j}" aria-label="${P.cards[j]}" aria-current="${j === p.i}"><i></i></button>`).join('')}</div></div>`;
    },
    about(p) {
      const A = t.about, h = t.home;
      const panels = [
        `<ol class="steps4">${A.steps.map((s, j) => `<li><i>${j + 1}</i>${s}</li>`).join('')}</ol>`,
        `<ol class="tl">${A.career.map(c => `<li><span class="y">${c[0]}</span><b>${c[1]}</b><span>${c[2]}</span></li>`).join('')}</ol>`,
        `<div class="toolsp"><p class="chips">${A.tools.map(x => `<i>${x}</i>`).join('')}</p><p class="chips l1"><span class="k">${A.adding}</span>${A.toolsL.map(x => `<i>${x}</i>`).join('')}</p><p class="chips ai"><span class="k">${A.ai}</span>${A.aiL.map(x => `<i>${x}</i>`).join('')}</p><a class="built" href="${A.builtPage}" data-opt="1">${A.built}${ic('ext')}</a></div>`
      ];
      return `<div class="pad about">
        <div class="me"><span class="avatar" aria-hidden="true">DC</span><h1 class="h2" tabindex="-1">${A.h}<span class="serif">${A.hs}</span></h1></div>
        <p class="sub" data-opt="3">${A.lead}</p>
        ${tablist(A.seg, p.tab, j => '#/sobre-mi/' + ABOUT[j])}
        <div class="panel" role="tabpanel" data-part>${panels[p.tab]}</div>
        <div class="who" data-opt="2"><p class="status"><span class="dot"></span>${h.status}</p>${metaRow()}</div>
        <div class="cta"><a class="btn line" href="${t.ui.cvFile}" download>${ic('down')}${t.ui.cv}</a><a class="btn dark" href="#/contacto/escribir">${t.ui.write}${ic('arrow')}</a></div>
      </div>`;
    },
    contact() {
      const c = t.contact, other = L === 'es' ? 'en' : 'es';
      return `<div class="pad contact">
        <h1 class="h2" tabindex="-1">${c.h}<span class="serif">${c.hs}</span></h1>
        <p class="sub" data-opt="3">${c.lead}</p>
        <a class="btn dark wide big" href="#/contacto/escribir">${ic('pen')}${c.go}${ic('arrow')}</a>
        <ul class="list">
          <li class="row mailline"><span class="ri">${ic('mail')}</span><span class="rt"><b>${MAIL}</b><i>${c.mail}</i></span><button type="button" class="mini-btn copy" data-copy="mail">${t.ui.copy}</button></li>
          <li><a class="row" href="${LINKEDIN}" target="_blank" rel="noopener"><span class="ri">${ic('linkedin')}</span><span class="rt"><b>${c.li}</b><i>${c.liS}</i></span>${ic('ext', 'chev')}</a></li>
          <li class="row"><span class="ri">${ic('down')}</span><span class="rt"><b>${t.ui.cv}</b><i>${c.cvS}</i></span><a class="mini-btn" href="${CV[L]}" download aria-label="${c.cvs[0]}">${L.toUpperCase()}</a><a class="mini-btn" href="${CV[other]}" download aria-label="${c.cvs[1]}">${other.toUpperCase()}</a></li>
          <li><a class="row" href="#/preguntame"><span class="ri">${ic('q')}</span><span class="rt"><b>${c.faq}</b><i>${c.faqS}</i></span>${ic('next', 'chev')}</a></li>
        </ul>
        <div class="foot" data-opt="2"><p class="clock">${ic('clock')}<span>${c.clock[0]} <b data-clock>--:--</b> ${c.clock[1]} · <span data-utc>UTC−3</span></span></p><p class="priv">${c.priv} <button type="button" data-medir>${c.privB}</button></p></div>
      </div>`;
    },
    compose(p) {
      const c = t.compose, s = p.step;
      const prog = `<div class="cprog" aria-hidden="true">${[1, 2, 3, 4].map(j => `<i class="${j <= s ? 'on' : ''}"></i>`).join('')}</div>`;
      if (s <= 3) {
        const q = c.steps[s - 1];
        return `<div class="pad compose">${prog}
          <p class="q">${c.stepOf} ${s} ${t.ui.of} 3 · ${c.k}</p>
          <label class="cq" for="cw"><i>0${s}</i><span>${q[0]}</span></label>
          <p class="sub" data-opt="2">${q[1]}</p>
          <textarea id="cw" rows="4" placeholder="${esc(q[2])}" data-draft="${s - 1}">${esc(draft[s - 1])}</textarea>
          <div class="cnav">${s > 1 ? `<button type="button" class="btn line" data-rep="#/contacto/escribir/${s - 1}" aria-label="${t.ui.prev}">${ic('back')}</button>` : '<span></span>'}<button type="button" class="btn dark" data-rep="#/contacto/escribir/${s + 1}" data-keep>${s < 3 ? t.ui.next : c.review}${ic('arrow')}</button></div>
        </div>`;
      }
      return `<div class="pad compose done">${prog}
        <h1 class="h2" tabindex="-1">${c.h}<span class="serif">${c.hs}</span></h1>
        <div class="mailc" data-part><p class="hdr"><span>${c.to}</span><b>${MAIL}</b><span>${c.subjectL}</span><b>${c.subject}</b></p><pre>${mailHtml()}</pre></div>
        <a class="btn dark wide cw-open" href="${mailto()}">${c.open}${ic('arrow')}</a>
        <div class="row2"><button type="button" class="btn line" data-rep="#/contacto/escribir/1">${ic('pen')}${c.edit}</button><button type="button" class="btn line cw-copy" data-copy="msg">${ic('copy')}${c.copyMsg}</button></div>
        <p class="note" data-opt="1">${c.note}</p>
      </div>`;
    },
    ask(p) {
      const A = t.ask, q = A.qa[p.q];
      const go = q && q.to ? (q.to === 'cv' ? `<a class="lnk" href="${t.ui.cvFile}" download>${q.go}${ic('down')}</a>` : `<a class="lnk" href="${q.to}">${q.go}${ic('arrow')}</a>`) : '';
      const dc = body => `<div class="msg dc"><span class="av" aria-hidden="true">DC</span><div class="bub">${body}</div></div>`;
      const chat = q ? `<div class="msg me">${q.q}</div>${dc(`<p>${nb(q.a)}</p>${askVis(q.v)}${go}`)}` : dc(`<p>${A.hi}</p>`);
      return `<div class="pad ask">
        <h1 class="sr" tabindex="-1">${A.title}</h1>
        <div class="chat" aria-live="polite" data-part>${chat}</div>
        <p class="q">${A.pick}</p>
        <div class="qchips aq-qs">${A.qa.map((x, j) => `<button type="button" class="qchip" aria-pressed="${j === p.q}" data-rep="#/preguntame/${j + 1}">${x.q}</button>`).join('')}</div>
        <p class="note" data-opt="2">${A.note}</p>
      </div>`;
    }
  };

  function askVis(v) {
    const V = t.ask.vis;
    switch (v) {
      case 'phases': return `<span class="av-ph" data-opt="1"><span>${[1, 2, 3, 4, 5].map(n => `<i class="${n === 1 ? 'on' : ''}">${n}</i>`).join('')}</span><small>${V.phases}</small></span>`;
      case 'cycle': return `<span class="av-cy" data-opt="1"><span>${V.cycle.map((x, j) => `<i class="${j === 1 ? 'ai' : ''}">${x}</i>`).join('<b>→</b>')}</span><small>${V.cycleL}</small></span>`;
      case 'status': return `<span class="av-st"><span class="dot"></span>${V.avail}</span><span class="chips sm" data-opt="1">${V.where.map(x => `<i class="l1">${x}</i>`).join('')}</span>`;
      case 'cases': return `<span class="av-nm"><span><b>1</b>${V.cases[0]}</span><span><b>9</b>${V.cases[1]}</span></span>`;
      case 'tools': return `<span class="chips sm" data-opt="1">${t.about.tools.map(x => `<i>${x}</i>`).join('')}${t.about.toolsL.map(x => `<i class="l1">${x}</i>`).join('')}</span>`;
      case 'cv': return `<span class="av-cv">${ic('down')}${V.cv}</span>`;
    }
    return '';
  }

  // barra de arriba y pestañas
  function rBar(r) {
    const m = META[r.name];
    let left;
    if (!m.depth) left = `<a class="brand" href="#/" aria-label="Diego Cayupil · ${t.ui.home}"><span class="logo" aria-hidden="true">DC</span><span class="bt"><b>Diego Cayupil</b><i>${L === 'es' ? 'Analista de datos' : 'Data analyst'}</i></span></a>`;
    else {
      const lab = { pains: t.pains.back, phase: t.phase.back, compose: t.compose.back }[r.name] || t.ui.home;
      const ttl = r.name === 'phase' ? t.method.phases[PH.indexOf(r.p.id)].name : r.name === 'compose' ? t.compose.title : r.name === 'ask' ? t.ask.title : '';
      left = `<button type="button" class="back" data-back="${m.up}">${ic('back')}<span>${lab}</span></button><span class="bar-t">${ttl}</span>`;
    }
    const ask = r.name === 'ask' || m.depth ? '' : `<a class="iconbtn" href="#/preguntame" aria-label="${t.ui.ask}" title="${t.ui.ask}">${ic('chat')}</a>`;
    return left + '<span class="sp"></span>' + ask
      + `<button type="button" class="lang" data-lang aria-label="${t.ui.langLabel}: ${t.ui.toLang}"><span class="${L === 'es' ? 'on' : ''}" lang="es">ES</span><span class="${L === 'en' ? 'on' : ''}" lang="en">EN</span></button>`;
  }
  const rTabs = r => t.ui.tabs.map((n, i) => `<a class="tab" href="${TABS[i][0]}"${META[r.name].tab === i ? ' aria-current="page"' : ''}><span class="pill">${ic(TABS[i][1])}</span><span class="tl">${n}</span></a>`).join('');

  // ── el caso como historias: tocar a la derecha avanza, a la izquierda vuelve ──
  function rStory() {
    const s = t.story, x = s.intro, o = s.outro;
    const shot = (k, label, sm) => `<button type="button" class="st-shot${sm ? ' sm' : ''}" data-img="${k}"${sm ? '' : ' data-opt="3"'}><img src="${IMG[k].th}" alt="" loading="lazy" decoding="async" width="800" height="${Math.round(800 * IMG[k].h / IMG[k].w)}"><span>${ic('expand')}${label}</span></button>`;
    const intro = `<article class="st-card intro" data-fit>
        <div class="st-hero"><p class="st-k"><span>${x.k}</span></p><h2 class="st-ht">${nb(x.t)}</h2>
          <div class="st-sp" data-opt="3">${spark('big')}<span class="fv"><b>${pct(95)}</b>${ic('arrow')}<b class="rd">${pct(88)}</b></span></div></div>
        <h3 class="st-h3">${x.h}</h3>
        <dl class="st-dl">${x.rows.map((r, j) => `<div${j === 0 ? ' data-opt="1"' : ''}><dt>${r[0]}</dt><dd>${nb(r[1])}</dd></div>`).join('')}</dl>
      </article>`;
    const steps = s.steps.map((y, i) => `<article class="st-card step" data-fit>
        <p class="st-k"><span>${i < 4 ? s.part[0] : s.part[1]} · ${s.step} ${i + 1} ${t.ui.of} 7</span><b>${y.ph}</b></p>
        <h2 class="st-t">${nb(y.t)}</h2>
        <ol class="blks">
          <li class="blk no"><i>1</i><span class="k">${ic('x')}${s.k[0]}</span><p>${nb(y.p)}</p></li>
          <li class="blk do"><i>2</i><span class="k">${s.k[1]}</span><p>${nb(y.d)}</p></li>
          <li class="blk ok"><i>3</i><span class="k">${ic('check')}${s.k[2]}</span><p>${nb(y.r)}</p></li>
        </ol>
        ${y.v ? `<div class="st-vis" data-opt="3">${nb(y.v)}</div>` : ''}${y.img ? shot(y.img, y.see) + `<button type="button" class="st-see" data-img="${y.img}">${ic('expand')}${y.see}</button>` : ''}
      </article>`).join('');
    const outro = `<article class="st-card outro" data-fit>
        <p class="st-k"><span>${o.k}</span></p>
        <p class="st-big"><b>${o.big}</b><span>${o.bigS}</span></p>
        <h2 class="st-t">${nb(o.t)}</h2>
        <p class="st-s" data-opt="2">${o.s}</p>
        <div class="st-shots" data-opt="3">${o.shots.map(([k, l]) => shot(k, l, 1)).join('')}</div>
        <div class="st-acts"><a class="btn dark wide" href="#/contacto/escribir">${o.a1}${ic('arrow')}</a><div class="row2"><a class="btn line" href="#/metodo">${o.a2}</a><button type="button" class="btn line" data-act="close">${o.a3}</button></div></div>
      </article>`;
    return `<div class="st-head"><div class="sg" aria-hidden="true">${'<i></i>'.repeat(NST)}</div>
        <div class="st-top"><span class="st-l" id="st-l">${s.label}</span><span class="st-c"></span><button type="button" class="iconbtn st-x" aria-label="${t.ui.close}">${ic('close')}</button></div></div>
      <div class="st-body">${intro}${steps}${outro}</div>
      <div class="st-nav"><button type="button" class="btn line st-prev" aria-label="${t.ui.prev}">${ic('back')}</button><p class="st-hint">${t.ui.tapHint}</p><button type="button" class="btn dark st-next"><span>${t.ui.next}</span>${ic('next')}</button></div>`;
  }

  const S = { open: false, i: 0, l: null };
  function storyRoute(st) {
    if (!st) { if (S.open) closeStory(); return; }
    if (S.l !== L) { storyEl.innerHTML = rStory(); S.l = L; S.i = -1; }
    const was = S.open;
    if (!S.open) openStory();
    setStep(st.i, was ? S.i : null);
    showLb(st.img);
  }
  function openStory() {
    S.open = true; storyEl.hidden = false;
    void storyEl.offsetWidth;
    storyEl.classList.add('open');
    stage.inert = bar.inert = tabsEl.inert = true;
    fitStory();
    setTimeout(() => { if (S.open && lb.hidden) storyEl.focus({ preventScroll: true }) }, REDUCE ? 0 : 80);
  }
  function closeStory() {
    S.open = false; showLb(null);
    storyEl.classList.remove('open');
    stage.inert = bar.inert = tabsEl.inert = false;
    setTimeout(() => { if (!S.open) storyEl.hidden = true }, REDUCE ? 0 : 380);
    focusHead(els[cur.name]);
  }
  function setStep(i, from) {
    const changed = S.i !== i; S.i = i;
    const cards = $$('.st-card', storyEl);
    cards.forEach((c, j) => { const on = j === i; c.classList.toggle('on', on); c.inert = !on; c.setAttribute('aria-hidden', on ? 'false' : 'true'); if (!on) c.classList.remove('fwd', 'bwd') });
    if (from != null && from >= 0 && from !== i && !REDUCE) { const c = cards[i]; c.classList.remove('fwd', 'bwd'); void c.offsetWidth; c.classList.add(i > from ? 'fwd' : 'bwd') }
    $$('.sg i', storyEl).forEach((b, j) => { b.className = j < i ? 'done' : j === i ? 'cur' : '' });
    $('.st-c', storyEl).textContent = (i + 1) + ' / ' + NST;
    storyEl.classList.toggle('first', i === 0); storyEl.classList.toggle('last', i === NST - 1);
    $('.st-next span', storyEl).textContent = i === 0 ? t.story.intro.go : t.ui.next;
    if (changed) { track('project_step', { project: 'c008', step: i, steps_total: NST - 1 }); emit(i + 1) }
  }
  const stepTo = i => { i = Math.max(0, Math.min(NST - 1, i)); if (i !== S.i) go('#/casos/fill-rate/' + i, true) };
  const fitStory = () => $$('.st-card', storyEl).forEach(fitBox);

  (function bindStoryTouch() {
    let x0 = null, y0 = 0, moved = false;
    storyEl.addEventListener('pointerdown', e => {
      x0 = null;
      if (!e.target.closest('.st-body') || e.target.closest('a,button') || (e.pointerType === 'mouse' && e.button !== 0)) return;
      x0 = e.clientX; y0 = e.clientY; moved = false;
    });
    storyEl.addEventListener('pointermove', e => { if (x0 != null && (Math.abs(e.clientX - x0) > 12 || Math.abs(e.clientY - y0) > 12)) moved = true });
    storyEl.addEventListener('pointerup', e => {
      if (x0 == null) return;
      const dx = e.clientX - x0, dy = e.clientY - y0; x0 = null;
      if (Math.abs(dx) > 44 && Math.abs(dx) > Math.abs(dy) * 1.3) { stepTo(S.i + (dx < 0 ? 1 : -1)); return }
      if (moved) return;
      const b = $('.st-body', storyEl).getBoundingClientRect();
      stepTo(S.i + (e.clientX - b.left < b.width * 0.3 ? -1 : 1));
    });
    storyEl.addEventListener('pointercancel', () => { x0 = null });
  })();

  // visor de imágenes del caso
  function showLb(k) {
    if (!k) { if (!lb.hidden) { lb.hidden = true; lb.innerHTML = ''; lb.classList.remove('rot'); storyEl.inert = false } return }
    const im = IMG[k], alt = t.story.img[k];
    lb.innerHTML = `<div class="lb-top"><button type="button" class="iconbtn" data-act="rot" aria-label="${L === 'es' ? 'Girar la imagen' : 'Rotate the image'}">${ic('rotate')}</button><button type="button" class="iconbtn" data-act="lbx" aria-label="${t.ui.close}">${ic('close')}</button></div>
      <figure class="lb-f" style="--ar:${(im.w / im.h).toFixed(3)}"><img src="${im.src}" alt="${esc(alt)}" width="${im.w}" height="${im.h}" decoding="async"></figure>
      <p class="lb-cap">${nb(alt)}</p><p class="lb-hint">${t.ui.rotate}</p>`;
    lb.hidden = false; storyEl.inert = true;
    lb.setAttribute('aria-label', alt);
    lb.focus({ preventScroll: true });
  }
  lb.addEventListener('click', e => { if (e.target === lb || e.target.classList.contains('lb-f')) back('#/casos/fill-rate/' + S.i) });

  // ── navegación ─────────────────────────────────────────────────────────────
  let cur = null, ending = null;
  const hist = [];
  function go(h, replace) {
    if (replace) { history.replaceState(history.state, '', h); if (hist.length) hist[hist.length - 1] = h; route(); return }
    if (location.hash === h) { route(); return }
    location.hash = h;
  }
  function back(fallback) {
    if (hist.length > 1) history.back();
    else go(fallback || '#/', true);
  }
  function dir(a, b) {
    if (!a) return 'none';
    const da = META[a.name].depth, db = META[b.name].depth;
    return db > da ? 'push' : db < da ? 'pop' : 'fade';
  }
  function swap(from, to, d) {
    if (ending) ending();
    SCR.forEach(n => { const e = els[n]; if (e !== to) { e.classList.remove('on'); if (e !== from) e.classList.remove('leaving'); e.inert = true } });
    to.classList.add('on'); to.inert = false;
    if (!from || from === to || REDUCE || d === 'none') { if (from && from !== to) from.classList.remove('leaving'); return }
    const cls = { push: ['in-push', 'out-push'], pop: ['in-pop', 'out-pop'], fade: ['in-fade', 'out-fade'] }[d];
    from.classList.add('leaving', cls[1]); to.classList.add(cls[0]);
    const end = () => { clearTimeout(tm); from.classList.remove('leaving', cls[1]); to.classList.remove(cls[0]); ending = null };
    const tm = setTimeout(end, d === 'fade' ? 260 : 380);
    ending = end;
  }
  function focusHead(el) {
    const h = el && $('h1[tabindex="-1"]', el);
    if (h) try { h.focus({ preventScroll: true }) } catch (e) {}
  }

  function route() {
    const h = location.hash && location.hash.length > 1 ? location.hash : '#/';
    if (hist.length > 1 && hist[hist.length - 2] === h) hist.pop(); else if (hist[hist.length - 1] !== h) hist.push(h);
    const r = parse(h), prev = cur, el = els[r.name];
    const same = !!prev && prev.name === r.name, k = L + '|' + keyOf(r);
    const focused = same && el.contains(doc.activeElement) ? doc.activeElement : null;
    cur = r;
    let fresh = false;
    if (el.dataset.k !== k) {
      el.innerHTML = R[r.name](r.p); el.dataset.k = k; fresh = true;
      setup(el, r, focused);
      if (same && !REDUCE) { el.classList.remove('renew'); void el.offsetWidth; el.classList.add('renew') }
    } else if (r.name === 'phase') carTo(r.p.i, true);
    bar.innerHTML = rBar(r);
    tabsEl.innerHTML = rTabs(r);
    app.classList.toggle('no-tabs', r.name === 'compose');
    if (!same) swap(prev ? els[prev.name] : null, el, dir(prev, r));
    if (fresh || !same) fitAll(el);
    const story = r.story;
    storyRoute(story);
    if (!same && !story && prev) focusHead(el);
    if (!story && (!same || fresh)) emit(1);
  }

  // lo que cada pantalla necesita después de dibujarse
  function setup(el, r, focused) {
    if (r.name === 'pains') {
      $$('.sq14', el).forEach(s => { s.innerHTML = '<i></i>'.repeat(14) });
      swipe($('.pcard', el), d => go('#/dolores/' + ((r.p.i + d + 4) % 4 + 1), true));
    }
    if (r.name === 'phase') bindCar(el, r.p);
    if (r.name === 'contact') tick();
    if (r.name === 'compose') {
      const ta = $('textarea', el);
      if (ta) ta.addEventListener('input', () => { draft[+ta.dataset.draft] = ta.value; saveDraft() });
    }
    if (focused) {
      const sel = focused.matches('[role=tab]') ? '[role=tab][aria-selected=true]' : focused.matches('.qchip') ? '.qchip[aria-pressed=true]' : focused.matches('[data-keep]') ? 'textarea, h1' : focused.matches('.cnav .line') ? 'textarea' : null;
      const f = sel && $(sel, el);
      if (f) f.focus({ preventScroll: true });
    }
  }
  function swipe(node, cb) {
    if (!node) return;
    let x0 = null, y0 = 0;
    node.addEventListener('pointerdown', e => { x0 = e.clientX; y0 = e.clientY });
    node.addEventListener('pointerup', e => { if (x0 == null) return; const dx = e.clientX - x0, dy = e.clientY - y0; x0 = null; if (Math.abs(dx) > 50 && Math.abs(dx) > 1.5 * Math.abs(dy)) cb(dx < 0 ? 1 : -1) });
    node.addEventListener('pointercancel', () => { x0 = null });
  }

  // tarjetas de una fase: el deslizamiento es nativo; la ruta y los puntos lo siguen
  const cardW = car => (car.firstElementChild ? car.firstElementChild.offsetWidth : car.clientWidth) + 12;
  function bindCar(el, p) {
    const car = $('.car', el); if (!car) return;
    let raf = 0;
    car.addEventListener('scroll', () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const i = Math.max(0, Math.min(3, Math.round(car.scrollLeft / cardW(car))));
        if (cur && cur.name === 'phase' && cur.p.i !== i) {
          cur.p.i = i; const h = '#/metodo/' + p.id + '/' + (i + 1);
          history.replaceState(history.state, '', h); hist[hist.length - 1] = h;
          dotsTo(i); track('phase_card', { phase: p.id, card: i + 1 });
        }
      });
    }, { passive: true });
    requestAnimationFrame(() => { car.scrollLeft = (p.i || 0) * cardW(car); dotsTo(p.i || 0) });
  }
  function carTo(i, instant) {
    const car = $('.car', els.phase); if (!car) return;
    car.scrollTo({ left: i * cardW(car), behavior: instant || REDUCE ? 'auto' : 'smooth' });
    dotsTo(i);
  }
  const dotsTo = i => $$('.dots button', els.phase).forEach((b, j) => b.setAttribute('aria-current', String(j === i)));

  // ── que todo quepa: se esconde lo opcional, de mayor a menor data-opt ─────────
  function fitBox(box) {
    if (!box) return;
    const mine = o => o.closest('[data-fit]') === box;
    const own = $$('[data-opt]', box).filter(mine), parts = $$('[data-part]', box).filter(mine), boxes = [box].concat(parts);
    own.forEach(o => o.classList.remove('opt-off'));
    boxes.forEach(b => b.classList.remove('scroll-y'));
    const over = () => boxes.some(b => b.scrollHeight > b.clientHeight + 1);
    if (!over()) return;
    const levels = [...new Set(own.map(o => +o.dataset.opt))].sort((a, b) => b - a);
    for (const lv of levels) {
      own.forEach(o => { if (+o.dataset.opt === lv) o.classList.add('opt-off') });
      if (!over()) return;
    }
    boxes.forEach(b => { if (b.scrollHeight > b.clientHeight + 1) b.classList.add('scroll-y') });   // último recurso: ese bloque se desliza
  }
  function fitAll(el) { $$('[data-fit]', el).forEach(fitBox); fitBox(el) }
  function refit() { if (cur) fitAll(els[cur.name]); if (S.open) fitStory() }
  let rz = 0;
  addEventListener('resize', () => { cancelAnimationFrame(rz); rz = requestAnimationFrame(refit) });
  if (doc.fonts && doc.fonts.ready) doc.fonts.ready.then(refit);

  // ── utilidades ─────────────────────────────────────────────────────────────
  function toast(msg) { toastEl.textContent = msg; toastEl.classList.add('show'); clearTimeout(toast.t); toast.t = setTimeout(() => toastEl.classList.remove('show'), 1700) }
  function copy(text) {
    const ok = () => toast(t.ui.copied);
    const legacy = () => {
      const ta = doc.createElement('textarea'); ta.value = text; ta.setAttribute('readonly', ''); ta.style.cssText = 'position:fixed;top:0;left:0;opacity:0';
      doc.body.appendChild(ta); ta.select();
      try { doc.execCommand('copy'); ok() } catch (e) {}
      ta.remove();
    };
    if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(text).then(ok, legacy); else legacy();
  }
  function tick() {
    const n = $('[data-clock]'); if (!n) return;
    try {
      const d = new Date();
      n.textContent = new Intl.DateTimeFormat(L === 'es' ? 'es-CL' : 'en-US', { timeZone: 'America/Santiago', hour: '2-digit', minute: '2-digit', hour12: L !== 'es' }).format(d);
      const off = new Intl.DateTimeFormat('en-US', { timeZone: 'America/Santiago', timeZoneName: 'shortOffset' }).formatToParts(d).find(x => x.type === 'timeZoneName');
      const u = $('[data-utc]'); if (u && off) u.textContent = off.value.replace('GMT', 'UTC').replace('-', '−');
    } catch (e) {}
  }
  setInterval(tick, 30000);

  // medición: la del sitio (medir.js) escucha «slidechange»; aquí se avisa cada vista
  function emit(step) {
    if (!cur) return;
    const sl = S.open ? SCR.length : SCR.indexOf(cur.name);
    try { doc.dispatchEvent(new CustomEvent('slidechange', { detail: { sl, step: step || 1 } })) } catch (e) {}
  }
  function track(name, params) {
    if (store.get('dc.medir') !== 'si' || typeof window.gtag !== 'function') return;
    try { window.gtag('event', name, Object.assign({ page_name: 'm', lang: L }, params || {})) } catch (e) {}
  }

  function setLang(nl) {
    L = nl; t = C[L];
    store.set('dc5.lang', L); root.lang = L; doc.title = t.title;
    tabsEl.setAttribute('aria-label', t.ui.tabsLabel);
    SCR.forEach(n => { els[n].dataset.k = '' });
    const el = els[cur.name];
    el.innerHTML = R[cur.name](cur.p); el.dataset.k = L + '|' + keyOf(cur);
    setup(el, cur, null);
    bar.innerHTML = rBar(cur); tabsEl.innerHTML = rTabs(cur);
    fitAll(el);
    if (S.open) { storyEl.innerHTML = rStory(); S.l = L; const i = S.i; S.i = -1; setStep(i, null); fitStory(); if (cur.story && cur.story.img) showLb(cur.story.img) }
    else S.l = null;
    renderDesk();
    const lg = $('.lang', bar); if (lg) lg.focus({ preventScroll: true });
    track('lang_switch', { to: L });
  }

  function renderDesk() {
    const d = $('.desk'); if (!d) return;
    const x = t.desk;
    d.setAttribute('aria-label', x.k);
    d.innerHTML = `<p class="k">${x.k}</p><h2 class="dh">${x.h.replace(/,\s*/, ',<span>')}</span></h2><p class="dp">${x.p}</p>
      <p class="qr"><img src="qr.svg" alt="" width="112" height="112"><span>${x.qr}<br><b>diegocayupil.github.io/m/</b></span></p>
      <a class="btn line" href="${x.fullHref}">${x.full}${ic('arrow')}</a>`;
  }

  // ── toques y teclado ───────────────────────────────────────────────────────
  app.addEventListener('click', e => {
    const n = e.target.closest('button, a');
    if (!n || !app.contains(n)) return;
    const d = n.dataset;
    if (d.rep != null) { e.preventDefault(); go(d.rep, true); return }
    if (d.back != null) { e.preventDefault(); back(d.back); return }
    if (d.lang != null) { setLang(L === 'es' ? 'en' : 'es'); return }
    if (d.copy) { copy(d.copy === 'mail' ? MAIL : t.compose.body(vals())); return }
    if (d.medir != null) { const b = doc.querySelector('.medir-cambiar'); if (b) b.click(); return }
    if (d.card != null) { carTo(+d.card); return }
    if (d.pain != null) { if (!draft[0].trim()) { draft[0] = t.pains.list[+d.pain].q.replace(/[«»“”"]/g, ''); saveDraft() } track('pain_cta', { pain: +d.pain + 1 }); return }
    if (d.img) { e.preventDefault(); go('#/casos/fill-rate/' + S.i + '/' + d.img); return }
    if (d.act === 'rot') { lb.classList.toggle('rot'); return }
    if (d.act === 'lbx') { back('#/casos/fill-rate/' + S.i); return }
    if (d.act === 'close' || n.matches('.st-x')) { e.preventDefault(); back('#/casos'); return }
    if (n.matches('.st-prev')) { stepTo(S.i - 1); return }
    if (n.matches('.st-next')) { stepTo(S.i + 1); return }
  });
  app.addEventListener('keydown', e => {
    const tab = e.target.closest && e.target.closest('[role=tab]');
    if (tab && (e.key === 'ArrowRight' || e.key === 'ArrowLeft')) {
      const all = $$('[role=tab]', tab.parentElement), i = all.indexOf(tab);
      all[(i + (e.key === 'ArrowRight' ? 1 : -1) + all.length) % all.length].click();
      e.preventDefault();
    }
  });
  doc.addEventListener('keydown', e => {
    if (!lb.hidden) { if (e.key === 'Escape') back('#/casos/fill-rate/' + S.i); return }
    if (!S.open) return;
    if (e.key === 'ArrowRight') stepTo(S.i + 1);
    else if (e.key === 'ArrowLeft') stepTo(S.i - 1);
    else if (e.key === 'Escape') back('#/casos');
  });

  // ── arranque ───────────────────────────────────────────────────────────────
  root.lang = L; doc.title = t.title;
  tabsEl.setAttribute('aria-label', t.ui.tabsLabel);
  renderDesk();
  addEventListener('hashchange', route);
  route();
  addEventListener('load', () => {
    emit(S.open ? S.i + 1 : 1);
    if (!doc.querySelector('.medir-cambiar')) root.classList.add('sin-medir');
    refit();
  });
})();
