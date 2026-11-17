import React from 'react';
import { useDiv } from '../context/DivContext';
import {
  ScrollParallaxFrame,
  ScrollReveal3D,
  ScrollStaggerItem,
} from '../components/ui/DivBrandMark';

const VALUES = [
  {
    index: '01',
    title: 'Curiosity',
    desc: 'Ask better questions. Explore without fear.',
  },
  {
    index: '02',
    title: 'Collaboration',
    desc: 'Different perspectives. Better possibilities.',
  },
  {
    index: '03',
    title: 'Ownership',
    desc: 'Take initiative. Follow through. Grow.',
  },
  {
    index: '04',
    title: 'Inclusion',
    desc: 'A place for every student and every starting point.',
  },
];

const JOURNEY_STEPS = [
  { index: '01', title: 'Explore an interest' },
  { index: '02', title: 'Join a community' },
  { index: '03', title: 'Build something meaningful' },
  { index: '04', title: 'Share what you learn' },
];

export function AboutPage() {
  const { navigate } = useDiv();

  return (
    <div className="bg-[#080807] text-[#F5ECCD]">
      {/* Dark Hero */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-[1360px] px-5 sm:px-8">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
            <ScrollReveal3D direction="left" className="lg:col-span-7">
              <p className="font-mono text-xs tracking-[0.14em] text-[#DAB24C] uppercase">
                ABOUT DIV · OUR SHARED PURPOSE
              </p>
              <h1 className="mt-4 font-display text-4xl leading-[1.06] font-bold tracking-tight text-[#F8ECAB] sm:text-6xl">
                Curiosity is where everything begins.
              </h1>
              <p className="mt-6 max-w-xl text-base leading-relaxed text-[#E5DEC0] sm:text-lg">
                DIVE INTO VISION is a student-driven technology ecosystem. A
                place to explore your potential, learn with others and create
                with purpose.
              </p>
            </ScrollReveal3D>
            <ScrollReveal3D direction="right" delay={0.08} className="lg:col-span-5">
              <div className="overflow-hidden rounded-xl border border-white/10 bg-[#11110E]">
                <ScrollParallaxFrame offsetY={16} zoom>
                  <img
                    src="/images/collab-laptop.jpg"
                    alt="Students collaborating"
                    referrerPolicy="no-referrer"
                    className="aspect-[4/3] w-full object-cover grayscale"
                  />
                </ScrollParallaxFrame>
              </div>
              <p className="mt-2 font-mono text-[11px] text-[#9E967C]">
                Illustrative photography
              </p>
            </ScrollReveal3D>
          </div>
        </div>
      </section>

      {/* 01 / Why we exist (Cream) */}
      <section className="bg-[#F8ECAB] py-20 text-[#0D0D0B] sm:py-24">
        <div className="mx-auto max-w-[1360px] px-5 sm:px-8">
          <ScrollReveal3D>
            <p className="font-mono text-xs tracking-[0.14em] text-[#6B5A23] uppercase">
              01 · WHY WE EXIST
            </p>
            <div className="mt-10 grid grid-cols-1 gap-12 md:grid-cols-2">
              <div>
                <p className="font-mono text-sm text-[#5B5237]">01</p>
                <h2 className="mt-3 font-display text-3xl font-bold sm:text-4xl">
                  Our vision
                </h2>
                <p className="mt-4 max-w-md text-base leading-relaxed text-[#2C281E]">
                  A student community where technology, creativity, leadership
                  and collaboration grow together.
                </p>
              </div>
              <div>
                <p className="font-mono text-sm text-[#5B5237]">02</p>
                <h2 className="mt-3 font-display text-3xl font-bold sm:text-4xl">
                  Our mission
                </h2>
                <p className="mt-4 max-w-md text-base leading-relaxed text-[#2C281E]">
                  Create opportunities to learn by doing: build projects, share
                  ideas, discover interests and support one another.
                </p>
              </div>
            </div>
            <div className="mt-14 border-t border-[#0D0D0B]/15 pt-8">
              <p className="font-display text-lg font-medium text-[#0D0D0B]">
                An open invitation to build, innovate and inspire.
              </p>
            </div>
          </ScrollReveal3D>
        </div>
      </section>

      {/* 02 / What we stand for (Dark) */}
      <section className="bg-[#080807] py-20 sm:py-24">
        <div className="mx-auto max-w-[1360px] px-5 sm:px-8">
          <ScrollReveal3D>
            <p className="font-mono text-xs tracking-[0.14em] text-[#DAB24C] uppercase">
              02 · WHAT WE STAND FOR
            </p>
          </ScrollReveal3D>
          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {VALUES.map((val, idx) => (
              <ScrollStaggerItem key={val.index} index={idx}>
                <div className="h-full rounded-xl border border-white/10 bg-[#11110E] p-7 transition-transform duration-200 hover:-translate-y-1 hover:border-[#DAB24C]/40">
                  <p className="font-mono text-xs text-[#DAB24C]">
                    {val.index}
                  </p>
                  <h3 className="mt-5 font-display text-2xl font-bold text-[#F8ECAB]">
                    {val.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-[#C4BC9E]">
                    {val.desc}
                  </p>
                </div>
              </ScrollStaggerItem>
            ))}
          </div>
        </div>
      </section>

      {/* 03 / Student-led, together (Cream) */}
      <section className="bg-[#F8ECAB] py-20 text-[#0D0D0B] sm:py-24">
        <div className="mx-auto max-w-[1360px] px-5 sm:px-8">
          <ScrollReveal3D>
            <p className="font-mono text-xs tracking-[0.14em] text-[#6B5A23] uppercase">
              03 · STUDENT-LED, TOGETHER
            </p>
          </ScrollReveal3D>
          <div className="mt-6 grid grid-cols-1 items-start gap-12 lg:grid-cols-12">
            <ScrollReveal3D direction="left" className="lg:col-span-6">
              <h2 className="font-display text-4xl leading-[1.08] font-bold sm:text-5xl">
                A stage. A workshop.
                <br />A team behind you.
              </h2>
              <p className="mt-5 max-w-md text-base leading-relaxed text-[#2C281E]">
                Five clubs connect technical skills with creative expression,
                career preparation, healthy competition and storytelling.
              </p>
              <button
                type="button"
                onClick={() => navigate('/clubs')}
                className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-[#0D0D0B] underline decoration-[#0D0D0B]/30 underline-offset-4 hover:decoration-[#0D0D0B]"
              >
                Find your club ↗
              </button>
            </ScrollReveal3D>
            <div className="divide-y divide-[#0D0D0B]/15 lg:col-span-6">
              {JOURNEY_STEPS.map((step, idx) => (
                <ScrollStaggerItem
                  key={step.index}
                  index={idx}
                  direction="left"
                  className="flex items-center gap-6 py-4 first:pt-0"
                >
                  <span className="font-mono text-xs text-[#6B5A23] tabular-nums">
                    {step.index}
                  </span>
                  <span className="font-display text-lg font-medium text-[#0D0D0B]">
                    {step.title}
                  </span>
                </ScrollStaggerItem>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
