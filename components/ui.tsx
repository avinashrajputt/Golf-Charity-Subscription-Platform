import React from 'react';

// Loading Spinner Component
export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center">
      <div className="w-8 h-8 rounded-full border-4 border-accent border-t-transparent animate-spin"></div>
    </div>
  );
}

// Error Alert Component
export function ErrorAlert({ message }: { message: string }) {
  return (
    <div className="p-4 rounded-lg bg-red-500/10 border border-red-500 text-red-400 text-sm">
      {message}
    </div>
  );
}

// Success Alert Component
export function SuccessAlert({ message }: { message: string }) {
  return (
    <div className="p-4 rounded-lg bg-success/10 border border-success text-success text-sm">
      {message}
    </div>
  );
}

// Button Component
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}

export function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}: ButtonProps) {
  const baseStyle = 'font-bold rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent';

  const variants = {
    primary: 'bg-accent hover:bg-blue-600 text-primary',
    secondary: 'bg-secondary hover:bg-gray-700 text-white',
    outline: 'border-2 border-accent text-accent hover:bg-accent hover:text-primary',
  };

  const sizes = {
    sm: 'px-3 py-1 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <button
      className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    />
  );
}

// Input Component
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, className = '', ...props }: InputProps) {
  return (
    <div>
      {label && <label className="block text-sm font-medium mb-2">{label}</label>}
      <input
        className={`w-full bg-secondary border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent ${className}`}
        {...props}
      />
      {error && <p className="text-red-400 text-sm mt-1">{error}</p>}
    </div>
  );
}

// Card Component
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function Card({ children, className = '', ...props }: CardProps) {
  return (
    <div
      className={`bg-secondary rounded-xl p-6 border border-gray-700 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
