import React from 'react';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  description: string;
  badge?: string;
  className?: string;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({
  icon,
  title,
  subtitle,
  description,
  badge,
  className = '',
}) => {
  return (
    <div
      className={`group relative p-8 rounded-2xl bg-white border border-[#3F7D3A]/10 shadow-sm hover:shadow-md hover:border-[#3F7D3A]/30 transition-all duration-300 ${className}`}
    >
      <div className="flex items-start justify-between mb-6">
        <div className="p-3.5 rounded-xl bg-[#EEF5E8] text-[#3F7D3A] group-hover:bg-[#3F7D3A] group-hover:text-white transition-colors duration-300">
          {icon}
        </div>
        {badge && (
          <span className="text-xs px-2.5 py-1 rounded-full font-medium bg-[#EEF5E8] text-[#3F7D3A] border border-[#DCECCF]">
            {badge}
          </span>
        )}
      </div>

      <h3 className="text-xl font-bold text-[#285C32] mb-1 group-hover:text-[#3F7D3A] transition-colors">
        {title}
      </h3>

      {subtitle && (
        <p className="text-xs font-semibold uppercase tracking-wider mb-3 text-[#3F7D3A]">
          {subtitle}
        </p>
      )}

      <p className="text-sm leading-relaxed text-[#667267]">
        {description}
      </p>
    </div>
  );
};
