import { forwardRef } from "react";

const Card = forwardRef(function Card({ className = "", ...props }, ref) {
  return <div ref={ref} className={`rounded-2xl border border-slate-200 bg-white shadow-sm ${className}`} {...props} />;
});

function CardContent({ className = "", ...props }) {
  return <div className={`p-6 ${className}`} {...props} />;
}

export { Card, CardContent };