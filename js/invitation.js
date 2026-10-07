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

    openingChime
        .play()
        .catch(error =>
            console.warn("Opening chime could not play:", error)
        );
}

async function startWeddingMusic() {
    if (!weddingMusic) return;

    weddingMusic.volume = 0.34;

    try {
        await weddingMusic.play();
        setMusicState(true);
    } catch (error) {
        setMusicState(false);

        console.warn(
            "Wedding music could not start automatically:",
            error
        );
    }
}

function stopWeddingMusic(reset = false) {
    if (!weddingMusic) return;

    weddingMusic.pause();

    if (reset) {
        weddingMusic.currentTime = 0;
    }

    setMusicState(false);
}


/* =========================================================
   TAP BLOOMS
========================================================= */

function bloom(x, y, scale = 1) {
    if (!bloomLayer) return;

    const designs = [
        "lily",
        "sprig",
        "bouquet"
    ];

    const design =
        designs[
            Math.floor(
                Math.random() * designs.length
            )
        ];

    const node =
        document.createElement("div");

    node.className =
        `tap-bloom bloom-${design}`;

    node.style.left = `${x}px`;
    node.style.top = `${y}px`;

    node.style.setProperty(
        "--bloom-scale",
        scale
    );

    if (design === "lily") {

        node.innerHTML = `
            <svg
                viewBox="0 0 180 180"
                aria-hidden="true"
            >
                <use href="#lily"></use>
            </svg>
        `;

    } else if (design === "sprig") {

        node.innerHTML = `
            <svg
                viewBox="0 0 260 420"
                aria-hidden="true"
            >
                <use href="#sprig"></use>
            </svg>
        `;

    } else {

        node.innerHTML = `
            <svg
                class="bouquet-sprig"
                viewBox="0 0 260 420"
                aria-hidden="true"
            >
                <use href="#sprig"></use>
            </svg>

            <svg
                class="bouquet-lily bouquet-lily--one"
                viewBox="0 0 180 180"
                aria-hidden="true"
            >
                <use href="#lily"></use>
            </svg>

            <svg
                class="bouquet-lily bouquet-lily--two"
                viewBox="0 0 180 180"
                aria-hidden="true"
            >
                <use href="#lily"></use>
            </svg>
        `;
    }

    bloomLayer.appendChild(node);

    window.setTimeout(
        () => node.remove(),
        1800
    );
}


/* =========================================================
   SCROLL REVEALS
========================================================= */

function setupReveals() {

    const sections =
        document.querySelectorAll(".reveal");

    revealObserver?.disconnect();

    if (
        !(
            "IntersectionObserver"
            in window
        )
    ) {
        sections.forEach(section =>
            section.classList.add(
                "is-revealed"
            )
        );

        return;
    }

    revealObserver =
        new IntersectionObserver(
            entries => {

                entries.forEach(entry => {

                    if (
                        entry.isIntersecting
                    ) {
                        entry.target
                            .classList
                            .add(
                                "is-revealed"
                            );

                        revealObserver
                            .unobserve(
                                entry.target
                            );
                    }
                });

            },
            {
                threshold: 0.1,
                rootMargin:
                    "0px 0px -7% 0px"
            }
        );

    sections.forEach(section =>
        revealObserver.observe(section)
    );
}


/* =========================================================
   OPEN INVITATION
========================================================= */

