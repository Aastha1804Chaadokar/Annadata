import React from 'react';

interface PageHeroProps {
  badge: string;
  title: string;
  subtitle: string;
  icon?: React.ReactNode;
}

export const PageHero: React.FC<PageHeroProps> = ({
  badge,
  title,
  subtitle,
  icon,
}) => {
  return (
    <section className="pt-36 pb-16 bg-[#F7F6F0] border-b border-[#173F2A]/10 relative overflow-hidden">
      {/* Subtle organic gradient ambient glow */}
      <div className="absolute inset-0 bg-radial from-[#3F7D3A]/5 via-transparent to-transparent pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-4">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#3F7D3A]/20 text-[#173F2A] text-xs font-bold uppercase tracking-widest shadow-sm">
          {icon && <span className="shrink-0 text-[#3F7D3A]">{icon}</span>}
          <span>{badge}</span>
        </div>

        {/* Title */}
        <h1 className="text-3xl sm:text-5xl font-black text-[#173F2A] tracking-tight leading-tight">
          {title}
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg text-[#5F6F62] max-w-2xl mx-auto font-normal leading-relaxed">
          {subtitle}
        </p>
      </div>
    </section>
  );
};
