import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import { useDiv } from '../../context/DivContext';

export function ModalHost() {
  const {
    activeModal,
    setActiveModal,
    navigate,
    students,
    reviewStudent,
    clubs,
    updateClubLeader,
    draftEvents,
  } = useDiv();

  const [leaderInput, setLeaderInput] = useState('');

  useEffect(() => {
    if (activeModal?.type === 'edit-club-head') {
      const club = clubs.find((c) => c.id === activeModal.clubId);
      setLeaderInput(
        club && club.leader !== 'To be confirmed' ? club.leader : '',
      );
    }
  }, [activeModal, clubs]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && activeModal) {
        setActiveModal(null);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [activeModal, setActiveModal]);

  const close = () => setActiveModal(null);

  return (
    <AnimatePresence>
      {activeModal && (
        <motion.div
          key="div-modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={close}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 sm:p-6"
          role="dialog"
          aria-modal="true"
        >
          <motion.div
            key="div-modal-panel"
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className={`relative w-full overflow-hidden rounded-xl border border-[#DAB24C]/55 bg-[#080807] text-[#F5ECCD] shadow-2xl ${
              activeModal.type === 'lightbox' ||
              activeModal.type === 'video-placeholder'
                ? 'max-w-4xl p-5 sm:p-8'
                : 'max-w-xl p-6 sm:p-8'
            }`}
          >
            {/* Page 46: Enquiry previewed */}
            {activeModal.type === 'enquiry' && (
              <div>
                <h2 className="font-display text-2xl font-bold text-[#F8ECAB] sm:text-3xl">
                  Your enquiry, previewed.
                </h2>
                <p className="mt-4 text-sm leading-relaxed text-[#E5DEC0] sm:text-base">
                  This is a design demonstration. No message has been sent. The
                  finished website will connect this form to an approved contact
                  channel.
                </p>
                {activeModal.name && (
                  <p className="mt-3 font-mono text-xs text-[#9E967C]">
                    Previewed for {activeModal.name} · {activeModal.subject}
                  </p>
                )}
                <button
                  type="button"
                  onClick={close}
                  className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-[#DAB24C] hover:text-[#F8ECAB] focus-visible:outline-2 focus-visible:outline-[#DAB24C]"
                >
                  Close preview <X className="h-3.5 w-3.5" />
                </button>
              </div>
            )}

            {/* Page 47: Membership preview */}
            {activeModal.type === 'membership-preview' && (
              <div>
                <h2 className="font-display text-2xl font-bold text-[#F8ECAB] sm:text-3xl">
                  Your DIV journey starts here.
                </h2>
                <p className="mt-4 text-sm leading-relaxed text-[#E5DEC0] sm:text-base">
                  This preview does not create an account or submit an
                  application. Explore the sample student portal to see the
                  membership experience.
                </p>
                <div className="mt-8 flex flex-col items-start gap-4">
                  <button
                    type="button"
                    onClick={() => {
                      close();
                      navigate('/portal');
                    }}
                    className="inline-flex items-center gap-2 text-sm font-medium text-[#DAB24C] hover:text-[#F8ECAB]"
                  >
                    Explore demo dashboard ↗
                  </button>
                  <button
                    type="button"
                    onClick={close}
                    className="inline-flex items-center gap-2 text-sm font-medium text-[#DAB24C] hover:text-[#F8ECAB]"
                  >
                    Close preview <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* Pages 48-49: Review membership */}
            {activeModal.type === 'review-student' && (() => {
              const stu = students.find((s) => s.id === activeModal.studentId);
              if (!stu) return null;
              return (
                <div>
                  <h2 className="font-display text-2xl font-bold text-[#F8ECAB] sm:text-3xl">
                    Review membership.
                  </h2>
                  <p className="mt-4 text-sm text-[#E5DEC0]">
                    {stu.name} · {stu.club} Club
                  </p>
                  <p className="mt-1 text-sm text-[#E5DEC0]">
                    Status: {stu.status}
                  </p>
                  <p className="mt-4 text-sm leading-relaxed text-[#C4BC9E]">
                    Assign a unique DIV ID after approval.
                    <br />
                    This preview does not alter real records.
                  </p>
                  <div className="mt-7 flex flex-wrap items-center gap-8">
                    <button
                      type="button"
                      onClick={() => {
                        reviewStudent(stu.id, 'Active');
                        close();
                      }}
                      className="text-sm font-medium text-[#DAB24C] hover:text-[#F8ECAB]"
                    >
                      Approve / preview
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        reviewStudent(stu.id, 'Rejected');
                        close();
                      }}
                      className="text-sm font-medium text-[#DAB24C] hover:text-[#F8ECAB]"
                    >
                      Reject / preview
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={close}
                    className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-[#DAB24C] hover:text-[#F8ECAB]"
                  >
                    Close preview <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              );
            })()}

            {/* Page 50: Draft previewed */}
            {activeModal.type === 'draft-preview' && (
              <div>
                <h2 className="font-display text-2xl font-bold text-[#F8ECAB] sm:text-3xl">
                  Your draft, previewed.
                </h2>
                <p className="mt-4 text-sm text-[#E5DEC0]">
                  {activeModal.title} · {activeModal.status}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-[#C4BC9E]">
                  No live record has been saved. A confirmed schedule and venue
                  are required before approval.
                </p>
                <button
                  type="button"
                  onClick={close}
                  className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-[#DAB24C] hover:text-[#F8ECAB]"
                >
                  Close preview <X className="h-3.5 w-3.5" />
                </button>
              </div>
            )}

            {/* Page 51: Sample report */}
            {activeModal.type === 'sample-report' && (() => {
              const activeCount = students.filter(
                (s) => s.status === 'Active',
              ).length;
              const pendingCount = students.filter(
                (s) => s.status === 'Pending review',
              ).length;
              const totalMemberships = students.reduce(
                (sum, s) => sum + s.clubIds.length,
                0,
              );
              return (
                <div>
                  <h2 className="font-display text-2xl font-bold text-[#F8ECAB] sm:text-3xl">
                    Sample report.
                  </h2>
                  <div className="mt-4 space-y-1 text-sm text-[#E5DEC0] tabular-nums">
                    <p className="font-medium text-[#F8ECAB]">
                      Demo dataset · {activeModal.reportTitle}
                    </p>
                    <p>
                      {students.length} students · {activeCount} active ·{' '}
                      {pendingCount} pending
                    </p>
                    <p>{totalMemberships} club memberships</p>
                    <p>
                      {draftEvents.length} draft events · 0 published
                    </p>
                  </div>
                  <p className="mt-4 text-sm text-[#C4BC9E]">
                    Real-time reports require implementation.
                  </p>
                  <button
                    type="button"
                    onClick={close}
                    className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-[#DAB24C] hover:text-[#F8ECAB]"
                  >
                    Close preview <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              );
            })()}

            {/* Page 52: Sample credential */}
            {activeModal.type === 'sample-certificate' && (
              <div>
                <h2 className="font-display text-2xl font-bold text-[#F8ECAB] sm:text-3xl">
                  A sample credential.
                </h2>
                <div className="mt-4 space-y-1 text-sm text-[#E5DEC0]">
                  <p>Demo Student</p>
                  <p className="font-mono text-[#DAB24C]">DEMO-CERT-0001</p>
                  <p>Demo learning session</p>
                </div>
                <p className="mt-4 text-sm text-[#C4BC9E]">
                  Not an official DIV certificate.
                </p>
                <button
                  type="button"
                  onClick={close}
                  className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-[#DAB24C] hover:text-[#F8ECAB]"
                >
                  Close preview <X className="h-3.5 w-3.5" />
                </button>
              </div>
            )}

            {/* Page 53: Forgot password */}
            {activeModal.type === 'forgot-password' && (
              <div>
                <h2 className="font-display text-2xl font-bold text-[#F8ECAB] sm:text-3xl">
                  Find your way back.
                </h2>
                <p className="mt-4 text-sm leading-relaxed text-[#E5DEC0]">
                  Enter your registered college email on the finished website to
                  request a secure reset link.
                </p>
                <p className="mt-3 text-sm text-[#C4BC9E]">
                  No email is sent from this design preview.
                </p>
                <button
                  type="button"
                  onClick={close}
                  className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-[#DAB24C] hover:text-[#F8ECAB]"
                >
                  Close preview <X className="h-3.5 w-3.5" />
                </button>
              </div>
            )}

            {/* Page 54: Access in context */}
            {activeModal.type === 'access-context' && (
              <div>
                <h2 className="font-display text-2xl font-bold text-[#F8ECAB] sm:text-3xl">
                  Access, in context.
                </h2>
                <p className="mt-4 text-sm leading-relaxed text-[#E5DEC0]">
                  Club Heads manage their own club.
                  <br />
                  Event Managers manage assigned events.
                </p>
                <p className="mt-4 text-sm leading-relaxed text-[#C4BC9E]">
                  Only Super Admins change role assignments. Record every
                  access change in the audit trail.
                </p>
                <button
                  type="button"
                  onClick={close}
                  className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-[#DAB24C] hover:text-[#F8ECAB]"
                >
                  Close preview <X className="h-3.5 w-3.5" />
                </button>
              </div>
            )}

            {/* Pages 55-59: Photo Lightbox */}
            {activeModal.type === 'lightbox' && (
              <div>
                <div className="overflow-hidden rounded-lg border border-white/10 bg-[#11110E]">
                  {activeModal.item.image ? (
                    <img
                      src={activeModal.item.image}
                      alt={activeModal.item.title}
                      referrerPolicy="no-referrer"
                      className="max-h-[65vh] w-full object-cover grayscale"
                    />
                  ) : (
                    <div className="flex h-72 items-center justify-center text-sm text-[#9E967C]">
                      {activeModal.item.title}
                    </div>
                  )}
                </div>
                <p className="mt-4 text-sm text-[#C4BC9E]">
                  Illustrative photography · Replace with approved DIV imagery.
                </p>
                <button
                  type="button"
                  onClick={close}
                  className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-[#DAB24C] hover:text-[#F8ECAB]"
                >
                  Close preview <X className="h-3.5 w-3.5" />
                </button>
              </div>
            )}

            {/* Page 60: Video Placeholder */}
            {activeModal.type === 'video-placeholder' && (
              <div className="py-10">
                <div className="mx-auto max-w-lg py-16">
                  <p className="font-display text-2xl font-medium text-[#DAB24C] sm:text-3xl">
                    Video coming soon.
                    <br />
                    Approved DIV footage will appear here.
                  </p>
                </div>
                <p className="mt-6 text-sm text-[#C4BC9E]">
                  Video placeholder · No playable media supplied.
                </p>
                <button
                  type="button"
                  onClick={close}
                  className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-[#DAB24C] hover:text-[#F8ECAB]"
                >
                  Close preview <X className="h-3.5 w-3.5" />
                </button>
              </div>
            )}

            {/* Admin edit club head */}
            {activeModal.type === 'edit-club-head' && (
              <div>
                <h2 className="font-display text-2xl font-bold text-[#F8ECAB]">
                  Assign club leadership.
                </h2>
                <p className="mt-2 text-sm text-[#C4BC9E]">
                  Update the demo Club Head display name for this club workspace.
                </p>
                <input
                  type="text"
                  value={leaderInput}
                  onChange={(e) => setLeaderInput(e.target.value)}
                  placeholder="Enter Club Head name"
                  className="mt-5 w-full rounded-lg border border-[#DAB24C]/40 bg-[#11110E] px-4 py-3 text-sm text-[#F5ECCD] placeholder:text-[#7E765F] focus:border-[#DAB24C] focus:outline-none"
                />
                <div className="mt-6 flex items-center gap-4">
                  <button
                    type="button"
                    onClick={() => {
                      updateClubLeader(activeModal.clubId, leaderInput);
                      close();
                    }}
                    className="rounded-lg bg-[#DAB24C] px-5 py-2.5 text-sm font-semibold text-[#080807] transition-colors hover:bg-[#E5C05E]"
                  >
                    Save assignment
                  </button>
                  <button
                    type="button"
                    onClick={close}
                    className="text-sm font-medium text-[#C4BC9E] hover:text-[#F8ECAB]"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
