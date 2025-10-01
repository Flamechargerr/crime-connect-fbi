import React, { useEffect, useRef, useState } from 'react';

interface Props {
  text: string;
  speed?: number; // ms per frame
  className?: string;
}

const glyphs = '!@#$%^&*()_+{}[]<>?/\\|~-=•◊▒▓░█øæ¶§µ∆≈™✓✗✦✧✶✹✺0123456789';

export const DecryptText: React.FC<Props> = ({ text, speed = 24, className }) => {
  const [display, setDisplay] = useState('');
  const [done, setDone] = useState(false);
  const iRef = useRef(0);

  useEffect(() => {
    setDisplay('');
    setDone(false);
    iRef.current = 0;
    const id = setInterval(() => {
      const i = iRef.current;
      if (i >= text.length) {
        clearInterval(id);
        setDone(true);
        return;
      }
      // Build a string where characters up to i are real, rest are noisy glyphs
      const settled = text.slice(0, i + 1);
      const remain = text.slice(i + 1).split('').map((ch) => (ch === ' ' ? ' ' : glyphs[Math.floor(Math.random() * glyphs.length)])).join('');
      setDisplay(settled + remain);
      iRef.current += 1;
    }, speed);
    return () => clearInterval(id);
  }, [text, speed]);

  return (
    <span className={className} aria-label={text} title={text}>
      {display}
      {!done && <span className="ml-0.5 inline-block w-2 h-4 bg-primary/70 animate-type-blink" />}
    </span>
  );
};

export default DecryptText;
