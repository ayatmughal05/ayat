// Unlock audio on first user interaction (mobile-friendly)
let audioUnlocked = false;
function unlockAudio() {
    if (!audioUnlocked) {
        musics.forEach(music => {
            if (music) {
                music.play().then(() => music.pause());
            }
        });
        audioUnlocked = true;
    }
}
document.body.addEventListener('touchstart', unlockAudio, { once: true });
document.body.addEventListener('click', unlockAudio, { once: true });

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
    document.getElementById("music4"),
    document.getElementById("music5"),
    document.getElementById("music6")
];

startSparkles();

/* Button click handler for all screens */
document.querySelectorAll(".nextButton").forEach(btn => {
    btn.addEventListener("click", (e) => {
        unlockAudio(); // Ensure audio is unlocked for mobile

        const currentIndex = screens.findIndex(s => !s.classList.contains("hidden"));
        const nextId = btn.dataset.next;
        if (!nextId) return;

        const nextIndex = screens.findIndex(s => s.id === nextId);
        if (nextIndex === -1) return;

        // Stop current music immediately
        if (musics[currentIndex]) {
            musics[currentIndex].pause();
            musics[currentIndex].currentTime = 0;
        }

        // Smooth transition
        screens[currentIndex].style.transition = "transform 0.9s ease-in-out, opacity 0.9s ease-in-out";
        screens[currentIndex].style.transform = "scale(3)";
        screens[currentIndex].style.opacity = "0";

        setTimeout(() => {
            screens[currentIndex].classList.add("hidden");
            screens[nextIndex].classList.remove("hidden");

            screens[currentIndex].style.transform = "scale(1)";
            screens[currentIndex].style.opacity = "1";

            // Play next music immediately (mobile-friendly)
            if (musics[nextIndex]) {
                musics[nextIndex].currentTime = 0;
                musics[nextIndex].play().catch(err => {
                    console.log("Mobile playback blocked:", err);
                });
            }
        }, 900);
    });
});

/* Sparkles animation */
function startSparkles() {
    setInterval(() => {
        document.querySelectorAll(".particles").forEach(container => {
            const sparkle = document.createElement("div");
            sparkle.classList.add("sparkle");
            sparkle.style.left = Math.random() * 100 + "vw";
            sparkle.style.animationDuration = (6 + Math.random() * 6) + "s";
            sparkle.style.width = (2 + Math.random() * 4) + "px";
            sparkle.style.height = sparkle.style.width;
            container.appendChild(sparkle);
            setTimeout(() => sparkle.remove(), 12000);
        });
    }, 400);
}
