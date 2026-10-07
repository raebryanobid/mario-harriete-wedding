/* =========================================================
   MARIO & HARRIETE — CLEAN INVITATION SCRIPT
========================================================= */

const opening = document.getElementById("opening");
const envelope = document.getElementById("envelope");
const flap = document.getElementById("flap");
const seal = document.getElementById("seal");
const invitation = document.getElementById("invitation");
const openButton = document.getElementById("openInvitation");
const bloomLayer = document.getElementById("bloomLayer");
const rsvpButton = document.getElementById("rsvpButton");
const closingEnvelope = document.getElementById("closingEnvelope");
const openingChime = document.getElementById("openingChime");
const weddingMusic = document.getElementById("weddingMusic");
const musicButton = document.getElementById("musicButton");

let openingNow = false;
let closingNow = false;
let revealObserver = null;

function setMusicState(playing) {
    musicButton?.classList.toggle("is-playing", playing);
    musicButton?.setAttribute("aria-pressed", String(playing));
}

function playOpeningChime() {
    if (!openingChime) return;
    openingChime.pause();
    openingChime.currentTime = 0;
    openingChime.volume = 0.72;
    openingChime.play().catch(error => console.warn("Opening chime could not play:", error));
}

async function startWeddingMusic() {
    if (!weddingMusic) return;
    weddingMusic.volume = 0.34;
    try {
        await weddingMusic.play();
        setMusicState(true);
    } catch (error) {
        setMusicState(false);
        console.warn("Wedding music could not start automatically:", error);
    }
}

function stopWeddingMusic(reset = false) {
    if (!weddingMusic) return;
    weddingMusic.pause();
    if (reset) weddingMusic.currentTime = 0;
    setMusicState(false);
}

function bloom(x, y, scale = 1) {
    if (!bloomLayer) return;
    const designs = ["lily", "sprig", "bouquet"];
    const design = designs[Math.floor(Math.random() * designs.length)];
    const node = document.createElement("div");
    node.className = `tap-bloom bloom-${design}`;
    node.style.left = `${x}px`;
    node.style.top = `${y}px`;
    node.style.setProperty("--bloom-scale", scale);

    if (design === "lily") {
        node.innerHTML = '<svg viewBox="0 0 180 180" aria-hidden="true"><use href="#lily"></use></svg>';
    } else if (design === "sprig") {
        node.innerHTML = '<svg viewBox="0 0 260 420" aria-hidden="true"><use href="#sprig"></use></svg>';
    } else {
        node.innerHTML = `
            <svg class="bouquet-sprig" viewBox="0 0 260 420" aria-hidden="true"><use href="#sprig"></use></svg>
            <svg class="bouquet-lily bouquet-lily--one" viewBox="0 0 180 180" aria-hidden="true"><use href="#lily"></use></svg>
            <svg class="bouquet-lily bouquet-lily--two" viewBox="0 0 180 180" aria-hidden="true"><use href="#lily"></use></svg>`;
    }

    bloomLayer.appendChild(node);
    window.setTimeout(() => node.remove(), 1800);
}

function setupReveals() {
    const sections = document.querySelectorAll(".reveal");
    revealObserver?.disconnect();

    if (!("IntersectionObserver" in window)) {
        sections.forEach(section => section.classList.add("is-revealed"));
        return;
    }

    revealObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("is-revealed");
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: "0px 0px -7% 0px" });

    sections.forEach(section => revealObserver.observe(section));
}

