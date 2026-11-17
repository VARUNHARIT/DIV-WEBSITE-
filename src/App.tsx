import React, { useEffect, useState } from 'react';
import { MotionConfig, AnimatePresence, motion } from 'motion/react';
import { DivProvider, useDiv } from './context/DivContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { ModalHost } from './components/ui/ModalHost';
import { ScrollProgressBar } from './components/ui/DivBrandMark';
import { KineticTextLoader } from './components/ui/KineticTextLoader';
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { ClubsHubPage } from './pages/ClubsHubPage';
import { ClubDetailPage } from './pages/ClubDetailPage';
import { EventsPage } from './pages/EventsPage';
import { EventDetailPage } from './pages/EventDetailPage';
import { TeamPage } from './pages/TeamPage';
import { GalleryPage } from './pages/GalleryPage';
import { ContactPage } from './pages/ContactPage';
import { JoinPage } from './pages/JoinPage';
import { LoginPage } from './pages/LoginPage';
import { StudentPortalPage } from './pages/StudentPortalPage';
import { AdminPortalPage } from './pages/AdminPortalPage';
import type { ClubId } from './types';

const VALID_CLUB_IDS: ClubId[] = [
  'coding',
  'industry-readiness',
  'cultural',
  'sports',
  'social-media',
];

function AppRouter() {
  const { route } = useDiv();
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    const durationMs = prefersReducedMotion ? 500 : 1950;
    const timer = window.setTimeout(() => {
      setIsInitialLoading(false);
    }, durationMs);
    return () => window.clearTimeout(timer);
  }, []);

  const isStandaloneShell =
    route === '/login' || route === '/portal' || route === '/admin';

  const renderPage = () => {
    if (route === '/' || route === '') return <HomePage />;
    if (route === '/about') return <AboutPage />;
    if (route === '/clubs') return <ClubsHubPage />;
    if (route.startsWith('/clubs/')) {
      const slug = route.replace('/clubs/', '') as ClubId;
      const clubId = VALID_CLUB_IDS.includes(slug) ? slug : 'coding';
      return <ClubDetailPage clubId={clubId} />;
    }
    if (route === '/events') return <EventsPage />;
    if (route.startsWith('/events/')) {
      const slug = route.replace('/events/', '');
      return <EventDetailPage eventId={slug} />;
    }
    if (route === '/team') return <TeamPage />;
    if (route === '/gallery') return <GalleryPage />;
    if (route === '/contact') return <ContactPage />;
    if (route === '/join') return <JoinPage />;
    if (route === '/login') return <LoginPage />;
    if (route === '/portal') return <StudentPortalPage />;
    if (route === '/admin') return <AdminPortalPage />;
    return <HomePage />;
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#080807] text-[#F5ECCD]">
      <AnimatePresence>
        {isInitialLoading && (
          <motion.div
            key="initial-loader"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-[#080807]"
          >
            <KineticTextLoader />
          </motion.div>
        )}
      </AnimatePresence>
      <ScrollProgressBar />
      {!isStandaloneShell && <Navbar />}

      <div className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={route}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          >
            {renderPage()}
          </motion.div>
        </AnimatePresence>
      </div>

      {!isStandaloneShell && <Footer />}
      <ModalHost />
    </div>
  );
}

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <DivProvider>
        <AppRouter />
      </DivProvider>
    </MotionConfig>
  );
}
