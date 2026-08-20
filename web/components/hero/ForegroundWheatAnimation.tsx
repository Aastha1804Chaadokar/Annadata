'use client';

import React, { useEffect, useRef } from 'react';

interface ForegroundWheatAnimationProps {
  reducedMotion?: boolean;
}

export const ForegroundWheatAnimation: React.FC<ForegroundWheatAnimationProps> = ({
  reducedMotion = false,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = Math.floor(window.innerHeight * 0.25));

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = Math.floor(window.innerHeight * 0.25);
    };
    window.addEventListener('resize', handleResize);

    const isMobile = width < 768;
    const numStalks = isMobile ? 45 : 110;

    // Generate individual wheat stalk attributes
    const stalks = Array.from({ length: numStalks }).map((_, i) => ({
      x: (i / numStalks) * width + (Math.random() - 0.5) * 15,
      baseY: height,
      height: 70 + Math.random() * 45,
      offset: Math.random() * Math.PI * 2,
      speed: 1 + Math.random() * 1.2,
      strength: 10 + Math.random() * 8,
      thickness: 2 + Math.random() * 1.5,
    }));

    let time = 0;
    const render = () => {
      time += reducedMotion ? 0 : 0.02;
      ctx.clearRect(0, 0, width, height);

      // Render foreground wheat stalks swaying
      stalks.forEach((stalk) => {
        const windX = Math.sin(time * stalk.speed + stalk.offset) * stalk.strength;

        // Stem
        ctx.beginPath();
        ctx.moveTo(stalk.x, stalk.baseY);
        ctx.quadraticCurveTo(
          stalk.x + windX * 0.4,
          stalk.baseY - stalk.height * 0.5,
          stalk.x + windX,
          stalk.baseY - stalk.height
        );
        ctx.strokeStyle = '#3F7D3A';
        ctx.lineWidth = stalk.thickness;
        ctx.lineCap = 'round';
        ctx.stroke();

        // Golden Wheat Head / Spikelet
        const headX = stalk.x + windX;
        const headY = stalk.baseY - stalk.height - 10;

        ctx.beginPath();
        ctx.ellipse(headX, headY, 5, 12, (windX * Math.PI) / 180, 0, Math.PI * 2);
        ctx.fillStyle = '#E8B94A';
        ctx.fill();
        ctx.strokeStyle = '#D8A93E';
        ctx.lineWidth = 1;
        ctx.stroke();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [reducedMotion]);

  return (
    <div className="absolute bottom-0 left-0 right-0 h-[25vh] z-10 pointer-events-none overflow-hidden">
      <canvas ref={canvasRef} className="w-full h-full object-cover" />
      {/* Blend gradient transition to #F8FAF3 next section */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#F8FAF3] via-transparent to-transparent opacity-90" />
    </div>
  );
};