function openInvite(event) {

    if (
        openingNow ||
        closingNow
    ) {
        return;
    }

    openingNow = true;

    /*
        Both audio calls happen inside
        the guest's click/tap gesture.
    */
    playOpeningChime();
    startWeddingMusic();

    if (
        event &&
        Number.isFinite(
            event.clientX
        ) &&
        event.clientX > 0
    ) {
        bloom(
            event.clientX,
            event.clientY,
            0.9
        );
    }

    opening.classList.add(
        "is-opening"
    );


    /* Wax seal animation */

    seal?.animate(
        [
            {
                transform:
                    "translate(-50%, -50%) scale(1)",
                opacity: 1
            },

            {
                transform:
                    "translate(-50%, -50%) scale(.82)",
                opacity: 1,
                offset: .32
            },

            {
                transform:
                    "translate(-50%, -50%) scale(1.06)",
                opacity: .9,
                offset: .58
            },

            {
                transform:
                    "translate(-50%, -50%) scale(.35)",
                opacity: 0
            }
        ],
        {
            duration: 420,
            easing:
                "cubic-bezier(.2,.75,.2,1)",
            fill: "forwards"
        }
    );


    /* Open flap */

    window.setTimeout(
        () => {

            flap?.animate(
                [
                    {
                        transform:
                            "rotateX(0deg)"
                    },
                    {
                        transform:
                            "rotateX(-178deg)"
                    }
                ],
                {
                    duration: 720,
                    easing:
                        "cubic-bezier(.2,.7,.2,1)",
                    fill: "forwards"
                }
            );

        },
        120
    );


    /* Prepare invitation */

    window.setTimeout(
        () => {

            invitation.classList.add(
                "is-visible"
            );

            invitation.setAttribute(
                "aria-hidden",
                "false"
            );

            window.scrollTo(0, 0);

            const paper =
                invitation.querySelector(
                    ".paper"
                );

            if (paper) {
                paper.style.opacity =
                    "0";

                paper.style.transform =
                    "translateY(55px) scale(.94)";

                paper.style.transformOrigin =
                    "50% 0";
            }

        },
        560
    );


    /* Envelope moves away */

    window.setTimeout(
        () => {

            envelope?.animate(
                [
                    {
                        transform:
                            "translateY(0) scale(1)",
                        opacity: 1
                    },

                    {
                        transform:
                            "translateY(70px) scale(.98)",
                        opacity: .95,
                        offset: .55
                    },

                    {
                        transform:
                            "translateY(180px) scale(.95)",
                        opacity: 0
                    }
                ],
                {
                    duration: 820,
                    easing:
                        "cubic-bezier(.22,.68,.25,1)",
                    fill: "forwards"
                }
            );


            const paper =
                invitation.querySelector(
                    ".paper"
                );

            paper?.animate(
                [
                    {
                        opacity: 0,
                        transform:
                            "translateY(55px) scale(.94)"
                    },
                    {
                        opacity: 1,
                        transform:
                            "translateY(0) scale(1)"
                    }
                ],
                {
                    duration: 780,
                    easing:
                        "cubic-bezier(.18,.76,.2,1)",
                    fill: "forwards"
                }
            );

        },
        720
    );


    window.setTimeout(
        () =>
            opening.classList.add(
                "is-complete"
            ),
        1180
    );


    window.setTimeout(
        () => {

            document.body
                .classList
                .remove(
                    "is-locked"
                );

            document.body
                .classList
                .add(
                    "invitation-open"
                );

            opening.style.display =
                "none";

            setupReveals();

        },
        1900
    );
}


/* =========================================================
   CLOSE / RESET INVITATION
========================================================= */

function resetInvitation() {

    if (closingNow) {
        return;
    }

    closingNow = true;

    document.body.classList.add(
        "is-locked"
    );

    invitation.classList.add(
        "is-closing"
    );

    stopWeddingMusic(true);


    window.setTimeout(
        () => {

            window.scrollTo(0, 0);

            invitation.classList.remove(
                "is-visible",
                "is-closing"
            );

            invitation.setAttribute(
                "aria-hidden",
                "true"
            );


            opening.style.display =
                "block";

            opening.classList.remove(
                "is-opening",
                "is-complete"
            );


            envelope
                ?.getAnimations()
                .forEach(
                    animation =>
                        animation.cancel()
                );

            flap
                ?.getAnimations()
                .forEach(
                    animation =>
                        animation.cancel()
                );

            seal
                ?.getAnimations()
                .forEach(
                    animation =>
                        animation.cancel()
                );


            const paper =
                invitation.querySelector(
                    ".paper"
                );

            if (paper) {

                paper
                    .getAnimations()
                    .forEach(
                        animation =>
                            animation.cancel()
                    );

                paper.style.opacity = "";
                paper.style.transform = "";
                paper.style.transformOrigin = "";
            }


            document
                .querySelectorAll(
                    ".reveal"
                )
                .forEach(
                    section =>
                        section
                            .classList
                            .remove(
                                "is-revealed"
                            )
                );


            document.body
                .classList
                .remove(
                    "invitation-open"
                );

            openingNow = false;
            closingNow = false;

        },
        650
    );
}


/* =========================================================
   OPENING CONTROLS
========================================================= */

envelope?.addEventListener(
    "click",
    event => {

        event.preventDefault();
        event.stopPropagation();

        openInvite(event);
    }
);


envelope?.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Enter" ||
            event.key === " "
        ) {

            event.preventDefault();

            openInvite(event);
        }
    }
);


seal?.addEventListener(
    "click",
    event => {

        event.preventDefault();
        event.stopPropagation();

        openInvite(event);
    }
);


openButton?.addEventListener(
    "click",
    event => {

        event.preventDefault();
        event.stopPropagation();

        openInvite(event);
    }
);


closingEnvelope?.addEventListener(
    "click",
    event => {

        event.preventDefault();
        event.stopPropagation();

        resetInvitation();
    }
);


/* =========================================================
   MUSIC CONTROL
========================================================= */

