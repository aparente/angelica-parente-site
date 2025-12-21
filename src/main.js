import './style.css'
import { DendriteSystem } from './dendrite/index.js';

const canvas = document.getElementById('murmuration-canvas');
const ctx = canvas.getContext('2d');

let width, height;
let system;

// Signal position (controlled by mouse/touch)
let signalX = -1000;
let signalY = -1000;

function resize() {
  width = window.innerWidth;
  height = window.innerHeight;
  const dpr = window.devicePixelRatio || 1;
  canvas.width = width * dpr;
  canvas.height = height * dpr;
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;

  // Reset transform to identity before scaling
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.scale(dpr, dpr);

  if (system) system.resize(width, height);
}

function init() {
  resize();
  console.log('Main: Initializing DendriteSystem...');
  system = new DendriteSystem(600);

  // Set initial position to center if mouse hasn't moved
  if (signalX < 0) {
    signalX = width / 2;
    signalY = height / 2;
  }

  animate();
}

function animate() {
  ctx.clearRect(0, 0, width, height);

  system.update(signalX, signalY);
  system.draw(ctx);

  requestAnimationFrame(animate);
}

// Event Listeners
window.addEventListener('resize', resize);

window.addEventListener('mousemove', (e) => {
  signalX = e.clientX;
  signalY = e.clientY;
});

// Touch support
window.addEventListener('touchmove', (e) => {
  if (e.touches.length > 0) {
    signalX = e.touches[0].clientX;
    signalY = e.touches[0].clientY;
  }
}, { passive: true });

init();

