/**
 * Neural Network
 *
 * Simple black dots that form network connections when close.
 * A living, shifting graph - like neurons forming synapses.
 * Black and white, minimal, like a murmuration but networked.
 */

class Node {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.vx = (Math.random() - 0.5) * 2;
        this.vy = (Math.random() - 0.5) * 2;
        this.ax = 0;
        this.ay = 0;
        this.baseSize = Math.random() * 1.5 + 1;
        this.size = this.baseSize;
        this.maxSpeed = 1.5;
        this.maxForce = 0.03;

        // Breathing - each node has its own phase
        this.breathePhase = Math.random() * Math.PI * 2;
        this.breatheSpeed = 0.02 + Math.random() * 0.01; // Slightly varied speeds
    }

    applyForce(fx, fy) {
        this.ax += fx;
        this.ay += fy;
    }

    update(width, height) {
        // Update velocity
        this.vx += this.ax;
        this.vy += this.ay;

        // Limit speed
        const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
        if (speed > this.maxSpeed) {
            this.vx = (this.vx / speed) * this.maxSpeed;
            this.vy = (this.vy / speed) * this.maxSpeed;
        }

        // Update position
        this.x += this.vx;
        this.y += this.vy;

        // Reset acceleration
        this.ax = 0;
        this.ay = 0;

        // Breathing - subtle size oscillation
        this.breathePhase += this.breatheSpeed;
        this.size = this.baseSize * (1 + Math.sin(this.breathePhase) * 0.15);

        // Wrap edges
        if (this.x > width) this.x = 0;
        else if (this.x < 0) this.x = width;
        if (this.y > height) this.y = 0;
        else if (this.y < 0) this.y = height;
    }

    draw(ctx, color = '#000000') {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
    }
}

export class DendriteSystem {
    constructor(count = 800) {
        this.nodes = [];
        this.count = count;
        this.connectionRadius = 60;
        this.width = window.innerWidth;
        this.height = window.innerHeight;

        // Mouse target
        this.targetX = this.width / 2;
        this.targetY = this.height / 2;

        this.init();
    }

    init() {
        this.nodes = [];
        for (let i = 0; i < this.count; i++) {
            this.nodes.push(new Node(
                Math.random() * this.width,
                Math.random() * this.height
            ));
        }
    }

    resize(width, height) {
        this.width = width;
        this.height = height;
        // Keep nodes in bounds
        for (const node of this.nodes) {
            if (node.x > width) node.x = Math.random() * width;
            if (node.y > height) node.y = Math.random() * height;
        }
    }

    update(targetX, targetY) {
        this.targetX = targetX;
        this.targetY = targetY;

        for (const node of this.nodes) {
            // Flocking forces
            let alignX = 0, alignY = 0;
            let cohereX = 0, cohereY = 0;
            let separateX = 0, separateY = 0;
            let neighbors = 0;

            for (const other of this.nodes) {
                if (other === node) continue;

                const dx = other.x - node.x;
                const dy = other.y - node.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < this.connectionRadius && dist > 0) {
                    // Alignment - match velocity
                    alignX += other.vx;
                    alignY += other.vy;

                    // Cohesion - move toward center
                    cohereX += other.x;
                    cohereY += other.y;

                    // Separation - avoid crowding
                    separateX -= dx / dist;
                    separateY -= dy / dist;

                    neighbors++;
                }
            }

            if (neighbors > 0) {
                // Average and apply alignment
                alignX /= neighbors;
                alignY /= neighbors;
                const alignForce = this.steer(node, alignX, alignY);
                node.applyForce(alignForce.x * 1.0, alignForce.y * 1.0);

                // Average and apply cohesion
                cohereX = cohereX / neighbors - node.x;
                cohereY = cohereY / neighbors - node.y;
                const cohereForce = this.steer(node, cohereX, cohereY);
                node.applyForce(cohereForce.x * 0.8, cohereForce.y * 0.8);

                // Apply separation
                const sepForce = this.steer(node, separateX, separateY);
                node.applyForce(sepForce.x * 1.2, sepForce.y * 1.2);
            }

            // Mouse attraction
            const mx = this.targetX - node.x;
            const my = this.targetY - node.y;
            const mouseForce = this.steer(node, mx, my);
            node.applyForce(mouseForce.x * 0.3, mouseForce.y * 0.3);

            node.update(this.width, this.height);
        }
    }

    steer(node, tx, ty) {
        const mag = Math.sqrt(tx * tx + ty * ty);
        if (mag === 0) return { x: 0, y: 0 };

        // Desired velocity
        const desiredX = (tx / mag) * node.maxSpeed;
        const desiredY = (ty / mag) * node.maxSpeed;

        // Steering = desired - current
        let steerX = desiredX - node.vx;
        let steerY = desiredY - node.vy;

        // Limit force
        const steerMag = Math.sqrt(steerX * steerX + steerY * steerY);
        if (steerMag > node.maxForce) {
            steerX = (steerX / steerMag) * node.maxForce;
            steerY = (steerY / steerMag) * node.maxForce;
        }

        return { x: steerX, y: steerY };
    }

    draw(ctx, color = '#000000') {
        // Draw connections first (behind nodes)
        // The lines are the soul of the network - they show relationship, proximity, intelligence
        ctx.strokeStyle = color;
        ctx.lineWidth = 1;

        for (let i = 0; i < this.nodes.length; i++) {
            const node = this.nodes[i];

            for (let j = i + 1; j < this.nodes.length; j++) {
                const other = this.nodes[j];
                const dx = other.x - node.x;
                const dy = other.y - node.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < this.connectionRadius) {
                    // Fade connection based on distance - closer nodes have stronger bonds
                    const alpha = 1 - dist / this.connectionRadius;
                    ctx.globalAlpha = alpha * 0.5;

                    ctx.beginPath();
                    ctx.moveTo(node.x, node.y);
                    ctx.lineTo(other.x, other.y);
                    ctx.stroke();
                }
            }
        }

        ctx.globalAlpha = 1;

        // Draw nodes
        for (const node of this.nodes) {
            node.draw(ctx, color);
        }
    }
}
