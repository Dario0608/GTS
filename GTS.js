let cancionSecreta = null;
let reproductorAudio = null;

let vidas = 3;
let intentosCancion = 0;
let terminoBusquedaActual = "";
let puntos = 0;
let tiempoPermitido = 5;
let timeoutSugerencias = null;
let animacionBarraId = null;

// Control de rondas
let rondaActual = 1;
const maxRondas = 5;

// Elementos del contenedor principal
const contenedorJuego = document.getElementById("gameContainer");
const menuInicio = document.getElementById("startMenu");
const zonaJuego = document.getElementById("gameZone");

// Elementos de la interfaz de juego activa
const replayBtn = document.getElementById("replayBtn");
const progressBar = document.getElementById("progressBar");
const timeCounter = document.getElementById("timeCounter");
const marcadorPuntos = document.getElementById("marcador");
const guessInput = document.getElementById("guessInput");
const customSuggestions = document.getElementById("customSuggestions");
const btnCheck = document.getElementById("btnCheck");
const btnNextSong = document.getElementById("btnNextSong");
const feedbackText = document.getElementById("feedbackText");
const heartsCounter = document.getElementById("heartsCounter");

// Captura de puntuación final
const scoreModal = document.getElementById("scoreModal");
const finalScoreText = document.getElementById("finalScoreText");
const btnFinishMatch = document.getElementById("btnFinishMatch");

// Captura de elementos de Rondas y Modal
const roundCounter = document.getElementById("roundCounter");
const customModal = document.getElementById("customModal");
const modalBtnYes = document.getElementById("modalBtnYes");
const modalBtnNo = document.getElementById("modalBtnNo");

function empezarJuego(terminoBusqueda) {
    vidas = 3;
    puntos = 0;
    tiempoPermitido = 5;
    intentosCancion = 0;
    rondaActual = 1; // Reseteamos rondas
    terminoBusquedaActual = terminoBusqueda;

    marcadorPuntos.style.display = "block";
    actualizarMarcador(false);

    // Separación de flujos visuales según el modo elegido
    if (modoJuego === "rounds") {
        heartsCounter.style.display = "none";      // Oculta corazones
        roundCounter.style.display = "block";       // Muestra rondas
        roundCounter.innerText = `ROUND ${rondaActual} / ${maxRondas}`;
    } else {
        roundCounter.style.display = "none";        // Oculta rondas
        heartsCounter.style.display = "flex";       // Muestra corazones
        actualizarCorazones();
    }

    feedbackText.innerText = "";
    guessInput.value = "";

    menuInicio.style.display = "none";
    zonaJuego.style.display = "flex";

    buscarCancion(terminoBusquedaActual);
}

// Bucle de renderizado
function actualizarProgresoFluido() {
    if (!reproductorAudio || reproductorAudio.paused) return;

    // Obtenemos los milisegundos actuales 
    const tiempoMs = reproductorAudio.currentTime * 1000;
    progressBar.value = tiempoMs;

    // Convertimos a segundos enteros
    const segundosEnteros = Math.floor(reproductorAudio.currentTime);
    timeCounter.innerText = `${segundosEnteros}s / 30s`;

    // Lógica de corte si excede el límite permitido por intentos
    if (reproductorAudio.currentTime >= tiempoPermitido) {
        reproductorAudio.pause();
        reproductorAudio.currentTime = 0;
        progressBar.value = 0;
        timeCounter.innerText = `0s / 30s`;
        replayBtn.innerText = "▶";
        cancelAnimationFrame(animacionBarraId);
        return;
    }

    // Seguir el bucle fluido en el próximo fotograma disponible
    animacionBarraId = requestAnimationFrame(actualizarProgresoFluido);
}

