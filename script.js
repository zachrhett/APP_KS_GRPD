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
/* ==========================================
ADD THIS TO THE END OF script.js
PRODUCTION EXTENSIONS
========================================== */

/* ---------- IMAGE LOAD ---------- */

img.addEventListener("load", () => {
    window.scrollTo(0, 0);
});

/* ---------- BROWSER HISTORY ---------- */

window.history.replaceState({ screen: "home" }, "");

const originalGo = go;

go = function (screenName, pushHistory = true) {

    if (!SCREENS[screenName]) return;

    current = screenName;

    img.src = SCREENS[screenName].image;

    showZones(screenName);

    if (pushHistory) {
        historyStack.push(screenName);
        history.pushState(
            { screen: screenName },
            "",
            "#" + screenName
        );
    }

};

/* ---------- POPSTATE ---------- */

window.onpopstate = function () {

    if (historyStack.length > 1) {

        historyStack.pop();

        const previous = historyStack[historyStack.length - 1];

        current = previous;

        img.src = SCREENS[previous].image;

        showZones(previous);

    } else {

        current = "home";

        img.src = SCREENS.home.image;

        showZones("home");

    }

};

/* ---------- PRELOAD ---------- */

function preloadImages() {

    Object.keys(SCREENS).forEach(key => {

        const image = new Image();

        image.src = SCREENS[key].image;

    });

}

preloadImages();

/* ---------- SWIPE LOCK ---------- */

let swipeLocked = false;

document.addEventListener("touchstart", () => {

    swipeLocked = false;

}, { passive: true });

document.addEventListener("touchmove", () => {

    swipeLocked = true;

}, { passive: true });

/* ---------- HOME SHORTCUT ---------- */

document.addEventListener("keydown", e => {

    if (e.key.toLowerCase() === "h") {

        historyStack = ["home"];

        go("home", false);

    }

});

/* ---------- IMAGE ERROR ---------- */

img.onerror = function () {

    console.error("Missing image:", img.src);

};

/* ---------- INITIALIZE ---------- */

historyStack = ["home"];

go("home", false);
/* ==========================================
ADD TO END OF script.js
VOICE + BACK + HOME + DEPARTMENT LINKS
========================================== */

const navBack = document.createElement("button");
navBack.id = "navBack";

const navHome = document.createElement("button");
navHome.id = "navHome";

const voiceButton = document.createElement("button");
voiceButton.id = "voiceButton";

const voiceRing = document.createElement("div");
voiceRing.id = "voiceRing";

voiceButton.appendChild(voiceRing);

document.getElementById("app").appendChild(navBack);
document.getElementById("app").appendChild(navHome);
document.getElementById("app").appendChild(voiceButton);

function updateNavigation() {

    if(current==="home"){

        navBack.style.display="none";
        navHome.style.display="none";

    }else{

        navBack.style.display="block";
        navHome.style.display="block";

    }

}

const previousGo=go;

go=function(screen,push=true){

    previousGo(screen,push);

    updateNavigation();

};

navBack.onclick=function(){

    const back=SCREENS[current].back;

    if(back){

        go(back);

    }else{

        goBack();

    }

};

navHome.onclick=function(){

    historyStack=["home"];

    go("home",false);

};

voiceButton.onclick=function(){

    if(!("webkitSpeechRecognition" in window)){

        alert("Voice recognition not supported.");

        return;

    }

    voiceButton.classList.add("voice-active");

    const recognition=new webkitSpeechRecognition();

    recognition.lang="en-US";

    recognition.interimResults=false;

    recognition.maxAlternatives=1;

    recognition.start();

    recognition.onresult=function(event){

        const text=event.results[0][0].transcript.toLowerCase();

        voiceButton.classList.remove("voice-active");

        if(text.includes("temperature")) go("temperature_log");
        else if(text.includes("food")) go("foodsafety");
        else if(text.includes("production")) go("production");
        else if(text.includes("inventory")) go("inventory");
        else if(text.includes("ordering")) go("ordering");
        else if(text.includes("sales")) go("sales");
        else if(text.includes("labor")) go("labor");
        else if(text.includes("safety")) go("safety");
        else if(text.includes("fresh")) go("freshstart");
        else if(text.includes("shrink")) go("shrink");
        else if(text.includes("maximo")) go("maximo");
        else if(text.includes("score")) go("store_scorecard");
        else if(text.includes("replenishment")) go("replenishment");
        else if(text.includes("store leader")) go("storeleader");
        else if(text.includes("front end")) go("frontend");
        else if(text.includes("center")) go("center");
        else if(text.includes("bakery")) go("bakery");
        else if(text.includes("deli")) go("deli");
        else if(text.includes("meat")) go("meat");
        else if(text.includes("friend")) go("home");

    };

    recognition.onerror=function(){

        voiceButton.classList.remove("voice-active");

    };

    recognition.onend=function(){

        voiceButton.classList.remove("voice-active");

    };

};

