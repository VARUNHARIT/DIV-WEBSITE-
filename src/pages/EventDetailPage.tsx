import React from 'react';
import { useDiv } from '../context/DivContext';
import { EVENTS_DATA } from '../data/divData';
import {
  ScrollReveal3D,
  ScrollStaggerItem,
} from '../components/ui/DivBrandMark';

export function EventDetailPage({ eventId }: { eventId: string }) {
  const { navigate, savedEventIds, toggleSavedEvent } = useDiv();
  const event = EVENTS_DATA.find((e) => e.id === eventId) ?? EVENTS_DATA[0];
  const isSaved = savedEventIds.includes(event.id);

  return (
    <div className="bg-[#080807] text-[#F5ECCD]">
      {/* Dark Hero + Details Panel */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-[1360px] px-5 sm:px-8">
          <button
            type="button"
            onClick={() => navigate('/events')}
            className="mb-8 inline-flex items-center gap-1.5 font-mono text-xs text-[#9E967C] transition-colors hover:text-[#DAB24C]"
          >
            ← Back to all events
          </button>

          <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <p className="font-mono text-xs tracking-[0.14em] text-[#DAB24C] uppercase">
                EVENTS · {event.category.toUpperCase()} · CONCEPT PREVIEW
              </p>
              <h1 className="mt-4 font-display text-4xl leading-[1.06] font-bold tracking-tight text-[#F8ECAB] sm:text-6xl">
                {event.title}
              </h1>
              <p className="mt-6 max-w-xl text-base leading-relaxed text-[#E5DEC0] sm:text-lg">
                {event.fullDescription}
              </p>

              <div className="mt-10 flex flex-wrap items-center gap-6">
                <button
                  type="button"
                  onClick={() => navigate(`/clubs/${event.clubId}`)}
                  className="font-mono text-xs tracking-[0.06em] text-[#DAB24C] hover:text-[#F8ECAB]"
                >
                  {event.clubName} · {event.audience}
                </button>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="rounded-xl border border-white/10 bg-[#11110E] p-7 sm:p-8">
                <p className="font-mono text-[11px] tracking-[0.14em] text-[#DAB24C] uppercase">
                  {event.category.toUpperCase()}
                </p>
                <h2 className="mt-2 font-display text-2xl font-bold text-[#F8ECAB]">
                  The details
                </h2>

                <dl className="mt-6 space-y-4 border-t border-white/10 pt-5 text-sm">
                  <div className="flex items-center justify-between gap-4">
                    <dt className="text-[#9E967C]">Date</dt>
                    <dd className="font-medium text-[#E5DEC0]">{event.date}</dd>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <dt className="text-[#9E967C]">Venue</dt>
                    <dd className="font-medium text-[#E5DEC0]">{event.venue}</dd>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <dt className="text-[#9E967C]">Format</dt>
                    <dd className="font-medium text-[#E5DEC0]">
                      {event.format}
                    </dd>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <dt className="text-[#9E967C]">Status</dt>
                    <dd className="font-medium text-[#DAB24C]">
                      {event.status}
                    </dd>
                  </div>
                </dl>

                <button
                  type="button"
                  onClick={() => toggleSavedEvent(event.id)}
                  className={`mt-7 w-full rounded-lg px-5 py-3 text-sm font-semibold transition-colors ${
                    isSaved
                      ? 'border border-[#DAB24C] bg-[#171612] text-[#DAB24C]'
                      : 'bg-[#DAB24C] text-[#080807] hover:bg-[#E5C05E]'
                  }`}
                >
                  {isSaved
                    ? 'Interest saved in demo portal ✓'
                    : 'Save interest for announcement'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What to expect (Cream) */}
      <section className="bg-[#F8ECAB] py-20 text-[#0D0D0B] sm:py-24">
        <div className="mx-auto max-w-[1360px] px-5 sm:px-8">
          <ScrollReveal3D>
            <p className="font-mono text-xs tracking-[0.14em] text-[#6B5A23] uppercase">
              WHAT TO EXPECT
            </p>
            <h2 className="mt-3 font-display text-4xl font-bold sm:text-5xl">
              {event.expectHeading}
            </h2>
          </ScrollReveal3D>

          <div className="mt-12 grid grid-cols-1 gap-10 md:grid-cols-3">
            {event.expectSteps.map((step, idx) => (
              <ScrollStaggerItem key={step.index} index={idx}>
                <div className="border-t border-[#0D0D0B]/15 pt-6">
                  <p className="font-mono text-xs text-[#6B5A23] tabular-nums">
                    {step.index}
                  </p>
                  <h3 className="mt-4 font-display text-2xl font-bold text-[#0D0D0B]">
                    {step.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-[#2C281E]">
                    {step.description}
                  </p>
                </div>
              </ScrollStaggerItem>
            ))}
          </div>

          <ScrollReveal3D delay={0.12}>
            <div className="mt-14 border-t border-[#0D0D0B]/15 pt-6 text-xs text-[#3D392B]">
              {event.bringNote && <p className="mb-1 font-medium">{event.bringNote}</p>}
              <p>
                Final agenda, eligibility and participation terms will be
                published with the confirmed event.
              </p>
            </div>
          </ScrollReveal3D>
        </div>
      </section>

      {/* Take the next step (Dark) */}
      <section className="bg-[#080807] py-20 sm:py-24">
        <div className="mx-auto max-w-[1360px] px-5 sm:px-8">
          <ScrollReveal3D>
            <p className="font-mono text-xs tracking-[0.14em] text-[#DAB24C] uppercase">
              TAKE THE NEXT STEP
            </p>
            <h2 className="mt-3 font-display text-4xl font-bold text-[#F8ECAB] sm:text-5xl">
              Be the first to hear.
            </h2>
            <p className="mt-4 max-w-xl text-base text-[#C4BC9E]">
              Registration opens when the event is confirmed. Sign in to follow
              announcements and save your interests.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="text-sm font-semibold text-[#DAB24C] hover:text-[#F8ECAB]"
              >
                Sign in to your student portal ↗
              </button>
              <span className="font-mono text-xs tracking-[0.12em] text-[#8D856C] uppercase">
                REGISTRATION NOT YET OPEN
              </span>
            </div>
          </ScrollReveal3D>
        </div>
      </section>
    </div>
  );
}