async function buscarCancion(termino) {
    const url = `https://itunes.apple.com/search?term=${encodeURIComponent(termino)}&entity=song&limit=50`;

    try {
        const respuesta = await fetch(url);
        const datos = await respuesta.json();
        const listaCanciones = datos.results;

        if (listaCanciones.length === 0) {
            alert("No music found! Try another keyword.");
            volverAlMenuForzado();
            return;
        }

        const indiceAleat = Math.floor(Math.random() * listaCanciones.length);
        cancionSecreta = listaCanciones[indiceAleat];

        if (reproductorAudio !== null) {
            reproductorAudio.pause();
            reproductorAudio.currentTime = 0;
            cancelAnimationFrame(animacionBarraId);
        }

        reproductorAudio = new Audio(cancionSecreta.previewUrl);

        // Disparador cuando el audio empiece a sonar de verdad
        reproductorAudio.addEventListener("play", () => {
            replayBtn.innerText = "II";
            actualizarProgresoFluido();
        });

        reproductorAudio.addEventListener("pause", () => {
            replayBtn.innerText = "▶";
            cancelAnimationFrame(animacionBarraId);
        });

        reproductorAudio.play();

    } catch (error) {
        console.error("Error conectando con iTunes:", error);
    }
}

function limpiarTexto(texto) {
    return String(texto)
        .trim()
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
}

btnCheck.addEventListener("click", () => {
    if (!cancionSecreta) return;

    const usuarioLimpio = limpiarTexto(guessInput.value);
    const correctaLimpia = limpiarTexto(cancionSecreta.trackName);

    if (usuarioLimpio === correctaLimpia) {
        feedbackText.innerText = "Correct!";
        feedbackText.style.color = "#39ff14";
        tiempoPermitido = 30;

        if (reproductorAudio) reproductorAudio.pause();
        if (typeof playSonidoAcierto === "function") playSonidoAcierto();

        let puntosGanados = 0;
        if (intentosCancion === 0) puntosGanados = 100;
        else if (intentosCancion === 1) puntosGanados = 50;
        else puntosGanados = 25;

        puntos += puntosGanados;
        actualizarMarcador(true);

        btnCheck.style.display = "none";
        btnNextSong.style.display = "block";
        btnNextSong.innerText = "NEXT SONG";

    } else {
        intentosCancion++;

        feedbackText.innerText = "Incorrect!";
        feedbackText.style.color = "#ff003c";

        if (reproductorAudio) reproductorAudio.pause();
        if (typeof playSonidoError === "function") playSonidoError();

        contenedorJuego.classList.add("shake-error");
        setTimeout(() => contenedorJuego.classList.remove("shake-error"), 400);

        if (intentosCancion === 1) {
            tiempoPermitido = 15;
            feedbackText.innerText += " (Try 2: 15s unlocked!)";
            setTimeout(() => { if (reproductorAudio) reproductorAudio.play(); }, 800);
        } else if (intentosCancion === 2) {
            tiempoPermitido = 30;
            feedbackText.innerText += " (Last Try: 30s unlocked!)";
            setTimeout(() => { if (reproductorAudio) reproductorAudio.play(); }, 800);

        } else {
            // Evaluamos según el modo activo
            if (modoJuego === "survival") {
                vidas--;
                actualizarCorazones();

                if (vidas > 0) {
                    feedbackText.innerText = `You lost a life! The song was: ${cancionSecreta.trackName} by ${cancionSecreta.artistName}.`;
                    btnCheck.style.display = "none";
                    btnNextSong.style.display = "block";
                    btnNextSong.innerText = "KEEP PLAYING";
                } else {
                    feedbackText.innerText = `GAME OVER! The song was: ${cancionSecreta.trackName} by ${cancionSecreta.artistName}`;
                    btnCheck.style.display = "none";
                    btnNextSong.style.display = "block";
                    btnNextSong.innerText = "GAME OVER (EXIT)";
                    if (typeof playSonidoGameOver === "function") playSonidoGameOver();
                }
            } else {

                feedbackText.innerText = `No more tries! The song was: ${cancionSecreta.trackName} by ${cancionSecreta.artistName}.`;
                btnCheck.style.display = "none";
                btnNextSong.style.display = "block";

                if (rondaActual >= maxRondas) {
                    btnNextSong.innerText = "SEE FINAL RESULTS";
                } else {
                    btnNextSong.innerText = "NEXT ROUND";
                }
            }

        }
    }
});

