import React, { useMemo } from 'react';

interface Props {
  text?: string;
  opacity?: number; // 0..1
}

// Subtle, repeating diagonal watermark using an SVG pattern so it doesn't block UI
const ClassifiedWatermark: React.FC<Props> = ({ text = 'CLASSIFIED // RESTRICTED', opacity = 0.06 }) => {
  const dataUrl = useMemo(() => {
    const svg = `<?xml version="1.0" encoding="UTF-8"?><svg xmlns='http://www.w3.org/2000/svg' width='600' height='260' viewBox='0 0 600 260'>
      <defs>
        <filter id='glow' x='-50%' y='-50%' width='200%' height='200%'>
          <feGaussianBlur stdDeviation='1.5' result='coloredBlur'/>
          <feMerge>
            <feMergeNode in='coloredBlur'/>
            <feMergeNode in='SourceGraphic'/>
          </feMerge>
        </filter>
      </defs>
      <g transform='rotate(-25 300 130)'>
        <text x='50' y='160' font-size='44' font-family='Rubik,Segoe UI,Arial' font-weight='800' fill='rgb(220,38,38)' fill-opacity='0.8' opacity='0.9' filter='url(#glow)' letter-spacing='6'>${text}</text>
      </g>
    </svg>`;
    return `url("data:image/svg+xml;utf8,${encodeURIComponent(svg)}")`;
  }, [text]);

  return (
    <div className="pointer-events-none fixed inset-0 -z-10" style={{ backgroundImage: dataUrl, backgroundSize: '600px 260px', backgroundRepeat: 'repeat', opacity }} />
  );
};

export default ClassifiedWatermark;
