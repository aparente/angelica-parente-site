import { Node } from './node.js';
import { SpatialGrid } from './spatial-grid.js';

export class Network {
    constructor(nodeCount = 200) {
        this.nodes = [];
        this.count = nodeCount;
        this.grid = new SpatialGrid(window.innerWidth, window.innerHeight, 50);

        this.init();
    }

    init() {
        this.nodes = [];
        for (let i = 0; i < this.count; i++) {
            this.nodes.push(new Node(
                Math.random() * window.innerWidth,
                Math.random() * window.innerHeight
            ));
        }
    }

    resize(width, height) {
        this.grid = new SpatialGrid(width, height, 50);
        // Ensure nodes stick within new bounds
        this.nodes.forEach(node => {
            if (node.position.x > width) node.position.x = Math.random() * width;
            if (node.position.y > height) node.position.y = Math.random() * height;
        });
    }

    update(width, height, repulsionTargets = []) {
        this.grid.clear();

        // Update nodes and add to grid
        this.nodes.forEach(node => {
            node.update(width, height);

            // Basic repulsion from targets (like text)
            repulsionTargets.forEach(target => {
                const dx = node.position.x - target.x;
                const dy = node.position.y - target.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < target.radius) {
                    const force = (target.radius - dist) / target.radius;
                    node.velocity.x += (dx / dist) * force * 0.5;
                    node.velocity.y += (dy / dist) * force * 0.5;
                }
            });

            this.grid.add(node);
        });
    }

    activateArea(x, y, radius = 100) {
        const potentialNeighbors = this.grid.getNeighbors({ position: { x, y } }, radius);
        potentialNeighbors.forEach(node => {
            const dx = node.position.x - x;
            const dy = node.position.y - y;
            const distSq = dx * dx + dy * dy;
            if (distSq < radius * radius) {
                // Closer to cursor = more activation
                const boost = 1 - (Math.sqrt(distSq) / radius);
                node.activate(boost * 0.1);
            }
        });
    }

    draw(ctx) {
        // Draw connections first (behind nodes)
        ctx.strokeStyle = '#4a9eff';
        ctx.lineWidth = 1;

        this.nodes.forEach(node => {
            // Find neighbors for connections
            // We use a smaller radius for drawing connections than for searching
            const connectionRadius = 80;
            const neighbors = this.grid.getNeighbors(node, connectionRadius);

            neighbors.forEach(neighbor => {
                const dx = node.position.x - neighbor.position.x;
                const dy = node.position.y - neighbor.position.y;
                const distSq = dx * dx + dy * dy;

                if (distSq < connectionRadius * connectionRadius) {
                    // Opacity based on distance AND collective activation
                    const distFactor = 1 - (Math.sqrt(distSq) / connectionRadius);
                    const activationFactor = (node.activation + neighbor.activation) * 0.5;

                    // Base visibility + activation boost
                    // We want faint lines always, brighter lines when active
                    const alpha = (0.2 + (activationFactor * 0.6)) * distFactor;

                    if (alpha > 0.05) {
                        ctx.beginPath();
                        ctx.moveTo(node.position.x, node.position.y);
                        ctx.lineTo(neighbor.position.x, neighbor.position.y);
                        ctx.strokeStyle = `rgba(30, 100, 200, ${alpha})`;
                        ctx.stroke();
                    }

                    // Signal propagation: if one is highly active and other is not, transfer some energy
                    // This creates the "wave" effect
                    if (node.activation > 0.5 && neighbor.activation < node.activation) {
                        neighbor.activate(0.02);
                    }
                }
            });

            // Draw the node itself
            node.draw(ctx);
        });
    }
}
