'use client';

import React, { useEffect, useRef } from 'react';

export const Fallback2DFarm: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight * 0.6);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight * 0.6;
    };
    window.addEventListener('resize', handleResize);

    const numCrops = Math.min(120, Math.floor(width / 10));
    const crops = Array.from({ length: numCrops }).map((_, i) => ({
      x: (i / numCrops) * width + (Math.random() - 0.5) * 20,
      baseY: height - 10 - Math.random() * 40,
      height: 60 + Math.random() * 40,
      offset: Math.random() * Math.PI * 2,
      speed: 1 + Math.random() * 1.5,
    }));

    let time = 0;
    const render = () => {
      time += 0.02;
      ctx.clearRect(0, 0, width, height);

      // Bright Morning Sunlight Sky Gradient
      const skyGrad = ctx.createLinearGradient(0, 0, 0, height);
      skyGrad.addColorStop(0, '#DCEFF5');
      skyGrad.addColorStop(0.6, '#F8FAF3');
      skyGrad.addColorStop(1, '#EEF5E8');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, width, height);

      // Warm Morning Sun Glow
      const sunGrad = ctx.createRadialGradient(
        width * 0.5,
        height * 0.2,
        10,
        width * 0.5,
        height * 0.2,
        200
      );
      sunGrad.addColorStop(0, 'rgba(232, 185, 74, 0.35)');
      sunGrad.addColorStop(1, 'rgba(232, 185, 74, 0)');
      ctx.fillStyle = sunGrad;
      ctx.fillRect(0, 0, width, height);

      // Render 2D wheat stalks swaying
      crops.forEach((crop) => {
        const windX = Math.sin(time * crop.speed + crop.offset) * 12;

        ctx.beginPath();
        ctx.moveTo(crop.x, crop.baseY);
        ctx.quadraticCurveTo(
          crop.x + windX * 0.5,
          crop.baseY - crop.height * 0.5,
          crop.x + windX,
          crop.baseY - crop.height
        );
        ctx.strokeStyle = '#3F7D3A';
        ctx.lineWidth = 3;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(
          crop.x + windX,
          crop.baseY - crop.height - 8,
          6,
          0,
          Math.PI * 2
        );
        ctx.fillStyle = '#E8B94A';
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
      <canvas ref={canvasRef} className="w-full h-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#F8FAF3] via-transparent to-transparent opacity-80" />
    </div>
  );
};
