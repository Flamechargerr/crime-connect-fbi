import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props { duration?: number }

const GlitchTransition: React.FC<Props> = ({ duration = 600 }) => {
  const [active, setActive] = useState(false);

  useEffect(() => {
    setActive(true);
    const t = setTimeout(() => setActive(false), duration);
    return () => clearTimeout(t);
  }, [duration]);

  return (
    <AnimatePresence>
      {active && (
        <motion.div 
          initial={{ top: "-20%", opacity: 0 }}
          animate={{ top: "120%", opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.2 } }}
          transition={{ duration: 0.6, ease: "linear" }}
          className="pointer-events-none fixed inset-x-0 z-[9999] h-32 bg-gradient-to-b from-transparent via-cyan-500/10 to-transparent backdrop-blur-[2px]"
          style={{ 
            borderBottom: '1px solid rgba(6, 182, 212, 0.4)', 
            boxShadow: '0 20px 40px -10px rgba(6, 182, 212, 0.3)' 
          }}
        />
      )}
    </AnimatePresence>
  );
};

export default GlitchTransition;
