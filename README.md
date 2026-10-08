# Block-Kids · Programar jugando

Ambiente educativo para iniciar a niños de 6 y 7 años en el pensamiento computacional. Combina tarjetas físicas (fase desconectada) con bloques en pantalla al estilo Scratch (fase digital). Las pantallas de los niños no tienen texto: todo se entiende con íconos, colores, animaciones y voz.

## Qué incluye

- **Mapa de 14 retos en 4 módulos**
  1. *El tablero de símbolos*: reconocer cada bloque y buscar su tarjeta en la mesa.
  2. *El reto del avatar*: armar la ruta de BitBot con tarjetas físicas y compararla con la pantalla.
  3. *Zona de programación*: pasar la misma ruta a bloques arrastrando y soltando.
  4. *¡A jugar! Prueba y error*: programar libremente, ejecutar con la bandera verde y depurar (rocas, agua, bloque Repetir).
- Narración por voz en español, efectos de sonido, estrellas y celebraciones.
- Turnos en pareja (quién maneja y quién observa).
- **Panel docente** (botón con candado, mantener presionado 2 s): avance por reto, intentos, errores, ajustes de voz, modo lento y desbloqueo de retos.
- **Tarjetas para imprimir** de 10 × 10 cm con los mismos colores e íconos de los bloques.
- Funciona sin internet después de la primera carga (PWA) y se puede instalar en tabletas y computadores.

## Probarla en el computador

Abre una terminal en esta carpeta y ejecuta:

```
python -m http.server 8000
```

Luego entra a `http://localhost:8000`. (Abrir `index.html` con doble clic también funciona, pero sin el modo sin conexión).

## Publicarla en internet (gratis)

1. Sube el contenido de esta carpeta a un repositorio de GitHub.
2. En [vercel.com](https://vercel.com) elige *Add New → Project*, importa el repositorio y pulsa *Deploy* (no hay que configurar nada: es una app estática).

También sirve GitHub Pages, Netlify o cualquier hosting de archivos estáticos.

## Estructura

```
index.html             página principal
css/app.css            estilos
js/data.js             contenidos: bloques, módulos, retos y frases de voz
js/engine.js           motor del tablero (movimientos, choques, agua, meta)
js/audio.js            voz y efectos de sonido
js/app.js              pantallas e interacción
sw.js                  modo sin conexión
manifest.webmanifest   instalación como app
fonts/ img/            tipografía Fredoka e íconos
```

Para cambiar o agregar retos solo hay que editar `js/data.js`. En los mapas: `S` = salida de BitBot, `G` = estrella, `R` = roca, `W` = agua y `.` = pasto. Si publicas una actualización, cambia `VERSION` en `sw.js` para que las tabletas descarguen la versión nueva.

El progreso se guarda solo en el dispositivo (sin cuentas ni datos personales).
