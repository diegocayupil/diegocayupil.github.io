/* Diego Cayupil · sitio v4 — comportamiento compartido */
(function () {
  const root = document.documentElement, P = new URLSearchParams(location.search);
  const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const FINE = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const CAP = P.has('captura');
  const store = { get: k => { try { return localStorage.getItem('dc514.' + k) } catch (e) { return null } }, set: (k, v) => { try { localStorage.setItem('dc514.' + k, v) } catch (e) {} } };
  const $ = (s, c = document) => c.querySelector(s), $$ = (s, c = document) => [...c.querySelectorAll(s)];
  if (CAP) root.classList.add('cap');
  const ses = { get: k => { try { return sessionStorage.getItem('dc519.' + k) } catch (e) { return null } }, set: (k, v) => { try { sessionStorage.setItem('dc519.' + k, v) } catch (e) {} } };
  const L = () => root.lang === 'en' ? 'en' : 'es';
  root.dataset.qr = P.get('qr') || 'a';
  root.dataset.ct = P.get('ct') || 'a';

  /* ── Idioma ── */
  function setLang(l, save) {
    root.lang = l === 'en' ? 'en' : 'es';
    $$('[data-lang]').forEach(b => b.setAttribute('aria-pressed', b.dataset.lang === root.lang));
    const t = root.dataset['title' + (root.lang === 'en' ? 'En' : 'Es')]; if (t) document.title = t;
    $$('[data-ph-es]').forEach(i => i.placeholder = i.dataset[root.lang === 'en' ? 'phEn' : 'phEs']);
    $$('[data-al-es]').forEach(e => e.setAttribute('aria-label', e.dataset[root.lang === 'en' ? 'alEn' : 'alEs']));
    if (save) ses.set('lang', root.lang);
    document.dispatchEvent(new CustomEvent('langchange'));
  }
  $$('[data-lang]').forEach(b => b.addEventListener('click', () => { const fx = root.dataset.fixedLang; if (!fx) setLang(b.dataset.lang, true); else if (b.dataset.lang !== fx && root.dataset.alt) location.href = root.dataset.alt + location.hash }));
  setLang(root.dataset.fixedLang || P.get('lang') || ses.get('lang') || 'en', false);

  /* ── Color: sakura o blanco y negro ── */
  function setTone(t, save) { if (t === 'bn') root.dataset.tone = 'bn'; else delete root.dataset.tone; $$('.tone').forEach(b => b.setAttribute('aria-pressed', t === 'bn')); if (save) store.set('tone', t); }
  $$('.tone').forEach(b => b.addEventListener('click', () => { const f = () => setTone(root.dataset.tone === 'bn' ? 'color' : 'bn', true); if (document.startViewTransition && !RM) document.startViewTransition(f); else f(); }));
  setTone(P.get('tono') || 'color', false);

  if (root.classList.contains('sn-wait')) { const go = () => requestAnimationFrame(() => { root.classList.add('sn-go'); root.classList.remove('sn-wait'); }); (document.fonts ? document.fonts.ready : Promise.resolve()).then(go); setTimeout(go, 900); }

  /* ── Menús ── */
  $$('.dd').forEach((dd, k) => {
    const t = $('.dd-trigger', dd); let tm;
    const open = o => { dd.classList.toggle('open', o); t.setAttribute('aria-expanded', o) };
    if (FINE) { dd.addEventListener('mouseenter', () => { clearTimeout(tm); open(true) }); dd.addEventListener('mouseleave', () => { tm = setTimeout(() => open(false), 140) }); }
    t.addEventListener('click', e => { e.stopPropagation(); open(!dd.classList.contains('open')) });
    addEventListener('click', e => { if (!dd.contains(e.target)) open(false) });
    addEventListener('keydown', e => { if (e.key === 'Escape') open(false) });
    if (P.get('dd') === String(k + 1)) open(true);
  });
  const burger = $('.burger');
  if (burger) { burger.addEventListener('click', () => { const o = !document.body.classList.contains('menu-open'); document.body.classList.toggle('menu-open', o); burger.setAttribute('aria-expanded', o) }); $$('.drawer a').forEach(a => a.addEventListener('click', () => document.body.classList.remove('menu-open'))); if (P.get('menu') === '1') document.body.classList.add('menu-open'); }

  /* ── Qué resuelvo: un dolor a la vez, en tres momentos que no se pasan solos muy rápido ── */
  const stage = $('.stage');
  if (stage && root.dataset.qr !== 'c') {
    const BEAT = RM ? 0 : 6500, LAST = 8000;
    const st = { pain: +(P.get('dolor') || 1), beat: +(P.get('momento') || 1), manual: false, seen: false, hover: false, t0: 0, prog: 0, raf: 0 };
    const pains = $$('.pain'), scenes = $$('.scene'), stories = $$('.story-set');
    function show() {
      pains.forEach(p => { const on = +p.dataset.p === st.pain; p.classList.toggle('on', on); p.setAttribute('aria-pressed', on); $('.pg', p).style.opacity = on && !st.manual ? 1 : 0; });
      scenes.forEach(s => { const on = +s.dataset.p === st.pain; s.classList.toggle('on', on); $$('.beat', s).forEach(b => b.classList.toggle('on', on && +b.dataset.b === st.beat)) });
      stories.forEach(s => { const on = +s.dataset.p === st.pain; s.hidden = !on; if (on) $$('.bt', s).forEach(b => { const n = +b.dataset.b; b.classList.toggle('on', n === st.beat); b.classList.toggle('past', n < st.beat); }) });
    }
    function loop(t) {
      st.raf = requestAnimationFrame(loop);
      if (!st.seen || st.manual || st.hover || document.hidden) { st.t0 = t - st.prog; return }
      if (!st.t0) st.t0 = t;
      st.prog = t - st.t0; const dur = st.beat === 3 ? LAST : BEAT;
      const total = BEAT * 2 + LAST, done = (st.beat - 1) * BEAT + Math.min(st.prog, dur);
      const bar = $('.pain.on .pg i'); if (bar) bar.style.width = (done / total * 100) + '%';
      if (st.prog >= dur) { st.t0 = t; st.prog = 0; if (st.beat < 3) st.beat++; else { st.beat = 1; st.pain = st.pain % 4 + 1; $$('.pain .pg i').forEach(i => i.style.width = 0) } show() }
    }
    pains.forEach(p => p.addEventListener('click', () => { st.pain = +p.dataset.p; st.beat = 1; st.prog = 0; st.t0 = 0; $$('.pain .pg i').forEach(i => i.style.width = 0); show() }));
    $$('.bt').forEach(b => b.addEventListener('click', () => { st.beat = +b.dataset.b; st.manual = true; show(); syncPlay() }));
    if (FINE) $$('.bt').forEach(b => b.addEventListener('mouseenter', () => { if (st.beat !== +b.dataset.b) { st.beat = +b.dataset.b; st.prog = 0; st.t0 = 0; show() } }));
    const playb = $('.playb');
    const syncPlay = () => { if (playb) { $('.pl-s', playb).hidden = st.manual; $('.pl-p', playb).hidden = !st.manual; } };
    if (playb) playb.addEventListener('click', () => { st.manual = !st.manual; st.prog = 0; st.t0 = 0; show(); syncPlay() });
    if (FINE) { const qa = $('.qr-a'); qa.addEventListener('mouseenter', () => st.hover = true); qa.addEventListener('mouseleave', () => st.hover = false); }
    if (CAP || RM) { st.manual = true; syncPlay() } else { document.addEventListener('slidechange', () => { st.seen = stage.closest('.slide').classList.contains('active') }); st.raf = requestAnimationFrame(loop) }
    show();
  }
  /* Versión C: deslizar */
  $$('.ba input').forEach(i => { if (P.has('x')) i.value = P.get('x'); const up = () => i.closest('.ba-v').style.setProperty('--x', i.value + '%'); i.addEventListener('input', up); up() });

  /* ── Detrás del tablero ── */
  $$('.behind').forEach(bh => {
    const set = n => { $$('[data-n]', bh).forEach(x => x.classList.toggle('on', x.dataset.n === n)); $$('.zone', bh).forEach(z => z.classList.toggle('lit', z.dataset.z === n)); const bd0 = $('.board', bh); if (bd0) bd0.classList.add('foc'); const hl = $('.hlz', bh), z = $(`.zone[data-z="${n}"]`, bh); if (hl && z) { const b = $('.board', bh).getBoundingClientRect(), r = z.getBoundingClientRect(); Object.assign(hl.style, { left: (r.left - b.left - 4) + 'px', top: (r.top - b.top - 4) + 'px', width: (r.width + 8) + 'px', height: (r.height + 8) + 'px', opacity: 1 }); } };
    $$('[data-n]', bh).forEach(x => { x.addEventListener('click', () => set(x.dataset.n)); if (FINE) x.addEventListener('mouseenter', () => set(x.dataset.n)); });
    const init = () => set(($('.notes li.on', bh) || {dataset:{}}).dataset.n || P.get('nota') || '1'); init(); addEventListener('resize', init); document.addEventListener('langchange', init); document.addEventListener('slidechange', init);
  });

  /* ── Copiar correo ── */
  const MAIL = (() => { const a = document.querySelector('a[href^="mailto:"]'); if (a) return a.getAttribute('href').slice(7).split('?')[0]; const b = document.querySelector('.mailline b'); return b ? b.textContent.trim() : '' })();
  $$('.copy').forEach(b => b.addEventListener('click', () => { const done = () => { b.classList.add('done'); const o = b.innerHTML; b.innerHTML = L() === 'en' ? 'Copied ✓' : 'Copiado ✓'; setTimeout(() => { b.innerHTML = o; b.classList.remove('done') }, 1600) }; try { navigator.clipboard.writeText(MAIL).then(done, done) } catch (e) { done() } }));

  /* ── Postal: arma el correo con lo que escribió la persona ── */
  $$('.postal').forEach(pc => {
    const send = $('.send', pc); if (!send) return;
    const ins = $$('input', pc);
    const fit = i => i.style.width = Math.max(i.value.length || i.placeholder.length, 6) + 1 + 'ch';
    ins.forEach(i => { i.addEventListener('input', () => fit(i)); fit(i) });
    document.addEventListener('langchange', () => ins.forEach(fit));
    send.addEventListener('click', e => { e.preventDefault(); const v = ins.map(i => i.value.trim() || '…'); const body = L() === 'en' ? `Hi Diego: what hurts is ${v[0]}, it affects ${v[1]}, and if I knew, I would decide ${v[2]}.` : `Hola Diego: me duele ${v[0]}, le pasa a ${v[1]}, y si lo supiera decidiría ${v[2]}.`; location.href = `mailto:${MAIL}?subject=${encodeURIComponent(L() === 'en' ? 'A problem to solve' : 'Un problema por resolver')}&body=${encodeURIComponent(body)}` });
  });

  /* ── Hora local ── */
  function clock() {
    let t = '10:42', off = 'UTC−3';
    try { const d = new Date(); t = new Intl.DateTimeFormat('es', { timeZone: 'America/Santiago', hour: '2-digit', minute: '2-digit', hour12: false }).format(d);
      const z = new Intl.DateTimeFormat('en-US', { timeZone: 'America/Santiago', timeZoneName: 'shortOffset' }).formatToParts(d).find(p => p.type === 'timeZoneName'); if (z) off = z.value.replace('GMT', 'UTC').replace('-', '−'); } catch (e) {}
    if (CAP) t = '10:42';
    $$('.clk').forEach(x => x.textContent = t); $$('.clockl .off').forEach(x => x.textContent = off);
  }
  clock(); setInterval(clock, 30000);

  /* ── Proyectos: filtro ── */
  $$('.filters button').forEach(b => b.addEventListener('click', () => {
    $$('.filters button').forEach(x => x.setAttribute('aria-pressed', x === b)); const f = b.dataset.f;
    $$('.grid3 .case').forEach(c => { const show = f === 'all' || c.dataset.p === f; if (show) { c.classList.remove('hide'); c.animate && !RM && c.animate([{ opacity: 0, transform: 'translateY(8px)' }, { opacity: 1, transform: 'none' }], { duration: 380, easing: 'cubic-bezier(.16,1,.3,1)' }) } else c.classList.add('hide') });
  }));
  { const f0 = P.get('f'); const b0 = f0 && $(`.filters button[data-f="${f0}"]`); if (b0) b0.click(); }

  /* ── Frases alternativas (para comparar) ── */
  const FR = { f1: [['Defino bien el problema.', 'El dashboard se explica solo.'], ['I define the problem right.', 'The dashboard explains itself.']],
    f2: [['Todo parte del problema.', 'Los datos lo resuelven.'], ['It all starts with the problem.', 'Data solves it.']],
    f3: [['Primero, qué te duele.', 'Después, los datos.'], ['First, what hurts.', 'Then, the data.']],
    f4: [['¿Dónde duele?', 'Por ahí empiezo.'], ['Where does it hurt?', 'That’s where I start.']],
    f5: [['Entiendo el problema.', 'Te cuento la solución con datos.'], ['I understand the problem.', 'I tell you the solution with data.']],
    f6: [['Empieza por un problema.', 'Termina en una decisión.'], ['It starts with a problem.', 'It ends with a decision.']],
    f7: [['Un buen dashboard', 'empieza por un buen problema.'], ['A good dashboard', 'starts with a good problem.']],
    f8: [['Encuentro lo que duele.', 'Con datos, lo resuelvo.'], ['I find what hurts.', 'With data, I solve it.']] };
  const fk = P.get('frase'); if (fk && FR[fk] && $('#h1')) { const [es, en] = FR[fk]; $('#h1').innerHTML = `<span class="ln"><span><span class="es">${es[0]}</span><span class="en">${en[0]}</span></span></span><span class="ln"><span><span class="es">${es[1]}</span><span class="en">${en[1]}</span></span></span>`; }

  /* ── Tablero de la portada ── */
  const dash = $('.dash');
  if (dash) {
    const W = ['S35', 'S36', 'S37', 'S38', 'S39', 'S40', 'S41', 'S42', 'S43', 'S44', 'S45', 'S46'];
    const M = {
      ventas: { r: [362, 371, 368, 384, 379, 396, 402, 412], f: [418, 424, 431, 437], b: [8, 12, 16, 20], u: 'M', note: 3, nt: ['canal online', 'online channel'], h: ['Las ventas van 4,2 % sobre la meta', 'Sales are 4.2% above target'], v: 412, d: [['+4,2 % vs meta', '+4.2% vs target'], 'up'], k: ['Ventas', 'Sales'], q: ['¿Cómo van las ventas?', 'How are sales doing?'] },
      margen: { r: [30.6, 30.9, 31.0, 30.8, 31.2, 31.5, 31.4, 31.8], f: [31.9, 32.0, 32.1, 32.1], b: [.3, .4, .5, .6], u: '%', note: 4, nt: ['más línea premium', 'more premium line'], h: ['El margen sube por la mezcla, no por el precio', 'Margin is up because of mix, not price'], v: 31.8, d: [['+0,6 pp', '+0.6 pp'], 'up'], k: ['Margen bruto', 'Gross margin'], q: ['¿Por qué sube el margen?', 'Why is margin up?'] },
      otif: { r: [93.9, 93.2, 93.6, 93.8, 93.1, 93.7, 93.4, 92.4], f: [91.7, 91.0, 90.6, 90.3], b: [.4, .6, .8, 1.0], u: '%', note: 7, nt: ['quiebre de stock · bodega Norte', 'stock-out · North warehouse'], h: ['La bodega Norte explica el 70 % de la caída', 'The North warehouse explains 70% of the drop'], v: 92.4, d: [['−1,1 pp', '−1.1 pp'], 'down'], k: ['OTIF', 'OTIF'], q: ['¿Por qué cayó el OTIF?', 'Why did OTIF fall?'] },
      stock: { r: [44, 43, 42, 41, 41, 40, 39, 38], f: [38, 37, 37, 36], b: [1, 1.5, 2, 2.5], u: 'd', note: 7, nt: ['meta: 35–40 días', 'target: 35–40 days'], h: ['Quedan 38 días de stock, 3 menos que hace un mes', '38 days of stock left, 3 fewer than a month ago'], v: 38, d: [['−3 días', '−3 days'], 'up'], k: ['Stock', 'Stock'], q: ['¿Cuánto stock queda?', 'How much stock is left?'] }
    };
    const fmt = (v, u) => { const l = L(), dec = u === '%' ? 1 : 0; let s = v.toFixed(dec); if (l === 'es') s = s.replace('.', ','); return u === 'M' ? '$' + s + ' M' : u === '%' ? (l === 'es' ? s + ' %' : s + '%') : s; };
    let cur = P.get('kpi') || 'otif', first = true;
    const kpis = $('.kpis', dash), svg = $('.chart svg', dash), tip = $('.tip', dash), head = $('.dash-h', dash);
    function drawKpis(count) {
      kpis.innerHTML = Object.entries(M).map(([id, m]) => `<button class="kpi${id === cur ? ' on' : ''}" data-k="${id}" aria-pressed="${id === cur}"><div class="k">${m.k[L() === 'en' ? 1 : 0]}</div><div class="v" data-v="${m.v}" data-u="${m.u}">${fmt(m.v, m.u)}</div><div class="dl ${m.d[1]}">${m.d[0][L() === 'en' ? 1 : 0]}</div></button>`).join('');
      $$('.kpi', kpis).forEach(b => b.addEventListener('click', () => { if (b.dataset.k === cur) return; cur = b.dataset.k; $$('.kpi', kpis).forEach(x => { x.classList.toggle('on', x === b); x.setAttribute('aria-pressed', x === b) }); drawChart(true) }));
      if (count && !RM && !CAP) $$('.kpi .v', kpis).forEach((el, i) => { const v = +el.dataset.v, u = el.dataset.u, t0 = performance.now() + 500 + i * 90, dur = 1200; const step = t => { const p = Math.min(1, Math.max(0, (t - t0) / dur)), e = 1 - Math.pow(1 - p, 3); el.textContent = fmt(v * (.82 + .18 * e), u); if (p < 1) requestAnimationFrame(step) }; requestAnimationFrame(step) });
    }
    function drawChart(anim) {
      const m = M[cur], all = [...m.r, ...m.f.map((x, i) => x + m.b[i]), ...m.f.map((x, i) => x - m.b[i])];
      let lo = Math.min(...all), hi = Math.max(...all); const pad = (hi - lo) * .18; lo -= pad; hi += pad;
      const X = i => 40 + i * (548 / 11), Y = v => 16 + (1 - (v - lo) / (hi - lo)) * 158;
      const real = m.r.map((v, i) => `${i ? 'L' : 'M'}${X(i).toFixed(1)} ${Y(v).toFixed(1)}`).join(' ');
      const li = m.r.length - 1, fc = `M${X(li)} ${Y(m.r[li])} ` + m.f.map((v, i) => `L${X(li + 1 + i).toFixed(1)} ${Y(v).toFixed(1)}`).join(' ');
      const up = m.f.map((v, i) => `${X(li + 1 + i).toFixed(1)} ${Y(v + m.b[i]).toFixed(1)}`), dn = m.f.map((v, i) => `${X(li + 1 + i).toFixed(1)} ${Y(v - m.b[i]).toFixed(1)}`).reverse();
      const band = `M${X(li)} ${Y(m.r[li])} L${up.join(' L')} L${dn.join(' L')} Z`;
      const gl = [0, .5, 1].map(t => { const v = lo + (hi - lo) * (1 - t) * .9 + (hi - lo) * .05; return `<line x1="40" x2="588" y1="${Y(v).toFixed(1)}" y2="${Y(v).toFixed(1)}"/><text x="0" y="${(Y(v) + 3).toFixed(1)}">${fmt(v, m.u).replace('$', '').replace(' M', '')}</text>` });
      const nx = X(m.note), ny = Y(m.r[m.note]); const nt = m.nt[L() === 'en' ? 1 : 0]; const anchor = m.note > 8 ? 'end' : 'middle';
      svg.innerHTML = `<g class="grid axis">${gl.join('')}</g><g class="axis">${W.map((w, i) => i % 2 ? '' : `<text x="${X(i)}" y="196" text-anchor="middle">${w}</text>`).join('')}<line x1="${X(li + .5)}" x2="${X(li + .5)}" y1="10" y2="176" stroke="var(--line2)" stroke-dasharray="2 3"/><text x="${X(li + .5) + 6}" y="14" font-size="9.5">${L() === 'en' ? 'forecast' : 'pronóstico'}</text></g>
        <path class="band-fc" d="${band}"/><path class="ln-fc" d="${fc}"/><path class="ln-real" d="${real}"/>
        <circle class="pt-ring" cx="${nx}" cy="${ny}" r="9"/><circle class="pt" cx="${nx}" cy="${ny}" r="5"/><text class="note" x="${m.note > 8 ? nx : nx + 12}" y="${ny - 13}" text-anchor="${m.note > 8 ? 'end' : 'start'}">${nt}</text>
        <line class="cross" x1="0" x2="0" y1="10" y2="176" style="opacity:0"/><circle class="hov" r="4.5" fill="var(--ink)" style="opacity:0"/>`;
      head.innerHTML = m.h[L() === 'en' ? 1 : 0]; { const aq = $('.askq q', dash); if (aq) aq.textContent = m.q[L() === 'en' ? 1 : 0]; const an = $('.aska', dash); if (an) an.innerHTML = m.h[L() === 'en' ? 1 : 0] }
      if (anim && !RM && !CAP) { const p = $('.ln-real', svg), len = p.getTotalLength(); p.style.strokeDasharray = len; p.style.strokeDashoffset = len; p.getBoundingClientRect(); p.style.transition = `stroke-dashoffset ${first ? 1.5 : .8}s cubic-bezier(.16,1,.3,1) ${first ? '.7s' : '0s'}`; p.style.strokeDashoffset = 0;
        $$('.band-fc,.ln-fc,.pt,.pt-ring,.note', svg).forEach(x => { x.style.opacity = 0; x.style.transition = `opacity .5s ease ${first ? 1.7 : .5}s`; requestAnimationFrame(() => requestAnimationFrame(() => x.style.opacity = 1)) });
        head.animate && head.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 350 }); }
      first = false;
      const all12 = [...m.r, ...m.f];
      svg.onmousemove = e => { const r = svg.getBoundingClientRect(), x = (e.clientX - r.left) / r.width * 600; const i = Math.max(0, Math.min(11, Math.round((x - 40) / (548 / 11)))); const cx = X(i), cy = Y(all12[i]);
        const cr = $('.cross', svg), hv = $('.hov', svg); cr.setAttribute('x1', cx); cr.setAttribute('x2', cx); cr.style.opacity = 1; hv.setAttribute('cx', cx); hv.setAttribute('cy', cy); hv.style.opacity = 1;
        tip.innerHTML = `${W[i]} · ${fmt(all12[i], m.u)}${i > li ? (L() === 'en' ? ' · forecast' : ' · pronóstico') : ''}`; tip.style.left = (cx / 600 * r.width) + 'px'; tip.style.top = (cy / 204 * r.height) + 'px'; tip.classList.add('on') };
      svg.onmouseleave = () => { $('.cross', svg).style.opacity = 0; $('.hov', svg).style.opacity = 0; tip.classList.remove('on') };
    }
    drawKpis(true); drawChart(true);
    document.addEventListener('slidechange', e => { if (!e.detail.first && dash.closest('.slide').classList.contains('active')) drawChart(true) });
    document.addEventListener('langchange', () => { drawKpis(false); drawChart(false) });
  }

  /* ═══════════ V5: escena, gato, vistas completas e índice ═══════════ */
  const SC = window.SCENE, slides = $$('.slide'), DECK_OK = () => innerWidth >= 1100 && innerHeight >= 560 && !P.has('flujo');
  let deck = DECK_OK(); root.classList.toggle('deck', deck); root.classList.toggle('flow', !deck);
  const positions = []; slides.forEach((sl, i) => { const n = +sl.dataset.steps || 1; for (let k = 1; k <= n; k++) positions.push({ sl: i, step: k }) });
  /* Contacto vive al pie del árbol: esa página parte abajo, donde el gato llega */
  const FROM = slides.length && slides[0].dataset.veil === 'soft' ? SC.STOPS - 2 : 0;
  if (FROM) slides.forEach(sl => sl.dataset.veil = 'soft');
  const N = positions.length, SPAN = SC.STOPS - 1 - FROM, stopF = i => N > 1 ? FROM + i * SPAN / (N - 1) : FROM, stopOf = i => N <= 1 ? FROM : i >= N - 1 ? SC.STOPS - 1 : Math.min(SC.STOPS - 2, Math.round(stopF(i))), camOf = i => N > SPAN + 1 ? stopF(i) : stopOf(i);
  let cur = 0, locked = false;
  const lyS = $('#ly-sky'), lyM = $('#ly-mt'), lyT = $('#ly-tree'), lyC = $('#ly-cat'), lyF = $('#ly-fg'), cat = $('#cat'), mist = $('#mist');
  const scale = () => Math.max(innerWidth / SC.W, innerHeight / SC.VH);
  /* ═══════════ V5.13: el lago de día (E1), al alba (E2) y de noche (E3). Claro, oscuro o transitorio ═══════════ */
  const Mode = (() => {
    const KEY = 'dc514.modo', ALL = ['claro', 'oscuro'];
    let mode = 'trans', t = 0, night = 'pasa', velo = '2';
    const pref = (q, k, ok, d) => { try { const v = P.get(q) || (k === KEY ? ses.get('modo') : null); return ok.includes(v) ? v : d } catch (e) { return d } };
    const sysMode = () => matchMedia('(prefers-color-scheme: dark)').matches ? 'oscuro' : 'claro', urlMode = P.get('modo'); let saved = null; try { saved = localStorage.getItem('dc523.modo') } catch (e) {}
    mode = ALL.includes(urlMode) ? urlMode : ALL.includes(saved) ? saved : sysMode();
    try { matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => { let s2 = null; try { s2 = localStorage.getItem('dc523.modo') } catch (e) {} if (!ALL.includes(s2) && !ALL.includes(urlMode)) { mode = sysMode(); paint() } }) } catch (e) {} night = pref('noche', 'dc514.noche', ['pasa', 'fija'], 'fija');
    const okV = v => v !== null && v !== '' && isFinite(+v) && +v >= 1 && +v <= 4;
    try { const v = P.get('velo'); velo = okV(v) ? String(+v) : '1' } catch (e) { velo = '1' }
    let msg = pref('msg', 'dc514.msg', ['halo', 'sombra', 'placa', 'vidrio'], 'sombra'), entra = pref('entra', 'dc514.entra', ['fundido', 'directo', 'cortina', 'foco'], 'directo');
    /* Velo de la izquierda: opacidad al borde, opacidad al medio, dónde cambia y dónde se acaba (en % del ancho), por nivel */
    const VT = { light: [[.985, .965, 66, 88], [.9, .82, 60, 86], [.78, .64, 55, 82], [.58, .4, 50, 78]], dark: [[.965, .935, 66, 88], [.88, .8, 60, 86], [.76, .62, 55, 82], [.55, .38, 50, 78]] };
    function veil(dk) { const v = Math.max(1, Math.min(4, +velo)), i = Math.min(2, Math.floor(v) - 1), k = v - 1 - i, T = VT[dk ? 'dark' : 'light']; return T[i].map((a, j) => a + (T[i + 1][j] - a) * k) }
    /* Pesos de cada luz. Oscuro que pasa: anochecer (N1) → noche (E3) → noche de luna (N3), siempre de noche */
    function weights() {
      const z = { e1: 0, e2: 0, e3: 0, n1: 0, n3: 0 };
      if (mode === 'claro') z.e1 = 1;
      else if (mode === 'oscuro') { if (night === 'fija') z.e3 = 1; else if (t <= .5) { z.n1 = 1 - 2 * t; z.e3 = 2 * t } else { z.e3 = 2 - 2 * t; z.n3 = 2 * t - 1 } }
      else if (t <= .5) { z.e1 = 1 - 2 * t; z.e2 = 2 * t } else { z.e2 = 2 - 2 * t; z.e3 = 2 * t - 1 }
      return z;
    }
    /* Cada imagen se apila sobre la anterior de su familia: su opacidad es la suma de su peso y el de las que van encima */
    const stack = (sel, fam, z) => $$(sel).forEach(im => { const i = fam.indexOf(im.dataset.k); im.style.opacity = i < 0 ? 0 : Math.min(1, fam.slice(i).reduce((a, q) => a + z[q], 0)).toFixed(3) });
    const dark = () => mode === 'oscuro' || (mode === 'trans' && t >= .72);
    function paint() {
      const z = weights(), dk = mode === 'oscuro';
      stack('#ly-sky .sc', dk ? ['n1', 'e3', 'n3'] : ['e1', 'e2', 'e3'], z);
      stack('#ly-tree .sc', dk ? ['n1', 'e3'] : ['e1', 'e2', 'e3'], { ...z, e3: z.e3 + z.n3 });
      const isD = dark(), V = veil(isD), rs = root.style;
      root.dataset.ui = isD ? 'dark' : 'light'; root.dataset.modo = mode; root.dataset.velo = 'x'; root.dataset.noche = night; root.dataset.msg = msg; root.dataset.entra = entra; root.dataset.bajo = '1';
      rs.setProperty('--vc', getComputedStyle(root).getPropertyValue(isD ? '--vcd' : '--vcl').trim() || (isD ? '11,13,21' : '250,250,252')); rs.setProperty('--va', V[0].toFixed(3)); rs.setProperty('--vb', V[1].toFixed(3)); rs.setProperty('--vp', V[2].toFixed(1) + '%'); rs.setProperty('--ve', V[3].toFixed(1) + '%');
      const sl = $('#pruebas input[type=range]'); if (sl && +sl.value !== +velo) sl.value = velo; const vt = $('#pruebas .vn'); if (vt) vt.textContent = (+velo).toFixed(2).replace('.', ',');
      $$('#pruebas [data-msg]').forEach(x => x.setAttribute('aria-pressed', x.dataset.msg === msg ? 'true' : 'false'));
      $$('#pruebas [data-entra]').forEach(x => x.setAttribute('aria-pressed', x.dataset.entra === entra ? 'true' : 'false'));
      $$('#pruebas [data-velo]').forEach(x => x.setAttribute('aria-pressed', x.dataset.velo === velo ? 'true' : 'false'));
      $$('#pruebas [data-noche]').forEach(x => x.setAttribute('aria-pressed', x.dataset.noche === night ? 'true' : 'false'));
      $$('.modes button').forEach(x => x.setAttribute('aria-pressed', x.dataset.m === mode ? 'true' : 'false'));
    }
    function set(m) { if (!ALL.includes(m) || m === mode) return; mode = m; try { localStorage.setItem('dc523.modo', m) } catch (e) {} paint() }
    function setNight(v) { night = v; try { localStorage.setItem('dc514.noche', v) } catch (e) {} paint() }
    function setVelo(v) { velo = String(+v); try { localStorage.setItem('dc514.velo', velo) } catch (e) {} paint() }
    function setMsg(v) { msg = v; try { localStorage.setItem('dc514.msg', v) } catch (e) {} paint() }
    function setEntra(v) { entra = v; try { localStorage.setItem('dc514.entra', v) } catch (e) {} paint() }
    /* El texto que va sobre el velo (no sobre una tarjeta) se aclara en el modo oscuro; las tarjetas quedan claras */
    const rgb = x => (String(x).match(/[\d.]+/g) || []).map(Number);
    function hsl([r, g, b]) { r /= 255; g /= 255; b /= 255; const M = Math.max(r, g, b), m = Math.min(r, g, b), l = (M + m) / 2, d = M - m; if (!d) return [0, 0, l]; const s2 = d / (1 - Math.abs(2 * l - 1)); let h = M === r ? ((g - b) / d) % 6 : M === g ? (b - r) / d + 2 : (r - g) / d + 4; h *= 60; if (h < 0) h += 360; return [h, s2, l] }
    function onCard(el) { for (let n = el; n && n !== document.body; n = n.parentElement) { if (n.classList && n.classList.contains('slide')) return false; const c = getComputedStyle(n), bg = rgb(c.backgroundColor); if (bg.length >= 3 && (bg.length < 4 || bg[3] >= .5)) return true; if (c.backgroundImage && c.backgroundImage !== 'none' && n.tagName !== 'svg' && c.display !== 'inline') return true } return false }
    function tone(el) { const c = getComputedStyle(el), col = rgb(el instanceof SVGElement ? c.fill : c.color); if (col.length < 3) return 'lz-i'; const [h, s2, l] = hsl(col); if (s2 > .3 && l > .15 && l < .85) { if (h >= 300 && h < 348) return 'lz-a'; if (h >= 348 || h < 18) return 'lz-r'; if (h >= 80 && h < 175) return 'lz-g'; if (h >= 18 && h < 70) return 'lz-y'; if (h >= 190 && h < 260) return 'lz-b' } return l < .34 ? 'lz-i' : 'lz-m' }
    const LZ = ['lz', 'lz-i', 'lz-m', 'lz-a', 'lz-r', 'lz-g', 'lz-y', 'lz-b'];
    /* Se mide con la luz clara puesta (sin transiciones) y se vuelve a medir al cambiar de vista, porque algunas tarjetas aparecen después */
    function mark(scope) {
      const host = scope || $('main'); if (!host) return; const u = root.dataset.ui; root.classList.add('lz-mark'); delete root.dataset.ui;
      const w = document.createTreeWalker(host, NodeFilter.SHOW_TEXT, { acceptNode: n => n.nodeValue.trim() ? 1 : 2 }), els = new Set();
      for (let n = w.nextNode(); n; n = w.nextNode()) if (n.parentElement) els.add(n.parentElement);
      els.forEach(el => el.classList.remove(...LZ));
      const res = []; els.forEach(el => { if (el.closest('.slide') && !onCard(el)) res.push([el, tone(el)]) });
      res.forEach(([el, t]) => el.classList.add('lz', t));
      if (u) root.dataset.ui = u; void root.offsetWidth; root.classList.remove('lz-mark');
    }
    return { at(stop) { t = Math.max(0, Math.min(1, stop / (SC.STOPS - 1))); paint() }, set, setNight, setVelo, setMsg, setEntra, weights, mark, paint, dark, get mode() { return mode } };
  })();
  /* La escena no se desplaza: el lago, la orilla y los gatos quedan siempre a la vista */
  function camera(stop) {
    const tf = `translate3d(0,0,0) scale(${scale().toFixed(4)})`;
    [lyS, lyT, lyC, $('#ly-obj'), $('#ly-koi')].forEach(l => { if (l) l.style.transform = tf });
    Mode.at(stop);
  }
  /* ── Viento: las ramas se mecen de verdad. Lo lejos del tronco se mueve más; al cambiar de vista pasa una ráfaga ── */
  const Wind = (() => {
    const off = { tick() {}, gust() {} };
    if (!deck || RM || CAP || P.get('viento') !== '1') return off;
    const host = $('#ly-tree'), K4 = ['e1', 'e2', 'e3', 'n1'], imgs = host ? K4.map(k => $(`.sc[data-k="${k}"]`, host)).filter(Boolean) : []; if (imgs.length < 4) return off;
    const tw = () => { const z = Mode.weights(); return [z.e1, z.e2, z.e3 + z.n3, z.n1] };
    const cv = document.createElement('canvas'); cv.id = 'tree-gl'; cv.setAttribute('aria-hidden', 'true');
    let gl; try { gl = cv.getContext('webgl', { alpha: true, premultipliedAlpha: true, antialias: false, powerPreference: 'low-power' }) } catch (e) {} if (!gl) return off;
    const VS = 'attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}';
    const FS = `precision highp float;uniform sampler2D t0;uniform sampler2D t1;uniform sampler2D t2;uniform sampler2D t3;uniform vec4 wt;uniform vec2 res;uniform vec4 map;uniform vec2 sz;uniform float t;uniform float g;uniform float dpr;
void main(){vec2 sc=vec2(gl_FragCoord.x,res.y-gl_FragCoord.y)/dpr;float u=1920.+(sc.x-map.x)/map.z;float v=(sc.y-map.y)/map.w;
float far=clamp((688.-v)/430.,0.,1.5);float A=pow(far,1.4);
float s1=sin(t*.62+v*.0052+u*.0016);float s2=sin(t*1.57+v*.017+u*.011+1.3);float s3=sin(t*3.9+v*.061+u*.047);
float dx=A*(7.*s1+2.6*s2)+A*A*1.1*s3+g*A*(11.*sin(t*2.1+v*.008)+4.*sin(t*5.+v*.03));
float dy=A*(3.2*sin(t*.5+u*.004)+1.5*s2)+A*A*.8*cos(t*3.3+u*.05)+g*A*5.*cos(t*1.9+u*.006);
vec2 q=vec2((u+dx)/sz.x,(v+dy)/sz.y);
if(q.x<0.||q.x>1.||q.y<0.||q.y>1.){gl_FragColor=vec4(0.);}else{gl_FragColor=texture2D(t0,q)*wt.x+texture2D(t1,q)*wt.y+texture2D(t2,q)*wt.z+texture2D(t3,q)*wt.w;}}`;
    const sh = (ty, src) => { const x = gl.createShader(ty); gl.shaderSource(x, src); gl.compileShader(x); return gl.getShaderParameter(x, gl.COMPILE_STATUS) ? x : null };
    const vs = sh(gl.VERTEX_SHADER, VS), fs = sh(gl.FRAGMENT_SHADER, FS); if (!vs || !fs) return off;
    const pr = gl.createProgram(); gl.attachShader(pr, vs); gl.attachShader(pr, fs); gl.linkProgram(pr); if (!gl.getProgramParameter(pr, gl.LINK_STATUS)) return off; gl.useProgram(pr);
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer()); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const ap = gl.getAttribLocation(pr, 'p'); gl.enableVertexAttribArray(ap); gl.vertexAttribPointer(ap, 2, gl.FLOAT, false, 0, 0);
    const U = {}; ['res', 'map', 'sz', 't', 'g', 'dpr', 'wt', 't0', 't1', 't2', 't3'].forEach(n => U[n] = gl.getUniformLocation(pr, n));
    let ready = false, g = 0, gT = 0, sign = 1, last = 0, lastM = '', still = 0, dpr = 1; const cw = tw();
    function size() { dpr = Math.min(devicePixelRatio || 1, 1.5); cv.width = Math.round(innerWidth * dpr); cv.height = Math.round(innerHeight * dpr); gl.viewport(0, 0, cv.width, cv.height); gl.uniform2f(U.res, cv.width, cv.height); gl.uniform1f(U.dpr, dpr); lastM = '' }
    function upload(srcs) {
      if (Math.max(srcs[0].naturalWidth, srcs[0].naturalHeight) > gl.getParameter(gl.MAX_TEXTURE_SIZE)) return true;
      for (let k = 0; k < 4; k++) {
        gl.activeTexture(gl.TEXTURE0 + k); const tx = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, tx); gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
        try { gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, srcs[k]) } catch (e) { return false }
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.uniform1i(U['t' + k], k);
      }
      gl.uniform2f(U.sz, 1920, 1920 * srcs[0].naturalHeight / srcs[0].naturalWidth);
      host.after(cv); size(); addEventListener('resize', size); ready = true; return true;
    }
    /* Desde un archivo local el navegador no deja leer las imágenes: ahí se usa una copia incrustada */
    function viaScript() { const x = document.createElement('script'); x.src = (root.dataset.base || '') + 'assets/shore64.js'; x.onload = () => { const L = (window.__SHORE || []).map(u => { const im = new Image(); im.src = u; return im }); if (L.length === 4) Promise.all(L.map(im => im.decode ? im.decode().catch(() => 0) : 0)).then(() => upload(L)) }; document.head.appendChild(x) }
    Promise.all(imgs.map(im => im.complete && im.naturalWidth ? 0 : new Promise(r => im.addEventListener('load', r, { once: true })))).then(() => { if (!upload(imgs)) viaScript() });
    function tick(tms) {
      if (!ready) return; const raw = getComputedStyle(host).transform, moved = raw !== lastM, W = tw(); let dw = 0;
      for (let k = 0; k < 4; k++) { const d = W[k] - cw[k]; cw[k] += d * .045; dw = Math.max(dw, Math.abs(d)) }
      g += (gT - g) * .035; gT *= .986; if (!moved && dw < .002 && tms - last < 30 && Math.abs(gT) < .02) return; last = tms;
      if (moved) { lastM = raw; const m = new DOMMatrixReadOnly(raw); gl.uniform4f(U.map, innerWidth + m.e, m.f, m.a, m.d) }
      gl.uniform4f(U.wt, cw[0], cw[1], cw[2], cw[3]); gl.uniform1f(U.t, tms / 1000); gl.uniform1f(U.g, g * sign); gl.drawArrays(gl.TRIANGLES, 0, 3);
      if (!still) { still = 1; host.classList.add('gl-on') }
    }
    return { tick, gust(power = 1, dir = 1) { gT = Math.max(gT, power); sign = dir } };
  })();


  /* ═══════════ V5.15: peces koi en el lago, bajo los gatos. Nadan lento, cada uno a su ritmo ═══════════ */
  const Koi = (() => {
    const lyT = $('#ly-tree'); if (!lyT || !deck || P.get('koi') === '0') return { build() {}, tick() {} };
    const ly = document.createElement('div'); ly.className = 'ly'; ly.id = 'ly-koi'; ly.setAttribute('aria-hidden', 'true');
    ly.innerHTML = '<svg viewBox="0 0 1920 1080" width="1920" height="1080"></svg>'; lyT.before(ly); const sv = ly.firstChild;
    const still = true, K = .52, KS = .78, X0 = 1590, X1 = 1908, XV = 1668, Y0 = 754;   /* el agua se ve en ángulo: lo vertical se achica (K) */
    let Y1 = 1040, WM = (Y1 - Y0) / K, seed = 11;
    const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647, R = (a, b) => a + (b - a) * rnd();
    /* Cuerpo visto desde arriba: ancho según la distancia a la cabeza (cabeza en +x) */
    const hw = x => 1.2 * (x >= 6 ? 7 * Math.sqrt(Math.max(0, 1 - Math.pow((x - 6) / 16, 2.2))) : 2.2 + 4.8 * Math.pow(Math.sin(Math.PI / 2 * Math.max(0, (x + 17) / 23)), 1.2));
    const outline = (a, b) => { const xs = []; for (let i = 0; i <= 14; i++) xs.push(b + (a - b) * i / 14); const up = xs.map(x => `${x.toFixed(2)} ${(-hw(x)).toFixed(2)}`), dn = xs.slice().reverse().map(x => `${x.toFixed(2)} ${hw(x).toFixed(2)}`); return 'M' + up.join('L') + 'L' + dn.join('L') + 'Z' };
    const FRONT = outline(22, -4), MID = outline(0, -14), TAIL = outline(-11, -19);
    /* Solo el borde de afuera lleva línea: así no se marcan las uniones del cuerpo */
    const pts = (a, b, sg) => { const o = []; for (let i = 0; i <= 14; i++) { const x = b + (a - b) * i / 14; o.push(`${x.toFixed(2)} ${(sg * hw(x)).toFixed(2)}`) } return o };
    const E_F = 'M' + pts(22, -4, -1).join('L') + 'L' + pts(22, -4, 1).reverse().join('L'), E_M = 'M' + pts(0, -14, -1).join('L') + 'M' + pts(0, -14, 1).join('L'), E_T = 'M' + pts(-11, -19, -1).join('L') + 'M' + pts(-11, -19, 1).join('L');
    const CAUDAL = 'M-16.5 0C-20 -2.6 -25 -8.6 -32 -11.6C-30 -6.4 -28.2 -3 -26.8 0C-28.2 3 -30 6.4 -32 11.6C-25 8.6 -20 2.6 -16.5 0Z';
    const FIN = 'M13 5.4C11.4 10.4 7 14.4 2.4 14.2C3.6 10.2 7.4 6.8 11 5Z';
    const COL = { w: '#FBF6EF', r: '#C42F3F', k: '#1F1B23', p: '#EFE4CC' };
    /* Kohaku, tancho, showa, sanke, platino y otro kohaku */
    const TY = [
      { b: 'w', fin: 'rgba(255,248,242,.62)', f: [['r', 14, 0, 6.6, 5], ['r', 2, -1.6, 7, 5.2]], m: [['r', -7, 1.6, 5, 3.4]] },
      { b: 'w', fin: 'rgba(255,248,242,.62)', f: [['r', 14.2, 0, 3.7, 3.7]], m: [] },
      { b: 'k', fin: 'rgba(38,33,44,.55)', f: [['r', 12, 1, 7, 5], ['w', 1, -3.2, 5, 3.2], ['w', 19, -.6, 2.6, 2.2]], m: [['w', -7, 2.4, 4.4, 2.4]] },
      { b: 'w', fin: 'rgba(255,248,242,.62)', f: [['r', 13, -1.2, 6, 4.4], ['r', -.5, 2.2, 6.4, 4], ['k', 5, -4.4, 1.7, 1.4], ['k', 9, 3.8, 1.2, 1]], m: [['k', -8, -1.6, 1.6, 1.3]] },
      { b: 'p', fin: 'rgba(255,252,246,.66)', f: [], m: [], sheen: 1 },
      { b: 'w', fin: 'rgba(255,248,242,.62)', f: [['r', 6, 1.8, 9, 5]], m: [['r', -6, -1.8, 6, 3.2]] },
    ];
    const SZ = [1.2, 1.24]; TY.splice(0, TY.length, TY[0], TY[2]);
    let F = [], rings = [], lastR = 0, last = 0, prev = 0, lastL = '', gR, gF, gS;
    const ell = (c, x, y, rx, ry) => `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="${COL[c]}"/>`;
    function bounds() { const s = Math.max(innerWidth / 1920, innerHeight / 1080); Y1 = Math.max(Y0 + 80, Math.min(1040, innerHeight / s - 24)); WM = (Y1 - Y0) / K }
    function target(f) { for (let i = 0; i < 12; i++) { const u = R(XV + 12, X1 - 14), w = R(10, WM - 10); if (Math.hypot(u - f.u, w - f.w) > 70 || i === 11) { f.tu = u; f.tw = w; f.tt = R(14, 30); return } } }
    function build() {
      bounds(); seed = 11; rings = []; ly.style.transform = lyT.style.transform;
      const st = 'fill="none" stroke="rgba(70,52,62,.32)" stroke-width=".7" vector-effect="non-scaling-stroke"';
      let h = `<defs><clipPath id="kc-f" clipPathUnits="userSpaceOnUse"><path d="${FRONT}"/></clipPath><clipPath id="kc-m" clipPathUnits="userSpaceOnUse"><path d="${MID}"/></clipPath>`
        + `<filter id="kb" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="2.6"/></filter></defs><g class="ksh" filter="url(#kb)"></g><g class="kfi"></g><g class="krg"></g>`;
      sv.innerHTML = h; gS = sv.querySelector('.ksh'); gF = sv.querySelector('.kfi'); gR = sv.querySelector('.krg');
      F = TY.map((t, i) => {
        const f = { t, s0: SZ[i], u: R(XV + 20, X1 - 20), w: R(14, WM - 14), h: R(-Math.PI, Math.PI), v: R(6, 10), base: R(8, 13), sp: R(0, 6.28), sf: R(.05, .11), ph: R(0, 6.28), rate: 0 };
        target(f);
        const g = document.createElementNS('http://www.w3.org/2000/svg', 'g'), sh = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse');
        sh.setAttribute('cx', '2'); sh.setAttribute('rx', '22'); sh.setAttribute('ry', '6.6'); sh.setAttribute('fill', 'rgba(16,26,44,.9)'); gS.appendChild(sh);
        const fp = t.f.map(p => ell(...p)).join('') + (t.sheen ? '<ellipse cx="7" cy="0" rx="15" ry="2.1" fill="#fff" opacity=".75"/><ellipse cx="7" cy="0" rx="10" ry="5.4" fill="#F3D9A4" opacity=".45"/>' : ''), mp = t.m.map(p => ell(...p)).join('');
        g.innerHTML = `<g class="j1"><g class="j2"><path d="${CAUDAL}" fill="${t.fin}"/><path d="M-17 0L-29.5 -7M-17 0L-27 0M-17 0L-29.5 7" stroke="rgba(255,255,255,.35)" stroke-width=".5" fill="none"/><path d="${TAIL}" fill="${COL[t.b]}"/><path d="${E_T}" ${st}/></g>`
          + `<path d="${MID}" fill="${COL[t.b]}"/><g clip-path="url(#kc-m)">${mp}</g><path d="${E_M}" ${st}/></g>`
          + `<path class="fl" d="${FIN}" fill="${t.fin}"/><path class="fr" d="${FIN}" transform="scale(1 -1)" fill="${t.fin}"/>`
          + `<path d="${FRONT}" fill="${COL[t.b]}"/><g clip-path="url(#kc-f)">${fp}</g><path d="${E_F}" ${st}/><path d="M-6 0L9 0" stroke="rgba(0,0,0,.1)" stroke-width="1.1" fill="none"/>`
          + `<circle cx="17.6" cy="-3.3" r=".75" fill="#2A2228"/><circle cx="17.6" cy="3.3" r=".75" fill="#2A2228"/>`;
        gF.appendChild(g); f.g = g; f.sh = sh; f.j1 = g.querySelector('.j1'); f.j2 = g.querySelector('.j2'); f.fl = g.querySelector('.fl'); f.fr = g.querySelector('.fr');
        return f;
      });
      lastL = ''; prev = 0; draw(performance.now(), true);
    }
    function light(force) {
      const z = Mode.weights(), d = z.e3 + z.n1 + z.n3, sum = z.e1 + z.e2 + d || 1, e1 = z.e1 / sum, e2 = z.e2 / sum, e3 = d / sum;
      const key = [e1, e2, e3].map(v => v.toFixed(2)).join(); if (!force && key === lastL) return; lastL = key;
      sv.style.filter = `brightness(${(e1 + e2 * .8 + e3 * .5).toFixed(3)}) saturate(${(e1 * .95 + e2 * .9 + e3 * .72).toFixed(3)})`;
      sv.style.opacity = (.9 - e3 * .06).toFixed(3); gS.style.opacity = ((e1 + e2 * .55) * .2).toFixed(3);
      sv.style.setProperty('--kr', e3 > .5 ? 'rgba(255,196,218,' : 'rgba(255,255,255,');
    }
    function step(dt, tms) {
      const t = tms / 1000;
      F.forEach(f => {
        f.tt -= dt; if (f.tt <= 0 || Math.hypot(f.tu - f.u, f.tw - f.w) < 18) target(f);
        let dx = f.tu - f.u, dy = f.tw - f.w; const dd = Math.hypot(dx, dy) || 1; dx /= dd; dy /= dd;
        F.forEach(o => { if (o === f) return; const ex = f.u - o.u, ey = f.w - o.w, e = Math.hypot(ex, ey); if (e < 38 && e > .01) { const k = (38 - e) / 38 * 1.4; dx += ex / e * k; dy += ey / e * k } });
        if (f.u < XV - 30) dx += 1.2; if (f.w < 4) dy += 1; if (f.w > WM - 4) dy -= 1;
        let a = Math.atan2(dy, dx) - f.h; a = Math.atan2(Math.sin(a), Math.cos(a));
        const want = Math.max(-.5, Math.min(.5, a * .8)); f.rate += (want - f.rate) * Math.min(1, dt * 2); f.h += f.rate * dt;
        const vt = f.base * (.55 + .45 * (.5 + .5 * Math.sin(t * f.sf * 6.28 + f.sp))) * (Math.abs(a) > 1.4 ? .6 : 1);
        f.v += (vt - f.v) * Math.min(1, dt * .7);
        f.u += Math.cos(f.h) * f.v * dt; f.w += Math.sin(f.h) * f.v * dt; f.ph += dt * 6.28 * (.42 + f.v * .042);
      });
    }
    function draw(tms, force) {
      light(force);
      F.forEach(f => {
        const y = Y0 + f.w * K, s = f.s0 * (.84 + .3 * Math.max(0, Math.min(1, f.w / Math.max(1, WM)))), hd = f.h * 180 / Math.PI, tb = -f.rate * 30;
        const a1 = (still ? 4 : 5 + f.v * .35) * Math.sin(f.ph) + tb * .8, a2 = (still ? 9 : 12 + f.v * .6) * Math.sin(f.ph - 1.2) + tb * 1.4, fa = 10 + 8 * Math.sin(f.ph * .6 + 1);
        f.g.setAttribute('transform', `translate(${f.u.toFixed(1)} ${y.toFixed(1)}) scale(1 ${KS}) rotate(${hd.toFixed(1)}) scale(${s.toFixed(3)})`);
        f.sh.setAttribute('transform', `translate(${(f.u + 6).toFixed(1)} ${(y + 9).toFixed(1)}) scale(1 ${KS}) rotate(${hd.toFixed(1)}) scale(${s.toFixed(3)})`);
        f.j1.setAttribute('transform', `rotate(${a1.toFixed(1)} -2 0)`); f.j2.setAttribute('transform', `rotate(${a2.toFixed(1)} -12 0)`);
        f.fl.setAttribute('transform', `rotate(${fa.toFixed(1)} 11.5 5.2)`); f.fr.setAttribute('transform', `scale(1 -1) rotate(${fa.toFixed(1)} 11.5 5.2)`);
      });
    }
    function ripple(tms) {
      const f = F[Math.floor(R(0, F.length))], y = Y0 + f.w * K, hx = f.u + Math.cos(f.h) * 18, hy = y + Math.sin(f.h) * 18 * K;
      const e = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse'); e.setAttribute('cx', hx.toFixed(1)); e.setAttribute('cy', hy.toFixed(1)); e.setAttribute('fill', 'none');
      gR.appendChild(e); rings.push({ e, t0: tms });
    }
    function tick(tms) {
      if (!F.length || tms - last < 33) return; const dt = prev ? Math.min(.1, (tms - prev) / 1000) : 0; prev = tms; last = tms;
      if (!still) step(dt, tms); draw(tms);
      if (still) return;
      if (!lastR) lastR = tms; if (tms - lastR > 7000 + 5000 * (seed % 97) / 97) { lastR = tms; ripple(tms) }
      const kr = sv.style.getPropertyValue('--kr') || 'rgba(255,255,255,';
      rings = rings.filter(r => { const p = (tms - r.t0) / 2800; if (p >= 1) { r.e.remove(); return false } const rx = 3 + 24 * p; r.e.setAttribute('rx', rx.toFixed(1)); r.e.setAttribute('ry', (rx * K * 1.1).toFixed(1)); r.e.setAttribute('stroke', kr + (.5 * (1 - p)).toFixed(3) + ')'); r.e.setAttribute('stroke-width', (1.3 - p).toFixed(2)); return true });
    }
    addEventListener('resize', bounds);
    return { build, tick };
  })();
  /* ═══════════ V5.14: el columpio cuelga de la rama baja del cerezo y se mece lento (ida y vuelta en 9,2 s). El árbol no se mueve ═══════════ */
  const Obj = (() => {
    const lyT = $('#ly-tree'); if (!lyT || !deck) return { build() {}, tick() {} };
    const ly = document.createElement('div'); ly.className = 'ly'; ly.id = 'ly-obj'; ly.setAttribute('aria-hidden', 'true');
    ly.innerHTML = '<svg viewBox="0 0 1920 1080" width="1920" height="1080"></svg>'; lyT.after(ly); const sv = ly.firstChild;
    /* Justo a la derecha de donde termina el contenido (x ≈ 1630 de la escena en todas las pantallas) */
    const [p1, p2] = [[1660.2, 468.7], [1705.2, 472.6]], PY = 636, L1 = PY - p1[1], L2 = PY - p2[1], PER = 9.2, AMP = 6 * Math.PI / 180, still = RM || CAP;
    /* Colores de día (E1), alba (E2) y noche (E3): se mezclan con la luz del momento */
    const PAL = { rope: ['#2B2320', '#2A1E28', '#06070C'], plank: ['#9C7B57', '#6E4A40', '#2B2128'], plank2: ['#6A5038', '#47302C', '#16111A'], rim: ['#FFF4EA', '#FFC2D6', '#FF8DB8'] };
    const hx = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16)), PH = {}; for (const k in PAL) PH[k] = PAL[k].map(hx);
    const cw = [0, 0, 1], pt = p => p.map(n => n.toFixed(1)).join(' '); let lastC = '', last = 0, E = null;
    function build() {
      sv.innerHTML = `<line class="r1" stroke-width="4.4" stroke-linecap="round" style="stroke:var(--o-rope)"/><line class="r2" stroke-width="4.4" stroke-linecap="round" style="stroke:var(--o-rope)"/>`
        + `<circle cx="${p1[0]}" cy="${p1[1]}" r="3.6" style="fill:var(--o-rope)"/><circle cx="${p2[0]}" cy="${p2[1]}" r="3.6" style="fill:var(--o-rope)"/>`
        + `<path class="pf" style="fill:var(--o-plank2)"/><path class="pt" style="fill:var(--o-plank)"/><path class="pr" fill="none" stroke-width="1.6" style="stroke:var(--o-rim);opacity:var(--o-rima)"/>`;
      E = {}; ['r1', 'r2', 'pf', 'pt', 'pr'].forEach(k => E[k] = sv.querySelector('.' + k)); lastC = ''; tick(performance.now(), true);
    }
    function colors(force) {
      const z = Mode.weights(), W = [z.e1, z.e2, z.e3 + z.n1 + z.n3];
      for (let k = 0; k < 3; k++) cw[k] += force ? W[k] - cw[k] : (W[k] - cw[k]) * .05;
      const key = cw.map(v => v.toFixed(3)).join(); if (!force && key === lastC) return; lastC = key; const st = sv.style, sum = cw[0] + cw[1] + cw[2] || 1;
      for (const k in PH) st.setProperty('--o-' + k, `rgb(${[0, 1, 2].map(j => Math.round((PH[k][0][j] * cw[0] + PH[k][1][j] * cw[1] + PH[k][2][j] * cw[2]) / sum)).join(',')})`);
      st.setProperty('--o-rima', (cw[1] * .3 + cw[2] * .55).toFixed(3));
    }
    function tick(tms, force) {
      if (!E || (!force && tms - last < 33)) return; last = tms; colors(force);
      const th = still ? 0 : AMP * Math.sin(tms / 1000 * 2 * Math.PI / PER), Lm = (L1 + L2) / 2, dx = Math.sin(th) * Lm * .55, dy = -(1 - Math.cos(th)) * Lm;
      const e1 = [p1[0] + dx, p1[1] + L1 + dy], e2 = [p2[0] + dx, p2[1] + L2 + dy - 8], tl = th * .35;
      E.r1.setAttribute('x1', p1[0]); E.r1.setAttribute('y1', p1[1]); E.r1.setAttribute('x2', e1[0].toFixed(1)); E.r1.setAttribute('y2', e1[1].toFixed(1));
      E.r2.setAttribute('x1', p2[0]); E.r2.setAttribute('y1', p2[1]); E.r2.setAttribute('x2', e2[0].toFixed(1)); E.r2.setAttribute('y2', e2[1].toFixed(1));
      const a1 = [e1[0] - 23, e1[1] + 4 + tl * 20], a2 = [e2[0] + 19, e2[1] - 4 - tl * 20], b2 = [a2[0] + 17, a2[1] + 11], b1 = [a1[0] + 13, a1[1] + 15], tk = 11;
      E.pf.setAttribute('d', `M${pt(a1)}L${pt(b1)}L${pt(b2)}L${b2[0].toFixed(1)} ${(b2[1] + tk).toFixed(1)}L${b1[0].toFixed(1)} ${(b1[1] + tk).toFixed(1)}L${a1[0].toFixed(1)} ${(a1[1] + tk).toFixed(1)}Z`);
      E.pt.setAttribute('d', `M${pt(a1)}L${pt(a2)}L${pt(b2)}L${pt(b1)}Z`); E.pr.setAttribute('d', `M${pt(b1)}L${pt(b2)}`);
    }
    return { build, tick };
  })();
  /* ═══════════ La pareja: dos gatos adultos, tranquilos, que nunca hacen dos veces lo mismo ═══════════ */
  const Cat = (() => {
    const el = $('#cat'); if (!el) return { place() {}, travel() {}, tick() {}, react() {} };
    const TAU = Math.PI * 2, lerp = (a, b, p) => a + (b - a) * p, clamp = (v, a, b) => Math.max(a, Math.min(b, v));
    const ease = p => p < .5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2, back = p => { const c = 1.2; return 1 + (c + 1) * Math.pow(p - 1, 3) + c * Math.pow(p - 1, 2) };
    const rnd = (a, b) => a + Math.random() * (b - a), pick = a => a[Math.floor(Math.random() * a.length)];
    const sleep = ms => new Promise(r => setTimeout(r, ms));
    const layer = el.parentNode, LAST = SC.STOPS - 1;
    const kitEl = el.cloneNode(true); kitEl.id = 'kit'; layer.insertBefore(kitEl, el);
    /* Partes de cada pose */
    const rigOf = node => { const poses = {}; $$('[data-pose]', node).forEach(g => { const legs = {}; $$('[data-leg]', g).forEach(l => legs[l.dataset.leg] = l); poses[g.dataset.pose] = { g, tail: $('[data-tail]', g), body: $('[data-body]', g), head: $('[data-head]', g), rig: $('[data-rig]', g), arm: $('[data-arm]', g), paw: $('[data-paw]', g), mouth: $('[data-mouth]', g), eye: $('[data-eye]', g), ears: $$('[data-ear]', g), legs } }); return { node, poses, cur: null } };
    const PIV = { back: [50, 27], side: [33, 24], lie: [29, 78], move: [25, 36], climb: [50, 46] };
    const TAIL = {
      back: { b: [66, 94], a0: .4, curl: -.62, n: 7, L: 8.1, sway: .05, sp: 1.3 },
      hang: { b: [50, 97], a0: 1.5, curl: .02, n: 8, L: 7.6, sway: .08, sp: 1 },
      side: { b: [55, 96], a0: .3, curl: -.58, n: 7, L: 7.9, sway: .05, sp: 1.4 },
      lie: { b: [90, 94], a0: 1.3, curl: .03, n: 8, L: 7.2, sway: .08, sp: .9 },
      lieG: { b: [90, 95], a0: -.12, curl: .035, n: 8, L: 7.2, sway: .035, sp: .8 },
      walk: { b: [92, 44], a0: -.95, curl: -.12, n: 7, L: 7.6, sway: .06, sp: 4 },
      run: { b: [94, 46], a0: -.1, curl: -.03, n: 7, L: 8, sway: .08, sp: 8 },
      low: { b: [92, 48], a0: .42, curl: -.05, n: 7, L: 7.8, sway: .04, sp: 3 },
      climb: { b: [50, 92], a0: 1.5, curl: .02, n: 7, L: 7.2, sway: .1, sp: 3.5 }
    };
    const fresh = () => ({ head: 0, headY: 0, ear1: 0, ear2: 0, lean: 0, armT: 0, pawT: 0, mouth: 0, eye: 0, breath: .012, a0: .4, curl: -.62, L: 8.1, n: 7, sway: .05, sp: 1.3, bx: 66, by: 94, flick: 0, crouch: 0, pitch: 0, air: 0, sx: 1, sy: 1, armWob: 0, spread: 0, lk: 0 });
    const actor = (node, k) => ({ R: rigOf(node), k, S: fresh(), C: { x: 0, y: 0, sc: 1, flip: false, rot: 0, pose: 'back', phi: 0, gait: 'walk' }, tw: [], job: null, last: 0 });
    /* Ella es adulta también, un poco más chica que él */
    const B = actor(el, 1), W = actor(kitEl, .84), S = B.S, C = B.C;
    C.stop = 0; C.rest = null;
    let token = 0, idleTk = 0, lastRest = '';
    const tw = (a, o, d = 400, e = ease) => { const t0 = performance.now(); for (const k in o) { a.tw = a.tw.filter(w => w.k !== k); if (d <= 0) a.S[k] = o[k]; else a.tw.push({ k, a: a.S[k], b: o[k], t0, d, e }) } };
    const jobOf = (a, d, fn) => new Promise(res => { a.job = { t0: performance.now(), d, fn, res } });
    const to = (o, d, e) => tw(B, o, d, e), job = (d, fn) => jobOf(B, d, fn), setPose = p => { C.pose = p };
    const tailOf = (a, m, d = 280) => { const q = TAIL[m]; a.S.bx = q.b[0]; a.S.by = q.b[1]; a.S.n = q.n; a.S.L = q.L; tw(a, { a0: q.a0, curl: q.curl, sway: q.sway, sp: q.sp }, d) };
    const useTail = (m, d) => tailOf(B, m, d);
    /* Dibujo */
    function tailD(s, t) {
      let x = s.bx, y = s.by, a = s.a0; const pts = [[x, y]], n = s.n;
      for (let i = 1; i <= n; i++) { a += s.curl + s.sway * Math.sin(t * s.sp - i * .62) * (i / n + .35) + s.flick * Math.sin(t * 11 - i * .9) * (i / n); x += s.L * Math.cos(a); y += s.L * Math.sin(a); pts.push([x, y]) }
      let d = `M${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`;
      for (let i = 1; i < pts.length - 1; i++) { const mx = (pts[i][0] + pts[i + 1][0]) / 2, my = (pts[i][1] + pts[i + 1][1]) / 2; d += `Q${pts[i][0].toFixed(1)} ${pts[i][1].toFixed(1)} ${mx.toFixed(1)} ${my.toFixed(1)}` }
      return d;
    }
    const legD = (hx, hy, fx, fy, bend) => `M${hx.toFixed(1)} ${hy.toFixed(1)}Q${((hx + fx) / 2 + bend).toFixed(1)} ${((hy + fy) / 2).toFixed(1)} ${fx.toFixed(1)} ${fy.toFixed(1)}`;
    const GAIT = {
      walk: { d: { nh: 0, nf: .25, fh: .5, ff: .75 }, st: 13, lift: 5, bob: .8, nod: 1, pit: 0 },
      trot: { d: { nh: 0, ff: 0, nf: .5, fh: .5 }, st: 17, lift: 8, bob: 1.5, nod: 1.6, pit: 0 },
      run: { d: { nf: 0, ff: .1, nh: .5, fh: .6 }, st: 25, lift: 12, bob: 3.2, nod: 2.2, pit: 5 },
      creep: { d: { nh: 0, nf: .25, fh: .5, ff: .75 }, st: 10, lift: 3, bob: .4, nod: .3, pit: 0 }
    };
    const HIPS = { nf: [32, 58, -2.5], ff: [41, 59, -2.5], nh: [86, 59, 5], fh: [77, 59, 5] };
    function eyeOf(P_, s) { if (P_.eye) { const c = +P_.eye.dataset.cy; P_.eye.setAttribute('transform', `translate(0 ${c}) scale(1 ${(1 - .9 * s.eye).toFixed(3)}) translate(0 ${-c})`) } }
    function renderMove(P_, s, c) {
      const g = GAIT[c.gait] || GAIT.walk, bounce = Math.sin(c.phi * TAU * 2) * g.bob * (1 - s.air), dy = s.crouch + bounce, pit = s.pitch + Math.sin(c.phi * TAU) * g.pit * (1 - s.air);
      if (P_.rig) P_.rig.setAttribute('transform', `rotate(${pit.toFixed(2)} 58 60)`);
      P_.body.setAttribute('transform', `translate(0 ${dy.toFixed(2)})`);
      P_.head.setAttribute('transform', `translate(0 ${(dy - s.crouch * .25).toFixed(2)}) rotate(${(s.head + Math.sin(c.phi * TAU * 2 + 1) * g.nod).toFixed(2)} ${PIV.move[0]} ${PIV.move[1]})`);
      for (const k in P_.legs) { const H = HIPS[k], ph = (c.phi + g.d[k]) * TAU, hy = H[1] + dy, front = k[1] === 'f';
        let fx = H[0] + Math.sin(ph) * g.st, fy = 100 - Math.max(0, Math.cos(ph)) * g.lift;
        const ax = H[0] + (front ? -27 : 27), ay = hy + (front ? 25 : 23); fx = lerp(fx, ax, s.air); fy = lerp(fy, ay, s.air);
        if (s.spread) fx += (front ? -19 : 2) * s.spread;
        P_.legs[k].setAttribute('d', legD(H[0], hy, fx, fy, H[2] * (1 + s.crouch * .13))) }
      eyeOf(P_, s);
    }
    function renderClimb(P_, s, c) {
      const ph = c.phi * TAU, q = Math.sin(ph), l = P_.legs;
      l.a.setAttribute('d', legD(38, 48, 17 - q * 2, 36 + q * 8, -3)); l.b.setAttribute('d', legD(62, 48, 83 + q * 2, 36 - q * 8, 3));
      l.c.setAttribute('d', legD(38, 84, 17 + q * 2, 96 - q * 8, -3)); l.d.setAttribute('d', legD(62, 84, 83 - q * 2, 96 + q * 8, 3));
      P_.body.setAttribute('transform', `rotate(${(q * 2.5).toFixed(2)} 50 66)`);
    }
    function renderRest(P_, s, c, t) {
      const piv = PIV[c.pose], br = 1 + Math.sin(t * 1.3) * s.breath;
      if (P_.body) P_.body.setAttribute('transform', `translate(50 100) rotate(${s.lean.toFixed(2)}) scale(${(2 - br).toFixed(4)} ${br.toFixed(4)}) translate(-50 -100)`);
      if (P_.head) P_.head.setAttribute('transform', `translate(0 ${(s.headY + (br - 1) * -18).toFixed(2)}) rotate(${(s.head + s.lk).toFixed(2)} ${piv[0]} ${piv[1]})`);
      if (c.pose === 'side') {
        const T = s.armT, wob = s.armWob * Math.sin(t * 9), px = lerp(26, 18 + wob * 1.2, T), py = lerp(98, 30 + wob * 3, T), ex = lerp(27, 20, T), ey = lerp(72, 42, T);
        const toe = T < .15 ? `L${lerp(20.5, px, T * 6).toFixed(1)} ${lerp(99, py, T * 6).toFixed(1)}` : '';
        P_.arm.setAttribute('d', `M30 46Q${ex.toFixed(1)} ${ey.toFixed(1)} ${px.toFixed(1)} ${py.toFixed(1)}${toe}`);
        P_.mouth.style.opacity = s.mouth;
      }
      if (c.pose === 'lie') { const T = s.pawT, sw = Math.sin(t * 1.7) * 3 * T; P_.paw.setAttribute('d', `M28 93Q${lerp(16, 26 + sw * .4, T).toFixed(1)} ${lerp(96.5, 108, T).toFixed(1)} ${lerp(4, 26 + sw, T).toFixed(1)} ${lerp(98, 122, T).toFixed(1)}`) }
      P_.ears.forEach(e => { const k = e.dataset.ear === '1' ? s.ear1 : s.ear2; e.setAttribute('transform', `rotate(${k.toFixed(2)} ${e.dataset.px} ${e.dataset.py})`) });
      eyeOf(P_, s);
    }
    function draw(a, t) {
      const R = a.R, s = a.S, c = a.C;
      if (R.cur !== c.pose) { R.cur = c.pose; for (const n in R.poses) R.poses[n].g.classList.toggle('on', n === c.pose) }
      const P_ = R.poses[c.pose]; if (P_.tail) P_.tail.setAttribute('d', tailD(s, t));
      if (c.pose === 'move') renderMove(P_, s, c); else if (c.pose === 'climb') renderClimb(P_, s, c); else renderRest(P_, s, c, t);
      R.node.style.transform = `translate(${(c.x - 75).toFixed(2)}px,${(c.y - 107).toFixed(2)}px) rotate(${c.rot.toFixed(2)}deg) scale(${((c.flip ? -1 : 1) * c.sc * a.k * s.sx).toFixed(4)},${(c.sc * a.k * s.sy).toFixed(4)})`;
    }
    function stepActor(a, tms) {
      if (a.job) { const J = a.job, p = Math.min(1, (tms - J.t0) / J.d); J.fn(p, tms); if (p >= 1) { a.job = null; J.res(true) } }
      if (a.tw.length) a.tw = a.tw.filter(w => { const p = Math.min(1, (tms - w.t0) / w.d); a.S[w.k] = lerp(w.a, w.b, w.e(p)); return p < 1 });
    }
    const moving = a => a.C.pose === 'move' || a.C.pose === 'climb';
    function tick(tms) {
      const t = tms / 1000;
      stepActor(B, tms); stepActor(W, tms); followTick(tms); lookTick();
      if (moving(B) || tms - B.last > 30) { B.last = tms; draw(B, t) }
      if (moving(W) || tms - W.last > 30) { W.last = tms; draw(W, t) }
    }
    /* ── Pétalos que se sueltan ── */
    function puff(x, y, n = 2) { if (RM || CAP) return; for (let i = 0; i < n; i++) { const p = document.createElement('i'); p.className = 'cpf'; p.style.left = x + rnd(-34, 34) + 'px'; p.style.top = y + rnd(-14, 6) + 'px'; p.style.setProperty('--dx', rnd(-46, 46) + 'px'); p.style.setProperty('--dy', rnd(80, 190) + 'px'); p.style.setProperty('--rt', rnd(-300, 300) + 'deg'); p.style.animationDuration = rnd(1.6, 2.6) + 's'; p.addEventListener('animationend', () => p.remove()); layer.appendChild(p) } }
    /* ── Piezas de recorrido ── */
    const SIZE = i => 1.06;
    const STRIDE = { walk: 74, trot: 92, run: 128, creep: 56 };
    async function gait(x1, y1, d, g, s1, tk) {
      setPose('move'); C.gait = g; C.rot = 0; to({ air: 0, pitch: 0, crouch: g === 'creep' ? 9 : 0, spread: 0, eye: 0 }, 140); useTail(g === 'run' ? 'run' : g === 'creep' ? 'low' : 'walk', 200);
      const x0 = C.x, y0 = C.y, s0 = C.sc, phi0 = C.phi, dist = Math.hypot(x1 - x0, y1 - y0); C.flip = x1 > x0;
      await job(d, p => { if (tk !== token) return; C.x = lerp(x0, x1, p); C.y = lerp(y0, y1, p); C.sc = s1 ? lerp(s0, s1, p) : s0; C.phi = phi0 + dist * p / STRIDE[g] });
    }
    async function crouch(d) { setPose('move'); to({ crouch: 10, air: 0, pitch: 0, spread: 0 }, d * .8); useTail('low', d); await job(d, () => {}) }
    async function jump(x1, y1, d, tk, o = {}) {
      setPose('move'); const x0 = C.x, y0 = C.y, s0 = C.sc, s1 = o.s1 || s0, D = y1 - y0, h = o.h !== undefined ? o.h : Math.abs(D) / 4 + 34, bulge = o.bulge !== undefined ? o.bulge : 54;
      C.flip = o.flip !== undefined ? o.flip : x1 > x0; to({ crouch: 0, air: 1 }, Math.min(170, d * .3)); useTail('run', 140);
      await job(d, p => { if (tk !== token) return;
        C.x = lerp(x0, x1, p) - Math.sin(p * Math.PI) * bulge; C.y = y0 + D * p - h * 4 * p * (1 - p); C.sc = lerp(s0, s1, p);
        const vy = D - h * 4 * (1 - 2 * p), m = Math.max(Math.abs(D) + 4 * h, 1), pit = clamp(vy / m, -1, 1) * 40; C.rot = C.flip ? pit : -pit;
        if (p > .72) S.air = lerp(1, .55, (p - .72) / .28) });
      C.rot = 0;
    }
    async function land(tk, soft) { setPose('move'); C.rot = 0; puff(C.x, C.y, 2); to({ air: 0, crouch: soft ? 4 : 8 }, 70); to({ sx: 1.02, sy: .98 }, 70); await job(90, () => {}); to({ sx: 1, sy: 1, crouch: 0 }, 320, back); await job(soft ? 150 : 220, () => {}) }
    async function climb(x1, y1, d, tk, s1) {
      setPose('climb'); useTail('climb', 150); const x0 = C.x, y0 = C.y, s0 = C.sc, phi0 = C.phi, dist = Math.abs(y1 - y0); C.flip = false; C.rot = 0;
      await job(d, p => { if (tk !== token) return; const e = ease(p); C.x = lerp(x0, x1, e); C.y = lerp(y0, y1, e); C.sc = s1 ? lerp(s0, s1, e) : s0; C.phi = phi0 + dist * e / 88 });
    }
    /* ── Bolsas: lo que ya salió no vuelve hasta que salieron todas, incluso entre páginas ── */
    const shuffle = a => { const o = a.slice(); for (let i = o.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1));[o[i], o[j]] = [o[j], o[i]] } return o };
    const store = { get(k) { try { return JSON.parse(sessionStorage.getItem('cat:' + k) || '[]') } catch (e) { return [] } }, set(k, v) { try { sessionStorage.setItem('cat:' + k, JSON.stringify(v)) } catch (e) {} } };
    function fromBag(key, names, last) { let b = store.get(key).filter(n => names.includes(n)); if (!b.length) { b = shuffle(names); if (b.length > 1 && b[b.length - 1] === last) b.unshift(b.pop()) } const n = b.pop(); store.set(key, b); return n }
    /* ── Recorridos ── */
    const STY = {
      async salto(A, Q, s0, s1, tk) { await gait(A.root[0], A.root[1], 520, 'walk', 0, tk); await crouch(220); await jump(Q.root[0], Q.root[1], 760, tk, { s1 }); await land(tk); await gait(Q.x, Q.y, 500, 'walk', 0, tk) },
      async trepa(A, Q, s0, s1, tk) { await gait(A.root[0], A.root[1], 440, 'trot', 0, tk); await climb(Q.root[0], Q.root[1], 1200, tk, s1); await gait(Q.x, Q.y, 500, 'walk', 0, tk) },
      async directo(A, Q, s0, s1, tk) { await crouch(320); await jump(Q.x, Q.y, 920, tk, { s1, bulge: rnd(36, 90), flip: Math.random() < .5 }); await land(tk) },
      async carrera(A, Q, s0, s1, tk) { await gait(A.root[0], A.root[1], 320, 'run', 0, tk); await jump(Q.root[0], Q.root[1], 700, tk, { s1, bulge: 80, h: Math.abs(Q.root[1] - A.root[1]) / 4 + 12 }); await land(tk, true); await gait(Q.x, Q.y, 420, 'walk', 0, tk) },
      async puntas(A, Q, s0, s1, tk) { const ax = Math.max(A.tip[0], A.x - 66), bx = Math.max(Q.tip[0], Q.x - 66), ay = lerp(A.y, A.tip[1], (A.x - ax) / Math.max(1, A.x - A.tip[0])), by = lerp(Q.y, Q.tip[1], (Q.x - bx) / Math.max(1, Q.x - Q.tip[0])); await gait(ax, ay, 520, 'creep', 0, tk); await crouch(190); await jump(bx, by, 780, tk, { s1, bulge: 24 }); await land(tk); await gait(Q.x, Q.y, 500, 'walk', 0, tk) },
      async paseo(A, Q, s0, s1, tk) { await gait(Q.x + (Q.x > A.x ? 34 : -34), Q.y, 900, 'walk', 0, tk); await gait(Q.x, Q.y, 520, 'walk', 0, tk) },
      async trote(A, Q, s0, s1, tk) { await gait(Math.max(1690, Math.min(1840, A.x + (Q.x >= A.x ? 70 : -70))), A.y, 600, 'trot', 0, tk); await gait(Q.x, Q.y, 640, 'trot', 0, tk) },
      async baja(A, Q, s0, s1, tk) { await gait(A.root[0], A.root[1], 460, 'walk', 0, tk); setPose('climb'); useTail('climb', 100); await sleep(90); await climb(Q.root[0], Q.root[1], 800, tk, s1); await land(tk, true); await gait(Q.x, Q.y, 480, 'walk', 0, tk) }
    };
    async function hops(list, tk) { for (let i = 0; i < list.length; i++) { const q = SC.perches[list[i]]; if (tk !== token) return; await jump(q.x, q.y, i === list.length - 1 ? 580 : 420, tk, { s1: SIZE(list[i]), bulge: rnd(20, 60), h: Math.abs(q.y - C.y) / 4 + 22, flip: Math.random() < .5 }); to({ crouch: 5 }, 40); await job(70, () => {}); to({ crouch: 0 }, 60) } await land(tk, true) }
    /* ── Poses de descanso ── */
    function restPool(stop) { return stop === LAST ? ['side', 'back'] : ['back', 'side', 'lie'] }
    function restOf(a, kind, d = 220) {
      const base = kind.replace('R', ''), pose = base === 'hang' ? 'back' : base; a.C.pose = pose; a.C.flip = kind.endsWith('R'); a.C.rot = 0;
      tw(a, { head: 0, headY: 0, ear1: 0, ear2: 0, lean: 0, armT: 0, pawT: 0, mouth: 0, flick: 0, armWob: 0, breath: .012, air: 0, crouch: 0, pitch: 0, spread: 0, eye: 0 }, d);
      tailOf(a, base === 'hang' ? 'hang' : base === 'lie' ? (C.stop === LAST ? 'lieG' : 'lie') : base === 'side' ? 'side' : 'back', d + 120);
      if (d <= 0) { a.S.sx = 1; a.S.sy = 1 } else tw(a, { sx: 1, sy: 1 }, 200);
    }
    function setRest(kind, d = 220) { C.rest = kind; lastRest = kind; restOf(B, kind, d) }
    /* ── Geometría de los dos sobre la rama ── */
    const unit = (a, stop) => 150 / 140 * SIZE(stop === undefined ? C.stop : stop) * a.k;
    const P0 = () => SC.perches[C.stop];
    const branchY = (stop, x) => { const p = SC.perches[stop]; return x >= p.x ? lerp(p.y, p.root[1], (x - p.x) / Math.max(1, p.root[0] - p.x)) : lerp(p.y, p.tip[1], (p.x - x) / Math.max(1, p.x - p.tip[0])) };
    const EDGE = { back: 12, hang: 12, side: 3, lie: 34 };
    const seatX = (stop = C.stop) => { const p = SC.perches[stop], k = C.rest || 'back', e = k.endsWith('R') ? 38 : (EDGE[k] ?? 12), x = p.x + e * unit(B, stop) + 38 * unit(W, stop); return stop === LAST ? x : Math.min(x, p.root[0] - 6) };
    const touchX = () => P0().x + 47 * unit(B) + 45 * unit(W);
    const nearX = () => P0().x + 12 * unit(B) + 13 * unit(W);
    const lims = () => { const p = P0(); return { lo: Math.min(p.x, Math.max(p.tip[0] + 8, 1668)), hi: Math.max(p.x + 30, Math.min(p.root[0] + 12, 1885)) } };
    /* ── Lo básico ── */
    const alive = k => k === idleTk;
    const ok = async (ms, k) => { await sleep(ms); return alive(k) };
    const run = (d, fn, k) => new Promise(res => { const t0 = performance.now(); (function f(t) { if (!alive(k)) return res(false); const p = clamp((t - t0) / d, 0, 1); fn(p, Math.max(0, t - t0) / 1000); if (p < 1) requestAnimationFrame(f); else res(true) })(t0) });
    const props = new Set();
    const clearProps = () => { props.forEach(e => e.remove()); props.clear() };
    const prop = (cls, html = '') => { const e = document.createElement('i'); e.className = cls; e.innerHTML = html; layer.appendChild(e); props.add(e); return e };
    const drop = e => { props.delete(e); e.remove() };
    const setXY = (e, x, y, more = '') => { e.style.transform = `translate(${x.toFixed(1)}px,${y.toFixed(1)}px)${more}` };
    function aimOf(a, x, y) { const u = unit(a), dx = x - a.C.x, dy = a.C.y - 62 * u - y; if (a.C.pose === 'back') return clamp((a.C.flip ? -dx : dx) * .16 / u, -17, 17); const f = a.C.flip ? dx : -dx; return f < -6 ? 0 : clamp(Math.atan2(dy, Math.max(f, 12)) * 57.3 * .6, -24, 26) }
    const track = (a, x, y) => { a.tw = a.tw.filter(w => w.k !== 'head'); a.S.head += (aimOf(a, x, y) - a.S.head) * .08 };
    async function aWalk(a, x, d = 320, g = 'walk') {
      const c = a.C, y = branchY(C.stop, x); c.pose = 'move'; c.gait = g; c.rot = 0; tailOf(a, g === 'run' ? 'run' : g === 'creep' ? 'low' : 'walk', 140); tw(a, { air: 0, crouch: g === 'creep' ? 9 : 0, pitch: 0, spread: 0, head: 0, headY: 0, armT: 0, mouth: 0, eye: 0 }, 90);
      const x0 = c.x, y0 = c.y, phi0 = c.phi, dist = Math.abs(x - x0); if (Math.abs(x - x0) > 1) c.flip = x > x0;
      await jobOf(a, d, p => { c.x = lerp(x0, x, p); c.y = lerp(y0, y, p); c.phi = phi0 + dist * p / (STRIDE[g] * a.k * .9) });
    }
    const wWalk = (x, d = 420, g = 'walk') => aWalk(W, x, d, g);
    const wSit = (kind, d = 200) => restOf(W, kind, d);
    /* ── Gestos de uno solo ── */
    async function ear(a, k) { const e = Math.random() < .5 ? 'ear1' : 'ear2', s = e === 'ear1' ? -1 : 1; tw(a, { [e]: 16 * s }, 240); if (!await ok(rnd(900, 1800), k)) return; tw(a, { [e]: 0 }, 300); await sleep(320) }
    async function twitch(a) { const e = Math.random() < .5 ? 'ear1' : 'ear2', s = Math.random() < .5 ? -1 : 1; tw(a, { [e]: 12 * s }, 80); await sleep(95); tw(a, { [e]: 0 }, 120); await sleep(140) }
    async function flick(a) { tw(a, { flick: .09 }, 120); await sleep(rnd(500, 900)); tw(a, { flick: 0 }, 300); await sleep(300) }
    async function tailTap(a, k) { tw(a, { sway: .13, sp: 2.2 }, 500); if (!await ok(rnd(1800, 3000), k)) return; const q = TAIL[a.C.pose === 'side' ? 'side' : a.C.pose === 'lie' ? 'lie' : 'back']; tw(a, { sway: q.sway, sp: q.sp }, 700); await sleep(720) }
    async function blink(a, k) { tw(a, { eye: 1 }, 420); if (!await ok(rnd(500, 1000), k)) return; tw(a, { eye: 0 }, 460); await sleep(480) }
    async function lookAround(a, k) { for (const dir of shuffle([-1, 1])) { if (!alive(k)) return; tw(a, { head: dir * rnd(10, 16), headY: -1 }, 700); if (!await ok(rnd(1100, 1900), k)) return } tw(a, { head: 0, headY: 0 }, 760); await sleep(780) }
    async function lookUp(a, k) { tw(a, { head: a.C.pose === 'back' ? 6 : 16, headY: -2 }, 700); if (!await ok(rnd(1400, 2400), k)) return; await twitch(a); tw(a, { head: 0, headY: 0 }, 760); await sleep(780) }
    async function wash(a, k) { tw(a, { head: -14, armT: 1 }, 520); if (!await ok(540, k)) return; for (let i = 0; i < 3; i++) { if (!alive(k)) return; tw(a, { head: 6, headY: -2, armWob: 2 }, 420); await sleep(430); tw(a, { head: -14, headY: 1, armWob: 1 }, 400); await sleep(410) } tw(a, { armWob: 0, head: 0, headY: 0, armT: 0 }, 560); await sleep(580) }
    async function yawn(a) { tw(a, { head: 20, headY: -2, ear1: -7, ear2: 7, eye: .7 }, 620); await sleep(500); tw(a, { mouth: 1 }, 300); await sleep(rnd(800, 1150)); tw(a, { mouth: 0 }, 260); await sleep(180); tw(a, { head: 0, headY: 0, ear1: 0, ear2: 0, eye: 0 }, 640); await sleep(660) }
    async function shift(a) { tw(a, { lean: pick([-2.5, 2.5]), head: pick([-5, 5]) }, 800); await sleep(rnd(1200, 2000)); tw(a, { lean: 0, head: 0 }, 800); await sleep(820) }
    async function drowse(a, k) { tw(a, { head: -10, headY: 3, ear1: -6, ear2: 6, breath: .026, eye: .85 }, 1000); if (!await ok(rnd(3000, 5000), k)) return; await twitch(a); tw(a, { head: 0, headY: 0, ear1: 0, ear2: 0, breath: .012, eye: 0 }, 900); await sleep(920) }
    async function dangle(a, k) { tw(a, { pawT: 1 }, 760); if (!await ok(rnd(2200, 3600), k)) return; tw(a, { pawT: 0 }, 640); await sleep(660) }
    async function stretch(a, k) {
      const c = a.C, kind = c.pose === 'move' ? 'side' : c.pose + (c.flip ? 'R' : ''); c.pose = 'move'; c.gait = 'walk'; c.rot = 0; tailOf(a, 'walk', 240);
      tw(a, { spread: 1, crouch: 9, pitch: -11, head: 12, headY: 0, ear1: -6, ear2: 6, air: 0, eye: .8 }, 800); if (!await ok(rnd(1400, 2000), k)) return;
      tw(a, { spread: 0, crouch: 0, pitch: 6, head: -3 }, 520); if (!await ok(620, k)) return;
      tw(a, { pitch: 0, head: 0, ear1: 0, ear2: 0, eye: 0 }, 320); await sleep(340); if (alive(k)) restOf(a, kind, 240);
    }
    const ACT = { back: { lookAround, lookUp, ear, flick, tailTap, shift }, side: { wash, yawn, blink, ear, lookUp, tailTap, stretch }, lie: { drowse, dangle, ear, blink, tailTap } };
    let lastSolo = {};
    const solo = async (a, k) => { if (moving(a)) return; const p = a.C.pose, set = ACT[p] || ACT.back, n = fromBag('solo-' + p + a.k, Object.keys(set), lastSolo[p]); lastSolo[p] = n; await set[n](a, k) };
    /* ── Cosas que hacen juntos ── */
    const settle = async k => { if (!alive(k)) return; await Promise.all([aWalk(B, P0().x, 620), wWalk(seatX(), 640)]); if (alive(k)) { const a = pick(['side', 'back']); setRest(a); wSit(a === 'side' ? 'back' : 'side') } };
    /* Cae un pétalo y los dos lo siguen con la mirada */
    async function petal(k) {
      const u = unit(B), mid = (C.x + W.C.x) / 2, y1 = C.y + 40, y0 = C.y - 240 * u, pet = prop('cpt'); let x = mid + 60, y = y0; setXY(pet, x, y); setRest(pick(['side', 'back']), 300); wSit('side', 300);
      if (!await run(5200, (q, s) => { y = lerp(y0, y1, q); x = mid + Math.sin(s * 1.2) * 56 * u * (1 - q * .4); setXY(pet, x, y, ` rotate(${(s * 60).toFixed(0)}deg)`); pet.style.opacity = q > .9 ? (1 - q) * 10 : 1; track(B, x, y); track(W, x, y) }, k)) return;
      drop(pet); tw(B, { head: 0 }, 700); tw(W, { head: 0 }, 700); await ear(W, k);
    }
    /* Un pájaro cruza a lo lejos: orejas arriba y lo siguen sin moverse */
    const BIRD = '<svg viewBox="-20 -10 40 20"><path class="w1" d="M0 0Q-9 -7 -19 -4Q-10 -1 -2 3Z"/><path class="w2" d="M0 0Q9 -7 19 -4Q10 -1 2 3Z"/></svg>';
    async function bird(k) {
      const u = unit(B), dir = Math.random() < .5 ? 1 : -1, y0 = C.y - rnd(190, 280) * u, x0 = C.x + dir * 420, x1 = C.x - dir * 620, b = prop('cbw', BIRD); setRest(pick(['back', 'side']), 300); wSit('back', 300); tw(B, { ear1: -8, ear2: 8 }, 300); tw(W, { ear1: -8, ear2: 8 }, 300); setXY(b, x0, y0);
      if (!await run(6000, (q, s) => { const x = lerp(x0, x1, q), y = y0 + Math.sin(s * 1.1) * 14; setXY(b, x, y); b.style.opacity = q < .1 ? q * 10 : q > .9 ? (1 - q) * 10 : 1; track(B, x, y); track(W, x, y); }, k)) return;
      drop(b); tw(B, { head: 0, ear1: 0, ear2: 0 }, 700); tw(W, { head: 0, ear1: 0, ear2: 0 }, 700); await flick(B);
    }
    /* Pasa una ráfaga: se les van las orejas atrás y entrecierran los ojos */
    async function gust(k) {
      setRest('side', 300); wSit('side', 300); if (!await ok(420, k)) return; Wind.gust(2.4, -1); for (let i = 0; i < 7; i++) setTimeout(() => spawn(innerWidth * (.5 + Math.random() * .5), true), i * 120);
      const g = { ear1: -14, ear2: 14, eye: .75, head: -5, sway: .14, sp: 2.4 }; tw(B, g, 340); tw(W, g, 400); if (!await ok(rnd(2000, 2800), k)) return;
      const r = { ear1: 0, ear2: 0, eye: 0, head: 0, sway: TAIL.side.sway, sp: TAIL.side.sp }; tw(B, r, 800); await sleep(160); tw(W, r, 800); await sleep(820); await twitch(W);
    }
    /* Caminan hasta la punta y se quedan mirando el paisaje */
    async function stroll(k) {
      const u = unit(B), { lo } = lims(); await aWalk(B, lo + 2, 1100); if (!alive(k)) return; await wWalk(Math.max(lo + 46 * u, W.C.x - 90), 800); if (!alive(k)) return;
      restOf(B, 'back', 300); restOf(W, 'back', 300); tw(B, { head: -10 }, 800); tw(W, { head: -8 }, 900); if (!await ok(rnd(2400, 3600), k)) return; await settle(k);
    }
    /* Él da una vuelta; ella se queda y lo sigue con la mirada */
    async function patrol(k) {
      const { lo, hi } = lims(), x0 = C.x; wSit('side', 300); const follow = () => track(W, C.x, C.y - 40); await Promise.all([aWalk(B, lo + 4, 1300), run(1300, follow, k)]); if (!alive(k)) return; restOf(B, 'back', 300); if (!await run(2000, follow, k)) return;
      await Promise.all([aWalk(B, x0, 1300), run(1300, follow, k)]); if (!alive(k)) return; setRest(pick(['side', 'back'])); tw(W, { head: 0 }, 600); await sleep(620);
    }
    /* Ella se cambia de lado */
    async function swap(k) {
      const p = P0(), a0 = C.x, b0 = W.C.x; await Promise.all([aWalk(B, b0, 1100), wWalk(a0, 1100)]); if (!alive(k)) return; restOf(B, 'side', 280); C.rest = 'side'; restOf(W, 'sideR', 280); tw(W, { head: 6 }, 600); if (!await ok(rnd(2400, 3600), k)) return; await blink(W, k); await Promise.all([aWalk(B, a0, 1100), wWalk(b0, 1100)]); if (!alive(k)) return; setRest(pick(['side', 'back'])); wSit('side', 280);
    }
    /* Juntos, de espalda, mirando el paisaje */
    async function together(k) { setRest('back', 300); await wWalk(nearX(), 620); if (!alive(k)) return; wSit('backR', 260); if (!await ok(520, k)) return; tw(B, { head: 8, sway: .06 }, 800); tw(W, { head: 8, sway: .06 }, 800); if (!await ok(rnd(3600, 5400), k)) return; await ear(W, k); tw(B, { head: 0 }, 700); tw(W, { head: 0 }, 700); await sleep(720); await wWalk(seatX(), 620); if (alive(k)) wSit('side') }
    /* Frente con frente, un momento */
    async function lean(k) {
      setRest('sideR', 280); await wWalk(touchX(), 760); if (!alive(k)) return; wSit('side', 240); if (!await ok(360, k)) return; tw(W, { head: -9, headY: 1, eye: 1 }, 640); tw(B, { head: -6, eye: 1 }, 700); if (!await ok(rnd(2200, 3200), k)) return; tw(W, { head: 0, headY: 0, eye: 0 }, 640); tw(B, { head: 0, eye: 0 }, 640); if (!await ok(800, k)) return; await settle(k);
    }
    /* Se echan a descansar */
    async function rest_(k) { setRest('lie', 360); await wWalk(seatX(), 560); if (!alive(k)) return; wSit('lie', 320); if (!await ok(520, k)) return; const go = { head: -8, headY: 2, ear1: -5, ear2: 5, breath: .024, eye: .9 }; tw(B, go, 1100); tw(W, go, 1300); if (!await ok(rnd(4200, 6400), k)) return; const up = { head: 0, headY: 0, ear1: 0, ear2: 0, breath: .012, eye: 0 }; tw(B, up, 900); await sleep(300); tw(W, up, 900); await sleep(920); await ear(B, k) }
    /* Algo se movió allá abajo: se agacha y vigila */
    async function stalk(k) {
      const { lo } = lims(), x = Math.max(lo + 6, C.x - 44 * unit(B)); wSit('side', 300); await aWalk(B, x, 1100, 'creep'); if (!alive(k)) return; tw(B, { head: -6, flick: .05 }, 300); if (!await ok(rnd(2000, 3000), k)) return; tw(B, { flick: 0, crouch: 0, head: 0 }, 500); await sleep(520); await aWalk(B, P0().x, 900); if (alive(k)) setRest(pick(['side', 'back']));
    }
    async function stretchBoth(k) { await Promise.all([stretch(B, k), sleep(520).then(() => alive(k) && stretch(W, k))]) }
    /* Cada uno en lo suyo */
    async function apart(k) { await Promise.all([solo(B, k), sleep(rnd(300, 900)).then(() => alive(k) && solo(W, k))]) }
    const SCENES = { petal, gust, stroll, patrol, swap, together, lean, rest: rest_, stalk, stretchBoth, apart };
    const atEnd = ['petal', 'gust', 'together', 'lean', 'rest', 'apart'];
    let lastScene = '';
    function nextScene() { const names = C.stop === LAST ? atEnd : Object.keys(SCENES), n = fromBag(C.stop === LAST ? 'fin' : 'scene', names, lastScene); lastScene = n; root.dataset.catScene = n; return SCENES[n] }
    /* ── Al llegar al final: satisfechos. También aquí cambia cada vez ── */
    const roomEnd = () => { const p = P0(); C.x = p.x; C.y = p.y };
    async function sfStretch(k) {   /* Se estira largo, se sienta y cierra los ojos con la cabeza en alto */
      setRest('side', 200); wSit('side', 240); await stretch(B, k); if (!alive(k)) return; restOf(B, 'side', 300); tw(B, { head: 12, headY: -1, curl: -.72, sway: .03, eye: 1 }, 1100); if (!await ok(600, k)) return; tw(W, { head: 8, eye: 1 }, 1000); if (!await ok(rnd(3600, 4800), k)) return; tw(W, { eye: 0, head: 0 }, 700); if (!await ok(500, k)) return; tw(B, { eye: 0, head: 3 }, 800); await sleep(820);
    }
    async function sfSigh(k) {   /* Un suspiro largo, de espalda: suben los hombros y bajan */
      setRest('back', 240); await wWalk(nearX(), 560); if (!alive(k)) return; wSit('backR', 240); if (!await ok(420, k)) return; tw(B, { sy: 1.04, sx: .98, headY: -2 }, 1100); tw(W, { head: 9 }, 900); if (!await ok(1150, k)) return; tw(B, { sy: .985, sx: 1.015, headY: 1.5, ear1: -6, ear2: 6 }, 1500); if (!await ok(1600, k)) return; tw(B, { sy: 1, sx: 1, headY: 0, head: 7, sway: .035 }, 900); if (!await ok(rnd(3200, 4400), k)) return; tw(W, { head: 0 }, 700); tw(B, { head: 0, ear1: 0, ear2: 0 }, 700); await sleep(720);
    }
    async function sfLean(k) {   /* Ella se apoya en él y los dos cierran los ojos */
      setRest('side', 240); wSit('side', 200); const x = C.x - 1 * unit(B) + 37 * unit(W); await wWalk(x, 620); if (!alive(k)) return; wSit('side', 260); if (!await ok(360, k)) return; tw(W, { head: -5, lean: -5, eye: 1 }, 900); if (!await ok(520, k)) return; tw(B, { head: 10, eye: 1, curl: -.7, sway: .03 }, 1000); if (!await ok(rnd(3800, 5200), k)) return; tw(B, { head: 0, eye: 0 }, 700); tw(W, { head: 0, lean: 0, eye: 0 }, 760); await sleep(780);
    }
    async function sfLie(k) {   /* Se echa con las patas adelante y mira lo que quedó hecho */
      setRest('lie', 420); await wWalk(seatX(), 620); if (!alive(k)) return; wSit('lie', 360); if (!await ok(620, k)) return; tw(B, { breath: .03, eye: .7, headY: -1, head: 6 }, 1100); if (!await ok(500, k)) return; tw(W, { breath: .03, eye: 1, head: -4, headY: 2 }, 1100); if (!await ok(rnd(4200, 5600), k)) return; await blink(B, k); tw(B, { breath: .012, eye: 0, head: 0, headY: 0 }, 900); await sleep(920);
    }
    async function sfKnead(k) {   /* Amasa despacio con los ojos cerrados, que es lo que hace un gato contento */
      setRest('side', 240); wSit('back', 240); if (!await ok(360, k)) return; tw(B, { head: 9, eye: 1, curl: -.7, sway: .03 }, 900); if (!await ok(700, k)) return; for (let i = 0; i < 9; i++) { if (!alive(k)) return; tw(B, { armT: .13 }, 300); await sleep(330); tw(B, { armT: 0, sy: i % 2 ? 1 : .992 }, 300); await sleep(340) } tw(B, { sy: 1 }, 300); if (!await ok(1200, k)) return; tw(B, { head: 0, eye: 0 }, 760); await sleep(780);
    }
    const SATIS = { sfStretch, sfSigh, sfLean, sfLie, sfKnead };
    let lastSat = '';
    async function satisfied(k) { const n = fromBag('sat', Object.keys(SATIS), lastSat); lastSat = n; root.dataset.catEnd = n; await SATIS[n](k) }
    /* ── El ratón y lo que pasa en la página ── */
    const ptr = { x: -1e4, y: -1e4, t: 0 };
    if (FINE) addEventListener('pointermove', e => { ptr.x = e.clientX; ptr.y = e.clientY; ptr.t = performance.now() }, { passive: true });
    let lkF = 0;
    function lookTick() { if (QUIET) return;
      if (++lkF % 3 === 0) [B, W].forEach(a => { let tg = 0; if (ptr.x > -1e3 && performance.now() - ptr.t < 5000 && !moving(a) && !a.job) { const r = a.R.node.getBoundingClientRect(), dx = ptr.x - (r.left + r.right) / 2, dy = r.top + r.height * .35 - ptr.y; if (Math.hypot(dx, dy) < 480) { if (a.C.pose === 'back') tg = clamp((a.C.flip ? -dx : dx) * .05, -13, 13); else { const f = a.C.flip ? dx : -dx; tg = f > -30 ? clamp(Math.atan2(dy, Math.max(f, 24)) * 57.3 * .42, -13, 15) : 0 } } } a.lkT = tg });
      B.S.lk += ((B.lkT || 0) - B.S.lk) * .05; W.S.lk += ((W.lkT || 0) - W.S.lk) * .05;
    }
    /* Clic sobre un gato: una oreja y un parpadeo lento, nada más */
    addEventListener('pointerdown', e => { if (!deck || RM || CAP || QUIET) return; const t = e.target; if (t.closest && t.closest('a,button,input,textarea,select,summary,[data-tab],.tq,.tpanel,.tcanvas')) return; for (const a of [W, B]) { const r = a.R.node.getBoundingClientRect(); if (e.clientX > r.left + r.width * .12 && e.clientX < r.right - r.width * .12 && e.clientY > r.top + r.height * .1 && e.clientY < r.bottom) { if (!moving(a)) { twitch(a); tw(a, { eye: 1 }, 300); setTimeout(() => tw(a, { eye: 0 }, 400), 650) } break } } });
    let pending = null;
    function react(kind) {
      if (RM || CAP || !deck) return;
      if (kind === 'hop') { if (!moving(W) && !W.job) twitch(W); return }
      if (kind === 'no') { if (B.job || moving(B)) return; tw(B, { ear1: -10, ear2: 10, flick: .09 }, 120); setTimeout(() => tw(B, { ear1: 0, ear2: 0, flick: 0 }, 400), 700); return }
      if (kind === 'win') { if (moving(B) || W.mode !== 'rest') { pending = 'win'; return } idleTk++; clearProps(); B.job = null; W.job = null; roomEnd(); const k = idleTk; satisfied(k).then(() => { if (alive(k)) life(k, true) }) }
    }
    /* Vida en espera: calma, con algo distinto cada vez */
    async function life(k, done) {
      if (P.get('gato') === 'quieto') return;
      for (let i = 0; i < 40 && W.mode !== 'rest'; i++) { if (!await ok(60, k)) return }
      if (pending) { pending = null; await satisfied(k); }
      else if (C.stop === LAST && !done) { if (!await ok(500, k)) return; await satisfied(k) }
      if (!await ok(rnd(600, 1400), k)) return;
      while (alive(k)) {
        clearProps();
        await nextScene()(k);
        if (!await ok(rnd(1800, 3800), k)) return;
      }
    }
    /* ── Ella lo sigue por el mismo camino, un poco después, y nunca se va ── */
    W.mode = 'rest'; W.buf = []; W.dx = 0; W.dy = 0; W.delay = 380;
    function startFollow() { W.mode = 'follow'; W.tw = []; W.job = null; W.buf = []; W.dx = W.C.x - C.x; W.dy = W.C.y - C.y; W.delay = rnd(340, 520); Object.assign(W.S, { sx: 1, sy: 1, eye: 0 }) }
    function followTick(t) {
      if (W.mode !== 'follow') return; const s = W.S, c = W.C;
      W.buf.push({ t, S: { ...S }, x: C.x, y: C.y, sc: C.sc, rot: C.rot, flip: C.flip, pose: C.pose, phi: C.phi, gait: C.gait });
      const tgt = t - W.delay; while (W.buf.length > 1 && W.buf[1].t <= tgt) W.buf.shift();
      const f = W.buf[0], tree = f.pose === 'climb', want = tree ? 0 : (f.flip ? -56 : 56);
      W.dx += (want - W.dx) * .1; W.dy += (0 - W.dy) * .1;
      Object.assign(s, f.S, { mouth: 0 }); c.x = f.x + W.dx; c.y = f.y + W.dy; c.sc = f.sc; c.rot = f.rot; c.flip = f.flip; c.pose = tree ? 'climb' : 'move'; c.phi = f.phi * 1.2; c.gait = f.gait;
      if (f.pose !== 'move' && f.pose !== 'climb' && !B.job) {
        W.mode = 'arrive'; Object.assign(s, { air: 0, crouch: 0, pitch: 0, spread: 0, sx: 1, sy: 1 }); const x = seatX();
        wWalk(x, 420, 'walk').then(() => { if (W.mode === 'arrive') { W.mode = 'rest'; wSit(pick(['side', 'back'])) } });
      }
    }
    const CAPPOSE = ['back', 'side', 'lie', 'back', 'side', 'lie', 'back', 'side', 'back', 'side', 'side'], CAPW = ['side', 'back', 'lie', 'back', 'back', 'lie', 'side', 'back', 'side', 'side', 'back'];
    function place(stop) {
      if (!deck) return; const p = SC.perches[stop]; token++; idleTk++; clearProps(); B.job = null; W.job = null; C.stop = stop; C.x = p.x; C.y = p.y; C.sc = SIZE(stop); setRest(CAP || RM ? CAPPOSE[stop] : pick(restPool(stop)), 0);
      B.tw = B.tw.filter(w => w.k !== 'sx' && w.k !== 'sy'); S.sx = 1; S.sy = 1;
      const x = seatX(stop); W.C.x = x; W.C.y = branchY(stop, x); W.C.sc = SIZE(stop); W.mode = 'rest'; restOf(W, CAP || RM ? CAPW[stop] : pick(['side', 'back']), 0);
      if (CAP || RM) { B.tw.forEach(w => S[w.k] = w.b); W.tw.forEach(w => W.S[w.k] = w.b); B.tw = []; W.tw = [] }
      const t = performance.now() / 1000; draw(B, t); draw(W, t); if (!RM && !CAP) life(idleTk);
    }
    /* ── Viaje entre dos paradas ── */
    let lastStyle = '';
    function travel(a, b) {
      if (RM || CAP) return place(b);
      const tk = ++token; idleTk++; clearProps(); const interrupted = !!B.job || moving(B); B.job = null; C.stop = b;
      const A = SC.perches[a], Q = SC.perches[b], s0 = SIZE(a), s1 = SIZE(b), gap = Math.abs(b - a), final = b === LAST, FLAT = Math.abs(Q.y - A.y) < 60;
      to({ head: 0, headY: 0, ear1: 0, ear2: 0, lean: 0, armT: 0, pawT: 0, mouth: 0, flick: 0, armWob: 0, breath: .012, sx: 1, sy: 1, spread: 0, eye: 0 }, 120);
      startFollow();
      (async () => {
        if (interrupted) await jump(Q.x, Q.y, 680, tk, { s1, bulge: 36 });
        else if (gap >= 2 && !FLAT) { const dir = b > a ? 1 : -1, list = []; for (let i = a + dir; dir > 0 ? i <= b : i >= b; i += dir) list.push(i); await crouch(190); await hops(gap > 4 ? list.filter((x, i) => i % 2 === 1 || x === b) : list, tk) }
        else {
          const pool = FLAT ? ['paseo', 'trote', 'directo', 'puntas'] : final || a === LAST ? ['salto', 'directo', 'carrera'] : (b > a ? ['salto', 'trepa', 'directo', 'carrera', 'puntas', 'baja'] : ['salto', 'trepa', 'directo', 'puntas', 'carrera']);
          let sty = fromBag('sty' + (final ? 'F' : b > a ? 'D' : 'U'), pool, lastStyle); const force = P.get('estilo'); if (force && STY[force]) sty = force; lastStyle = sty; root.dataset.catStyle = sty;
          await STY[sty](A, Q, s0, s1, tk);
        }
        if (tk !== token) return;
        C.x = Q.x; C.y = Q.y; C.sc = s1;
        const pool = restPool(b), nx = pick(pool.filter(x => x !== lastRest || pool.length === 1)); setRest(nx);
        const k = idleTk; await sleep(300); if (k === idleTk) life(k);
      })();
    }
    if (P.has('gato')) window.__cat = { B, W, C, S, names: Object.keys(SCENES).concat(Object.keys(SATIS)), life: n => { idleTk++; const k = idleTk; clearProps(); return ({ ...SCENES, ...SATIS })[n](k) } };
    const QUIET = P.get('gato') !== 'vivo';
    if (QUIET) {
      const FIX = Math.min(3, LAST), calm = { sway: .01, sp: .45, breath: .004 }, BK = [[1400, 718], [1480, 706], [1560, 696], [1660, 686], [1760, 678], [1860, 672], [1940, 668]];
      const ground = x => { for (let i = 0; i < BK.length - 1; i++) { const [x0, y0] = BK[i], [x1, y1] = BK[i + 1]; if (x <= x1) return y0 + (y1 - y0) * (x - x0) / (x1 - x0) - 1 } return 667 };
      function placeQ() {
        if (!deck) return; token++; idleTk++; clearProps(); B.job = null; W.job = null;
        C.stop = FIX; C.x = 1814; C.y = ground(1814); C.sc = SIZE(FIX); setRest('lie', 0);
        W.C.x = 1866; W.C.y = ground(1866); W.C.sc = SIZE(FIX); W.mode = 'rest'; restOf(W, 'lie', 0);
        [B, W].forEach(a => { a.tw.forEach(w => a.S[w.k] = w.b); a.tw = []; tailOf(a, 'lieG', 0); a.tw.forEach(w => a.S[w.k] = w.b); a.tw = []; Object.assign(a.S, calm) }); S.eye = .45; W.S.eye = .55; W.S.head = -3;
        const t = performance.now() / 1000; draw(B, t); draw(W, t); if (!RM && !CAP) tails(idleTk);
      }
      async function tails(k) {
        if (!await ok(rnd(16000, 26000), k)) return;
        while (alive(k)) { const a = Math.random() < .55 ? B : W; tw(a, { sway: .1, sp: 1.4 }, 1600); if (!await ok(rnd(2600, 3600), k)) return; tw(a, { sway: calm.sway, sp: calm.sp }, 2000); if (!await ok(rnd(30000, 52000), k)) return }
      }
      return { place: placeQ, travel() {}, tick, SIZE, react() {} };
    }
    return { place, travel, tick, SIZE, react };
  })();
  /* ── Pétalos ── */
  const pbox = $('.petals');
  const spawn = (x, fast) => { if (!pbox || document.hidden) return; const i = document.createElement('i'); i.className = 'petal'; const w = innerWidth; i.style.left = (x !== undefined ? x : w * (.1 + Math.random() * .88)) + 'px'; i.style.setProperty('--dur', (fast ? 5 + Math.random() * 3 : 13 + Math.random() * 8) + 's'); i.style.setProperty('--dx', (fast ? -(80 + Math.random() * 240) : (20 + Math.random() * 90) * (Math.random() < .3 ? -1 : 1)) + 'px'); const s = .7 + Math.random() * .7; i.style.width = 13 * s + 'px'; i.style.height = 10 * s + 'px'; i.addEventListener('animationend', () => i.remove()); pbox.appendChild(i) };
  if (pbox && !RM && !CAP) { setTimeout(() => spawn(), 1400); setTimeout(() => spawn(), 3400); const tick = () => { spawn(); setTimeout(tick, 6000 + Math.random() * 6000) }; setTimeout(tick, 8000) }
  /* ── Encajar cada vista en la pantalla, sin cortes ── */
  function fit() {
    if (!deck) { slides.forEach(sl => { const w = $(':scope>.wrap', sl); if (w) w.style.zoom = '' }); return }
    const minX = Math.min(...SC.perches.slice(0, -1).map(q => q.x)) - 62;
const R0 = SC.perches[SC.perches.length - 1]; root.style.setProperty('--rock', Math.ceil((SC.W - R0.x + 62 * 1.55) * scale()) + 14 + 'px');
        root.style.setProperty('--gut', Math.ceil((SC.W - minX) * scale()) + 14 + 'px');
    const nav = 64, avail = innerHeight - nav - 8 - 24;
    slides.forEach(sl => { const w = $(':scope>.wrap', sl); if (!w) return; w.style.zoom = ''; const h = w.scrollHeight; w.style.zoom = h > avail ? (avail / h).toFixed(3) : '' });
  }
  $$('.slide').forEach(sl => $$('.rv', sl).forEach((el, k) => el.style.setProperty('--i', Math.min(k, 9))));
  /* ── Índice construido a partir de las vistas ── */
  slides.forEach((sl, i) => { $$('.sec-label b', sl).forEach(b => { if (/^\d+$/.test(b.textContent.trim())) b.textContent = String(i + 1).padStart(2, '0') }) });
  const toc = $('.toc'); let tocItems = [];
  const lfhtml = '<svg viewBox="-13 -13 26 26" class="lf"><use href="#lf"/></svg>';
  function labelOf(sl) {
    if (sl.dataset.lEs) return `<span class="es">${sl.dataset.lEs}</span><span class="en">${sl.dataset.lEn || sl.dataset.lEs}</span>`;
    const l = $('.sec-label', sl); if (l) { const es = $$('.es', l), en = $$('.en', l), a = es[es.length - 1] || en[en.length - 1], b = en[en.length - 1] || a; if (a) return `<span class="es">${a.textContent}</span><span class="en">${b.textContent}</span>` }
    return 'Inicio';
  }
  if (toc) {
    let html = '', num = 0; let pos = 0;
    slides.forEach((sl, i) => { num++; const n = +sl.dataset.steps || 1, nm = String(num).padStart(2, '0');
      html += `<li data-pos="${pos}" data-sl="${i}"><a href="#" data-go="${pos}"><span class="node">${lfhtml}</span><b>${nm}</b>${labelOf(sl)}</a></li>`;
      if (n > 1) { const es = sl.dataset.subEs.split('|'), en = sl.dataset.subEn.split('|'); es.forEach((t, k) => html += `<li class="sub" data-pos="${pos + k}" data-sl="${i}"><a href="#" data-go="${pos + k}"><span class="node">${lfhtml}</span><span class="es">${t}</span><span class="en">${en[k]}</span></a></li>`) }
      pos += n });
    const back = toc.dataset.back ? `<a class="toc-back" href="${toc.dataset.back}">← <span class="es">${toc.dataset.backEs}</span><span class="en">${toc.dataset.backEn}</span></a>` : '';
    const MB = `<div class="modes" role="group" aria-label="Mode · Modo"><button type="button" data-m="claro" aria-pressed="false" aria-label="Light mode" data-al-es="Modo claro" data-al-en="Light mode"><svg viewBox="0 0 16 16" aria-hidden="true"><circle cx="8" cy="8" r="3.2"/><path d="M8 1.5v2M8 12.5v2M1.5 8h2M12.5 8h2M3.4 3.4l1.4 1.4M11.2 11.2l1.4 1.4M3.4 12.6l1.4-1.4M11.2 4.8l1.4-1.4"/></svg><span class="es">Modo claro</span><span class="en">Light mode</span></button><button type="button" data-m="oscuro" aria-pressed="false" aria-label="Dark mode" data-al-es="Modo oscuro" data-al-en="Dark mode"><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M12.6 10.4A5.4 5.4 0 0 1 5.6 3.4a5.4 5.4 0 1 0 7 7z"/></svg><span class="es">Modo oscuro</span><span class="en">Dark mode</span></button></div>`;
    toc.innerHTML = `${back}<div class="toc-t"><span class="es">En esta página</span><span class="en">On this page</span></div><div class="tl"><svg class="stem" aria-hidden="true"><path class="s0"/><path class="s1" pathLength="1"/><path class="hz"/></svg><i class="tsun" aria-hidden="true"></i><ol>${html}</ol></div><div class="toc-count"><b id="tc"></b>/ ${String(slides.length).padStart(2, '0')}<i id="th"></i></div>`;
    tocItems = $$('li', toc); toc._full = toc.offsetHeight;
    { const m = document.createElement('div'); m.innerHTML = MB; const el = m.firstChild; el.classList.add('mtop'); document.body.appendChild(el);
      const th = () => toc.style.setProperty('--th', toc.offsetHeight + 'px'); th(); addEventListener('resize', th); document.addEventListener('langchange', th); document.fonts && document.fonts.ready.then(th) }
    { const nv = $('#nav .nav-icons') || $('#nav .lang'); if (nv) { const m = document.createElement('div'); m.innerHTML = MB; const el = m.firstChild; el.classList.add('mnav'); nv.after(el) } }
    $$('[data-go]', toc).forEach(a => a.addEventListener('click', e => { e.preventDefault(); go(+a.dataset.go) }));
  }
  /* Estilos de índice para elegir (prueba): I1 Sol, I2 Flor, I3 Pétalo, I4 Números, I5 Línea */
  const IXS = ['sol', 'flor', 'petalo', 'num', 'linea']; let IX = 'linea';
  try { const v = P.get('indice'); if (IXS.includes(v)) IX = v } catch (e) {}
  function setIx(v) { if (!toc) return; IX = v; IXS.forEach(x => toc.classList.toggle('ix-' + x, x === v)); try { localStorage.setItem('dc514.indice', v) } catch (e) {} $$('#pruebas [data-ix]').forEach(b => b.setAttribute('aria-pressed', b.dataset.ix === v ? 'true' : 'false')); drawStem(); syncToc() }
  function drawStem() {
    if (!toc) return; const ol = $('ol', toc), st = $('.stem', toc); if (!st || !tocItems.length) return;
    const H = ol.offsetHeight; st.setAttribute('height', H); st.setAttribute('viewBox', `0 0 26 ${H}`); st.style.height = H + 'px';
    tocItems.forEach(li => { const nd = $('.node', li); if (nd) nd.style.transform = '' }); $('.hz', st).setAttribute('d', '');
    if (IX !== 'flor') {
      const vis = tocItems.filter(li => !li.hidden), n = vis.length, A = IX === 'sol' ? 10 : 0;
      const P2 = vis.map((li, k) => { const ox = -A * Math.sin(Math.PI * (n > 1 ? k / (n - 1) : 0)), nd = $('.node', li); if (nd && A) nd.style.transform = `translateX(${ox.toFixed(1)}px)`; return [13 + ox, li.offsetTop + li.offsetHeight / 2] });
      let d = n ? `M${P2[0][0].toFixed(1)} ${P2[0][1].toFixed(1)}` : '';
      for (let i = 0; i < n - 1; i++) { const p0 = P2[Math.max(0, i - 1)], p1 = P2[i], p2 = P2[i + 1], p3 = P2[Math.min(n - 1, i + 2)]; d += `C${(p1[0] + (p2[0] - p0[0]) / 6).toFixed(1)} ${(p1[1] + (p2[1] - p0[1]) / 6).toFixed(1)} ${(p2[0] - (p3[0] - p1[0]) / 6).toFixed(1)} ${(p2[1] - (p3[1] - p1[1]) / 6).toFixed(1)} ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}` }
      $('.s0', st).setAttribute('d', d); $('.s1', st).setAttribute('d', d); const z = P2[n - 1]; if (IX === 'sol' && z) $('.hz', st).setAttribute('d', `M${z[0] - 13} ${z[1] + 10}h26`);
      st._ys = tocItems.map(li => li.offsetTop + li.offsetHeight / 2); st._H = H; return;
    }
    let seed = 7; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
    const pts = [[13, 0]]; tocItems.forEach(li => { const y = li.offsetTop + li.offsetHeight / 2; pts.push([13 + (rnd() - .5) * 2.2, y - li.offsetHeight / 2 + 2]); pts.push([13, y]) }); pts.push([13 + (rnd() - .5) * 3, H]);
    let d = `M${pts[0][0]} ${pts[0][1]}`; for (let i = 1; i < pts.length; i++) d += `L${pts[i][0].toFixed(1)} ${pts[i][1].toFixed(1)}`;
    let tw = ''; tocItems.forEach((li, k) => { if (k % 2 === 1) { const y = li.offsetTop + 2; tw += `M13 ${y}l-${4 + rnd() * 5} -${3 + rnd() * 3}` } });
    $('.s0', st).setAttribute('d', d + tw); $('.s1', st).setAttribute('d', d);
    st._ys = tocItems.map(li => li.offsetTop + li.offsetHeight / 2); st._H = H;
  }
  function syncToc() {
    if (!toc) return; const p = positions[cur];
    tocItems.forEach(li => { const ps = +li.dataset.pos, isSub = li.classList.contains('sub'), sameSl = +li.dataset.sl === p.sl, hasSub = (+slides[+li.dataset.sl].dataset.steps || 1) > 1;
      const on = isSub ? ps === cur : (sameSl && !hasSub); li.classList.toggle('on', on); li.classList.toggle('par', !isSub && sameSl && hasSub); li.classList.toggle('done', ps < cur && !on && !(sameSl && !isSub)); const a = $('a', li); a.setAttribute('aria-current', on ? 'true' : 'false') });
    const tc = $('#tc', toc); if (tc) tc.textContent = String(p.sl + 1).padStart(2, '0');
    const th = $('#th', toc), ns = +slides[p.sl].dataset.steps || 1; if (th) th.innerHTML = ns > 1 ? (L() === 'en' ? `step ${p.step} of ${ns}` : `paso ${p.step} de ${ns}`) + ' <span class="bajar">↓</span>' : cur < N - 1 ? (L() === 'en' ? 'scroll <span class="bajar">↓</span>' : 'baja <span class="bajar">↓</span>') : (L() === 'en' ? 'the end' : 'fin');
    /* Si el índice no cabe en la pantalla, solo se abren los pasos de la vista actual */
    const need = toc.classList.contains('compact'); if (need) toc.classList.remove('compact');
    if (toc.classList.contains('compact')) { let ch = need; tocItems.forEach(li => { if (!li.classList.contains('sub')) return; const hide = +li.dataset.sl !== p.sl; if (li.hidden !== hide) { li.hidden = hide; ch = true } }); if (ch) drawStem() } else if (need) { tocItems.forEach(li => li.hidden = false); drawStem() }
    { const av = innerHeight - 122, was = toc.className; toc.classList.remove('tight', 'tighter'); if (toc.offsetHeight > av) { toc.classList.add('tight'); if (toc.offsetHeight > av) toc.classList.add('tighter') } if (toc.className !== was) drawStem(); toc.style.setProperty('--th', toc.offsetHeight + 'px') }
    const st = $('.stem', toc); if (st && st._ys) { const li = tocItems.findIndex(x => x.classList.contains('on')); const y = st._ys[Math.max(0, li)] || 0; $('.s1', st).style.strokeDashoffset = (1 - y / st._H).toFixed(3) }
    placeSun(); setTimeout(placeSun, 560);
  }
  /* El sol, la luna o el pétalo del índice se ponen sobre la vista actual */
  function placeSun() {
    if (!toc) return; const sun = $('.tsun', toc), tl = $('.tl', toc); if (!sun || !tl) return;
    const li = tocItems.find(x => x.classList.contains('on') && !x.hidden) || tocItems.find(x => x.classList.contains('par')); const nd = li && $('.node', li); if (!nd) return;
    const r = nd.getBoundingClientRect(), b = tl.getBoundingClientRect(); sun.style.transform = `translate(${(r.left + r.width / 2 - b.left).toFixed(1)}px,${(r.top + r.height / 2 - b.top).toFixed(1)}px)`;
  }
  /* ── Fases de «Cómo trabajo»: cada una es una vista ── */
  const XS = [56, 168, 280, 392, 504];
  function setStep(sl, k) {
    $$('[data-st]', sl).forEach(x => x.classList.toggle('on', +x.dataset.st === k));
    if (!$('.method', sl)) return;
    $$('.phase', sl).forEach(p => { const on = +p.dataset.ph === k; p.classList.toggle('on', on); p.setAttribute('aria-expanded', on) });
    $$('.ph-panel', sl).forEach(p => p.classList.toggle('on', +p.dataset.ph === k));
    $$('.kitchen .st', sl).forEach(p => p.classList.toggle('on', +p.dataset.ph === k));
    $$('.kc', sl).forEach(p => p.classList.toggle('on', +p.dataset.ph === k));
    const tr = $('.kitchen .trav', sl), con = $('.kitchen .counter-on', sl);
    if (tr) tr.style.transform = `translateX(${XS[k - 1]}px)`; if (con) con.style.strokeDashoffset = 560 - XS[k - 1];
  }
  $$('.phase').forEach(p => { const act = () => { if (!deck) { setStep(p.closest('.slide'), +p.dataset.ph); return } const sl = slides.indexOf(p.closest('.slide')); const k = positions.findIndex(x => x.sl === sl && x.step === +p.dataset.ph); if (k >= 0) go(k) }; p.addEventListener('click', e => { if (!e.target.closest('a')) act() }); p.addEventListener('keydown', e => { if ((e.key === 'Enter' || e.key === ' ') && !e.target.closest('a')) { e.preventDefault(); act() } }) });
  $$('.bt .dotb').forEach(d => d.innerHTML = lfhtml);
  /* ═══════════ Interacción de las páginas de fase ═══════════ */
  const say = (es, en) => L() === 'en' ? en : es;
  const posOf = (sl, step) => positions.findIndex(x => x.sl === slides.indexOf(sl) && x.step === step);
  /* ── Problema → X → solución: cada fila se cuenta sola, sin mover nada ── */
  const wait = ms => new Promise(r => setTimeout(r, ms));
  const liveSeq = () => deck && !RM && !CAP;
  function Seq(box, sel, o = {}) {
    const rows = sel ? $$(sel, box) : [box], sl = box.closest('.slide'), T1 = o.t1 ?? 1000, T2 = o.t2 ?? 800, T3 = o.t3 ?? 1000; let tk = 0, done = false;
    const all = s => rows.forEach(r => { r.dataset.s = s; r.classList.remove('cur') });
    all(3); box.classList.add('go');
    if (!sl || !liveSeq()) return;
    async function play() {
      const k = ++tk; done = false; box.classList.remove('go'); all(0); await wait(o.start ?? 650); if (k !== tk) return; box.classList.add('go');
      for (const r of rows) {
        if (k !== tk) return; r.classList.add('cur'); r.dataset.s = 1; await wait(T1); if (k !== tk) return;
        if (T2) { r.dataset.s = 2; await wait(T2); if (k !== tk) return }
        r.dataset.s = 3; if (o.on) o.on(r); await wait(T3); if (k !== tk) return; r.classList.remove('cur');
      }
      done = true; if (o.end) o.end();
    }
    async function one(r) { const k = ++tk; all(3); r.classList.add('cur'); r.dataset.s = 1; await wait(T1 * .7); if (k !== tk) return; if (T2) { r.dataset.s = 2; await wait(T2 * .7); if (k !== tk) return } r.dataset.s = 3; await wait(T3); if (k === tk) r.classList.remove('cur') }
    if (!o.noClick) rows.forEach(r => r.addEventListener('click', e => { if (rows.length > 1 && !e.target.closest('a,button')) one(r) }));
    document.addEventListener('slidechange', e => { if (slides[e.detail.sl] === sl) play(); else { tk++; all(3) } });
  }
  $$('.hf-d2').forEach(b => Seq(b, null, { t1: 1300, t2: 900, start: 900 }));
  /* V5.17: todo el rojo de una y el verde va subiendo, fila por fila */
  function Rise(box, sel) {
    const rows = $$(sel, box), sl = box.closest('.slide'); let tk = 0;
    const all = s => { box.classList.add('rs'); rows.forEach(r => r.dataset.s = s); void box.offsetWidth; box.classList.remove('rs') };
    all(3); if (!sl || !liveSeq()) return; box.classList.add('rise');
    document.addEventListener('slidechange', async e => {
      if (slides[e.detail.sl] !== sl) { tk++; all(2); return }
      const k = ++tk; all(2); await wait(1100);
      for (const r of rows) { if (k !== tk) return; r.dataset.s = 3; await wait(480) }
    });
    all(2);
  }
  $$('.d7-q5').forEach(box => {
    const L = $$('.d7-ql button', box), P = $$('.d7-qx', box), sl = box.closest('.slide');
    const set = n => { L.forEach((l, i) => { l.classList.toggle('on', i === n); l.setAttribute('aria-pressed', i === n ? 'true' : 'false') }); P.forEach((p, i) => p.classList.toggle('on', i === n)) };
    L.forEach((l, i) => { l.addEventListener('click', () => set(i)); if (FINE) l.addEventListener('mouseenter', () => set(i)) });
    document.addEventListener('slidechange', e => { if (slides[e.detail.sl] === sl) set(0) });
    set(0);
  });
  $$('.vz').forEach(b => Rise(b, '.vz-r'));
  $$('.dz').forEach(b => Rise(b, '.dz-r'));
  $$('[data-sq]').forEach(box => {
    const sl = box.closest('.slide'), els = $$('[data-t]', box); let tm = [];
    if (!sl || !liveSeq()) return;
    const hide = () => { tm.forEach(clearTimeout); tm = []; box.classList.add('pl', 'rs'); els.forEach(e => e.classList.remove('in')); void box.offsetWidth; box.classList.remove('rs') };
    hide();
    document.addEventListener('slidechange', e => { hide(); if (slides[e.detail.sl] === sl) els.forEach(x => tm.push(setTimeout(() => x.classList.add('in'), 200 + 1.35 * x.dataset.t))) });
  });
  $$('.ers2').forEach(b => Seq(b, '.ee', { t1: 1000, t2: 750, t3: 1500 }));

  /* ── ¿Qué resuelvo? V5.16: las tarjetas de arriba mandan; abajo los cuadros ya están y los valores aparecen de a poco ── */
  $$('.qx').forEach(box => {
    const tabs = $$('.qx-t', box), panes = $$('.qx-p', box), sl = box.closest('.slide'); let cur = 0, tm = [];
    const AT = '.qv-tri>*, .qv-def, .qv-one>*, .qv-wall i, .qv-cut>*, .qv-con>b, .qv-bars u, .qv-con>small, .qv-cal>*, .qv-ch>*, .qv-clock>*, .qv-l>*';
    panes.forEach(p => {
      p.dataset.s = 4;
      $$('.qb', p).forEach(q => $$(AT, q).forEach((x, i) => {
        x.classList.add('qv-a'); x.style.setProperty('--i', i);
        if (x.matches('.qv-wall i, .qv-bars u')) x.classList.add('bar');
        if (x.matches('.qv-l path:not(.d):not(.b)')) { x.classList.add('dr'); x.setAttribute('pathLength', '1') }
      }));
      $$('.qv-tri b, .qv-one b', p).forEach(n => n.dataset.n = n.textContent.trim());
    });
    /* Las cifras suben hasta su valor cuando aparecen; el ancho queda fijo para que nada salte */
    const count = (n, d) => {
      const to = +n.dataset.n; if (!(to >= 100)) return;
      cancelAnimationFrame(n._r); n.textContent = to; n.style.minWidth = ''; const w = n.getBoundingClientRect().width; if (w) n.style.minWidth = w + 'px';
      const from = Math.round(to * .55); n.textContent = from; let t0 = 0;
      const f = now => { if (!t0) t0 = now + d; const k = Math.min(1, Math.max(0, (now - t0) / 800)), e = 1 - Math.pow(1 - k, 3); n.textContent = Math.round(from + (to - from) * e); if (k < 1) n._r = requestAnimationFrame(f) };
      n._r = requestAnimationFrame(f);
    };
    const settle = p => { p.classList.remove('seq'); $$('.qb', p).forEach(q => q.classList.add('go')); $$('.qb-ar', p).forEach(x => x.classList.add('on')); $$('[data-n]', p).forEach(n => { cancelAnimationFrame(n._r); n.textContent = n.dataset.n }) };
    const play = p => {
      tm.forEach(clearTimeout); tm = [];
      if (!liveSeq()) return settle(p);
      const qs = $$('.qb', p), ar = $$('.qb-ar', p);
      p.classList.add('seq', 'rs'); qs.forEach(q => q.classList.remove('go')); ar.forEach(x => x.classList.remove('on')); void p.offsetWidth; p.classList.remove('rs');
      [90, 1150, 2150].forEach((t, k) => tm.push(setTimeout(() => {
        if (!qs[k]) return; qs[k].classList.add('go'); if (k && ar[k - 1]) ar[k - 1].classList.add('on');
        $$('[data-n]', qs[k]).forEach(n => { const at = n.closest('.qv-a'); count(n, 120 + (+(at && at.style.getPropertyValue('--i')) || 0) * 110) });
      }, t)));
    };
    const show = n => { tabs.forEach((t, i) => { t.classList.toggle('on', i === n); t.setAttribute('aria-pressed', i === n ? 'true' : 'false') }); panes.forEach((p, i) => p.classList.toggle('on', i === n)) };
    const pick = (n, again) => { if (n === cur && !again) return; cur = n; show(n); play(panes[n]) };
    panes.forEach(settle); show(0);
    tabs.forEach((t, i) => { t.addEventListener('click', () => pick(i)); if (FINE) t.addEventListener('mouseenter', () => pick(i)) });
    document.addEventListener('slidechange', e => { if (slides[e.detail.sl] === sl) pick(cur, true); else { tm.forEach(clearTimeout); panes.forEach(settle) } });
    if (sl && sl.classList.contains('active')) pick(0, true);
  });

  /* ── El grain: el proyecto dice cuál usar ── */
  $$('.gr2').forEach(box => {
    const bs = $$('[data-pr]', box), cards = $$('.gc', box), why = $$('.gr-w', box), sl = box.closest('.slide'); let t = 0, touched = false, i = 0;
    const set = n => { i = n; const g = bs[n].dataset.g; bs.forEach((b, k) => b.classList.toggle('on', k === n)); cards.forEach(c => c.classList.toggle('use', c.dataset.g === g)); why.forEach((w, k) => w.classList.toggle('on', k === n)) };
    const tour = () => { clearTimeout(t); if (touched || !liveSeq() || i >= bs.length - 1) return; t = setTimeout(() => { if (!sl.classList.contains('active')) return; set(i + 1); tour() }, 3600) };
    bs.forEach((b, n) => { const pick = () => { touched = true; clearTimeout(t); set(n) }; b.addEventListener('click', pick); if (FINE) b.addEventListener('pointerenter', pick) });
    document.addEventListener('slidechange', e => { clearTimeout(t); if (slides[e.detail.sl] === sl) { touched = false; set(0); tour() } });
    set(0);
  });
  /* ── Pestañas ── */
  $$('[data-tabs]').forEach(box => {
    const bs = $$('[data-tab]', box), ps = $$('[data-pane]', box); let t = 0;
    const set = k => { bs.forEach(b => { const on = b.dataset.tab === k; b.classList.toggle('on', on); b.setAttribute('aria-pressed', on) }); ps.forEach(p => p.classList.toggle('on', p.dataset.pane === k)); box.dataset.cur = k };
    bs.forEach(b => { b.addEventListener('click', () => set(b.dataset.tab)); if (FINE) { b.addEventListener('pointerenter', () => { clearTimeout(t); t = setTimeout(() => set(b.dataset.tab), 80) }); b.addEventListener('pointerleave', () => clearTimeout(t)) } });
  });

  /* ── Qué es modelar: una sola tabla se convierte en un model ── */
  $$('.morph:not(.dm2)').forEach(box => {
    const svg = $('.mx-svg', box), NS = 'http://www.w3.org/2000/svg', sl = box.closest('.slide'), kpi = $('.mx-kpi', box);
    const el = (n, a = {}, p = svg) => { const e = document.createElementNS(NS, n); for (const k in a) e.setAttribute(k, a[k]); if (p) p.appendChild(e); return e };
    const STORE = () => say('Centro', 'Downtown'), P = () => [say('Café', 'Coffee'), say('Medialuna', 'Croissant'), say('Café', 'Coffee'), say('Té', 'Tea')], CAT_ = () => [say('Bebidas', 'Drinks'), say('Panadería', 'Bakery'), say('Bebidas', 'Drinks'), say('Bebidas', 'Drinks')];
    const CL = { date: 58, store: 62, product: 78, category: 74, customer: 66, qty: 34, amount: 58, budget: 62 };
    const ORDER = ['date', 'store', 'product', 'category', 'customer', 'qty', 'amount', 'budget'];
    const X0 = 54, Y0 = 62, RH = 46, HH = 30; let xs = {}, acc = X0; ORDER.forEach(c => { xs[c] = acc; acc += CL[c] });
    /* Celdas: posición en la tabla plana y en el model */
    const FX = 150, FY = 140, FR = 21, FH = 19;
    const FC = { date_key: 58, store_key: 62, prod_key: 58, cust_key: 58, qty: 30, amount: 52 }; const fx = {}; { let a = FX - 12; for (const c in FC) { fx[c] = a; a += FC[c] } }
    const TB = {
      dim_date: { x: 4, y: 14, cols: { date_key: 58, date: 56 }, rows: 3, t: 'dim_date' },
      dim_product: { x: 396, y: 14, cols: { prod_key: 56, product: 70, category: 72 }, rows: 3, t: 'dim_product' },
      dim_store: { x: 4, y: 296, cols: { store_key: 64, store: 62 }, rows: 1, t: 'dim_store' },
      dim_customer: { x: 430, y: 296, cols: { cust_key: 58, customer: 66 }, rows: 2, t: 'dim_customer' },
      fct_budget: { x: 208, y: 296, cols: { month: 46, store_key: 64, budget: 62 }, rows: 1, t: 'fct_budget' }
    };
    const dimPos = (tb, c, r) => { const T_ = TB[tb]; let x = T_.x + 2; for (const k in T_.cols) { if (k === c) break; x += T_.cols[k] } return [x, T_.y + 18 + (r < 0 ? 0 : FH + r * FR)] };
    const DEDUP = { date: { 0: 0, 1: 0, 2: 1, 3: 2 }, store: { 0: 0, 1: 0, 2: 0, 3: 0 }, product: { 0: 0, 1: 1, 2: 0, 3: 2 }, category: { 0: 0, 1: 1, 2: 0, 3: 2 }, customer: { 0: 0, 1: 0, 2: 1, 3: 0 } };
    const TOF = { date: 'dim_date', store: 'dim_store', product: 'dim_product', category: 'dim_product', customer: 'dim_customer' };
    const FLAT = { date: ['03-oct', '03-oct', '04-oct', '05-oct'], qty: ['2', '1', '1', '1'], amount: ['$3.000', '$1.500', '$1.500', '$2.000'], budget: ['$10.000', '$10.000', '$10.000', '$10.000'] };
    /* Capas */
    const gFrame = el('g', { class: 'mx-frames' }), gLinks = el('g', { class: 'mx-links' }), gMarks = el('g', { class: 'mx-marks' }), gCells = el('g', { class: 'mx-cells' }), gNotes = el('g', { class: 'mx-notes' });
    /* Marco de la tabla plana */
    const flatW = acc - X0, flatFrame = el('rect', { class: 'mx-flat', x: X0, y: Y0, width: flatW, height: HH + RH * 4, rx: 10 }, gFrame);
    const flatHead = el('rect', { class: 'mx-flathead', x: X0, y: Y0, width: flatW, height: HH, rx: 10 }, gFrame);
    /* Marcos del model */
    const frames = {}; for (const k in TB) { const T_ = TB[k], w = Object.values(T_.cols).reduce((a, b) => a + b, 0) + 4, h = 18 + FH + T_.rows * FR + 4; const g = el('g', { class: 'sv-t ' + (k === 'fct_budget' ? 'bud' : 'dim') }, gFrame); el('rect', { x: T_.x, y: T_.y, width: w, height: h, rx: 9 }, g); const t = el('text', { x: T_.x + 8, y: T_.y + 13 }, g); t.textContent = T_.t; frames[k] = { g, w, h } }
    const fw = Object.values(FC).reduce((a, b) => a + b, 0) + 4, fh = 18 + FH + 4 * FR + 4, fFrame = el('g', { class: 'sv-t fct' }, gFrame); el('rect', { x: FX - 14, y: FY - 18, width: fw, height: fh, rx: 10 }, fFrame); { const t = el('text', { x: FX - 6, y: FY - 5 }, fFrame); t.textContent = 'fct_sales' }
    /* Relationships */
    const REL = [[TB.dim_date.x + frames.dim_date.w, TB.dim_date.y + 66, FX + 32, FY - 18, 'a'], [TB.dim_product.x, TB.dim_product.y + 66, FX + 214, FY - 18, 'a'], [TB.dim_store.x + frames.dim_store.w - 8, TB.dim_store.y, FX + 16, FY - 18 + fh, 'a'], [TB.dim_customer.x + 26, TB.dim_customer.y, FX + 296, FY - 18 + fh, 'a'], [TB.fct_budget.x, TB.fct_budget.y + 30, TB.dim_store.x + frames.dim_store.w, TB.dim_store.y + 30, 'b'], [TB.dim_date.x + 30, TB.dim_date.y + frames.dim_date.h, TB.fct_budget.x + 10, TB.fct_budget.y, 'b']];
    REL.forEach((r, i) => { const [x1, y1, x2, y2, kind] = r; const my = (y1 + y2) / 2, horiz = i === 4, d = i === 5 ? `M${x1} ${y1}C${x1} ${y1 + 110},${x2 - 80} ${y2 - 44},${x2} ${y2}` : horiz ? `M${x1} ${y1}L${x2} ${y2}` : i < 2 ? `M${x1} ${y1}C${(x1 + x2) / 2} ${y1},${x2} ${(y1 + y2) / 2},${x2} ${y2}` : `M${x1} ${y1}C${x1} ${my},${x2} ${my},${x2} ${y2}`; el('path', { class: 'mx-l ' + kind, d, pathLength: 1 }, gLinks); if (i < 4) { const a = el('text', { class: 'mx-c', x: i === 0 ? x1 + 8 : i === 1 ? x1 - 14 : x1 + (i === 2 ? 6 : 8), y: i < 2 ? y1 - 5 : y1 - 6 }, gLinks); a.textContent = '1'; const b = el('text', { class: 'mx-c', x: x2 + (i === 0 || i === 2 ? -13 : 7), y: y2 + (i < 2 ? -6 : 16) }, gLinks); b.textContent = '*' } });
    /* Marcas */
    const band = el('rect', { class: 'mx-band', x: X0 + 1, y: Y0 + HH + 1, width: flatW - CL.budget - 2, height: RH - 2, rx: 6 }, gMarks);
    const bracket = el('rect', { class: 'mx-brk', x: xs.qty - 2, y: Y0 - 2, width: CL.qty + CL.amount + 4, height: HH + RH * 4 + 4, rx: 10 }, gMarks);
    const budHi = el('rect', { class: 'mx-budhi', x: xs.budget + 1, y: Y0 + HH + 1, width: CL.budget - 2, height: RH * 4 - 2, rx: 7 }, gMarks);
    const pk = el('rect', { class: 'mx-pk', rx: 9 }, gMarks), pkx = el('text', { class: 'mx-pkx', 'text-anchor': 'middle' }, gMarks); pkx.textContent = '✗';
    const PKR = { 1: [xs.budget - 1, Y0 - 1, CL.budget + 2, HH + RH * 4 + 2], 2: [xs.budget - 1, Y0 - 1, CL.budget + 2, HH + RH * 4 + 2], 3: [X0 - 1, Y0 - 1, xs.qty - X0, HH + RH * 4 + 2], 4: [xs.store - 1, Y0 + HH, CL.store + CL.product + CL.category + 2, RH * 4 + 1], 5: [TB.fct_budget.x - 5, TB.fct_budget.y - 5, frames.fct_budget.w + 10, frames.fct_budget.h + 10] };
    const noteOf = (x, y, cls, anchor = 'start') => { const t = el('text', { x, y, class: 'sv-n ' + cls, 'text-anchor': anchor }, gNotes); return t };
    const nBud = noteOf(xs.budget + CL.budget, Y0 + HH + RH * 4 + 24, 'n-bud', 'end'), nRow = noteOf(X0 + 4, Y0 - 12, 'n-row'), nFct = noteOf(xs.qty + (CL.qty + CL.amount) / 2, Y0 - 12, 'n-fct', 'middle'), nGr = noteOf(TB.fct_budget.x + 2, TB.fct_budget.y - 8, 'n-gr'), nPk = noteOf(TB.dim_date.x + 2, TB.dim_date.y + frames.dim_date.h + 15, 'n-pk'), nFk = noteOf(FX + 44, FY - 18 + fh + 15, 'n-fk');
    /* Celdas */
    const cells = [];
    const addCell = (id, col, r, cls, x, y, w, txt) => { const g = el('g', { class: 'mxc ' + cls }, gCells); const b = el('rect', { x: 0, y: -13, width: w, height: 19, rx: 4 }, g); const t = el('text', { x: 5, y: 1 }, g); const o = { id, col, r, g, t, txt, flat: [x, y], w }; cells.push(o); return o };
    /* Cabeceras y celdas de la tabla plana */
    ORDER.forEach(c => { const h = addCell('h:' + c, c, -1, 'hd col-' + c, xs[c], Y0 + 20, CL[c], () => c); for (let r = 0; r < 4; r++) addCell(c + ':' + r, c, r, 'v col-' + c, xs[c], Y0 + HH + RH * r + 28, CL[c], () => c === 'store' ? STORE() : c === 'product' ? P()[r] : c === 'category' ? CAT_()[r] : c === 'customer' ? ['Ana', 'Ana', 'Luis', 'Ana'][r] : FLAT[c][r]) });
    /* Keys que aparecen con el model */
    const KEY_F = { date_key: [1, 1, 2, 3], store_key: [1, 1, 1, 1], prod_key: [1, 2, 1, 3], cust_key: [1, 1, 2, 1] };
    const keys = [];
    for (const c in KEY_F) { const a = addCell('fh:' + c, c, -1, 'hd key fk', fx[c], FY + 11, FC[c], () => c); a.star = [fx[c], FY + 11]; keys.push(a); KEY_F[c].forEach((v, r) => { const b = addCell('f:' + c + r, c, r, 'v key fk', fx[c], FY + FH + FR * r + 13, FC[c], () => String(v)); b.star = [fx[c], FY + FH + FR * r + 13]; keys.push(b) }) }
    const KEY_D = { dim_date: ['date_key', 3], dim_product: ['prod_key', 3], dim_store: ['store_key', 1], dim_customer: ['cust_key', 2] };
    for (const t in KEY_D) { const [c, n] = KEY_D[t], w = TB[t].cols[c]; const [hx, hy] = dimPos(t, c, -1); const a = addCell('dh:' + c, c, -1, 'hd key pk', hx, hy + 13, w, () => c); a.star = [hx, hy + 13]; keys.push(a); for (let r = 0; r < n; r++) { const [x, y] = dimPos(t, c, r); const b = addCell('d:' + c + r, c, r, 'v key pk', x, y + 13, w, () => String(r + 1)); b.star = [x, y + 13]; keys.push(b) } }
    { const [x, y] = dimPos('fct_budget', 'month', -1); const a = addCell('bh:m', 'month', -1, 'hd key bdg', x, y + 13, 46, () => 'month'); a.star = [x, y + 13]; keys.push(a); const b = addCell('bv:m', 'month', 0, 'v key bdg', x, y + FH + 13, 46, () => 'oct'); b.star = [x, y + FH + 13]; keys.push(b); const [x2] = dimPos('fct_budget', 'store_key', -1); const c = addCell('bh:s', 'store_key', -1, 'hd key bdg', x2, y + 13, 64, () => 'store_key'); c.star = [x2, y + 13]; keys.push(c); const e = addCell('bv:s', 'store_key', 0, 'v key bdg', x2, y + FH + 13, 64, () => '1'); e.star = [x2, y + FH + 13]; keys.push(e) }
    const place = (c, x, y, o) => { c.g.style.transform = `translate(${x}px,${y}px)`; c.g.style.opacity = o };
    const texts = () => { cells.forEach(c => c.t.textContent = c.txt()); nBud.textContent = say('$10.000 × 4 = $40.000: se sumó cuatro veces', '$10,000 × 4 = $40,000: summed four times'); nRow.textContent = say('1 fila = 1 línea de boleta', '1 row = 1 receipt line'); nFct.textContent = say('lo que pasó', 'what happened'); nGr.textContent = say('mensual: otro grain', 'monthly: another grain'); nPk.textContent = 'primary key'; nFk.textContent = 'foreign keys' };
    let K = 1, vb = [44, 42, 512, 282], vbT = 0;
    const VB = k => k >= 4 ? [0, 0, 600, 392] : k >= 2 ? [44, 38, 512, 332] : [44, 42, 512, 282];
    function camera2(k) { const to = VB(k), from = vb.slice(); if (from.every((v, i) => v === to[i])) return; cancelAnimationFrame(vbT); if (RM || CAP) { vb = to; svg.setAttribute('viewBox', to.join(' ')); return } const t0 = performance.now(); (function f(t) { const p = Math.min(1, Math.max(0, t - t0) / 720), e = p < .5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2; vb = from.map((a, i) => a + (to[i] - a) * e); svg.setAttribute('viewBox', vb.map(x => x.toFixed(1)).join(' ')); if (p < 1) vbT = requestAnimationFrame(f) })(t0) }
    function draw(k) {
      camera2(k);
      K = k; box.dataset.k = k; svg.setAttribute('class', 'mx-svg k' + k + (k >= 2 ? ' bud' : '') + (k >= 4 ? ' star' : '') + (k >= 5 ? ' rel' : '') + (k >= 6 ? ' meas' : '')); flatFrame.style.width = (k >= 2 ? flatW - CL.budget : flatW) + 'px'; flatHead.style.width = (k >= 2 ? flatW - CL.budget : flatW) + 'px';
      const star = k >= 4;
      cells.forEach(c => {
        const col = c.col, cid = c.id;
        if (c.star) { /* keys: solo en el model */ place(c, c.star[0], c.star[1], (star && !cid.startsWith('b')) || (k >= 2 && cid.startsWith('b')) ? 1 : 0); return }
        if (col === 'budget') { /* El budget sale de la tabla en el paso 2 */
          if (k >= 2) { const [bx, by] = dimPos('fct_budget', 'budget', c.r); place(c, bx, c.r <= 0 ? by + 13 : by + 13, c.r <= 0 ? 1 : 0); }
          else place(c, c.flat[0], c.flat[1], 1); return }
        if (col === 'qty' || col === 'amount') { if (star) place(c, fx[col], c.r < 0 ? FY + 11 : FY + FH + FR * c.r + 13, 1); else place(c, c.flat[0], c.flat[1], 1); return }
        /* Contexto */
        if (star) { const t = TOF[col], rr = c.r < 0 ? -1 : DEDUP[col][c.r]; const first = c.r < 0 || Object.keys(DEDUP[col]).find(q => DEDUP[col][q] === rr) == c.r; const [x, y] = dimPos(t, col, rr); place(c, x, y + 13, first ? 1 : 0) }
        else place(c, c.flat[0], c.flat[1], k === 3 ? .34 : 1);
      });
      kpi.dataset.v = k >= 6 ? 1 : 0; kpi.dataset.k = k;
      $('.mk-bud', kpi).textContent = k >= 5 ? say('$10.000', '$10,000') : say('$40.000', '$40,000');
      const nEl = $('.mk-n', kpi), to = k >= 5 ? 80 : 20; if (nEl._v !== to) { const from = nEl._v || 20; nEl._v = to; if (RM || CAP) nEl.textContent = say(to + ' %', to + '%'); else { const t0 = performance.now(); (function f(t) { const p = Math.min(1, (t - t0) / 650), v = Math.round(from + (to - from) * p); nEl.textContent = say(v + ' %', v + '%'); if (p < 1) requestAnimationFrame(f) })(t0) } } else nEl.textContent = say(to + ' %', to + '%');
    }
    texts(); draw(1);
    document.addEventListener('langchange', () => { texts(); draw(K) });
    /* Primero se marca el problema, después la X y al final cambia el dibujo */
    let prevK = 0, tA = 0, tB = 0, pendK = 0;
    function setPk(k) { const r = PKR[k]; box.dataset.pk = k; pk.style.display = pkx.style.display = r ? '' : 'none'; if (r) { ['x', 'y', 'width', 'height'].forEach((a, i) => pk.setAttribute(a, r[i])); pkx.setAttribute('x', r[0] + r[2] - 2); pkx.setAttribute('y', r[1] + 6) } }
    function stepTo(k) {
      clearTimeout(tA); clearTimeout(tB); if (pendK) { draw(pendK); pendK = 0 }
      const fwd = k > prevK; prevK = k;
      if (!fwd || !liveSeq()) { box.dataset.ph = 3; draw(k); return }
      setPk(k); box.dataset.ph = 1; pendK = k;
      tA = setTimeout(() => { box.dataset.ph = 2 }, 1050);
      tB = setTimeout(() => { box.dataset.ph = 3; pendK = 0; draw(k) }, 1900);
    }
    document.addEventListener('slidechange', e => { if (slides[e.detail.sl] === sl) stepTo(e.detail.step); else { clearTimeout(tA); clearTimeout(tB); if (pendK) { draw(pendK); pendK = 0 } box.dataset.ph = 3; prevK = 0 } });
    $$('.mx-b', box).forEach(b => b.addEventListener('click', () => { const k = +b.dataset.k; if (deck) { const p = posOf(sl, k); if (p >= 0) go(p, true) } else { $$('[data-st]', box).forEach(l => l.classList.toggle('on', +l.dataset.st === k)); draw(k) } }));
  });

  /* ── Árboles de decisión: cámara, mapa siempre a la vista y entregables ── */
  const SiNo = [() => say('Sí', 'Yes'), () => 'No'];
  const TREES = {
    /* Modelar: 6 preguntas, 16 modelos posibles y 2 ramas que terminan antes */
    model: {
      q: 6, halfW: 740,
      dxs: [[-70, 400], [70, -400], [-380, 380], [-200, 200], [-105, 105], [-55, 55]],
      exitOf: (lv, a) => a === 2 && lv === 0 ? 'e1' : a === 2 && lv === 1 ? 'e2' : null,
      labels: {
        1: [() => say('Sí: armo un modelo', 'Yes: I build a model'), () => say('No: una ad-hoc query', 'No: an ad-hoc query')],
        2: [() => say('Sí: sigo', 'Yes: I go on'), () => say('No: vuelvo a Revisar', 'No: back to Review')],
        3: [() => say('Sí: marts en BigQuery', 'Yes: marts in BigQuery'), () => say('No: Python carga a BigQuery', 'No: Python loads to BigQuery')],
        4: [() => say('Uno: star schema', 'One: star schema'), () => say('Varios: galaxy schema', 'Several: galaxy schema')],
        5: [() => say('Sí: una dim_date', 'Yes: one dim_date'), () => say('No: shrunken dimension', 'No: shrunken dimension')],
        6: [() => say('Sí: measures con SUM', 'Yes: SUM measures'), () => say('No: DIVIDE y último valor', 'No: DIVIDE and last value')]
      },
      opts: { 1: SiNo, 2: SiNo, 3: SiNo, 4: [() => say('Uno', 'One'), () => say('Varios', 'Several')], 5: SiNo, 6: SiNo },
      exitName: { e1: () => 'Ad-hoc query', e2: () => say('Nota de datos', 'Data note') },
      result: ans => ans[4] === 2 ? 'Galaxy schema' : 'Star schema',
      badge: (st, val) => st === 'e1' ? 'Ad-hoc query' : st === 'e2' ? say('Nota de datos', 'Data note') : val(3) ? (val(3) === 2 ? 'Python + BigQuery' : 'BigQuery · marts') : '',
      paint(v, st, val) {
        const stop = !!st;
        v.classList.toggle('a1', val(1) === 1); v.classList.toggle('a2', val(2) === 1);
        v.classList.toggle('a4', !stop && !!val(4)); v.classList.toggle('gal', !stop && val(4) === 2); v.classList.toggle('shr', !stop && val(5) === 2); v.classList.toggle('a6s', !stop && val(6) === 1); v.classList.toggle('a6d', !stop && val(6) === 2);
      },
      sum: ans => (ans[4] === 2 ? 'Galaxy schema' : 'Star schema') + (ans[5] === 2 ? ' + shrunken dimension' : '') + say(' en ', ' in ') + (ans[3] === 2 ? say('BigQuery, cargado con Python', 'BigQuery, loaded with Python') : 'BigQuery') + say(', con measures ', ', with ') + (ans[6] === 2 ? 'DIVIDE' : 'SUM') + (L() === 'en' ? ' measures.' : '.'),
      del: ans => [ans[3] === 2 ? say('Script en Python + marts', 'Python script + marts') : say('Marts en BigQuery', 'Marts in BigQuery'), (ans[4] === 2 ? 'Galaxy schema' : 'Star schema') + say(' en Power BI', ' in Power BI'), ans[5] === 2 ? 'dim_date + shrunken dimension' : 'dim_date', (ans[6] === 2 ? 'DIVIDE · ' + say('último valor', 'last value') : 'SUM') + ' · measures', say('Nota de datos', 'Data note')]
    },
    /* Definir: cada «No» es otra solución; solo 2 de las 8 salidas son un dashboard */
    define: {
      q: 7, halfW: 470,
      dxs: [[-50, 430], [90, -430], [-90, 430], [90, -430], [-90, 430], [90, -430], [-210, 210]],
      exitOf: (lv, a) => a === 2 && lv < 6 ? 'e' + (lv + 1) : null,
      labels: {
        1: [() => say('Sí: hay dueño y ritmo', 'Yes: owner and rhythm'), () => say('No: un análisis', 'No: an analysis')],
        2: [() => say('Sí: se puede conectar', 'Yes: it can be connected'), () => say('No: primero el dato', 'No: data first')],
        3: [() => say('Sí: hay una decisión', 'Yes: there’s a decision'), () => say('No: una alerta', 'No: an alert')],
        4: [() => say('Sí: mira una persona', 'Yes: a person looks'), () => say('No: un modelo', 'No: a model')],
        5: [() => say('Sí: hay cifra oficial', 'Yes: there’s one figure'), () => say('No: primero definiciones', 'No: definitions first')],
        6: [() => say('Sí: lo van a mirar', 'Yes: they’ll look at it'), () => say('No: Excel conectado', 'No: connected Excel')],
        7: [() => say('Ninguna: al diseño', 'None: on to design'), () => say('Alguna: queda escrita', 'Some: in writing')]
      },
      opts: { 1: SiNo, 2: SiNo, 3: SiNo, 4: SiNo, 5: SiNo, 6: SiNo, 7: [() => say('Ninguna', 'None'), () => say('Alguna', 'Some')] },
      exitName: { e1: () => say('Análisis escrito', 'Written analysis'), e2: () => say('Proyecto de datos', 'Data project'), e3: () => say('Alerta', 'Alert'), e4: () => say('Modelo predictivo', 'Predictive model'), e5: () => say('Diccionario', 'Dictionary'), e6: () => say('Excel conectado', 'Connected Excel') },
      result: ans => ans[7] === 2 ? say('Sí, pero: dashboard', 'Yes, but: dashboard') : say('Sí: dashboard', 'Yes: dashboard'),
      badge: (st, val) => st ? TREES.define.exitName[st]() : '',
      paint(v, st, val) {
        /* Cada «Sí» descarta una solución: al final solo queda el dashboard */
        $$('.df-c li', v).forEach(li => { const n = +li.dataset.c; if (!n) { li.classList.toggle('win', !st && !!val(6)); return } li.classList.toggle('out', val(n) === 1); li.classList.toggle('here', val(n) === 2) });
      },
      sum: ans => ans[7] === 2 ? say('Es un dashboard, con condiciones escritas en la ficha.', 'It’s a dashboard, with conditions written in the brief.') : say('Es un dashboard. Se pasa directo al diseño.', 'It’s a dashboard. On to design.'),
      del: ans => [say('Ficha del pedido firmada', 'Signed brief'), say('Dueño y ritmo', 'Owner and rhythm'), say('Éxito a 90 días', '90-day success')].concat(ans[7] === 2 ? [say('Condiciones por escrito', 'Written conditions')] : [])
    }
  };
  $$('.ptree').forEach(tr => {
    const cfg = TREES[tr.dataset.tree || 'model'], Q = cfg.q, LABEL = cfg.labels, OPT = cfg.opts;
    const cv = $('.tcanvas', tr), world = $('.tworld', tr), lines = $('.tlines', tr), panel = $('.tpanel', tr), sl = tr.closest('.slide'), NS = 'http://www.w3.org/2000/svg';
    const qs = $$('.tq[data-q]', tr), xs_ = {}; $$('.tq[data-x]', tr).forEach(c => xs_[c.dataset.x] = c);
    const bar = $('.tbar', tr), toastEl = $('.ttoast', tr), mapBox = $('.tm-box', tr), mapSvg = $('.tm', tr), rowsEl = $('.tm-rows', tr);
    const STEP = 560, ROOT = [1000, 150], DXS = cfg.dxs;
    const nodes = {}, edges = [], NODEX = {}, EXQ = {};
    (function grow(path, x, y, lv) {
      nodes[path] = { x, y, lv, path };
      if (lv >= Q) return;
      [1, 2].forEach(a => {
        const cp = path + a, ex = cfg.exitOf(lv, a), nx = x + DXS[lv][a - 1], ny = y + (ex ? STEP * .86 : STEP);
        edges.push({ from: path, to: cp, lv, x1: x, y1: y, x2: nx, y2: ny, ex });
        if (ex) { nodes[cp] = { x: nx, y: ny, lv: lv + 1, path: cp, ex }; NODEX[ex] = cp; EXQ[ex] = lv + 1 } else grow(cp, nx, ny, lv + 1);
      });
    })('', ROOT[0], ROOT[1], 0);
    /* El mundo grande: ramas, ramas encendidas y flores */
    const WW = 2000, WH = ROOT[1] + STEP * Q + 220; lines.setAttribute('viewBox', `0 0 ${WW} ${WH}`); lines.setAttribute('width', WW); lines.setAttribute('height', WH); world.style.width = WW + 'px'; world.style.height = WH + 'px';
    const el = (n, a, p) => { const e = document.createElementNS(NS, n); for (const q in a) e.setAttribute(q, a[q]); (p || lines).appendChild(e); return e };
    const WID = [17, 15, 13, 11, 9, 7, 6];
    const curve = e => { const dy = e.y2 - e.y1; return `M${e.x1} ${e.y1}C${e.x1} ${e.y1 + dy * .62},${e.x2} ${e.y2 - dy * .42},${e.x2} ${e.y2}` };
    el('path', { d: `M${ROOT[0]} ${ROOT[1] - 300}L${ROOT[0]} ${ROOT[1]}`, class: 'tb root', 'stroke-width': 22 });
    edges.forEach(e => { e.b = el('path', { d: curve(e), class: 'tb', 'stroke-width': WID[e.lv] }) });
    edges.forEach(e => { e.p = el('path', { d: curve(e), class: 'tp', 'stroke-width': WID[e.lv] + 3, pathLength: 1 }); e.p.style.strokeDasharray = 1; e.p.style.strokeDashoffset = 1 });
    const FLR = {}; Object.values(nodes).forEach(n => { const leaf = n.lv === Q || n.ex; const g = el('g', { class: 'tf' + (leaf ? ' leaf' : ''), transform: `translate(${n.x} ${n.y})` }); el('circle', { r: 56, class: 'hit' }, g); el('circle', { r: leaf ? 15 : 12, class: 'bud' }, g); el('circle', { r: 66, class: 'halo' }, g); const u = document.createElementNS(NS, 'use'); u.setAttribute('href', '#skb'); u.setAttribute('class', 'bl'); g.appendChild(u); g.addEventListener('click', () => { if (overview) goNode(n.path) }); FLR[n.path] = g });
    /* Estado */
    const ans = {}; let k = 1, exit = null, overview = false, busy = false, prev = null, fT = 0, tT = 0, answered = false, exitOn = null;
    const pathOf = upto => { let p = ''; for (let i = 1; i <= upto; i++) p += ans[i] || 1; return p };
    /* ── El mapa: el árbol completo, chico, siempre a la vista ── */
    const LVH = Q + 1; const M = { W: 0, H: 0, edges: [], nodes: {}, lab: [] };
    function buildMap() {
      const W = mapBox.clientWidth, H = rowsEl.clientHeight; if (!W || !H) return false; if (W === M.W && H === M.H) return true;
      M.W = W; M.H = H; mapSvg.setAttribute('viewBox', `0 0 ${W} ${H}`); mapSvg.setAttribute('width', W); mapSvg.setAttribute('height', H); mapSvg.innerHTML = ''; M.edges = []; M.nodes = {};
      const rh = H / LVH, X = n => W / 2 + (n.x - 1000) / cfg.halfW * (W / 2 - 6), Y = n => (n.lv + .5) * rh, wd = [3, 2.7, 2.4, 2.1, 1.8, 1.4, 1.2];
      const mc = e => { const a = nodes[e.from], b = nodes[e.to], x1 = X(a), y1 = Y(a), x2 = X(b), y2 = Y(b), dy = y2 - y1; return `M${x1.toFixed(1)} ${y1.toFixed(1)}C${x1.toFixed(1)} ${(y1 + dy * .6).toFixed(1)},${x2.toFixed(1)} ${(y2 - dy * .4).toFixed(1)},${x2.toFixed(1)} ${y2.toFixed(1)}` };
      el('path', { d: `M${W / 2} 0L${W / 2} ${rh * .5}`, class: 'mb root', 'stroke-width': 3.4 }, mapSvg);
      edges.forEach(e => { M.edges.push({ e, b: el('path', { d: mc(e), class: 'mb', 'stroke-width': wd[e.lv] }, mapSvg), p: null }) });
      M.edges.forEach(o => { o.p = el('path', { d: mc(o.e), class: 'mp', 'stroke-width': wd[o.e.lv] + 1.3, pathLength: 1 }, mapSvg); o.p.style.strokeDasharray = 1; o.p.style.strokeDashoffset = 1 });
      Object.values(nodes).forEach(n => { const x = X(n), y = Y(n), leaf = n.lv === Q && Q === 6, g = el('g', { class: 'mn' + (n.ex ? ' ex' : '') + (leaf ? ' leaf' : ''), transform: `translate(${x.toFixed(1)} ${y.toFixed(1)})` }, mapSvg);
        el('circle', { r: leaf ? 5 : Math.min(13, rh * .46), class: 'hit' }, g); el('circle', { r: 9.5, class: 'halo' }, g);
        if (n.ex) el('rect', { x: -3.6, y: -3.6, width: 7.2, height: 7.2, rx: 1.6, class: 'dot sq' }, g); else el('circle', { r: leaf ? 1.5 : 2.5, class: 'dot' }, g);
        const u = document.createElementNS(NS, 'use'); u.setAttribute('href', '#skb'); u.setAttribute('class', 'fl'); g.appendChild(u);
        const ti = document.createElementNS(NS, 'title'); g.appendChild(ti); g._t = ti; g._n = n;
        g.addEventListener('click', () => goNode(n.path)); M.nodes[n.path] = g });
      M.lab = [el('text', { class: 'ml', 'text-anchor': 'end' }, mapSvg), el('text', { class: 'ml', 'text-anchor': 'start' }, mapSvg)];
      M.X = X; M.Y = Y; return true;
    }
    const leafPath = () => { const lim = overview ? Q : exit ? k : k - 1; let p = ''; for (let i = 1; i <= lim; i++) { p += ans[i] || 1; if (nodes[p] && nodes[p].ex) break } return p };
    function paintMap() {
      if (!buildMap()) return; const lp = leafPath(), hov = prev ? pathOf(prev.q - 1) + prev.a : '';
      M.edges.forEach(o => { const on = lp.startsWith(o.e.to), near = o.e.from === lp && !overview && !exit; o.p.style.strokeDashoffset = on ? 0 : 1; o.b.classList.toggle('near', near); o.b.classList.toggle('pv', !!hov && o.e.to === hov) });
      for (const p in M.nodes) { const g = M.nodes[p], on = lp.startsWith(p), cur = p === lp; g.classList.toggle('on', on); g.classList.toggle('cur', cur); g.classList.toggle('nxt', !overview && !exit && p.length === lp.length + 1 && p.startsWith(lp));
        const n = g._n; g._t.textContent = n.ex ? cfg.exitName[n.ex]() : n.lv >= Q ? say('Ver este resultado', 'See this result') : say('Ir a esta pregunta', 'Go to this question') }
      /* Hacia dónde puedes ir: el nombre de cada opción, junto a su rama */
      const showLab = !overview && !exit && k <= Q;
      M.lab.forEach((t, i) => { const a = i + 1, n = nodes[lp + a]; if (!showLab || !n) { t.style.opacity = 0; return } const x = M.X(n), y = M.Y(n), left = x < M.X(nodes[lp]) || (x === M.X(nodes[lp]) && i === 0); t.setAttribute('text-anchor', left ? 'end' : 'start'); t.setAttribute('x', (x + (left ? -7 : 7)).toFixed(1)); t.setAttribute('y', (y + 3.5).toFixed(1)); t.textContent = OPT[k][i](); t.style.opacity = 1 });
    }
    /* ── El panel ── */
    function paintPanel() {
      const v = panel, val = n => prev && prev.q === n ? prev.a : (overview || n < k) ? (ans[n] || 1) : 0;
      const pvx = prev ? cfg.exitOf(prev.q - 1, prev.a) : null, st = exit || pvx;
      Object.keys(EXQ).forEach(id => v.classList.toggle('st-' + id, st === id)); v.classList.toggle('hasx', !!st); v.classList.toggle('res', overview);
      cfg.paint(v, st, val);
      $('.tp-w', v).textContent = cfg.badge(st, val);
      $('.tp-t2', v).textContent = st || overview ? say('Lo que te entrego', 'What I hand over') : say('Lo que va quedando', 'What’s taking shape');
      const note = $('.tm-note', v); note.hidden = !exit; if (exit) note.style.gridRow = `${k + 1} / ${Q + 1}`;
      $$('.tm-rows li[data-r]', v).forEach(li => { const n = +li.dataset.r, b = $('[data-rv]', li); li.style.gridRow = exit ? n : '';
        if (n === Q + 1) { li.classList.toggle('cur', overview); li.classList.toggle('ex', !!exit); b.textContent = exit ? cfg.exitName[exit]() : overview ? cfg.result(ans) : say(`Al final de las ${Q}`, `After all ${Q}`); return }
        const skip = !!exit && n > k, isEx = !!exit && n === k, w = isEx ? 2 : skip ? 0 : val(n), cur = !overview && !exit && n === k;
        li.classList.toggle('cur', cur); li.classList.toggle('ex', isEx); li.classList.toggle('has', !!w); li.classList.toggle('sk0', skip); li.classList.toggle('pv', !!(prev && prev.q === n));
        b.textContent = w ? LABEL[n][w - 1]() : skip ? say('Ya no hace falta', 'Not needed') : cur ? say('Se decide ahora', 'Deciding now') : say('Por decidir', 'To decide') });
      $('.tp-sum', v).textContent = overview ? cfg.sum(ans) : '';
      if (overview) $('.tp-del', v).innerHTML = cfg.del(ans).map(x => `<li>${x}</li>`).join('');
      paintMap();
    }
    function paintBar() {
      $('.tb-n', bar).textContent = overview ? say('Resultado', 'Result') : exit ? say('Fin de la rama', 'End of branch') : say(`Pregunta ${Math.min(k, Q)} de ${Q}`, `Question ${Math.min(k, Q)} of ${Q}`);
      const started = k > 1 || !!exit || overview; $('[data-nav="back"]', bar).hidden = !started; $('[data-nav="reset"]', bar).hidden = !started;
    }
    function paint() {
      const lp = leafPath();
      edges.forEach(e => { const on = lp.startsWith(e.to), near = e.from === lp; e.p.style.strokeDashoffset = on ? 0 : 1; e.b.classList.toggle('near', near && !overview && !exit); e.b.classList.toggle('dim', !on && !near && !lp.startsWith(e.from)) });
      Object.keys(FLR).forEach(p => { const on = lp.startsWith(p); FLR[p].classList.toggle('on', on); FLR[p].classList.toggle('cur', p === lp) });
      qs.forEach(q => q.classList.remove('on')); Object.values(xs_).forEach(x => x.classList.remove('on'));
      if (exit) { const c = xs_[exit], n = nodes[NODEX[exit]]; c.style.left = n.x + 'px'; c.style.top = n.y + 'px'; c.classList.add('on') }
      else if (!overview) { const q = qs[k - 1], n = nodes[pathOf(k - 1)]; q.style.left = n.x + 'px'; q.style.top = n.y + 'px'; q.classList.add('on'); $$('.tq-o', q).forEach(b => { b.classList.toggle('sel', +b.dataset.a === ans[k]); b.classList.remove('flash') }) }
      camera_(); paintBar(); paintPanel();
    }
    /* Cámara: se acerca a medida que respondes */
    function camera_(instant) {
      const W = cv.clientWidth, H0 = cv.clientHeight; if (!W || !H0) return;
      const top = bar.offsetHeight, H = H0 - top;
      const cards = qs.concat(Object.values(xs_)), maxH = Math.max(...cards.map(c => c.offsetHeight || 0), 300) + 34;
      const sMax = Math.min(W / 660, H / (maxH + 36));
      let s, x, y;
      if (overview) { s = Math.min(W / (WW - 160), H / (WH - 40)); x = WW / 2; y = WH / 2 - 60 }
      else if (exit) { const n = nodes[NODEX[exit]], c = xs_[exit]; s = sMax * .92; x = n.x; y = n.y + (c.offsetHeight + 34) / 2 }
      else { const n = nodes[pathOf(k - 1)], c = qs[k - 1], t = (k - 1) / (Q - 1); s = sMax * (W < 620 ? .94 + .06 * t : .72 + .28 * t); x = n.x; y = n.y + (c.offsetHeight + 34) / 2 }
      if (instant) { world.style.transition = 'none'; world.offsetWidth; requestAnimationFrame(() => requestAnimationFrame(() => world.style.transition = '')) }
      world.style.transform = `translate(${(W / 2 - x * s).toFixed(1)}px,${(top + H / 2 - y * s).toFixed(1)}px) scale(${s.toFixed(4)})`;
      cv.classList.toggle('far', overview);
    }
    function toast(txt) { if (CAP) return; clearTimeout(tT); toastEl.textContent = txt; toastEl.classList.add('on'); tT = setTimeout(() => toastEl.classList.remove('on'), 2300) }
    const here = () => { const p = positions[cur]; return p && slides[p.sl] === sl ? p.step : 0 };
    function goStep(n, quick) { if (!deck) return setK(n); const p = posOf(sl, n); if (p < 0 || !here()) return; if (here() === n) return setK(n); if (locked) { setTimeout(() => goStep(n, quick), 90); return } go(p, quick) }
    /* Volver a cualquier punto del mapa */
    function goNode(path) {
      clearTimeout(fT); busy = false; prev = null; const n = nodes[path]; for (const i in ans) delete ans[i]; [...path].forEach((a, i) => ans[i + 1] = +a); answered = true;
      if (n.ex) { const q = n.lv; if (deck && here() !== q) { exitOn = n.ex; goStep(q, true); return } answered = false; exit = n.ex; k = q; overview = false; paint(); return }
      goStep(n.lv >= Q ? Q + 1 : n.lv + 1, true);
    }
    function finish(n) {
      const wasOver = overview; exit = exitOn; exitOn = null; prev = null; overview = n > Q; k = Math.min(n, Q); if (overview && !wasOver) Cat.react('win');
      const lim = overview ? Q : k - 1; for (let i = 1; i <= lim; i++) { if (!ans[i]) ans[i] = 1; if (cfg.exitOf(i - 1, ans[i])) ans[i] = 1 }
      paint();
    }
    function setK(n) { /* Llegar a una pregunta: lo anterior queda respondido y en una rama viva */
      clearTimeout(fT); busy = false;
      const from = k, wasEx = exit, wasOv = overview, click = answered; answered = false;
      /* Bajar con la rueda también responde: se ve qué quedó elegido antes de seguir */
      if (!click && !exitOn && n === from + 1 && !wasOv && !CAP && !RM) {
        const a = !cfg.exitOf(from - 1, 2) && ans[from] === 2 ? 2 : 1; ans[from] = a; const lab = OPT[from][a - 1]();
        if (wasEx) { exit = null; toast(say(`Seguimos por «${lab}»`, `Going on with “${lab}”`)); finish(n); return }
        const q = qs[from - 1], b = $(`.tq-o[data-a="${a}"]`, q); $$('.tq-o', q).forEach(x => x.classList.toggle('sel', x === b)); b.classList.add('flash'); toast(say(`Al bajar elegiste «${lab}». En el mapa puedes volver.`, `Scrolling picked “${lab}”. You can go back on the map.`));
        k = n; overview = false; exit = null; paintBar(); paintPanel(); /* el panel y el mapa cambian de inmediato */
        k = from; fT = setTimeout(() => { b.classList.remove('flash'); finish(n) }, 460); return;
      }
      finish(n);
    }
    function answer(q, a, btn) {
      if (busy) return; busy = true; clearTimeout(fT); ans[q] = a; prev = null; $$('.tq-o', qs[q - 1]).forEach(x => x.classList.toggle('sel', x === btn)); btn.classList.add('flash');
      fT = setTimeout(() => { busy = false; btn.classList.remove('flash'); const ex = cfg.exitOf(q - 1, a);
        if (ex) { exit = ex; k = q; overview = false; paint(); Cat.react('no'); return }
        Cat.react('hop'); answered = true; goStep(q + 1, true);
      }, RM || CAP ? 0 : 320);
    }
    qs.forEach(q => { const n = +q.dataset.q; $$('.tq-o', q).forEach(b => { b.addEventListener('click', () => answer(n, +b.dataset.a, b)); if (FINE) { b.addEventListener('pointerenter', () => { prev = { q: n, a: +b.dataset.a }; paintPanel() }); b.addEventListener('pointerleave', () => { prev = null; paintPanel() }) } }) });
    /* Salidas de una rama y botones de la barra */
    const resetAll = () => { clearTimeout(fT); for (const i in ans) delete ans[i]; prev = null; exit = null; answered = true; goStep(1) };
    $$('.tq-back', tr).forEach(b => b.addEventListener('click', () => { const w = b.dataset.back; if (EXQ[w]) { ans[EXQ[w]] = 1; answered = true; goStep(EXQ[w] + 1, true) } else resetAll() }));
    $$('[data-nav]', bar).forEach(b => b.addEventListener('click', () => { const w = b.dataset.nav;
      if (w === 'reset') return resetAll();
      if (w === 'skip') { if (deck) { const p = posOf(sl, Q + 1); go(p + 1) } else { const nx = sl.nextElementSibling; if (nx) nx.scrollIntoView({ behavior: RM ? 'auto' : 'smooth' }) } return }
      answered = true; if (exit) { const q = k; delete ans[q]; exit = null; paint(); answered = false; return } goStep(overview ? Q : k - 1, true) }));
    $$('[data-goq]', tr).forEach(b => b.addEventListener('click', () => { answered = true; prev = null; exitOn = null; goStep(+b.dataset.goq, true) }));
    document.addEventListener('slidechange', e => { if (slides[e.detail.sl] === sl) { if (e.detail.first) answered = true; setK(e.detail.step); if (e.detail.first) camera_(true) } });
    document.addEventListener('langchange', () => paint());
    addEventListener('resize', () => { camera_(true); paintMap() });
    (document.fonts ? document.fonts.ready : Promise.resolve()).then(() => { camera_(true); paintMap() });
    answered = true; setK(1); camera_(true);
  });

  /* ── Definir: un pedido se convierte en una decisión, en cuatro casos ── */
  $$('.dm2').forEach(box => {
    const sl = box.closest('.slide'), bs = $$('[data-case]', box), pN = $('.rc-p', box), vN = $('.rc-v', box), us = $$('[data-u]', box);
    const K = [[8, 60], [6, 44], [5, 32], [4, 20], [4, 20], [3, 12]];
    let C = 0, cur = 1, prev = 0, tA = 0, tB = 0, shown = [8, 60];
    const count = (el, a, b) => { if (RM || CAP || a === b) { el.textContent = b; return } const t0 = performance.now(); (function f(t) { const p = Math.min(1, Math.max(0, t - t0) / 520); el.textContent = Math.round(a + (b - a) * p); if (p < 1) requestAnimationFrame(f) })(t0) };
    function paint(k) {
      const [p, v] = K[Math.max(0, k - 1)]; count(pN, shown[0], p); count(vN, shown[1], v); shown = [p, v]; box.dataset.k = k;
      us.forEach(u => u.classList.toggle('on', k >= 6 ? u.dataset.u === 'l' + C : +u.dataset.u === k - 1 && !u.dataset.u.startsWith('l')));
      $$('.rc-c[data-c="' + C + '"] .rt', box).forEach(t => t.classList.toggle('x', +t.dataset.x > 0 && k >= +t.dataset.x));
      $$('.rc-c[data-c="' + C + '"] .fi-r', box).forEach(r => r.classList.toggle('on', +r.dataset.f <= k));
    }
    function seq(k, anim) {
      clearTimeout(tA); clearTimeout(tB); cur = k; box.dataset.cur = C;
      $$('.rc-c', box).forEach(c => c.classList.toggle('on', +c.dataset.c === C)); bs.forEach(b => b.classList.toggle('on', +b.dataset.case === C));
      if (!anim || !liveSeq()) { box.dataset.ph = 3; paint(k); return }
      paint(k - 1); box.dataset.ph = 1;
      tA = setTimeout(() => { box.dataset.ph = 2 }, 1000);
      tB = setTimeout(() => { box.dataset.ph = 3; paint(k) }, 2500);
    }
    bs.forEach(b => b.addEventListener('click', () => { C = +b.dataset.case; seq(cur, true) }));
    document.addEventListener('langchange', () => paint(cur));
    document.addEventListener('slidechange', e => { if (slides[e.detail.sl] === sl) { const k = e.detail.step, fwd = k > prev; prev = k; seq(k, fwd) } else { clearTimeout(tA); clearTimeout(tB); box.dataset.ph = 3; prev = 0 } });
    $$('.mx-b', box).forEach(b => b.addEventListener('click', () => { const k = +b.dataset.k; if (deck) { const p = posOf(sl, k); if (p >= 0) go(p, true) } else { $$('[data-st]', box).forEach(l => l.classList.toggle('on', +l.dataset.st === k)); seq(k, false) } }));
    paint(1);
    $$('.rc-s', box).forEach(r => r.addEventListener('click', () => { if (r.classList.contains('on')) return; const b = $('.mx-b[data-k="' + r.dataset.st + '"]', box); if (b) b.click() }));
  });

  /* ── 40 modelos: una tarjeta con ejemplo por cada término ── */
  $$('.m4').forEach(box => {
    const rows = $$('.m4r', box), sl = box.closest('.slide'); let i = -1, t = 0, touched = false, pass = 0;
    const open = n => { i = n; rows.forEach((r, k) => { r.classList.toggle('open', k === n); $('.m4n', r).setAttribute('aria-expanded', k === n) }) };
    /* Una sola pasada sola, para que se note que existen */
    const loop = () => { clearTimeout(t); if (RM || CAP || touched) return; t = setTimeout(() => { if (!sl.classList.contains('active')) return; if (pass >= rows.length) return open(-1); open(pass++); loop() }, pass ? 2600 : 1300) };
    rows.forEach((r, k) => { const b = $('.m4n', r); b.addEventListener('click', () => { touched = true; clearTimeout(t); open(i === k ? -1 : k) }); if (FINE) b.addEventListener('pointerenter', () => { touched = true; clearTimeout(t); open(k) }) });
    if (FINE) box.addEventListener('pointerleave', () => { if (touched) open(-1) });
    document.addEventListener('slidechange', e => { clearTimeout(t); open(-1); if (slides[e.detail.sl] === sl) { touched = false; pass = 0; loop() } });
  });

  /* ── El cierre de cada fase: se celebra cuando llegas ── */
  $$('.fin').forEach(f => { const sl = f.closest('.slide'), set = () => { f.classList.remove('go'); f.offsetWidth; f.classList.add('go'); setTimeout(() => Cat.react('win'), 900) }; document.addEventListener('slidechange', e => { if (slides[e.detail.sl] === sl) set() }); if (!deck) f.classList.add('go') });

  /* ── Contacto: ejemplos que van cambiando ── */

  /* ═══════════ Foco: se oscurece lo demás y solo una línea rosada se mueve ═══════════ */
  const Focus = (() => {
    const ITEMS = '.pain,.phase,.case,.ep,.notes li,.fig,.next,.summary,.done-card,.qs>li,.scale>div,.five>div,.titles>div,.layers>div,.ladder>div,.postal,.faq,.kit-note,.card,.adc';
    const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
    /* Título y subtítulo: siempre iluminados, con una luz suave detrás */
    slides.forEach(sl => {
      const a = $('.sec-head', sl) || $('.hero-left', sl); if (a) { a.classList.add('msg'); return }
      if (sl.classList.contains('contact-band')) { [$('.ct-grid h2', sl), $('.ct-grid .say', sl)].forEach(x => x && x.classList.add('msg')); return }
      const h = $('h1', sl) || $('h2', sl) || $('h3', sl); if (!h || h.closest(ITEMS)) return;
      if (h.parentElement.matches('.wrap,.slide')) { h.classList.add('msg'); const l = $('.lead', sl); if (l) l.classList.add('msg') } else h.parentElement.classList.add('msg');
    });
    if (!deck || P.get('fx') === '0') return { tick() {}, enter() {}, leave() {} };
    const shadeEl = document.createElement('div'); shadeEl.id = 'shade'; shadeEl.setAttribute('aria-hidden', 'true'); $('#veil').after(shadeEl); root.classList.add('fx-on');
    const t = document.createElement('template'); t.innerHTML = '<svg id="fx-line" aria-hidden="true"><g class="ring" opacity="0"><rect class="c3" pathLength="1"/><rect class="c2" pathLength="1"/><rect class="c1" pathLength="1"/></g></svg>';
    const svg = t.content.firstElementChild, mainEl = $('main'); mainEl.parentNode.insertBefore(svg, mainEl.nextSibling);
    const ring = $('.ring', svg), rects = $$('rect', svg);
    const L_ = { sel: null, el: null, x: 0, y: 0, w: 0, h: 0, r: 14, tx: 0, ty: 0, tw: 0, th: 0, tr: 14, v: 0, vT: 0, born: true };
    let active = null, plan = [], timer = 0, hoverEl = null, hoverT = 0, leaveT = 0, last = 0, fast = false;
    const shown = el => el && el.getClientRects().length > 0;
    const res = s => typeof s === 'string' ? $(s, active || document) : s;
    const radius = new WeakMap();
    function radOf(el) { if (!radius.has(el)) radius.set(el, parseFloat(getComputedStyle(el).borderTopLeftRadius) || 8); return clamp(radius.get(el), 8, 26) }
    function itemsOf(sl) { const all = $$(ITEMS, sl).filter(shown); return all.filter(e => !all.some(o => o !== e && o.contains(e))) }
    /* Cuánto puede crecer sin tocar a sus vecinos: se mide el espacio libre real */
    const growCache = new WeakMap();
    const BLOCK = '.sec-label,h1,h2,.lead,.more,.qr-hint,.filters,.stage,.ph-card,.board,.dash,.kit-note,.chips,.pillars,.prevnext,.status,.actions,.ph-tabs,.crumb';
    function layoutBox(el, top) { let x = 0, y = 0, n = el; while (n && n !== top) { x += n.offsetLeft; y += n.offsetTop; n = n.offsetParent } return { l: x, t: y, r: x + el.offsetWidth, b: y + el.offsetHeight, w: el.offsetWidth, h: el.offsetHeight } }
    function growOf(it) {
      if (growCache.has(it)) return growCache.get(it);
      const sl = it.closest('.slide'), a = layoutBox(it, sl); let gx = 1e4, gy = 1e4;
      $$(BLOCK + ',' + ITEMS, sl).filter(o => shown(o) && o !== it && !o.contains(it) && !it.contains(o)).forEach(o => {
        const b = layoutBox(o, sl), ox = Math.min(a.r, b.r) - Math.max(a.l, b.l), oy = Math.min(a.b, b.b) - Math.max(a.t, b.t);
        if (oy > 2 && ox <= 2) gx = Math.min(gx, Math.max(0, -ox)); if (ox > 2 && oy <= 2) gy = Math.min(gy, Math.max(0, -oy));
      });
      const g = 1 + Math.max(0, Math.min((gx - 3) * 2 / a.w, (gy - 3) * 2 / a.h, 18 / a.w, .05));
      growCache.set(it, g); return g;
    }
    function clearGrow() { slides.forEach(sl => $$(ITEMS, sl).forEach(i => growCache.delete(i))) }
    addEventListener('resize', clearGrow); document.addEventListener('langchange', clearGrow);
    function mark() {
      if (!active) return; const tg = L_.sel ? res(L_.sel) : null, items = itemsOf(active);
      items.forEach(it => { const on = !!tg && (tg === it || it.contains(tg) || tg.contains(it)); it.classList.toggle('f-on', on); it.classList.toggle('f-off', !on && !!tg); if (on) it.style.setProperty('--grow', growOf(it).toFixed(4)) });
    }
    function setShot(sh) {
      const el = sh.s ? res(sh.s) : null; L_.sel = shown(el) ? sh.s : null; L_.el = L_.sel ? el : null; L_.vT = L_.sel ? 1 : 0;
      if (L_.sel && L_.born) { const r = el.getBoundingClientRect(); L_.x = r.left; L_.y = r.top; L_.w = r.width; L_.h = r.height; L_.r = radOf(el); L_.born = false }
      fast = false; mark();
    }
    /* ── Qué lleva la línea en cada vista ── */
    function planOf(sl) {
      const q = s => $(s, sl);
      if (sl.classList.contains('slide-home')) return [{ s: null }];
      if (q('.pain.on') && shown(q('.pains'))) return [{ s: '.pain.on' }];
      if (q('.method')) return [{ s: '.phase.on' }];
      if (q('.morph')) return [{ s: '.mx-steps li.on' }];
      if (q('.ptree')) return [{ s: '.tcanvas' }];
      if (q('.adds3')) { const ps = $$('.adc', sl); return [...ps.map(p => ({ s: p, hold: 2200 })), { s: ps[0], rel: 1 }] }
      if (q('.d7') || q('.vz') || q('.dz') || q('.ers2') || q('.mr') || q('.jb') || q('.pn3') || q('.sx') || q('.no5') || q('.fc2') || q('.cs2') || q('.gr2') || q('.qx') || q('.hf-d2')) return [{ s: null }];
      if (q('.pmx')) return [{ s: '.pm-c.on' }];
      if (q('.dm2')) return [{ s: '.mx-steps li.on' }];
      if (q('.mt')) return [{ s: '.mt [data-tab].on' }];
      if (q('.no4') || q('.cs') || q('.fin') || q('.m4')) return [{ s: null }];
      if (q('.stops')) return [{ s: '.st-b.on' }];
      if (q('[data-tabs]')) return [{ s: '[data-tab].on' }];
      if (q('.ai3')) return [{ s: null }]; if (q('.behind')) return [{ s: '.notes li.on' }];
      if (sl.classList.contains('contact-band')) return [{ s: null }];
      const items = itemsOf(sl);
      if (!items.length) return [{ s: null }];
      if (items.length === 1) return [{ s: items[0] }];
      const tour = items.slice(0, 4).map(it => ({ s: it, hold: clamp(1600 + (it.textContent || '').replace(/\s+/g, ' ').length / 2 * 12, 2200, 3800) }));
      return [...tour, { s: items[0], rel: 1 }];
    }
    function relax() { if (active) active.classList.add('relax') }
    function run(k) { setShot(plan[k]); if (k < plan.length - 1) timer = setTimeout(() => run(k + 1), plan[k].hold || 2400); else if (plan[k].rel) relax() }
    function enter(sl, fromOther) {
      clearTimeout(timer); clearTimeout(hoverT); clearTimeout(leaveT); hoverEl = null; active = sl; plan = planOf(sl);
      if (RM || CAP) { L_.born = true; const r = plan[plan.length - 1]; setShot(r); if (r.rel) relax(); return }
      if (!fromOther) { setShot(plan[plan.length - 1]); return }
      L_.born = true; timer = setTimeout(() => run(0), 720);
    }
    function leave() {
      clearTimeout(timer); clearTimeout(hoverT); clearTimeout(leaveT); hoverEl = null; fast = true; L_.vT = 0;
      if (active) { active.classList.remove('relax'); $$('.f-on,.f-off', active).forEach(x => x.classList.remove('f-on', 'f-off')) }
      L_.sel = null; L_.el = null; active = null;
    }
    /* ── Al pasar el ratón: esa cajita crece un poco y la línea va hacia allá ── */
    if (FINE) {
      addEventListener('pointerover', e => {
        if (!active) return; const it = e.target.closest ? e.target.closest(ITEMS) : null;
        if (it && active.contains(it) && !it.closest('.toc')) {
          clearTimeout(leaveT); if (it === hoverEl) return; clearTimeout(hoverT); hoverEl = it; clearTimeout(timer); active.classList.remove('relax');
          hoverT = setTimeout(() => setShot({ s: it }), 60);
        } else if (hoverEl) { clearTimeout(hoverT); clearTimeout(leaveT); leaveT = setTimeout(() => { hoverEl = null; const r = plan[plan.length - 1]; setShot(r); if (r.rel) relax() }, 170) }
      });
    }
    /* ── Cuadro a cuadro ── */
    const setA = (s, n, v) => { const f = typeof v === 'number' ? +v.toFixed(2) : v; if (s._m === undefined) s._m = {}; if (s._m[n] !== f) { s._m[n] = f; s.setAttribute(n, f) } };
    function tick(tn) {
      const dt = Math.min(50, tn - last); last = tn; const inst = RM || CAP, kP = inst ? 1 : 1 - Math.exp(-dt / 110), kF = inst ? 1 : 1 - Math.exp(-dt / (fast ? 60 : 200));
      if (L_.sel) { const el = res(L_.sel); if (shown(el)) { if (el !== L_.el) { L_.el = el; mark() } const r = el.getBoundingClientRect(); L_.tx = r.left; L_.ty = r.top; L_.tw = r.width; L_.th = r.height; L_.tr = radOf(el) } }
      L_.x += (L_.tx - L_.x) * kP; L_.y += (L_.ty - L_.y) * kP; L_.w += (L_.tw - L_.w) * kP; L_.h += (L_.th - L_.h) * kP; L_.r += (L_.tr - L_.r) * kP; L_.v += (L_.vT - L_.v) * kF;
      for (const n of rects) { setA(n, 'x', L_.x); setA(n, 'y', L_.y); setA(n, 'width', Math.max(0, L_.w)); setA(n, 'height', Math.max(0, L_.h)); setA(n, 'rx', L_.r) }
      setA(ring, 'opacity', L_.v < .01 ? 0 : L_.v);
    }
    return { tick, enter, leave };
  })();
  /* ── Cambio de vista ── */
  function apply(i, first) {
    const prev = positions[cur], next = positions[i], dir = i >= cur ? 'down' : 'up', a = stopOf(cur), b = stopOf(i);
    root.dataset.dir = dir;
    const newSlide = first || prev.sl !== next.sl;
    if (newSlide && !first) Focus.leave();
    if (first || prev.sl !== next.sl) {
      slides.forEach((sl, k) => { sl.classList.toggle('leaving', !first && k === prev.sl); sl.classList.toggle('active', k === next.sl); sl.toggleAttribute('inert', deck && k !== next.sl) });
      if (!first) setTimeout(() => slides[prev.sl].classList.remove('leaving'), 280);
    }
    setStep(slides[next.sl], next.step);
    cur = i; camera(camOf(i)); if (!first) Wind.gust(newSlide ? 1 : .55, dir === 'down' ? 1 : -1);
    if (first) Cat.place(b); else if (a !== b) Cat.travel(a, b);
    Focus.enter(slides[next.sl], newSlide);
    root.dataset.veil = slides[next.sl].dataset.veil || ''; if (i === N - 1) root.dataset.last = '1'; else delete root.dataset.last;
    syncToc();
    document.dispatchEvent(new CustomEvent('slidechange', { detail: { sl: next.sl, step: next.step, first } }));
    if (!first) { const id = slides[next.sl].id; try { history.replaceState(null, '', location.pathname + location.search + (id ? '#' + id : '')) } catch (e) {}
      if (!RM && !CAP && newSlide) { for (let k = 0; k < 6; k++) setTimeout(() => spawn(innerWidth * (.45 + Math.random() * .55), true), k * 130); mist.animate && mist.animate([{ opacity: 0 }, { opacity: .55, offset: .42 }, { opacity: 0 }], { duration: 1500, easing: 'ease-in-out' }) } }
  }
  function go(i, quick) {
    i = Math.max(0, Math.min(N - 1, i)); if (i === cur) return;
    if (!deck) { const sl = slides[positions[i].sl]; sl.scrollIntoView({ behavior: RM ? 'auto' : 'smooth' }); setStep(sl, positions[i].step); return }
    if (locked) return; locked = true; apply(i); setTimeout(() => locked = false, RM ? 250 : quick ? 400 : 1000);
  }
  /* Rueda: un gesto, una vista. No hay forma de quedar a medias. */
  let lastW = 0, used = false, acc = 0;
  addEventListener('wheel', e => { if (!deck) return; e.preventDefault(); const now = performance.now(), dt = now - lastW; lastW = now; if (dt > 170) { used = false; acc = 0 } if (used || locked) return; acc += e.deltaY; if (Math.abs(acc) >= 8) { used = true; go(cur + (acc > 0 ? 1 : -1)) } }, { passive: false });
  addEventListener('keydown', e => { const T = e.target && e.target.closest ? e.target : document.body; if (!deck || T.closest('input,textarea,select')) return; const k = e.key; if (k === 'ArrowDown' || k === 'PageDown' || (k === ' ' && !T.closest('button,a'))) { e.preventDefault(); go(cur + 1) } else if (k === 'ArrowUp' || k === 'PageUp') { e.preventDefault(); go(cur - 1) } else if (k === 'Home') { e.preventDefault(); go(0) } else if (k === 'End') { e.preventDefault(); go(N - 1) } });
  let ty0 = null; addEventListener('touchstart', e => { ty0 = e.touches[0].clientY }, { passive: true }); addEventListener('touchend', e => { if (!deck || ty0 === null) return; const d = ty0 - e.changedTouches[0].clientY; if (Math.abs(d) > 44) go(cur + (d > 0 ? 1 : -1)); ty0 = null }, { passive: true });
  /* El nombre funciona como un botón de arriba: en la portada vuelve al inicio */
  { const lg = $('.logo'); if (lg && slides.some(x => x.id === 'inicio')) lg.addEventListener('click', e => { if (deck) { e.preventDefault(); go(0) } }) }
  /* Enlaces internos */
  $$('a[href^="#"]').forEach(a => { const id = a.getAttribute('href').slice(1); if (!id) return; a.addEventListener('click', e => { const sl = document.getElementById(id); if (!sl || !sl.classList.contains('slide')) return; e.preventDefault(); const k = positions.findIndex(x => x.sl === slides.indexOf(sl)); if (k >= 0) go(k) }) });
  /* V5.21 · un enlace a otra vista de la misma página (por ejemplo, desde «Ask») también mueve las vistas */
  addEventListener('hashchange', () => { const sl = document.getElementById(decodeURIComponent(location.hash.slice(1))); if (sl && sl.classList.contains('slide')) { const k = positions.findIndex(x => x.sl === slides.indexOf(sl)); if (k >= 0) go(k) } });
  /* Modo flujo: la vista visible manda la cámara */
  if (!deck) { const fio = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { const sl = slides.indexOf(e.target), k = positions.findIndex(x => x.sl === sl); if (k >= 0 && k !== cur) { const a = stopOf(cur); cur = k; camera(camOf(k)); document.dispatchEvent(new CustomEvent('slidechange', { detail: { sl, step: 1 } })) } } }), { threshold: .4 }); slides.forEach(s => { fio.observe(s); s.classList.add('active') }) }
  /* Primera posición */
  (function start() {
    let i = 0; const hs = decodeURIComponent(location.hash.slice(1)) || P.get('s'); if (hs) { const el = document.getElementById(hs); if (el) { const k = positions.findIndex(x => x.sl === slides.indexOf(el)); if (k >= 0) i = k } }
    if (P.has('p')) i = Math.max(0, Math.min(N - 1, +P.get('p')));
    if (P.get('fase')) { const sl = slides.findIndex(s => $('.method', s)); const k = positions.findIndex(x => x.sl === sl && x.step === +P.get('fase')); if (k >= 0) i = k }
    $$('.modes button').forEach(b => b.addEventListener('click', () => Mode.set(b.dataset.m)));
    Mode.paint(); Obj.build(); Koi.build();
    if (toc) IXS.forEach(x => toc.classList.toggle('ix-' + x, x === IX)); $$('#pruebas [data-ix]').forEach(b => b.setAttribute('aria-pressed', b.dataset.ix === IX ? 'true' : 'false'));
    fit(); drawStem(); cur = i; apply(i, true); Mode.mark();
    document.addEventListener('slidechange', () => { const a = $('.slide.active'); if (!a) return; Mode.mark(a); setTimeout(() => { const b = $('.slide.active'); if (b) Mode.mark(b) }, 1300) });
    document.addEventListener('langchange', () => Mode.mark());
    if (deck) (function loop(t) { Cat.tick(t); Focus.tick(t); Obj.tick(t); Koi.tick(t); requestAnimationFrame(loop) })(performance.now()); if (!deck) slides.forEach(s => { s.classList.add('active'); setStep(s, 1) });
    (document.fonts ? document.fonts.ready : Promise.resolve()).then(() => { fit(); drawStem(); syncToc() });
    addEventListener('resize', () => { const d = DECK_OK(); if (d !== deck) { location.reload(); return } fit(); drawStem(); camera(camOf(cur)); syncToc() });
    document.addEventListener('langchange', () => { fit(); drawStem(); syncToc() });
  })();
  /* ═══════════ V5.26 · «Pregúntame»: un botón chico, seis temas y una tarjeta por respuesta (la pregunta, un dibujo, una frase y un enlace).
     Sin campo para escribir: las respuestas son de Diego y se eligen con un clic. Aquí ningún modelo genera texto ═══════════ */
  (() => {
    const logo = $('#nav .logo'); if (!logo) return;
    const BASE = root.dataset.base || '';
    const SL = root.dataset.slugs ? JSON.parse(root.dataset.slugs) : null;   /* en la versión publicada, las páginas en inglés tienen otro nombre */
    const both = (es, en) => `<span class="es">${es}</span><span class="en">${en}</span>`;
    const href = h => { if (/^(mailto:|https?:|#)/.test(h)) return h; if (h.startsWith('assets/')) return BASE + h; const i = h.indexOf('#'), pg = i < 0 ? h : h.slice(0, i); return (SL && SL[pg] ? SL[pg] : pg) + (i < 0 ? '' : h.slice(i)) };
    const chips = (a, b) => '<div class="aq-ch">' + a.map(x => `<i>${x}</i>`).join('') + (b || []).map(x => `<i class="l1">${x}</i>`).join('') + '</div>';
    const QA = [
      { t: ['Qué hago', 'What I do'], q: ['¿Qué haces?', 'What do you do?'],
        v: '<div class="aq-ph"><i class="on">1</i><i>2</i><i>3</i><i>4</i><i>5</i></div><small>' + both('Definir · Revisar · Modelar · Analizar · Comunicar', 'Define · Review · Model · Analyze · Communicate') + '</small>',
        a: ['Data analyst: SQL, Power BI y Python. Parto por definir el problema.', 'Data analyst: SQL, Power BI and Python. I start by defining the problem.'], to: 'index.html#metodo', go: ['Cómo trabajo', 'How I work'] },
      { t: ['La IA', 'AI'], q: ['¿Cómo usas la IA?', 'How do you use AI?'],
        v: '<div class="aq-cy"><i class="me">' + both('Yo', 'Me') + '</i><b>→</b><i>' + both('IA', 'AI') + '</i><b>→</b><i class="me">' + both('Yo', 'Me') + '</i><b>→</b><i class="me">' + both('Yo', 'Me') + '</i></div><small>' + both('Defino · Arma · Compruebo · Decido', 'Define · Builds · Check · Decide') + '</small>',
        a: ['La IA arma el SQL y el DAX. Yo compruebo cada número contra la fuente.', 'AI builds the SQL and the DAX. I check every number against the source.'], to: 'index.html#ia', go: ['Cómo uso la IA', 'How I use AI'] },
      { t: ['Disponible', 'Available'], q: ['¿Estás disponible?', 'Are you available?'],
        v: '<div class="aq-st"><b></b>' + both('Disponible', 'Available') + '</div>' + chips(['Santiago, Chile', both('Remoto', 'Remote'), 'EN · ES']),
        a: ['Sí. Busco un rol de senior data analyst o BI.', 'Yes. I’m open to senior data analyst and BI roles.'], to: 'contacto.html', go: ['Contacto', 'Contact'] },
      { t: ['Proyectos', 'Projects'], q: ['¿Puedo ver tu trabajo?', 'Can I see your work?'],
        v: '<div class="aq-nm"><span><b>10</b>' + both('casos', 'cases') + '</span><span><b>6</b>' + both('tipos de pregunta', 'kinds of question') + '</span></div>',
        a: ['Cada caso parte de una pregunta de negocio. Datos simulados.', 'Each case starts from a business question. Simulated data.'], to: 'proyectos.html', go: ['Proyectos', 'Projects'] },
      { t: ['Herramientas', 'Tools'], q: ['¿Qué herramientas usas?', 'Which tools do you use?'],
        v: chips(['SQL', 'BigQuery', 'Power BI', 'Excel', 'Python'], ['Tableau', 'Snowflake', 'dbt']),
        a: ['Las llenas, en el trabajo. Las de borde, sumándolas.', 'The solid ones, at work. The outlined ones, adding them.'], to: 'sobre-mi.html', go: ['Sobre mí', 'About'] },
      { t: ['CV', 'CV'], q: ['¿Tienes un CV?', 'Do you have a CV?'],
        v: '<div class="aq-cv"><svg viewBox="0 0 30 38" aria-hidden="true"><path d="M3 2h16l8 8v26H3z"/><path d="M19 2v8h8M8 18h14M8 24h14M8 30h9"/></svg><span>PDF · EN · ES</span></div>',
        a: ['Sí. Cargos, fechas y herramientas, en una página.', 'Yes. Roles, dates and tools, on one page.'], to: { es: 'assets/cv/Diego-Cayupil-CV-ES.pdf', en: 'assets/cv/Diego-Cayupil-CV-EN.pdf' }, go: ['Descargar CV', 'Download CV'], dl: 1 }
    ];
    const lab = () => L() === 'en' ? 'Ask me' : 'Pregúntame';
    const btn = document.createElement('button'); btn.type = 'button'; btn.className = 'askb aq-b';
    btn.setAttribute('aria-haspopup', 'dialog'); btn.setAttribute('aria-expanded', 'false'); btn.setAttribute('aria-controls', 'askp');
    btn.dataset.alEs = 'Pregúntame'; btn.dataset.alEn = 'Ask me'; btn.setAttribute('aria-label', lab()); btn.title = lab();
    btn.innerHTML = '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M2.5 3.2h11v7.4H7.6l-3.1 2.6v-2.6h-2z"/></svg>';
    logo.after(btn);
    const pn = document.createElement('div'); pn.className = 'askp aq'; pn.id = 'askp'; pn.hidden = true; pn.tabIndex = -1; pn.setAttribute('role', 'dialog');
    pn.dataset.alEs = 'Pregúntame'; pn.dataset.alEn = 'Ask me'; pn.setAttribute('aria-label', lab());
    pn.innerHTML =
      '<div class="aq-hd"><span class="aq-av">DC</span><b>' + both('Pregúntame', 'Ask me') + '</b>' +
      '<button type="button" class="askx" aria-label="Close" data-al-es="Cerrar" data-al-en="Close"><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M4 4l8 8M12 4l-8 8"/></svg></button></div>' +
      '<div class="aq-qs"></div><div class="aq-a" aria-live="polite"></div>' +
      '<p class="aq-ft">' + both('¿Otra cosa?', 'Something else?') + ' <a href="' + href('contacto.html') + '">' + both('Escríbeme', 'Write to me') + ' →</a></p>';
    document.body.appendChild(pn);
    const box = $('.aq-a', pn), qs = $('.aq-qs', pn);
    const link = e => {
      const mk = (h, l, c) => `<a class="aq-go${c}" href="${href(h)}"${e.dl ? ' download' : ''}>${l} <span aria-hidden="true">${e.dl ? '↓' : '→'}</span></a>`;
      return typeof e.to === 'string' ? mk(e.to, both(e.go[0], e.go[1]), '') : mk(e.to.es, e.go[0], ' es') + mk(e.to.en, e.go[1], ' en');
    };
    function show(i) {
      const e = QA[i]; box.innerHTML = `<b class="aq-q">${both(e.q[0], e.q[1])}</b><div class="aq-v">${e.v}</div><p>${both(e.a[0], e.a[1])}</p>${link(e)}`;
      $$('button', qs).forEach((b, k) => { b.classList.toggle('on', k === i); b.setAttribute('aria-pressed', k === i) });
    }
    QA.forEach((e, i) => { const b = document.createElement('button'); b.type = 'button'; b.innerHTML = both(e.t[0], e.t[1]); b.addEventListener('click', () => show(i)); qs.appendChild(b) });
    show(0);
    const open = v => { pn.hidden = !v; btn.setAttribute('aria-expanded', v); if (v) { const r = btn.getBoundingClientRect(); pn.style.setProperty('--ax', Math.round(r.left) + 'px'); pn.focus({ preventScroll: true }) } else btn.focus() };
    btn.addEventListener('click', () => open(pn.hidden));
    $('.askx', pn).addEventListener('click', () => open(false));
    document.addEventListener('langchange', () => { btn.title = lab() });
    pn.addEventListener('keydown', e => { if (e.key === 'Escape') { e.stopPropagation(); open(false) } else if (e.key !== 'Tab') e.stopPropagation() });
    pn.addEventListener('wheel', e => e.stopPropagation(), { passive: true });
    document.addEventListener('click', e => { const p = e.composedPath(); if (!pn.hidden && !p.includes(pn) && !p.includes(btn)) { pn.hidden = true; btn.setAttribute('aria-expanded', 'false') } });
    pn.addEventListener('click', e => { const a = e.target.closest('a'); if (a && !a.hasAttribute('download') && !/^mailto:/.test(a.getAttribute('href'))) { pn.hidden = true; btn.setAttribute('aria-expanded', 'false') } });
  })();
})();
