import React from 'react';
import { useDiv } from '../context/DivContext';
import { HeroOrbitScene } from '../components/3d/HeroOrbitScene';
import {
  ScrollReveal3D,
  ScrollStaggerItem,
} from '../components/ui/DivBrandMark';
import type { ClubId } from '../types';

export function ClubDetailPage({ clubId }: { clubId: ClubId }) {
  const { clubs, navigate, scrollToElement } = useDiv();
  const club = clubs.find((c) => c.id === clubId) ?? clubs[0];

  return (
    <div className="bg-[#080807] text-[#F5ECCD]">
      {/* Hero with Morphing 3D Club Emblem */}
      <section className="py-14 sm:py-20">
        <div className="mx-auto max-w-[1360px] px-5 sm:px-8">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
            <div className="lg:col-span-6">
              <p className="font-mono text-xs tracking-[0.14em] text-[#DAB24C] uppercase">
                OUR CLUBS · {club.index} · {club.fullName.toUpperCase()}
              </p>
              <h1 className="mt-5 font-display text-4xl leading-[1.06] font-bold tracking-tight text-[#F8ECAB] sm:text-6xl">
                {club.heroTitleLine1}
                <br />
                {club.heroTitleLine2}
              </h1>
              <p className="mt-6 max-w-xl text-base leading-relaxed text-[#E5DEC0] sm:text-lg">
                {club.heroSubtitle}
              </p>
              <div className="mt-9 flex flex-wrap items-center gap-6">
                <button
                  type="button"
                  onClick={() => navigate('/join', { preselectClub: club.id })}
                  className="rounded-lg bg-[#DAB24C] px-6 py-3.5 text-sm font-semibold text-[#080807] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#E5C05E]"
                >
                  Join this club ↗
                </button>
                <button
                  type="button"
                  onClick={() => scrollToElement('club-activities')}
                  className="text-sm font-medium text-[#E5DEC0] transition-colors hover:text-[#DAB24C]"
                >
                  Explore club activities ↓
                </button>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="mx-auto h-[340px] w-full max-w-[460px] sm:h-[400px]">
                <HeroOrbitScene variant={club.id} className="h-full w-full" />
              </div>
              <p className="mt-2 text-center font-mono text-[11px] tracking-[0.16em] text-[#9E967C] uppercase">
                {club.heroEmblemLabel}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 01 / What we do (Cream) */}
      <section
        id="club-activities"
        className="bg-[#F8ECAB] py-20 text-[#0D0D0B] sm:py-24"
      >
        <div className="mx-auto max-w-[1360px] px-5 sm:px-8">
          <ScrollReveal3D>
            <p className="font-mono text-xs tracking-[0.14em] text-[#6B5A23] uppercase">
              01 · WHAT WE DO
            </p>
            <h2 className="mt-3 font-display text-4xl font-bold sm:text-5xl">
              Make room for the things you love.
            </h2>
          </ScrollReveal3D>

          <div className="mt-12 grid grid-cols-1 gap-x-12 gap-y-10 md:grid-cols-2">
            {club.whatWeDo.map((item, idx) => (
              <ScrollStaggerItem key={item.index} index={idx}>
                <div className="flex items-start gap-6 border-t border-[#0D0D0B]/15 pt-6">
                  <span className="font-mono text-xs text-[#6B5A23] tabular-nums">
                    {item.index}
                  </span>
                  <div>
                    <h3 className="font-display text-2xl font-bold text-[#0D0D0B]">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-[#2C281E]">
                      {item.description}
                    </p>
                  </div>
                </div>
              </ScrollStaggerItem>
            ))}
          </div>
        </div>
      </section>

      {/* 02 / Community Showcase (Dark) */}
      <section className="bg-[#080807] py-20 sm:py-24">
        <div className="mx-auto max-w-[1360px] px-5 sm:px-8">
          <ScrollReveal3D>
            <p className="font-mono text-xs tracking-[0.14em] text-[#DAB24C] uppercase">
              02 · COMMUNITY SHOWCASE
            </p>
            <h2 className="mt-3 font-display text-4xl font-bold text-[#F8ECAB] sm:text-5xl">
              {club.showcaseTitle}
            </h2>
          </ScrollReveal3D>

          <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-3">
            {club.showcaseItems.map((card, idx) => (
              <ScrollStaggerItem key={card.index} index={idx} className="flex">
                <div className="flex w-full flex-col justify-between rounded-xl border border-white/10 bg-[#11110E] p-7">
                  <div>
                    <p className="font-mono text-xs text-[#DAB24C]">
                      &lt;div&gt; {card.index}
                    </p>
                    <h3 className="mt-5 font-display text-2xl font-bold text-[#F8ECAB]">
                      {card.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-[#9E967C]">
                      Community submissions to be added.
                      <br />
                      No published work is claimed.
                    </p>
                  </div>
                  <p className="mt-8 font-mono text-[11px] tracking-[0.14em] text-[#DAB24C]/80 uppercase">
                    COMING SOON
                  </p>
                </div>
              </ScrollStaggerItem>
            ))}
          </div>
        </div>
      </section>

      {/* 03 / Led by students (Cream) */}
      <section className="bg-[#F8ECAB] py-20 text-[#0D0D0B] sm:py-24">
        <div className="mx-auto max-w-[1360px] px-5 sm:px-8">
          <ScrollReveal3D>
            <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12">
              <div className="lg:col-span-7">
                <p className="font-mono text-xs tracking-[0.14em] text-[#6B5A23] uppercase">
                  03 · LED BY STUDENTS
                </p>
                <h2 className="mt-3 font-display text-4xl font-bold sm:text-5xl">
                  Meet your next community.
                </h2>
                <p className="mt-6 text-base font-medium text-[#0D0D0B]">
                  {club.headRoleTitle}
                </p>
                <p className="mt-1 text-sm text-[#3D392B]">
                  {club.leader === 'To be confirmed'
                    ? 'Name, portrait and social links to be confirmed.'
                    : `${club.leader} · Portrait and social links to be confirmed.`}
                </p>
                <button
                  type="button"
                  onClick={() => navigate('/team')}
                  className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-[#0D0D0B] underline decoration-[#0D0D0B]/30 underline-offset-4 hover:decoration-[#0D0D0B]"
                >
                  Meet the DIV team ↗
                </button>
              </div>

              <div className="lg:col-span-5">
                <div className="rounded-xl bg-[#080807] p-8 text-[#F5ECCD]">
                  <h3 className="font-display text-3xl leading-tight font-bold text-[#F8ECAB]">
                    Your first step
                    <br />
                    starts here.
                  </h3>
                  <p className="mt-4 text-sm text-[#C4BC9E]">
                    All experience levels welcome.
                  </p>
                  <button
                    type="button"
                    onClick={() => navigate('/join', { preselectClub: club.id })}
                    className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-[#DAB24C] hover:text-[#F8ECAB]"
                  >
                    Become a member ↗
                  </button>
                </div>
              </div>
            </div>
          </ScrollReveal3D>
        </div>
      </section>
    </div>
  );
}
