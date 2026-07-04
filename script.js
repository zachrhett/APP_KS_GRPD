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
/* ==========================================
ADD TO END OF script.js
GLOBAL ROUTER
========================================== */

const ROUTES = {

home:[
"production",
"inventory",
"ordering",
"sales",
"labor",
"foodsafety",
"safety",
"freshstart",
"maximo",
"store_scorecard",
"replenishment",
"temperature_log",
"storeleader",
"shrink",
"composite"
],

storeleader:[
"frontend",
"center",
"bakery",
"deli",
"meat"
],

temperature_log:[
"temp1",
"temp2",
"temp3",
"temp4",
"temp5",
"temp6"
],

composite:[
"people",
"operations",
"sandf"
]

};

function nextScreen(){

const list=ROUTES[current];

if(!list) return;

go(list[0]);

}

function previousScreen(){

const screens=Object.keys(SCREENS);

const index=screens.indexOf(current);

if(index>0){

go(screens[index-1]);

}

}

/* ==========================================
KEYBOARD SUPPORT
========================================== */

document.addEventListener("keydown",e=>{

switch(e.key){

case"ArrowLeft":

if(SCREENS[current].left){

go(SCREENS[current].left);

}

break;

case"ArrowRight":

if(SCREENS[current].right){

go(SCREENS[current].right);

}

break;

case"Backspace":

goBack();

break;

case"Home":

historyStack=["home"];

go("home",false);

break;

}

});

/* ==========================================
SWIPE IMPROVEMENTS
========================================== */

let startX=0;

let endX=0;

document.addEventListener("touchstart",e=>{

startX=e.changedTouches[0].screenX;

},{passive:true});

document.addEventListener("touchend",e=>{

endX=e.changedTouches[0].screenX;

const delta=endX-startX;

if(Math.abs(delta)<60) return;

if(delta<0){

if(SCREENS[current].right){

go(SCREENS[current].right);

}

}else{

if(SCREENS[current].left){

go(SCREENS[current].left);

}else{

goBack();

}

}

},{passive:true});

/* ==========================================
AUTO BACK BUTTONS
========================================== */

document.querySelectorAll(".zone").forEach(z=>{

z.addEventListener("contextmenu",e=>{

e.preventDefault();

goBack();

});

});

/* ==========================================
SCREEN FADE
========================================== */

function fadeScreen(next){

img.classList.remove("fadeIn");

img.classList.add("fadeOut");

setTimeout(()=>{

img.src=SCREENS[next].image;

showZones(next);

img.classList.remove("fadeOut");

img.classList.add("fadeIn");

current=next;

},120);

}

/* ==========================================
OVERRIDE GO
========================================== */

const standardGo=go;

go=function(screen,push=true){

if(!SCREENS[screen]) return;

if(push){

historyStack.push(screen);

}

fadeScreen(screen);

updateNavigation();

};

/* ==========================================
START APPLICATION
========================================== */

historyStack=["home"];

go("home",false);
/* ==========================================
ADD TO END OF script.js
SCREEN-SPECIFIC CLICK ZONES
========================================== */

const SCREEN_ZONES = {

storeleader: [

{
left:4,
top:3,
width:12,
height:10,
target:"home"
},

{
left:8,
top:22,
width:84,
height:11,
target:"frontend"
},

{
left:8,
top:35,
width:84,
height:11,
target:"center"
},

{
left:8,
top:48,
width:84,
height:11,
target:"bakery"
},

{
left:8,
top:61,
width:84,
height:11,
target:"deli"
},

{
left:8,
top:74,
width:84,
height:11,
target:"meat"
}

],

frontend:[

{
left:4,
top:3,
width:12,
height:10,
target:"storeleader"
}

],

center:[

{
left:4,
top:3,
width:12,
height:10,
target:"storeleader"
}

],

bakery:[

{
left:4,
top:3,
width:12,
height:10,
target:"storeleader"
}

],

deli:[

{
left:4,
top:3,
width:12,
height:10,
target:"storeleader"
}

],

meat:[

{
left:4,
top:3,
width:12,
height:10,
target:"storeleader"
}

],

production:[

{
left:4,
top:3,
width:12,
height:10,
target:"home"
}

],

inventory:[

{
left:4,
top:3,
width:12,
height:10,
target:"home"
}

],

ordering:[

{
left:4,
top:3,
width:12,
height:10,
target:"home"
}

],

sales:[

{
left:4,
top:3,
width:12,
height:10,
target:"home"
}

],

labor:[

{
left:4,
top:3,
width:12,
height:10,
target:"home"
}

],

foodsafety:[

{
left:4,
top:3,
width:12,
height:10,
target:"home"
}

],

freshstart:[

{
left:4,
top:3,
width:12,
height:10,
target:"home"
}

],

safety:[

{
left:4,
top:3,
width:12,
height:10,
target:"home"
}

],

maximo:[

{
left:4,
top:3,
width:12,
height:10,
target:"home"
}

],

store_scorecard:[

{
left:4,
top:3,
width:12,
height:10,
target:"home"
}

],

replenishment:[

{
left:4,
top:3,
width:12,
height:10,
target:"home"
}

],

shrink:[

{
left:4,
top:3,
width:12,
height:10,
target:"home"
}

]

};

