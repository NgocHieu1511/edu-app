import { forwardRef } from "react";

const variants = {
  default: "bg-slate-950 text-white hover:bg-slate-800",
  accent: "bg-orange-500 text-white shadow-lg shadow-orange-500/20 hover:bg-orange-600",
  outline: "border border-slate-200 bg-white text-slate-700 hover:border-teal-300 hover:bg-teal-50 hover:text-teal-800",
  ghost: "text-slate-600 hover:bg-slate-100 hover:text-slate-950",
};

const sizes = {
  default: "h-11 px-5",
  sm: "h-9 px-3 text-sm",
  lg: "h-12 px-6 text-base",
  icon: "h-10 w-10",
};

const Button = forwardRef(function Button(
  { className = "", variant = "default", size = "default", ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      className={`inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 disabled:pointer-events-none disabled:opacity-50 ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    />
  );
});

export { Button };