musicButton?.addEventListener(
    "click",
    async event => {

        event.preventDefault();
        event.stopPropagation();

        if (!weddingMusic) {
            return;
        }

        if (
            weddingMusic.paused
        ) {
            await startWeddingMusic();
        } else {
            stopWeddingMusic(false);
        }
    }
);


/* =========================================================
   GENERAL TAP BLOOMS
========================================================= */

document.addEventListener(
    "pointerdown",
    event => {

        if (
            event.button !== undefined &&
            event.button !== 0
        ) {
            return;
        }

        if (
            event.target.closest(
                "#envelope, " +
                "#seal, " +
                "#openInvitation, " +
                "#closingEnvelope, " +
                "#musicButton, " +
                "#rsvpModal"
            )
        ) {
            return;
        }

        bloom(
            event.clientX,
            event.clientY,
            .82
        );

    },
    {
        passive: true
    }
);


/* =========================================================
   RSVP
========================================================= */

const RSVP_ENDPOINT =
    "https://script.google.com/macros/s/AKfycbw56BQ_vonpHRD1riNvM54oMQhw-dSWF_M9rm6IJEFd57qVJ0EliA_Bqbo593kiWENn/exec";


const rsvpModal =
    document.getElementById(
        "rsvpModal"
    );

const rsvpClose =
    document.getElementById(
        "rsvpClose"
    );

const rsvpForm =
    document.getElementById(
        "rsvpForm"
    );

const rsvpFormView =
    document.getElementById(
        "rsvpFormView"
    );

const rsvpSuccess =
    document.getElementById(
        "rsvpSuccess"
    );

const rsvpDone =
    document.getElementById(
        "rsvpDone"
    );

const rsvpError =
    document.getElementById(
        "rsvpError"
    );

const rsvpSubmit =
    document.getElementById(
        "rsvpSubmit"
    );

const attendingFields =
    document.getElementById(
        "attendingFields"
    );

const rsvpCount =
    document.getElementById(
        "rsvpCount"
    );

const rsvpMinus =
    document.getElementById(
        "rsvpMinus"
    );

const rsvpPlus =
    document.getElementById(
        "rsvpPlus"
    );

const rsvpSuccessMessage =
    document.getElementById(
        "rsvpSuccessMessage"
    );


let rsvpLastFocus = null;


/* =========================================================
   OPEN RSVP
========================================================= */

function openRsvp() {

    if (!rsvpModal) {
        return;
    }

    rsvpLastFocus =
        document.activeElement;

    rsvpModal.classList.add(
        "is-open"
    );

    rsvpModal.setAttribute(
        "aria-hidden",
        "false"
    );

    document.body.classList.add(
        "rsvp-open"
    );

    window.setTimeout(
        () =>
            rsvpClose?.focus(),
        80
    );
}


/* =========================================================
   CLOSE RSVP
========================================================= */

function closeRsvp() {

    if (!rsvpModal) {
        return;
    }

    rsvpModal.classList.remove(
        "is-open"
    );

    rsvpModal.setAttribute(
        "aria-hidden",
        "true"
    );

    document.body.classList.remove(
        "rsvp-open"
    );

    rsvpLastFocus?.focus?.();
}


/* =========================================================
   RESET RSVP
========================================================= */

function resetRsvpView() {

    if (
        !rsvpForm ||
        !rsvpFormView ||
        !rsvpSuccess
    ) {
        return;
    }

    rsvpForm.reset();

    if (rsvpCount) {
        rsvpCount.value = "1";
    }

    attendingFields
        ?.classList
        .remove(
            "is-hidden"
        );

    rsvpFormView.hidden = false;

    rsvpSuccess.hidden = true;

    if (rsvpError) {
        rsvpError.textContent = "";
    }

    if (rsvpSubmit) {

        rsvpSubmit.disabled = false;

        rsvpSubmit.innerHTML =
            'SEND MY RSVP <span>→</span>';
    }
}


/* =========================================================
   RSVP BUTTON
========================================================= */

rsvpButton?.addEventListener(
    "click",
    event => {

        event.preventDefault();
        event.stopPropagation();

        const rect =
            event.currentTarget
                .getBoundingClientRect();

        bloom(
            rect.left +
                rect.width / 2,
            rect.top +
                rect.height / 2,
            .9
        );

        openRsvp();
    }
);


/* =========================================================
   RSVP CLOSE CONTROLS
========================================================= */

rsvpClose?.addEventListener(
    "click",
    closeRsvp
);


rsvpDone?.addEventListener(
    "click",
    () => {

        closeRsvp();

        window.setTimeout(
            resetRsvpView,
            350
        );
    }
);


