/*
 * Block-Kids · sonido
 * Efectos generados con Web Audio (no se descargan archivos) y locución con la
 * síntesis de voz del navegador. Funciona sin conexión.
 */
(function (BK) {
  'use strict';
  var ctx = null;
  var A = {
    voz: true, efectos: true, lenta: false,
    desbloquear: function () {
      try {
        if (!ctx) { var C = window.AudioContext || window.webkitAudioContext; if (C) ctx = new C(); }
        if (ctx && ctx.state === 'suspended') ctx.resume();
      } catch (e) { ctx = null; }
    },
    tono: function (f1, f2, dur, tipo, vol, cuando) {
      if (!A.efectos || !ctx) return;
      var t = ctx.currentTime + (cuando || 0);
      var o = ctx.createOscillator(), g = ctx.createGain();
      o.type = tipo || 'sine';
      o.frequency.setValueAtTime(f1, t);
      if (f2) o.frequency.exponentialRampToValueAtTime(f2, t + dur);
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(vol || 0.18, t + 0.015);
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      o.connect(g); g.connect(ctx.destination);
      o.start(t); o.stop(t + dur + 0.02);
    },
    ruido: function (dur, vol) {
      if (!A.efectos || !ctx) return;
      var n = Math.floor(ctx.sampleRate * dur), buf = ctx.createBuffer(1, n, ctx.sampleRate), d = buf.getChannelData(0);
      for (var i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / n);
      var s = ctx.createBufferSource(), f = ctx.createBiquadFilter(), g = ctx.createGain();
      f.type = 'lowpass'; f.frequency.value = 900; g.gain.value = vol || 0.25;
      s.buffer = buf; s.connect(f); f.connect(g); g.connect(ctx.destination); s.start();
    },
    sfx: function (nombre) {
      switch (nombre) {
        case 'toque': A.tono(660, 880, 0.07, 'triangle', 0.12); break;
        case 'encaje': A.tono(520, 0, 0.05, 'square', 0.08); A.tono(1040, 0, 0.07, 'square', 0.07, 0.05); break;
        case 'quitar': A.tono(500, 220, 0.14, 'triangle', 0.12); break;
        case 'paso': A.tono(330, 260, 0.1, 'triangle', 0.12); break;
        case 'girar': A.tono(440, 620, 0.12, 'sine', 0.1); break;
        case 'salto': A.tono(300, 900, 0.3, 'sine', 0.14); break;
        case 'choque': A.tono(180, 70, 0.35, 'sawtooth', 0.12); break;
        case 'agua': A.ruido(0.5, 0.3); A.tono(500, 120, 0.4, 'sine', 0.08); break;
        case 'mal': A.tono(330, 260, 0.18, 'triangle', 0.12); A.tono(262, 200, 0.22, 'triangle', 0.12, 0.16); break;
        case 'bien': A.tono(660, 0, 0.1, 'triangle', 0.13); A.tono(880, 0, 0.16, 'triangle', 0.13, 0.09); break;
        case 'estrella': A.tono(1320, 1760, 0.18, 'sine', 0.1); break;
        case 'victoria':
          [523, 659, 784, 1047].forEach(function (f, i) { A.tono(f, 0, 0.22, 'triangle', 0.15, i * 0.12); });
          A.tono(1047, 1568, 0.5, 'sine', 0.1, 0.5); break;
        case 'desbloqueo': A.tono(1319, 0, 0.12, 'sine', 0.12); A.tono(1568, 0, 0.2, 'sine', 0.12, 0.1); break;
      }
    },
    vozElegida: null,
    elegirVoz: function () {
      if (!('speechSynthesis' in window)) return;
      var vs = speechSynthesis.getVoices() || [], pref = ['es-CO', 'es-419', 'es-MX', 'es-US', 'es-ES', 'es'];
      for (var i = 0; i < pref.length; i++) {
        var v = vs.filter(function (x) { return (x.lang || '').replace('_', '-').indexOf(pref[i]) === 0; })[0];
        if (v) { A.vozElegida = v; return; }
      }
    },
    decir: function (texto, alTerminar) {
      if (!A.voz || !texto || !('speechSynthesis' in window)) { if (alTerminar) setTimeout(alTerminar, 300); return; }
      try {
        speechSynthesis.cancel();
        var u = new SpeechSynthesisUtterance(texto);
        u.lang = A.vozElegida ? A.vozElegida.lang : 'es-CO';
        if (A.vozElegida) u.voice = A.vozElegida;
        u.rate = A.lenta ? 0.78 : 0.92; u.pitch = 1.1;
        if (alTerminar) u.onend = u.onerror = alTerminar;
        speechSynthesis.speak(u);
      } catch (e) { if (alTerminar) alTerminar(); }
    },
    callar: function () { try { if ('speechSynthesis' in window) speechSynthesis.cancel(); } catch (e) { /* */ } }
  };
  if ('speechSynthesis' in window) { A.elegirVoz(); speechSynthesis.onvoiceschanged = A.elegirVoz; }
  BK.audio = A;
})(window.BK = window.BK || {});
