// Mobile audio unlock
function unlockAudio() {
    musics.forEach(music => {
        if (music) {
            music.play().then(() => music.pause());
        }
    });
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
    null, 
    document.getElementById("music2"),
    document.getElementById("music3"),
    document.getElementById("music4"),
    document.getElementById("music5"),
    document.getElementById("music6")
];

// Sparkles
startSparkles();

// Button click handler
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

        // Play next music immediately
        if (musics[nextIndex]) {
            musics[nextIndex].currentTime = 0;
            const playPromise = musics[nextIndex].play();
            if (playPromise !== undefined) playPromise.catch(() => {});
        }

        // Trigger visual transition via requestAnimationFrame (works on mobile)
        screens[currentIndex].style.transition = "transform 0.9s ease-in-out, opacity 0.9s ease-in-out";
        screens[currentIndex].style.transform = "scale(3)";
        screens[currentIndex].style.opacity = "0";

        // Wait for next frame to swap screens
        requestAnimationFrame(() => {
            setTimeout(() => {
                screens[currentIndex].classList.add("hidden");
                screens[nextIndex].classList.remove("hidden");

                screens[currentIndex].style.transform = "scale(1)";
                screens[currentIndex].style.opacity = "1";
            }, 900);
        });
    });
});

// Sparkles function
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
