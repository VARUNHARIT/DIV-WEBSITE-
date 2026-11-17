import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import Lenis from 'lenis';
import type {
  ActiveModal,
  AdminRole,
  AdminTab,
  ClubId,
  ClubInfo,
  DemoNotification,
  DemoStudentRecord,
  DraftEventItem,
  PortalTab,
} from '../types';
import {
  CLUBS_DATA,
  INITIAL_DEMO_STUDENTS,
  INITIAL_DRAFT_EVENTS,
  INITIAL_NOTIFICATIONS,
} from '../data/divData';

export interface ScrollMetrics {
  scrollY: number;
  progress: number;
  velocity: number;
}

interface DivContextValue {
  route: string;
  navigate: (to: string, opts?: { preselectClub?: ClubId }) => void;
  scrollToTop: () => void;
  scrollToElement: (elementId: string) => void;
  scrollMetricsRef: React.MutableRefObject<ScrollMetrics>;

  // Pre-selections & Portal tabs
  preselectedClub: ClubId | null;
  setPreselectedClub: (clubId: ClubId | null) => void;
  portalTab: PortalTab;
  setPortalTab: (tab: PortalTab) => void;
  adminTab: AdminTab;
  setAdminTab: (tab: AdminTab) => void;
  adminRole: AdminRole;
  setAdminRole: (role: AdminRole) => void;

  // Interactive Demo Student state
  demoProfile: {
    name: string;
    email: string;
    department: string;
    academicYear: string;
    divId: string;
  };
  updateDemoProfile: (patch: Partial<DivContextValue['demoProfile']>) => void;
  joinedClubIds: ClubId[];
  toggleClubMembership: (clubId: ClubId) => void;
  savedEventIds: string[];
  toggleSavedEvent: (eventId: string) => void;
  notifications: DemoNotification[];
  markNotificationRead: (id: string) => void;

  // Interactive Demo Admin state
  clubs: ClubInfo[];
  updateClubLeader: (clubId: ClubId, leaderName: string) => void;
  students: DemoStudentRecord[];
  reviewStudent: (studentId: string, decision: 'Active' | 'Rejected') => void;
  draftEvents: DraftEventItem[];
  addDraftEvent: (draft: Omit<DraftEventItem, 'id'>) => void;
  auditTrail: {
    action: string;
    content: string;
    by: string;
    state: string;
  }[];

  // Modals
  activeModal: ActiveModal;
  setActiveModal: (modal: ActiveModal) => void;
}

const DivContext = createContext<DivContextValue | null>(null);

function parseHashRoute(): string {
  const hash = window.location.hash;
  if (!hash || hash === '#') return '/';
  return hash.startsWith('#') ? hash.slice(1) : hash;
}

