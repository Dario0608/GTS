let cancionSecreta = null;
let reproductorAudio = null;
let vidas = 3;
async function buscarCancion(genero) {
    const url = `https://itunes.apple.com/search?term=${genero}&entity=song&limit=5`;

    try {
        const respuesta = await fetch(url);
        const datos = await respuesta.json();
        const listaCanciones = datos.results;

        const indiceAleat = Math.floor(Math.random() * listaCanciones.length);

        cancionSecreta = listaCanciones[indiceAleat];

        reproductorAudio = new Audio(cancionSecreta.previewUrl);

        reproductorAudio.play();
        console.log("Escuchando canción secreta");

    } catch (error) {
        console.error(error);
    }
}

function limpiarTexto(texto) {

    let textoSeguro = String(texto);

    return texto
        .trim()
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
}

const start = document.getElementById("play");
const zonaJuego = document.getElementById("gameZone");
const entrada = document.getElementById("guess");
const comprobar = document.getElementById("check");
const respuesta = document.getElementById("feedback");
const intentos = document.getElementById("hearts");

start.addEventListener("click", () => {
    console.log("Iniciando juego...");
    buscarCancion("reggueton");

    start.style.display = "none";
    zonaJuego.style.display = "block";
});

comprobar.addEventListener("click", () => {
    const usuarioLimpio = limpiarTexto(entrada.value);
    const correctaLimpia = limpiarTexto(cancionSecreta.trackName);

    if (usuarioLimpio === correctaLimpia) {
        respuesta.innerText = "Correcto";
        respuesta.style.color = "green";
        intentos.style.display = "none";
    } else {
        respuesta.innerText = "Incorrecto";
        respuesta.style.color = "red";
        --vidas;
        intentos.innerText = `Intentos Restantes: ${vidas}`;
        if (vidas == 0) {
            respuesta.innerText = "Has Perdido";
            comprobar.style.display = "none";
        }
    }

});



