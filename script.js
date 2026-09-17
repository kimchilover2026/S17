const screens = [...document.querySelectorAll('.screen')];
let current = 1;
const viewedFlowers = new Set();
const flowerScreens = { rose: 6, lily: 7, carnation: 8, peony: 9 };
const finalMessageButton = document.getElementById('finalMessageButton');
let navigating = false;

function showScreen(n) {
  const target = document.getElementById(`screen${n}`);
  if (!target || navigating) return;

  navigating = true;
  screens.forEach(s => s.classList.remove('active'));
  target.classList.add('active');
  current = n;

  // Avoid smooth scrolling on mobile: it can leave the page between screens
  // and cause taps to land on an old hotspot.
  window.scrollTo(0, 0);
  requestAnimationFrame(() => { navigating = false; });
}

function updateFinalButton() {
  if (!finalMessageButton) return;
  finalMessageButton.hidden = viewedFlowers.size !== 4;
}

// Use pointerup rather than document-level click so mobile taps are handled
// once, consistently, without delayed/duplicated synthetic clicks.
document.addEventListener('pointerup', (event) => {
  const el = event.target.closest('button');
  if (!el || el.disabled) return;

  event.preventDefault();

  if (el.id === 'finalMessageButton') {
    if (viewedFlowers.size === 4) showScreen(10);
    return;
  }

  if (el.dataset.next) {
    showScreen(Number(el.dataset.next));
    return;
  }

  if (el.dataset.flower) {
    const flower = el.dataset.flower;
    viewedFlowers.add(flower);
    updateFinalButton();
    showScreen(flowerScreens[flower]);
    return;
  }

  if (el.dataset.back) {
    showScreen(Number(el.dataset.back));
    return;
  }

  if (el.dataset.home) {
    showScreen(1);
  }
}, { passive: false });

document.getElementById('restart').addEventListener('pointerup', (event) => {
  event.preventDefault();
  viewedFlowers.clear();
  updateFinalButton();
  showScreen(1);
}, { passive: false });

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && current >= 6 && current <= 9) showScreen(5);
  if (event.key === 'Home' && current !== 1) showScreen(1);
});

// Prevent accidental image dragging/long-press menus on phones.
document.addEventListener('dragstart', event => event.preventDefault());
document.addEventListener('contextmenu', event => {
  if (event.target.closest('img, .hotspot')) event.preventDefault();
});

updateFinalButton();
