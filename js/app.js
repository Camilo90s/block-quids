/*
 * Block-Kids · aplicación
 * ------------------------------------------------------------
 * Pantallas sin texto para niños de 6 a 7 años: todo se comunica con íconos,
 * colores, animaciones y voz. El panel docente y las tarjetas sí usan texto.
 */
(function () {
  'use strict';
  var BK = window.BK, M = BK.motor, A = BK.audio, VOZ = BK.VOZ;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var sleep = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* =========================================================
   * Íconos
   * ======================================================= */
  var UI = {
    home: '<path d="M7 23 24 8l17 15"/><path d="M12 19v20h24V19"/><path d="M20 39V29h8v10"/>',
    sound: '<path d="M7 19h7l10-8v26l-10-8H7z" fill="currentColor"/><path d="M30 18a8 8 0 0 1 0 12M35 13a15 15 0 0 1 0 22"/>',
    mute: '<path d="M7 19h7l10-8v26l-10-8H7z" fill="currentColor"/><path d="m31 19 10 10M41 19 31 29"/>',
    help: '<circle cx="24" cy="24" r="17"/><path d="M18.5 19a5.5 5.5 0 1 1 7.5 5.1c-1.3.6-2 1.6-2 3V29"/><circle cx="24" cy="35" r="1.8" fill="currentColor"/>',
    play: '<path d="M16 9v30l23-15z" fill="currentColor"/>',
    next: '<path d="M13 10v28l20-14z" fill="currentColor"/><path d="M38 10v28"/>',
    replay: '<path d="M10 25a14 14 0 1 0 4.2-10"/><path d="M10 8v9h9"/>',
    undo: '<path d="M14 18h16a10 10 0 0 1 0 20H19"/><path d="m21 10-8 8 8 8"/>',
    trash: '<path d="M9 14h30M18 14V9h12v5M13 14l2.5 26h17L35 14"/>',
    stop: '<rect x="13" y="13" width="22" height="22" rx="5" fill="currentColor"/>',
    star: '<path d="M24 5l5.9 12 13.1 1.9-9.5 9.3 2.3 13L24 35l-11.8 6.2 2.3-13L5 18.9 18.1 17z" fill="currentColor"/>',
    lock: '<rect x="11" y="21" width="26" height="19" rx="5" fill="currentColor"/><path d="M16 21v-5a8 8 0 0 1 16 0v5"/>',
    check: '<path d="m10 25 9 9 19-20" stroke-width="6"/>',
    up: '<path d="M14 21v18H8V21z" fill="currentColor"/><path d="M14 22l7-13c3 0 5 2 4 6l-2 6h11c2.5 0 4 2 3.5 4.5l-3 10c-.5 2-2 3.5-4.5 3.5H14" fill="currentColor"/>',
    down: '<path d="M14 27V9H8v18z" fill="currentColor"/><path d="M14 26l7 13c3 0 5-2 4-6l-2-6h11c2.5 0 4-2 3.5-4.5l-3-10c-.5-2-2-3.5-4.5-3.5H14" fill="currentColor"/>',
    mesa: '<rect x="5" y="22" width="38" height="6" rx="3" fill="currentColor"/><path d="M11 28v12M37 28v12"/><rect x="10" y="9" width="11" height="10" rx="2.5" fill="currentColor" opacity=".55" stroke="none"/><rect x="26" y="9" width="11" height="10" rx="2.5" fill="currentColor" stroke="none"/>',
    mano: '<path d="M19 25V10a3 3 0 0 1 6 0v12m0-3a3 3 0 0 1 6 0v4m0-2a3 3 0 0 1 6 0v9c0 7-5 12-12 12h-2c-4 0-6-2-9-5l-5-6a3 3 0 0 1 4.5-4L19 30"/>',
    ojo: '<path d="M4 24s7-12 20-12 20 12 20 12-7 12-20 12S4 24 4 24z"/><circle cx="24" cy="24" r="6" fill="currentColor"/>',
    bandera: '<path d="M12 6v36"/><path d="M14 8c8-4 14 4 24 0v16c-10 4-16-4-24 0z" fill="currentColor"/>',
    pausa: '<rect x="13" y="10" width="8" height="28" rx="3" fill="currentColor" stroke="none"/><rect x="27" y="10" width="8" height="28" rx="3" fill="currentColor" stroke="none"/>',
    trofeo: '<path d="M15 8h18v10a9 9 0 0 1-18 0z" fill="currentColor"/><path d="M15 12H9a5 5 0 0 0 6 8M33 12h6a5 5 0 0 1-6 8M24 27v7M16 40h16M19 34h10v6H19z"/>',
    gear: '<circle cx="24" cy="24" r="6"/><path d="M24 5v6M24 37v6M5 24h6M37 24h6M10.6 10.6l4.2 4.2M33.2 33.2l4.2 4.2M10.6 37.4l4.2-4.2M33.2 14.8l4.2-4.2"/>',
    print: '<path d="M14 18V7h20v11M14 34H9V20h30v14h-5"/><rect x="14" y="28" width="20" height="13" rx="2"/>',
    mapa: '<path d="M6 12l11-5 14 5 11-5v29l-11 5-14-5-11 5z"/><path d="M17 7v29M31 12v29"/>',
    swap: '<path d="M8 17h28l-7-7M40 31H12l7 7"/>',
    back: '<path d="M30 10 16 24l14 14"/>'
  };
  function ui(name, cls) {
    return '<svg class="ui ' + (cls || '') + '" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + UI[name] + '</svg>';
  }

  // Dibujos blancos de cada bloque (mismos que en las tarjetas físicas)
  var GLYPH = {
    avanzar: '<path d="M24 6 39 23H29v19H19V23H9z" fill="#fff"/>',
    derecha: '<path d="M14 42V25a11 11 0 0 1 11-11h6" fill="none" stroke="#fff" stroke-width="7" stroke-linecap="round"/><path d="M29 4l13 10-13 10z" fill="#fff"/>',
    izquierda: '<path d="M34 42V25a11 11 0 0 0-11-11h-6" fill="none" stroke="#fff" stroke-width="7" stroke-linecap="round"/><path d="M19 4 6 14l13 10z" fill="#fff"/>',
    saltar: '<path d="M7 36Q22 2 39 28" fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round"/><path d="M31 25l12 7 1-14z" fill="#fff"/><rect x="17" y="36" width="14" height="8" rx="3" fill="#fff" opacity=".75"/>',
    repetir: '<path d="M11 21a13 13 0 0 1 23-7" fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round"/><path d="M30 6l9 9-12 3z" fill="#fff"/><path d="M37 27a13 13 0 0 1-23 7" fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round"/><path d="M18 42l-9-9 12-3z" fill="#fff"/>',
    bandera: '<path d="M12 5v38" stroke="#fff" stroke-width="5" stroke-linecap="round"/><path d="M14 7c8-4 14 4 25 0v17c-11 4-17-4-25 0z" fill="#18a34a" stroke="#fff" stroke-width="2.5"/>'
  };
  var SHAPE = 'M12 4H96Q106 4 106 14V35C117 35 117 65 106 65V86Q106 96 96 96H12Q2 96 2 86V65C13 65 13 35 2 35V14Q2 4 12 4Z';

  function blk(t, o) {
    o = o || {};
    var b = BK.BLOQUES[t], tag = o.tag || 'span';
    return '<' + tag + ' class="blk ' + (o.cls || '') + '" data-t="' + t + '" ' + (o.attrs || '') + '>' +
      '<svg class="shape" viewBox="0 0 120 100" preserveAspectRatio="none" aria-hidden="true"><path d="' + SHAPE + '" fill="' + b.color + '" stroke="' + b.borde + '" stroke-width="4"/>' +
      '<path d="M16 12H92" stroke="rgba(255,255,255,.35)" stroke-width="6" stroke-linecap="round"/></svg>' +
      '<svg class="glyph" viewBox="0 0 48 48" aria-hidden="true">' + GLYPH[t] + '</svg>' +
      (t === 'repetir' && o.n !== false ? '<span class="count">' + (o.n || 2) + '</span>' : '') +
      '</' + tag + '>';
  }
  function outline(cls) {
    return '<span class="slot ' + (cls || '') + '"><svg class="shape" viewBox="0 0 120 100" preserveAspectRatio="none" style="position:absolute;inset:0;width:100%;height:100%" aria-hidden="true"><path d="' + SHAPE + '" fill="rgba(255,255,255,.7)" stroke="#c4d0e2" stroke-width="4" stroke-dasharray="10 8"/></svg></span>';
  }

  function bot(cls) {
    return '<svg class="bot ' + (cls || '') + '" viewBox="0 0 100 100" aria-hidden="true">' +
      '<ellipse cx="50" cy="94" rx="26" ry="4.5" fill="rgba(31,42,68,.16)"/>' +
      '<line x1="50" y1="10" x2="50" y2="22" stroke="#2b3550" stroke-width="4" stroke-linecap="round"/><circle cx="50" cy="9" r="5.5" fill="#ff5d5d"/>' +
      '<rect class="arm-l" x="8" y="50" width="12" height="24" rx="6" fill="#f5a800" stroke="#d48f00" stroke-width="2"/>' +
      '<rect class="arm-r" x="80" y="50" width="12" height="24" rx="6" fill="#f5a800" stroke="#d48f00" stroke-width="2"/>' +
      '<rect x="31" y="80" width="12" height="11" rx="4" fill="#2b3550"/><rect x="57" y="80" width="12" height="11" rx="4" fill="#2b3550"/>' +
      '<rect x="19" y="21" width="62" height="62" rx="17" fill="#ffc83d" stroke="#e0a400" stroke-width="3"/>' +
      '<rect x="26" y="26" width="48" height="9" rx="4.5" fill="#ffe08a"/>' +
      '<rect x="28" y="39" width="44" height="31" rx="11" fill="#1f2a44"/>' +
      '<g class="eyes-o"><g class="pupils"><circle cx="41" cy="52" r="6" fill="#5ef0c8"/><circle cx="59" cy="52" r="6" fill="#5ef0c8"/><circle cx="43" cy="50" r="2" fill="#fff"/><circle cx="61" cy="50" r="2" fill="#fff"/></g>' +
      '<path d="M43 62Q50 67 57 62" stroke="#5ef0c8" stroke-width="3" fill="none" stroke-linecap="round"/></g>' +
      '<g class="eyes-x" stroke="#ffb020" stroke-width="3.5" stroke-linecap="round" fill="none"><path d="M37 48l8 8M45 48l-8 8M55 48l8 8M63 48l-8 8"/><path d="M44 65Q50 61 56 65"/></g>' +
      '</svg>';
  }
  var DECO = {
    R: '<svg class="deco" viewBox="0 0 48 48" aria-hidden="true"><path d="M7 39l6-19 11-8 12 4 6 15-3 8z" fill="#9aa3b5" stroke="#76809a" stroke-width="2.5" stroke-linejoin="round"/><path d="M15 23l9-6 7 3" stroke="#c9cfdb" stroke-width="3.5" fill="none" stroke-linecap="round"/></svg>',
    W: '<svg class="deco" viewBox="0 0 48 48" aria-hidden="true"><path d="M5 18q6.5-6 13 0t13 0 13 0M5 31q6.5-6 13 0t13 0 13 0" stroke="#fff" stroke-width="3.5" fill="none" stroke-linecap="round" opacity=".9"/></svg>',
    G: '<svg class="deco" viewBox="0 0 48 48" aria-hidden="true"><path d="M24 4l6 12.5 13.6 2-9.8 9.6 2.3 13.5L24 35.2l-12.1 6.4 2.3-13.5-9.8-9.6 13.6-2z" fill="#ffc83d" stroke="#e8a000" stroke-width="2.5" stroke-linejoin="round"/><circle cx="19.5" cy="21.5" r="2.3" fill="#1f2a44"/><circle cx="28.5" cy="21.5" r="2.3" fill="#1f2a44"/><path d="M20.5 27q3.5 3 7 0" stroke="#1f2a44" stroke-width="2" fill="none" stroke-linecap="round"/></svg>'
  };
  function starSVG(on) { return '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M24 4l6 12.5 13.6 2-9.8 9.6 2.3 13.5L24 35.2l-12.1 6.4 2.3-13.5-9.8-9.6 13.6-2z" fill="' + (on ? '#ffc83d' : '#e3e8f0') + '" stroke="' + (on ? '#e8a000' : '#cfd6e2') + '" stroke-width="2.5" stroke-linejoin="round"/></svg>'; }
  function kidSVG(color, role) { return '<span class="kid" style="background:' + color + '">' + ui(role) + '</span>'; }

  /* =========================================================
   * Progreso (solo en este dispositivo, sin cuentas)
   * ======================================================= */
  var KEY = 'blockkids:v1';
  function fresh() { return { niveles: {}, ajustes: { voz: true, efectos: true, lenta: false, parejas: true, todo: false }, silencio: false, turno: 0, turnoVisto: 0 }; }
  function load() {
    try {
      var s = JSON.parse(localStorage.getItem(KEY) || 'null');
      if (!s) return fresh();
      var f = fresh(); Object.keys(f).forEach(function (k) { if (s[k] === undefined) s[k] = f[k]; });
      s.ajustes = Object.assign(f.ajustes, s.ajustes || {});
      return s;
    } catch (e) { return fresh(); }
  }
  var S = load();
  function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { /* almacenamiento no disponible */ } }
  function aplicarAudio() { A.voz = S.ajustes.voz && !S.silencio; A.efectos = S.ajustes.efectos && !S.silencio; A.lenta = S.ajustes.lenta; }
  aplicarAudio();

  var N = BK.NIVELES;
  function idx(id) { for (var i = 0; i < N.length; i++) if (N[i].id === id) return i; return -1; }
  function hecho(id) { return !!(S.niveles[id] && S.niveles[id].hecho); }
  function abierto(i) { return S.ajustes.todo || i === 0 || hecho(N[i - 1].id); }
  function estrellas(id) { return (S.niveles[id] && S.niveles[id].estrellas) || 0; }
  function totalEstrellas() { return N.reduce(function (a, n) { return a + estrellas(n.id); }, 0); }
  function siguiente() { for (var i = 0; i < N.length; i++) if (!hecho(N[i].id)) return i; return N.length; }
  function guardar(id, est, C) {
    var p = S.niveles[id] || { intentos: 0, errores: 0 };
    var primera = !p.hecho;
    p.hecho = true; p.estrellas = Math.max(p.estrellas || 0, est);
    p.intentos = (p.intentos || 0) + Math.max(1, C.intentos); p.errores = (p.errores || 0) + C.errores;
    p.fecha = new Date().toISOString();
    S.niveles[id] = p;
    if (primera) S.turno = (S.turno || 0) + 1;
    save();
  }

  /* =========================================================
   * Utilidades de interfaz
   * ======================================================= */
  var limpiezas = [];
  function alLimpiar(fn) { limpiezas.push(fn); }
  function limpiar() { limpiezas.splice(0).forEach(function (f) { try { f(); } catch (e) { /* */ } }); $$('.modal, canvas.confetti, .drag-ghost').forEach(function (x) { x.remove(); }); }
  function timer(fn, ms) { var t = setTimeout(fn, ms); alLimpiar(function () { clearTimeout(t); }); return t; }
  function efecto(el, cls) { if (!el) return; el.classList.remove(cls); void el.offsetWidth; el.classList.add(cls); setTimeout(function () { el.classList.remove(cls); }, 1400); }

  function confeti() {
    if (reduce) return;
    var c = document.createElement('canvas'); c.className = 'confetti'; document.body.appendChild(c);
    var ctx = c.getContext('2d'), W = c.width = innerWidth * devicePixelRatio, H = c.height = innerHeight * devicePixelRatio;
    var cols = ['#2f7ff0', '#f7b500', '#ff8a1f', '#18a34a', '#8b5cf6', '#ef4444', '#5ef0c8'];
    var ps = Array.from({ length: 140 }, function () {
      return { x: W / 2 + (Math.random() - .5) * W * .3, y: H * .45, vx: (Math.random() - .5) * 26 * devicePixelRatio, vy: (-Math.random() * 22 - 8) * devicePixelRatio, s: (6 + Math.random() * 8) * devicePixelRatio, c: cols[Math.floor(Math.random() * cols.length)], r: Math.random() * 6, vr: (Math.random() - .5) * .4 };
    });
    var t0 = performance.now();
    (function f(t) {
      if (!c.isConnected) return;
      ctx.clearRect(0, 0, W, H);
      ps.forEach(function (p) { p.vy += .7 * devicePixelRatio; p.x += p.vx; p.y += p.vy; p.vx *= .985; p.r += p.vr; ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.r); ctx.fillStyle = p.c; ctx.fillRect(-p.s / 2, -p.s / 3, p.s, p.s * .66); ctx.restore(); });
      if (t - t0 < 2800) requestAnimationFrame(f); else c.remove();
    })(t0);
  }

  function modal(html, mount) {
    var m = document.createElement('div'); m.className = 'modal'; m.innerHTML = html;
    document.body.appendChild(m); if (mount) mount(m);
    var f = $('button', m); if (f) f.focus({ preventScroll: true });
    return m;
  }

  // Botón de adultos: hay que mantenerlo presionado (los niños no entran por accidente)
  function botonAdulto() {
    return '<button class="adult" id="adultBtn" aria-label="Panel docente: mantén presionado para entrar"><svg class="ring" viewBox="0 0 64 64" aria-hidden="true"><circle cx="32" cy="32" r="30"/></svg>' + ui('lock') + '</button>';
  }
  function montarAdulto(root) {
    var b = $('#adultBtn', root); if (!b) return;
    var t = null;
    var start = function (e) { e.preventDefault(); b.classList.add('holding'); t = setTimeout(function () { b.classList.remove('holding'); go('/docente'); }, 1800); };
    var stop = function () { clearTimeout(t); b.classList.remove('holding'); };
    b.addEventListener('pointerdown', start); b.addEventListener('pointerup', stop); b.addEventListener('pointerleave', stop); b.addEventListener('pointercancel', stop);
    b.addEventListener('keydown', function (e) { if (e.key === 'Enter') go('/docente'); });
  }

  function botonSonido() {
    return '<button class="pbtn ' + (S.silencio ? 'mute' : '') + '" id="sndBtn" aria-pressed="' + !S.silencio + '" aria-label="' + (S.silencio ? 'Activar sonido' : 'Silenciar') + '">' + ui(S.silencio ? 'mute' : 'sound') + '</button>';
  }
  function montarSonido(root) {
    var b = $('#sndBtn', root); if (!b) return;
    b.onclick = function () {
      S.silencio = !S.silencio; save(); aplicarAudio(); A.callar();
      b.outerHTML = botonSonido(); montarSonido(root);
      if (!S.silencio) A.sfx('toque');
    };
  }

  function turnoBadge() {
    if (!S.ajustes.parejas) return '';
    var t = (S.turno || 0) % 2;
    return '<div class="turn" aria-label="Turno: maneja el niño ' + (t + 1) + '">' + kidSVG('#2f7ff0', t === 0 ? 'mano' : 'ojo') + kidSVG('#ff8a1f', t === 1 ? 'mano' : 'ojo') + '</div>';
  }

  /* =========================================================
   * Enrutador
   * ======================================================= */
  var app = null, current = '/';
  function ruta() { var h = (location.hash || '').replace(/^#/, ''); return h || current || '/'; }
  function go(p) { current = p; try { if (location.hash !== '#' + p) { location.hash = p; return; } } catch (e) { /* */ } render(); }
  window.addEventListener('hashchange', function () { current = ruta(); render(); });

  function render() {
    A.callar(); limpiar();
    var p = ruta(), m;
    document.body.classList.toggle('adulto', /^\/(docente|tarjetas)/.test(p));
    if (p === '/' || p === '') return pantallaInicio();
    if (p === '/mapa') return pantallaMapa();
    if ((m = p.match(/^\/reto\/([\w-]+)$/))) return pantallaReto(m[1]);
    if (p === '/final') return pantallaFinal();
    if (p === '/docente') return pantallaDocente();
    if (p === '/tarjetas') return pantallaTarjetas();
    go('/');
  }

  /* =========================================================
   * Inicio
   * ======================================================= */
  function pantallaInicio() {
    var letras = [['B', '#2f7ff0', '-6deg'], ['L', '#f7b500', '4deg'], ['O', '#18a34a', '-3deg'], ['C', '#ff8a1f', '5deg'], ['K', '#8b5cf6', '-4deg']];
    app.innerHTML =
      '<div class="top">' + botonSonido() + '<div class="grow"></div></div>' +
      '<main class="start">' +
      '<div class="cloud" style="width:180px;height:46px;left:8%;top:6%"></div><div class="cloud" style="width:130px;height:36px;right:12%;top:12%"></div>' +
      '<span class="floating-block" style="background:#2f7ff0;left:44%;top:14%;--r:-10deg"></span><span class="floating-block" style="background:#ff8a1f;left:6%;bottom:26%;--r:12deg;animation-delay:-2s"></span><span class="floating-block" style="background:#f7b500;right:6%;bottom:30%;--r:-6deg;animation-delay:-1s"></span>' +
      '<svg class="hills" viewBox="0 0 1200 200" preserveAspectRatio="none" aria-hidden="true"><path d="M0 120 Q200 40 420 110 T820 100 T1200 90 V200 H0Z" fill="#bfeccf"/><path d="M0 160 Q300 100 600 150 T1200 140 V200 H0Z" fill="#a6e2bd"/></svg>' +
      '<div class="left"><h1 class="logo" aria-label="Block Kids"><span class="row">' + letras.map(function (l) { return '<span class="lt" style="background:' + l[1] + ';--r:' + l[2] + '">' + l[0] + '</span>'; }).join('') + '</span>' +
      '<span class="kids" aria-hidden="true"><span>K</span><span>i</span><span>d</span><span>s</span></span></h1>' +
      '<div class="play-row"><button class="pbtn big green pulse" id="playBtn" aria-label="Jugar">' + ui('play') + '</button></div></div>' +
      '<div class="hero"><button id="botBtn" aria-label="Saludar a BitBot" style="background:none">' + bot('bot-big') + '</button></div>' +
      botonAdulto() + '</main>';
    montarSonido(app); montarAdulto(app);
    $('#playBtn').onclick = function () { A.desbloquear(); A.sfx('bien'); go('/mapa'); };
    $('#botBtn').onclick = function () { A.desbloquear(); A.sfx('toque'); A.decir(VOZ.inicio); };
  }

  /* =========================================================
   * Mapa de retos
   * ======================================================= */
  function posiciones() {
    var total = N.length + 1;
    return Array.from({ length: total }, function (_, i) {
      return { x: 5 + i * (90 / (total - 1)), y: 54 + 24 * Math.sin(i * 0.82 + 0.4) };
    });
  }
  function caminoSVG(P) {
    var d = 'M' + P[0].x * 10 + ' ' + P[0].y * 10 * 0.526;
    for (var i = 0; i < P.length - 1; i++) {
      var p0 = P[Math.max(0, i - 1)], p1 = P[i], p2 = P[i + 1], p3 = P[Math.min(P.length - 1, i + 2)];
      var k = 1 / 6, Y = 10 * 0.526;
      d += ' C' + (p1.x + (p2.x - p0.x) * k) * 10 + ' ' + (p1.y + (p2.y - p0.y) * k) * Y + ' ' + (p2.x - (p3.x - p1.x) * k) * 10 + ' ' + (p2.y - (p3.y - p1.y) * k) * Y + ' ' + p2.x * 10 + ' ' + p2.y * Y;
    }
    return d;
  }
  function pantallaMapa() {
    var P = posiciones(), sig = siguiente(), maxE = N.length * 3, tE = totalEstrellas();
    var zonas = BK.MODULOS.map(function (m) {
      var ids = N.map(function (n, i) { return n.modulo === m.id ? i : -1; }).filter(function (i) { return i >= 0; });
      var x0 = P[ids[0]].x - 3.2, x1 = P[ids[ids.length - 1]].x + 3.2;
      return '<div class="zone" style="left:' + x0 + '%;width:' + (x1 - x0) + '%;background:' + m.color + '"></div>' +
        '<div class="zone-ic" style="left:' + ((x0 + x1) / 2) + '%;background:' + m.color + '" title="Módulo ' + m.id + ': ' + m.nombre + '">' + ui(m.icono) + '</div>';
    }).join('');
    var nodos = N.map(function (n, i) {
      var p = P[i], mod = BK.MODULOS[n.modulo - 1], ab = abierto(i), done = hecho(n.id), cur = i === sig && ab;
      var cls = 'node' + (ab ? '' : ' locked') + (cur ? ' current' : '');
      var est = done ? '<span class="mini-stars">' + [1, 2, 3].map(function (k) { return starSVG(k <= estrellas(n.id)); }).join('') + '</span>' : '';
      return '<div class="' + cls + '" style="left:' + p.x + '%;top:' + p.y + '%">' + (cur ? '<div class="bot-here">' + bot() + '</div>' : '') +
        '<button class="pbtn" data-go="' + n.id + '"' + (ab ? ' style="--c:' + mod.color + ';--cd:rgba(0,0,0,.22);color:#fff"' : '') + ' ' + (ab ? '' : 'disabled') + ' aria-label="Reto ' + n.id + (done ? ', superado' : ab ? '' : ', bloqueado') + '">' + ui(ab ? mod.icono : 'lock') + '</button>' + est + '</div>';
    }).join('');
    var pt = P[P.length - 1], todo = sig >= N.length;
    var trofeo = '<div class="node trophy' + (todo ? ' current' : ' locked') + '" style="left:' + pt.x + '%;top:' + pt.y + '%"><button class="pbtn" id="trofeo" ' + (todo ? '' : 'disabled') + ' aria-label="Trofeo final">' + ui(todo ? 'trofeo' : 'lock') + '</button></div>';
    app.innerHTML =
      '<div class="top"><button class="pbtn" id="homeBtn" aria-label="Inicio">' + ui('home') + '</button>' + botonSonido() +
      '<div class="grow"><div class="pill" aria-label="' + tE + ' de ' + maxE + ' estrellas"><span class="stars-n">' + starSVG(true) + tE + '</span><span class="bar"><i style="width:' + (Math.min(sig, N.length) / N.length * 100) + '%"></i></span>' + ui('trofeo') + '</div></div>' + turnoBadge() + '</div>' +
      '<div class="mapwrap"><div class="map"><svg class="path" viewBox="0 0 1000 526" preserveAspectRatio="none" aria-hidden="true">' +
      '<path d="' + caminoSVG(P) + '" fill="none" stroke="#9fdcb7" stroke-width="34" stroke-linecap="round"/>' +
      '<path d="' + caminoSVG(P) + '" fill="none" stroke="#fff" stroke-width="10" stroke-linecap="round" stroke-dasharray="2 26"/></svg>' +
      zonas + nodos + trofeo + '</div></div>' + botonAdulto();
    montarSonido(app); montarAdulto(app);
    $('#homeBtn').onclick = function () { go('/'); };
    $$('[data-go]').forEach(function (b) { b.onclick = function () { A.desbloquear(); A.sfx('toque'); go('/reto/' + b.getAttribute('data-go')); }; });
    if (todo) $('#trofeo').onclick = function () { go('/final'); };
    timer(function () { A.decir(todo ? VOZ.final : VOZ.mapa); }, 350);
    var cur = $('.node.current'); if (cur) timer(function () { cur.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' }); }, 200);
  }

  /* =========================================================
   * Tablero (componente)
   * ======================================================= */
  function Tablero(cont, tablero, opt) {
    opt = opt || {};
    var m = M.mundo(tablero);
    var tiles = '';
    for (var y = 0; y < m.h; y++) for (var x = 0; x < m.w; x++) {
      var c = m.tiles[y][x], cls = 'tile' + (c === 'W' ? ' water' : '') + (c === 'G' ? ' goal' : '') + (x === m.start.x && y === m.start.y ? ' start' : '');
      tiles += '<div class="' + cls + '">' + (DECO[c] || '') + '</div>';
    }
    cont.innerHTML = '<div class="board" style="--cols:' + m.w + '" role="img" aria-label="Tablero: BitBot debe llegar a la estrella">' + tiles +
      '<div class="avatar" data-dir="' + m.start.dir + '"><div class="facing"></div><div class="bob">' + bot() + '</div><div class="bubble">?</div></div></div>';
    var el = $('.board', cont), av = $('.avatar', el);
    function place(s, instant) {
      if (instant) av.style.transition = 'none';
      av.style.setProperty('--x', s.x); av.style.setProperty('--y', s.y); av.style.setProperty('--dir', s.dir);
      av.dataset.dir = ((s.dir % 4) + 4) % 4;
      var d = M.DIRS[((s.dir % 4) + 4) % 4]; av.style.setProperty('--dx', d[0]); av.style.setProperty('--dy', d[1]);
      if (instant) { void av.offsetWidth; av.style.transition = ''; }
    }
    function anim(cls) { ['walk', 'jump', 'turn', 'bump', 'sink', 'happy', 'confused'].forEach(function (k) { av.classList.remove(k); }); void av.offsetWidth; if (cls) av.classList.add(cls); }
    var dirAcum = m.start.dir;
    function reset(instant) { dirAcum = m.start.dir; anim(null); place(m.start, instant); }
    function fit() {
      var W = cont.clientWidth - (opt.pad || 48), H = cont.clientHeight - (opt.pad || 48);
      var cell = Math.floor(Math.min(W / (m.w + 0.4), H / (m.h + 0.4), opt.max || 132));
      cell = Math.max(opt.min || 44, cell);
      el.style.setProperty('--cell', cell + 'px'); el.style.setProperty('--gap', Math.max(4, Math.round(cell * 0.08)) + 'px');
    }
    var ro = window.ResizeObserver ? new ResizeObserver(fit) : null;
    if (ro) ro.observe(cont); else window.addEventListener('resize', fit);
    alLimpiar(function () { if (ro) ro.disconnect(); else window.removeEventListener('resize', fit); });
    fit(); reset(true);
    return {
      m: m, el: el, av: av, reset: reset, anim: anim, fit: fit,
      // Los giros se acumulan para que la flecha gire siempre por el lado corto
      step: function (p) {
        var target = p.dir, cur = ((dirAcum % 4) + 4) % 4, diff = target - cur;
        if (diff === 3) diff = -1; if (diff === -3) diff = 1;
        dirAcum += diff;
        place({ x: p.x, y: p.y, dir: dirAcum });
      }
    };
  }

  // Anima la ejecución de un programa en el tablero
  async function ejecutar(B, programa, C, hooks) {
    hooks = hooks || {};
    var r = M.simular(B.m, programa), dur = A.lenta ? 860 : 640;
    B.reset(); await sleep(260);
    for (var i = 0; i < r.pasos.length; i++) {
      if (C.abortar || !B.el.isConnected) return { abortado: true };
      var p = r.pasos[i];
      if (hooks.paso) hooks.paso(p, i);
      if (p.accion === 'girar') { B.step(p); B.anim('turn'); A.sfx('girar'); }
      else if (p.accion === 'choque') { B.anim('bump'); A.sfx('choque'); }
      else { B.step(p); B.anim(p.accion === 'saltar' ? 'jump' : 'walk'); A.sfx(p.accion === 'saltar' ? 'salto' : 'paso'); }
      await sleep(dur);
      if (p.fallo === 'agua') { B.anim('sink'); A.sfx('agua'); await sleep(700); }
    }
    if (hooks.fin) hooks.fin();
    return r;
  }

  /* =========================================================
   * Arrastrar y soltar (ratón y pantalla táctil)
   * ======================================================= */
  function arrastre(root, api) {
    var st = null;
    root.addEventListener('pointerdown', function (e) {
      var el = e.target.closest('[data-drag]');
      if (!el || !root.contains(el) || (e.button && e.button !== 0) || !api.puede()) return;
      e.preventDefault();
      st = { el: el, x: e.clientX, y: e.clientY, id: e.pointerId, movido: false, src: { de: el.getAttribute('data-from'), t: el.getAttribute('data-t'), i: Number(el.getAttribute('data-i')) } };
      try { el.setPointerCapture(e.pointerId); } catch (_) { /* */ }
      A.desbloquear();
    });
    root.addEventListener('pointermove', function (e) {
      if (!st || e.pointerId !== st.id) return;
      if (!st.movido && Math.hypot(e.clientX - st.x, e.clientY - st.y) > 8) {
        st.movido = true;
        var r = st.el.getBoundingClientRect();
        st.g = st.el.cloneNode(true); st.g.removeAttribute('data-drag'); st.g.classList.add('drag-ghost');
        st.g.style.width = r.width + 'px'; st.g.style.height = r.height + 'px';
        document.body.appendChild(st.g);
        if (st.src.de === 'prog') st.el.classList.add('lifting');
        A.sfx('toque');
      }
      if (st.movido) {
        e.preventDefault();
        st.g.style.left = e.clientX + 'px'; st.g.style.top = e.clientY + 'px';
        st.t = api.destino(e.clientX, e.clientY, st.src); api.marcar(st.t);
      }
    });
    function fin(e, cancelar) {
      if (!st || e.pointerId !== st.id) return;
      var s = st; st = null;
      if (s.g) s.g.remove();
      s.el.classList.remove('lifting'); api.marcar(null);
      if (cancelar) return;
      if (!s.movido) api.tocar(s.src, s.el); else api.soltar(s.src, s.t);
    }
    root.addEventListener('pointerup', function (e) { fin(e, false); });
    root.addEventListener('pointercancel', function (e) { fin(e, true); });
    root.addEventListener('keydown', function (e) {
      var el = e.target.closest && e.target.closest('[data-drag]'); if (!el || !api.puede()) return;
      var src = { de: el.getAttribute('data-from'), t: el.getAttribute('data-t'), i: Number(el.getAttribute('data-i')) };
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); api.tocar(src, el); }
      if ((e.key === 'Delete' || e.key === 'Backspace') && src.de === 'prog' && api.borrar) { e.preventDefault(); api.borrar(src); }
    });
  }
  function dentro(el, x, y, pad) { if (!el) return false; var r = el.getBoundingClientRect(); pad = pad || 0; return x >= r.left - pad && x <= r.right + pad && y >= r.top - pad && y <= r.bottom + pad; }

  /* =========================================================
   * Pantalla de reto (marco común)
   * ======================================================= */
  function pantallaReto(id) {
    var i = idx(id); if (i < 0 || !abierto(i)) return go('/mapa');
    var n = N[i], mod = BK.MODULOS[n.modulo - 1];
    var hermanos = N.filter(function (x) { return x.modulo === n.modulo; });
    var C = { n: n, i: i, intentos: 0, errores: 0, abortar: false, ayuda: function () { } };
    alLimpiar(function () { C.abortar = true; });
    app.innerHTML =
      '<div class="top"><button class="pbtn" id="mapBtn" aria-label="Volver al mapa">' + ui('mapa') + '</button>' + botonSonido() +
      '<button class="pbtn yellow" id="helpBtn" aria-label="Ayuda">' + ui('help') + '</button>' +
      '<div class="grow"><div class="pill"><span class="modchip" style="background:' + mod.color + '">' + ui(mod.icono) + '</span><span class="dots" aria-label="Reto ' + (hermanos.indexOf(n) + 1) + ' de ' + hermanos.length + ' del módulo">' +
      hermanos.map(function (h) { return '<i class="' + (h.id === n.id ? 'now' : hecho(h.id) ? 'on' : '') + '"></i>'; }).join('') + '</span></div></div>' + turnoBadge() + '</div>' +
      '<main id="level"></main>';
    montarSonido(app);
    $('#mapBtn').onclick = function () { go('/mapa'); };
    $('#helpBtn').onclick = function () { A.desbloquear(); C.ayuda(); };
    var lv = $('#level');
    var iniciar = { simbolos: retoSimbolos, mesa: retoMesa, replicar: retoProgramar, jugar: retoProgramar }[n.tipo];
    var arrancar = function () { iniciar(lv, C); };
    if (S.ajustes.parejas && (S.turnoVisto || 0) !== (S.turno || 0) && S.turno > 0) {
      S.turnoVisto = S.turno; save();
      var t = S.turno % 2;
      var mm = modal('<div class="turn-pop" role="status" aria-label="Cambio de turno">' + kidSVG('#2f7ff0', t === 0 ? 'mano' : 'ojo') + '<span class="swap">' + ui('swap') + '</span>' + kidSVG('#ff8a1f', t === 1 ? 'mano' : 'ojo') + '</div>');
      A.sfx('desbloqueo'); A.decir(VOZ.turno);
      arrancar();
      timer(function () { mm.remove(); }, 1900);
    } else arrancar();
  }

  function victoria(C, est) {
    guardar(C.n.id, est, C);
    confeti(); A.sfx('victoria');
    timer(function () { A.decir(VOZ.exito[Math.floor(Math.random() * VOZ.exito.length)]); }, 600);
    var sig = N[C.i + 1];
    modal('<div class="win" role="dialog" aria-label="¡Reto superado! ' + est + ' estrellas">' +
      '<div class="stars">' + [1, 2, 3].map(function (k) { return starSVG(k <= est); }).join('') + '</div>' +
      bot('bot happy') +
      '<div class="actions"><button class="pbtn orange" id="again" aria-label="Repetir el reto">' + ui('replay') + '</button>' +
      '<button class="pbtn big green pulse" id="nextLv" aria-label="Siguiente">' + ui('play') + '</button></div></div>',
      function (m) {
        [1, 2, 3].forEach(function (k) { if (k <= est) setTimeout(function () { A.sfx('estrella'); }, 250 + k * 200); });
        $('#again', m).onclick = function () { render(); };
        $('#nextLv', m).onclick = function () { go(sig ? '/reto/' + sig.id : '/final'); };
      });
  }
  function estrellasPor(errores, a, b) { return errores <= a ? 3 : errores <= b ? 2 : 1; }

  /* =========================================================
   * Módulo 1 · El tablero de símbolos
   * ======================================================= */
  var DEMOS = {
    avanzar: { mapa: ['S..'], dir: 1, prog: ['avanzar'] },
    derecha: { mapa: ['S'], dir: 0, prog: ['derecha'] },
    izquierda: { mapa: ['S'], dir: 0, prog: ['izquierda'] },
    saltar: { mapa: ['SW.'], dir: 1, prog: ['saltar'] },
    repetir: { mapa: ['S..'], dir: 1, prog: [{ t: 'repetir', n: 2 }, 'avanzar'] },
    bandera: { mapa: ['S.'], dir: 1, prog: ['avanzar'] }
  };
  function retoSimbolos(lv, C) {
    var rondas = C.n.rondas, r = 0, fase = 'busca';
    lv.className = 'level no-palette';
    lv.innerHTML = '<section class="stage" id="stage"></section><footer class="dock" id="dock"></footer>';
    var stage = $('#stage'), dock = $('#dock'), demoLoop = null;
    alLimpiar(function () { demoLoop && clearInterval(demoLoop); });

    function mostrar() {
      var t = rondas[r]; fase = 'busca';
      stage.innerHTML = '<div class="sym"><div class="card10" aria-label="Tarjeta: ' + BK.BLOQUES[t].nombre + '">' + blk(t, { n: t === 'repetir' ? 2 : false }) + '</div><div id="demo" class="demo"></div></div>';
      dock.innerHTML = '<div style="flex:1;display:flex;align-items:center;gap:16px;justify-content:center;color:var(--orange)">' + '<span style="width:84px;height:84px">' + ui('mesa') + '</span><span style="width:64px;height:64px;color:var(--blue)">' + ui('mano') + '</span>' +
        '<span class="dots" style="margin-left:20px">' + rondas.map(function (_, k) { return '<i class="' + (k < r ? 'on' : k === r ? 'now' : '') + '"></i>'; }).join('') + '</span></div>' +
        '<button class="pbtn big green" id="found" aria-label="Ya encontré la tarjeta">' + ui('check') + '</button>';
      var d = DEMOS[t], B = Tablero($('#demo'), { mapa: d.mapa, dir: d.dir }, { max: 110, pad: 16 });
      var correr = function () { if (C.abortar) return; ejecutar(B, d.prog, C).then(function () { if (t === 'bandera') B.anim('happy'); }); };
      demoLoop && clearInterval(demoLoop);
      timer(correr, 700); demoLoop = setInterval(correr, 3200);
      A.sfx('desbloqueo');
      A.decir(VOZ.simbolos.mira + ' ' + BK.BLOQUES[t].voz + ' ' + VOZ.simbolos.busca);
      timer(function () { var f = $('#found'); if (f) f.classList.add('pulse'); }, 7000);
      $('#found').onclick = elegir;
      C.ayuda = function () { A.decir(BK.BLOQUES[t].voz + ' ' + VOZ.simbolos.busca); efecto($('#found'), 'glow'); };
    }
    function elegir() {
      var t = rondas[r]; fase = 'toca';
      demoLoop && clearInterval(demoLoop);
      var otros = Object.keys(BK.BLOQUES).filter(function (k) { return k !== t; });
      otros.sort(function () { return Math.random() - .5; });
      var ops = [t, otros[0], otros[1]].sort(function () { return Math.random() - .5; });
      stage.innerHTML = '<div class="choices" role="group" aria-label="Toca la tarjeta igual">' + ops.map(function (o) { return '<button class="choice" data-o="' + o + '" aria-label="' + BK.BLOQUES[o].nombre + '">' + blk(o, { n: o === 'repetir' ? 2 : false }) + '</button>'; }).join('') + '</div>';
      dock.innerHTML = '<div style="flex:1;display:flex;justify-content:center"><span class="dots">' + rondas.map(function (_, k) { return '<i class="' + (k < r ? 'on' : k === r ? 'now' : '') + '"></i>'; }).join('') + '</span></div>';
      A.decir(VOZ.simbolos.toca);
      var bloqueado = false;
      $$('.choice', stage).forEach(function (b) {
        b.onclick = function () {
          if (bloqueado) return;
          if (b.getAttribute('data-o') === t) {
            bloqueado = true; b.classList.add('ok'); A.sfx('bien'); A.decir(VOZ.simbolos.bien);
            timer(function () { r++; if (r < rondas.length) mostrar(); else victoria(C, estrellasPor(C.errores, 0, 2)); }, 1300);
          } else { C.errores++; efecto(b, 'shake'); A.sfx('mal'); A.decir(VOZ.simbolos.mal); }
        };
      });
      C.ayuda = function () { A.decir(VOZ.simbolos.toca + ' ' + BK.BLOQUES[t].voz); efecto($('.choice[data-o="' + t + '"]', stage), 'glow'); };
    }
    C.intentos = 1;
    mostrar();
  }

  /* =========================================================
   * Módulo 2 · El reto del avatar (con tarjetas en la mesa)
   * ======================================================= */
  function retoMesa(lv, C) {
    var sol = C.n.tablero.solucion, noes = 0;
    lv.className = 'level no-palette';
    lv.innerHTML = '<section class="stage" id="stage"><div id="boardBox" style="position:absolute;inset:0;display:grid;place-items:center"></div>' +
      '<div style="position:absolute;left:16px;top:16px;display:flex;gap:8px;background:#fff;border-radius:22px;padding:10px 14px;box-shadow:0 6px 16px rgba(31,42,68,.12);color:var(--orange)" aria-label="Modo pausa: arma la ruta en tu mesa"><span style="width:44px;height:44px;color:var(--muted)">' + ui('pausa') + '</span><span style="width:52px;height:52px">' + ui('mesa') + '</span></div></section>' +
      '<footer class="dock"><div class="strip" id="strip" aria-label="Tarjetas de la ruta"></div><div class="tools" id="tools"></div></footer>';
    var B = Tablero($('#boardBox'), C.n.tablero), strip = $('#strip'), tools = $('#tools');
    function vacias() { strip.innerHTML = blk('bandera', { cls: 'fixed' }) + sol.map(function () { return outline(); }).join(''); }
    function armar() {
      vacias(); B.reset();
      tools.innerHTML = '<button class="pbtn big green" id="probar" aria-label="Probar la ruta">' + ui('bandera') + '</button>';
      $('#probar').onclick = revelar;
      timer(function () { var p = $('#probar'); if (p) p.classList.add('pulse'); }, 9000);
      C.ayuda = function () { A.decir(VOZ.mesa.intro); efecto(B.el.querySelector('.tile.goal'), 'glow'); };
    }
    async function revelar() {
      C.intentos++;
      tools.innerHTML = '';
      vacias();
      var slots = $$('.slot', strip), mostrados = {};
      await ejecutar(B, sol, C, {
        paso: function (p) {
          var k = p.op.src; if (mostrados[k]) return; mostrados[k] = true;
          var b = M.norm(sol[k]); slots[k].outerHTML = blk(b.t, { n: b.n, cls: 'running' });
          setTimeout(function () { var x = strip.children[k + 1]; if (x) x.classList.remove('running'); }, 500);
        }
      });
      if (C.abortar) return;
      B.anim('happy'); A.sfx('bien');
      tools.innerHTML = '<div class="compare"><button class="pbtn big green" id="si" aria-label="Mis tarjetas están igual">' + ui('up') + '</button><button class="pbtn big red" id="no" aria-label="Mis tarjetas son diferentes">' + ui('down') + '</button></div>' +
        '<button class="pbtn" id="otra" aria-label="Ver otra vez">' + ui('replay') + '</button>';
      A.decir(VOZ.mesa.mira);
      $('#si').onclick = function () { victoria(C, noes === 0 ? 3 : noes === 1 ? 2 : 1); };
      $('#no').onclick = function () { noes++; C.errores++; A.sfx('mal'); A.decir(VOZ.mesa.no); armar(); };
      $('#otra').onclick = function () { revelar(); };
      C.ayuda = function () { A.decir(VOZ.mesa.mira); };
    }
    armar();
    timer(function () { A.decir(VOZ.mesa.intro); }, 500);
  }

  /* =========================================================
   * Módulos 3 y 4 · Zona de programación y ¡A jugar!
   * ======================================================= */
  function retoProgramar(lv, C) {
    var n = C.n, replicar = n.tipo === 'replicar';
    var sol = n.tablero.solucion.map(M.norm);
    var paleta = replicar ? ['avanzar', 'derecha', 'izquierda', 'saltar'] : n.paleta;
    var max = replicar ? sol.length : (n.maximo || 8);
    // En "replicar" el programa tiene casillas fijas; en "jugar" es una lista libre
    var prog = replicar ? sol.map(function () { return null; }) : (n.inicial || []).map(M.norm);
    var historia = [];
    lv.className = 'level';
    lv.innerHTML =
      '<aside class="palette" id="palette" aria-label="Bloques">' + paleta.map(function (t) {
        return blk(t, { tag: 'button', attrs: 'data-drag data-from="pal" aria-label="Bloque ' + BK.BLOQUES[t].nombre + '"', n: t === 'repetir' ? 2 : undefined });
      }).join('') + '</aside>' +
      '<section class="stage" id="stage"></section>' +
      '<footer class="dock"><div class="strip" id="strip" aria-label="Programa"></div>' +
      '<div class="tools">' + (replicar ? '' : '<button class="pbtn" id="undo" aria-label="Deshacer">' + ui('undo') + '</button><button class="pbtn trash" id="trash" aria-label="Borrar todo o soltar aquí para quitar">' + ui('trash') + '</button>') +
      '<button class="pbtn big green" id="run" aria-label="Ejecutar con la bandera verde">' + ui('bandera') + '</button></div></footer>';
    var B = Tablero($('#stage'), n.tablero), strip = $('#strip'), runBtn = $('#run'), trash = $('#trash');

    function pintar() {
      var h = blk('bandera', { cls: 'fixed', attrs: 'aria-label="Bandera verde: inicio"' });
      if (replicar) {
        h += sol.map(function (b, i) {
          if (prog[i]) return blk(prog[i].t, { tag: 'button', n: prog[i].n, attrs: 'data-drag data-from="prog" data-i="' + i + '" aria-label="' + BK.BLOQUES[prog[i].t].nombre + '"' });
          return '<span class="slot" data-slot="' + i + '"><span class="ghost">' + blk(b.t, { n: b.n }) + '</span></span>';
        }).join('');
      } else {
        h += prog.map(function (b, i) {
          var rep = i > 0 && prog[i - 1].t === 'repetir';
          return blk(b.t, { tag: 'button', n: b.n, cls: rep ? 'rep-target' : '', attrs: 'data-drag data-from="prog" data-i="' + i + '" aria-label="' + BK.BLOQUES[b.t].nombre + (b.t === 'repetir' ? ' ' + b.n + ' veces' : '') + '"' });
        }).join('');
        var libres = max - prog.length;
        if (libres > 0) h += n.maximo ? new Array(libres + 1).join(outline('free')) : outline('free');
      }
      strip.innerHTML = h;
      var lleno = replicar ? prog.every(Boolean) : prog.length > 0;
      runBtn.classList.toggle('pulse', lleno && !C.corriendo);
    }
    function guardarHistoria() { historia.push(JSON.stringify(prog)); if (historia.length > 40) historia.shift(); }
    function lleno() { A.sfx('mal'); efecto(strip, 'shake'); A.decir(n.maximo ? VOZ.jugar.repetir : '¡Ya no caben más bloques!'); }
    function limpiarMarcas() { $$('.blk.bad, .blk.suspect', strip).forEach(function (b) { b.classList.remove('bad', 'suspect'); }); }

    // ---- operaciones del programa ----
    function agregar(pos, t) {
      if (replicar) return colocar(pos, t);
      if (prog.length >= max) return lleno();
      guardarHistoria(); prog.splice(pos, 0, { t: t, n: t === 'repetir' ? 2 : undefined }); A.sfx('encaje'); pintar();
    }
    function colocar(i, t) {
      if (i == null || i < 0) i = prog.indexOf(null);
      if (i < 0) return lleno();
      if (sol[i].t !== t) {
        C.errores++; A.sfx('mal'); A.decir(VOZ.replicar.mal);
        efecto(strip.querySelector('[data-slot="' + i + '"]'), 'shake'); return;
      }
      prog[i] = { t: t, n: sol[i].n }; A.sfx('encaje'); pintar();
      if (prog.every(Boolean)) { A.decir(VOZ.replicar.listo); efecto(runBtn, 'glow'); }
    }
    function quitar(i) {
      if (replicar) { prog[i] = null; A.sfx('quitar'); pintar(); return; }
      guardarHistoria(); prog.splice(i, 1); A.sfx('quitar'); pintar();
    }
    function mover(from, to) { guardarHistoria(); var b = prog.splice(from, 1)[0]; if (to > from) to--; prog.splice(to, 0, b); A.sfx('encaje'); pintar(); }
    function cambiar(i, t) { guardarHistoria(); prog[i] = { t: t, n: t === 'repetir' ? 2 : undefined }; A.sfx('encaje'); pintar(); }
    function intercambiar(a, b) { if (a === b) return; guardarHistoria(); var x = prog[a]; prog[a] = prog[b]; prog[b] = x; A.sfx('encaje'); pintar(); }

    arrastre(lv, {
      puede: function () { return !C.corriendo; },
      destino: function (x, y, src) {
        if (trash && dentro(trash, x, y, 8)) return { k: 'trash' };
        if (!dentro(strip, x, y, 44)) return src.de === 'prog' ? { k: 'fuera' } : null;
        if (replicar) {
          var slots = $$('[data-slot]', strip);
          for (var s = 0; s < slots.length; s++) if (dentro(slots[s], x, y, 6)) return { k: 'slot', i: Number(slots[s].getAttribute('data-slot')) };
          return src.de === 'pal' ? { k: 'slot', i: prog.indexOf(null) } : null;
        }
        var bl = $$('.blk[data-from="prog"]', strip);
        for (var i = 0; i < bl.length; i++) {
          var r = bl[i].getBoundingClientRect();
          if (x < r.left + r.width * 0.3) return { k: 'insertar', i: i };
          if (x <= r.right - r.width * 0.3) return { k: 'cambiar', i: i };
        }
        return { k: 'insertar', i: bl.length };
      },
      marcar: function (t) {
        $$('.caret', strip).forEach(function (c) { c.remove(); });
        $$('.drop-replace', strip).forEach(function (c) { c.classList.remove('drop-replace'); });
        $$('[data-slot].target', strip).forEach(function (c) { c.classList.remove('target'); });
        if (trash) trash.classList.toggle('target', !!t && t.k === 'trash');
        strip.classList.toggle('target', !!t && t.k !== 'trash' && t.k !== 'fuera');
        if (!t) return;
        if (t.k === 'cambiar') { var b = strip.querySelector('.blk[data-i="' + t.i + '"]'); if (b) b.classList.add('drop-replace'); }
        if (t.k === 'insertar') {
          var c = document.createElement('span'); c.className = 'caret';
          var ref = strip.querySelector('.blk[data-i="' + t.i + '"]') || strip.querySelector('.slot.free');
          if (ref) strip.insertBefore(c, ref); else strip.appendChild(c);
        }
        if (t.k === 'slot' && t.i >= 0) { var sl = strip.querySelector('[data-slot="' + t.i + '"]'); if (sl) sl.classList.add('target'); }
      },
      soltar: function (src, t) {
        limpiarMarcas();
        if (!t) return;
        if (t.k === 'trash' || t.k === 'fuera') { if (src.de === 'prog') quitar(src.i); return; }
        if (replicar) { if (src.de === 'pal') colocar(t.i, src.t); return; }
        if (t.k === 'insertar') { if (src.de === 'pal') agregar(t.i, src.t); else mover(src.i, t.i); }
        if (t.k === 'cambiar') { if (src.de === 'pal') cambiar(t.i, src.t); else intercambiar(src.i, t.i); }
      },
      tocar: function (src, el) {
        limpiarMarcas();
        if (src.de === 'pal') { if (replicar) colocar(null, src.t); else agregar(prog.length, src.t); return; }
        var b = prog[src.i];
        if (!replicar && b && b.t === 'repetir') {
          guardarHistoria(); b.n = b.n >= 4 ? 2 : b.n + 1; A.sfx('toque'); pintar();
          A.decir(['', '', 'dos', 'tres', 'cuatro'][b.n] + ' veces');
        } else if (b) { efecto(el, 'glow'); A.decir(BK.BLOQUES[b.t].nombre); }
      },
      borrar: function (src) { quitar(src.i); }
    });

    if (!replicar) {
      $('#undo').onclick = function () { if (C.corriendo || !historia.length) return; prog = JSON.parse(historia.pop()); limpiarMarcas(); A.sfx('quitar'); pintar(); };
      trash.onclick = function () { if (C.corriendo || !prog.length) return; guardarHistoria(); prog = []; A.sfx('quitar'); pintar(); };
    }

    runBtn.onclick = async function () {
      A.desbloquear();
      if (C.corriendo) { C.abortar = true; return; }
      var programa = replicar ? prog : prog;
      if (replicar && !prog.every(Boolean)) { A.decir('Faltan bloques. ¡Completa el programa!'); efecto(strip.querySelector('[data-slot]'), 'shake'); return; }
      if (!programa.length) { A.decir(VOZ.jugar.vacio); efecto($('#palette .blk'), 'glow'); return; }
      limpiarMarcas();
      C.corriendo = true; C.abortar = false; C.intentos++;
      runBtn.innerHTML = ui('stop'); runBtn.classList.remove('pulse'); runBtn.classList.replace('green', 'red');
      var bloques = function () { return $$('.blk[data-from="prog"]', strip); };
      var r = await ejecutar(B, programa, C, {
        paso: function (p) {
          bloques().forEach(function (b, k) { b.classList.toggle('running', k === p.op.src || k === p.op.rep); });
        }
      });
      bloques().forEach(function (b) { b.classList.remove('running'); });
      if (!lv.isConnected) return;
      runBtn.innerHTML = ui('bandera'); runBtn.classList.replace('red', 'green');
      if (r.abortado) { C.corriendo = false; B.reset(); pintar(); return; }
      if (r.resultado === 'meta') {
        B.anim('happy');
        var est = n.depurar ? estrellasPor(C.errores, 1, 2) : estrellasPor(C.intentos - 1, 0, 1);
        if (replicar) est = estrellasPor(C.errores, 0, 2);
        C.corriendo = false;
        setTimeout(function () { if (lv.isConnected) victoria(C, est); }, 700);
        return;
      }
      C.errores++;
      B.anim('confused'); A.sfx('mal');
      var bl = bloques();
      if (r.bloque != null && bl[r.bloque]) {
        bl[r.bloque].classList.add('bad');
        for (var k = r.bloque - 1; k >= 0 && (prog[k].t === 'derecha' || prog[k].t === 'izquierda'); k--) bl[k].classList.add('suspect');
      } else efecto(strip.querySelector('.slot.free') || strip, 'shake');
      A.decir(VOZ.errores[r.resultado]);
      await sleep(2600);
      if (!lv.isConnected) return;
      B.anim(null); B.reset();
      C.corriendo = false; pintar();
      if (r.bloque != null) { var again = bloques()[r.bloque]; if (again) again.classList.add('bad'); }
    };

    C.ayuda = function () {
      var frase = replicar ? VOZ.replicar.intro : n.depurar ? VOZ.jugar.depurar : n.maximo ? VOZ.jugar.repetir : VOZ.jugar.intro;
      A.decir(frase);
      if (replicar) { var i = prog.indexOf(null); if (i >= 0) efecto($('#palette .blk[data-t="' + sol[i].t + '"]'), 'glow'); else efecto(runBtn, 'glow'); return; }
      for (var k = 0; k < sol.length; k++) {
        var p = prog[k];
        if (!p) { efecto($('#palette .blk[data-t="' + sol[k].t + '"]'), 'glow'); return; }
        if (p.t !== sol[k].t || (p.t === 'repetir' && p.n !== sol[k].n)) {
          efecto(strip.querySelector('.blk[data-i="' + k + '"]'), 'glow');
          setTimeout(function (t) { return function () { efecto($('#palette .blk[data-t="' + t + '"]'), 'glow'); }; }(sol[k].t), 1200);
          return;
        }
      }
      efecto(runBtn, 'glow');
    };

    pintar();
    timer(function () { C.ayuda.silencioso = true; A.decir(replicar ? VOZ.replicar.intro : n.depurar ? VOZ.jugar.depurar : n.maximo ? VOZ.jugar.repetir : VOZ.jugar.intro); }, 500);
  }

  /* =========================================================
   * Final
   * ======================================================= */
  function pantallaFinal() {
    var tE = totalEstrellas();
    app.innerHTML = '<div class="top"><button class="pbtn" id="mapBtn" aria-label="Volver al mapa">' + ui('mapa') + '</button>' + botonSonido() + '<div class="grow"></div></div>' +
      '<main class="start" style="grid-template-columns:1fr"><div class="hero"><div style="display:flex;align-items:flex-end;gap:20px"><span style="width:min(30vw,220px);color:var(--gold)">' + ui('trofeo') + '</span>' + bot('bot happy bot-big') + '</div>' +
      '<div class="pill" style="font-size:1.6rem"><span class="stars-n">' + starSVG(true) + tE + ' / ' + N.length * 3 + '</span></div>' +
      '<div style="display:flex;gap:16px"><button class="pbtn big green" id="again" aria-label="Volver al mapa">' + ui('mapa') + '</button></div></div></main>';
    montarSonido(app);
    $('#mapBtn').onclick = $('#again').onclick = function () { go('/mapa'); };
    confeti(); A.sfx('victoria'); timer(function () { A.decir(VOZ.final); }, 500);
  }

  /* =========================================================
   * Panel docente (para adultos: con texto)
   * ======================================================= */
  var TIPO = { simbolos: 'Reconocer símbolos', mesa: 'Ruta con tarjetas en la mesa', replicar: 'Pasar la ruta a bloques', jugar: 'Programar y depurar' };
  function pantallaDocente() {
    var sup = N.filter(function (n) { return hecho(n.id); }).length;
    var intentos = N.reduce(function (a, n) { return a + ((S.niveles[n.id] || {}).intentos || 0); }, 0);
    var errores = N.reduce(function (a, n) { return a + ((S.niveles[n.id] || {}).errores || 0); }, 0);
    var sw = function (id, on, label, help) { return '<div class="setrow"><span>' + label + '<small>' + help + '</small></span><button class="sw" role="switch" id="' + id + '" aria-checked="' + !!on + '" aria-label="' + label + '"></button></div>'; };
    app.innerHTML =
      '<div class="top"><button class="pbtn" id="back" aria-label="Volver al juego">' + ui('back') + '</button><div class="grow" style="justify-content:flex-start"><strong style="font-size:1.4rem">Panel docente</strong></div></div>' +
      '<main class="adult-page"><div class="wrap">' +
      '<section class="panel"><h2>Resumen de este dispositivo</h2><div class="kpis">' +
      '<div class="kpi"><b>' + sup + ' / ' + N.length + '</b><span>retos superados</span></div>' +
      '<div class="kpi"><b>' + totalEstrellas() + ' / ' + N.length * 3 + '</b><span>estrellas</span></div>' +
      '<div class="kpi"><b>' + intentos + ' · ' + errores + '</b><span>intentos · errores</span></div></div>' +
      '<p style="margin-top:12px">El progreso se guarda solo en este equipo, sin cuentas ni datos personales. Si los niños trabajan en parejas, cada equipo registra el avance de la pareja que lo usa.</p></section>' +
      '<section class="panel"><h2>Registro por reto</h2><div class="tbl-wrap"><table class="prog"><thead><tr><th>Reto</th><th>Módulo</th><th>Actividad</th><th>Estado</th><th>Estrellas</th><th>Intentos</th><th>Errores</th></tr></thead><tbody>' +
      N.map(function (n, i) {
        var p = S.niveles[n.id] || {}, mod = BK.MODULOS[n.modulo - 1];
        var estado = p.hecho ? 'Superado' : abierto(i) ? 'Disponible' : 'Bloqueado';
        return '<tr><td><b>' + n.id + '</b></td><td>' + mod.nombre + '</td><td>' + TIPO[n.tipo] + (n.depurar ? ' (con error)' : '') + '</td><td>' + estado + '</td><td class="st">' + (p.hecho ? [1, 2, 3].map(function (k) { return starSVG(k <= p.estrellas); }).join('') : '–') + '</td><td>' + (p.intentos || 0) + '</td><td>' + (p.errores || 0) + '</td></tr>';
      }).join('') + '</tbody></table></div></section>' +
      '<section class="panel"><h2>Ajustes</h2>' +
      sw('swVoz', S.ajustes.voz, 'Narración por voz', 'Lee las instrucciones en voz alta') +
      sw('swEf', S.ajustes.efectos, 'Efectos de sonido', 'Sonidos de bloques, choques y victoria') +
      sw('swLenta', S.ajustes.lenta, 'Modo lento', 'Voz y movimientos de BitBot más pausados') +
      sw('swPar', S.ajustes.parejas, 'Turnos en pareja', 'Muestra quién maneja (mano) y quién observa (ojo); cambia en cada reto') +
      sw('swTodo', S.ajustes.todo, 'Desbloquear todos los retos', 'Útil para demostraciones o para retomar un reto específico') +
      '</section>' +
      '<section class="panel"><h2>Material concreto</h2><p>Imprime el kit de tarjetas de 10 × 10 cm con los mismos colores e íconos de los bloques. Se recomienda cartulina y laminado.</p><div class="btnrow" style="margin-top:12px"><a class="tbtn primary" href="#/tarjetas">' + ui('print') + 'Tarjetas para imprimir</a></div></section>' +
      '<section class="panel"><h2>Cómo se usa cada módulo</h2>' +
      '<p><b>1. El tablero de símbolos.</b> La pantalla muestra un bloque, su sonido y lo que hace BitBot. El niño busca en su mesa la tarjeta igual y luego la toca en la pantalla.</p><br>' +
      '<p><b>2. El reto del avatar.</b> La pantalla muestra el tablero y entra en pausa: la pareja arma la ruta con tarjetas físicas. Con la bandera verde, BitBot recorre la ruta correcta y los niños comparan con su mesa (pulgar arriba o abajo).</p><br>' +
      '<p><b>3. Zona de programación.</b> Los niños arrastran los bloques a las casillas, replicando exactamente las tarjetas que armaron. Si un bloque no corresponde, rebota.</p><br>' +
      '<p><b>4. ¡A jugar!</b> Programación libre con prueba y error. Si BitBot choca o cae al agua, el bloque responsable se marca en rojo y los niños lo reemplazan. Hay retos que empiezan con un error para depurar.</p></section>' +
      '<section class="panel"><h2>Reiniciar</h2><p>Borra el progreso de este dispositivo (los ajustes se mantienen).</p><div class="btnrow" style="margin-top:12px"><button class="tbtn danger" id="reset">' + ui('trash') + 'Reiniciar progreso</button></div></section>' +
      '</div></main>';
    $('#back').onclick = function () { go('/mapa'); };
    var bind = function (id, key, after) {
      $('#' + id).onclick = function () { S.ajustes[key] = !S.ajustes[key]; save(); aplicarAudio(); this.setAttribute('aria-checked', String(S.ajustes[key])); if (after) after(); };
    };
    bind('swVoz', 'voz'); bind('swEf', 'efectos'); bind('swLenta', 'lenta'); bind('swPar', 'parejas'); bind('swTodo', 'todo');
    $('#reset').onclick = function () {
      modal('<div class="win" style="max-width:440px;text-align:center;gap:14px" role="dialog" aria-label="Confirmar"><h2 style="margin:0">¿Reiniciar el progreso?</h2><p style="margin:0;color:var(--muted)">Se borrarán las estrellas y el registro de todos los retos en este dispositivo.</p>' +
        '<div class="btnrow" style="justify-content:center"><button class="tbtn" id="no">Cancelar</button><button class="tbtn danger" id="si">Sí, reiniciar</button></div></div>', function (m) {
          $('#no', m).onclick = function () { m.remove(); };
          $('#si', m).onclick = function () { var aj = S.ajustes; S = fresh(); S.ajustes = aj; save(); m.remove(); render(); };
        });
    };
  }

  /* =========================================================
   * Tarjetas para imprimir (10 × 10 cm)
   * ======================================================= */
  function pantallaTarjetas() {
    var kit = [['bandera', 2], ['avanzar', 8], ['derecha', 4], ['izquierda', 4], ['saltar', 3], ['repetir', 3]];
    var cards = [];
    kit.forEach(function (k) { for (var i = 0; i < k[1]; i++) cards.push(k[0] === 'repetir' ? { t: 'repetir', n: [2, 3, 4][i % 3] } : { t: k[0] }); });
    var pages = [];
    for (var i = 0; i < cards.length; i += 4) pages.push(cards.slice(i, i + 4));
    app.innerHTML =
      '<div class="top no-print"><button class="pbtn" id="back" aria-label="Volver al panel docente">' + ui('back') + '</button><div class="grow" style="justify-content:flex-start"><strong style="font-size:1.4rem">Tarjetas para imprimir</strong></div>' +
      '<button class="tbtn primary" id="printBtn">' + ui('print') + 'Imprimir</button></div>' +
      '<main class="adult-page"><div class="wrap">' +
      '<section class="panel no-print"><h2>Kit de ' + cards.length + ' tarjetas de 10 × 10 cm</h2><p>Cuatro tarjetas por hoja carta. Imprime a tamaño real (100 %), recorta por la línea punteada y lamina. Los colores siguen el código de Scratch: movimiento en azul, eventos en amarillo y control en naranja.</p>' +
      '<div class="legend" style="margin-top:12px">' + kit.map(function (k) { return '<div>' + blk(k[0], { n: k[0] === 'repetir' ? 2 : false }) + '<span>' + BK.BLOQUES[k[0]].nombre + ' × ' + k[1] + '</span></div>'; }).join('') + '</div>' +
      '<p style="margin-top:10px">Las tarjetas de Repetir vienen con 2, 3 y 4 veces.</p></section>' +
      pages.map(function (p) { return '<div class="sheet-page">' + p.map(function (c) { return '<div class="pcard">' + blk(c.t, { n: c.t === 'repetir' ? c.n : false }) + '</div>'; }).join('') + '</div>'; }).join('') +
      '</div></main>';
    $('#back').onclick = function () { go('/docente'); };
    $('#printBtn').onclick = function () { try { window.print(); } catch (e) { /* */ } };
  }

  /* =========================================================
   * Arranque
   * ======================================================= */
  function boot() {
    app = document.getElementById('app');
    document.addEventListener('pointerdown', function () { A.desbloquear(); }, { once: true });
    if (!window.BK_DEMO && 'serviceWorker' in navigator && /^https?:$/.test(location.protocol)) {
      try { navigator.serviceWorker.register('sw.js').catch(function () { /* sin conexión no disponible */ }); } catch (e) { /* */ }
    }
    current = ruta(); render();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
