'use strict';

const screens = {
  home: 'images/home.png',
  production: 'images/production.png',
  temperature_log: 'images/temperature_log.png',
  temp_1: 'images/temp_1.png',
  temp_2: 'images/temp_2.png',
  temp_3: 'images/temp_3.png',
  temp_4: 'images/temp_4.png',
  temp_5: 'images/temp_5.png',
  temp_6: 'images/temp_6.png',
  inventory: 'images/inventory.png',
  ordering: 'images/ordering.png',
  freshstart: 'images/freshstart.png',
  safety: 'images/safety.png',
  labor: 'images/labor.png',
  sales: 'images/sales.png',
  shrink: 'images/shrink.png',
  foodsafety: 'images/foodsafety.png',
  store_scorecard: 'images/store_scorecard.png',
  storeleader: 'images/storeleader.png',
  maximo: 'images/maximo.png',
  composite: 'images/composite.png',
  people: 'images/people.png',
  operations: 'images/operations.png',
  sandf: 'images/sandf.png',
  deli_notifications: 'images/deli-notifications.png',
  bakery_notifications: 'images/bakery-notifications.png',
  center: 'images/center.png',
  meat_notifications: 'images/meat-notifications.png',
  frontend: 'images/frontend.png'
};

const sequences = {
  temperature: ['temperature_log', 'temp_1', 'temp_2', 'temp_3', 'temp_4', 'temp_5', 'temp_6'],
  console: ['deli_notifications', 'bakery_notifications', 'center', 'meat_notifications', 'frontend'],
  composite: ['composite', 'people', 'operations', 'sandf']
};

const img = document.getElementById('screenImage');
const layer = document.getElementById('touchLayer');
const hint = document.getElementById('hint');
let current = 'home';
let activeSequence = null;
let sequenceIndex = -1;
let startX = 0;
let startY = 0;
let historyStack = [];

function preload() {
  Object.values(screens).forEach(src => { const i = new Image(); i.src = src; });
}

function toast(text) {
  hint.textContent = text;
  hint.classList.add('show');
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => hint.classList.remove('show'), 1400);
}

function setScreen(name, push = true) {
  if (!screens[name]) { toast(`Missing screen: ${name}`); return; }
  if (push && current !== name) historyStack.push(current);
  current = name;
  img.src = screens[name];
  img.alt = name.replaceAll('_', ' ');
  updateSequenceState();
  renderHotspots();
}

function goHome() {
  historyStack = [];
  activeSequence = null;
  sequenceIndex = -1;
  setScreen('home', false);
}

function goBack() {
  if (activeSequence && sequenceIndex > 0) {
    sequenceIndex -= 1;
    setScreen(sequences[activeSequence][sequenceIndex], false);
    return;
  }
  if (activeSequence && sequenceIndex === 0) { goHome(); return; }
  const last = historyStack.pop();
  if (last) setScreen(last, false); else goHome();
}

function startSequence(name) {
  activeSequence = name;
  sequenceIndex = 0;
  setScreen(sequences[name][0], true);
  toast('Swipe left or right');
}

function updateSequenceState() {
  const found = Object.entries(sequences).find(([, arr]) => arr.includes(current));
  if (found) {
    activeSequence = found[0];
    sequenceIndex = found[1].indexOf(current);
  } else {
    activeSequence = null;
    sequenceIndex = -1;
  }
}

function advanceSequence(direction) {
  if (!activeSequence) return;
  const arr = sequences[activeSequence];
  const next = sequenceIndex + direction;
  if (next >= 0 && next < arr.length) {
    sequenceIndex = next;
    setScreen(arr[sequenceIndex], false);
  } else if (direction > 0 && activeSequence !== 'composite') {
    goHome();
  }
}

