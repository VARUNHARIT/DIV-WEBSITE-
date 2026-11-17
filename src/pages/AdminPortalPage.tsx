import React, { useState } from 'react';
import { useDiv } from '../context/DivContext';
import { DivLogoBadge } from '../components/ui/DivBrandMark';
import { ROLE_PERMISSIONS_MATRIX } from '../data/divData';
import type { AdminRole, AdminTab } from '../types';

const ADMIN_NAV: { id: AdminTab; label: string }[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'students', label: 'Students' },
  { id: 'clubs', label: 'Clubs & team' },
  { id: 'events', label: 'Events' },
  { id: 'create-event', label: 'Create event' },
  { id: 'content', label: 'Content' },
  { id: 'roles', label: 'Roles & access' },
  { id: 'analytics', label: 'Analytics' },
];

const ADMIN_ROLES: AdminRole[] = [
  'Super Admin',
  'Faculty Coordinator',
  'President',
  'Vice President',
  'Club Head',
  'Event Manager',
];

export function AdminPortalPage() {
  const {
    navigate,
    adminTab,
    setAdminTab,
    adminRole,
    setAdminRole,
    students,
    clubs,
    draftEvents,
    addDraftEvent,
    auditTrail,
    setActiveModal,
  } = useDiv();

  const [studentQuery, setStudentQuery] = useState('');
  const [studentStatusFilter, setStudentStatusFilter] = useState<
    'All statuses' | 'Active' | 'Pending review' | 'Rejected'
  >('All statuses');
  const [eventTabFilter, setEventTabFilter] = useState<
    'All programmes' | 'Drafts' | 'Published' | 'Archived'
  >('Drafts');

  // Create Event Form State (Page 27)
  const [evTitle, setEvTitle] = useState('Build beyond the brief.');
  const [evClub, setEvClub] = useState('Coding Club');
  const [evCategory, setEvCategory] = useState('Hackathon');
  const [evDate, setEvDate] = useState('');
  const [evVenue, setEvVenue] = useState('');
  const [evDesc, setEvDesc] = useState('');
  const [evEligibility, setEvEligibility] = useState('');
  const [coverAttached, setCoverAttached] = useState(false);

  const pendingStudents = students.filter((s) => s.status === 'Pending review');
  const activeStudents = students.filter((s) => s.status === 'Active');

  const filteredStudents = students.filter((s) => {
    const matchesStatus =
      studentStatusFilter === 'All statuses' || s.status === studentStatusFilter;
    const q = studentQuery.toLowerCase().trim();
    const matchesQuery =
      !q ||
      s.name.toLowerCase().includes(q) ||
      s.divId.toLowerCase().includes(q) ||
      s.club.toLowerCase().includes(q);
    return matchesStatus && matchesQuery;
  });

  const filteredDrafts = draftEvents.filter((d) => {
    if (eventTabFilter === 'All programmes') return true;
    if (eventTabFilter === 'Drafts') return d.status === 'Draft';
    if (eventTabFilter === 'Published') return d.status === 'Published';
    return d.status === 'Archived';
  });

  // Compute live club membership bar heights for Analytics (Page 30)
  const clubBarStats = [
    {
      label: 'Coding',
      count: students.filter((s) => s.clubIds.includes('coding')).length,
    },
    {
      label: 'Industry',
      count: students.filter((s) => s.clubIds.includes('industry-readiness'))
        .length,
    },
    {
      label: 'Cultural',
      count: students.filter((s) => s.clubIds.includes('cultural')).length,
    },
    {
      label: 'Sports',
      count: students.filter((s) => s.clubIds.includes('sports')).length,
    },
    {
      label: 'Social',
      count: students.filter((s) => s.clubIds.includes('social-media')).length,
    },
  ];
  const maxBar = Math.max(1, ...clubBarStats.map((b) => b.count));

  const missingDetails = !evDate.trim() || !evVenue.trim() || !evDesc.trim();

  const handleSaveDraft = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanTitle = evTitle.trim() || 'Untitled programme';
    addDraftEvent({
      kicker: `${evCategory.toUpperCase()} / ${evClub.toUpperCase()}`,
      title: cleanTitle,
      club: evClub,
      category: evCategory,
      date: evDate.trim() || 'Date & venue pending',
      venue: evVenue.trim() || 'To be confirmed',
      description: evDesc.trim() || 'Draft programme description pending.',
      eligibility: evEligibility.trim() || 'Open to all skill levels',
      status: 'Draft',
    });
    setActiveModal({
      type: 'draft-preview',
      title: cleanTitle,
      status: 'Draft',
    });
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#080807] text-[#F5ECCD] lg:flex-row">
      {/* Left Admin Sidebar */}
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
            ADMIN WORKSPACE
          </p>

          <nav aria-label="Administration" className="mt-3 flex flex-wrap gap-1.5 lg:flex-col">
            {ADMIN_NAV.map((item) => {
              const active = adminTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setAdminTab(item.id)}
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
        {/* Top Admin Header */}
        <header className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 px-6 py-4 sm:px-10">
          <p className="text-xs font-medium text-[#C4BC9E]">
            DIV / Administration
          </p>
          <div className="flex items-center gap-4">
            <label className="sr-only" htmlFor="admin-role-select">
              Select demo role
            </label>
            <select
              id="admin-role-select"
              value={adminRole}
              onChange={(e) => setAdminRole(e.target.value as AdminRole)}
              className="rounded-md border border-white/10 bg-[#11110E] px-3 py-1.5 text-xs text-[#F8ECAB] focus:border-[#DAB24C] focus:outline-none"
            >
              {ADMIN_ROLES.map((r) => (
                <option key={r} value={r} className="bg-[#0A0A08]">
                  {r}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => navigate('/portal')}
              className="font-mono text-[11px] text-[#DAB24C] hover:underline"
            >
              Student view ↗
            </button>
          </div>
        </header>

        <main className="flex-1 p-6 sm:p-10">
          {/* TAB 1: Overview (Page 23) */}
          {adminTab === 'overview' && (
            <div className="mx-auto max-w-5xl">
              <p className="font-mono text-xs tracking-[0.14em] text-[#DAB24C] uppercase">
                ADMINISTRATION · {adminRole.toUpperCase()}
              </p>
              <h1 className="mt-3 font-display text-3xl font-bold text-[#F8ECAB] sm:text-4xl">
                A clear view of your community.
              </h1>
              <p className="mt-2 text-sm text-[#C4BC9E]">
                Demo workspace · All counts below describe sample records, not
                DIV statistics.
              </p>

              {/* 4 KPI Cards */}
              <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-xl border border-white/10 bg-[#11110E] p-6">
                  <p className="font-display text-4xl font-bold text-[#DAB24C] tabular-nums">
                    {String(students.length).padStart(2, '0')}
                  </p>
                  <p className="mt-2 text-xs text-[#C4BC9E]">
                    Sample student records
                  </p>
                </div>
                <div className="rounded-xl border border-white/10 bg-[#11110E] p-6">
                  <p className="font-display text-4xl font-bold text-[#DAB24C] tabular-nums">
                    {String(pendingStudents.length).padStart(2, '0')}
                  </p>
                  <p className="mt-2 text-xs text-[#C4BC9E]">
                    Pending approvals
                  </p>
                </div>
                <div className="rounded-xl border border-white/10 bg-[#11110E] p-6">
                  <p className="font-display text-4xl font-bold text-[#DAB24C] tabular-nums">
                    {String(draftEvents.length).padStart(2, '0')}
                  </p>
                  <p className="mt-2 text-xs text-[#C4BC9E]">
                    Draft programmes
                  </p>
                </div>
                <div className="rounded-xl border border-white/10 bg-[#11110E] p-6">
                  <p className="font-display text-4xl font-bold text-[#DAB24C] tabular-nums">
                    05
                  </p>
                  <p className="mt-2 text-xs text-[#C4BC9E]">Club workspaces</p>
                </div>
              </div>

              {/* Needs Attention + Access with intention */}
              <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-12">
                <div className="flex flex-col justify-between rounded-xl border border-white/10 bg-[#11110E] p-7 lg:col-span-7">
                  <div>
                    <h2 className="font-display text-2xl font-bold text-[#F8ECAB]">
                      Needs your attention
                    </h2>
                    <div className="mt-5 space-y-3">
                      {pendingStudents.length === 0 ? (
                        <p className="text-sm text-[#9E967C]">
                          All demo membership applications have been reviewed.
                        </p>
                      ) : (
                        pendingStudents.map((stu) => (
                          <div
                            key={stu.id}
                            className="flex items-center justify-between gap-4 rounded-lg border border-white/10 bg-[#0A0A08] px-5 py-4"
                          >
                            <div>
                              <p className="font-display text-base font-semibold text-[#F8ECAB]">
                                {stu.name}
                              </p>
                              <p className="mt-0.5 text-xs text-[#9E967C]">
                                {stu.club} Club · Membership pending
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() =>
                                setActiveModal({
                                  type: 'review-student',
                                  studentId: stu.id,
                                })
                              }
                              className="text-xs font-medium text-[#DAB24C] hover:text-[#F8ECAB]"
                            >
                              Review ↗
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setAdminTab('students')}
                    className="mt-7 text-left text-xs font-medium text-[#DAB24C] hover:text-[#F8ECAB]"
                  >
                    View all students ↗
                  </button>
                </div>

                <div className="flex flex-col justify-between rounded-xl border border-white/10 bg-[#11110E] p-7 lg:col-span-5">
                  <div>
                    <h2 className="font-display text-2xl font-bold text-[#F8ECAB]">
                      Access, with intention.
                    </h2>
                    <ul className="mt-5 space-y-3 text-sm text-[#C4BC9E]">
                      <li>6 defined roles</li>
                      <li>Club- and event-scoped permissions</li>
                      <li>Approval before publication</li>
                      <li>Audit trail for administrative changes</li>
                    </ul>
                  </div>
                  <button
                    type="button"
                    onClick={() => setAdminTab('roles')}
                    className="mt-7 text-left text-xs font-medium text-[#DAB24C] hover:text-[#F8ECAB]"
                  >
                    Review permissions ↗
                  </button>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="mt-10">
                <h2 className="font-display text-xl font-bold text-[#F8ECAB]">
                  Quick actions
                </h2>
                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <button
                    type="button"
                    onClick={() => setAdminTab('create-event')}
                    className="rounded-xl bg-[#F8ECAB] px-6 py-5 text-left text-sm font-semibold text-[#0D0D0B] transition-colors hover:bg-[#EFE3A2]"
                  >
                    + Create event
                  </button>
                  <button
                    type="button"
                    onClick={() => setAdminTab('content')}
                    className="rounded-xl bg-[#F8ECAB] px-6 py-5 text-left text-sm font-semibold text-[#0D0D0B] transition-colors hover:bg-[#EFE3A2]"
                  >
                    Manage announcements
                  </button>
                  <button
                    type="button"
                    onClick={() => setAdminTab('analytics')}
                    className="rounded-xl bg-[#F8ECAB] px-6 py-5 text-left text-sm font-semibold text-[#0D0D0B] transition-colors hover:bg-[#EFE3A2]"
                  >
                    Open reports
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Students (Page 24) */}
          {adminTab === 'students' && (
            <div className="mx-auto max-w-5xl">
              <p className="font-mono text-xs tracking-[0.14em] text-[#DAB24C] uppercase">
                DIRECTORY · STUDENT MANAGEMENT
              </p>
              <h1 className="mt-3 font-display text-3xl font-bold text-[#F8ECAB] sm:text-4xl">
                Every member, thoughtfully managed.
              </h1>
              <p className="mt-2 text-sm text-[#C4BC9E] tabular-nums">
                {students.length} sample records · {activeStudents.length}{' '}
                active · {pendingStudents.length} pending · {adminRole} access
              </p>

              {/* Search & Status Filter */}
              <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-12">
                <input
                  type="text"
                  value={studentQuery}
                  onChange={(e) => setStudentQuery(e.target.value)}
                  placeholder="Search by student name, ID or club"
                  className="rounded-xl border border-white/10 bg-[#11110E] px-4 py-3 text-sm text-[#F5ECCD] placeholder:text-[#7E765F] focus:border-[#DAB24C] focus:outline-none sm:col-span-8"
                />
                <select
                  value={studentStatusFilter}
                  onChange={(e) =>
                    setStudentStatusFilter(
                      e.target.value as typeof studentStatusFilter,
                    )
                  }
                  className="rounded-xl border border-white/10 bg-[#11110E] px-4 py-3 text-sm text-[#DAB24C] focus:border-[#DAB24C] focus:outline-none sm:col-span-4"
                >
                  <option value="All statuses">All statuses</option>
                  <option value="Active">Active</option>
                  <option value="Pending review">Pending review</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>

              <div className="mt-6 rounded-xl border border-white/10 bg-[#11110E] p-5 sm:p-6">
                <div className="hidden grid-cols-12 pb-3 font-mono text-[11px] tracking-[0.12em] text-[#8D856C] uppercase md:grid">
                  <span className="col-span-4">STUDENT</span>
                  <span className="col-span-3">DIV ID</span>
                  <span className="col-span-3">CLUB</span>
                  <span className="col-span-2 text-right">STATUS</span>
                </div>
                <div className="space-y-3">
                  {filteredStudents.map((stu) => (
                    <div
                      key={stu.id}
                      className="grid grid-cols-1 items-center gap-3 rounded-lg border border-white/5 bg-[#0A0A08] px-5 py-4 md:grid-cols-12"
                    >
                      <div className="md:col-span-4">
                        <p className="font-medium text-[#F8ECAB]">{stu.name}</p>
                        {stu.status === 'Pending review' && (
                          <button
                            type="button"
                            onClick={() =>
                              setActiveModal({
                                type: 'review-student',
                                studentId: stu.id,
                              })
                            }
                            className="mt-1 text-xs text-[#DAB24C] hover:underline"
                          >
                            Review application ↗
                          </button>
                        )}
                      </div>
                      <p className="font-mono text-xs text-[#C4BC9E] tabular-nums md:col-span-3">
                        {stu.divId}
                      </p>
                      <p className="text-xs text-[#C4BC9E] md:col-span-3">
                        {stu.club}
                      </p>
                      <p
                        className={`text-xs font-medium md:col-span-2 md:text-right ${
                          stu.status === 'Active'
                            ? 'text-[#DAB24C]'
                            : stu.status === 'Rejected'
                              ? 'text-[#C46B5C]'
                              : 'text-[#E5B84B]'
                        }`}
                      >
                        {stu.status}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between text-xs text-[#8D856C] tabular-nums">
                <span>
                  Showing 1–{filteredStudents.length} of {students.length} demo
                  records
                </span>
                <span>← Previous &nbsp; 1 &nbsp; Next →</span>
              </div>
            </div>
          )}

          {/* TAB 3: Clubs & team (Page 25) */}
          {adminTab === 'clubs' && (
            <div className="mx-auto max-w-5xl">
              <p className="font-mono text-xs tracking-[0.14em] text-[#DAB24C] uppercase">
                COMMUNITIES · CLUBS &amp; TEAM
              </p>
              <h1 className="mt-3 font-display text-3xl font-bold text-[#F8ECAB] sm:text-4xl">
                Five clubs. Shared responsibility.
              </h1>
              <p className="mt-2 text-sm text-[#C4BC9E]">
                Manage club profiles, leadership roles and team assignments.
              </p>

              <div className="mt-8 space-y-4">
                {clubs.map((club) => (
                  <div
                    key={club.id}
                    className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-white/10 bg-[#11110E] px-6 py-5"
                  >
                    <div className="flex items-start gap-6">
                      <span className="font-mono text-sm text-[#DAB24C] tabular-nums">
                        {club.index}
                      </span>
                      <div>
                        <h2 className="font-display text-xl font-bold text-[#F8ECAB]">
                          {club.fullName}
                        </h2>
                        <p className="mt-1 text-xs text-[#9E967C]">
                          Club Head · {club.leader}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-2 text-xs">
                      <button
                        type="button"
                        onClick={() => navigate(`/clubs/${club.id}`)}
                        className="font-medium text-[#DAB24C] hover:text-[#F8ECAB]"
                      >
                        Edit profile ↗
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setActiveModal({
                            type: 'edit-club-head',
                            clubId: club.id,
                          })
                        }
                        className="text-[#C4BC9E] hover:text-[#F8ECAB]"
                      >
                        Assign head +
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-12 border-t border-white/10 pt-6">
                <p className="font-mono text-[11px] tracking-[0.14em] text-[#DAB24C] uppercase">
                  TEAM GOVERNANCE
                </p>
                <p className="mt-3 text-sm text-[#E5DEC0]">
                  Faculty Coordinator → President → Vice President → Club Heads
                  → Event Managers
                </p>
              </div>
            </div>
          )}

          {/* TAB 4: Events (Page 26) */}
          {adminTab === 'events' && (
            <div className="mx-auto max-w-5xl">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="font-mono text-xs tracking-[0.14em] text-[#DAB24C] uppercase">
                    PROGRAMMES · EVENT MANAGEMENT
                  </p>
                  <h1 className="mt-3 font-display text-3xl font-bold text-[#F8ECAB] sm:text-4xl">
                    Make the next experience happen.
                  </h1>
                  <p className="mt-2 text-sm text-[#C4BC9E] tabular-nums">
                    {draftEvents.length} demo drafts · Nothing is published or
                    accepting real registrations.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setAdminTab('create-event')}
                  className="rounded-lg bg-[#DAB24C] px-5 py-3 text-xs font-semibold text-[#080807] hover:bg-[#E5C05E]"
                >
                  + Create event
                </button>
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-6 text-sm tabular-nums">
                {(
                  ['All programmes', 'Drafts', 'Published', 'Archived'] as const
                ).map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setEventTabFilter(tab)}
                    className={`pb-1 transition-colors ${
                      eventTabFilter === tab
                        ? 'border-b border-[#DAB24C] font-semibold text-[#DAB24C]'
                        : 'text-[#9E967C] hover:text-[#F8ECAB]'
                    }`}
                  >
                    {tab === 'Drafts'
                      ? `Drafts ${String(draftEvents.length).padStart(2, '0')}`
                      : tab === 'Published'
                        ? 'Published 00'
                        : tab}
                  </button>
                ))}
              </div>

              <div className="mt-6 space-y-4">
                {filteredDrafts.length === 0 ? (
                  <div className="rounded-xl border border-white/10 bg-[#11110E] p-8 text-sm text-[#9E967C]">
                    No programmes in this state yet.
                  </div>
                ) : (
                  filteredDrafts.map((ev) => (
                    <div
                      key={ev.id}
                      className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-white/10 bg-[#11110E] px-6 py-6"
                    >
                      <div>
                        <p className="font-mono text-[11px] tracking-[0.12em] text-[#DAB24C] uppercase">
                          {ev.kicker}
                        </p>
                        <h2 className="mt-2 font-display text-2xl font-bold text-[#F8ECAB]">
                          {ev.title}
                        </h2>
                        <p className="mt-2 text-xs text-[#9E967C]">
                          {ev.date} · {ev.status}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setEvTitle(ev.title);
                          setEvClub(ev.club);
                          setEvCategory(ev.category);
                          setAdminTab('create-event');
                        }}
                        className="text-xs font-medium text-[#DAB24C] hover:text-[#F8ECAB]"
                      >
                        Edit draft ↗
                      </button>
                    </div>
                  ))
                )}
              </div>

              <div className="mt-12 border-t border-white/10 pt-6">
                <h2 className="font-display text-lg font-bold text-[#F8ECAB]">
                  Publishing checklist
                </h2>
                <p className="mt-2 text-sm text-[#C4BC9E]">
                  Confirm schedule → Define eligibility → Assign event manager →
                  Coordinator approval
                </p>
              </div>
            </div>
          )}

          {/* TAB 5: Create event (Page 27) */}
          {adminTab === 'create-event' && (
            <div className="mx-auto max-w-5xl">
              <p className="font-mono text-xs tracking-[0.14em] text-[#DAB24C] uppercase">
                AUTHORING · NEW EVENT
              </p>
              <h1 className="mt-3 font-display text-3xl font-bold text-[#F8ECAB] sm:text-4xl">
                An idea, ready to take shape.
              </h1>
              <p className="mt-2 text-sm text-[#C4BC9E]">
                Draft event · Complete the required details before requesting
                approval.
              </p>

              <form
                onSubmit={handleSaveDraft}
                className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12"
              >
                <div className="space-y-5 lg:col-span-8">
                  <div>
                    <label className="block text-xs font-medium text-[#F8ECAB]">
                      Event title *
                    </label>
                    <input
                      type="text"
                      value={evTitle}
                      onChange={(e) => setEvTitle(e.target.value)}
                      className="mt-2 w-full rounded-lg border border-[#DAB24C]/35 bg-[#0A0A08] px-4 py-3 text-sm text-[#F5ECCD]"
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-xs font-medium text-[#F8ECAB]">
                        Club *
                      </label>
                      <select
                        value={evClub}
                        onChange={(e) => setEvClub(e.target.value)}
                        className="mt-2 w-full rounded-lg border border-[#DAB24C]/35 bg-[#0A0A08] px-4 py-3 text-sm text-[#F5ECCD]"
                      >
                        {clubs.map((c) => (
                          <option key={c.id} value={c.shortName}>
                            {c.shortName}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[#F8ECAB]">
                        Category *
                      </label>
                      <select
                        value={evCategory}
                        onChange={(e) => setEvCategory(e.target.value)}
                        className="mt-2 w-full rounded-lg border border-[#DAB24C]/35 bg-[#0A0A08] px-4 py-3 text-sm text-[#F5ECCD]"
                      >
                        <option>Hackathon</option>
                        <option>Workshop</option>
                        <option>Competition</option>
                        <option>Technical Session</option>
                        <option>Cultural</option>
                        <option>Sports</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-xs font-medium text-[#F8ECAB]">
                        Date &amp; time *
                      </label>
                      <input
                        type="text"
                        value={evDate}
                        onChange={(e) => setEvDate(e.target.value)}
                        placeholder="Select a confirmed date"
                        className="mt-2 w-full rounded-lg border border-[#DAB24C]/35 bg-[#0A0A08] px-4 py-3 text-sm text-[#F5ECCD] placeholder:text-[#7E765F]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[#F8ECAB]">
                        Venue *
                      </label>
                      <input
                        type="text"
                        value={evVenue}
                        onChange={(e) => setEvVenue(e.target.value)}
                        placeholder="Add confirmed venue"
                        className="mt-2 w-full rounded-lg border border-[#DAB24C]/35 bg-[#0A0A08] px-4 py-3 text-sm text-[#F5ECCD] placeholder:text-[#7E765F]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#F8ECAB]">
                      Description *
                    </label>
                    <textarea
                      rows={3}
                      value={evDesc}
                      onChange={(e) => setEvDesc(e.target.value)}
                      placeholder="Describe the challenge and participant experience..."
                      className="mt-2 w-full rounded-lg border border-[#DAB24C]/35 bg-[#0A0A08] px-4 py-3 text-sm text-[#F5ECCD] placeholder:text-[#7E765F]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#F8ECAB]">
                      Eligibility &amp; registration
                    </label>
                    <input
                      type="text"
                      value={evEligibility}
                      onChange={(e) => setEvEligibility(e.target.value)}
                      placeholder="Add participation rules and capacity"
                      className="mt-2 w-full rounded-lg border border-[#DAB24C]/35 bg-[#0A0A08] px-4 py-3 text-sm text-[#F5ECCD] placeholder:text-[#7E765F]"
                    />
                  </div>

                  <div className="flex flex-wrap items-center gap-4 pt-2">
                    <button
                      type="submit"
                      className="rounded-lg bg-[#DAB24C] px-7 py-3.5 text-sm font-semibold text-[#080807] hover:bg-[#E5C05E]"
                    >
                      Save draft →
                    </button>
                    <button
                      type="button"
                      disabled={missingDetails}
                      onClick={() =>
                        setActiveModal({
                          type: 'draft-preview',
                          title: evTitle,
                          status: 'In review',
                        })
                      }
                      className={`rounded-lg border px-7 py-3.5 text-sm font-medium ${
                        missingDetails
                          ? 'cursor-not-allowed border-white/10 text-[#7E765F]'
                          : 'border-[#DAB24C] text-[#DAB24C] hover:bg-[#141411]'
                      }`}
                    >
                      Request approval
                    </button>
                  </div>

                  <p className="font-mono text-xs text-[#8D856C]">
                    Preview only · No event is saved to a live service.
                  </p>
                </div>

                {/* Right Cover Media & Workflow */}
                <div className="space-y-5 lg:col-span-4">
                  <div className="rounded-xl bg-[#F8ECAB] p-6 text-[#0D0D0B]">
                    <p className="font-mono text-[11px] tracking-[0.14em] text-[#5B5237] uppercase">
                      COVER MEDIA
                    </p>
                    <h2 className="mt-3 font-display text-2xl font-bold">
                      {coverAttached
                        ? 'Sample hackathon photograph selected.'
                        : 'Add an approved event photograph.'}
                    </h2>
                    <button
                      type="button"
                      onClick={() => setCoverAttached((prev) => !prev)}
                      className="mt-8 text-xs font-semibold text-[#0D0D0B] underline underline-offset-4"
                    >
                      {coverAttached ? 'Remove sample image' : 'Upload image ↑'}
                    </button>
                  </div>

                  <div className="rounded-xl border border-white/10 bg-[#11110E] p-6">
                    <h2 className="font-display text-xl font-bold text-[#F8ECAB]">
                      Publication workflow
                    </h2>
                    <p className="mt-4 font-mono text-xs text-[#C4BC9E]">
                      Draft → In review → Published
                    </p>
                    <p className="mt-4 text-xs leading-relaxed text-[#9E967C]">
                      Event Manager prepares.
                      <br />
                      Coordinator reviews.
                      <br />
                      Authorised role publishes.
                    </p>
                    {missingDetails && (
                      <p className="mt-5 font-mono text-xs text-[#DAB24C]">
                        Required details are missing.
                      </p>
                    )}
                  </div>
                </div>
              </form>
            </div>
          )}

          {/* TAB 6: Content (Page 28) */}
          {adminTab === 'content' && (
            <div className="mx-auto max-w-5xl">
              <p className="font-mono text-xs tracking-[0.14em] text-[#DAB24C] uppercase">
                PUBLISHING · CONTENT MANAGEMENT
              </p>
              <h1 className="mt-3 font-display text-3xl font-bold text-[#F8ECAB] sm:text-4xl">
                One home for your community content.
              </h1>
              <p className="mt-2 text-sm text-[#C4BC9E]">
                Certificate templates, announcements and gallery media — with
                approval built in.
              </p>

              <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-3">
                <div className="flex flex-col justify-between rounded-xl border border-white/10 bg-[#11110E] p-7">
                  <div>
                    <h2 className="font-display text-2xl font-bold text-[#F8ECAB]">
                      Certificates
                    </h2>
                    <p className="mt-4 font-mono text-[11px] text-[#DAB24C]">
                      DEMO-CERT-0001
                    </p>
                    <p className="mt-2 font-display text-lg font-semibold text-[#F5ECCD]">
                      Participation certificate preview
                    </p>
                    <p className="mt-4 text-xs leading-relaxed text-[#9E967C]">
                      Owner: Super Admin
                      <br />
                      Approval: Required
                      <br />
                      Status: Demo draft
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setActiveModal({ type: 'sample-certificate' })
                    }
                    className="mt-7 text-left text-xs font-medium text-[#DAB24C] hover:text-[#F8ECAB]"
                  >
                    Review template ↗
                  </button>
                </div>

                <div className="flex flex-col justify-between rounded-xl border border-white/10 bg-[#11110E] p-7">
                  <div>
                    <h2 className="font-display text-2xl font-bold text-[#F8ECAB]">
                      Announcements
                    </h2>
                    <p className="mt-4 font-mono text-[11px] text-[#DAB24C]">
                      DRAFT ANNOUNCEMENT
                    </p>
                    <p className="mt-2 font-display text-lg font-semibold text-[#F5ECCD]">
                      Welcome to the DIV community
                    </p>
                    <p className="mt-4 text-xs leading-relaxed text-[#9E967C]">
                      Owner: Super Admin
                      <br />
                      Approval: Required
                      <br />
                      Status: Demo draft
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setActiveModal({
                        type: 'draft-preview',
                        title: 'Welcome to the DIV community',
                        status: 'Demo draft',
                      })
                    }
                    className="mt-7 text-left text-xs font-medium text-[#DAB24C] hover:text-[#F8ECAB]"
                  >
                    Edit announcement ↗
                  </button>
                </div>

                <div className="flex flex-col justify-between rounded-xl border border-white/10 bg-[#11110E] p-7">
                  <div>
                    <h2 className="font-display text-2xl font-bold text-[#F8ECAB]">
                      Gallery
                    </h2>
                    <p className="mt-4 font-mono text-[11px] text-[#DAB24C]">
                      MEDIA LIBRARY
                    </p>
                    <p className="mt-2 font-display text-lg font-semibold text-[#F5ECCD]">
                      3 illustrative images · Not event media
                    </p>
                    <p className="mt-4 text-xs leading-relaxed text-[#9E967C]">
                      Owner: Super Admin
                      <br />
                      Approval: Required
                      <br />
                      Status: Demo draft
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => navigate('/gallery')}
                    className="mt-7 text-left text-xs font-medium text-[#DAB24C] hover:text-[#F8ECAB]"
                  >
                    Review gallery ↗
                  </button>
                </div>
              </div>

              {/* Audit Trail */}
              <div className="mt-8 rounded-xl border border-white/10 bg-[#11110E] p-6">
                <h2 className="font-display text-xl font-bold text-[#F8ECAB]">
                  Content review &amp; audit trail
                </h2>
                <div className="mt-5 overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-white/10 font-mono text-[11px] text-[#8D856C] uppercase">
                        <th className="pb-3 pr-4">ACTION</th>
                        <th className="pb-3 pr-4">CONTENT</th>
                        <th className="pb-3 pr-4">PERFORMED BY</th>
                        <th className="pb-3 text-right">STATE</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-[#E5DEC0]">
                      {auditTrail.map((row, idx) => (
                        <tr key={`${row.action}-${idx}`}>
                          <td className="py-3.5 pr-4">{row.action}</td>
                          <td className="py-3.5 pr-4">{row.content}</td>
                          <td className="py-3.5 pr-4">{row.by}</td>
                          <td className="py-3.5 text-right text-[#DAB24C]">
                            {row.state}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: Roles & access (Page 29) */}
          {adminTab === 'roles' && (
            <div className="mx-auto max-w-5xl">
              <p className="font-mono text-xs tracking-[0.14em] text-[#DAB24C] uppercase">
                GOVERNANCE · ROLES &amp; PERMISSIONS
              </p>
              <h1 className="mt-3 font-display text-3xl font-bold text-[#F8ECAB] sm:text-4xl">
                The right access. For the right role.
              </h1>
              <p className="mt-2 text-sm text-[#C4BC9E]">
                Proposed permission model · Prototype only, not enforced
                security.
              </p>

              <div className="mt-8 overflow-x-auto rounded-xl border border-white/10 bg-[#11110E] p-6">
                <table className="w-full min-w-[640px] text-left text-xs">
                  <thead>
                    <tr className="border-b border-white/10 font-mono text-[11px] text-[#8D856C] uppercase">
                      <th className="pb-3 pr-4">ROLE</th>
                      <th className="pb-3 pr-4">Students</th>
                      <th className="pb-3 pr-4">Clubs</th>
                      <th className="pb-3 pr-4">Team</th>
                      <th className="pb-3 pr-4">Events</th>
                      <th className="pb-3 pr-4">Content</th>
                      <th className="pb-3">Roles</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {ROLE_PERMISSIONS_MATRIX.map((r) => (
                      <tr
                        key={r.role}
                        onClick={() =>
                          setActiveModal({
                            type: 'access-context',
                            roleName: r.role,
                          })
                        }
                        className="cursor-pointer transition-colors hover:bg-[#171612]"
                      >
                        <td className="py-4 pr-4 font-semibold text-[#F8ECAB]">
                          {r.role}
                        </td>
                        <td className="py-4 pr-4 text-[#C4BC9E]">{r.students}</td>
                        <td className="py-4 pr-4 text-[#C4BC9E]">{r.clubs}</td>
                        <td className="py-4 pr-4 text-[#C4BC9E]">{r.team}</td>
                        <td className="py-4 pr-4 text-[#C4BC9E]">{r.events}</td>
                        <td className="py-4 pr-4 text-[#C4BC9E]">{r.content}</td>
                        <td className="py-4 text-[#DAB24C]">{r.roles}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-12">
                <div className="rounded-xl border border-white/10 bg-[#11110E] p-7 md:col-span-8">
                  <h2 className="font-display text-2xl font-bold text-[#F8ECAB]">
                    Scoped by design
                  </h2>
                  <p className="mt-3 text-sm leading-relaxed text-[#C4BC9E]">
                    Club Heads access their own club. Event Managers access
                    assigned events only. Role changes require Super Admin
                    approval.
                  </p>
                  <button
                    type="button"
                    onClick={() => setActiveModal({ type: 'access-context' })}
                    className="mt-4 text-xs font-medium text-[#DAB24C] hover:underline"
                  >
                    Inspect access scope ↗
                  </button>
                </div>
                <div className="rounded-xl bg-[#F8ECAB] p-7 text-[#0D0D0B] md:col-span-4">
                  <h2 className="font-display text-2xl font-bold">
                    Every change leaves a trace.
                  </h2>
                  <p className="mt-3 text-sm text-[#2C281E]">
                    Record the actor, scope, time and reason for permission
                    changes.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 8: Analytics (Page 30) */}
          {adminTab === 'analytics' && (
            <div className="mx-auto max-w-5xl">
              <p className="font-mono text-xs tracking-[0.14em] text-[#DAB24C] uppercase">
                INSIGHTS · ANALYTICS &amp; REPORTS
              </p>
              <h1 className="mt-3 font-display text-3xl font-bold text-[#F8ECAB] sm:text-4xl">
                Understand. Improve. Repeat.
              </h1>
              <p className="mt-2 text-sm text-[#C4BC9E] tabular-nums">
                Demo dataset only · {students.length} student records,{' '}
                {clubBarStats.reduce((s, b) => s + b.count, 0)} club
                memberships, {draftEvents.length} draft events.
              </p>

              <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-12">
                <div className="rounded-xl border border-white/10 bg-[#11110E] p-7 lg:col-span-8">
                  <h2 className="font-display text-2xl font-bold text-[#F8ECAB]">
                    Memberships by club
                  </h2>
                  <p className="mt-1 text-xs text-[#9E967C] tabular-nums">
                    {clubBarStats.reduce((s, b) => s + b.count, 0)} sample
                    memberships across 5 clubs
                  </p>

                  <div className="mt-8 grid h-52 grid-cols-5 items-end gap-4 pt-6">
                    {clubBarStats.map((bar) => (
                      <div
                        key={bar.label}
                        className="flex h-full flex-col items-center justify-end"
                      >
                        <span className="mb-2 font-mono text-sm font-semibold text-[#F8ECAB] tabular-nums">
                          {bar.count}
                        </span>
                        <div
                          style={{
                            height: `${Math.max(24, (bar.count / maxBar) * 140)}px`,
                          }}
                          className="w-full max-w-[76px] rounded-t-md bg-[#DAB24C] transition-all duration-300"
                        />
                        <span className="mt-3 text-xs text-[#C4BC9E]">
                          {bar.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col justify-between rounded-xl border border-white/10 bg-[#11110E] p-7 lg:col-span-4">
                  <div>
                    <h2 className="font-display text-2xl font-bold text-[#F8ECAB]">
                      Approval overview
                    </h2>
                    <div className="mt-6">
                      <p className="font-display text-4xl font-bold text-[#DAB24C] tabular-nums">
                        {String(activeStudents.length).padStart(2, '0')}
                      </p>
                      <p className="mt-1 text-xs text-[#C4BC9E]">
                        Active sample students
                      </p>
                    </div>
                    <div className="mt-6">
                      <p className="font-display text-4xl font-bold text-[#DAB24C] tabular-nums">
                        {String(pendingStudents.length).padStart(2, '0')}
                      </p>
                      <p className="mt-1 text-xs text-[#C4BC9E]">
                        Pending review
                      </p>
                    </div>
                  </div>
                  <p className="mt-8 font-mono text-[10px] tracking-[0.14em] text-[#8D856C] uppercase">
                    SAMPLE RECORDS ONLY
                  </p>
                </div>
              </div>

              {/* Reports Ready for Review */}
              <div className="mt-8 rounded-xl border border-white/10 bg-[#11110E] p-7">
                <h2 className="font-display text-xl font-bold text-[#F8ECAB]">
                  Reports, ready for review.
                </h2>
                <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-3">
                  {[
                    'Membership directory',
                    'Registration summary',
                    'Permissions audit',
                  ].map((report) => (
                    <div
                      key={report}
                      className="rounded-lg border border-white/10 bg-[#0A0A08] p-5"
                    >
                      <p className="font-display text-base font-semibold text-[#F8ECAB]">
                        {report}
                      </p>
                      <button
                        type="button"
                        onClick={() =>
                          setActiveModal({
                            type: 'sample-report',
                            reportTitle: report,
                          })
                        }
                        className="mt-3 text-xs font-medium text-[#DAB24C] hover:text-[#F8ECAB]"
                      >
                        Preview sample report ↗
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
