import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: number;
  icon: LucideIcon;
  to: string;
  delay?: number;
}

function useCountUp(target: number, durationMs = 700) {
  const [value, setValue] = useState(0);
  const start = useRef<number | null>(null);

  useEffect(() => {
    start.current = null;
    let frame: number;
    function tick(timestamp: number) {
      if (start.current === null) start.current = timestamp;
      const progress = Math.min((timestamp - start.current) / durationMs, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * target));
      if (progress < 1) frame = requestAnimationFrame(tick);
    }
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, durationMs]);

  return value;
}

export function StatCard({ label, value, icon: Icon, to, delay = 0 }: StatCardProps) {
  const animated = useCountUp(value);

  return (
    <Link
      to={to}
      className="animate-fade-in-up group rounded-2xl border border-line bg-white p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-brand-primary/30 hover:shadow-md"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-brand-primary/10 text-brand-primary transition-colors group-hover:bg-brand-primary group-hover:text-white">
        <Icon size={16} />
      </div>
      <p className="font-tabular text-xl font-bold text-ink">{animated}</p>
      <p className="text-[11px] text-gray-400">{label}</p>
    </Link>
  );
}
