/**
 * Chemotaxis Swarm
 *
 * Particles that sense and respond to a chemical gradient (cursor position).
 * Inspired by immune cells, bacteria, and microglia following signals.
 */

class Cell {
    constructor(x, y) {
        this.x = x;
        this.y = y;

        // Velocity
        this.vx = (Math.random() - 0.5) * 2;
        this.vy = (Math.random() - 0.5) * 2;

        // Each cell has slightly different sensing ability
        this.sensitivity = 0.3 + Math.random() * 0.4;
        this.speed = 1.5 + Math.random() * 1;
        this.size = 3 + Math.random() * 4;

        // For smooth turning (chemotaxis is gradual, not instant)
        this.targetAngle = Math.random() * Math.PI * 2;
        this.angle = this.targetAngle;

        // Tumble timer - cells occasionally "tumble" and reorient
        this.tumbleTimer = Math.random() * 100;

        // Visual state
        this.alpha = 0.4 + Math.random() * 0.3;
        this.hue = 200 + Math.random() * 40; // Blue-cyan range
    }

    sense(signalX, signalY) {
        const dx = signalX - this.x;
        const dy = signalY - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        // Gradient strength falls off with distance
        const gradientStrength = Math.max(0, 1 - dist / 800);

        // Angle toward signal
        const angleToSignal = Math.atan2(dy, dx);

        // Bias movement toward signal based on sensitivity and gradient
        if (gradientStrength > 0.05) {
            // Weighted blend toward signal direction
            const bias = gradientStrength * this.sensitivity;
            this.targetAngle = this.lerpAngle(this.targetAngle, angleToSignal, bias * 0.1);
        }

        return { dist, gradientStrength };
    }

    tumble() {
        // Random reorientation (like bacteria run-and-tumble)
        this.targetAngle += (Math.random() - 0.5) * Math.PI * 0.5;
    }

    avoidNeighbors(neighbors) {
        let avoidX = 0;
        let avoidY = 0;
        let count = 0;

        for (const other of neighbors) {
            const dx = this.x - other.x;
            const dy = this.y - other.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist > 0 && dist < 30) {
                // Repulsion force inversely proportional to distance
                const force = (30 - dist) / 30;
                avoidX += (dx / dist) * force;
                avoidY += (dy / dist) * force;
                count++;
            }
        }

        if (count > 0) {
            // Apply gentle avoidance
            this.vx += avoidX * 0.3;
            this.vy += avoidY * 0.3;
        }
    }

    update(width, height, signalX, signalY, neighbors) {
        // Sense the gradient
        const { gradientStrength } = this.sense(signalX, signalY);

        // Occasional tumbling (more frequent when gradient is weak)
        this.tumbleTimer--;
        if (this.tumbleTimer <= 0) {
            this.tumble();
            // Tumble more when not sensing strong gradient
            this.tumbleTimer = 50 + Math.random() * 100 * (1 + gradientStrength);
        }

        // Avoid crowding
        this.avoidNeighbors(neighbors);

        // Smooth angle interpolation
        this.angle = this.lerpAngle(this.angle, this.targetAngle, 0.05);

        // Apply velocity based on current angle
        const targetVx = Math.cos(this.angle) * this.speed;
        const targetVy = Math.sin(this.angle) * this.speed;

        this.vx += (targetVx - this.vx) * 0.1;
        this.vy += (targetVy - this.vy) * 0.1;

        // Speed boost when sensing strong gradient (excited movement)
        const speedMult = 1 + gradientStrength * 0.5;

        this.x += this.vx * speedMult;
        this.y += this.vy * speedMult;

        // Soft boundary wrapping
        const margin = 50;
        if (this.x < -margin) this.x = width + margin;
        if (this.x > width + margin) this.x = -margin;
        if (this.y < -margin) this.y = height + margin;
        if (this.y > height + margin) this.y = -margin;

        // Visual excitement based on gradient
        this.currentAlpha = this.alpha + gradientStrength * 0.3;
        this.currentSize = this.size + gradientStrength * 2;
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.currentSize, 0, Math.PI * 2);

        // Soft glow
        const gradient = ctx.createRadialGradient(
            this.x, this.y, 0,
            this.x, this.y, this.currentSize * 2
        );
        gradient.addColorStop(0, `hsla(${this.hue}, 70%, 70%, ${this.currentAlpha})`);
        gradient.addColorStop(0.5, `hsla(${this.hue}, 60%, 60%, ${this.currentAlpha * 0.5})`);
        gradient.addColorStop(1, `hsla(${this.hue}, 50%, 50%, 0)`);

        ctx.fillStyle = gradient;
        ctx.fill();

        // Core
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.currentSize * 0.6, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${this.hue}, 80%, 85%, ${this.currentAlpha})`;
        ctx.fill();
    }

    lerpAngle(from, to, t) {
        // Shortest path angle interpolation
        let diff = to - from;
        while (diff > Math.PI) diff -= Math.PI * 2;
        while (diff < -Math.PI) diff += Math.PI * 2;
        return from + diff * t;
    }
}

export class ChemotaxisSystem {
    constructor(count = 150) {
        this.cells = [];
        this.count = count;

        // Smoothed signal position
        this.signalX = window.innerWidth / 2;
        this.signalY = window.innerHeight / 2;
        this.targetSignalX = this.signalX;
        this.targetSignalY = this.signalY;

        this.init();
    }

    init() {
        this.cells = [];
        const width = window.innerWidth;
        const height = window.innerHeight;

        for (let i = 0; i < this.count; i++) {
            this.cells.push(new Cell(
                Math.random() * width,
                Math.random() * height
            ));
        }
    }

    resize(width, height) {
        // Keep cells within new bounds
        this.cells.forEach(cell => {
            if (cell.x > width) cell.x = Math.random() * width;
            if (cell.y > height) cell.y = Math.random() * height;
        });
    }

    update(targetX, targetY) {
        const width = window.innerWidth;
        const height = window.innerHeight;

        // Smooth signal tracking
        this.targetSignalX = targetX;
        this.targetSignalY = targetY;
        this.signalX += (this.targetSignalX - this.signalX) * 0.08;
        this.signalY += (this.targetSignalY - this.signalY) * 0.08;

        // Update each cell
        for (let i = 0; i < this.cells.length; i++) {
            const cell = this.cells[i];
            // Pass nearby cells for avoidance (simple: just pass all for now)
            cell.update(width, height, this.signalX, this.signalY, this.cells);
        }
    }

    draw(ctx) {
        // Draw subtle gradient at signal source
        const gradient = ctx.createRadialGradient(
            this.signalX, this.signalY, 0,
            this.signalX, this.signalY, 200
        );
        gradient.addColorStop(0, 'rgba(100, 180, 255, 0.03)');
        gradient.addColorStop(1, 'rgba(100, 180, 255, 0)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        // Draw all cells
        for (const cell of this.cells) {
            cell.draw(ctx);
        }
    }
}
