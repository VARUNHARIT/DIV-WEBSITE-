import React, { useState } from 'react';
import { useDiv } from '../context/DivContext';
import { EVENTS_DATA } from '../data/divData';
import { DivLogoBadge, MembershipCard3D } from '../components/ui/DivBrandMark';
import type { PortalTab } from '../types';

const PORTAL_NAV: { id: PortalTab; label: string }[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'profile', label: 'Profile & ID' },
  { id: 'clubs', label: 'My clubs' },
  { id: 'events', label: 'My events' },
  { id: 'certificates', label: 'Certificates' },
  { id: 'notifications', label: 'Notifications' },
];

export function StudentPortalPage() {
  const {
    navigate,
    portalTab,
    setPortalTab,
    demoProfile,
    updateDemoProfile,
    clubs,
    joinedClubIds,
    toggleClubMembership,
    savedEventIds,
    notifications,
    markNotificationRead,
    setActiveModal,
  } = useDiv();

  const [editingProfile, setEditingProfile] = useState(false);
  const [draftName, setDraftName] = useState(demoProfile.name);
  const [draftDept, setDraftDept] = useState(demoProfile.department);
  const [draftYear, setDraftYear] = useState(demoProfile.academicYear);

  const [eventFilter, setEventFilter] = useState<
    'All registrations' | 'Upcoming' | 'Completed'
  >('All registrations');
  const [notifFilter, setNotifFilter] = useState<
    'All updates' | 'Unread' | 'Announcements'
  >('All updates');

  const joinedClubs = clubs.filter((c) => joinedClubIds.includes(c.id));
  const exploreClubs = clubs.filter((c) => !joinedClubIds.includes(c.id));

  const studentEvents = [
    ...EVENTS_DATA.filter((e) => savedEventIds.includes(e.id)).map((e) => ({
      id: e.id,
      title: e.title,
      schedule: e.date,
      status: 'Interest saved' as const,
      kind: 'Upcoming' as const,
      linkable: true,
    })),
    {
      id: 'demo-learning-session',
      title: 'Demo learning session',
      schedule: 'Demo archive',
      status: 'Completed' as const,
      kind: 'Completed' as const,
      linkable: false,
    },
  ];

  const filteredEvents =
    eventFilter === 'All registrations'
      ? studentEvents
      : studentEvents.filter((e) => e.kind === eventFilter);

  const filteredNotifs = notifications.filter((n) => {
    if (notifFilter === 'Unread') return n.unread;
    if (notifFilter === 'Announcements') return n.category === 'ANNOUNCEMENT';
    return true;
  });

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateDemoProfile({
      name: draftName.trim() || 'Demo Student',
      department: draftDept.trim() || 'Sample department',
      academicYear: draftYear.trim() || 'To be selected',
    });
    setEditingProfile(false);
  };

  const handleDownloadId = () => {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="760" height="440" viewBox="0 0 760 440">
      <rect width="760" height="440" rx="20" fill="#0C0C0A" stroke="#DAB24C" stroke-width="2"/>
      <text x="48" y="64" fill="#9E967C" font-family="monospace" font-size="14" letter-spacing="3">DIV / THE TECH CLUB</text>
      <text x="48" y="150" fill="#F8ECAB" font-family="sans-serif" font-size="34" font-weight="bold">${demoProfile.name}</text>
      <text x="48" y="190" fill="#DAB24C" font-family="monospace" font-size="18">${demoProfile.divId}</text>
      <text x="48" y="340" fill="#C4BC9E" font-family="monospace" font-size="14">STUDENT MEMBER</text>
      <text x="48" y="366" fill="#8D856C" font-family="sans-serif" font-size="13">Preview only · Not a valid credential</text>
    </svg>`;
    const blob = new Blob([svg], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${demoProfile.divId.toLowerCase()}-preview.svg`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#080807] text-[#F5ECCD] lg:flex-row">
      {/* Left Sidebar */}
      <aside className="flex w-full shrink-0 flex-col justify-between border-b border-white/10 bg-[#0A0A08] p-5 lg:w-64 lg:border-r lg:border-b-0">
        <div>
          <button
            type="button"
            onClick={() => navigate('/')}
            className="flex items-center gap-3 text-left"
          >
            <DivLogoBadge size={38} />
            <div>
              <p className="font-display text-base font-bold tracking-wide text-[#F8ECAB]">
                DIV
              </p>
              <p className="font-mono text-[10px] tracking-[0.14em] text-[#9E967C] uppercase">
                THE TECH CLUB
              </p>
            </div>
          </button>

          <p className="mt-8 font-mono text-[10px] tracking-[0.16em] text-[#7E765F] uppercase">
            STUDENT SPACE
          </p>

          <nav aria-label="Student portal" className="mt-3 flex flex-wrap gap-1.5 lg:flex-col">
            {PORTAL_NAV.map((item) => {
              const active = portalTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setPortalTab(item.id)}
                  className={`rounded-lg px-4 py-2.5 text-left text-sm font-medium whitespace-nowrap transition-colors ${
                    active
                      ? 'bg-[#DAB24C] font-semibold text-[#080807]'
                      : 'text-[#C4BC9E] hover:bg-[#141411] hover:text-[#F8ECAB]'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="mt-8 border-t border-white/10 pt-5">
          <p className="font-mono text-[10px] tracking-[0.12em] text-[#DAB24C] uppercase">
            DEMO WORKSPACE
          </p>
          <p className="mt-1 text-xs text-[#7E765F]">
            Sample data, not club records.
          </p>
          <div className="mt-5 space-y-2.5 text-xs">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="block text-[#C4BC9E] hover:text-[#F8ECAB]"
            >
              ← Back to website
            </button>
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="block text-[#9E967C] hover:text-[#DAB24C]"
            >
              Sign out
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex flex-1 flex-col">
        {/* Top Header */}
        <header className="flex items-center justify-between border-b border-white/10 px-6 py-4 sm:px-10">
          <p className="text-xs font-medium text-[#C4BC9E]">
            DIV / Student portal
          </p>
          <div className="flex items-center gap-3 text-xs text-[#E5DEC0]">
            <span>{demoProfile.name}</span>
            <button
              type="button"
              onClick={() => navigate('/admin')}
              className="font-mono text-[11px] text-[#DAB24C] hover:underline"
            >
              Admin view ↗
            </button>
          </div>
        </header>

        <main className="flex-1 p-6 sm:p-10">
          {/* TAB 1: Overview (Page 17) */}
          {portalTab === 'overview' && (
            <div className="mx-auto max-w-5xl">
              <p className="font-mono text-xs tracking-[0.14em] text-[#DAB24C] uppercase">
                YOUR DIV · OVERVIEW
              </p>
              <h1 className="mt-3 font-display text-3xl font-bold text-[#F8ECAB] sm:text-4xl">
                Welcome back, {demoProfile.name}.
              </h1>
              <p className="mt-2 text-sm text-[#C4BC9E]">
                Your community, opportunities and progress — all in one place.
              </p>

              {/* KPI Row */}
              <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="rounded-xl border border-white/10 bg-[#11110E] p-6">
                  <p className="font-display text-4xl font-bold text-[#DAB24C] tabular-nums">
                    {String(joinedClubIds.length).padStart(2, '0')}
                  </p>
                  <p className="mt-2 text-xs text-[#C4BC9E]">
                    Club memberships
                  </p>
                </div>
                <div className="rounded-xl border border-white/10 bg-[#11110E] p-6">
                  <p className="font-display text-4xl font-bold text-[#DAB24C] tabular-nums">
                    {String(studentEvents.length).padStart(2, '0')}
                  </p>
                  <p className="mt-2 text-xs text-[#C4BC9E]">
                    Event registrations
                  </p>
                </div>
                <div className="rounded-xl border border-white/10 bg-[#11110E] p-6">
                  <p className="font-display text-4xl font-bold text-[#DAB24C] tabular-nums">
                    01
                  </p>
                  <p className="mt-2 text-xs text-[#C4BC9E]">
                    Sample certificate
                  </p>
                </div>
              </div>

              {/* Card + Up Next Split */}
              <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-12">
                <div className="lg:col-span-6">
                  <MembershipCard3D
                    name={demoProfile.name}
                    divId={demoProfile.divId}
                    compact
                  />
                </div>
                <div className="flex flex-col justify-between rounded-xl border border-white/10 bg-[#11110E] p-6 lg:col-span-6">
                  <div>
                    <p className="font-mono text-[11px] tracking-[0.14em] text-[#DAB24C] uppercase">
                      UP NEXT · SAMPLE REGISTRATION
                    </p>
                    <h2 className="mt-4 font-display text-2xl font-bold text-[#F8ECAB]">
                      Build beyond the brief.
                    </h2>
                    <p className="mt-2 text-xs text-[#9E967C]">
                      Schedule to be announced
                      <br />
                      Coding Club · Registration preview
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setPortalTab('events')}
                    className="mt-8 inline-flex items-center gap-1.5 text-sm font-medium text-[#DAB24C] hover:text-[#F8ECAB]"
                  >
                    View my events ↗
                  </button>
                </div>
              </div>

              {/* Your activity */}
              <div className="mt-10">
                <h2 className="font-display text-xl font-bold text-[#F8ECAB]">
                  Your activity
                </h2>
                <div className="mt-4 divide-y divide-white/10 border-t border-white/10">
                  {[
                    'Joined Coding Club',
                    'Registered interest in a sample hackathon',
                    'Joined Social Media Club',
                  ].map((item) => (
                    <div
                      key={item}
                      className="flex items-center justify-between gap-4 py-4 text-sm"
                    >
                      <span className="text-[#E5DEC0]">{item}</span>
                      <span className="font-mono text-[11px] tracking-[0.12em] text-[#8D856C] uppercase">
                        DEMO ACTIVITY
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Profile & ID (Page 18) */}
          {portalTab === 'profile' && (
            <div className="mx-auto max-w-5xl">
              <p className="font-mono text-xs tracking-[0.14em] text-[#DAB24C] uppercase">
                MY PROFILE · DIGITAL MEMBERSHIP
              </p>
              <h1 className="mt-3 font-display text-3xl font-bold text-[#F8ECAB] sm:text-4xl">
                Make this space yours.
              </h1>
              <p className="mt-2 text-sm text-[#C4BC9E]">
                Demo identity · A real Student ID is assigned after membership
                approval.
              </p>

              <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-12">
                {/* Personal Profile Card */}
                <div className="rounded-xl border border-white/10 bg-[#11110E] p-7 lg:col-span-6">
                  <h2 className="font-display text-2xl font-bold text-[#F8ECAB]">
                    Personal profile
                  </h2>

                  {!editingProfile ? (
                    <div className="mt-6 space-y-5">
                      <div>
                        <p className="text-xs text-[#9E967C]">Full name</p>
                        <p className="mt-1 text-base text-[#F5ECCD]">
                          {demoProfile.name}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-[#9E967C]">College email</p>
                        <p className="mt-1 text-base text-[#F5ECCD]">
                          {demoProfile.email}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-[#9E967C]">Department</p>
                        <p className="mt-1 text-base text-[#F5ECCD]">
                          {demoProfile.department}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-[#9E967C]">Academic year</p>
                        <p className="mt-1 text-base text-[#F5ECCD]">
                          {demoProfile.academicYear}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setDraftName(demoProfile.name);
                          setDraftDept(demoProfile.department);
                          setDraftYear(demoProfile.academicYear);
                          setEditingProfile(true);
                        }}
                        className="pt-2 text-sm font-medium text-[#DAB24C] hover:text-[#F8ECAB]"
                      >
                        Edit profile ↗
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleSaveProfile} className="mt-6 space-y-4">
                      <div>
                        <label className="text-xs text-[#9E967C]">
                          Full name
                        </label>
                        <input
                          type="text"
                          value={draftName}
                          onChange={(e) => setDraftName(e.target.value)}
                          className="mt-1 w-full rounded-lg border border-[#DAB24C]/40 bg-[#080807] px-3 py-2.5 text-sm text-[#F5ECCD]"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-[#9E967C]">
                          Department
                        </label>
                        <input
                          type="text"
                          value={draftDept}
                          onChange={(e) => setDraftDept(e.target.value)}
                          className="mt-1 w-full rounded-lg border border-[#DAB24C]/40 bg-[#080807] px-3 py-2.5 text-sm text-[#F5ECCD]"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-[#9E967C]">
                          Academic year
                        </label>
                        <input
                          type="text"
                          value={draftYear}
                          onChange={(e) => setDraftYear(e.target.value)}
                          className="mt-1 w-full rounded-lg border border-[#DAB24C]/40 bg-[#080807] px-3 py-2.5 text-sm text-[#F5ECCD]"
                        />
                      </div>
                      <div className="flex items-center gap-4 pt-2">
                        <button
                          type="submit"
                          className="rounded-lg bg-[#DAB24C] px-4 py-2 text-xs font-semibold text-[#080807]"
                        >
                          Save changes
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingProfile(false)}
                          className="text-xs text-[#9E967C] hover:text-[#F8ECAB]"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  )}
                </div>

                {/* Right Membership Card + Glance */}
                <div className="space-y-5 lg:col-span-6">
                  <MembershipCard3D
                    name={demoProfile.name}
                    divId={demoProfile.divId}
                    compact
                  />
                  <div className="rounded-xl border border-white/10 bg-[#11110E] p-7">
                    <h2 className="font-display text-xl font-bold text-[#F8ECAB]">
                      Your membership, at a glance.
                    </h2>
                    <p className="mt-3 font-mono text-xs text-[#DAB24C]">
                      {demoProfile.divId}
                    </p>
                    <p className="mt-3 text-sm leading-relaxed text-[#9E967C]">
                      QR encodes a demo preview only.
                      <br />
                      It does not verify a real membership.
                    </p>
                    <button
                      type="button"
                      onClick={handleDownloadId}
                      className="mt-6 text-sm font-medium text-[#DAB24C] hover:text-[#F8ECAB]"
                    >
                      Download ID preview ↓
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-8 border-t border-white/10 pt-6">
                <h2 className="font-display text-lg font-bold text-[#F8ECAB]">
                  Privacy first
                </h2>
                <p className="mt-2 text-xs text-[#9E967C]">
                  Only authorised coordinators can access membership details.
                  Never publish student contact information or QR credentials
                  without consent.
                </p>
              </div>
            </div>
          )}

          {/* TAB 3: My clubs (Page 19) */}
          {portalTab === 'clubs' && (
            <div className="mx-auto max-w-5xl">
              <p className="font-mono text-xs tracking-[0.14em] text-[#DAB24C] uppercase">
                MEMBERSHIPS · YOUR COMMUNITIES
              </p>
              <h1 className="mt-3 font-display text-3xl font-bold text-[#F8ECAB] sm:text-4xl">
                You belong here.
              </h1>
              <p className="mt-2 text-sm text-[#C4BC9E]">
                {joinedClubs.length} active memberships in this demo. Explore
                more whenever you’re ready.
              </p>

              <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2">
                {joinedClubs.map((club) => (
                  <div
                    key={club.id}
                    className="flex flex-col justify-between rounded-xl border border-white/10 bg-[#11110E] p-7"
                  >
                    <div>
                      <p className="font-mono text-[11px] tracking-[0.14em] text-[#DAB24C] uppercase">
                        ACTIVE · DEMO MEMBERSHIP
                      </p>
                      <h2 className="mt-4 font-display text-2xl font-bold text-[#F8ECAB]">
                        {club.shortName}
                      </h2>
                      <p className="mt-2 text-sm text-[#9E967C]">
                        {club.tags.join(' · ')}
                      </p>
                    </div>
                    <div className="mt-8 flex items-center justify-between gap-4">
                      <button
                        type="button"
                        onClick={() => navigate(`/clubs/${club.id}`)}
                        className="text-sm font-medium text-[#DAB24C] hover:text-[#F8ECAB]"
                      >
                        Visit club ↗
                      </button>
                      <button
                        type="button"
                        onClick={() => toggleClubMembership(club.id)}
                        className="text-xs text-[#8D856C] hover:text-[#E5DEC0]"
                      >
                        Leave demo
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {exploreClubs.length > 0 && (
                <div className="mt-12">
                  <h2 className="font-display text-2xl font-bold text-[#F8ECAB]">
                    Keep exploring
                  </h2>
                  <div className="mt-4 space-y-3">
                    {exploreClubs.map((club) => (
                      <div
                        key={club.id}
                        className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-white/10 bg-[#11110E] px-6 py-4"
                      >
                        <button
                          type="button"
                          onClick={() => navigate(`/clubs/${club.id}`)}
                          className="font-display text-base font-semibold text-[#F8ECAB] hover:text-[#DAB24C]"
                        >
                          {club.shortName}
                        </button>
                        <div className="flex items-center gap-6">
                          <button
                            type="button"
                            onClick={() => toggleClubMembership(club.id)}
                            className="text-xs font-medium text-[#C4BC9E] hover:text-[#F8ECAB]"
                          >
                            + Join demo
                          </button>
                          <button
                            type="button"
                            onClick={() => navigate(`/clubs/${club.id}`)}
                            className="text-xs font-medium text-[#DAB24C] hover:text-[#F8ECAB]"
                          >
                            Explore ↗
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: My events (Page 20) */}
          {portalTab === 'events' && (
            <div className="mx-auto max-w-5xl">
              <p className="font-mono text-xs tracking-[0.14em] text-[#DAB24C] uppercase">
                MY EVENTS · PARTICIPATION HISTORY
              </p>
              <h1 className="mt-3 font-display text-3xl font-bold text-[#F8ECAB] sm:text-4xl">
                Experiences worth showing up for.
              </h1>
              <p className="mt-2 text-sm text-[#C4BC9E]">
                Demo registrations and participation only. No live bookings are
                made.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-6 text-sm">
                {(['All registrations', 'Upcoming', 'Completed'] as const).map(
                  (tab) => (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => setEventFilter(tab)}
                      className={`pb-1 transition-colors ${
                        eventFilter === tab
                          ? 'border-b border-[#DAB24C] font-semibold text-[#DAB24C]'
                          : 'text-[#9E967C] hover:text-[#F8ECAB]'
                      }`}
                    >
                      {tab}
                    </button>
                  ),
                )}
              </div>

              <div className="mt-6 rounded-xl border border-white/10 bg-[#11110E] p-5 sm:p-6">
                <div className="hidden grid-cols-12 pb-3 font-mono text-[11px] tracking-[0.12em] text-[#8D856C] uppercase md:grid">
                  <span className="col-span-6">PROGRAMME</span>
                  <span className="col-span-4">SCHEDULE</span>
                  <span className="col-span-2 text-right">STATUS</span>
                </div>
                <div className="space-y-3">
                  {filteredEvents.map((ev) => (
                    <div
                      key={ev.id}
                      className="grid grid-cols-1 items-center gap-3 rounded-lg border border-white/5 bg-[#0B0B09] px-5 py-4 md:grid-cols-12"
                    >
                      <div className="md:col-span-6">
                        <p className="font-display text-base font-semibold text-[#F8ECAB]">
                          {ev.title}
                        </p>
                        <button
                          type="button"
                          onClick={() =>
                            ev.linkable
                              ? navigate(`/events/${ev.id}`)
                              : navigate('/events')
                          }
                          className="mt-1.5 text-xs font-medium text-[#DAB24C] hover:text-[#F8ECAB]"
                        >
                          View details ↗
                        </button>
                      </div>
                      <p className="text-xs text-[#C4BC9E] md:col-span-4">
                        {ev.schedule}
                      </p>
                      <p className="text-xs font-medium text-[#DAB24C] md:col-span-2 md:text-right">
                        {ev.status}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={() => navigate('/events')}
                className="mt-8 inline-flex items-center gap-1.5 text-sm font-medium text-[#DAB24C] hover:text-[#F8ECAB]"
              >
                Discover more events ↗
              </button>
              <p className="mt-4 text-xs text-[#8D856C]">
                Registration confirmations, attendance and certificates appear
                after coordinator approval.
              </p>
            </div>
          )}

          {/* TAB 5: Certificates (Page 21) */}
          {portalTab === 'certificates' && (
            <div className="mx-auto max-w-5xl">
              <p className="font-mono text-xs tracking-[0.14em] text-[#DAB24C] uppercase">
                CERTIFICATES · ACHIEVEMENTS
              </p>
              <h1 className="mt-3 font-display text-3xl font-bold text-[#F8ECAB] sm:text-4xl">
                Small steps. Meaningful progress.
              </h1>
              <p className="mt-2 text-sm text-[#C4BC9E]">
                One sample certificate and two demo badges. These are not
                official credentials.
              </p>

              <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-12">
                <div className="flex flex-col justify-between rounded-xl bg-[#F8ECAB] p-8 text-[#0D0D0B] lg:col-span-7">
                  <div>
                    <p className="font-display text-lg font-bold tracking-wide">
                      DIVE INTO VISION
                    </p>
                    <p className="mt-2 font-mono text-[11px] tracking-[0.12em] text-[#5B5237] uppercase">
                      CERTIFICATE PREVIEW
                    </p>
                    <h2 className="mt-8 font-display text-3xl font-bold sm:text-4xl">
                      {demoProfile.name}
                    </h2>
                    <p className="mt-3 text-sm text-[#2C281E]">
                      Sample participation · Demo learning session
                    </p>
                  </div>
                  <p className="mt-12 font-mono text-[11px] tracking-[0.12em] text-[#5B5237] uppercase">
                    NOT AN OFFICIAL CERTIFICATE
                  </p>
                </div>

                <div className="flex flex-col justify-between rounded-xl border border-white/10 bg-[#11110E] p-7 lg:col-span-5">
                  <div>
                    <h2 className="font-display text-2xl font-bold text-[#F8ECAB]">
                      Demo learning session
                    </h2>
                    <dl className="mt-6 space-y-3 text-sm">
                      <div className="flex justify-between">
                        <dt className="text-[#9E967C]">Type</dt>
                        <dd className="text-[#E5DEC0]">Participation</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-[#9E967C]">ID</dt>
                        <dd className="font-mono text-[#DAB24C]">
                          DEMO-CERT-0001
                        </dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-[#9E967C]">Issued</dt>
                        <dd className="text-[#E5DEC0]">Demo archive</dd>
                      </div>
                    </dl>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setActiveModal({ type: 'sample-certificate' })
                    }
                    className="mt-8 text-left text-sm font-medium text-[#DAB24C] hover:text-[#F8ECAB]"
                  >
                    View sample certificate ↗
                  </button>
                </div>
              </div>

              <div className="mt-12">
                <h2 className="font-display text-2xl font-bold text-[#F8ECAB]">
                  Achievements
                </h2>
                <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
                  {[
                    {
                      title: 'First step',
                      desc: 'Joined your first demo club',
                    },
                    {
                      title: 'Community builder',
                      desc: 'Explored two demo communities',
                    },
                  ].map((badge) => (
                    <div
                      key={badge.title}
                      className="rounded-xl border border-white/10 bg-[#11110E] p-6"
                    >
                      <p className="font-display text-xl font-bold text-[#F8ECAB]">
                        <span className="mr-2 text-[#DAB24C]">✦</span>
                        {badge.title}
                      </p>
                      <p className="mt-2 text-sm text-[#9E967C]">{badge.desc}</p>
                      <p className="mt-5 font-mono text-[10px] tracking-[0.14em] text-[#7E765F] uppercase">
                        DEMO BADGE
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: Notifications (Page 22) */}
          {portalTab === 'notifications' && (
            <div className="mx-auto max-w-5xl">
              <p className="font-mono text-xs tracking-[0.14em] text-[#DAB24C] uppercase">
                IN THE LOOP · ANNOUNCEMENTS
              </p>
              <h1 className="mt-3 font-display text-3xl font-bold text-[#F8ECAB] sm:text-4xl">
                Your community, connected.
              </h1>
              <p className="mt-2 text-sm text-[#C4BC9E]">
                A demonstration inbox for announcements, reminders and
                membership updates.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-6 text-sm">
                {(['All updates', 'Unread', 'Announcements'] as const).map(
                  (tab) => (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => setNotifFilter(tab)}
                      className={`pb-1 transition-colors ${
                        notifFilter === tab
                          ? 'border-b border-[#DAB24C] font-semibold text-[#DAB24C]'
                          : 'text-[#9E967C] hover:text-[#F8ECAB]'
                      }`}
                    >
                      {tab}
                    </button>
                  ),
                )}
              </div>

              <div className="mt-6 space-y-4">
                {filteredNotifs.length === 0 ? (
                  <div className="rounded-xl border border-white/10 bg-[#11110E] p-8 text-sm text-[#9E967C]">
                    No notifications match this filter.
                  </div>
                ) : (
                  filteredNotifs.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => markNotificationRead(n.id)}
                      className="flex cursor-pointer items-start justify-between gap-4 rounded-xl border border-white/10 bg-[#11110E] p-6 transition-colors hover:border-[#DAB24C]/40"
                    >
                      <div>
                        <p className="font-mono text-[11px] tracking-[0.14em] text-[#DAB24C] uppercase">
                          {n.category}
                        </p>
                        <h2 className="mt-2 font-display text-xl font-bold text-[#F8ECAB]">
                          {n.title}
                        </h2>
                        <p className="mt-1.5 text-sm text-[#C4BC9E]">{n.body}</p>
                      </div>
                      <span className="shrink-0 font-mono text-[11px] text-[#9E967C]">
                        {n.unread ? 'Unread' : 'Read'}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
