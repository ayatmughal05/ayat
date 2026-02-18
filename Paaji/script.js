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
// Global music
// --------------------
const musicPlayer = document.getElementById("bgMusic");
musicPlayer.volume = 1;
musicPlayer.loop = true;

// --------------------
// Unlock and start music on first interaction
// --------------------
function startMusic() {
    musicPlayer.play().catch(() => {
        console.log("Tap detected but music blocked on iOS. Tap again to start.");
    });
    // Remove listener after first tap
    document.body.removeEventListener("click", startMusic);
    document.body.removeEventListener("touchstart", startMusic);
}

// Add listeners for first tap/click
document.body.addEventListener("click", startMusic);
document.body.addEventListener("touchstart", startMusic);

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
function goToScreen(nextIndex) {
    const currentIndex = screens.findIndex(s => !s.classList.contains("hidden"));
    if (currentIndex === -1 || nextIndex === currentIndex) return;

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

        // Music continues automatically, no need to play again

        goToScreen(nextIndex);
    });
});

document.querySelectorAll(".prevButton").forEach(btn => {
    btn.addEventListener("click", () => {
        const prevId = btn.dataset.prev;
        if (!prevId) return;
        const prevIndex = screens.findIndex(s => s.id === prevId);
        if (prevIndex === -1) return;

        // Music continues automatically

        goToScreen(prevIndex);
    });
});