SCREENS.storeleader.right="frontend";

SCREENS.frontend.right="center";
SCREENS.center.right="bakery";
SCREENS.bakery.right="deli";
SCREENS.deli.right="meat";

SCREENS.meat.left="deli";
SCREENS.deli.left="bakery";
SCREENS.bakery.left="center";
SCREENS.center.left="frontend";
SCREENS.frontend.left="storeleader";

updateNavigation();
/* ==========================================
ADD TO END OF script.js
TEMPERATURE WORKFLOW
========================================== */

SCREENS.temperature_log.right = "temp1";

SCREENS.temp1 = {
    ...SCREENS.temp1,
    right: "temp2",
    left: "temperature_log",
    back: "temperature_log"
};

SCREENS.temp2 = {
    ...SCREENS.temp2,
    right: "temp3",
    left: "temp1",
    back: "temp1"
};

SCREENS.temp3 = {
    ...SCREENS.temp3,
    right: "temp4",
    left: "temp2",
    back: "temp2"
};

SCREENS.temp4 = {
    ...SCREENS.temp4,
    right: "temp5",
    left: "temp3",
    back: "temp3"
};

SCREENS.temp5 = {
    ...SCREENS.temp5,
    right: "temp6",
    left: "temp4",
    back: "temp4"
};

SCREENS.temp6 = {
    ...SCREENS.temp6,
    right: "home",
    left: "temp5",
    back: "home"
};

/* ==========================================
COMPOSITE WORKFLOW
========================================== */

SCREENS.composite.right = "people";

SCREENS.people.left = "composite";
SCREENS.people.right = "operations";

SCREENS.operations.left = "people";
SCREENS.operations.right = "sandf";

SCREENS.sandf.left = "operations";
SCREENS.sandf.right = "home";

/* ==========================================
HOME BUTTON MAP
========================================== */

const HOME_BUTTONS = {

    zoneConsole: "composite",

    zoneTemperature: "temperature_log",

    zoneShrink: "shrink",

    zoneAlerts: "storeleader",

    zoneProduction: "production",

    zoneInventory: "inventory",

    zoneOrdering: "ordering",

    zoneSales: "sales",

    zoneLabor: "labor",

    zoneSafety: "safety",

    zoneFoodSafety: "foodsafety",

    zoneFreshStart: "freshstart",

    zoneScorecard: "store_scorecard",

    zoneMaximo: "maximo",

    zoneReplenishment: "replenishment"

};

Object.keys(HOME_BUTTONS).forEach(id => {

    const button = document.getElementById(id);

    if (!button) return;

    button.onclick = () => {

        go(HOME_BUTTONS[id]);

    };

});

/* ==========================================
DOUBLE TAP HOME
========================================== */

let lastTap = 0;

document.addEventListener("touchend", e => {

    const now = Date.now();

    if (now - lastTap < 300) {

        historyStack = ["home"];

        go("home", false);

    }

    lastTap = now;

}, { passive: true });

/* ==========================================
IMAGE CACHE
========================================== */

const cache = {};

Object.keys(SCREENS).forEach(name => {

    cache[name] = new Image();

    cache[name].src = SCREENS[name].image;

});

/* ==========================================
FAST NAVIGATION
========================================== */

function quickGo(name) {

    if (!SCREENS[name]) return;

    current = name;

    img.src = cache[name].src;

    showZones(name);

}

/* ==========================================
STARTUP
========================================== */

historyStack = ["home"];

quickGo("home");

updateNavigation();
