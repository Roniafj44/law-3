import { useEffect, useRef } from 'react';

export default function ParticleCanvas() {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        let animId;
        let particles = [];

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        resize();
        window.addEventListener('resize', resize);

        // Create floating particles
        const PARTICLE_COUNT = 40;
        for (let i = 0; i < PARTICLE_COUNT; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 0.3,
                vy: (Math.random() - 0.5) * 0.3,
                size: Math.random() * 2.5 + 0.5,
                opacity: Math.random() * 0.15 + 0.03,
                pulse: Math.random() * Math.PI * 2,
            });
        }

        const draw = (time) => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Draw subtle grid
            ctx.strokeStyle = 'rgba(29, 185, 84, 0.025)';
            ctx.lineWidth = 0.5;
            const gridSize = 80;
            const offsetX = (time * 0.003) % gridSize;
            const offsetY = (time * 0.002) % gridSize;

            for (let x = -gridSize + offsetX; x < canvas.width + gridSize; x += gridSize) {
                ctx.beginPath();
                ctx.moveTo(x, 0);
                ctx.lineTo(x, canvas.height);
                ctx.stroke();
            }
            for (let y = -gridSize + offsetY; y < canvas.height + gridSize; y += gridSize) {
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(canvas.width, y);
                ctx.stroke();
            }

            // Draw particles
            particles.forEach(p => {
                p.x += p.vx;
                p.y += p.vy;
                p.pulse += 0.015;

                if (p.x < 0) p.x = canvas.width;
                if (p.x > canvas.width) p.x = 0;
                if (p.y < 0) p.y = canvas.height;
                if (p.y > canvas.height) p.y = 0;

                const alpha = p.opacity * (0.6 + 0.4 * Math.sin(p.pulse));
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(29, 185, 84, ${alpha})`;
                ctx.fill();
            });

            // Draw some connecting lines between nearby particles
            ctx.strokeStyle = 'rgba(29, 185, 84, 0.02)';
            ctx.lineWidth = 0.5;
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 150) {
                        ctx.globalAlpha = (1 - dist / 150) * 0.3;
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                        ctx.globalAlpha = 1;
                    }
                }
            }

            // Decorative corner brackets
            const bracketSize = 30;
            const bracketWeight = 1.5;
            ctx.strokeStyle = 'rgba(53, 57, 53, 0.06)';
            ctx.lineWidth = bracketWeight;

            // Top-left
            ctx.beginPath();
            ctx.moveTo(20, 20 + bracketSize);
            ctx.lineTo(20, 20);
            ctx.lineTo(20 + bracketSize, 20);
            ctx.stroke();

            // Top-right
            ctx.beginPath();
            ctx.moveTo(canvas.width - 20 - bracketSize, 20);
            ctx.lineTo(canvas.width - 20, 20);
            ctx.lineTo(canvas.width - 20, 20 + bracketSize);
            ctx.stroke();

            // Bottom-left
            ctx.beginPath();
            ctx.moveTo(20, canvas.height - 20 - bracketSize);
            ctx.lineTo(20, canvas.height - 20);
            ctx.lineTo(20 + bracketSize, canvas.height - 20);
            ctx.stroke();

            // Bottom-right
            ctx.beginPath();
            ctx.moveTo(canvas.width - 20 - bracketSize, canvas.height - 20);
            ctx.lineTo(canvas.width - 20, canvas.height - 20);
            ctx.lineTo(canvas.width - 20, canvas.height - 20 - bracketSize);
            ctx.stroke();

            animId = requestAnimationFrame(draw);
        };

        animId = requestAnimationFrame(draw);

        return () => {
            cancelAnimationFrame(animId);
            window.removeEventListener('resize', resize);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: 'fixed',
                inset: 0,
                zIndex: 1,
                pointerEvents: 'none',
            }}
        />
    );
}
