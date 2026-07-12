'use client';
import { motion } from 'framer-motion';
import { useMemo } from 'react';

export default function SakuraFall({ count = 15 }) {
  const petals = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      left: Math.random() * 100, // позиция по X
      delay: Math.random() * 5, // задержка старта
      duration: 8 + Math.random() * 6, // длительность падения
      size: 20 + Math.random() * 20, // размер лепестка
      rotate: Math.random() * 360 // начальный угол
    }));
  }, [count]);

  return (
    <div className='pointer-events-none absolute inset-0 z-50'>
      <div className='pointer-events-none absolute inset-0 overflow-hidden'>
        {petals.map((p) => (
          <motion.img
            key={p.id}
            animate={{
              y: ['-10vh', '110vh'],
              x: [`${p.left}vw`, `${p.left + Math.sin(p.left) * 10}vw`],
              rotate: [p.rotate, p.rotate + 360],
              opacity: [0.8, 1, 0.6]
            }}
            initial={{
              y: '-10vh',
              x: `${p.left}vw`,
              rotate: p.rotate,
              opacity: 0
            }}
            style={{
              position: "absolute",
              width: 46,
              height: 'auto'
            }}
            alt='sakura petal'
            src='/petal.png'
            transition={{
              repeat: Infinity,
              repeatType: 'loop',
              duration: p.duration,
              delay: p.delay,
              ease: 'linear'
            }}
          />
        ))}
      </div>
    </div>
  );
}
