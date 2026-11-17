import React from 'react';
import {
  FaDiscord,
  FaEnvelope,
  FaFacebook,
  FaGithub,
  FaInstagram,
  FaLinkedin,
  FaTwitter,
} from 'react-icons/fa';
import { useDiv } from '../../context/DivContext';
import { DivLogoBadge } from '../ui/DivBrandMark';
import SocialFlipButton, { type SocialItem } from '../ui/SocialFlipButton';

export function Footer() {
  const { navigate, scrollToTop } = useDiv();

  const contactItems: SocialItem[] = [
    { letter: 'C', icon: <FaGithub />, label: 'GitHub', onClick: () => navigate('/contact') },
    { letter: 'O', icon: <FaTwitter />, label: 'Twitter', onClick: () => navigate('/contact') },
    { letter: 'N', icon: <FaLinkedin />, label: 'LinkedIn', onClick: () => navigate('/contact') },
    { letter: 'T', icon: <FaInstagram />, label: 'Instagram', onClick: () => navigate('/contact') },
    { letter: 'A', icon: <FaFacebook />, label: 'Facebook', onClick: () => navigate('/contact') },
    { letter: 'C', icon: <FaEnvelope />, label: 'Email', onClick: () => navigate('/contact') },
    { letter: 'T', icon: <FaDiscord />, label: 'Discord', onClick: () => navigate('/contact') },
  ];

  return (
    <footer className="border-t border-white/10 bg-[#080807] text-[#E5DEC0]">
      <div className="mx-auto max-w-[1360px] px-5 pt-16 pb-10 sm:px-8">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-12">
          {/* Brand column */}
          <div className="md:col-span-6">
            <div className="flex items-center gap-3.5">
              <DivLogoBadge size={44} />
              <div>
                <h3 className="font-display text-lg font-bold tracking-wide text-[#F8ECAB]">
                  DIVE INTO VISION
                </h3>
                <p className="font-mono text-[11px] tracking-[0.14em] text-[#DAB24C] uppercase">
                  BUILD. INNOVATE. INSPIRE.
                </p>
              </div>
            </div>
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-[#B8B097]">
              A student-driven ecosystem for technology, creativity, leadership
              and collaboration.
            </p>
          </div>

          {/* Explore */}
          <div className="md:col-span-3">
            <p className="font-mono text-xs font-medium text-[#DAB24C]">
              Explore
            </p>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <button
                  type="button"
                  onClick={() => navigate('/about')}
                  className="text-[#E5DEC0] transition-colors hover:text-[#DAB24C]"
                >
                  About DIV
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigate('/clubs')}
                  className="text-[#E5DEC0] transition-colors hover:text-[#DAB24C]"
                >
                  Our clubs
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigate('/events')}
                  className="text-[#E5DEC0] transition-colors hover:text-[#DAB24C]"
                >
                  Events &amp; activities
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigate('/team')}
                  className="text-[#E5DEC0] transition-colors hover:text-[#DAB24C]"
                >
                  Meet the team
                </button>
              </li>
            </ul>
          </div>

          {/* Community */}
          <div className="md:col-span-3">
            <p className="font-mono text-xs font-medium text-[#DAB24C]">
              Community
            </p>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <button
                  type="button"
                  onClick={() => navigate('/gallery')}
                  className="text-[#E5DEC0] transition-colors hover:text-[#DAB24C]"
                >
                  Gallery
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigate('/join')}
                  className="text-[#E5DEC0] transition-colors hover:text-[#DAB24C]"
                >
                  Become a member
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigate('/login')}
                  className="text-[#E5DEC0] transition-colors hover:text-[#DAB24C]"
                >
                  Student portal
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigate('/contact')}
                  className="text-[#E5DEC0] transition-colors hover:text-[#DAB24C]"
                >
                  Contact
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-center gap-5 text-center">
          <SocialFlipButton items={contactItems} />

          <p className="text-xs text-[#9E967C]">
            Chouksey Engineering College · Bilaspur, Chhattisgarh
          </p>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-6 text-xs text-[#8D856C]">
          <div>
            <p>© 2026 Dive Into Vision. All rights reserved.</p>
            <p className="mt-1 text-[10px] text-[#8D856C]">Create by Adarsh</p>
          </div>
          <div className="flex items-center gap-6">
            <button
              type="button"
              onClick={() => navigate('/about')}
              className="hover:text-[#F8ECAB]"
            >
              Privacy
            </button>
            <button
              type="button"
              onClick={() => navigate('/about')}
              className="hover:text-[#F8ECAB]"
            >
              Accessibility
            </button>
            <button
              type="button"
              onClick={scrollToTop}
              className="font-medium text-[#DAB24C] hover:text-[#F8ECAB]"
            >
              Back to top ↑
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
