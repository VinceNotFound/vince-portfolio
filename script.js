
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

let userPaused = false;

async function startAutoplay() {
    if (userPaused) return;
    try {
        music.muted = false;
        await music.play();
        musicStatus.textContent = "Now playing ♪";
    } catch (err) {
        // Browsers block unmuted audio until first user gesture; unlock on first interaction anywhere
        musicStatus.textContent = "Click anywhere to start ♪";
        const unlockAudio = async () => {
            if (userPaused) return;
            try {
                music.muted = false;
                await music.play();
                musicStatus.textContent = "Now playing ♪";
            } catch (e) {
                console.error(e);
            }
        };
        ["click", "pointerdown", "keydown", "touchstart"].forEach((evt) => {
            document.addEventListener(evt, unlockAudio, { once: true });
        });
    }
}

window.addEventListener("DOMContentLoaded", startAutoplay);

musicButton.addEventListener("click", async (e) => {
    e.stopPropagation();
    try {
        if (music.paused) {
            userPaused = false;
            music.muted = false;
            await music.play();
            musicStatus.textContent = "Now playing ♪";
        } else if (music.muted) {
            userPaused = false;
            music.muted = false;
            musicStatus.textContent = "Now playing ♪";
        } else {
            userPaused = true;
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
    musicStatus.textContent = "Now playing ♪";
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


// INTEREST GALLERY MODAL

const galleryData = {
    gaming: {
        title: "Gaming Moments.",
        images: [
            "images/gaming1.jpg",
            "images/gaming2.jpg"
        ]
    },
    coding: {
        title: "Coding Projects.",
        images: [
            "images/coding1.jpg",
            "images/coding2.jpg"
        ]
    },
    socializing: {
        title: "Socializing & Friends.",
        images: [
            "images/social1.jpg",
            "images/social2.jpg"
        ]
    },
    traveling: {
        title: "Traveling Adventures.",
        images: [
            "images/travel1.jpg",
            "images/travel2.jpg"
        ]
    }
};

function openGallery(category) {
    const modal = document.getElementById("galleryModal");
    const title = document.getElementById("modalTitle");
    const imageContainer = document.getElementById("modalImages");

    const data = galleryData[category];
    title.textContent = data.title;
    imageContainer.innerHTML = "";

    data.images.forEach((imgSrc) => {
        const img = document.createElement("img");
        img.src = imgSrc;
        img.alt = data.title;
        imageContainer.appendChild(img);
    });

    modal.style.display = "flex";
}

function forceClose() {
    document.getElementById("galleryModal").style.display = "none";
}

function closeModal(event) {
    if (event.target.id === "galleryModal") {
        forceClose();
    }
}

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        forceClose();
    }
});
