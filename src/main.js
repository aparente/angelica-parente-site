import './style.css'
import { DendriteSystem } from './dendrite/index.js';

const canvas = document.getElementById('murmuration-canvas');
const ctx = canvas.getContext('2d');

let width, height;
let system;

// Signal position (controlled by mouse/touch)
let signalX = -1000;
let signalY = -1000;

// Theme state
let isNightMode = false;
let themeTransition = 0; // 0 = day, 1 = night (for smooth transitions)

// Get current hour in Pacific Time
function getPacificHour() {
    const now = new Date();
    const pacificTime = new Date(now.toLocaleString('en-US', { timeZone: 'America/Los_Angeles' }));
    return pacificTime.getHours();
}

// Check if it's night time in Pacific Time (6 PM - 6 AM)
function isNightTime() {
    const hour = getPacificHour();
    return hour >= 18 || hour < 6;
}

// Update theme based on time
function updateTheme() {
    const shouldBeNight = isNightTime();
    if (shouldBeNight !== isNightMode) {
        isNightMode = shouldBeNight;
        document.documentElement.classList.toggle('night-theme', isNightMode);
    }
    // Smooth transition for canvas elements
    const targetTransition = isNightMode ? 1 : 0;
    themeTransition += (targetTransition - themeTransition) * 0.02;
}

// Get current theme node color
function getThemeNodeColor() {
    const root = getComputedStyle(document.documentElement);
    return root.getPropertyValue('--node-color').trim() || '#000000';
}

// Draw Liu Guosong-inspired red sun/moon for night mode
function drawRedSun(ctx, width, height) {
    if (themeTransition < 0.01) return;

    const alpha = themeTransition * 0.6;
    const centerX = width * 0.7;
    const centerY = height * 0.35;
    const radius = Math.min(width, height) * 0.15;

    // Outer glow - ethereal ink wash effect
    const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius * 3);
    gradient.addColorStop(0, `rgba(180, 50, 40, ${alpha * 0.4})`);
    gradient.addColorStop(0.3, `rgba(140, 35, 30, ${alpha * 0.2})`);
    gradient.addColorStop(0.6, `rgba(100, 25, 20, ${alpha * 0.08})`);
    gradient.addColorStop(1, 'rgba(100, 25, 20, 0)');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Main sun circle - vermillion red, slightly soft edge
    const sunGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
    sunGradient.addColorStop(0, `rgba(190, 55, 45, ${alpha})`);
    sunGradient.addColorStop(0.7, `rgba(170, 45, 35, ${alpha * 0.9})`);
    sunGradient.addColorStop(0.9, `rgba(150, 35, 30, ${alpha * 0.6})`);
    sunGradient.addColorStop(1, `rgba(130, 30, 25, 0)`);

    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.fillStyle = sunGradient;
    ctx.fill();

    // Subtle inner glow for depth
    const innerGlow = ctx.createRadialGradient(centerX - radius * 0.2, centerY - radius * 0.2, 0, centerX, centerY, radius * 0.6);
    innerGlow.addColorStop(0, `rgba(220, 80, 60, ${alpha * 0.3})`);
    innerGlow.addColorStop(1, 'rgba(220, 80, 60, 0)');

    ctx.beginPath();
    ctx.arc(centerX, centerY, radius * 0.6, 0, Math.PI * 2);
    ctx.fillStyle = innerGlow;
    ctx.fill();
}

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
  // Update theme based on Pacific Time
  updateTheme();

  ctx.clearRect(0, 0, width, height);

  // Draw red sun for night mode (behind network)
  drawRedSun(ctx, width, height);

  // Get current theme color and pass to system
  const nodeColor = getThemeNodeColor();
  system.update(signalX, signalY);
  system.draw(ctx, nodeColor);

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

