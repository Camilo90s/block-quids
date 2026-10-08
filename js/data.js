/*
 * Block-Kids · contenidos
 * ------------------------------------------------------------
 * Bloques, módulos, retos y frases de voz. Todo el contenido vive aquí
 * para que el equipo pueda ajustarlo sin tocar la lógica del juego.
 *
 * Mapas: S = salida de BitBot, G = estrella (meta), R = roca, W = agua, . = pasto
 * dir (hacia dónde mira BitBot al iniciar): 0 arriba, 1 derecha, 2 abajo, 3 izquierda
 */
window.BK = window.BK || {};
(function (BK) {
  'use strict';

  // Código de color igual al de Scratch y al de las tarjetas físicas:
  // movimiento = azul, eventos = amarillo, control = naranja.
  BK.BLOQUES = {
    bandera:   { nombre: 'Bandera verde',     categoria: 'evento',     color: '#f7b500', borde: '#d99a00', voz: 'Bandera verde. ¡Aquí empieza el programa!' },
    avanzar:   { nombre: 'Avanzar',           categoria: 'movimiento', color: '#2f7ff0', borde: '#1d62c8', voz: 'Avanzar. BitBot camina un paso hacia adelante.' },
    derecha:   { nombre: 'Girar a la derecha', categoria: 'movimiento', color: '#2f7ff0', borde: '#1d62c8', voz: 'Girar a la derecha. BitBot da la vuelta hacia la derecha.' },
    izquierda: { nombre: 'Girar a la izquierda', categoria: 'movimiento', color: '#2f7ff0', borde: '#1d62c8', voz: 'Girar a la izquierda. BitBot da la vuelta hacia la izquierda.' },
    saltar:    { nombre: 'Saltar',            categoria: 'movimiento', color: '#2f7ff0', borde: '#1d62c8', voz: 'Saltar. BitBot salta por encima del agua o de una roca.' },
    repetir:   { nombre: 'Repetir',           categoria: 'control',    color: '#ff8a1f', borde: '#e06d00', voz: 'Repetir. BitBot hace el siguiente bloque varias veces.' }
  };

  BK.MODULOS = [
    { id: 1, nombre: 'El tablero de símbolos', fase: 'Desconectada', color: '#8b5cf6', icono: 'ojo' },
    { id: 2, nombre: 'El reto del avatar',      fase: 'Desconectada', color: '#f97316', icono: 'mesa' },
    { id: 3, nombre: 'Zona de programación',    fase: 'Digital',      color: '#2f7ff0', icono: 'mano' },
    { id: 4, nombre: '¡A jugar! Prueba y error', fase: 'Digital',      color: '#16a34a', icono: 'bandera' }
  ];

  // Tableros compartidos: el módulo 3 replica en pantalla las rutas que el módulo 2 arma en la mesa.
  var T = {
    recta:  { mapa: ['.....', 'S..G.', '.....'], dir: 1, solucion: ['avanzar', 'avanzar', 'avanzar'] },
    giro:   { mapa: ['....', '..G.', 'S...'],    dir: 1, solucion: ['avanzar', 'avanzar', 'izquierda', 'avanzar'] },
    agua:   { mapa: ['.....', 'S.W.G', '.....'], dir: 1, solucion: ['avanzar', 'saltar', 'avanzar'] }
  };

  BK.NIVELES = [
    // Módulo 1 · reconocer símbolos (con tarjetas en la mesa)
    { id: '1-1', modulo: 1, tipo: 'simbolos', rondas: ['avanzar', 'derecha', 'izquierda'] },
    { id: '1-2', modulo: 1, tipo: 'simbolos', rondas: ['saltar', 'repetir', 'bandera'] },

    // Módulo 2 · armar la ruta con tarjetas físicas (fase desconectada)
    { id: '2-1', modulo: 2, tipo: 'mesa', tablero: T.recta },
    { id: '2-2', modulo: 2, tipo: 'mesa', tablero: T.giro },
    { id: '2-3', modulo: 2, tipo: 'mesa', tablero: T.agua },

    // Módulo 3 · pasar a la pantalla la misma ruta (arrastrar y soltar)
    { id: '3-1', modulo: 3, tipo: 'replicar', tablero: T.recta },
    { id: '3-2', modulo: 3, tipo: 'replicar', tablero: T.giro },
    { id: '3-3', modulo: 3, tipo: 'replicar', tablero: T.agua },

    // Módulo 4 · programar libremente, ejecutar y depurar
    { id: '4-1', modulo: 4, tipo: 'jugar',
      tablero: { mapa: ['..G.', '....', 'S...'], dir: 0, solucion: ['avanzar', 'avanzar', 'derecha', 'avanzar', 'avanzar'] },
      paleta: ['avanzar', 'derecha', 'izquierda'] },
    { id: '4-2', modulo: 4, tipo: 'jugar', depurar: true,
      tablero: { mapa: ['...G.', 'S....'], dir: 1, solucion: ['avanzar', 'avanzar', 'avanzar', 'izquierda', 'avanzar'] },
      inicial: ['avanzar', 'avanzar', 'avanzar', 'derecha', 'avanzar'],
      paleta: ['avanzar', 'derecha', 'izquierda'] },
    { id: '4-3', modulo: 4, tipo: 'jugar',
      tablero: { mapa: ['...G', '.RR.', 'S...'], dir: 1, solucion: ['avanzar', 'avanzar', 'avanzar', 'izquierda', 'avanzar', 'avanzar'] },
      paleta: ['avanzar', 'derecha', 'izquierda'] },
    { id: '4-4', modulo: 4, tipo: 'jugar',
      tablero: { mapa: ['S.W.', '....', '...G'], dir: 1, solucion: ['avanzar', 'saltar', 'derecha', 'avanzar', 'avanzar'] },
      paleta: ['avanzar', 'derecha', 'izquierda', 'saltar'] },
    { id: '4-5', modulo: 4, tipo: 'jugar', maximo: 3,
      tablero: { mapa: ['S...G'], dir: 1, solucion: [{ t: 'repetir', n: 4 }, 'avanzar'] },
      paleta: ['avanzar', 'repetir'] },
    { id: '4-6', modulo: 4, tipo: 'jugar', depurar: true,
      tablero: { mapa: ['.....', 'S.W.G', '.....'], dir: 1, solucion: ['avanzar', 'saltar', 'avanzar'] },
      inicial: ['avanzar', 'avanzar', 'avanzar', 'avanzar'],
      paleta: ['avanzar', 'derecha', 'izquierda', 'saltar'] }
  ];

  // Frases de voz (la app no depende de la lectura: todo se escucha)
  BK.VOZ = {
    inicio: '¡Hola! Soy BitBot. ¡Vamos a programar jugando! Toca el botón verde.',
    mapa: 'Elige un reto en el mapa. Toca el que brilla.',
    turno: '¡Cambio de turno!',
    simbolos: { mira: 'Mira el símbolo y escucha.', busca: 'Busca en tu mesa la tarjeta igual. Cuando la tengas, toca el botón verde.', toca: 'Ahora toca en la pantalla la tarjeta igual.', bien: '¡Muy bien!', mal: 'Esa no es. ¡Mira otra vez!' },
    mesa: {
      intro: 'Ayuda a BitBot a llegar a la estrella. Arma el camino con tus tarjetas en la mesa. Cuando termines, toca la bandera verde.',
      mira: 'Mira el camino de BitBot. ¿Tus tarjetas están igual?',
      si: '¡Excelente! ¡Tus tarjetas están perfectas!',
      no: 'No pasa nada. Cambia tus tarjetas y mira otra vez.'
    },
    replicar: {
      intro: 'Ahora pasa tus tarjetas a la pantalla. Arrastra cada bloque a su lugar.',
      mal: 'Ese bloque no va ahí. ¡Mira el dibujo!',
      listo: '¡Listo! Toca la bandera verde.'
    },
    jugar: {
      intro: 'Arma el programa para llevar a BitBot a la estrella. Luego toca la bandera verde.',
      depurar: '¡Oh, no! El programa tiene un error. Toca la bandera verde, encuentra el bloque que está mal y cámbialo.',
      repetir: 'Solo caben tres bloques. Usa el bloque de repetir para que BitBot camine varias veces.',
      vacio: 'Primero arrastra bloques al programa.'
    },
    errores: {
      roca: '¡Uy! BitBot chocó con una roca. Revisa este bloque.',
      agua: '¡Uy! BitBot cayó al agua. ¿Qué bloque necesita para pasar?',
      borde: '¡Uy! BitBot se salió del camino. Revisa este bloque.',
      corto: 'BitBot no llegó a la estrella. ¡Faltan bloques!'
    },
    exito: ['¡Lo lograste!', '¡Excelente trabajo!', '¡Eres un gran programador!', '¡Muy bien! BitBot llegó a la estrella.'],
    final: '¡Felicitaciones! Superaste todos los retos. ¡Ya sabes programar!'
  };
})(window.BK);
