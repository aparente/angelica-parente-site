export class Node {
    constructor(x, y) {
        this.position = { x, y };
        // Very slow drift
        const angle = Math.random() * Math.PI * 2;
        const speed = 0.2 + Math.random() * 0.3;
        this.velocity = {
            x: Math.cos(angle) * speed,
            y: Math.sin(angle) * speed
        };

        // Activation state (0.0 to 1.0)
        // 0 = resting, 1 = fully activated
        this.activation = 0;
        this.baseColor = '#4a9eff'; // Cyan/Blue
    }

    update(width, height) {
        // Apply velocity
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        // Wrap around screen
        if (this.position.x < 0) this.position.x = width;
        if (this.position.x > width) this.position.x = 0;
        if (this.position.y < 0) this.position.y = height;
        if (this.position.y > height) this.position.y = 0;

        // Decay activation
        this.activation *= 0.95;
        if (this.activation < 0.01) this.activation = 0;

        // Randomly change direction slightly (Brownian-ish)
        if (Math.random() < 0.02) {
            const angle = (Math.random() - 0.5) * 0.5;
            const cos = Math.cos(angle);
            const sin = Math.sin(angle);
            const newX = this.velocity.x * cos - this.velocity.y * sin;
            const newY = this.velocity.x * sin + this.velocity.y * cos;
            this.velocity.x = newX;
            this.velocity.y = newY;
        }
    }

    activate(amount = 1.0) {
        this.activation = Math.min(this.activation + amount, 1.0);
    }

    draw(ctx) {
        // Only draw the node itself effectively if it's somewhat activated
        // or very subtly if resting.
        // Base alpha higher so it's visible at rest
        const alpha = 0.6 + (this.activation * 0.4);
        const size = 3 + (this.activation * 4);

        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(30, 100, 200, ${alpha})`; // Darker blue
        ctx.fill();
    }
}
