import React from 'react';

interface PageHeroProps {
  badge: string;
  title: string;
  subtitle: string;
  bgGradient?: string;
  icon?: React.ReactNode;
}

export const PageHero: React.FC<PageHeroProps> = ({
  badge,
  title,
  subtitle,
  bgGradient = 'from-[#EEF5E8] via-[#F8FAF3] to-[#FFF8E8]',
  icon,
}) => {
  return (
    <section className={`pt-32 pb-16 bg-gradient-to-b ${bgGradient} border-b border-[#3F7D3A]/10 relative overflow-hidden`}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-4">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 border border-[#3F7D3A]/20 text-[#3F7D3A] text-xs font-bold shadow-sm">
          {icon && <span className="shrink-0">{icon}</span>}
          <span>{badge}</span>
        </div>

        {/* Title */}
        <h1 className="text-4xl sm:text-6xl font-black text-[#285C32] tracking-tight leading-tight">
          {title}
        </h1>

        {/* Subtitle */}
        <p className="text-lg sm:text-xl text-[#667267] max-w-2xl mx-auto font-normal leading-relaxed">
          {subtitle}
        </p>
      </div>
    </section>
  );
};
