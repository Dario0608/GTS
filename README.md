# RetroBeats: Guess The Song

Un juego web arcade de adivinanza musical con estética neón ochentera, potenciado en tiempo real por la API de iTunes. 

---

## Mecánicas de Juego

El núcleo del juego consiste en escuchar un fragmento musical de hasta **30 segundos** e intentar adivinar el título exacto de la canción utilizando una barra de búsqueda con sugerencias dinámicas.

### Modos de Juego

Antes de empezar, el jugador debe seleccionar una categoría (**Género** o **Artista**) validada por el sistema y elegir uno de los dos modos disponibles:

1. **Modo Survival (Supervivencia)**
   - El jugador empieza la partida con **3 vidas** (`corazon.png`).
   - Cada respuesta incorrecta o tiempo agotado resta un corazón.
   - La partida es infinita: el juego termina inmediatamente al perder la última vida.

2. **Modo 5 Rounds (Rondas)**
   - El jugador se enfrenta a una tanda fija de **5 canciones**, independientemente de los fallos cometidos.
   - La interfaz oculta las vidas y muestra un banner indicador (`ROUND 1 / 5`).
   - Al finalizar la quinta ronda, se calcula el recuento y se despliega una pantalla final con el Score total obtenido.

---

## Características Principales

- **Filtro Antierrores:** Validación interna por teclado que verifica y sanea el texto introducido (mínimo 2 caracteres válidos) evitando consultas vacías o erróneas a la API.
- **UI Inmersiva (Sin Alerts):** Todo el flujo de juego utiliza ventanas modales personalizadas al estilo Arcade en inglés:
  - `GIVE UP?`: Ventana de confirmación estilizada al intentar abandonar la partida en curso.
  - `MATCH FINISHED!`: Pantalla neón de victoria con la puntuación final detallada.
- **Audio y Barra Sincronizada:** Reproducción fluida acompañada de una barra de progreso de alta precisión (animada mediante `requestAnimationFrame`) y efectos de sonido retro de 8 bits para aciertos, fallos y Game Over.

---

## Tecnologías Utilizadas

- **Frontend:** HTML5 Semántico, CSS3 (Animaciones, variables de neón y renderizado de píxeles), JavaScript Vanilla (ES6+).
- **Servicios:** iTunes Search API para la consulta dinámica de pistas y metadatos musicales.

## Instalación y Ejecución

  1. Clona este repositorio:
   ```bash
   git clone [https://github.com/Dario0608/GTS_.git](https://github.com/Dario0608/GTS_.git)

 