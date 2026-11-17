import React, { useState } from 'react';
import { useDiv } from '../context/DivContext';
import { ScrollReveal3D } from '../components/ui/DivBrandMark';

const SUBJECTS = [
  'Membership enquiry',
  'Club collaboration',
  'Event or workshop question',
  'Media & photography',
  'General feedback',
];

export function ContactPage() {
  const { setActiveModal } = useDiv();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState(SUBJECTS[0]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.includes('@') || !message.trim()) {
      setError('Please enter your name, a valid email address, and a message.');
      return;
    }
    setError('');
    setActiveModal({ type: 'enquiry', name: name.trim(), subject });
  };

  return (
    <div className="bg-[#080807] py-16 text-[#F5ECCD] sm:py-24">
      <div className="mx-auto max-w-[1360px] px-5 sm:px-8">
        <ScrollReveal3D>
          <p className="font-mono text-xs tracking-[0.14em] text-[#DAB24C] uppercase">
            CONTACT · LET’S START A CONVERSATION
          </p>

          <div className="mt-6 grid grid-cols-1 items-start gap-14 lg:grid-cols-12">
            {/* Left Info */}
            <div className="lg:col-span-6">
              <h1 className="font-display text-4xl leading-[1.06] font-bold tracking-tight text-[#F8ECAB] sm:text-6xl">
                Good things start
                <br />
                with a hello.
              </h1>
              <p className="mt-6 max-w-md text-base leading-relaxed text-[#E5DEC0] sm:text-lg">
                Questions about clubs, membership or an idea you’d like to bring
                to DIV? This is your starting point.
              </p>

              <div className="mt-12 border-t border-white/10 pt-8">
                <p className="font-mono text-xs tracking-[0.14em] text-[#DAB24C] uppercase">
                  FIND US
                </p>
                <p className="mt-3 text-lg font-medium text-[#F8ECAB]">
                  Chouksey Engineering College
                  <br />
                  Bilaspur, Chhattisgarh, India
                </p>
                <p className="mt-6 text-xs leading-relaxed text-[#9E967C]">
                  Official email &amp; office contact to be confirmed.
                  <br />
                  Social channels will be linked after verification.
                </p>
              </div>
            </div>

            {/* Right Form */}
            <div className="lg:col-span-6">
              <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                <div>
                  <label
                    htmlFor="contact-name"
                    className="block text-xs font-medium text-[#F8ECAB]"
                  >
                    Your name
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                    className="mt-2 w-full rounded-lg border border-[#DAB24C]/35 bg-[#0D0D0B] px-4 py-3.5 text-sm text-[#F5ECCD] placeholder:text-[#7E765F] focus:border-[#DAB24C] focus:outline-none"
                  />
                </div>

                <div>
                  <label
                    htmlFor="contact-email"
                    className="block text-xs font-medium text-[#F8ECAB]"
                  >
                    Email address
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@college.edu"
                    className="mt-2 w-full rounded-lg border border-[#DAB24C]/35 bg-[#0D0D0B] px-4 py-3.5 text-sm text-[#F5ECCD] placeholder:text-[#7E765F] focus:border-[#DAB24C] focus:outline-none"
                  />
                </div>

                <div>
                  <label
                    htmlFor="contact-subject"
                    className="block text-xs font-medium text-[#F8ECAB]"
                  >
                    Subject
                  </label>
                  <select
                    id="contact-subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="mt-2 w-full rounded-lg border border-[#DAB24C]/35 bg-[#0D0D0B] px-4 py-3.5 text-sm text-[#F5ECCD] focus:border-[#DAB24C] focus:outline-none"
                  >
                    {SUBJECTS.map((s) => (
                      <option key={s} value={s} className="bg-[#0D0D0B]">
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="contact-message"
                    className="block text-xs font-medium text-[#F8ECAB]"
                  >
                    Message
                  </label>
                  <textarea
                    id="contact-message"
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tell us how we can help..."
                    className="mt-2 w-full rounded-lg border border-[#DAB24C]/35 bg-[#0D0D0B] px-4 py-3.5 text-sm text-[#F5ECCD] placeholder:text-[#7E765F] focus:border-[#DAB24C] focus:outline-none"
                  />
                </div>

                {error && (
                  <p className="text-xs font-medium text-[#E5B84B]" role="alert">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  className="w-full rounded-lg bg-[#DAB24C] px-6 py-4 text-left text-sm font-semibold text-[#080807] transition-colors hover:bg-[#E5C05E] focus-visible:outline-2 focus-visible:outline-[#F8ECAB]"
                >
                  Send enquiry ↗
                </button>

                <p className="font-mono text-xs text-[#8D856C]">
                  Design preview · No message is sent.
                </p>
              </form>
            </div>
          </div>
        </ScrollReveal3D>
      </div>
    </div>
  );
}
