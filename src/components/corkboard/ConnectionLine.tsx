
import React from 'react';

interface Position {
  x: number;
  y: number;
}

interface ConnectionLineProps {
  startPos: Position;
  endPos: Position;
  color?: string;
  dashed?: boolean;
  thickness?: number;
  animated?: boolean;
}

export const ConnectionLine: React.FC<ConnectionLineProps> = ({
  startPos,
  endPos,
  color = 'rgba(255, 0, 0, 0.6)',
  dashed = true,
  thickness = 2,
  animated = true,
}) => {
  // Calculate the line properties
  const dx = endPos.x - startPos.x;
  const dy = endPos.y - startPos.y;
  const length = Math.sqrt(dx * dx + dy * dy);
  const angle = Math.atan2(dy, dx) * (180 / Math.PI);

  // Calculate center position for potential label or interaction point
  const centerX = startPos.x + dx / 2;
  const centerY = startPos.y + dy / 2;

  return (
    <div
      className="absolute pointer-events-none z-0"
      style={{
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      }}
    >
      <div
        className={`absolute ${animated ? 'animate-pulse' : ''}`}
        style={{
          width: `${length}px`,
          height: `${thickness}px`,
          backgroundColor: color,
          transformOrigin: '0 50%',
          transform: `translate(${startPos.x}px, ${startPos.y}px) rotate(${angle}deg)`,
          opacity: 0.8,
          ...(dashed ? { 
            backgroundImage: `linear-gradient(to right, ${color} 50%, transparent 50%)`,
            backgroundSize: '12px 100%',
            backgroundRepeat: 'repeat-x',
          } : {}),
        }}
      />
      
      {/* Center dot/interaction point */}
      <div 
        className={`absolute rounded-full ${animated ? 'animate-pulse' : ''}`}
        style={{
          width: `${thickness * 4}px`,
          height: `${thickness * 4}px`,
          backgroundColor: color,
          transform: `translate(${centerX - thickness * 2}px, ${centerY - thickness * 2}px)`,
          opacity: 0.9,
        }}
      />
    </div>
  );
};
