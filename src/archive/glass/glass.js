export class GlassShard {
    constructor(x, y, size, angle) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.baseAngle = angle;
        this.currentAngle = angle;
        this.hue = 200;
        this.shadowColor = 'rgba(0, 0, 0, 0.1)';
        this.vibrationSpeed = Math.random() * 0.05 + 0.02;
        this.vibrationOffset = Math.random() * Math.PI * 2;
        this.opacity = 0.3 + Math.random() * 0.4;
    }

    update(sunX, sunY, time) {
        const dx = sunX - this.x;
        const dy = sunY - this.y;
        const angleToSun = Math.atan2(dy, dx);
        const distToSun = Math.sqrt(dx * dx + dy * dy);

        // Interaction: Shards react to sun distance
        const interactionRadius = 1200;
        const influence = Math.max(0, 1 - distToSun / interactionRadius);

        // Shards stay completely static - no movement at all
        this.currentAngle = this.baseAngle;

        // Dichroic logic: Hue shifts based on angle to sun and distance
        const baseHue = 180; // Cyan
        const hueRange = 140; // Shift towards Magenta/Purple/Gold

        // Use dot product/angle difference for more realistic color shift
        const shardDirX = Math.cos(this.currentAngle);
        const shardDirY = Math.sin(this.currentAngle);
        // Guard against zero distance to avoid NaN
        const safeDist = Math.max(distToSun, 0.001);
        const sunDirX = dx / safeDist;
        const sunDirY = dy / safeDist;
        const dot = shardDirX * sunDirX + shardDirY * sunDirY;

        this.hue = (baseHue + (dot + 1) * 0.5 * hueRange + 360) % 360;

        // Shadow/Caustic logic
        const shadowDist = Math.min(distToSun * 0.12, 50);
        this.shadowX = -sunDirX * shadowDist;
        this.shadowY = -sunDirY * shadowDist;

        // Shadow is colorful and blurred (caustics)
        const shadowHue = (this.hue + 80) % 360;
        this.shadowAlpha = 0.4 * influence;
        this.shadowColor = `hsla(${shadowHue}, 90%, 75%, ${this.shadowAlpha})`;
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.currentAngle);

        // Draw caustic shadow (blurred colored block)
        if (this.shadowAlpha > 0.01) {
            ctx.save();
            ctx.beginPath();
            ctx.rect(-this.size / 2 + this.shadowX, -this.size / 20 + this.shadowY, this.size, this.size / 10);
            ctx.fillStyle = this.shadowColor;
            ctx.fill();
            ctx.restore();
        }

        // Draw glass shard with dichroic gradient
        const gradient = ctx.createLinearGradient(-this.size / 2, 0, this.size / 2, 0);
        gradient.addColorStop(0, `hsla(${this.hue}, 100%, 80%, ${this.opacity})`);
        gradient.addColorStop(0.5, `hsla(${(this.hue + 40) % 360}, 100%, 90%, ${this.opacity - 0.1})`);
        gradient.addColorStop(1, `hsla(${(this.hue - 40) % 360}, 100%, 80%, ${this.opacity})`);

        ctx.beginPath();
        ctx.rect(-this.size / 2, -this.size / 20, this.size, this.size / 10);
        ctx.fillStyle = gradient;

        // High-contrast edge
        ctx.strokeStyle = `hsla(${this.hue}, 100%, 98%, ${this.opacity + 0.3})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ctx.fill();

        // Top reflective highlight
        ctx.beginPath();
        ctx.rect(-this.size / 2, -this.size / 20, this.size, this.size / 60);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.fill();

        ctx.restore();
    }
}

export class GlassSystem {
    constructor(count) {
        this.shards = [];
        this.count = count;
        this.time = 0;

        // Smoothed sun position for slow, natural tracking
        this.sunX = window.innerWidth / 2;
        this.sunY = window.innerHeight / 2;
        this.targetSunX = this.sunX;
        this.targetSunY = this.sunY;

        this.init();
    }

    init() {
        this.shards = [];
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        const maxRadius = Math.max(window.innerWidth, window.innerHeight) * 0.7;

        // Golden ratio distribution for a natural, organic spiral
        const phi = (1 + Math.sqrt(5)) / 2;
        const angleStep = Math.PI * 2 * (1 - 1 / phi);

        for (let i = 0; i < this.count; i++) {
            const t = i / this.count;
            const angle = i * angleStep;
            const radius = Math.sqrt(t) * maxRadius;

            const x = centerX + Math.cos(angle) * radius;
            const y = centerY + Math.sin(angle) * radius;

            // Shards are oriented along the spiral, but with some variation
            const shardAngle = angle + (Math.random() - 0.5) * 0.3;
            const size = 25 + Math.random() * 50;
            this.shards.push(new GlassShard(x, y, size, shardAngle));
        }
    }

    resize(width, height) {
        this.sunX = width / 2;
        this.sunY = height / 2;
        this.targetSunX = this.sunX;
        this.targetSunY = this.sunY;
        this.init();
    }

    update(targetX, targetY) {
        this.time += 0.5;

        // Smooth sun movement with gentle easing
        this.targetSunX = targetX;
        this.targetSunY = targetY;
        // Moderate easing factor (0.05) for visible but gradual light movement
        this.sunX += (this.targetSunX - this.sunX) * 0.05;
        this.sunY += (this.targetSunY - this.sunY) * 0.05;

        for (let i = 0; i < this.shards.length; i++) {
            this.shards[i].update(this.sunX, this.sunY, this.time);
        }
    }

    draw(ctx) {
        for (let i = 0; i < this.shards.length; i++) {
            this.shards[i].draw(ctx);
        }
    }
}
