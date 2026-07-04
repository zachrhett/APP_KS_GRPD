/* ==========================================
FRIEND APP
script.js
Production Build
========================================== */

const img = document.getElementById("screenImage");
const touchLayer = document.getElementById("touchLayer");

let current = "home";
let historyStack = ["home"];

const preload = [];

Object.values(SCREENS).forEach(screen => {
    const i = new Image();
    i.src = screen.image;
    preload.push(i);
});

function hideAllZones() {
    document.querySelectorAll(".zone").forEach(zone => {
        zone.style.display = "none";
    });
}

function showZones(screenName) {

    hideAllZones();

    if (!SCREENS[screenName].zones) return;

    SCREENS[screenName].zones.forEach(z => {

        const el = document.getElementById(z.id);

        if (el) {

            el.style.display = "block";

        }

    });

}

function go(screenName, pushHistory = true) {

    if (!SCREENS[screenName]) return;

    current = screenName;

    img.src = SCREENS[screenName].image;

    showZones(screenName);

    if (pushHistory) {

        historyStack.push(screenName);

    }

}

document.querySelectorAll(".zone").forEach(zone => {

    zone.addEventListener("click", function () {

        const target = this.dataset.target;

        if (!target) return;

        go(target);

    });

});

function goBack() {

    if (historyStack.length <= 1) {

        go("home", false);

        historyStack = ["home"];

        return;

    }

    historyStack.pop();

    go(historyStack[historyStack.length - 1], false);

}

window.addEventListener("popstate", function () {

    goBack();

});

document.addEventListener("keydown", function (e) {

    if (e.key === "Escape") {

        goBack();

    }

});

let touchStartX = 0;
let touchStartY = 0;

document.addEventListener("touchstart", function (e) {

    touchStartX = e.changedTouches[0].clientX;
    touchStartY = e.changedTouches[0].clientY;

}, { passive: true });

document.addEventListener("touchend", function (e) {

    const dx = e.changedTouches[0].clientX - touchStartX;
    const dy = e.changedTouches[0].clientY - touchStartY;

    if (Math.abs(dx) < 50) return;

    if (Math.abs(dx) < Math.abs(dy)) return;

    if (dx < 0) {

        const right = SCREENS[current].right;

        if (right) {

            go(right);

        }

    } else {

        const left = SCREENS[current].left;

        if (left) {

            go(left);

        } else {

            const back = SCREENS[current].back;

            if (back) {

                go(back);

            }

        }

    }

}, { passive: true });

document.addEventListener("dblclick", function () {

    go("home");

});

document.addEventListener("contextmenu", function (e) {

    e.preventDefault();

});

window.addEventListener("resize", function () {

    if (window.innerWidth > window.innerHeight) {

        document.body.classList.remove("portrait");
        document.body.classList.add("landscape");

    } else {

        document.body.classList.remove("landscape");
        document.body.classList.add("portrait");

    }

});

window.dispatchEvent(new Event("resize"));

go("home", false);
