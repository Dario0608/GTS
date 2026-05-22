# RetroBeats

**RetroBeats** es un videojuego web interactivo de adivinanzas musicales con una estética arcade y ochentera inspirada en el movimiento *Synthwave/Cyberpunk*. El objetivo principal es poner a prueba tus conocimientos musicales identificando canciones aleatorias obtenidas directamente en tiempo real de la API de iTunes.

Puedes probar el juego desplegado en vivo aquí: [https://dario0608.github.io/GTS/](https://dario0608.github.io/GTS/)

---

## Características Principales

* **Búsqueda Dinámica por Género:** Filtra y genera canciones aleatorias de cualquier género musical usando la base de datos oficial de iTunes.
* **Mecánica de Vidas Gradual:** Empiezas con 3 vidas. Cuantas menos vidas te queden, más segundos de la canción se desbloquearán para ayudarte a adivinar.
* **Sistema de Puntuación:** Suma puntos (+100 por acierto) y supera tu propio récord.
* **Interfaz de Usuario Retro:** Luces de neón magenta, tipografías pixeladas (`Press Start 2P`), botones interactivos estilo máquina de fichines y barras personalizadas.
* **Buscador Inteligente Personalizado:** Sistema de sugerencias predictivo y auto-completado adaptado visualmente a la paleta de colores oro y neón del juego.
* **Feedback Inmersivo:** Efectos visuales de impacto (vibración de pantalla en errores) e interruptores de reproducción multimedia en tiempo real (`Play/Pause`).

---

## Cómo Jugar

1.  Introduce tu género musical preferido en la pantalla de inicio y presiona **Play**.
2.  Escucha la pista de audio antes de que el contador llegue a su límite de ronda.
3.  Escribe el título de la canción en el cuadro de texto utilizando el menú de sugerencias inteligente si necesitas ayuda con el nombre exacto.
4.  Presiona **Try** para comprobar tu respuesta. Si fallas, perderás una vida pero se expandirá el tiempo límite de escucha para la siguiente oportunidad.
5.  ¡Acierta para acumular score y avanza a la siguiente canción!

---

## Tecnologías Utilizadas

* **HTML5:** Estructuración semántica de los contenedores de juego y elementos multimedia.
* **CSS3 Avanzado:** Animaciones en fotogramas (`@keyframes`), diseño flexible (`Flexbox`), variables de color neón y sobreescritura profunda de pseudoelementos del navegador (`-webkit-scrollbar` y `progress`).
* **JavaScript (Vanilla ES6):** Lógica del juego, manipulación del DOM, temporizadores asíncronos (`setTimeout`/`clearTimeout`) para mitigar peticiones innecesarias (*debounce* en el input) y control nativo de reproducción de audio.
* **iTunes Search API:** Consulta e integración de datos remotos de canciones y pre-escuchas en tiempo real.