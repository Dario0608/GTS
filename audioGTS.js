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