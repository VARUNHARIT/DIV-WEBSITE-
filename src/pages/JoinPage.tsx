import React, { useEffect, useState } from 'react';
import { useDiv } from '../context/DivContext';
import { MembershipCard3D, ScrollReveal3D } from '../components/ui/DivBrandMark';
import type { ClubId } from '../types';

const DEPARTMENTS = [
  'Computer Science & Engineering · 1st Year',
  'Computer Science & Engineering · 2nd Year',
  'Computer Science & Engineering · 3rd Year',
  'Computer Science & Engineering · 4th Year',
  'Information Technology · 2nd Year',
  'Electronics & Communication · 2nd Year',
  'Mechanical Engineering · 2nd Year',
];

export function JoinPage() {
  const {
    clubs,
    preselectedClub,
    setPreselectedClub,
    navigate,
    setActiveModal,
    updateDemoProfile,
  } = useDiv();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [departmentYear, setDepartmentYear] = useState('');
  const [selectedClubs, setSelectedClubs] = useState<ClubId[]>(() =>
    preselectedClub ? [preselectedClub] : [],
  );
  const [password, setPassword] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (preselectedClub) {
      setSelectedClubs((prev) =>
        prev.includes(preselectedClub) ? prev : [...prev, preselectedClub],
      );
      setPreselectedClub(null);
    }
  }, [preselectedClub, setPreselectedClub]);

  const toggleClub = (id: ClubId) => {
    setSelectedClubs((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.includes('@')) {
      setError('Please enter your full name and valid college email.');
      return;
    }
    if (password.length < 12) {
      setError('Password must be at least 12 characters in this preview.');
      return;
    }
    if (!agreed) {
      setError('Please agree to the membership terms and privacy policy.');
      return;
    }
    setError('');
    updateDemoProfile({
      name: fullName.trim(),
      email: email.trim(),
      department: departmentYear.split('·')[0]?.trim() || 'Sample department',
      academicYear: departmentYear.split('·')[1]?.trim() || 'To be selected',
    });
    setActiveModal({ type: 'membership-preview', name: fullName.trim() });
  };

  return (
    <div className="bg-[#080807] py-16 text-[#F5ECCD] sm:py-24">
      <div className="mx-auto max-w-[1360px] px-5 sm:px-8">
        <ScrollReveal3D>
          <p className="font-mono text-xs tracking-[0.14em] text-[#DAB24C] uppercase">
            MEMBERSHIP · YOUR NEXT CHAPTER
          </p>

          <div className="mt-6 grid grid-cols-1 items-start gap-14 lg:grid-cols-12">
            {/* Left Heading + Live 3D Card Preview */}
            <div className="lg:col-span-6">
              <h1 className="font-display text-4xl leading-[1.06] font-bold tracking-tight text-[#F8ECAB] sm:text-6xl">
                Your people.
                <br />
                Your possibilities.
              </h1>
              <p className="mt-5 text-base text-[#E5DEC0] sm:text-lg">
                Start with curiosity. Grow through community.
              </p>

              <div className="mt-10 max-w-md">
                <MembershipCard3D name={fullName || 'Your name here'} />
                <p className="mt-4 font-mono text-[11px] tracking-[0.14em] text-[#9E967C] uppercase">
                  MEMBERSHIP PREVIEW · NOT A VALID ID
                </p>
              </div>
            </div>

            {/* Right Membership Form */}
            <div className="lg:col-span-6">
              <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                <div>
                  <label
                    htmlFor="join-name"
                    className="block text-xs font-medium text-[#F8ECAB]"
                  >
                    Full name
                  </label>
                  <input
                    id="join-name"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Your full name"
                    className="mt-2 w-full rounded-lg border border-[#DAB24C]/35 bg-[#0D0D0B] px-4 py-3.5 text-sm text-[#F5ECCD] placeholder:text-[#7E765F] focus:border-[#DAB24C] focus:outline-none"
                  />
                </div>

                <div>
                  <label
                    htmlFor="join-email"
                    className="block text-xs font-medium text-[#F8ECAB]"
                  >
                    College email
                  </label>
                  <input
                    id="join-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@college.edu"
                    className="mt-2 w-full rounded-lg border border-[#DAB24C]/35 bg-[#0D0D0B] px-4 py-3.5 text-sm text-[#F5ECCD] placeholder:text-[#7E765F] focus:border-[#DAB24C] focus:outline-none"
                  />
                </div>

                <div>
                  <label
                    htmlFor="join-dept"
                    className="block text-xs font-medium text-[#F8ECAB]"
                  >
                    Department &amp; year
                  </label>
                  <select
                    id="join-dept"
                    value={departmentYear}
                    onChange={(e) => setDepartmentYear(e.target.value)}
                    className="mt-2 w-full rounded-lg border border-[#DAB24C]/35 bg-[#0D0D0B] px-4 py-3.5 text-sm text-[#F5ECCD] focus:border-[#DAB24C] focus:outline-none"
                  >
                    <option value="" className="bg-[#0D0D0B]">
                      Select department and year
                    </option>
                    {DEPARTMENTS.map((d) => (
                      <option key={d} value={d} className="bg-[#0D0D0B]">
                        {d}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <p className="block text-xs font-medium text-[#F8ECAB]">
                    Club interests
                  </p>
                  <div className="mt-2 grid grid-cols-1 gap-2 rounded-lg border border-[#DAB24C]/35 bg-[#0D0D0B] p-3 sm:grid-cols-2">
                    {clubs.map((c) => {
                      const active = selectedClubs.includes(c.id);
                      return (
                        <button
                          key={c.id}
                          type="button"
                          onClick={() => toggleClub(c.id)}
                          className={`flex items-center justify-between rounded-md border px-3 py-2 text-left text-xs transition-colors ${
                            active
                              ? 'border-[#DAB24C] bg-[#1A1811] text-[#F8ECAB]'
                              : 'border-white/10 bg-[#11110E] text-[#9E967C] hover:border-white/25'
                          }`}
                        >
                          <span className="truncate">{c.shortName}</span>
                          <span className="ml-2 font-mono text-[#DAB24C]">
                            {active ? '✓' : '+'}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="join-password"
                    className="block text-xs font-medium text-[#F8ECAB]"
                  >
                    Create password
                  </label>
                  <input
                    id="join-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 12 characters"
                    className="mt-2 w-full rounded-lg border border-[#DAB24C]/35 bg-[#0D0D0B] px-4 py-3.5 text-sm text-[#F5ECCD] placeholder:text-[#7E765F] focus:border-[#DAB24C] focus:outline-none"
                  />
                </div>

                <label className="flex cursor-pointer items-center gap-3 text-xs text-[#C4BC9E]">
                  <input
                    type="checkbox"
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                    className="h-4 w-4 accent-[#DAB24C]"
                  />
                  <span>I agree to the membership terms and privacy policy.</span>
                </label>

                {error && (
                  <p className="text-xs font-medium text-[#E5B84B]" role="alert">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  className="w-full rounded-lg bg-[#DAB24C] px-6 py-4 text-left text-sm font-semibold text-[#080807] transition-colors hover:bg-[#E5C05E] focus-visible:outline-2 focus-visible:outline-[#F8ECAB]"
                >
                  Create student account ↗
                </button>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => navigate('/login')}
                    className="text-xs font-medium text-[#DAB24C] hover:text-[#F8ECAB]"
                  >
                    Already part of DIV? Student Login →
                  </button>
                  <p className="mt-3 font-mono text-xs text-[#8D856C]">
                    Design preview · No account is created.
                  </p>
                </div>
              </form>
            </div>
          </div>
        </ScrollReveal3D>
      </div>
    </div>
  );
}
