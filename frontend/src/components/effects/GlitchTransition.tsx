import React, { useEffect, useState } from 'react';

interface Props { duration?: number }

const GlitchTransition: React.FC<Props> = ({ duration = 450 }) => {
  const [active, setActive] = useState(false);

  useEffect(() => {
    setActive(true);
    const t = setTimeout(() => setActive(false), duration);
    return () => clearTimeout(t);
  }, [duration]);

  if (!active) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[999] overflow-hidden">
      <div className="absolute inset-0 bg-background opacity-60" />
      {/* RGB split bars */}
      <div className="absolute inset-x-0 top-1/3 h-6 bg-red-500/40 mix-blend-screen animate-[fade-in_0.15s_ease-out]" />
      <div className="absolute inset-x-0 top-1/2 h-5 bg-green-500/40 mix-blend-screen animate-[fade-in_0.2s_ease-out]" />
      <div className="absolute inset-x-0 top-2/3 h-4 bg-blue-500/40 mix-blend-screen animate-[fade-in_0.25s_ease-out]" />
      {/* Noise slices */}
      {Array.from({ length: 14 }).map((_, i) => (
        <div key={i} className="absolute left-0 right-0 bg-white/5" style={{ top: `${Math.random()*100}%`, height: `${Math.random()*6+2}px`, transform: `translateX(${(Math.random()-0.5)*30}px)` }} />
      ))}
    </div>
  );
};

export default GlitchTransition;