function addButton(id, left, top, width, height, action) {
  const b = document.createElement('button');
  b.className = 'hotspot';
  b.id = id;
  b.style.left = left + '%';
  b.style.top = top + '%';
  b.style.width = width + '%';
  b.style.height = height + '%';
  b.setAttribute('aria-label', id);
  b.addEventListener('click', action);
  layer.appendChild(b);
}

function renderHotspots() {
  layer.innerHTML = '';

  if (current !== 'home') {
    addButton('back', 0, 0, 18, 10, goBack);
    addButton('home-zone', 35, 91, 30, 9, goHome);
  }

  if (current === 'home') {
    addButton('top-alerts', 78, 2, 10, 7, () => setScreen('storeleader'));
    addButton('profile-storeleader', 89, 2, 10, 7, () => setScreen('storeleader'));
    addButton('priority-production', 37, 18, 59, 5, () => setScreen('production'));
    addButton('priority-maximo', 37, 23, 59, 5, () => setScreen('maximo'));
    addButton('priority-temperature', 37, 29, 59, 6, () => startSequence('temperature'));
    addButton('console', 4, 36, 92, 6, () => startSequence('console'));
    addButton('scorecard', 2, 44, 31, 13, () => setScreen('store_scorecard'));
    addButton('alerts', 35, 44, 30, 13, () => setScreen('storeleader'));
    addButton('maximo-card', 67, 44, 31, 13, () => setScreen('maximo'));
    addButton('temperature-card', 2, 58, 31, 13, () => startSequence('temperature'));
    addButton('sales-card', 35, 58, 30, 13, () => setScreen('sales'));
    addButton('labor-card', 67, 58, 31, 13, () => setScreen('labor'));
    addButton('production', 3, 75, 18, 7, () => setScreen('production'));
    addButton('temperature', 22, 75, 18, 7, () => startSequence('temperature'));
    addButton('inventory', 41, 75, 18, 7, () => setScreen('inventory'));
    addButton('ordering', 60, 75, 18, 7, () => setScreen('ordering'));
    addButton('freshstart', 79, 75, 18, 7, () => setScreen('freshstart'));
    addButton('safety', 3, 84, 18, 7, () => setScreen('safety'));
    addButton('labor', 22, 84, 18, 7, () => setScreen('labor'));
    addButton('sales', 41, 84, 18, 7, () => setScreen('sales'));
    addButton('shrink', 60, 84, 18, 7, () => setScreen('shrink'));
    addButton('foodsafety', 79, 84, 18, 7, () => setScreen('foodsafety'));
    addButton('mic', 0, 92, 22, 8, () => toast('Voice assistant will be added after v1 navigation is stable.'));
    addButton('bottom-alerts', 23, 92, 22, 8, () => setScreen('storeleader'));
    addButton('composite', 44, 92, 26, 8, () => startSequence('composite'));
    addButton('maximo-bottom', 75, 92, 24, 8, () => setScreen('maximo'));
  }

  if (current === 'composite') {
    addButton('people', 4, 18, 43, 28, () => setScreen('people'));
    addButton('operations', 53, 18, 43, 28, () => setScreen('operations'));
    addButton('sandf', 4, 50, 43, 28, () => setScreen('sandf'));
  }
}

layer.addEventListener('touchstart', e => {
  const t = e.changedTouches[0];
  startX = t.clientX;
  startY = t.clientY;
}, { passive: true });

layer.addEventListener('touchend', e => {
  const t = e.changedTouches[0];
  const dx = t.clientX - startX;
  const dy = t.clientY - startY;
  if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.4) {
    advanceSequence(dx < 0 ? 1 : -1);
  }
}, { passive: true });

document.addEventListener('keydown', e => {
  if (e.key === 'ArrowLeft') advanceSequence(-1);
  if (e.key === 'ArrowRight') advanceSequence(1);
  if (e.key === 'Escape') goBack();
  if (e.key.toLowerCase() === 'h') goHome();
  if (e.key.toLowerCase() === 'd') document.body.classList.toggle('debug');
});

preload();
renderHotspots();
