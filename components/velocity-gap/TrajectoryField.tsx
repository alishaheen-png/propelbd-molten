"use client";

import { useEffect, useRef } from "react";

const nodes = [
  { name: "DIFC", x: 0.22, y: 0.32 },
  { name: "ADGM", x: 0.74, y: 0.26 },
  { name: "DIC", x: 0.32, y: 0.62 },
  { name: "ADGM", x: 0.78, y: 0.58 },
  { name: "DMCC", x: 0.14, y: 0.52 },
  { name: "Masdar", x: 0.56, y: 0.46 },
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

      // Subtle grid
      ctx.strokeStyle = "rgba(35, 87, 196, 0.06)";
      ctx.lineWidth = 1;
      for (let x = 0; x < w; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = 0; y < h; y += 40) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      // Connections
      ctx.lineWidth = 1.5;
      nodes.forEach((a, i) => {
        nodes.forEach((b, j) => {
          if (j <= i) return;
          const ax = a.x * w;
          const ay = a.y * h;
          const bx = b.x * w;
          const by = b.y * h;
          const dist = Math.hypot(bx - ax, by - ay);
          if (dist < w * 0.65) {
            const alpha = 0.15 + 0.2 * Math.sin(time * 0.001 + i + j);
            ctx.strokeStyle = `rgba(35, 87, 196, ${Math.max(0.1, alpha)})`;
            ctx.beginPath();
            ctx.moveTo(ax, ay);
            ctx.lineTo(bx, by);
            ctx.stroke();
          }
        });
      });

      // Nodes
      nodes.forEach((node, i) => {
        const x = node.x * w;
        const y = node.y * h;
        const pulse = 1 + 0.18 * Math.sin(time * 0.002 + i * 1.5);

        ctx.fillStyle = "rgba(35, 87, 196, 0.2)";
        ctx.beginPath();
        ctx.arc(x, y, 7 * pulse, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "#4A7FD9";
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "rgba(244, 246, 250, 0.6)";
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
