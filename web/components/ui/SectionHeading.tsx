import React from 'react';

interface SectionHeadingProps {
  badge?: string;
  title: string;
  subtitle?: string;
  centered?: boolean;
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  badge,
  title,
  subtitle,
  centered = true,
}) => {
  return (
    <div className={`mb-12 ${centered ? 'text-center' : 'text-left'} max-w-3xl ${centered ? 'mx-auto' : ''}`}>
      {badge && (
        <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-[#EEF5E8] text-[#3F7D3A] border border-[#DCECCF] mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-[#3F7D3A]" />
          {badge}
        </span>
      )}
      <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight leading-tight text-[#285C32]">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-4 text-lg sm:text-xl leading-relaxed text-[#667267]">
          {subtitle}
        </p>
      )}
    </div>
  );
};
