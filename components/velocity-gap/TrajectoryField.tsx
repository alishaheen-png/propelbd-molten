"use client";

import { useEffect, useRef } from "react";

const nodes = [
  { name: "DIFC", x: 0.25, y: 0.35 },
  { name: "ADGM", x: 0.72, y: 0.28 },
  { name: "Dubai Internet City", x: 0.35, y: 0.65 },
  { name: "Abu Dhabi Global Market", x: 0.78, y: 0.62 },
  { name: "DMCC", x: 0.15, y: 0.55 },
  { name: "Masdar City", x: 0.58, y: 0.48 },
];

export function TrajectoryField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let time = 0;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };

    const draw = () => {
      const rect = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, rect.width, rect.height);

      const w = rect.width;
      const h = rect.height;

      // Draw connections
      ctx.lineWidth = 1;
      nodes.forEach((a, i) => {
        nodes.forEach((b, j) => {
          if (j <= i) return;
          const ax = a.x * w;
          const ay = a.y * h;
          const bx = b.x * w;
          const by = b.y * h;
          const dist = Math.hypot(bx - ax, by - ay);
          if (dist < w * 0.55) {
            const alpha = 0.08 + 0.12 * Math.sin(time * 0.001 + i + j);
            ctx.strokeStyle = `rgba(35, 87, 196, ${alpha})`;
            ctx.beginPath();
            ctx.moveTo(ax, ay);
            ctx.lineTo(bx, by);
            ctx.stroke();
          }
        });
      });

      // Draw nodes
      nodes.forEach((node, i) => {
        const x = node.x * w;
        const y = node.y * h;
        const pulse = 1 + 0.15 * Math.sin(time * 0.002 + i * 1.5);

        ctx.fillStyle = "rgba(35, 87, 196, 0.15)";
        ctx.beginPath();
        ctx.arc(x, y, 6 * pulse, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "#2357C4";
        ctx.beginPath();
        ctx.arc(x, y, 2.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "rgba(244, 246, 249, 0.5)";
        ctx.font = "500 11px var(--font-jetbrains)";
        ctx.fillText(node.name, x + 12, y + 4);
      });

      time += 16;
      animationId = requestAnimationFrame(draw);
    };

    resize();
    draw();
    window.addEventListener("resize", resize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="w-full h-full absolute inset-0" aria-hidden="true" />;
}
