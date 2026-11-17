import React, { useState } from 'react';
import { useDiv } from '../context/DivContext';
import { GALLERY_ITEMS } from '../data/divData';
import {
  ScrollParallaxFrame,
  ScrollReveal3D,
  ScrollStaggerItem,
} from '../components/ui/DivBrandMark';
import type { GalleryCategory } from '../types';

const GALLERY_TABS: GalleryCategory[] = [
  'All moments',
  'Technology',
  'Community',
  'Creative work',
  'Videos',
];

export function GalleryPage() {
  const { setActiveModal } = useDiv();
  const [activeTab, setActiveTab] = useState<GalleryCategory>('All moments');

  const filteredItems =
    activeTab === 'All moments'
      ? GALLERY_ITEMS
      : GALLERY_ITEMS.filter((item) => item.category === activeTab);

  return (
    <div className="bg-[#080807] text-[#F5ECCD]">
      {/* Hero */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-[1360px] px-5 sm:px-8">
          <ScrollReveal3D>
            <p className="font-mono text-xs tracking-[0.14em] text-[#DAB24C] uppercase">
              GALLERY · A COMMUNITY IN MOTION
            </p>
            <h1 className="mt-4 font-display text-4xl leading-[1.06] font-bold tracking-tight text-[#F8ECAB] sm:text-6xl">
              Small moments.
              <br />
              Lasting connections.
            </h1>
            <p className="mt-6 max-w-xl text-base text-[#E5DEC0] sm:text-lg">
              An editorial preview. Official DIV photography and videos will
              replace the sample media.
            </p>
          </ScrollReveal3D>
        </div>
      </section>

      {/* Cream Gallery Filter + Grid */}
      <section className="bg-[#F8ECAB] py-14 text-[#0D0D0B] sm:py-20">
        <div className="mx-auto max-w-[1360px] px-5 sm:px-8">
          <div
            role="tablist"
            aria-label="Filter gallery items"
            className="flex flex-wrap items-center gap-3 border-b border-[#0D0D0B]/15 pb-6"
          >
            {GALLERY_TABS.map((tab) => {
              const active = activeTab === tab;
              return (
                <button
                  key={tab}
                  role="tab"
                  aria-selected={active}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`rounded-md px-5 py-2.5 text-sm font-medium whitespace-nowrap shrink-0 transition-colors ${
                    active
                      ? 'bg-[#0A0A08] text-[#F8ECAB]'
                      : 'text-[#3D392B] hover:bg-[#EFE3A2] hover:text-[#0D0D0B]'
                  }`}
                >
                  {tab}
                </button>
              );
            })}
          </div>

          <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {filteredItems.map((item, idx) => (
              <ScrollStaggerItem key={`${activeTab}-${item.id}`} index={idx}>
                <button
                  type="button"
                  onClick={() => {
                    if (item.type === 'video') {
                      setActiveModal({
                        type: 'video-placeholder',
                        title: item.title,
                      });
                    } else {
                      setActiveModal({ type: 'lightbox', item });
                    }
                  }}
                  className="group w-full text-left focus-visible:outline-2 focus-visible:outline-[#0D0D0B]"
                >
                  <div className="overflow-hidden rounded-xl border border-[#0D0D0B]/15 bg-[#0A0A08]">
                    {item.type === 'photo' && item.image ? (
                      <ScrollParallaxFrame offsetY={12} zoom>
                        <img
                          src={item.image}
                          alt={item.title}
                          referrerPolicy="no-referrer"
                          className="aspect-[16/10] w-full object-cover grayscale transition-transform duration-700 group-hover:scale-105"
                        />
                      </ScrollParallaxFrame>
                    ) : (
                      <div className="flex aspect-[16/10] w-full items-center justify-start bg-[#0A0A08] p-7">
                        <span className="font-mono text-lg tracking-wide text-[#DAB24C] uppercase">
                          VIDEO
                          <br />
                          FOOTAGE PENDING
                        </span>
                      </div>
                    )}
                  </div>
                  <h2 className="mt-4 font-display text-lg font-bold text-[#0D0D0B] group-hover:underline">
                    {item.title}
                  </h2>
                  <p className="mt-1 font-mono text-[11px] tracking-[0.06em] text-[#5B5237] uppercase">
                    {item.caption}
                  </p>
                </button>
              </ScrollStaggerItem>
            ))}
          </div>

          <p className="mt-14 border-t border-[#0D0D0B]/15 pt-6 font-mono text-xs text-[#5B5237]">
            Authentic moments deserve authentic media. Upload approved DIV
            photographs before publication.
          </p>
        </div>
      </section>
    </div>
  );
}