btnNextSong.addEventListener("click", () => {
    if (reproductorAudio) { reproductorAudio.pause(); reproductorAudio.currentTime = 0; }
    cancelAnimationFrame(animacionBarraId);
    progressBar.value = 0;
    timeCounter.innerText = "0s / 30s";

    customSuggestions.innerHTML = "";
    customSuggestions.style.display = "none";
    guessInput.value = "";
    feedbackText.innerText = "";

    if (modoJuego === "survival") {
        if (vidas <= 0) {
            volverAlMenuForzado();
        } else {
            intentosCancion = 0;
            tiempoPermitido = 5;
            btnCheck.style.display = "block";
            btnNextSong.style.display = "none";
            buscarCancion(terminoBusquedaActual);
        }
    } else {
        // Lógica de avance en modo rondas
        rondaActual++;
        if (rondaActual > maxRondas) {
            // Mostrar puntos
            finalScoreText.innerText = `YOUR TOTAL SCORE: ${puntos} POINTS`;
            scoreModal.style.display = "flex";
        } else {
            intentosCancion = 0;
            tiempoPermitido = 5;
            roundCounter.innerText = `ROUND ${rondaActual} / ${maxRondas}`;
            btnCheck.style.display = "block";
            btnNextSong.style.display = "none";
            buscarCancion(terminoBusquedaActual);
        }
    }
});

replayBtn.addEventListener("click", () => {
    if (reproductorAudio) {
        if (!reproductorAudio.paused) {
            reproductorAudio.pause();
        } else {
            reproductorAudio.play();
        }
    }
});

function actualizarMarcador(conAnimacion) {
    const cerosIzquierda = String(puntos).padStart(5, '0');
    marcadorPuntos.innerHTML = `<b>SCORE: ${cerosIzquierda}</b>`;
    if (conAnimacion) {
        marcadorPuntos.classList.remove("retro-score-pop");
        void marcadorPuntos.offsetWidth;
        marcadorPuntos.classList.add("retro-score-pop");
    }
}

function actualizarCorazones() {
    heartsCounter.innerHTML = "";
    for (let i = 0; i < 3; i++) {
        const corazon = document.createElement("div");
        corazon.classList.add("pixel-heart");

        if (i >= vidas) {
            corazon.classList.add("heart-lost-retro");
        }
        heartsCounter.appendChild(corazon);
    }
}

function volverAlMenuForzado() {
    zonaJuego.style.display = "none";
    btnNextSong.style.display = "none";
    btnCheck.style.display = "block";
    marcadorPuntos.style.display = "none"; // Se esconde al salir al menú
    if (typeof resetearMenuInicial === "function") resetearMenuInicial();
}


function botonRendirseSalir() {
    customModal.style.display = "flex";
}

modalBtnYes.addEventListener("click", () => {
    customModal.style.display = "none";
    volverAlMenuForzado(); // Abandona la partida rumbo al menú
});

modalBtnNo.addEventListener("click", () => {
    customModal.style.display = "none";
});

guessInput.addEventListener("input", () => {
    clearTimeout(timeoutSugerencias);
    const textoUsuario = guessInput.value.trim();

    if (textoUsuario.length < 3) {
        customSuggestions.innerHTML = "";
        customSuggestions.style.display = "none";
        return;
    }

    timeoutSugerencias = setTimeout(async () => {
        const url = `https://itunes.apple.com/search?term=${encodeURIComponent(textoUsuario)}&entity=song&limit=5`;

        try {
            const respuestaApi = await fetch(url);
            const datos = await respuestaApi.json();

            customSuggestions.innerHTML = "";

            if (datos.results.length === 0) {
                customSuggestions.style.display = "none";
                return;
            }

            datos.results.forEach(cancion => {
                const item = document.createElement("div");
                item.classList.add("suggestion-item");
                item.innerText = cancion.trackName;

                item.addEventListener("click", () => {
                    guessInput.value = cancion.trackName;
                    customSuggestions.innerHTML = "";
                    customSuggestions.style.display = "none";
                });

                customSuggestions.appendChild(item);
            });

            customSuggestions.style.display = "block";

        } catch (error) {
            console.error(error);
        }
    }, 200);
});

btnFinishMatch.addEventListener("click", () => {
    scoreModal.style.display = "none";
    volverAlMenuForzado();
});

document.addEventListener("click", (e) => {
    if (e.target !== guessInput && e.target !== customSuggestions) {
        customSuggestions.innerHTML = "";
        customSuggestions.style.display = "none";
    }
});