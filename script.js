// INTERACTIVE PHYSICS LANYARD & FLIPPABLE ID CARD

const card = document.getElementById("draggableCard");
const strap = document.getElementById("lanyardStrap");
const flipper = document.getElementById("idFlipper");

let dragging = false;
let hasMoved = false;
let startMouseX = 0;
let startMouseY = 0;

let posX = 0;
let posY = 0;
let velX = 0;
let velY = 0;

// Spring physics parameters
const stiffness = 0.085;
const damping = 0.80;
const restStrapLength = 185; // Matches top:-110px to card top:75px

function animateLanyard() {
    if (!dragging) {
        // Spring force pulling back to resting short lanyard
        const forceX = -stiffness * posX;
        const forceY = -stiffness * posY;

        velX = (velX + forceX) * damping;
        velY = (velY + forceY) * damping;

        posX += velX;
        posY += velY;

        if (
            Math.abs(posX) < 0.05 &&
            Math.abs(posY) < 0.05 &&
            Math.abs(velX) < 0.05 &&
            Math.abs(velY) < 0.05
        ) {
            posX = 0;
            posY = 0;
            velX = 0;
            velY = 0;
        }
    }

    // Vector from top anchor to card clip (top-center of card)
    const dx = posX;
    const dy = restStrapLength + posY;

    // Infinite range stretch & angle calculation
    const length = Math.max(40, Math.hypot(dx, dy));
    const angleRad = Math.atan2(dx, dy);
    const angleDeg = -(angleRad * (180 / Math.PI));

    if (strap) {
        strap.style.height = `${length}px`;
        strap.style.transform = `rotate(${angleDeg}deg)`;
    }

    if (card) {
        // Since transform-origin is top center, the clip stays locked onto the end of the strap!
        const dynamicTilt = angleDeg + velX * 0.25;
        card.style.transform = `translate3d(${posX}px, ${posY}px, 0) rotate(${dynamicTilt}deg)`;
    }

    requestAnimationFrame(animateLanyard);
}

if (card) {
    card.addEventListener("pointerdown", (e) => {
        dragging = true;
        hasMoved = false;
        card.classList.add("dragging");

        startMouseX = e.clientX - posX;
        startMouseY = e.clientY - posY;
        velX = 0;
        velY = 0;

        card.setPointerCapture(e.pointerId);
    });

    window.addEventListener("pointermove", (e) => {
        if (!dragging) return;

        const nextX = e.clientX - startMouseX;
        const nextY = e.clientY - startMouseY;

        if (Math.hypot(nextX - posX, nextY - posY) > 4) {
            hasMoved = true;
        }

        velX = (nextX - posX) * 0.45;
        velY = (nextY - posY) * 0.45;

        posX = nextX;
        posY = nextY;
    });

    function releaseCard(e) {
        if (!dragging) return;
        dragging = false;
        card.classList.remove("dragging");

        if (e && e.pointerId !== undefined && card.hasPointerCapture(e.pointerId)) {
            card.releasePointerCapture(e.pointerId);
        }

        // Flip card if clicked without dragging
        if (!hasMoved && flipper) {
            flipper.classList.toggle("is-flipped");
        }
    }

    window.addEventListener("pointerup", releaseCard);
    window.addEventListener("pointercancel", releaseCard);

    requestAnimationFrame(animateLanyard);
}


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
