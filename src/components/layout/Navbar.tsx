import React, { useState } from 'react';
import { MoreVertical, X } from 'lucide-react';
import { useDiv } from '../../context/DivContext';
import { DivLogoBadge } from '../ui/DivBrandMark';

const NAV_ITEMS = [
  { label: 'Home', path: '/' },
  { label: 'About Us', path: '/about' },
  { label: 'Our Clubs', path: '/clubs' },
  { label: 'Events', path: '/events' },
  { label: 'Our Team', path: '/team' },
  { label: 'Gallery', path: '/gallery' },
  { label: 'Contact', path: '/contact' },
];

export function Navbar() {
  const { route, navigate } = useDiv();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => {
    if (path === '/') return route === '/';
    return route === path || route.startsWith(`${path}/`);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#080807]/95">
      <div className="mx-auto flex max-w-[1360px] items-center justify-between gap-3 px-4 py-3.5 sm:gap-6 sm:px-8">
        {/* Zone 1: Brand Mark */}
        <button
          type="button"
          onClick={() => {
            setMobileMenuOpen(false);
            navigate('/');
          }}
          className="flex shrink-0 items-center gap-2.5 text-left whitespace-nowrap focus-visible:outline-2 focus-visible:outline-[#DAB24C] sm:gap-3"
        >
          <DivLogoBadge size={34} />
          <span className="font-display text-xs font-bold tracking-[0.06em] text-[#F8ECAB] sm:text-base">
            DIVE INTO VISION
          </span>
        </button>

        {/* Zone 2: Single-line navigation links (Desktop only) */}
        <nav
          aria-label="Primary"
          className="hidden items-center gap-5 lg:flex xl:gap-7"
        >
          {NAV_ITEMS.map((item) => {
            const active = isActive(item.path);
            return (
              <button
                key={item.path}
                type="button"
                onClick={() => navigate(item.path)}
                className={`relative py-1 text-sm font-medium whitespace-nowrap shrink-0 transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-[#DAB24C] ${
                  active
                    ? 'text-[#F8ECAB]'
                    : 'text-[#B8B097] hover:text-[#F8ECAB]'
                }`}
              >
                {item.label}
                {active && (
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-0 -bottom-0.5 h-[1.5px] bg-[#DAB24C]"
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Student Login (Desktop) + Join DIV (Desktop & Mobile) + Three-dot Menu (Mobile) */}
        <div className="flex items-center gap-2.5 shrink-0 sm:gap-5">
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="hidden text-sm font-medium text-[#DAB24C] whitespace-nowrap shrink-0 transition-colors hover:text-[#F8ECAB] focus-visible:outline-2 focus-visible:outline-[#DAB24C] lg:inline-flex"
          >
            Student Login
          </button>
          <button
            type="button"
            onClick={() => {
              setMobileMenuOpen(false);
              navigate('/join');
            }}
            className="rounded-lg bg-[#DAB24C] px-3.5 py-2 text-xs font-semibold text-[#080807] whitespace-nowrap shrink-0 transition-colors hover:bg-[#E5C05E] focus-visible:outline-2 focus-visible:outline-[#F8ECAB] sm:px-5 sm:py-2.5 sm:text-sm"
          >
            Join DIV ↗
          </button>
          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileMenuOpen}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/15 text-[#F8ECAB] transition-colors hover:border-[#DAB24C]/50 lg:hidden"
          >
            {mobileMenuOpen ? (
              <X className="h-4 w-4" />
            ) : (
              <MoreVertical className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Three-Dot Menu */}
      {mobileMenuOpen && (
        <div className="border-t border-white/10 bg-[#0A0A08] px-4 py-4 lg:hidden">
          <nav aria-label="Mobile" className="flex flex-col gap-1.5">
            {NAV_ITEMS.map((item) => {
              const active = isActive(item.path);
              return (
                <button
                  key={item.path}
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    navigate(item.path);
                  }}
                  className={`rounded-lg px-3.5 py-2.5 text-left text-sm font-medium transition-colors ${
                    active
                      ? 'bg-[#171612] text-[#DAB24C]'
                      : 'text-[#E5DEC0] hover:bg-[#141411]'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                navigate('/login');
              }}
              className={`mt-2 rounded-lg border border-[#DAB24C]/35 px-3.5 py-2.5 text-left text-sm font-medium transition-colors ${
                route === '/login'
                  ? 'bg-[#171612] text-[#F8ECAB]'
                  : 'text-[#DAB24C] hover:bg-[#141411]'
              }`}
            >
              Student Login
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}
