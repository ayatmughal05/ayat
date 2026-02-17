// Unlock audio for mobile browsers
function unlockAudio() {
    musics.forEach(music => {
        if (music) {
            music.play().then(() => music.pause());
        }
    });
    // Remove the event listener after first tap
    document.body.removeEventListener('touchstart', unlockAudio);
    document.body.removeEventListener('click', unlockAudio);
}

// Listen for first interaction to unlock audio
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

        // Smooth transition
        screens[currentIndex].style.transition = "transform 0.9s ease-in-out, opacity 0.9s ease-in-out";
        screens[currentIndex].style.transform = "scale(3)";
        screens[currentIndex].style.opacity = "0";

        setTimeout(() => {
            screens[currentIndex].classList.add("hidden");
            screens[nextIndex].classList.remove("hidden");

            screens[currentIndex].style.transform = "scale(1)";
            screens[currentIndex].style.opacity = "1";

            // Mobile-friendly: play next music immediately inside the click handler
            if (musics[nextIndex]) {
                musics[nextIndex].currentTime = 0;
                const playPromise = musics[nextIndex].play();
                if (playPromise !== undefined) {
                    playPromise
                        .then(() => {
                            // Audio is playing
                        })
                        .catch(err => {
                            console.log("Mobile playback prevented:", err);
                        });
                }
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
