import './style.css'
import { Network } from './network.js';

const canvas = document.getElementById('murmuration-canvas');
const ctx = canvas.getContext('2d');

let width, height;
let network;

// Mouse state
let mouseX = -1000;
let mouseY = -1000;

function resize() {
  width = window.innerWidth;
  height = window.innerHeight;
  const dpr = window.devicePixelRatio || 1;
  canvas.width = width * dpr;
  canvas.height = height * dpr;
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  ctx.scale(dpr, dpr);

  if (network) network.resize(width, height);
}

function init() {
  resize();
  // Initialize Network with 250 nodes (adjust for density)
  network = new Network(250);
  animate();
}

function animate() {
  ctx.clearRect(0, 0, width, height);

  // Track repulsion targets (navigation links)
  // Reuse this logic but maybe for network it means "excited area" or "void"
  // For now, let's treat them as "voids" where nodes are gently pushed away 
  // so text remains readable
  const repelTargets = [];
  document.querySelectorAll('.repel-target').forEach(el => {
    const rect = el.getBoundingClientRect();
    repelTargets.push({
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
      radius: Math.max(rect.width, rect.height) * 0.8
    });
  });

  // Activate nodes near cursor
  if (mouseX > 0 && mouseY > 0) {
    network.activateArea(mouseX, mouseY, 150);
  }

  network.update(width, height, repelTargets);
  network.draw(ctx);

  requestAnimationFrame(animate);
}

// Event Listeners
window.addEventListener('resize', resize);

window.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

// Touch support
window.addEventListener('touchmove', (e) => {
  if (e.touches.length > 0) {
    mouseX = e.touches[0].clientX;
    mouseY = e.touches[0].clientY;
  }
}, { passive: true });

init();
