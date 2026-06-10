// ============================================
// UniConnect — Onboarding Page
// ============================================

export function renderOnboarding() {
  return `
  <div class="bg-gradient-to-br from-background to-surface-container-low min-h-screen flex flex-col items-center justify-center p-container-padding-mobile md:p-container-padding-desktop antialiased">
    <!-- Progress Indicator / Top Bar -->
    <div class="w-full max-w-3xl flex justify-between items-center mb-8">
      <div class="flex items-center gap-2 text-primary-container font-headline-md text-headline-md font-bold">
        <span class="material-symbols-outlined text-secondary" style="font-variation-settings: 'FILL' 1;">hub</span>
        UniConnect
      </div>
      <div class="font-label-sm text-label-sm text-on-surface-variant flex items-center gap-2">
        <div class="flex gap-1.5">
          <span class="step-dot active"></span>
          <span class="step-dot"></span>
          <span class="step-dot"></span>
        </div>
        Step 1 of 3
      </div>
    </div>

    <!-- Main Onboarding Card -->
    <main class="w-full max-w-3xl bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant p-6 md:p-10 relative overflow-hidden hover-lift">
      <!-- Subtle background decoration -->
      <div class="absolute top-0 right-0 w-64 h-64 bg-primary-fixed rounded-full blur-3xl opacity-20 -mr-20 -mt-20 pointer-events-none"></div>
      <div class="absolute bottom-0 left-0 w-48 h-48 bg-secondary-fixed rounded-full blur-3xl opacity-10 -ml-16 -mb-16 pointer-events-none"></div>

      <!-- Header -->
      <header class="mb-10 relative z-10">
        <h1 class="font-headline-lg-mobile text-headline-lg-mobile md:font-headline-lg md:text-headline-lg text-on-background mb-3">
          Welcome to your campus network
        </h1>
        <p class="font-body-md text-body-md text-on-surface-variant max-w-xl">
          Let's personalize your academic experience. First, tell us a bit about your role and what you're studying to help us curate your initial connections.
        </p>
      </header>

      <!-- Role Selection -->
      <section class="mb-10 relative z-10">
        <h2 class="font-label-md text-label-md text-on-background mb-4 uppercase tracking-wider">Select your primary role</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4" id="role-selection">
          <!-- Student -->
          <label class="group relative cursor-pointer press-scale">
            <input checked class="peer sr-only" name="role" type="radio" value="student"/>
            <div class="h-full p-6 rounded-lg border-2 border-transparent bg-surface-container-lowest hover:border-outline hover:bg-surface-container transition-all duration-200 peer-checked:border-secondary peer-checked:bg-surface-container-low">
              <div class="flex justify-between items-start mb-4">
                <div class="w-12 h-12 rounded-full bg-surface-variant flex items-center justify-center text-on-surface-variant peer-checked:bg-secondary peer-checked:text-on-secondary transition-colors group-[:has(input:checked)]:bg-secondary group-[:has(input:checked)]:text-on-secondary">
                  <span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">school</span>
                </div>
                <span class="material-symbols-outlined text-transparent peer-checked:text-secondary transition-colors group-[:has(input:checked)]:text-secondary" style="font-variation-settings: 'FILL' 1;">check_circle</span>
              </div>
              <h3 class="font-headline-md text-headline-md text-on-background mb-1 text-[20px]">Student</h3>
              <p class="font-body-sm text-body-sm text-on-surface-variant">Undergraduate, Graduate, or PhD candidate navigating coursework and campus life.</p>
            </div>
          </label>

          <!-- Faculty -->
          <label class="group relative cursor-pointer press-scale">
            <input class="peer sr-only" name="role" type="radio" value="faculty"/>
            <div class="h-full p-6 rounded-lg border-2 border-transparent bg-surface-container-lowest hover:border-outline hover:bg-surface-container transition-all duration-200 peer-checked:border-secondary peer-checked:bg-surface-container-low">
              <div class="flex justify-between items-start mb-4">
                <div class="w-12 h-12 rounded-full bg-surface-variant flex items-center justify-center text-on-surface-variant transition-colors group-[:has(input:checked)]:bg-secondary group-[:has(input:checked)]:text-on-secondary">
                  <span class="material-symbols-outlined">history_edu</span>
                </div>
                <span class="material-symbols-outlined text-transparent transition-colors group-[:has(input:checked)]:text-secondary" style="font-variation-settings: 'FILL' 1;">check_circle</span>
              </div>
              <h3 class="font-headline-md text-headline-md text-on-background mb-1 text-[20px]">Faculty &amp; Staff</h3>
              <p class="font-body-sm text-body-sm text-on-surface-variant">Professor, TA, or Administrator managing courses, research, or student affairs.</p>
            </div>
          </label>
        </div>
      </section>

      <!-- Branch / Department Selection -->
      <section class="mb-8 relative z-10">
        <h2 class="font-label-md text-label-md text-on-background mb-4 uppercase tracking-wider">Academic Branch</h2>
        <div class="relative">
          <span class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
          <input id="branch-search" class="w-full pl-12 pr-4 py-4 rounded-lg border border-outline-variant bg-surface-container-lowest focus:border-secondary focus:ring-2 focus:ring-secondary/20 outline-none transition-all font-body-md text-body-md text-on-background placeholder:text-outline shadow-sm" placeholder="Search for departments e.g., Computer Science, Law..." type="text"/>
        </div>
        <!-- Quick Suggestions -->
        <div class="mt-4">
          <p class="font-label-sm text-label-sm text-on-surface-variant mb-3">Popular across campus:</p>
          <div class="flex flex-wrap gap-2" id="branch-chips">
            <button class="branch-chip px-4 py-2 rounded-lg border border-primary-container bg-primary-container text-on-primary-container font-label-md text-label-md transition-all flex items-center gap-1 shadow-sm active" data-branch="cs">
              Computer Science
              <span class="material-symbols-outlined text-[16px] close-icon">close</span>
            </button>
            <button class="branch-chip px-4 py-2 rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface-variant font-label-md text-label-md hover:bg-surface-container hover:text-on-background transition-all shadow-sm" data-branch="biz">
              Business Administration
            </button>
            <button class="branch-chip px-4 py-2 rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface-variant font-label-md text-label-md hover:bg-surface-container hover:text-on-background transition-all shadow-sm" data-branch="med">
              Pre-Med / Biology
            </button>
            <button class="branch-chip px-4 py-2 rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface-variant font-label-md text-label-md hover:bg-surface-container hover:text-on-background transition-all shadow-sm" data-branch="law">
              Law &amp; Ethics
            </button>
            <button class="branch-chip px-4 py-2 rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface-variant font-label-md text-label-md hover:bg-surface-container hover:text-on-background transition-all shadow-sm" data-branch="eng">
              Engineering
            </button>
            <button class="branch-chip px-4 py-2 rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface-variant font-label-md text-label-md hover:bg-surface-container hover:text-on-background transition-all shadow-sm" data-branch="art">
              Fine Arts
            </button>
          </div>
        </div>
      </section>

      <!-- Footer Actions -->
      <footer class="mt-12 pt-6 border-t border-outline-variant flex items-center justify-between relative z-10">
        <button class="font-label-md text-label-md text-on-surface-variant hover:text-on-background px-2 py-2 transition-colors">
          Cancel
        </button>
        <button id="onboarding-continue" class="px-8 py-3 rounded-md bg-secondary text-on-secondary font-label-md text-label-md hover:bg-secondary-container active:bg-primary-container transition-colors flex items-center gap-2 shadow-sm press-scale">
          Continue
          <span class="material-symbols-outlined text-[20px]">arrow_forward</span>
        </button>
      </footer>
    </main>
  </div>`;
}

export function initOnboarding() {
  // Branch chip toggle
  const chips = document.querySelectorAll('.branch-chip');
  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      const isActive = chip.classList.contains('active');
      if (isActive) {
        chip.classList.remove('active', 'bg-primary-container', 'text-on-primary-container', 'border-primary-container');
        chip.classList.add('bg-surface-container-lowest', 'text-on-surface-variant', 'border-outline-variant');
        const closeIcon = chip.querySelector('.close-icon');
        if (closeIcon) closeIcon.remove();
      } else {
        chip.classList.add('active', 'bg-primary-container', 'text-on-primary-container', 'border-primary-container');
        chip.classList.remove('bg-surface-container-lowest', 'text-on-surface-variant', 'border-outline-variant');
        if (!chip.querySelector('.close-icon')) {
          const icon = document.createElement('span');
          icon.className = 'material-symbols-outlined text-[16px] close-icon';
          icon.textContent = 'close';
          chip.appendChild(icon);
        }
      }
    });
  });

  // Continue button — navigate to feed
  const continueBtn = document.getElementById('onboarding-continue');
  if (continueBtn) {
    continueBtn.addEventListener('click', () => {
      window.location.hash = '/feed';
    });
  }
}
