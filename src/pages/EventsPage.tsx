import React, { useState } from 'react';
import { useDiv } from '../context/DivContext';
import { EVENTS_DATA } from '../data/divData';
import {
  ScrollParallaxFrame,
  ScrollReveal3D,
  ScrollStaggerItem,
} from '../components/ui/DivBrandMark';
import type { EventCategory } from '../types';

const EVENT_CATEGORIES: EventCategory[] = [
  'All',
  'Workshops',
  'Hackathons',
  'Competitions',
  'Technical',
  'Cultural',
  'Sports',
];

const CALENDAR_ROWS = [
  {
    title: 'Workshops & technical sessions',
    subtitle: 'Learn by doing',
    status: 'Schedule pending',
  },
  {
    title: 'Competitions & tournaments',
    subtitle: 'Challenge yourself',
    status: 'Schedule pending',
  },
  {
    title: 'Cultural activities',
    subtitle: 'Create and connect',
    status: 'Schedule pending',
  },
];

export function EventsPage() {
  const { navigate } = useDiv();
  const [selectedCategory, setSelectedCategory] =
    useState<EventCategory>('All');

  const filteredEvents =
    selectedCategory === 'All'
      ? EVENTS_DATA
      : EVENTS_DATA.filter((e) => e.category === selectedCategory);

  return (
    <div className="bg-[#080807] text-[#F5ECCD]">
      {/* Dark Hero */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-[1360px] px-5 sm:px-8">
          <ScrollReveal3D>
            <p className="font-mono text-xs tracking-[0.14em] text-[#DAB24C] uppercase">
              EVENTS &amp; ACTIVITIES · MAKE SOMETHING HAPPEN
            </p>
            <h1 className="mt-4 font-display text-4xl leading-[1.06] font-bold tracking-tight text-[#F8ECAB] sm:text-6xl">
              Show up curious.
              <br />
              Leave inspired.
            </h1>
            <p className="mt-6 max-w-xl text-base text-[#E5DEC0] sm:text-lg">
              Workshops, hackathons, competitions and shared experiences.
              Explore what’s possible.
            </p>
          </ScrollReveal3D>
        </div>
      </section>

      {/* Cream Filter Tabs + Programmes Grid */}
      <section className="bg-[#F8ECAB] py-14 text-[#0D0D0B] sm:py-20">
        <div className="mx-auto max-w-[1360px] px-5 sm:px-8">
          {/* Interactive Category Tabs */}
          <div
            role="tablist"
            aria-label="Filter events by category"
            className="flex flex-wrap items-center gap-3 border-b border-[#0D0D0B]/15 pb-6"
          >
            {EVENT_CATEGORIES.map((category) => {
              const active = selectedCategory === category;
              return (
                <button
                  key={category}
                  role="tab"
                  aria-selected={active}
                  type="button"
                  onClick={() => setSelectedCategory(category)}
                  className={`rounded-md px-5 py-2.5 text-sm font-medium whitespace-nowrap shrink-0 transition-colors ${
                    active
                      ? 'bg-[#0A0A08] text-[#F8ECAB]'
                      : 'text-[#3D392B] hover:bg-[#EFE3A2] hover:text-[#0D0D0B]'
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>

          <p className="mt-6 font-mono text-xs text-[#5B5237] tabular-nums">
            {filteredEvents.length}{' '}
            {filteredEvents.length === 1
              ? 'concept programme'
              : 'concept programmes'}{' '}
            {selectedCategory !== 'All' ? `/ ${selectedCategory} ` : ''}/
            Schedule pending
          </p>

          <div
            className={`mt-8 grid grid-cols-1 gap-6 ${
              filteredEvents.length === 1
                ? 'items-center md:grid-cols-3'
                : 'md:grid-cols-2 lg:grid-cols-3'
            }`}
          >
            {filteredEvents.map((ev, idx) => (
              <ScrollStaggerItem
                key={`${selectedCategory}-${ev.id}`}
                index={idx}
                className="flex"
              >
                <article
                  onClick={() => navigate(`/events/${ev.id}`)}
                  className="group flex w-full cursor-pointer flex-col overflow-hidden rounded-xl border border-[#0D0D0B]/15 bg-[#0A0A08] text-[#F5ECCD] transition-all duration-200 hover:-translate-y-1"
                >
                  <div className="relative flex aspect-[16/10] w-full items-center justify-center overflow-hidden bg-[#11110E]">
                    {ev.image ? (
                      <ScrollParallaxFrame offsetY={12} zoom className="h-full w-full">
                        <img
                          src={ev.image}
                          alt={ev.title}
                          referrerPolicy="no-referrer"
                          className="h-full w-full object-cover grayscale transition-transform duration-700 group-hover:scale-105"
                        />
                      </ScrollParallaxFrame>
                    ) : (
                      <span className="font-mono text-sm tracking-[0.14em] text-[#DAB24C] uppercase">
                        {ev.cardOverlayText}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-1 flex-col justify-between p-6">
                    <div>
                      <p className="font-mono text-[11px] tracking-[0.12em] text-[#DAB24C] uppercase">
                        {ev.kicker}
                      </p>
                      <h2 className="mt-3 font-display text-2xl font-bold text-[#F8ECAB] transition-colors group-hover:text-[#DAB24C]">
                        {ev.title}
                      </h2>
                      <p className="mt-4 text-xs text-[#9E967C]">
                        Date &amp; venue to be confirmed
                      </p>
                    </div>
                    <span className="mt-7 inline-flex items-center gap-1.5 text-sm font-medium text-[#DAB24C]">
                      Explore programme ↗
                    </span>
                  </div>
                </article>
              </ScrollStaggerItem>
            ))}

            {filteredEvents.length === 1 && (
              <div className="md:col-span-2 md:pl-8">
                <p className="max-w-md font-display text-xl font-medium text-[#2C281E]">
                  More experiences are on the way.
                  <br />
                  Confirmed programmes will appear here.
                </p>
              </div>
            )}
          </div>

          <p className="mt-10 font-mono text-xs text-[#5B5237]">
            Illustrative imagery and concept programmes only. Confirmed DIV
            events will replace these previews.
          </p>
        </div>
      </section>

      {/* Activity Calendar (Dark) */}
      <section className="bg-[#080807] py-20 sm:py-24">
        <div className="mx-auto max-w-[1360px] px-5 sm:px-8">
          <ScrollReveal3D>
            <p className="font-mono text-xs tracking-[0.14em] text-[#DAB24C] uppercase">
              ACTIVITY CALENDAR · STAY IN THE LOOP
            </p>
            <h2 className="mt-3 font-display text-4xl font-bold text-[#F8ECAB] sm:text-5xl">
              Your next opportunity is on the way.
            </h2>
          </ScrollReveal3D>

          <div className="mt-10 space-y-4">
            {CALENDAR_ROWS.map((row, idx) => (
              <ScrollStaggerItem key={row.title} index={idx} direction="left">
                <div className="grid grid-cols-1 items-center gap-4 rounded-xl border border-white/10 bg-[#11110E] px-6 py-5 md:grid-cols-12">
                  <p className="font-display text-base font-semibold text-[#F8ECAB] md:col-span-5">
                    {row.title}
                  </p>
                  <p className="text-sm text-[#C4BC9E] md:col-span-4">
                    {row.subtitle}
                  </p>
                  <p className="font-mono text-xs text-[#DAB24C] md:col-span-3 md:text-right">
                    {row.status}
                  </p>
                </div>
              </ScrollStaggerItem>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