rsvpModal
    ?.querySelectorAll(
        "[data-rsvp-close]"
    )
    .forEach(
        node =>
            node.addEventListener(
                "click",
                closeRsvp
            )
    );


document.addEventListener(
    "keydown",
    event => {

        if (
            event.key ===
                "Escape" &&
            rsvpModal
                ?.classList
                .contains(
                    "is-open"
                )
        ) {
            closeRsvp();
        }
    }
);


/* =========================================================
   ACCEPT / DECLINE
========================================================= */

document
    .querySelectorAll(
        'input[name="attendance"]'
    )
    .forEach(
        input => {

            input.addEventListener(
                "change",
                () => {

                    const declining =
                        input.checked &&
                        input.value ===
                            "Regretfully Declines";


                    attendingFields
                        ?.classList
                        .toggle(
                            "is-hidden",
                            declining
                        );


                    if (
                        declining &&
                        rsvpCount
                    ) {
                        rsvpCount.value =
                            "0";
                    }


                    if (
                        !declining &&
                        rsvpCount &&
                        Number(
                            rsvpCount.value
                        ) < 1
                    ) {
                        rsvpCount.value =
                            "1";
                    }
                }
            );
        }
    );


/* =========================================================
   GUEST COUNTER
========================================================= */

rsvpMinus?.addEventListener(
    "click",
    () => {

        if (!rsvpCount) {
            return;
        }

        rsvpCount.value =
            String(
                Math.max(
                    1,
                    Number(
                        rsvpCount.value ||
                        1
                    ) - 1
                )
            );
    }
);


rsvpPlus?.addEventListener(
    "click",
    () => {

        if (!rsvpCount) {
            return;
        }

        rsvpCount.value =
            String(
                Math.min(
                    20,
                    Number(
                        rsvpCount.value ||
                        1
                    ) + 1
                )
            );
    }
);


/* =========================================================
   SUBMIT RSVP
========================================================= */

rsvpForm?.addEventListener(
    "submit",
    async event => {

        event.preventDefault();


        if (rsvpError) {
            rsvpError.textContent = "";
        }


        const formData =
            new FormData(
                rsvpForm
            );


        const attendance =
            String(
                formData.get(
                    "attendance"
                ) || ""
            );


        const guestName =
            String(
                formData.get(
                    "guestName"
                ) || ""
            ).trim();


        /* Attendance validation */

        if (!attendance) {

            if (rsvpError) {

                rsvpError.textContent =
                    "Please choose whether you will be attending.";
            }

            return;
        }


        /* Name validation */

        if (!guestName) {

            if (rsvpError) {

                rsvpError.textContent =
                    "Please enter your name.";
            }

            document
                .getElementById(
                    "rsvpGuestName"
                )
                ?.focus();

            return;
        }


        const accepts =
            attendance ===
            "Joyfully Accepts";


        const payload = {

            guestName:
                guestName,

            attendance:
                attendance,

            numberAttending:
                accepts
                    ? Number(
                        rsvpCount
                            ?.value ||
                        1
                    )
                    : 0,

            accompanyingGuests:
                accepts
                    ? String(
                        formData.get(
                            "accompanyingGuests"
                        ) || ""
                    ).trim()
                    : "",

            message:
                String(
                    formData.get(
                        "message"
                    ) || ""
                ).trim()
        };


        /* Sending state */

        if (rsvpSubmit) {

            rsvpSubmit.disabled =
                true;

            rsvpSubmit.textContent =
                "SENDING…";
        }


        try {

            /*
                no-cors allows the static
                GitHub Pages site to send
                the RSVP to Apps Script.
            */

            await fetch(
                RSVP_ENDPOINT,
                {
                    method:
                        "POST",

                    mode:
                        "no-cors",

                    headers: {
                        "Content-Type":
                            "text/plain;charset=utf-8"
                    },

                    body:
                        JSON.stringify(
                            payload
                        )
                }
            );


            /* Success message */

            if (
                rsvpSuccessMessage
            ) {

                rsvpSuccessMessage
                    .textContent =
                    accepts

                    ? `Thank you, ${guestName}. We can’t wait to celebrate with you.`

                    : `Thank you, ${guestName}. Your response has been received.`;
            }


            rsvpFormView.hidden =
                true;

            rsvpSuccess.hidden =
                false;


        } catch (error) {

            console.error(
                "RSVP submission failed:",
                error
            );


            if (rsvpError) {

                rsvpError.textContent =
                    "We couldn’t send your RSVP. Please check your connection and try again.";
            }


            if (rsvpSubmit) {

                rsvpSubmit.disabled =
                    false;

                rsvpSubmit.innerHTML =
                    'SEND MY RSVP <span>→</span>';
            }
        }
    }
);