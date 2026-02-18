"use strict";

// --------------------
// Screens
// --------------------
const screens = [
    document.getElementById("screen1"),
    document.getElementById("screen2"),
    document.getElementById("screen3"),
    document.getElementById("screen4"),
    document.getElementById("screen5"),
    document.getElementById("screen6")
];

// --------------------
// Music setup
// --------------------
// We'll use ONE audio element for all screens to avoid iOS issues
const musicPlayer = new Audio();
musicPlayer.loop = true;
musicPlayer.volume = 1;

// Map screen index → music file
const screenMusic = [
    null,               // screen1 has no music
    "aankhonsong.mp3",  // screen2
    "Nazar.mp3",        // screen3
    "saath.mp3",        // screen4
    "Ullu.mp3",         // screen5
    "Batameez.mp3"      // screen6
];

// --------------------
// Unlock audio for iOS
// --------------------
function unlockAudio() {
    // Play and pause quickly to unlock on first tap
    musicPlayer.play().then(() => musicPlayer.pause()).catch(()=>{});
}
document.body.addEventListener("touchstart", unlockAudio, { once: true });
document.body.addEventListener("click", unlockAudio, { once: true });

// --------------------
// Sparkles animation
// --------------------
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

// --------------------
// Helper: go to next screen
// --------------------
async function goToScreen(nextIndex) {
    const currentIndex = screens.findIndex(s => !s.classList.contains("hidden"));
    if (currentIndex === -1 || nextIndex === currentIndex) return;

    // Stop current music
    musicPlayer.pause();
    musicPlayer.currentTime = 0;

    // Play next screen music if exists
    const nextMusicSrc = screenMusic[nextIndex];
    if (nextMusicSrc) {
        musicPlayer.src = nextMusicSrc;
        try {
            await musicPlayer.play();
            console.log("Music playing!");
        } catch (err) {
            console.log("iOS play blocked:", err);
        }
    }

    // Animate current screen out
    screens[currentIndex].style.transition = "transform 0.9s ease-in-out, opacity 0.9s ease-in-out";
    screens[currentIndex].style.transform = "scale(3)";
    screens[currentIndex].style.opacity = "0";

    // Show next screen after animation
    setTimeout(() => {
        screens[currentIndex].classList.add("hidden");
        screens[nextIndex].classList.remove("hidden");
        screens[currentIndex].style.transform = "scale(1)";
        screens[currentIndex].style.opacity = "1";
    }, 900);
}

// --------------------
// Button handlers
// --------------------
document.querySelectorAll(".nextButton").forEach(btn => {
    btn.addEventListener("click", () => {
        const nextId = btn.dataset.next;
        if (!nextId) return;
        const nextIndex = screens.findIndex(s => s.id === nextId);
        if (nextIndex === -1) return;
        goToScreen(nextIndex);
    });
});

document.querySelectorAll(".prevButton").forEach(btn => {
    btn.addEventListener("click", () => {
        const prevId = btn.dataset.prev;
        if (!prevId) return;
        const prevIndex = screens.findIndex(s => s.id === prevId);
        if (prevIndex === -1) return;
        goToScreen(prevIndex);
    });
});
