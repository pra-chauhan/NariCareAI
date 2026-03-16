import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import React, { useRef, useState } from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  tilt?: boolean;
}

const GlassCard = ({ children, className, tilt = false }: GlassCardProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [style, setStyle] = useState({ rotateX: 0, rotateY: 0 });

  const handleMouse = (e: React.MouseEvent) => {
    if (!tilt || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setStyle({ rotateY: x * 8, rotateX: -y * 8 });
  };

  const resetTilt = () => setStyle({ rotateX: 0, rotateY: 0 });

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={resetTilt}
      animate={style}
      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      className={cn('glass-card glass-card-hover p-5', className)}
      style={{ perspective: 1000 }}
    >
      {children}
    </motion.div>
  );
};

export default GlassCard;
