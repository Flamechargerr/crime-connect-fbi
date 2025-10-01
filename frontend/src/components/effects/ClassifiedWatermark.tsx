import React from 'react';

const ClassifiedWatermark: React.FC<{ text?: string }>=({ text = 'CLASSIFIED // RESTRICTED' })=>{
  return (
    <div className="pointer-events-none fixed inset-0 z-10">
      <div className="absolute inset-0 flex items-center justify-center rotate-[-30deg] opacity-10">
        <span className="text-[8vw] font-extrabold tracking-widest text-red-600 drop-shadow-[0_0_8px_rgba(220,38,38,0.3)] select-none">
          {text}
        </span>
      </div>
    </div>
  );
};

export default ClassifiedWatermark;
