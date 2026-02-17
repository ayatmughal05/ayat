// =========================
// Kuchi Muchi Munda Website JS
// Works on Desktop & iPhone
// =========================

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

// -------------------------
// Unlock audio on first tap for iPhone
// -------------------------
function unlockAudio() {
    musics.forEach(music => {
        if (music) {
            music.play().then(() => music.pause()).catch(() => {});
        }
    });
    document.body.removeEventListener('touchstart', unlockAudio);
    document.body.removeEventListener('click', unlockAudio);
}

document.body.addEventListener('touchstart', unlockAudio, { once: true });
document.body.addEventListener('click', unlockAudio, { once: true });

// -------------------------
// Sparkles Animation
// -------------------------
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

startSparkles();

// -------------------------
// Button click handler
// -------------------------
document.querySelectorAll(".nextButton").forEach(btn => {
    btn.addEventListener("click", () => {
        const currentIndex = screens.findIndex(s => !s.classList.contains("hidden"));
        const nextId = btn.dataset.next;
        if (!nextId) return;

        const nextIndex = screens.findIndex(s => s.id === nextId);
        if (nextIndex === -1) return;

        // Stop current music
        if (musics[currentIndex]) {
            musics[currentIndex].pause();
            musics[currentIndex].currentTime = 0;
        }

        // Smooth transition for current screen
        screens[currentIndex].style.transition = "transform 0.9s ease-in-out, opacity 0.9s ease-in-out";
        screens[currentIndex].style.transform = "scale(3)";
        screens[currentIndex].style.opacity = "0";

        setTimeout(() => {
            // Hide current screen, show next
            screens[currentIndex].classList.add("hidden");
            screens[nextIndex].classList.remove("hidden");

            // Reset current screen style
            screens[currentIndex].style.transform = "scale(1)";
            screens[currentIndex].style.opacity = "1";

            // -----------------
            // Play next music directly on user tap
            // -----------------
            if (musics[nextIndex]) {
                musics[nextIndex].currentTime = 0;
                musics[nextIndex].play().catch(() => {});
            }
        }, 900);
    });
});