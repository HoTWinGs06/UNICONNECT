'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

const branches = [
  'Computer Science',
  'Business Administration',
  'Pre-Med / Biology',
  'Law & Ethics',
  'Engineering',
  'Fine Arts',
  'Mathematics',
  'Psychology',
];

const years = [1, 2, 3, 4, 5, 6];

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [role, setRole] = useState<'student' | 'faculty'>('student');
  const [selectedBranch, setSelectedBranch] = useState('Computer Science');
  const [selectedYear, setSelectedYear] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  async function handleComplete() {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      await supabase
        .from('profiles')
        .update({
          role,
          branch: selectedBranch,
          year: selectedYear,
          onboarded: true,
        })
        .eq('id', user.id);

      router.push('/feed');
      router.refresh();
    } catch (err) {
      console.error('Onboarding error:', err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-gradient-to-br from-background to-surface-container-low min-h-screen flex flex-col items-center justify-center p-4 md:p-6">
      {/* Progress */}
      <div className="w-full max-w-3xl flex justify-between items-center mb-8">
        <div className="flex items-center gap-2 text-primary-container font-bold text-xl">
          <span
            className="material-symbols-outlined text-secondary"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            hub
          </span>
          UniConnect
        </div>
        <div className="text-label-sm text-on-surface-variant flex items-center gap-2">
          <div className="flex gap-1.5">
            {[1, 2, 3].map((s) => (
              <span
                key={s}
                className={`step-dot ${step >= s ? 'active' : ''}`}
              />
            ))}
          </div>
          Step {step} of 3
        </div>
      </div>

      {/* Main Card */}
      <main className="w-full max-w-3xl bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant p-6 md:p-10 relative overflow-hidden hover-lift">
        {/* Decorative blurs */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-fixed rounded-full blur-3xl opacity-20 -mr-20 -mt-20 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-secondary-container rounded-full blur-3xl opacity-10 -ml-16 -mb-16 pointer-events-none" />

        {/* Step 1: Role Selection */}
        {step === 1 && (
          <div className="relative z-10 animate-fade-in">
            <header className="mb-10">
              <h1 className="text-2xl md:text-3xl font-bold text-on-background mb-3">
                Welcome to your campus network
              </h1>
              <p className="text-body-md text-on-surface-variant max-w-xl">
                Let&apos;s personalize your academic experience. First, tell us about your role.
              </p>
            </header>

            <h2 className="text-label-md text-on-background mb-4 uppercase tracking-wider font-medium">
              Select your primary role
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(['student', 'faculty'] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => setRole(r)}
                  className={`p-6 rounded-lg border-2 text-left transition-all press-scale ${
                    role === r
                      ? 'border-secondary bg-surface-container-low'
                      : 'border-transparent bg-surface-container-lowest hover:border-outline hover:bg-surface-container'
                  }`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                        role === r
                          ? 'bg-secondary text-on-secondary'
                          : 'bg-surface-variant text-on-surface-variant'
                      }`}
                    >
                      <span
                        className="material-symbols-outlined"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        {r === 'student' ? 'school' : 'history_edu'}
                      </span>
                    </div>
                    <span
                      className="material-symbols-outlined transition-colors text-secondary"
                      style={{ fontVariationSettings: role === r ? "'FILL' 1" : "" }}
                    >
                      {role === r ? 'check_circle' : ''}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-on-background mb-1">
                    {r === 'student' ? 'Student' : 'Faculty & Staff'}
                  </h3>
                  <p className="text-body-sm text-on-surface-variant">
                    {r === 'student'
                      ? 'Undergraduate, Graduate, or PhD candidate navigating coursework and campus life.'
                      : 'Professor, TA, or Administrator managing courses, research, or student affairs.'}
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Branch Selection */}
        {step === 2 && (
          <div className="relative z-10 animate-fade-in">
            <header className="mb-8">
              <h1 className="text-2xl font-bold text-on-background mb-3">
                Academic Branch
              </h1>
              <p className="text-body-md text-on-surface-variant">
                Select your department or area of study.
              </p>
            </header>

            <div className="relative mb-6">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant">
                search
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for departments e.g., Computer Science, Law..."
                className="w-full pl-12 pr-4 py-3.5 rounded-lg border border-outline-variant bg-surface-container-lowest focus:border-secondary focus:ring-2 focus:ring-secondary/20 outline-none transition-all text-sm text-on-background placeholder:text-outline shadow-sm"
              />
            </div>

            <p className="text-label-sm text-on-surface-variant mb-3">
              {searchQuery ? 'Search results:' : 'Popular across campus:'}
            </p>
            <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto p-1">
              {branches
                .filter((b) => b.toLowerCase().includes(searchQuery.toLowerCase()))
                .map((branch) => (
                  <button
                    key={branch}
                    type="button"
                    onClick={() => setSelectedBranch(branch)}
                    className={`px-4 py-2 rounded-lg border font-medium text-sm transition-all press-scale flex items-center gap-1 ${
                      selectedBranch === branch
                        ? 'border-primary-container bg-primary-container text-on-primary-container'
                        : 'border-outline-variant bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container hover:text-on-background'
                    }`}
                  >
                    {branch}
                    {selectedBranch === branch && (
                      <span className="material-symbols-outlined text-[16px]">
                        check
                      </span>
                    )}
                  </button>
                ))}
              {branches.filter((b) => b.toLowerCase().includes(searchQuery.toLowerCase())).length === 0 && (
                <p className="text-sm text-on-surface-variant p-2">No departments match your search.</p>
              )}
            </div>
          </div>
        )}

        {/* Step 3: Year Selection */}
        {step === 3 && (
          <div className="relative z-10 animate-fade-in">
            <header className="mb-8">
              <h1 className="text-2xl font-bold text-on-background mb-3">
                Academic Year
              </h1>
              <p className="text-body-md text-on-surface-variant">
                What year are you currently in?
              </p>
            </header>

            <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
              {years.map((y) => (
                <button
                  key={y}
                  onClick={() => setSelectedYear(y)}
                  className={`py-4 rounded-lg border-2 font-semibold text-lg transition-all press-scale ${
                    selectedYear === y
                      ? 'border-secondary bg-secondary text-on-secondary'
                      : 'border-outline-variant bg-surface-container-lowest text-on-surface-variant hover:border-outline'
                  }`}
                >
                  {y}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <footer className="mt-12 pt-6 border-t border-outline-variant flex items-center justify-between relative z-10">
          <button
            onClick={async () => {
              if (step > 1) {
                setStep(step - 1);
              } else {
                await supabase.auth.signOut();
                router.push('/login');
                router.refresh();
              }
            }}
            className="text-label-md text-on-surface-variant hover:text-on-background px-2 py-2 transition-colors"
          >
            {step > 1 ? 'Back' : 'Log Out'}
          </button>
          <button
            onClick={() => (step < 3 ? setStep(step + 1) : handleComplete())}
            disabled={loading}
            className="px-8 py-3 rounded-lg bg-secondary text-on-secondary font-medium text-sm hover:bg-secondary/90 active:scale-[0.97] transition-all flex items-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <>
                <span className="spinner !border-white/30 !border-t-white" />
                Saving...
              </>
            ) : step < 3 ? (
              <>
                Continue
                <span className="material-symbols-outlined text-[20px]">
                  arrow_forward
                </span>
              </>
            ) : (
              <>
                Get Started
                <span className="material-symbols-outlined text-[20px]">
                  check
                </span>
              </>
            )}
          </button>
        </footer>
      </main>
    </div>
  );
}
