
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
  label?: string;
  style?: 'solid' | 'dashed' | 'dotted' | 'zigzag';
}

export const ConnectionLine: React.FC<ConnectionLineProps> = ({
  startPos,
  endPos,
  color = 'rgba(255, 0, 0, 0.8)',
  dashed = true,
  thickness = 3,
  animated = true,
  label,
  style = 'dashed',
}) => {
  // Calculate the line properties
  const dx = endPos.x - startPos.x;
  const dy = endPos.y - startPos.y;
  const length = Math.sqrt(dx * dx + dy * dy);
  const angle = Math.atan2(dy, dx) * (180 / Math.PI);

  // Calculate center position for potential label or interaction point
  const centerX = startPos.x + dx / 2;
  const centerY = startPos.y + dy / 2;

  // Ensure minimum length to prevent rendering issues
  const minLength = 20;
  const renderLength = Math.max(length, minLength);

  // Get line style based on the style prop
  const getLineStyle = () => {
    switch (style) {
      case 'solid':
        return {};
      case 'dashed':
        return {
          backgroundImage: `linear-gradient(to right, ${color} 50%, transparent 50%)`,
          backgroundSize: '15px 100%',
          backgroundRepeat: 'repeat-x',
        };
      case 'dotted':
        return {
          backgroundImage: `linear-gradient(to right, ${color} 25%, transparent 25%)`,
          backgroundSize: '8px 100%',
          backgroundRepeat: 'repeat-x',
        };
      case 'zigzag':
        return {
          clipPath: 'polygon(0 0, 5% 100%, 10% 0, 15% 100%, 20% 0, 25% 100%, 30% 0, 35% 100%, 40% 0, 45% 100%, 50% 0, 55% 100%, 60% 0, 65% 100%, 70% 0, 75% 100%, 80% 0, 85% 100%, 90% 0, 95% 100%, 100% 0)',
        };
      default:
        return {
          backgroundImage: `linear-gradient(to right, ${color} 50%, transparent 50%)`,
          backgroundSize: '15px 100%',
          backgroundRepeat: 'repeat-x',
        };
    }
  };

  return (
    <div
      className="absolute pointer-events-none z-0 connection-line"
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
          width: `${renderLength}px`,
          height: `${thickness}px`,
          backgroundColor: color,
          transformOrigin: '0 50%',
          transform: `translate(${startPos.x}px, ${startPos.y}px) rotate(${angle}deg)`,
          opacity: 0.9,
          ...getLineStyle(),
          boxShadow: '0 1px 2px rgba(0,0,0,0.2)',
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
          boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
        }}
      />

      {/* Label */}
      {label && (
        <div
          className="absolute bg-white font-handwriting text-black text-xs px-2 py-1 rounded z-10 transform -translate-y-1/2 border border-black/10 shadow-md"
          style={{
            left: `${centerX}px`,
            top: `${centerY}px`,
            transform: 'translate(-50%, -50%)',
            whiteSpace: 'nowrap',
            fontWeight: 'bold',
            pointerEvents: 'auto',
            cursor: 'pointer',
          }}
        >
          {label}
        </div>
      )}
    </div>
  );
};
