import React from "react";

export const inputClass =
  "w-full px-3 py-2 rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500 dark:focus:ring-brand-400 transition-colors";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger";
  loading?: boolean;
}

export function Button({
  variant = "primary",
  loading = false,
  disabled,
  children,
  className,
  ...props
}: ButtonProps) {
  const baseClass = "px-4 py-2 rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2";
  const variantClass = {
    primary: "bg-brand-500 text-white hover:bg-brand-600 focus:ring-brand-500",
    secondary: "bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white hover:bg-slate-300 dark:hover:bg-slate-600 focus:ring-slate-500",
    danger: "bg-red-500 text-white hover:bg-red-600 focus:ring-red-500",
  };

  return (
    <button
      disabled={disabled || loading}
      className={`${baseClass} ${variantClass[variant]} ${disabled || loading ? "opacity-50 cursor-not-allowed" : ""} ${className}`}
      {...props}
    >
      {loading ? "..." : children}
    </button>
  );
}

export function Card({ children, className, style }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
  return (
    <div className={`rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm ${className}`} style={style}>
      {children}
    </div>
  );
}

export function Field({
  label,
  htmlFor,
  required,
  children,
  error,
}: {
  label: string;
  htmlFor: string;
  required?: boolean;
  children: React.ReactNode;
  error?: string;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>
      {children}
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}

export function PageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between mb-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{title}</h1>
        {description && <p className="text-slate-500 dark:text-slate-400 mt-1">{description}</p>}
      </div>
      {action}
    </div>
  );
}

export function Badge({ children, tone = "gray" }: { children: React.ReactNode; tone?: "gray" | "blue" | "red" | "green" }) {
  const toneClass = {
    gray: "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300",
    blue: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300",
    red: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300",
    green: "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300",
  };
  return <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${toneClass[tone]}`}>{children}</span>;
}

export function LinkButton({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) {
  return (
    <a href={href} className={`inline-flex items-center px-4 py-2 rounded-md font-medium bg-brand-500 text-white hover:bg-brand-600 transition-colors ${className}`}>
      {children}
    </a>
  );
}
