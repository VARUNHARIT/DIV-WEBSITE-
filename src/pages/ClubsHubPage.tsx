import React from 'react';
import { useDiv } from '../context/DivContext';
import {
  ScrollReveal3D,
  ScrollStaggerItem,
} from '../components/ui/DivBrandMark';

export function ClubsHubPage() {
  const { clubs, navigate } = useDiv();

  return (
    <div className="bg-[#080807] text-[#F5ECCD]">
      {/* Hero */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-[1360px] px-5 sm:px-8">
          <ScrollReveal3D>
            <p className="font-mono text-xs tracking-[0.14em] text-[#DAB24C] uppercase">
              OUR CLUBS · FIVE WAYS TO DIVE IN
            </p>
            <h1 className="mt-4 font-display text-4xl leading-[1.06] font-bold tracking-tight text-[#F8ECAB] sm:text-6xl">
              Different passions.
              <br />
              The same drive.
            </h1>
            <p className="mt-6 max-w-xl text-base text-[#E5DEC0] sm:text-lg">
              Choose your starting point. You don’t have to stop at one.
            </p>
          </ScrollReveal3D>
        </div>
      </section>

      {/* Cream List of 5 Clubs */}
      <section className="bg-[#F8ECAB] py-12 text-[#0D0D0B] sm:py-16">
        <div className="mx-auto max-w-[1360px] divide-y divide-[#0D0D0B]/15 px-5 sm:px-8">
          {clubs.map((club, idx) => (
            <ScrollStaggerItem key={club.id} index={idx} direction="left">
              <article
                onClick={() => navigate(`/clubs/${club.id}`)}
                className="group grid cursor-pointer grid-cols-1 items-center gap-6 py-10 transition-colors hover:bg-[#EFE3A2]/60 md:grid-cols-12 md:px-4"
              >
                <div className="flex items-center gap-6 md:col-span-5">
                  <span className="w-14 shrink-0 font-mono text-xl font-semibold text-[#5B5237]">
                    {club.symbol}
                  </span>
                  <div>
                    <h2 className="font-display text-2xl font-bold text-[#0D0D0B] sm:text-3xl">
                      {club.fullName}
                    </h2>
                    <p className="mt-1 text-sm text-[#3D392B]">
                      {club.hubTagline}
                    </p>
                  </div>
                </div>

                <div className="md:col-span-5">
                  <p className="text-sm leading-relaxed text-[#2C281E]">
                    {club.hubDescription}
                  </p>
                  <p className="mt-3 font-mono text-xs text-[#6B5A23]">
                    Leadership · {club.leader}
                  </p>
                </div>

                <div className="flex md:col-span-2 md:justify-end">
                  <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#0D0D0B] transition-transform duration-150 group-hover:translate-x-1">
                    Explore ↗
                  </span>
                </div>
              </article>
            </ScrollStaggerItem>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="bg-[#080807] py-20 sm:py-24">
        <div className="mx-auto max-w-[1360px] px-5 sm:px-8">
          <ScrollReveal3D>
            <p className="font-mono text-xs tracking-[0.14em] text-[#DAB24C] uppercase">
              YOUR INTERESTS ARE ONLY THE BEGINNING
            </p>
            <h2 className="mt-4 font-display text-4xl font-bold text-[#F8ECAB] sm:text-5xl">
              There is a place for you at DIV.
            </h2>
            <p className="mt-4 text-base text-[#C4BC9E]">
              Discover a club, meet your community and start participating.
            </p>
            <button
              type="button"
              onClick={() => navigate('/join')}
              className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-[#DAB24C] hover:text-[#F8ECAB]"
            >
              Become a member ↗
            </button>
          </ScrollReveal3D>
        </div>
      </section>
    </div>
  );
}
