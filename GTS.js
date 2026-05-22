let cancionSecreta = null;
let reproductorAudio = null;
let vidas = 3;
let puntos = 0;
let tiempoPermitido = 5;
let timeoutSugerencias = null;

const contenedorJuego = document.getElementById("gameContainer");

const barraProgreso = document.getElementById("progressBar");
const start = document.getElementById("play");
const zonaJuego = document.getElementById("gameZone");

const entrada = document.getElementById("guess");
const comprobar = document.getElementById("check");
const respuesta = document.getElementById("feedback");
const intentos = document.getElementById("hearts");

const botonReplay = document.getElementById("replayBtn");
const siguienteCancion = document.getElementById("next");
const marcadorPuntos = document.getElementById("marcador");
const entradaGenero = document.getElementById("genreSelector");
const contadorTiempo = document.getElementById("timeCounter");
const listaSugerencias = document.getElementById("suggestion");



async function buscarCancion(genero) {
    const url = `https://itunes.apple.com/search?term=${genero}&entity=song&limit=50`;

    try {
        const respuesta = await fetch(url);
        const datos = await respuesta.json();
        const listaCanciones = datos.results;

        const indiceAleat = Math.floor(Math.random() * listaCanciones.length);

        cancionSecreta = listaCanciones[indiceAleat];

        if (reproductorAudio !== null) {
            reproductorAudio.pause();
            reproductorAudio.currentTime = 0;
        }

        reproductorAudio = new Audio(cancionSecreta.previewUrl);

        reproductorAudio.addEventListener("timeupdate", () => {
            barraProgreso.value = reproductorAudio.currentTime;
            contadorTiempo.innerText = `${reproductorAudio.currentTime.toFixed(1)}s / 30s`;

            if (reproductorAudio.currentTime >= tiempoPermitido) {
                reproductorAudio.pause();
                reproductorAudio.currentTime = 0;
            }
        });

        reproductorAudio.play();
        console.log("Escuchando canción secreta");

    } catch (error) {
        console.error(error);
    }
}

function limpiarTexto(texto) {

    let textoSeguro = String(texto);

    return textoSeguro
        .trim()
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
}

start.addEventListener("click", () => {
    const generoElegido = entradaGenero.value.trim();
    if (!generoElegido) return;

    console.log("Iniciando juego...");
    buscarCancion(generoElegido);

    entradaGenero.style.display = "none";
    start.style.display = "none";
    siguienteCancion.style.display = "none";
    zonaJuego.style.display = "block";
    intentos.innerText = `Lifes left: ${vidas}`;
});

comprobar.addEventListener("click", () => {
    const usuarioLimpio = limpiarTexto(entrada.value);
    const correctaLimpia = limpiarTexto(cancionSecreta.trackName);

    if (usuarioLimpio === correctaLimpia) {
        respuesta.innerText = "Correct";
        respuesta.style.color = "green";

        if (reproductorAudio) reproductorAudio.pause();
        playSonidoAcierto();

        comprobar.style.display = "none";
        siguienteCancion.style.display = "block";
        puntos += 100;
        marcadorPuntos.innerText = `SCORE: ${puntos}`;

    } else {
        respuesta.innerText = "Incorrect";
        respuesta.style.color = "red";

        if (reproductorAudio) reproductorAudio.pause();
        playSonidoError();
        contenedorJuego.classList.add("shake-error");

        setTimeout(() => {
            contenedorJuego.classList.remove("shake-error");

        }, 400);

        --vidas;
        intentos.innerText = `Lifes left: ${vidas}`;

        if (vidas == 2) {
            tiempoPermitido = 15;
            setTimeout(() => {
                if (reproductorAudio) reproductorAudio.play();
            }, 800);
        } else if (vidas == 1) {
            tiempoPermitido = 30;
            setTimeout(() => {
                if (reproductorAudio) reproductorAudio.play();
            }, 800);
        } else if (vidas == 0) {
            respuesta.innerText = `You Lost :/ The song was: ${cancionSecreta.trackName} by ${cancionSecreta.artistName}`;
            comprobar.style.display = "none";
            siguienteCancion.style.display = "block";
        }
    }

});

siguienteCancion.addEventListener("click", () => {
    respuesta.innerText = "";
    entrada.value = "";
    listaSugerencias.innerHTML = "";
    barraProgreso.value = 0;
    contadorTiempo.innerText = "0.0s / 30s";
    vidas = 3;
    tiempoPermitido = 5;
    intentos.innerText = `Lifes left: ${vidas}`;

    zonaJuego.style.display = "none";
    siguienteCancion.style.display = "none";
    comprobar.style.display = "block";

    entradaGenero.style.display = "inline-block";
    entradaGenero.value = "";
    start.style.display = "inline-block";


});

botonReplay.addEventListener("click", () => {
    if (reproductorAudio) {

        if (!reproductorAudio.paused()) {
            reproductorAudio.pause();
        } else {
            reproductorAudio.currentTime = 0;
            reproductorAudio.play();
        }

    }
})

entrada.addEventListener("input", () => {
    clearTimeout(timeoutSugerencias);
    const textoUsuario = entrada.value.trim();

    if (textoUsuario.length < 3) {
        listaSugerencias.innerHTML = "";
        return;
    }

    timeoutSugerencias = setTimeout(async () => {
        const url = `https://itunes.apple.com/search?term=${textoUsuario}&entity=song&limit=5`;

        try {
            const respuesta = await fetch(url);
            const datos = await respuesta.json();

            listaSugerencias.innerHTML = "";

            datos.results.forEach(cancion => {
                const opcion = document.createElement("option");
                opcion.value = cancion.trackName;
                listaSugerencias.appendChild(opcion);
            });
        } catch (error) {
            console.error(error);
        }
    }, 200);

});

function playSonidoError() {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

    const oscilador = audioCtx.createOscillator();
    const volumen = audioCtx.createGain();

    oscilador.type = "square";
    oscilador.frequency.setValueAtTime(160, audioCtx.currentTime);

    oscilador.frequency.exponentialRampToValueAtTime(70, audioCtx.currentTime + 0.3);

    volumen.gain.setValueAtTime(0.3, audioCtx.currentTime);
    volumen.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);

    oscilador.connect(volumen);
    volumen.connect(audioCtx.destination);

    oscilador.start();
    oscilador.stop(audioCtx.currentTime + 0.3);
}

function playSonidoAcierto() {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const oscilador = audioCtx.createOscillator();
    const volumen = audioCtx.createGain();

    oscilador.type = "square";

    oscilador.frequency.setValueAtTime(523.25, audioCtx.currentTime);
    oscilador.frequency.setValueAtTime(880.00, audioCtx.currentTime + 0.08);

    volumen.gain.setValueAtTime(0.2, audioCtx.currentTime);
    volumen.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);

    oscilador.connect(volumen);
    volumen.connect(audioCtx.destination);

    oscilador.start();
    oscilador.stop(audioCtx.currentTime + 0.3);
}
