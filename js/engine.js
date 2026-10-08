/*
 * Block-Kids · motor del tablero (funciones puras, sin interfaz)
 * Se usa en la app y en las pruebas de los retos.
 */
(function (BK) {
  'use strict';
  var DIRS = [[0, -1], [1, 0], [0, 1], [-1, 0]]; // arriba, derecha, abajo, izquierda

  function mundo(tablero) {
    var rows = tablero.mapa, start = null, goal = null, tiles = [];
    rows.forEach(function (r, y) {
      tiles.push([]);
      r.split('').forEach(function (c, x) {
        if (c === 'S') start = { x: x, y: y };
        if (c === 'G') goal = { x: x, y: y };
        tiles[y].push(c === 'R' || c === 'W' || c === 'G' ? c : '.');
      });
    });
    return { w: rows[0].length, h: rows.length, tiles: tiles, start: { x: start.x, y: start.y, dir: tablero.dir }, goal: goal };
  }

  // Normaliza un bloque: 'avanzar' o { t: 'repetir', n: 3 }
  function norm(b) { return typeof b === 'string' ? { t: b } : { t: b.t, n: b.n }; }

  // Expande el programa: el bloque Repetir hace N veces el bloque siguiente
  function expandir(programa) {
    var out = [], rep = null;
    programa.map(norm).forEach(function (b, i) {
      if (b.t === 'repetir') { rep = { n: b.n || 2, src: i }; return; }
      var n = rep ? rep.n : 1;
      for (var k = 0; k < n; k++) out.push({ t: b.t, src: i, rep: rep ? rep.src : null, vuelta: k });
      rep = null;
    });
    return out;
  }

  // Ejecuta el programa y devuelve cada paso y el resultado:
  // 'meta' (llegó a la estrella), 'roca', 'agua', 'borde' o 'corto' (no llegó)
  function simular(m, programa) {
    var s = { x: m.start.x, y: m.start.y, dir: m.start.dir }, pasos = [];
    var dentro = function (x, y) { return x >= 0 && y >= 0 && x < m.w && y < m.h; };
    var ops = expandir(programa);
    for (var i = 0; i < ops.length; i++) {
      var op = ops[i];
      if (op.t === 'derecha' || op.t === 'izquierda') {
        s = { x: s.x, y: s.y, dir: (s.dir + (op.t === 'derecha' ? 1 : 3)) % 4 };
        pasos.push({ x: s.x, y: s.y, dir: s.dir, op: op, accion: 'girar' });
        continue;
      }
      var d = DIRS[s.dir], dist = op.t === 'saltar' ? 2 : 1;
      var nx = s.x + d[0] * dist, ny = s.y + d[1] * dist;
      if (op.t !== 'avanzar' && op.t !== 'saltar') continue;
      if (!dentro(nx, ny)) {
        pasos.push({ x: s.x, y: s.y, dir: s.dir, op: op, accion: 'choque', fallo: 'borde' });
        return { pasos: pasos, resultado: 'borde', bloque: op.src };
      }
      var c = m.tiles[ny][nx];
      if (c === 'R') {
        pasos.push({ x: s.x, y: s.y, dir: s.dir, op: op, accion: 'choque', fallo: 'roca' });
        return { pasos: pasos, resultado: 'roca', bloque: op.src };
      }
      s = { x: nx, y: ny, dir: s.dir };
      if (c === 'W') {
        pasos.push({ x: s.x, y: s.y, dir: s.dir, op: op, accion: dist === 2 ? 'saltar' : 'avanzar', fallo: 'agua' });
        return { pasos: pasos, resultado: 'agua', bloque: op.src };
      }
      pasos.push({ x: s.x, y: s.y, dir: s.dir, op: op, accion: dist === 2 ? 'saltar' : 'avanzar' });
      if (m.goal && s.x === m.goal.x && s.y === m.goal.y) return { pasos: pasos, resultado: 'meta', bloque: op.src };
    }
    return { pasos: pasos, resultado: (m.goal && s.x === m.goal.x && s.y === m.goal.y) ? 'meta' : 'corto', bloque: null };
  }

  BK.motor = { mundo: mundo, simular: simular, expandir: expandir, norm: norm, DIRS: DIRS };
})(typeof window !== 'undefined' ? (window.BK = window.BK || {}) : (module.exports = {}));
