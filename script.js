
const card = document.getElementById("draggableCard");

let dragging = false;
let startX = 0;
let startY = 0;
let currentX = 0;
let currentY = 0;

card.addEventListener("pointerdown", (e) => {
    dragging = true;

    card.classList.remove("returning");
    card.classList.add("dragging");

    startX = e.clientX - currentX;
    startY = e.clientY - currentY;

    card.setPointerCapture(e.pointerId);
});

card.addEventListener("pointermove", (e) => {
    if (!dragging) return;

    currentX = e.clientX - startX;
    currentY = e.clientY - startY;

    card.style.setProperty("--drag-x", `${currentX}px`);
    card.style.setProperty("--drag-y", `${currentY}px`);
});

function returnCard() {
    if (!dragging) return;

    dragging = false;
    card.classList.remove("dragging");
    card.classList.add("returning");

    currentX = 0;
    currentY = 0;

    card.style.setProperty("--drag-x", "0px");
    card.style.setProperty("--drag-y", "0px");
}

card.addEventListener("pointerup", returnCard);
card.addEventListener("pointercancel", returnCard);

card.addEventListener("transitionend", (e) => {
    if (e.propertyName === "transform") {
        card.classList.remove("returning");
    }
});


// MUSIC PLAYER

const music = document.getElementById("backgroundMusic");
const musicButton = document.getElementById("musicButton");
const vinyl = document.getElementById("vinyl");
const musicStatus = document.getElementById("musicStatus");

music.volume = 0.5;

musicButton.addEventListener("click", async () => {
    try {
        if (music.paused) {
            music.muted = false;
            await music.play();
            musicStatus.textContent = "Now playing ♪";
        } else if (music.muted) {
            music.muted = false;
            musicStatus.textContent = "Now playing ♪";
        } else {
            music.pause();
            musicStatus.textContent = "Music paused";
        }
    } catch (error) {
        musicStatus.textContent = "Check your music.mp3 file";
        console.error(error);
    }
});

music.addEventListener("play", () => {
    vinyl.classList.add("playing");
});

music.addEventListener("pause", () => {
    vinyl.classList.remove("playing");
});

// SCROLL ANIMATIONS

const observer = new IntersectionObserver((entries) => {

    entries.forEach((entry) => {

        if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
        }

    });

}, {
    threshold: 0.15
});

document.querySelectorAll(".reveal").forEach((element) => {
    observer.observe(element);
});
