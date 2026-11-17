import React, { useRef, useState } from 'react';
import { motion, useScroll, useSpring, useTransform } from 'motion/react';

export function DivLogoBadge({ size = 40 }: { size?: number }) {
  return (
    <div
      style={{ width: size, height: size }}
      className="relative flex shrink-0 items-center justify-center rounded-full border-2 border-[#DAB24C] bg-[#F8ECAB] shadow-sm"
      aria-hidden="true"
    >
      <div className="flex h-[78%] w-[78%] items-center justify-center rounded-full border border-[#DAB24C]/80 bg-[#0A0A08]">
        <span
          className="font-display font-bold tracking-tight text-[#DAB24C]"
          style={{ fontSize: Math.max(9, Math.round(size * 0.25)) }}
        >
          &lt;
          <span className="text-[#F8ECAB]">div</span>
          &gt;
        </span>
      </div>
    </div>
  );
}

// Deterministic crisp QR pattern matching the PDF credential cards
const QR_GRID = [
  '111111101010101111111',
  '100000100110001000001',
  '101110101101101011101',
  '101110101010101011101',
  '101110100111001011101',
  '100000101000101000001',
  '111111101010101111111',
  '000000001101000000000',
  '101101110010110110101',
  '010010011101001001010',
  '110110101011011101101',
  '001001010100100110010',
  '101110111010110101111',
  '000000001011001010001',
  '111111101100101101101',
  '100000100110100010110',
  '101110101011111101001',
  '101110101100101011110',
  '101110100111011100101',
  '100000101001000101010',
  '111111101110110110111',
];

export function QrCodeSvg({ size = 96 }: { size?: number }) {
  const cells = QR_GRID.length;
  return (
    <div
      style={{ width: size, height: size }}
      className="shrink-0 rounded-md bg-[#F8ECAB] p-1.5"
      aria-label="Preview credential QR code"
    >
      <svg
        viewBox={`0 0 ${cells} ${cells}`}
        className="h-full w-full"
        shapeRendering="crispEdges"
      >
        {QR_GRID.map((row, y) =>
          row
            .split('')
            .map((val, x) =>
              val === '1' ? (
                <rect
                  key={`${x}-${y}`}
                  x={x}
                  y={y}
                  width={1}
                  height={1}
                  fill="#0A0A08"
                />
              ) : null,
            ),
        )}
      </svg>
    </div>
  );
}

interface MembershipCard3DProps {
  name?: string;
  divId?: string;
  compact?: boolean;
}

export function MembershipCard3D({
  name = 'Your name here',
  divId = 'DIV-DEMO-0001',
  compact = false,
}: MembershipCard3DProps) {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0, gx: 50, gy: 50 });

  const handleMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    setTilt({
      rx: (0.5 - py) * 14,
      ry: (px - 0.5) * 16,
      gx: px * 100,
      gy: py * 100,
    });
  };

  const handleLeave = () => {
    setTilt({ rx: 0, ry: 0, gx: 50, gy: 50 });
  };

  return (
    <div className="perspective-1200 w-full">
      <div
        ref={cardRef}
        onPointerMove={handleMove}
        onPointerLeave={handleLeave}
        style={{
          transform: `rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`,
          transition: 'transform 180ms cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        className={`preserve-3d relative overflow-hidden rounded-xl border border-[#DAB24C]/45 bg-[#0C0C0A] shadow-2xl ${
          compact ? 'p-5' : 'p-6 sm:p-7'
        }`}
      >
        {/* Dynamic cursor specular sheen */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            background: `radial-gradient(circle at ${tilt.gx}% ${tilt.gy}%, rgba(248, 236, 171, 0.22), transparent 55%)`,
          }}
        />

        <div className="relative z-10 flex items-start justify-between gap-4">
          <div>
            <p className="font-mono text-[11px] tracking-[0.18em] text-[#9E967C] uppercase">
              DIV / THE TECH CLUB
            </p>
            <h3
              className={`mt-5 font-display font-semibold tracking-tight text-[#F8ECAB] ${
                compact ? 'text-xl' : 'text-2xl'
              }`}
            >
              {name.trim() || 'Your name here'}
            </h3>
            <p className="mt-1 font-mono text-xs tracking-wider text-[#DAB24C] tabular-nums">
              {divId}
            </p>
          </div>
          <DivLogoBadge size={42} />
        </div>

        <div className="relative z-10 mt-6 flex items-end justify-between gap-4">
          <div>
            <p className="font-mono text-[11px] tracking-[0.14em] text-[#C4BC9E] uppercase">
              STUDENT MEMBER
            </p>
            <p className="mt-1 text-xs text-[#8D856C]">
              Preview only · Not a valid credential
            </p>
          </div>
          <QrCodeSvg size={compact ? 74 : 88} />
        </div>
      </div>
    </div>
  );
}

export function ScrollProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 180,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      style={{ scaleX }}
      aria-hidden="true"
      className="pointer-events-none fixed top-0 right-0 left-0 z-50 h-[2px] origin-left bg-gradient-to-r from-[#DAB24C] via-[#F8ECAB] to-[#DAB24C]"
    />
  );
}

export function ScrollReveal3D({
  children,
  className = '',
  delay = 0,
  direction = 'up',
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: 'up' | 'left' | 'right' | 'scale';
}) {
  const initialMap = {
    up: { opacity: 0, y: 40, rotateX: 9, scale: 0.97 },
    left: { opacity: 0, x: -36, rotateY: 8, scale: 0.98 },
    right: { opacity: 0, x: 36, rotateY: -8, scale: 0.98 },
    scale: { opacity: 0, scale: 0.92, rotateX: 6 },
  };

  return (
    <motion.div
      initial={initialMap[direction]}
      whileInView={{ opacity: 1, x: 0, y: 0, rotateX: 0, rotateY: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{
        duration: 0.72,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
      style={{ transformPerspective: 1200 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function ScrollStaggerItem({
  children,
  index = 0,
  className = '',
  direction = 'up',
}: {
  children: React.ReactNode;
  index?: number;
  className?: string;
  direction?: 'up' | 'left' | 'scale';
}) {
  const delay = Math.min(index * 0.085, 0.45);
  const initialMap = {
    up: { opacity: 0, y: 34, rotateX: 10, scale: 0.96 },
    left: { opacity: 0, x: -28, rotateY: 6, scale: 0.98 },
    scale: { opacity: 0, scale: 0.9, rotateX: 8 },
  };

  return (
    <motion.div
      initial={initialMap[direction]}
      whileInView={{ opacity: 1, x: 0, y: 0, rotateX: 0, rotateY: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.14 }}
      transition={{
        duration: 0.65,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
      style={{ transformPerspective: 1100 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function ScrollParallaxFrame({
  children,
  className = '',
  offsetY = 24,
  zoom = false,
}: {
  children: React.ReactNode;
  className?: string;
  offsetY?: number;
  zoom?: boolean;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const y = useTransform(scrollYProgress, [0, 1], [offsetY, -offsetY]);
  const scale = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    zoom ? [1.08, 1.01, 1.06] : [1, 1, 1],
  );

  return (
    <div ref={ref} className={className}>
      <motion.div style={{ y, scale }} className="h-full w-full will-change-transform">
        {children}
      </motion.div>
    </div>
  );
}
