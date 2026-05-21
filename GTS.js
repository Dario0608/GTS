let cancionSecreta = null;
let reproductorAudio = null;
let vidas = 3;
let puntos = 0;
let tiempoPermitido = 5;

const barraProgreso = document.getElementById("progressBar");
const start = document.getElementById("play");
const zonaJuego = document.getElementById("gameZone");
const entrada = document.getElementById("guess");
const comprobar = document.getElementById("check");
const respuesta = document.getElementById("feedback");
const intentos = document.getElementById("hearts");
const siguienteCancion = document.getElementById("next");
const marcadorPuntos = document.getElementById("marcador");
const selectorGenero = document.getElementById("genreSelector");


async function buscarCancion(genero) {
    const url = `https://itunes.apple.com/search?term=${genero}&entity=song&limit=5`;

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

            const porcentaje = (reproductorAudio.currentTime / tiempoPermitido) * 100;
            barraProgreso.value = porcentaje;
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
    console.log("Iniciando juego...");
    const generoElegido = selectorGenero.value;
    buscarCancion(generoElegido);

    selectorGenero.style.display = "none";
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

        comprobar.style.display = "none";
        siguienteCancion.style.display = "block";
        puntos += 100;
        marcadorPuntos.innerText = `SCORE: ${puntos}`;

    } else {
        respuesta.innerText = "Incorrect";
        respuesta.style.color = "red";

        --vidas;
        intentos.innerText = `Lifes left: ${vidas}`;

        if (vidas == 2) {
            tiempoPermitido = 15;
            reproductorAudio.play();
        } else if (vidas == 1) {
            tiempoPermitido = 30;
            reproductorAudio.play();
        } else if (vidas == 0) {
            respuesta.innerText = "You Lost :/";
            comprobar.style.display = "none";
            siguienteCancion.style.display = "block";
            if (reproductorAudio) reproductorAudio.pause();
        }
    }

});

siguienteCancion.addEventListener("click", () => {
    respuesta.innerText = "";
    entrada.value = "";
    siguienteCancion.style.display = "none";
    comprobar.style.display = "block";

    const generoActual = selectorGenero.value;
    buscarCancion(generoActual);

    barraProgreso.value = 0;
    vidas = 3;
    tiempoPermitido = 5;
    intentos.innerText = `Lifes left: ${vidas}`;
});



