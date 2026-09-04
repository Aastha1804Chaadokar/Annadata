import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  icon,
  className = '',
  ...props
}) => {
  const baseStyle =
    'inline-flex items-center justify-center font-bold tracking-tight rounded-full transition-all duration-300 transform active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2';

  const sizeStyles = {
    sm: 'px-4 py-2 text-xs gap-1.5',
    md: 'px-6 py-2.5 text-sm gap-2 shadow-sm',
    lg: 'px-8 py-3.5 text-base gap-2.5 shadow-md hover:shadow-lg',
  };

  const variantStyles = {
    primary:
      'bg-[#173F2A] hover:bg-[#3F7D3A] text-white focus:ring-[#173F2A] shadow-[#173F2A]/15',
    secondary:
      'bg-white hover:bg-[#EEF5E8] text-[#173F2A] border border-[#173F2A]/15 focus:ring-[#173F2A]',
    accent:
      'bg-[#D8B45A] hover:bg-[#c9a349] text-[#17201A] font-extrabold focus:ring-[#D8B45A] shadow-[#D8B45A]/25',
    outline:
      'border-2 border-[#173F2A] text-[#173F2A] hover:bg-[#173F2A] hover:text-white focus:ring-[#173F2A]',
    ghost:
      'text-[#173F2A] hover:bg-[#EEF5E8] focus:ring-[#173F2A]',
  };

  return (
    <button
      className={`${baseStyle} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </button>
  );
};

