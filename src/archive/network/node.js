export class Node {
    constructor(x, y) {
        this.position = { x, y };
        // Slower, more controlled movement for "glass-like" feel
        const angle = Math.random() * Math.PI * 2;
        const speed = 0.1 + Math.random() * 0.25;
        this.velocity = {
            x: Math.cos(angle) * speed,
            y: Math.sin(angle) * speed
        };

        // Node properties (Circular but dichroic)
        this.radius = 1.5 + Math.random() * 2.5;
        this.rotation = Math.random() * Math.PI; // Used for color phase
        this.rotationSpeed = (Math.random() - 0.5) * 0.02;

        // Activation state (0.0 to 1.0)
        this.activation = 0;

        // Base hue for dichroic effect
        this.baseHue = Math.random() < 0.5 ? 190 : 310; // Cyan or Pink/Purple
    }

    update(width, height) {
        // Apply velocity
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
        this.rotation += this.rotationSpeed;

        // Wrap around screen
        if (this.position.x < 0) this.position.x = width;
        if (this.position.x > width) this.position.x = 0;
        if (this.position.y < 0) this.position.y = height;
        if (this.position.y > height) this.position.y = 0;

        // Decay activation
        this.activation *= 0.96;
        if (this.activation < 0.01) this.activation = 0;
    }

    activate(amount = 1.0) {
        this.activation = Math.min(this.activation + amount, 1.0);
    }

    draw(ctx) {
        const { x, y } = this.position;
        const alpha = 0.4 + (this.activation * 0.5);

        // Dichroic shift: Hue changes based on rotation (phase) and activation
        const hueShift = Math.sin(this.rotation) * 20;
        const finalHue = this.baseHue + hueShift + (this.activation * 30);

        // 1. Draw "Prismatic Halo"
        const haloRadius = this.radius * (3 + this.activation * 4);
        const haloAlpha = (0.1 + this.activation * 0.3);

        const grad = ctx.createRadialGradient(x, y, this.radius, x, y, haloRadius);
        grad.addColorStop(0, `hsla(${(finalHue + 180) % 360}, 80%, 75%, ${haloAlpha})`);
        grad.addColorStop(1, `hsla(${(finalHue + 180) % 360}, 80%, 75%, 0)`);

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(x, y, haloRadius, 0, Math.PI * 2);
        ctx.fill();

        // 2. Draw the Node itself (Core)
        ctx.fillStyle = `hsla(${finalHue}, 90%, 65%, ${alpha})`;
        ctx.shadowBlur = 4 + this.activation * 8;
        ctx.shadowColor = `hsla(${finalHue}, 90%, 65%, 0.5)`;

        ctx.beginPath();
        ctx.arc(x, y, this.radius, 0, Math.PI * 2);
        ctx.fill();

        // Add a small "specular" highlight
        ctx.fillStyle = `rgba(255, 255, 255, ${0.4 + this.activation * 0.4})`;
        ctx.beginPath();
        ctx.arc(x - this.radius * 0.3, y - this.radius * 0.3, this.radius * 0.4, 0, Math.PI * 2);
        ctx.fill();
    }
}
