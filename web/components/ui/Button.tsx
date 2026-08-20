import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
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
    'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 transform active:scale-95 shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2';

  const sizeStyles = {
    sm: 'px-4 py-2 text-sm gap-1.5',
    md: 'px-6 py-2.5 text-base gap-2',
    lg: 'px-7 py-3 text-lg gap-2.5 shadow-md hover:shadow-lg',
  };

  const variantStyles = {
    primary:
      'bg-[#3F7D3A] hover:bg-[#285C32] text-white focus:ring-[#3F7D3A] shadow-[#3F7D3A]/20',
    secondary:
      'bg-white hover:bg-[#EEF5E8] text-[#3F7D3A] border border-[#C9DDC2] focus:ring-[#3F7D3A] shadow-stone-200/50',
    outline:
      'border-2 border-[#3F7D3A] text-[#3F7D3A] hover:bg-[#3F7D3A] hover:text-white focus:ring-[#3F7D3A]',
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
