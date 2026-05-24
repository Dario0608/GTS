let modoJuego = null;         
let tipoBusqueda = null;      


const stepMode = document.getElementById("stepMode");
const stepSearch = document.getElementById("stepSearch");
const btnModeSurvival = document.getElementById("btnModeSurvival");
const btnModeRounds = document.getElementById("btnModeRounds");
const btnTypeGenre = document.getElementById("btnTypeGenre");
const btnTypeArtist = document.getElementById("btnTypeArtist");
const btnToStepSearch = document.getElementById("btnToStepSearch");
const btnBackToMode = document.getElementById("btnBackToMode");
const searchInput = document.getElementById("searchInput");
const btnStartGame = document.getElementById("btnStartGame");


btnModeSurvival.addEventListener("click", () => {
    modoJuego = "survival";
    btnModeSurvival.classList.add("active");
    btnModeRounds.classList.remove("active");
    btnToStepSearch.style.display = "block"; // Muestra botón NEXT
});

btnModeRounds.addEventListener("click", () => {
    modoJuego = "rounds";
    btnModeRounds.classList.add("active");
    btnModeSurvival.classList.remove("active");
    btnToStepSearch.style.display = "block"; // Muestra botón NEXT
});

btnToStepSearch.addEventListener("click", () => {
    stepMode.style.display = "none";
    stepSearch.style.display = "flex";
});

btnBackToMode.addEventListener("click", () => {
    stepSearch.style.display = "none";
    stepMode.style.display = "flex";
});


btnTypeGenre.addEventListener("click", () => {
    tipoBusqueda = "genre";
    btnTypeGenre.classList.add("active");
    btnTypeArtist.classList.remove("active");
    searchInput.disabled = false; // Desbloquea la escritura
    searchInput.placeholder = "e.g. synthwave, rock, pop...";
    searchInput.focus();
});

btnTypeArtist.addEventListener("click", () => {
    tipoBusqueda = "artist";
    btnTypeArtist.classList.add("active");
    btnTypeGenre.classList.remove("active");
    searchInput.disabled = false; // Desbloquea la escritura
    searchInput.placeholder = "e.g. daft punk, queen...";
    searchInput.focus();
});


btnStartGame.addEventListener("click", () => {
    const valorBusqueda = searchInput.value.trim();
    
    if (!valorBusqueda) return;

    // NUEVO: Validador de teclado
    const patronEstructura = /^[a-zA-Z0-9\sñÑáéíóúÁÉÍÓÚüÜ\-]{2,}$/;
    
    if (!patronEstructura.test(valorBusqueda)) {
        alert("INVALID INPUT!\nPlease type a valid keyword or text name for the Artist / Genre.");
        searchInput.value = "";
        searchInput.focus();
        return;
    }

    if (typeof empezarJuego === "function") {
        empezarJuego(valorBusqueda);
    }
});

// Resetea por completo los botones y pantallas de este archivo
function resetearMenuInicial() {
    const menuInicio = document.getElementById("startMenu");
    menuInicio.style.display = "block";
    stepSearch.style.display = "none";
    stepMode.style.display = "flex";
    
    btnModeSurvival.classList.remove("active");
    btnModeRounds.classList.remove("active");
    btnTypeGenre.classList.remove("active");
    btnTypeArtist.classList.remove("active");
    btnToStepSearch.style.display = "none";
    
    searchInput.value = "";
    searchInput.disabled = true;
    searchInput.placeholder = "Select option above...";
    
    modoJuego = null;
    tipoBusqueda = null;
}