const dynamicLayer=document.createElement("div");

dynamicLayer.id="dynamicLayer";

dynamicLayer.style.position="absolute";
dynamicLayer.style.inset="0";
dynamicLayer.style.zIndex="500";

document.getElementById("viewer").appendChild(dynamicLayer);

function buildDynamicZones(screen){

dynamicLayer.innerHTML="";

const zones=SCREEN_ZONES[screen];

if(!zones) return;

zones.forEach(zone=>{

const button=document.createElement("button");

button.className="zone";

button.style.left=zone.left+"%";
button.style.top=zone.top+"%";
button.style.width=zone.width+"%";
button.style.height=zone.height+"%";

button.onclick=()=>go(zone.target);

dynamicLayer.appendChild(button);

});

}

const oldShowZones=showZones;

showZones=function(screen){

oldShowZones(screen);

buildDynamicZones(screen);

};

buildDynamicZones("home");
/* ==========================================
ADD TO END OF script.js
UNIVERSAL IMAGE MAP
========================================== */

const IMAGE_MAP = {

home:"images/home.png",
composite:"images/composite.png",
people:"images/people.png",
operations:"images/operations.png",
sandf:"images/sandf.png",

temperature_log:"images/temperature_log.png",
temp1:"images/temp_1.PNG",
temp2:"images/temp_2.png",
temp3:"images/temp_3.png",
temp4:"images/temp_4.png",
temp5:"images/temp_5.png",
temp6:"images/temp_6.png",

storeleader:"images/storeleader.png",
frontend:"images/frontend.png",
center:"images/center.png",
bakery:"images/bakery-notifications.png",
deli:"images/deli-notifications.png",
meat:"images/meat-notifications.png",

production:"images/production.png",
inventory:"images/inventory.png",
ordering:"images/ordering.png",
sales:"images/sales.png",
labor:"images/labor.png",
foodsafety:"images/foodsafety.png",
freshstart:"images/freshstart.png",
replenishment:"images/replenishment.png",
maximo:"images/maximo.png",
store_scorecard:"images/store_scorecard.png",
shrink:"images/shrink.png",
safety:"images/safety.png"

};

/* ==========================================
IMAGE LOADER
========================================== */

function loadScreen(name){

if(!IMAGE_MAP[name]) return;

current=name;

img.src=IMAGE_MAP[name];

showZones(name);

updateNavigation();

}

/* ==========================================
PRELOAD
========================================== */

Object.values(IMAGE_MAP).forEach(path=>{

const preload=new Image();

preload.src=path;

});

/* ==========================================
HOME RESET
========================================== */

function home(){

historyStack=["home"];

loadScreen("home");

}

document.addEventListener("keyup",e=>{

if(e.key==="Home"){

home();

}

});

/* ==========================================
BACKSTACK
========================================== */

function push(screen){

historyStack.push(screen);

loadScreen(screen);

}

function replace(screen){

historyStack=[screen];

loadScreen(screen);

}

/* ==========================================
OVERRIDE GO
========================================== */

go=function(screen,pushHistory=true){

if(!SCREENS[screen]) return;

if(pushHistory){

historyStack.push(screen);

}

loadScreen(screen);

};

/* ==========================================
ROUTE TABLE
========================================== */

const ROUTER={

home:{
temperature:"temperature_log",
console:"composite",
alerts:"storeleader",
production:"production",
inventory:"inventory",
ordering:"ordering",
sales:"sales",
labor:"labor",
foodsafety:"foodsafety",
safety:"safety",
freshstart:"freshstart",
scorecard:"store_scorecard",
replenishment:"replenishment",
maximo:"maximo",
shrink:"shrink"
}

};

/* ==========================================
INITIALIZE
========================================== */

replace("home");