export function DivProvider({ children }: { children: React.ReactNode }) {
  const [route, setRoute] = useState<string>(() => parseHashRoute());
  const [preselectedClub, setPreselectedClub] = useState<ClubId | null>(null);
  const [portalTab, setPortalTab] = useState<PortalTab>('overview');
  const [adminTab, setAdminTab] = useState<AdminTab>('overview');
  const [adminRole, setAdminRole] = useState<AdminRole>('Super Admin');

  const [demoProfile, setDemoProfile] = useState({
    name: 'Demo Student',
    email: 'student@example.edu',
    department: 'Sample department',
    academicYear: 'To be selected',
    divId: 'DIV-DEMO-0001',
  });

  const [joinedClubIds, setJoinedClubIds] = useState<ClubId[]>([
    'coding',
    'social-media',
  ]);
  const [savedEventIds, setSavedEventIds] = useState<string[]>([
    'build-beyond-the-brief',
    'your-first-web-experience',
  ]);
  const [notifications, setNotifications] = useState<DemoNotification[]>(
    INITIAL_NOTIFICATIONS,
  );
  const [clubs, setClubs] = useState<ClubInfo[]>(CLUBS_DATA);
  const [students, setStudents] = useState<DemoStudentRecord[]>(
    INITIAL_DEMO_STUDENTS,
  );
  const [draftEvents, setDraftEvents] =
    useState<DraftEventItem[]>(INITIAL_DRAFT_EVENTS);
  const [auditTrail, setAuditTrail] = useState([
    {
      action: 'Template preview',
      content: 'Demo certificate',
      by: 'Demo admin',
      state: 'Draft',
    },
    {
      action: 'Announcement drafted',
      content: 'Welcome message',
      by: 'Demo admin',
      state: 'Draft',
    },
    {
      action: 'Media review requested',
      content: 'Illustrative photo collection',
      by: 'Demo admin',
      state: 'In review',
    },
  ]);

  const [activeModal, setActiveModal] = useState<ActiveModal>(null);

  const lenisRef = useRef<Lenis | null>(null);
  const scrollMetricsRef = useRef<ScrollMetrics>({
    scrollY: 0,
    progress: 0,
    velocity: 0,
  });

  // Initialize Lenis smooth scrolling globally
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;

    if (prefersReducedMotion) {
      const onScroll = () => {
        const max = Math.max(
          1,
          document.documentElement.scrollHeight - window.innerHeight,
        );
        scrollMetricsRef.current.scrollY = window.scrollY;
        scrollMetricsRef.current.progress = Math.min(1, window.scrollY / max);
        scrollMetricsRef.current.velocity = 0;
      };
      window.addEventListener('scroll', onScroll, { passive: true });
      return () => window.removeEventListener('scroll', onScroll);
    }

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 0.95,
      touchMultiplier: 1.5,
    });
    lenisRef.current = lenis;

    lenis.on('scroll', (e: Lenis) => {
      const max = Math.max(
        1,
        document.documentElement.scrollHeight - window.innerHeight,
      );
      scrollMetricsRef.current.scrollY = e.scroll;
      scrollMetricsRef.current.progress = Math.min(1, e.scroll / max);
      scrollMetricsRef.current.velocity = e.velocity;
    });

    let rafId = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  // Listen to browser hashchange
  useEffect(() => {
    const onHashChange = () => {
      setRoute(parseHashRoute());
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const scrollToTop = useCallback(() => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { duration: 1.05 });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  const scrollToElement = useCallback((elementId: string) => {
    const el = document.getElementById(elementId);
    if (!el) return;
    if (lenisRef.current) {
      lenisRef.current.scrollTo(el, { offset: -72, duration: 1.1 });
    } else {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  const navigate = useCallback(
    (to: string, opts?: { preselectClub?: ClubId }) => {
      if (opts?.preselectClub) {
        setPreselectedClub(opts.preselectClub);
      }
      const normalized = to.startsWith('/') ? to : `/${to}`;
      if (window.location.hash !== `#${normalized}`) {
        window.location.hash = `#${normalized}`;
      }
      setRoute(normalized);
      if (lenisRef.current) {
        lenisRef.current.scrollTo(0, { immediate: true });
      } else {
        window.scrollTo(0, 0);
      }
      scrollMetricsRef.current = { scrollY: 0, progress: 0, velocity: 0 };
    },
    [],
  );

  const updateDemoProfile = useCallback(
    (patch: Partial<DivContextValue['demoProfile']>) => {
      setDemoProfile((prev) => ({ ...prev, ...patch }));
    },
    [],
  );

  const toggleClubMembership = useCallback((clubId: ClubId) => {
    setJoinedClubIds((prev) =>
      prev.includes(clubId)
        ? prev.filter((id) => id !== clubId)
        : [...prev, clubId],
    );
  }, []);

  const toggleSavedEvent = useCallback((eventId: string) => {
    setSavedEventIds((prev) =>
      prev.includes(eventId)
        ? prev.filter((id) => id !== eventId)
        : [...prev, eventId],
    );
  }, []);

  const markNotificationRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, unread: false } : n)),
    );
  }, []);

  const updateClubLeader = useCallback((clubId: ClubId, leaderName: string) => {
    setClubs((prev) =>
      prev.map((c) =>
        c.id === clubId
          ? { ...c, leader: leaderName.trim() || 'To be confirmed' }
          : c,
      ),
    );
    setAuditTrail((prev) => [
      {
        action: 'Club leadership updated',
        content: `${clubId} → ${leaderName.trim() || 'To be confirmed'}`,
        by: 'Super Admin',
        state: 'Recorded',
      },
      ...prev,
    ]);
  }, []);

  const reviewStudent = useCallback(
    (studentId: string, decision: 'Active' | 'Rejected') => {
      setStudents((prev) =>
        prev.map((s, idx) => {
          if (s.id !== studentId) return s;
          return {
            ...s,
            status: decision,
            divId:
              decision === 'Active' && s.divId === 'Not assigned'
                ? `DIV-DEMO-000${idx + 1}`
                : decision === 'Rejected'
                  ? 'Not assigned'
                  : s.divId,
          };
        }),
      );
      setAuditTrail((prev) => [
        {
          action:
            decision === 'Active'
              ? 'Membership approved'
              : 'Membership declined',
          content: studentId,
          by: 'Super Admin',
          state: decision,
        },
        ...prev,
      ]);
    },
    [],
  );

  const addDraftEvent = useCallback(
    (draft: Omit<DraftEventItem, 'id'>) => {
      setDraftEvents((prev) => [
        {
          ...draft,
          id: `draft-${Date.now()}`,
        },
        ...prev,
      ]);
      setAuditTrail((prev) => [
        {
          action: 'Event drafted',
          content: draft.title,
          by: 'Demo admin',
          state: draft.status,
        },
        ...prev,
      ]);
    },
    [],
  );

  return (
    <DivContext.Provider
      value={{
        route,
        navigate,
        scrollToTop,
        scrollToElement,
        scrollMetricsRef,
        preselectedClub,
        setPreselectedClub,
        portalTab,
        setPortalTab,
        adminTab,
        setAdminTab,
        adminRole,
        setAdminRole,
        demoProfile,
        updateDemoProfile,
        joinedClubIds,
        toggleClubMembership,
        savedEventIds,
        toggleSavedEvent,
        notifications,
        markNotificationRead,
        clubs,
        updateClubLeader,
        students,
        reviewStudent,
        draftEvents,
        addDraftEvent,
        auditTrail,
        activeModal,
        setActiveModal,
      }}
    >
      {children}
    </DivContext.Provider>
  );
}

export function useDiv() {
  const ctx = useContext(DivContext);
  if (!ctx) throw new Error('useDiv must be used within DivProvider');
  return ctx;
}
