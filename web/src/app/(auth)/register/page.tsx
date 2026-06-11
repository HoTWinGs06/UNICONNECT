'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const router = useRouter();
  const supabase = createClient();

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            display_name: displayName,
          },
        },
      });

      if (signUpError) {
        setError(signUpError.message);
        return;
      }

      // Profile auto-created by trigger, redirect to onboarding
      router.push('/onboarding');
      router.refresh();
    } catch {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  }

  // Parallax Effect
  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const moveX = (e.clientX - rect.left - centerX) / 45;
    const moveY = (e.clientY - rect.top - centerY) / 45;
    setMousePos({ x: moveX, y: moveY });
  }

  function handleMouseLeave() {
    setMousePos({ x: 0, y: 0 });
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] min-h-[calc(100vh-57px)]">
      {/* Left: Illustration Side */}
      <section
        className="relative hidden lg:flex items-center justify-center bg-surface-container-low overflow-hidden border-r border-outline-variant p-12"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {/* Decorative Radial Grid */}
        <div
          className="absolute inset-0 opacity-5 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(var(--color-primary-container) 0.7px, transparent 0.7px)',
            backgroundSize: '24px 24px',
          }}
        />
        <div
          className="relative w-4/5 max-w-xl transition-transform duration-500 ease-out"
          style={{
            transform: `translate(${mousePos.x}px, ${mousePos.y}px)`,
          }}
        >
          <img
            alt="Academic Hub Illustration"
            className="w-full h-auto drop-shadow-md rounded-2xl animate-page-in"
            src="https://lh3.googleusercontent.com/aida/AP1WRLt063OksWc8yBJ-mfiBRyl_dDp64FGPe788qLmWHkOArchURVeM-mT2QMaj66bu50U3VJLS_Psok8nyN4yYlx3eTI2lxlXYLImD8SCCTN7HhHTtYZ2tQmLR0RW8jUBEwN_vQ3CBXoJIyA__Pyd5HrY_hvQkNf0RAn7aul8rtnNZeGmpnOcidhIQ1f9dBqv-4CBxJQnVDqNkpC6zKALEyQnO7ZAF3tspK0f2ProwX0yhPfFQlWx93-Oefg"
          />
          {/* Asymmetric UI Info Card */}
          <div className="absolute -bottom-6 -right-6 bg-surface-container-lowest border border-outline-variant p-6 rounded-2xl shadow-lg max-w-xs animate-float">
            <p className="text-sm font-bold text-primary mb-1">Campus Community</p>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Join thousands of students and faculty members collaborating, sharing resources, and building together.
            </p>
          </div>
        </div>
      </section>

      {/* Right: Register Form Side */}
      <section className="flex flex-col items-center justify-center p-6 md:p-12 bg-surface-container-lowest">
        <div className="w-full max-w-md space-y-6 animate-fade-in">
          {/* Header Text */}
          <div className="space-y-1.5">
            <h2 className="text-2xl font-bold text-primary tracking-tight">Create Account</h2>
            <p className="text-sm text-on-surface-variant">
              Get started with UniConnect for your academic journey.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleRegister} className="space-y-4">
            {error && (
              <div className="bg-error/10 border border-error/30 rounded-xl px-4 py-3 text-xs text-error font-medium animate-slide-up">
                {error}
              </div>
            )}

            {/* Display Name Input */}
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-primary" htmlFor="displayName">
                Full Name
              </label>
              <div className="relative flex items-center border border-outline rounded-xl bg-background transition-all focus-within:border-primary focus-within:ring-1 focus-within:ring-primary overflow-hidden">
                <span className="material-symbols-outlined absolute left-3.5 text-on-surface-variant text-[20px]">
                  person
                </span>
                <input
                  className="w-full pl-11 pr-4 py-3 bg-transparent border-none focus:outline-none focus:ring-0 text-sm text-primary placeholder:text-outline"
                  id="displayName"
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Alex Martinez"
                  required
                />
              </div>
            </div>

            {/* Email Input */}
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-primary" htmlFor="email">
                University Email Address
              </label>
              <div className="relative flex items-center border border-outline rounded-xl bg-background transition-all focus-within:border-primary focus-within:ring-1 focus-within:ring-primary overflow-hidden">
                <span className="material-symbols-outlined absolute left-3.5 text-on-surface-variant text-[20px]">
                  alternate_email
                </span>
                <input
                  className="w-full pl-11 pr-4 py-3 bg-transparent border-none focus:outline-none focus:ring-0 text-sm text-primary placeholder:text-outline"
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student.id@university.edu"
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-primary" htmlFor="password">
                Password
              </label>
              <div className="relative flex items-center border border-outline rounded-xl bg-background transition-all focus-within:border-primary focus-within:ring-1 focus-within:ring-primary overflow-hidden">
                <span className="material-symbols-outlined absolute left-3.5 text-on-surface-variant text-[20px]">
                  lock
                </span>
                <input
                  className="w-full pl-11 pr-11 py-3 bg-transparent border-none focus:outline-none focus:ring-0 text-sm text-primary placeholder:text-outline"
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={6}
                />
                <button
                  className="absolute right-3 text-on-surface-variant hover:text-primary active:scale-95 transition-all flex items-center"
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            {/* Confirm Password Input */}
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-primary" htmlFor="confirmPassword">
                Confirm Password
              </label>
              <div className="relative flex items-center border border-outline rounded-xl bg-background transition-all focus-within:border-primary focus-within:ring-1 focus-within:ring-primary overflow-hidden">
                <span className="material-symbols-outlined absolute left-3.5 text-on-surface-variant text-[20px]">
                  lock_reset
                </span>
                <input
                  className="w-full pl-11 pr-4 py-3 bg-transparent border-none focus:outline-none focus:ring-0 text-sm text-primary placeholder:text-outline"
                  id="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={6}
                />
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3 pt-3">
              <button
                className="w-full bg-primary-container text-white font-semibold text-sm py-3.5 rounded-xl hover:bg-secondary transition-all active:scale-[0.98] flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
                type="submit"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner !border-white/30 !border-t-white" />
                    Creating account...
                  </>
                ) : (
                  <>
                    Register Account
                    <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Registration / Help Links */}
          <div className="space-y-2 text-center pt-1">
            <p className="text-sm text-on-surface-variant">
              Already have an account?{' '}
              <Link href="/login" className="text-secondary font-bold hover:underline transition-colors">
                Sign in
              </Link>
            </p>
            <p className="text-xs text-on-surface-variant">
              Need assistance?{' '}
              <a className="text-secondary underline font-semibold" href="#">
                Contact help desk
              </a>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

