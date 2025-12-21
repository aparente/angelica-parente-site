/**
 * Conway's Game of Life
 *
 * Classic cellular automaton - cells live or die based on neighbors.
 * Rules:
 * - Live cell with 2-3 neighbors survives
 * - Dead cell with exactly 3 neighbors becomes alive
 * - All other cells die or stay dead
 */

const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');

// Game state
let cellSize = 10;
let cols, rows;
let grid, nextGrid;
let isPlaying = false;
let isDrawing = false;
let lastDrawnCell = null;
let generation = 0;

// UI elements
const playPauseBtn = document.getElementById('play-pause');
const stepBtn = document.getElementById('step');
const clearBtn = document.getElementById('clear');
const randomBtn = document.getElementById('random');
const generationDisplay = document.getElementById('generation');

function updateGenerationDisplay() {
    generationDisplay.textContent = `Gen: ${generation}`;
}

function init() {
    resize();
    clear();
    draw();
    updateGenerationDisplay();
}

function resize() {
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);

    cols = Math.floor(rect.width / cellSize);
    rows = Math.floor(rect.height / cellSize);

    // Preserve existing cells if possible
    const oldGrid = grid;
    grid = createGrid();
    nextGrid = createGrid();

    if (oldGrid) {
        for (let y = 0; y < Math.min(rows, oldGrid.length); y++) {
            for (let x = 0; x < Math.min(cols, oldGrid[0].length); x++) {
                grid[y][x] = oldGrid[y][x];
            }
        }
    }
}

function createGrid() {
    return Array(rows).fill(null).map(() => Array(cols).fill(0));
}

function clear() {
    grid = createGrid();
    nextGrid = createGrid();
    generation = 0;
}

function randomize() {
    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
            grid[y][x] = Math.random() < 0.3 ? 1 : 0;
        }
    }
    generation = 0;
}

function countNeighbors(x, y) {
    let count = 0;
    for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
            if (dx === 0 && dy === 0) continue;

            // Wrap around edges (toroidal)
            const nx = (x + dx + cols) % cols;
            const ny = (y + dy + rows) % rows;
            count += grid[ny][nx];
        }
    }
    return count;
}

function step() {
    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
            const neighbors = countNeighbors(x, y);
            const alive = grid[y][x];

            if (alive) {
                // Live cell survives with 2-3 neighbors
                nextGrid[y][x] = (neighbors === 2 || neighbors === 3) ? 1 : 0;
            } else {
                // Dead cell becomes alive with exactly 3 neighbors
                nextGrid[y][x] = (neighbors === 3) ? 1 : 0;
            }
        }
    }

    // Swap grids
    [grid, nextGrid] = [nextGrid, grid];
    generation++;
    updateGenerationDisplay();
}

function draw() {
    const rect = canvas.getBoundingClientRect();
    ctx.fillStyle = '#f8f9fa';
    ctx.fillRect(0, 0, rect.width, rect.height);

    // Draw grid lines (very subtle)
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.05)';
    ctx.lineWidth = 0.5;

    for (let x = 0; x <= cols; x++) {
        ctx.beginPath();
        ctx.moveTo(x * cellSize, 0);
        ctx.lineTo(x * cellSize, rows * cellSize);
        ctx.stroke();
    }

    for (let y = 0; y <= rows; y++) {
        ctx.beginPath();
        ctx.moveTo(0, y * cellSize);
        ctx.lineTo(cols * cellSize, y * cellSize);
        ctx.stroke();
    }

    // Draw cells
    ctx.fillStyle = '#000';
    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
            if (grid[y][x]) {
                ctx.fillRect(
                    x * cellSize + 1,
                    y * cellSize + 1,
                    cellSize - 2,
                    cellSize - 2
                );
            }
        }
    }
}

function toggleCell(clientX, clientY) {
    const rect = canvas.getBoundingClientRect();
    const x = Math.floor((clientX - rect.left) / cellSize);
    const y = Math.floor((clientY - rect.top) / cellSize);

    if (x >= 0 && x < cols && y >= 0 && y < rows) {
        const cellKey = `${x},${y}`;
        if (cellKey !== lastDrawnCell) {
            grid[y][x] = grid[y][x] ? 0 : 1;
            lastDrawnCell = cellKey;
            draw();
        }
    }
}

function setCell(clientX, clientY, value) {
    const rect = canvas.getBoundingClientRect();
    const x = Math.floor((clientX - rect.left) / cellSize);
    const y = Math.floor((clientY - rect.top) / cellSize);

    if (x >= 0 && x < cols && y >= 0 && y < rows) {
        const cellKey = `${x},${y}`;
        if (cellKey !== lastDrawnCell) {
            grid[y][x] = value;
            lastDrawnCell = cellKey;
            draw();
        }
    }
}

// Game loop
let lastTime = 0;
const frameInterval = 100; // ms between steps when playing

function gameLoop(timestamp) {
    if (isPlaying && timestamp - lastTime > frameInterval) {
        step();
        draw();
        lastTime = timestamp;
    }
    requestAnimationFrame(gameLoop);
}

// Event listeners
canvas.addEventListener('mousedown', (e) => {
    isDrawing = true;
    lastDrawnCell = null;
    toggleCell(e.clientX, e.clientY);
});

canvas.addEventListener('mousemove', (e) => {
    if (isDrawing) {
        setCell(e.clientX, e.clientY, 1);
    }
});

canvas.addEventListener('mouseup', () => {
    isDrawing = false;
    lastDrawnCell = null;
});

canvas.addEventListener('mouseleave', () => {
    isDrawing = false;
    lastDrawnCell = null;
});

// Touch support
canvas.addEventListener('touchstart', (e) => {
    e.preventDefault();
    isDrawing = true;
    lastDrawnCell = null;
    const touch = e.touches[0];
    toggleCell(touch.clientX, touch.clientY);
}, { passive: false });

canvas.addEventListener('touchmove', (e) => {
    e.preventDefault();
    if (isDrawing) {
        const touch = e.touches[0];
        setCell(touch.clientX, touch.clientY, 1);
    }
}, { passive: false });

canvas.addEventListener('touchend', () => {
    isDrawing = false;
    lastDrawnCell = null;
});

playPauseBtn.addEventListener('click', () => {
    isPlaying = !isPlaying;
    playPauseBtn.textContent = isPlaying ? 'Pause' : 'Play';
});

stepBtn.addEventListener('click', () => {
    step();
    draw();
});

clearBtn.addEventListener('click', () => {
    clear();
    draw();
    updateGenerationDisplay();
});

randomBtn.addEventListener('click', () => {
    randomize();
    draw();
    updateGenerationDisplay();
});

window.addEventListener('resize', () => {
    resize();
    draw();
});

// Start
init();
requestAnimationFrame(gameLoop);
