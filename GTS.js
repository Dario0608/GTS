let cancionSecreta = null;
let reproductorAudio = null;
let vidas = 3;
let puntos = 0;
let tiempoPermitido = 5;
let timeoutSugerencias = null;

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


function empezarJuego(terminoBusqueda) {
    // 1. Reseteamos los contadores estándar del juego
    vidas = 3;
    puntos = 0;
    tiempoPermitido = 5;

    // 2. Sincronizamos la interfaz visual inicial
    marcadorPuntos.innerHTML = `<b>SCORE: 00000</b>`;
    heartsCounter.innerText = `Lifes left: ${vidas}`;
    feedbackText.innerText = "";
    guessInput.value = "";

    // 3. Transición de visibilidad de pantallas
    menuInicio.style.display = "none";
    zonaJuego.style.display = "block";

    // 4. Llama a la API de música pasándole el texto final
    buscarCancion(terminoBusqueda);
}


async function buscarCancion(termino) {
    const url = `https://itunes.apple.com/search?term=${encodeURIComponent(termino)}&entity=song&limit=50`;

    try {
        const respuesta = await fetch(url);
        const datos = await respuesta.json();
        const listaCanciones = datos.results;

        if (listaCanciones.length === 0) {
            alert("No music found! Try another keyword.");
            if (typeof resetearMenuInicial === "function") resetearMenuInicial();
            return;
        }

        const indiceAleat = Math.floor(Math.random() * listaCanciones.length);
        cancionSecreta = listaCanciones[indiceAleat];

        if (reproductorAudio !== null) {
            reproductorAudio.pause();
            reproductorAudio.currentTime = 0;
        }

        reproductorAudio = new Audio(cancionSecreta.previewUrl);

        reproductorAudio.addEventListener("timeupdate", () => {
            progressBar.value = reproductorAudio.currentTime;
            timeCounter.innerText = `${reproductorAudio.currentTime.toFixed(1)}s / 30s`;

            if (reproductorAudio.currentTime >= tiempoPermitido) {
                reproductorAudio.pause();
                reproductorAudio.currentTime = 0;
                replayBtn.innerText = "▶";
            }
        });

        reproductorAudio.play();
        replayBtn.innerText = "II";

    } catch (error) {
        console.error("Error conectando con iTunes:", error);
    }
}

// Limpiar cadenas de texto (quitar tildes y mayúsculas)
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
        feedbackText.innerText = "Correct";
        feedbackText.style.color = "green";
        tiempoPermitido = 30;

        replayBtn.innerText = "▶";
        if (reproductorAudio) reproductorAudio.pause();
        if (typeof playSonidoAcierto === "function") playSonidoAcierto();

        btnCheck.style.display = "none";
        btnNextSong.style.display = "block";
        puntos += 100;
        marcadorPuntos.innerHTML = `<b>SCORE: ${String(puntos).padStart(5, '0')}</b>`;

    } else {
        feedbackText.innerText = "Incorrect";
        feedbackText.style.color = "red";

        replayBtn.innerText = "▶";
        if (reproductorAudio) reproductorAudio.pause();
        if (typeof playSonidoError === "function") playSonidoError();
        
        contenedorJuego.classList.add("shake-error");
        setTimeout(() => contenedorJuego.classList.remove("shake-error"), 400);

        --vidas;
        heartsCounter.innerText = `Lifes left: ${vidas}`;

        if (vidas === 2) {
            tiempoPermitido = 15;
            setTimeout(() => { if (reproductorAudio) reproductorAudio.play(); replayBtn.innerText = "II"; }, 800);
        } else if (vidas === 1) {
            tiempoPermitido = 30;
            setTimeout(() => { if (reproductorAudio) reproductorAudio.play(); replayBtn.innerText = "II"; }, 800);
        } else if (vidas === 0) {
            feedbackText.innerText = `You Lost :/ The song was: ${cancionSecreta.trackName} by ${cancionSecreta.artistName}`;
            btnCheck.style.display = "none";
            btnNextSong.style.display = "block";
            if (typeof playSonidoGameOver === "function") playSonidoGameOver();
        }
    }
});


btnNextSong.addEventListener("click", () => {
    // Detiene reproducciones residuales
    if (reproductorAudio) { reproductorAudio.pause(); reproductorAudio.currentTime = 0; }

    // Limpia la pantalla de juego
    zonaJuego.style.display = "none";
    btnNextSong.style.display = "none";
    btnCheck.style.display = "block";
    customSuggestions.innerHTML = "";
    customSuggestions.style.display = "none";

    // Invoca la función del otro archivo para resetear las elecciones
    if (typeof resetearMenuInicial === "function") {
        resetearMenuInicial();
    }
});

// Control manual Play/Pause
replayBtn.addEventListener("click", () => {
    if (reproductorAudio) {
        if (!reproductorAudio.paused) {
            reproductorAudio.pause();
            replayBtn.innerText = "▶";
        } else {
            reproductorAudio.play();
            replayBtn.innerText = "II";
        }
    }
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

document.addEventListener("click", (e) => {
    if (e.target !== guessInput && e.target !== customSuggestions) {
        customSuggestions.innerHTML = "";
        customSuggestions.style.display = "none";
    }
});