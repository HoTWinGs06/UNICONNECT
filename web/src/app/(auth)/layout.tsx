import Link from 'next/link';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background text-on-background flex flex-col font-sans">
      {/* Top Navigation */}
      <header className="fixed w-full top-0 z-50 bg-background flex items-center justify-between px-6 md:px-16 py-4 border-b border-outline-variant">
        <Link href="/" className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
            school
          </span>
          <h1 className="text-xl font-bold text-primary tracking-tight">UniConnect</h1>
        </Link>
        <div className="hidden md:flex gap-6">
          <a className="text-sm font-semibold text-on-surface-variant hover:text-secondary transition-colors" href="#">
            Information
          </a>
          <a className="text-sm font-semibold text-on-surface-variant hover:text-secondary transition-colors" href="#">
            Faculty
          </a>
          <a className="text-sm font-semibold text-on-surface-variant hover:text-secondary transition-colors" href="#">
            Resources
          </a>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow pt-[57px] md:pb-[57px]">
        {children}
      </main>

      {/* Footer */}
      <footer className="w-full bg-surface-container-low flex flex-col md:flex-row justify-between items-center px-6 md:px-16 py-4 border-t border-outline-variant md:fixed md:bottom-0 md:left-0 md:right-0 md:z-40">
        <div className="flex flex-col md:flex-row items-center gap-4">
          <span className="text-sm font-bold text-primary tracking-tight">UniConnect</span>
          <p className="text-xs text-on-surface-variant">© 2026 UniConnect Academic Portal</p>
        </div>
        <div className="flex gap-6 mt-4 md:mt-0">
          <a className="text-xs text-on-surface-variant hover:text-secondary transition-all" href="#">
            Privacy Policy
          </a>
          <a className="text-xs text-on-surface-variant hover:text-secondary transition-all" href="#">
            Terms of Service
          </a>
          <a className="text-xs text-on-surface-variant hover:text-secondary transition-all" href="#">
            Support
          </a>
        </div>
      </footer>
    </div>
  );
}

