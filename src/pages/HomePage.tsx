import React, { useRef } from 'react';
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'motion/react';
import { useDiv } from '../context/DivContext';
import { HeroOrbitScene } from '../components/3d/HeroOrbitScene';
import {
  MembershipCard3D,
  ScrollParallaxFrame,
  ScrollReveal3D,
  ScrollStaggerItem,
} from '../components/ui/DivBrandMark';
import { AnimatedFooter } from '../components/ui/AnimatedFooter';
import { EVENTS_DATA, GALLERY_ITEMS, LEADERSHIP_TEAM } from '../data/divData';

const HERO_LINES = [
  { text: 'DIVE INTO', isGold: false },
  { text: 'VISION.', isGold: true },
] as const;

function HeroHeadline3D() {
  const containerRef = useRef<HTMLHeadingElement | null>(null);
  const prefersReducedMotion = useReducedMotion();

  const tiltX = useSpring(0, { stiffness: 160, damping: 20 });
  const tiltY = useSpring(0, { stiffness: 160, damping: 20 });

  const handlePointerMove = (e: React.PointerEvent<HTMLHeadingElement>) => {
    if (prefersReducedMotion || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    tiltX.set(-py * 16);
    tiltY.set(px * 18);
  };

  const handlePointerLeave = () => {
    tiltX.set(0);
    tiltY.set(0);
  };

  let runningIndex = 0;

  return (
    <h1
      ref={containerRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      aria-label="DIVE INTO VISION."
      className="perspective-1200 cursor-default select-none font-display text-[3.35rem] leading-[0.92] font-bold tracking-[-0.03em] sm:text-7xl lg:text-[4.85rem] xl:text-[6rem]"
    >
      <motion.span
        style={
          prefersReducedMotion
            ? undefined
            : {
                rotateX: tiltX,
                rotateY: tiltY,
                transformStyle: 'preserve-3d',
              }
        }
        className="preserve-3d block"
      >
        {HERO_LINES.map((line) => (
          <span
            key={line.text}
            aria-hidden="true"
            className="preserve-3d block whitespace-nowrap"
          >
            {line.text.split('').map((char, idx) => {
              const globalIdx = runningIndex++;
              if (char === ' ') {
                return (
                  <span key={`sp-${idx}`} className="inline-block w-[0.26em]">
                    {' '}
                  </span>
                );
              }

              const extrudeShadow = line.isGold
                ? '0 1px 0 #b88a22, 0 2px 0 #996f16, 0 3px 0 #7b570d, 0 4px 0 #5f4106, 0 5px 0 #452e03, 0 6px 0 #2e1e01, 0 16px 32px rgba(0,0,0,0.78), 0 0 38px rgba(218,178,76,0.28)'
                : '0 1px 0 #c99d34, 0 2px 0 #ad8221, 0 3px 0 #8d6714, 0 4px 0 #6f4f0b, 0 5px 0 #533a05, 0 14px 28px rgba(0,0,0,0.72), 0 0 32px rgba(248,236,171,0.18)';

              return (
                <motion.span
                  key={`${line.text}-${idx}`}
                  initial={
                    prefersReducedMotion
                      ? false
                      : {
                          opacity: 0,
                          y: 30,
                          rotateX: -85,
                          rotateY: 16,
                          scale: 0.88,
                        }
                  }
                  animate={{
                    opacity: 1,
                    y: 0,
                    rotateX: 0,
                    rotateY: 0,
                    scale: 1,
                  }}
                  transition={{
                    duration: 0.72,
                    delay: 0.04 * globalIdx,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="preserve-3d inline-block"
                >
                  <motion.span
                    animate={
                      prefersReducedMotion
                        ? undefined
                        : {
                            rotateX: [3, -3, 3],
                            rotateY: [-7, 7, -7],
                            y: [-3, 3, -3],
                          }
                    }
                    whileHover={
                      prefersReducedMotion
                        ? undefined
                        : {
                            y: -8,
                            rotateX: -12,
                            rotateY: 10,
                            scale: 1.08,
                            color: '#FFF6CE',
                            transition: { duration: 0.22, ease: 'easeOut' },
                          }
                    }
                    transition={
                      prefersReducedMotion
                        ? undefined
                        : {
                            duration: 4.4,
                            repeat: Infinity,
                            ease: 'easeInOut',
                            delay: globalIdx * 0.14,
                          }
                    }
                    style={{
                      textShadow: extrudeShadow,
                      transformOrigin: 'center center -18px',
                    }}
                    className={`preserve-3d inline-block will-change-transform ${
                      line.isGold ? 'text-[#DAB24C]' : 'text-[#F8ECAB]'
                    }`}
                  >
                    {char}
                  </motion.span>
                </motion.span>
              );
            })}
          </span>
        ))}
      </motion.span>
    </h1>
  );
}

export function HomePage() {
  const { navigate, scrollToElement, clubs, setActiveModal } = useDiv();
  const heroRef = useRef<HTMLElement | null>(null);
  const marqueeRef = useRef<HTMLDivElement | null>(null);

  const { scrollYProgress: heroScroll } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const heroTextY = useTransform(heroScroll, [0, 1], [0, -44]);
  const heroTextOpacity = useTransform(heroScroll, [0, 0.85], [1, 0.55]);
  const heroOrbitY = useTransform(heroScroll, [0, 1], [0, 36]);
  const heroOrbitScale = useTransform(heroScroll, [0, 1], [1, 0.95]);

  const { scrollYProgress: marqueeScroll } = useScroll({
    target: marqueeRef,
    offset: ['start end', 'end start'],
  });
  const marqueeShiftX = useTransform(marqueeScroll, [0, 1], [0, -140]);

  const featuredEvents = EVENTS_DATA.slice(0, 3);
  const featuredGallery = GALLERY_ITEMS.slice(0, 3);
  const featuredLeaders = LEADERSHIP_TEAM.slice(0, 3);

  return (
    <div className="bg-[#080807] text-[#F5ECCD]">
      {/* Page 2: Hero Section with Full 3D Orbital Core */}
      <section
        ref={heroRef}
        className="relative overflow-hidden bg-[#080807] pt-8 pb-10 sm:pt-12 sm:pb-14"
      >
        <div className="mx-auto max-w-[1360px] px-5 sm:px-8">
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12">
            {/* Left Typography & Actions */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              style={{ y: heroTextY, opacity: heroTextOpacity }}
              className="lg:col-span-6"
            >
              <HeroHeadline3D />

              <p className="mt-7 font-mono text-sm font-semibold tracking-[0.14em] text-[#DAB24C] uppercase">
                BUILD. INNOVATE. INSPIRE.
              </p>

              <p className="mt-4 max-w-xl text-base leading-relaxed text-[#E5DEC0] sm:text-lg">
                A student-driven technology ecosystem where creativity,
                innovation, leadership and collaboration come together.
              </p>

              <div className="mt-9 flex flex-wrap items-center gap-4">
                <button
                  type="button"
                  onClick={() => scrollToElement('div-ecosystem')}
                  className="rounded-lg bg-[#DAB24C] px-6 py-3.5 text-sm font-semibold text-[#080807] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#E5C05E] focus-visible:outline-2 focus-visible:outline-[#F8ECAB]"
                >
                  Explore DIV ↗
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/join')}
                  className="rounded-lg border border-[#DAB24C]/45 px-6 py-3.5 text-sm font-medium text-[#F8ECAB] transition-all duration-200 hover:-translate-y-0.5 hover:border-[#DAB24C] hover:bg-[#141411] focus-visible:outline-2 focus-visible:outline-[#DAB24C]"
                >
                  Become a Member
                </button>
              </div>
            </motion.div>

            {/* Right Interactive 3D Three.js Orbital Scene */}
            <motion.div
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
              style={{ y: heroOrbitY, scale: heroOrbitScale }}
              className="relative lg:col-span-6"
            >
              <div className="relative mx-auto h-[380px] w-full max-w-[580px] sm:h-[460px] lg:h-[520px]">
                <HeroOrbitScene variant="hero" className="h-full w-full" />
                <div className="pointer-events-none absolute top-4 left-4 font-mono text-lg text-[#DAB24C]/70">
                  {'{ }'}
                </div>
                <div className="pointer-events-none absolute right-6 bottom-12 font-mono text-base text-[#DAB24C]/70">
                  &lt;/div&gt;
                </div>
              </div>
              <p className="mt-2 text-center font-mono text-[11px] tracking-[0.18em] text-[#9E967C] uppercase">
                THE TECH CLUB · DIV
              </p>
            </motion.div>
          </div>

          {/* Hero Bottom Strip */}
          <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-white/15 pt-5">
            <p className="font-mono text-xs tracking-[0.14em] text-[#9E967C] uppercase">
              FIND YOUR PEOPLE. BUILD YOUR NEXT.
            </p>
            <button
              type="button"
              onClick={() => scrollToElement('div-ecosystem')}
              className="font-mono text-xs tracking-[0.14em] text-[#C4BC9E] uppercase transition-colors hover:text-[#DAB24C]"
            >
              SCROLL TO DISCOVER ↓
            </button>
          </div>
        </div>
      </section>

      {/* Page 1 Top Statement Marquee Band (Scroll-reactive speed boost) */}
      <div
        ref={marqueeRef}
        className="overflow-hidden border-y border-[#0D0D0B]/15 bg-[#DAB24C] py-3.5 text-[#080807]"
      >
        <motion.div style={{ x: marqueeShiftX }}>
          <div className="animate-div-marquee items-center gap-8 font-display text-sm font-bold tracking-[0.12em] uppercase sm:text-base">
            <span>BUILD WITH PURPOSE.</span>
            <span aria-hidden="true">·</span>
            <span>THINK BEYOND LIMITS.</span>
            <span aria-hidden="true">·</span>
            <span>GROW TOGETHER.</span>
            <span aria-hidden="true">·</span>
            <span>BUILD WITH PURPOSE.</span>
            <span aria-hidden="true">·</span>
            <span>THINK BEYOND LIMITS.</span>
            <span aria-hidden="true">·</span>
            <span>GROW TOGETHER.</span>
            <span aria-hidden="true">·</span>
            <span>BUILD WITH PURPOSE.</span>
            <span aria-hidden="true">·</span>
            <span>THINK BEYOND LIMITS.</span>
            <span aria-hidden="true">·</span>
            <span>GROW TOGETHER.</span>
            <span aria-hidden="true">·</span>
            <span>BUILD WITH PURPOSE.</span>
            <span aria-hidden="true">·</span>
            <span>THINK BEYOND LIMITS.</span>
            <span aria-hidden="true">·</span>
            <span>GROW TOGETHER.</span>
          </div>
        </motion.div>
      </div>

      {/* Section 01: The DIV Ecosystem (Warm Cream) */}
      <section
        id="div-ecosystem"
        className="bg-[#F8ECAB] py-20 text-[#0D0D0B] sm:py-24"
      >
        <div className="mx-auto max-w-[1360px] px-5 sm:px-8">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
            <ScrollReveal3D direction="left" className="lg:col-span-6">
              <p className="font-mono text-xs font-medium tracking-[0.14em] text-[#6B5A23] uppercase">
                01 · THE DIV ECOSYSTEM
              </p>
              <h2 className="mt-4 font-display text-4xl leading-[1.08] font-bold tracking-tight text-[#0D0D0B] sm:text-5xl">
                Not just a club.
                <br />A place to become.
              </h2>
              <p className="mt-6 text-base font-medium leading-relaxed text-[#1F1D16] sm:text-lg">
                Some ideas need a workshop. Others need a stage.
                <br />
                At DIV, there is room for both.
              </p>
              <p className="mt-4 max-w-xl text-sm leading-relaxed text-[#3D392B] sm:text-base">
                We bring technology, creativity, leadership and collaboration
                into one student-led ecosystem. Learn by doing, find a team
                and turn curiosity into something that matters.
              </p>
              <button
                type="button"
                onClick={() => navigate('/about')}
                className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-[#0D0D0B] underline decoration-[#0D0D0B]/30 underline-offset-4 transition-colors hover:decoration-[#0D0D0B]"
              >
                Get to know DIV ↗
              </button>
            </ScrollReveal3D>

            <ScrollReveal3D direction="right" delay={0.08} className="lg:col-span-6">
              <div className="group overflow-hidden rounded-xl border border-[#0D0D0B]/15 bg-[#11110E] shadow-xl">
                <ScrollParallaxFrame offsetY={18} zoom>
                  <img
                    src="/images/collab-laptop.jpg"
                    alt="Students collaborating together around a laptop"
                    referrerPolicy="no-referrer"
                    className="aspect-[16/10] w-full object-cover grayscale transition-transform duration-700 group-hover:scale-[1.03]"
                  />
                </ScrollParallaxFrame>
              </div>
              <p className="mt-2.5 font-mono text-[11px] text-[#5B5237]">
                Illustrative photo · Replace with DIV photography
              </p>
            </ScrollReveal3D>
          </div>

          {/* 3 Metrics Row */}
          <div className="mt-16 grid grid-cols-1 gap-8 border-t border-[#0D0D0B]/20 pt-10 sm:grid-cols-3">
            <ScrollStaggerItem
              index={0}
              className="flex items-baseline gap-4 border-b border-[#0D0D0B]/15 pb-4 sm:border-b-0 sm:pb-0"
            >
              <span className="font-display text-3xl font-bold text-[#0D0D0B] tabular-nums">
                05
              </span>
              <span className="text-sm text-[#3D392B]">
                Clubs. One shared vision.
              </span>
            </ScrollStaggerItem>
            <ScrollStaggerItem
              index={1}
              className="flex items-baseline gap-4 border-b border-[#0D0D0B]/15 pb-4 sm:border-b-0 sm:pb-0"
            >
              <span className="font-display text-3xl font-bold text-[#0D0D0B] tabular-nums">
                01
              </span>
              <span className="text-sm text-[#3D392B]">
                Student-driven ecosystem.
              </span>
            </ScrollStaggerItem>
            <ScrollStaggerItem index={2} className="flex items-baseline gap-4">
              <span className="font-display text-3xl font-bold text-[#0D0D0B]">
                ∞
              </span>
              <span className="text-sm text-[#3D392B]">
                Ways to make a difference.
              </span>
            </ScrollStaggerItem>
          </div>
        </div>
      </section>

      {/* Section 02: Five Clubs, One Shared Ambition (Dark Obsidian) */}
      <section className="bg-[#080807] py-20 sm:py-24">
        <div className="mx-auto max-w-[1360px] px-5 sm:px-8">
          <ScrollReveal3D>
            <p className="font-mono text-xs font-medium tracking-[0.14em] text-[#DAB24C] uppercase">
              02 · FIND YOUR PEOPLE
            </p>
            <div className="mt-3 flex flex-col justify-between gap-4 md:flex-row md:items-end">
              <h2 className="font-display text-4xl leading-[1.08] font-bold tracking-tight text-[#F8ECAB] sm:text-5xl">
                Five clubs.
                <br />
                One shared ambition.
              </h2>
              <div className="flex flex-col items-start md:items-end">
                <p className="text-sm text-[#C4BC9E]">
                  A space for every kind of curious.
                </p>
                <button
                  type="button"
                  onClick={() => navigate('/clubs')}
                  className="mt-2 text-sm font-medium text-[#DAB24C] transition-colors hover:text-[#F8ECAB]"
                >
                  Explore all clubs ↗
                </button>
              </div>
            </div>
          </ScrollReveal3D>

          <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {clubs.map((club, idx) => (
              <ScrollStaggerItem key={club.id} index={idx} className="flex">
                <article
                  onClick={() => navigate(`/clubs/${club.id}`)}
                  className="group flex w-full cursor-pointer flex-col justify-between rounded-xl border border-[#DAB24C]/25 bg-[#11110E] p-7 transition-all duration-200 hover:-translate-y-1 hover:border-[#DAB24C]/70"
                >
                  <div>
                    <div className="flex items-center gap-2 font-mono text-xs text-[#9E967C]">
                      <span className="tabular-nums">{club.index}</span>
                      <span aria-hidden="true">·</span>
                      <span className="text-[#DAB24C]">{club.symbol}</span>
                    </div>
                    <h3 className="mt-4 font-display text-xl font-bold text-[#F8ECAB] transition-colors group-hover:text-[#DAB24C]">
                      {club.homeTitle}
                    </h3>
                    <p className="mt-2 text-sm text-[#E5DEC0]">
                      {club.homeTagline}
                    </p>
                    <p className="mt-4 text-xs text-[#9E967C]">
                      {club.tags.join(' · ')}
                    </p>
                    <p className="mt-2 text-xs text-[#7E765F]">
                      Leader · {club.leader}
                    </p>
                  </div>

                  <span className="mt-7 inline-flex items-center gap-1.5 text-sm font-medium text-[#DAB24C] group-hover:text-[#F8ECAB]">
                    Explore Club ↗
                  </span>
                </article>
              </ScrollStaggerItem>
            ))}

            {/* 6th Card: Become a Member Cream CTA */}
            <ScrollStaggerItem index={5} className="flex">
              <div
                onClick={() => navigate('/join')}
                className="group flex w-full cursor-pointer flex-col justify-between rounded-xl bg-[#F8ECAB] p-7 text-[#0D0D0B] transition-all duration-200 hover:-translate-y-1 hover:bg-[#EFE3A2]"
              >
                <h3 className="font-display text-2xl leading-tight font-bold">
                  Your interests.
                  <br />
                  Your people.
                  <br />
                  Your next move.
                </h3>
                <span className="mt-8 inline-flex items-center gap-1.5 text-sm font-semibold text-[#0D0D0B]">
                  Become a member ↗
                </span>
              </div>
            </ScrollStaggerItem>
          </div>
        </div>
      </section>

      {/* Section 03: What's Next / Events Preview (Warm Cream) */}
      <section className="bg-[#F8ECAB] py-20 text-[#0D0D0B] sm:py-24">
        <div className="mx-auto max-w-[1360px] px-5 sm:px-8">
          <ScrollReveal3D>
            <p className="font-mono text-xs font-medium tracking-[0.14em] text-[#6B5A23] uppercase">
              03 · WHAT’S NEXT
            </p>
            <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
              <h2 className="font-display text-4xl font-bold tracking-tight text-[#0D0D0B] sm:text-5xl">
                Big ideas. Real experiences.
              </h2>
              <button
                type="button"
                onClick={() => navigate('/events')}
                className="text-sm font-semibold text-[#0D0D0B] transition-opacity hover:opacity-75"
              >
                View all events ↗
              </button>
            </div>
          </ScrollReveal3D>

          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
            {featuredEvents.map((ev, idx) => (
              <ScrollStaggerItem key={ev.id} index={idx} className="flex">
                <article
                  onClick={() => navigate(`/events/${ev.id}`)}
                  className="group flex w-full cursor-pointer flex-col overflow-hidden rounded-xl border border-[#0D0D0B]/15 bg-[#0A0A08] text-[#F5ECCD] transition-all duration-200 hover:-translate-y-1"
                >
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#141411]">
                    {ev.image && (
                      <ScrollParallaxFrame offsetY={12} zoom className="h-full w-full">
                        <img
                          src={ev.image}
                          alt={ev.title}
                          referrerPolicy="no-referrer"
                          className="h-full w-full object-cover grayscale transition-transform duration-700 group-hover:scale-105"
                        />
                      </ScrollParallaxFrame>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col justify-between p-6">
                    <div>
                      <p className="font-mono text-[11px] tracking-[0.12em] text-[#DAB24C] uppercase">
                        {ev.homeKicker}
                      </p>
                      <h3 className="mt-3 font-display text-2xl font-bold text-[#F8ECAB] transition-colors group-hover:text-[#DAB24C]">
                        {ev.title}
                      </h3>
                      <p className="mt-3 text-xs text-[#9E967C]">
                        {ev.shortDescription}
                      </p>
                    </div>
                    <span className="mt-7 inline-flex items-center gap-1.5 text-sm font-medium text-[#DAB24C]">
                      Explore event ↗
                    </span>
                  </div>
                </article>
              </ScrollStaggerItem>
            ))}
          </div>

          <ScrollReveal3D delay={0.1}>
            <p className="mt-6 font-mono text-xs text-[#5B5237]">
              Concept event previews · Dates, venues and registrations require
              confirmation. Photography is illustrative.
            </p>
          </ScrollReveal3D>
        </div>
      </section>

      {/* Section 04: The People Behind the Vision (Dark Obsidian) */}
      <section className="border-b border-white/10 bg-[#080807] py-20 sm:py-24">
        <div className="mx-auto max-w-[1360px] px-5 sm:px-8">
          <ScrollReveal3D>
            <p className="font-mono text-xs font-medium tracking-[0.14em] text-[#DAB24C] uppercase">
              04 · THE PEOPLE BEHIND THE VISION
            </p>
            <h2 className="mt-3 font-display text-4xl font-bold tracking-tight text-[#F8ECAB] sm:text-5xl">
              Student-led. Purpose-driven.
            </h2>
          </ScrollReveal3D>

          <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-3">
            {featuredLeaders.map((leader, idx) => (
              <ScrollStaggerItem key={leader.index} index={idx}>
                <div className="h-full rounded-xl border border-white/10 bg-[#11110E] p-7">
                  <p className="font-mono text-[11px] tracking-[0.14em] text-[#DAB24C] uppercase">
                    {leader.index} · LEADERSHIP
                  </p>
                  <h3 className="mt-4 font-display text-2xl font-bold text-[#F8ECAB]">
                    {leader.role}
                  </h3>
                  <p className="mt-2 text-sm text-[#9E967C]">
                    Name &amp; portrait to be confirmed
                  </p>
                </div>
              </ScrollStaggerItem>
            ))}
          </div>

          <ScrollReveal3D delay={0.12}>
            <button
              type="button"
              onClick={() => navigate('/team')}
              className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-[#DAB24C] transition-colors hover:text-[#F8ECAB]"
            >
              Meet the DIV team ↗
            </button>
          </ScrollReveal3D>
        </div>
      </section>

      {/* Section 05: In The Moment / Gallery Preview (Dark Obsidian) */}
      <section className="bg-[#080807] py-20 sm:py-24">
        <div className="mx-auto max-w-[1360px] px-5 sm:px-8">
          <ScrollReveal3D>
            <p className="font-mono text-xs font-medium tracking-[0.14em] text-[#DAB24C] uppercase">
              05 · IN THE MOMENT
            </p>
            <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
              <h2 className="font-display text-4xl font-bold tracking-tight text-[#F8ECAB] sm:text-5xl">
                The energy is real.
              </h2>
              <button
                type="button"
                onClick={() => navigate('/gallery')}
                className="text-sm font-medium text-[#DAB24C] transition-colors hover:text-[#F8ECAB]"
              >
                Enter the gallery ↗
              </button>
            </div>
          </ScrollReveal3D>

          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
            {[
              {
                item: featuredGallery[0],
                label: 'Community in motion',
              },
              {
                item: featuredGallery[1],
                label: 'Learning, side by side',
              },
              {
                item: featuredGallery[2],
                label: 'A different perspective',
              },
            ].map(({ item, label }, idx) => (
              <ScrollStaggerItem key={item.id} index={idx}>
                <button
                  type="button"
                  onClick={() => setActiveModal({ type: 'lightbox', item })}
                  className="group w-full text-left focus-visible:outline-2 focus-visible:outline-[#DAB24C]"
                >
                  <div className="overflow-hidden rounded-xl border border-white/10 bg-[#11110E]">
                    {item.image && (
                      <ScrollParallaxFrame offsetY={12} zoom>
                        <img
                          src={item.image}
                          alt={label}
                          referrerPolicy="no-referrer"
                          className="aspect-[16/10] w-full object-cover grayscale transition-transform duration-700 group-hover:scale-105"
                        />
                      </ScrollParallaxFrame>
                    )}
                  </div>
                  <p className="mt-3 text-sm font-medium text-[#E5DEC0] transition-colors group-hover:text-[#DAB24C]">
                    {label}
                  </p>
                </button>
              </ScrollStaggerItem>
            ))}
          </div>

          <ScrollReveal3D delay={0.1}>
            <p className="mt-4 font-mono text-xs text-[#7E765F]">
              Illustrative photography · Original DIV photos and videos to be
              added
            </p>
          </ScrollReveal3D>
        </div>
      </section>

      {/* Section 06: Your Next Chapter CTA + 3D Interactive Membership Card */}
      <section className="bg-[#F8ECAB] py-20 text-[#0D0D0B] sm:py-24">
        <div className="mx-auto max-w-[1360px] px-5 sm:px-8">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
            <ScrollReveal3D direction="left" className="lg:col-span-6">
              <p className="font-mono text-xs font-medium tracking-[0.14em] text-[#6B5A23] uppercase">
                YOUR NEXT CHAPTER · DIV
              </p>
              <h2 className="mt-4 font-display text-4xl leading-[1.06] font-bold tracking-tight text-[#0D0D0B] sm:text-5xl">
                Don’t just watch
                <br />
                the future. Build it.
              </h2>
              <p className="mt-5 text-base text-[#3D392B]">
                Find a club. Make a connection. Start something.
              </p>
              <button
                type="button"
                onClick={() => navigate('/join')}
                className="mt-8 rounded-lg bg-[#DAB24C] px-7 py-3.5 text-sm font-semibold text-[#080807] shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#C99F38] focus-visible:outline-2 focus-visible:outline-[#0D0D0B]"
              >
                Become a Member ↗
              </button>
            </ScrollReveal3D>

            <ScrollReveal3D direction="right" delay={0.08} className="lg:col-span-6">
              <ScrollParallaxFrame offsetY={16}>
                <MembershipCard3D />
              </ScrollParallaxFrame>
            </ScrollReveal3D>
          </div>
        </div>
      </section>

      {/* Cinematic ASCII Scroll Reveal Showcase */}
      <div className="h-[380px] w-full bg-[#080807] sm:h-[460px] lg:h-[520px]">
        <AnimatedFooter
          headingLines={['DIVE INTO', 'VISION.']}
          leftImage="/images/div-seal.jpg"
          rightImage="/images/div-seal.jpg"
          background="#080807"
          textColor="#F8ECAB"
          charColor="#8E6C1E"
          hoverColor="#DAB24C"
          hoverCharColor="#080807"
          columns={64}
          cellSize={14}
          fontSize={13}
          parallaxStrength={22}
          hoverRadius={7}
          revealOnScroll
        />
      </div>
    </div>
  );
}