function openInvite(event) {
    if (openingNow || closingNow) return;
    openingNow = true;

    /* Both calls happen inside the guest's tap/click gesture. */
    playOpeningChime();
    startWeddingMusic();

    if (event && Number.isFinite(event.clientX) && event.clientX > 0) {
        bloom(event.clientX, event.clientY, 0.9);
    }

    opening.classList.add("is-opening");

    seal?.animate([
        { transform: "translate(-50%, -50%) scale(1)", opacity: 1 },
        { transform: "translate(-50%, -50%) scale(.82)", opacity: 1, offset: .32 },
        { transform: "translate(-50%, -50%) scale(1.06)", opacity: .9, offset: .58 },
        { transform: "translate(-50%, -50%) scale(.35)", opacity: 0 }
    ], { duration: 420, easing: "cubic-bezier(.2,.75,.2,1)", fill: "forwards" });

    window.setTimeout(() => {
        flap?.animate([
            { transform: "rotateX(0deg)" },
            { transform: "rotateX(-178deg)" }
        ], { duration: 720, easing: "cubic-bezier(.2,.7,.2,1)", fill: "forwards" });
    }, 120);

    window.setTimeout(() => {
        invitation.classList.add("is-visible");
        invitation.setAttribute("aria-hidden", "false");
        window.scrollTo(0, 0);

        const paper = invitation.querySelector(".paper");
        if (paper) {
            paper.style.opacity = "0";
            paper.style.transform = "translateY(55px) scale(.94)";
            paper.style.transformOrigin = "50% 0";
        }
    }, 560);

    window.setTimeout(() => {
        envelope?.animate([
            { transform: "translateY(0) scale(1)", opacity: 1 },
            { transform: "translateY(70px) scale(.98)", opacity: .95, offset: .55 },
            { transform: "translateY(180px) scale(.95)", opacity: 0 }
        ], { duration: 820, easing: "cubic-bezier(.22,.68,.25,1)", fill: "forwards" });

        const paper = invitation.querySelector(".paper");
        paper?.animate([
            { opacity: 0, transform: "translateY(55px) scale(.94)" },
            { opacity: 1, transform: "translateY(0) scale(1)" }
        ], { duration: 780, easing: "cubic-bezier(.18,.76,.2,1)", fill: "forwards" });
    }, 720);

    window.setTimeout(() => opening.classList.add("is-complete"), 1180);

    window.setTimeout(() => {
        document.body.classList.remove("is-locked");
        document.body.classList.add("invitation-open");
        opening.style.display = "none";
        setupReveals();
    }, 1900);
}

function resetInvitation() {
    if (closingNow) return;
    closingNow = true;
    document.body.classList.add("is-locked");
    invitation.classList.add("is-closing");
    stopWeddingMusic(true);

    window.setTimeout(() => {
        window.scrollTo(0, 0);
        invitation.classList.remove("is-visible", "is-closing");
        invitation.setAttribute("aria-hidden", "true");

        opening.style.display = "block";
        opening.classList.remove("is-opening", "is-complete");
        envelope?.getAnimations().forEach(animation => animation.cancel());
        flap?.getAnimations().forEach(animation => animation.cancel());
        seal?.getAnimations().forEach(animation => animation.cancel());

        const paper = invitation.querySelector(".paper");
        if (paper) {
            paper.getAnimations().forEach(animation => animation.cancel());
            paper.style.opacity = "";
            paper.style.transform = "";
            paper.style.transformOrigin = "";
        }

        document.querySelectorAll(".reveal").forEach(section => section.classList.remove("is-revealed"));
        document.body.classList.remove("invitation-open");
        openingNow = false;
        closingNow = false;
    }, 650);
}

/* Opening controls: whole envelope, seal, and label all work. */
envelope?.addEventListener("click", event => {
    event.preventDefault();
    event.stopPropagation();
    openInvite(event);
});

envelope?.addEventListener("keydown", event => {
    if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openInvite(event);
    }
});

seal?.addEventListener("click", event => {
    event.preventDefault();
    event.stopPropagation();
    openInvite(event);
});

openButton?.addEventListener("click", event => {
    event.preventDefault();
    event.stopPropagation();
    openInvite(event);
});

closingEnvelope?.addEventListener("click", event => {
    event.preventDefault();
    event.stopPropagation();
    resetInvitation();
});

musicButton?.addEventListener("click", async event => {
    event.preventDefault();
    event.stopPropagation();
    if (!weddingMusic) return;
    if (weddingMusic.paused) await startWeddingMusic();
    else stopWeddingMusic(false);
});

rsvpButton?.addEventListener("click", event => {
    const rect = event.currentTarget.getBoundingClientRect();
    bloom(rect.left + rect.width / 2, rect.top + rect.height / 2, .9);
});

document.addEventListener("pointerdown", event => {
    if (event.button !== undefined && event.button !== 0) return;
    if (event.target.closest("#envelope, #seal, #openInvitation, #closingEnvelope, #musicButton")) return;
    bloom(event.clientX, event.clientY, .82);
}, { passive: true });
