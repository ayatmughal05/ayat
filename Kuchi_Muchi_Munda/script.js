// Mobile audio unlock for first interaction
function unlockAudio() {
    musics.forEach(music => {
        if (music) {
            music.play().then(() => music.pause());
        }
    });
    // Remove event listener after first tap
    document.body.removeEventListener('touchstart', unlockAudio);
    document.body.removeEventListener('click', unlockAudio);
}
document.body.addEventListener('touchstart', unlockAudio, { once: true });
document.body.addEventListener('click', unlockAudio, { once: true });

// Screens and music
const screens = [
    document.getElementById("screen1"),
    document.getElementById("screen2"),
    document.getElementById("screen3"),
    document.getElementById("screen4"),
    document.getElementById("screen5"),
    document.getElementById("screen6")
];

const musics = [
    null, // screen1 no music
    document.getElementById("music2"),
    document.getElementById("music3"),
    document
