import React, { useState } from 'react';
import { useDiv } from '../context/DivContext';

export function LoginPage() {
  const { navigate, setActiveModal, setPortalTab, setAdminTab } = useDiv();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPortalTab('overview');
    navigate('/portal');
  };

  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-12">
      {/* Left Dark Brand Split */}
      <div className="flex flex-col justify-between bg-[#080807] p-8 text-[#F5ECCD] sm:p-12 lg:col-span-6">
        <div>
          <button
            type="button"
            onClick={() => navigate('/')}
            className="text-xs font-medium text-[#DAB24C] transition-colors hover:text-[#F8ECAB]"
          >
            ← Back to DIV
          </button>

          <h1 className="mt-16 font-display text-4xl leading-[1.06] font-bold tracking-tight text-[#F8ECAB] sm:text-6xl">
            YOUR VISION.
            <br />
            YOUR SPACE.
          </h1>
          <p className="mt-6 max-w-md text-base leading-relaxed text-[#E5DEC0]">
            One account for your clubs, experiences and everything you’re
            becoming.
          </p>

          <div className="mt-12 w-56 overflow-hidden rounded-xl border border-[#DAB24C]/30 bg-[#F8ECAB] p-2 shadow-2xl">
            <img
              src="/images/div-seal.jpg"
              alt="Dive Into Vision The Tech Club Emblem"
              referrerPolicy="no-referrer"
              className="aspect-square w-full rounded-lg object-cover"
            />
          </div>
        </div>

        <p className="mt-14 font-mono text-xs tracking-[0.14em] text-[#DAB24C] uppercase">
          BUILD. INNOVATE. INSPIRE.
        </p>
      </div>

      {/* Right Warm Cream Sign-In Form */}
      <div className="flex flex-col justify-center bg-[#F8ECAB] p-8 text-[#0D0D0B] sm:p-14 lg:col-span-6 lg:p-20">
        <div className="mx-auto w-full max-w-md">
          <p className="font-mono text-xs tracking-[0.14em] text-[#6B5A23] uppercase">
            STUDENT PORTAL · WELCOME BACK
          </p>
          <h2 className="mt-4 font-display text-4xl leading-[1.08] font-bold text-[#0D0D0B] sm:text-5xl">
            Pick up where
            <br />
            you left off.
          </h2>
          <p className="mt-4 text-sm text-[#3D392B]">
            Sign in to your DIV student account.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label
                htmlFor="login-email"
                className="block text-xs font-semibold text-[#0D0D0B]"
              >
                College email
              </label>
              <input
                id="login-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@college.edu"
                className="mt-2 w-full rounded-lg border border-[#0D0D0B]/40 bg-transparent px-4 py-3.5 text-sm text-[#0D0D0B] placeholder:text-[#5B5237] focus:border-[#0D0D0B] focus:outline-none"
              />
            </div>

            <div>
              <label
                htmlFor="login-password"
                className="block text-xs font-semibold text-[#0D0D0B]"
              >
                Password
              </label>
              <input
                id="login-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="mt-2 w-full rounded-lg border border-[#0D0D0B]/40 bg-transparent px-4 py-3.5 text-sm text-[#0D0D0B] placeholder:text-[#5B5237] focus:border-[#0D0D0B] focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-between text-xs text-[#2C281E]">
              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="h-4 w-4 accent-[#0D0D0B]"
                />
                <span>Remember me</span>
              </label>
              <button
                type="button"
                onClick={() => setActiveModal({ type: 'forgot-password' })}
                className="font-medium hover:underline"
              >
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              className="w-full rounded-lg bg-[#DAB24C] px-6 py-4 text-left text-sm font-semibold text-[#080807] transition-colors hover:bg-[#C99F38] focus-visible:outline-2 focus-visible:outline-[#0D0D0B]"
            >
              Preview demo dashboard →
            </button>
          </form>

          <div className="mt-8 space-y-3 text-xs font-medium text-[#0D0D0B]">
            <div>
              <button
                type="button"
                onClick={() => navigate('/join')}
                className="hover:underline"
              >
                New to DIV? Become a member ↗
              </button>
            </div>
            <div>
              <button
                type="button"
                onClick={() => {
                  setAdminTab('overview');
                  navigate('/admin');
                }}
                className="hover:underline"
              >
                Administration demo →
              </button>
            </div>
            <p className="pt-4 font-mono text-[11px] text-[#5B5237]">
              Design preview · Authentication is not connected.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
