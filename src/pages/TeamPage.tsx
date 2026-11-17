import React from 'react';
import { useDiv } from '../context/DivContext';
import { LEADERSHIP_TEAM } from '../data/divData';
import {
  ScrollReveal3D,
  ScrollStaggerItem,
} from '../components/ui/DivBrandMark';

export function TeamPage() {
  const { clubs, navigate } = useDiv();

  return (
    <div className="bg-[#080807] text-[#F5ECCD]">
      {/* Hero */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-[1360px] px-5 sm:px-8">
          <ScrollReveal3D>
            <p className="font-mono text-xs tracking-[0.14em] text-[#DAB24C] uppercase">
              OUR TEAM · THE PEOPLE BEHIND DIV
            </p>
            <h1 className="mt-4 font-display text-4xl leading-[1.06] font-bold tracking-tight text-[#F8ECAB] sm:text-6xl">
              Guided by experience.
              <br />
              Driven by students.
            </h1>
            <p className="mt-6 max-w-xl text-base text-[#E5DEC0] sm:text-lg">
              Meet the roles that bring our shared vision to life.
            </p>
          </ScrollReveal3D>
        </div>
      </section>

      {/* 01 / Leadership (Cream) */}
      <section className="bg-[#F8ECAB] py-20 text-[#0D0D0B] sm:py-24">
        <div className="mx-auto max-w-[1360px] px-5 sm:px-8">
          <ScrollReveal3D>
            <p className="font-mono text-xs tracking-[0.14em] text-[#6B5A23] uppercase">
              01 · LEADERSHIP
            </p>
          </ScrollReveal3D>

          <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {LEADERSHIP_TEAM.map((person, idx) => (
              <ScrollStaggerItem key={person.index} index={idx}>
                <article className="group">
                  <div className="flex aspect-square items-center justify-center rounded-xl bg-[#0A0A08] p-6 transition-transform duration-200 group-hover:-translate-y-1">
                    <p className="font-mono text-xs tracking-[0.12em] text-[#DAB24C]/80 uppercase">
                      PORTRAIT TO BE ADDED
                    </p>
                  </div>
                  <h2 className="mt-5 font-display text-2xl font-bold text-[#0D0D0B]">
                    {person.role}
                  </h2>
                  <p className="mt-1.5 text-sm text-[#2C281E]">{person.name}</p>
                  <p className="mt-0.5 text-xs text-[#5B5237]">
                    {person.affiliation}
                  </p>
                  <div className="mt-4 flex items-center gap-4 text-xs font-medium text-[#2C281E]">
                    <button
                      type="button"
                      onClick={() => navigate('/contact')}
                      className="hover:underline"
                    >
                      LinkedIn ↗
                    </button>
                    <button
                      type="button"
                      onClick={() => navigate('/contact')}
                      className="hover:underline"
                    >
                      Email ↗
                    </button>
                  </div>
                </article>
              </ScrollStaggerItem>
            ))}
          </div>

          <ScrollReveal3D delay={0.1}>
            <p className="mt-12 font-mono text-xs text-[#5B5237]">
              Leadership identities, portraits and official social links are
              pending confirmation.
            </p>
          </ScrollReveal3D>
        </div>
      </section>

      {/* 02 / Club leadership (Dark) */}
      <section className="bg-[#080807] py-20 sm:py-24">
        <div className="mx-auto max-w-[1360px] px-5 sm:px-8">
          <ScrollReveal3D>
            <p className="font-mono text-xs tracking-[0.14em] text-[#DAB24C] uppercase">
              02 · CLUB LEADERSHIP
            </p>
            <h2 className="mt-3 font-display text-4xl font-bold text-[#F8ECAB] sm:text-5xl">
              One team. Five perspectives.
            </h2>
          </ScrollReveal3D>

          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
            {clubs.map((club, idx) => (
              <ScrollStaggerItem key={club.id} index={idx} className="flex">
                <article
                  onClick={() => navigate(`/clubs/${club.id}`)}
                  className="group flex w-full cursor-pointer flex-col justify-between rounded-xl border border-white/10 bg-[#11110E] p-6 transition-all duration-200 hover:-translate-y-1 hover:border-[#DAB24C]/55"
                >
                  <div>
                    <p className="font-mono text-xs text-[#DAB24C] tabular-nums">
                      {club.index}
                    </p>
                    <h3 className="mt-5 font-display text-xl font-bold text-[#F8ECAB] transition-colors group-hover:text-[#DAB24C]">
                      {club.headRoleTitle}
                    </h3>
                  </div>
                  <p className="mt-6 text-xs leading-relaxed text-[#9E967C]">
                    {club.leader === 'To be confirmed'
                      ? 'Name & portrait to be confirmed'
                      : club.leader}
                  </p>
                </article>
              </ScrollStaggerItem>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
