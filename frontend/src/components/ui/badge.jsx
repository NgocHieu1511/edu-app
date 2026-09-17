function Badge({ children, className = "", variant = "default" }) {
  const styles = {
    default: "bg-teal-100 text-teal-800",
    warm: "bg-orange-100 text-orange-800",
    subtle: "bg-slate-100 text-slate-600",
  };

  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold ${styles[variant]} ${className}`}>
      {children}
    </span>
  );
}

export { Badge };