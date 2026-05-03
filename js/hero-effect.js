/* ─────────────────────────────────────────────────────
   HERO PHOTO EFFECT
   Light reveal + floating particles on canvas
   ───────────────────────────────────────────────────── */

(function () {
    var container = document.getElementById('hero-photo-container');
    if (!container) return;

    var canvas = document.getElementById('hero-canvas');
    var ctx = canvas.getContext('2d');
    var img = document.getElementById('hero-photo-img');

    var mouse = { x: -999, y: -999 };
    var particles = [];
    var animFrame;
    var isHovering = false;
    var revealRadius = 0;
    var targetRadius = 0;

    /* ── Resize canvas to match container ── */
    function resize() {
        canvas.width = container.offsetWidth;
        canvas.height = container.offsetHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    /* ── Particles ── */
    function Particle(x, y) {
        this.x = x || Math.random() * canvas.width;
        this.y = y || Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.4;
        this.vy = (Math.random() - 0.5) * 0.4;
        this.radius = Math.random() * 1.5 + 0.5;
        this.opacity = Math.random() * 0.5 + 0.1;
        this.targetOpacity = this.opacity;
        this.life = 1;
    }

    Particle.prototype.update = function () {
        var dx = this.x - mouse.x;
        var dy = this.y - mouse.y;
        var dist = Math.sqrt(dx * dx + dy * dy);
        var repelRadius = 80;

        if (dist < repelRadius && isHovering) {
            var force = (repelRadius - dist) / repelRadius;
            this.vx += (dx / dist) * force * 0.8;
            this.vy += (dy / dist) * force * 0.8;
        }

        this.vx *= 0.96;
        this.vy *= 0.96;
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0) this.x = canvas.width;
        if (this.x > canvas.width) this.x = 0;
        if (this.y < 0) this.y = canvas.height;
        if (this.y > canvas.height) this.y = 0;
    };

    Particle.prototype.draw = function () {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(196, 113, 74, ' + this.opacity + ')';
        ctx.fill();
    };

    /* ── Init particles ── */
    function initParticles() {
        particles = [];
        var count = Math.floor((canvas.width * canvas.height) / 6000);
        count = Math.max(20, Math.min(count, 60));
        for (var i = 0; i < count; i++) {
            particles.push(new Particle());
        }
    }
    initParticles();

    /* ── Draw connections between nearby particles ── */
    function drawConnections() {
        for (var i = 0; i < particles.length; i++) {
            for (var j = i + 1; j < particles.length; j++) {
                var dx = particles[i].x - particles[j].x;
                var dy = particles[i].y - particles[j].y;
                var dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 90) {
                    var alpha = (1 - dist / 90) * 0.15;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = 'rgba(196, 113, 74, ' + alpha + ')';
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }
    }

    /* ── Main render loop ── */
    function render() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        /* Smooth radius transition */
        targetRadius = isHovering ? 130 : 0;
        revealRadius += (targetRadius - revealRadius) * 0.08;

        /* Dark overlay with light reveal cutout */
        if (revealRadius > 1) {
            /* Full dark layer */
            ctx.fillStyle = 'rgba(10, 8, 6, 0.72)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            /* Cut out a bright circle at cursor using destination-out */
            var grad = ctx.createRadialGradient(
                mouse.x, mouse.y, 0,
                mouse.x, mouse.y, revealRadius
            );
            grad.addColorStop(0, 'rgba(0,0,0,0.85)');
            grad.addColorStop(0.5, 'rgba(0,0,0,0.4)');
            grad.addColorStop(1, 'rgba(0,0,0,0)');

            ctx.globalCompositeOperation = 'destination-out';
            ctx.beginPath();
            ctx.arc(mouse.x, mouse.y, revealRadius, 0, Math.PI * 2);
            ctx.fillStyle = grad;
            ctx.fill();
            ctx.globalCompositeOperation = 'source-over';

            /* Soft glow ring at cursor edge */
            var glowGrad = ctx.createRadialGradient(
                mouse.x, mouse.y, revealRadius * 0.7,
                mouse.x, mouse.y, revealRadius * 1.1
            );
            glowGrad.addColorStop(0, 'rgba(196, 113, 74, 0)');
            glowGrad.addColorStop(0.5, 'rgba(196, 113, 74, 0.08)');
            glowGrad.addColorStop(1, 'rgba(196, 113, 74, 0)');
            ctx.beginPath();
            ctx.arc(mouse.x, mouse.y, revealRadius * 1.1, 0, Math.PI * 2);
            ctx.fillStyle = glowGrad;
            ctx.fill();

        } else {
            /* Default dark overlay when not hovering */
            ctx.fillStyle = 'rgba(10, 8, 6, 0.55)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        /* Particles + connections — only visible near cursor */
        if (isHovering) {
            drawConnections();
            particles.forEach(function (p) {
                p.update();
                /* Fade particles near reveal zone */
                var dx = p.x - mouse.x;
                var dy = p.y - mouse.y;
                var dist = Math.sqrt(dx * dx + dy * dy);
                p.opacity = Math.min(0.6, p.opacity + 0.02);
                if (dist < revealRadius * 1.5) {
                    p.draw();
                }
            });
        }

        animFrame = requestAnimationFrame(render);
    }

    /* ── Mouse events ── */
    container.addEventListener('mouseenter', function () {
        isHovering = true;
    });

    container.addEventListener('mouseleave', function () {
        isHovering = false;
        mouse.x = -999;
        mouse.y = -999;
    });

    container.addEventListener('mousemove', function (e) {
        var rect = canvas.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
    });

    /* ── Start ── */
    img.addEventListener('load', function () {
        initParticles();
        render();
    });
    if (img.complete) {
        initParticles();
        render();
    }

})();