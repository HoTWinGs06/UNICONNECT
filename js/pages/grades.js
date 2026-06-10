// ============================================
// UniConnect — Academic Overview / Grades Page
// ============================================

export function renderGrades() {
  return `
  <main class="max-w-5xl mx-auto px-container-padding-mobile md:px-container-padding-desktop py-stack-lg">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
      <div>
        <h1 class="font-headline-lg text-headline-lg text-on-background mb-1">Academic Overview</h1>
        <p class="font-body-md text-body-md text-on-surface-variant">Spring 2024 Semester • Junior Year</p>
      </div>
      <div class="flex items-center gap-2">
        <select class="px-4 py-2 rounded-lg bg-surface-container border border-outline-variant font-label-md text-label-md text-on-surface outline-none focus:border-secondary transition-colors">
          <option>Spring 2024</option>
          <option>Fall 2023</option>
          <option>Spring 2023</option>
        </select>
      </div>
    </div>

    <!-- KPI Row -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-gutter mb-8">
      <!-- GPA -->
      <div class="bg-surface rounded-xl border border-outline-variant shadow-sm p-5 hover-lift">
        <div class="flex items-center justify-between mb-2">
          <span class="material-symbols-outlined text-secondary">school</span>
          <span class="bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-[10px] font-semibold">↑ 0.15</span>
        </div>
        <p class="font-display-md text-display-md text-on-surface font-bold text-[28px]">3.72</p>
        <p class="font-label-sm text-label-sm text-on-surface-variant mt-1">Current GPA</p>
      </div>
      <!-- Credits -->
      <div class="bg-surface rounded-xl border border-outline-variant shadow-sm p-5 hover-lift">
        <div class="flex items-center justify-between mb-2">
          <span class="material-symbols-outlined text-primary-container">bar_chart</span>
        </div>
        <p class="font-display-md text-display-md text-on-surface font-bold text-[28px]">96</p>
        <p class="font-label-sm text-label-sm text-on-surface-variant mt-1">Credits Earned</p>
      </div>
      <!-- Courses -->
      <div class="bg-surface rounded-xl border border-outline-variant shadow-sm p-5 hover-lift">
        <div class="flex items-center justify-between mb-2">
          <span class="material-symbols-outlined text-surface-tint">menu_book</span>
        </div>
        <p class="font-display-md text-display-md text-on-surface font-bold text-[28px]">5</p>
        <p class="font-label-sm text-label-sm text-on-surface-variant mt-1">Active Courses</p>
      </div>
      <!-- Degree Progress -->
      <div class="bg-surface rounded-xl border border-outline-variant shadow-sm p-5 hover-lift">
        <div class="flex items-center justify-between mb-2">
          <span class="material-symbols-outlined text-secondary">emoji_events</span>
        </div>
        <p class="font-display-md text-display-md text-on-surface font-bold text-[28px]">75%</p>
        <p class="font-label-sm text-label-sm text-on-surface-variant mt-1">Degree Progress</p>
      </div>
    </div>

    <!-- Two Column Layout -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-gutter">

      <!-- Course Grades (spans 2 cols) -->
      <div class="lg:col-span-2 bg-surface rounded-xl border border-outline-variant shadow-sm overflow-hidden">
        <div class="p-5 border-b border-outline-variant flex items-center justify-between">
          <h2 class="font-headline-md text-headline-md text-on-surface font-semibold text-[18px]">Course Grades</h2>
          <button class="font-label-sm text-label-sm text-secondary hover:underline transition-colors">View All</button>
        </div>

        <!-- Course List -->
        <div class="divide-y divide-outline-variant">
          <!-- CS 301 -->
          <div class="p-5 flex items-center gap-4 hover:bg-surface-container-low transition-colors">
            <div class="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center shrink-0">
              <span class="material-symbols-outlined text-secondary text-[20px]">computer</span>
            </div>
            <div class="flex-1 min-w-0">
              <h3 class="font-label-md text-label-md text-on-surface truncate">CS 301 — Data Structures & Algorithms</h3>
              <p class="font-label-sm text-label-sm text-on-surface-variant">Prof. Kim • 4 Credits</p>
            </div>
            <div class="text-right shrink-0">
              <p class="font-headline-md text-headline-md text-on-surface font-bold">A</p>
              <p class="font-label-sm text-label-sm text-on-surface-variant">93.2%</p>
            </div>
          </div>

          <!-- MATH 302 -->
          <div class="p-5 flex items-center gap-4 hover:bg-surface-container-low transition-colors">
            <div class="w-10 h-10 rounded-lg bg-primary-container/10 flex items-center justify-center shrink-0">
              <span class="material-symbols-outlined text-primary-container text-[20px]">calculate</span>
            </div>
            <div class="flex-1 min-w-0">
              <h3 class="font-label-md text-label-md text-on-surface truncate">MATH 302 — Calculus III</h3>
              <p class="font-label-sm text-label-sm text-on-surface-variant">Prof. Rivera • 4 Credits</p>
            </div>
            <div class="text-right shrink-0">
              <p class="font-headline-md text-headline-md text-on-surface font-bold">A-</p>
              <p class="font-label-sm text-label-sm text-on-surface-variant">90.8%</p>
            </div>
          </div>

          <!-- ENG 210 -->
          <div class="p-5 flex items-center gap-4 hover:bg-surface-container-low transition-colors">
            <div class="w-10 h-10 rounded-lg bg-surface-tint/10 flex items-center justify-center shrink-0">
              <span class="material-symbols-outlined text-surface-tint text-[20px]">history_edu</span>
            </div>
            <div class="flex-1 min-w-0">
              <h3 class="font-label-md text-label-md text-on-surface truncate">ENG 210 — Technical Writing</h3>
              <p class="font-label-sm text-label-sm text-on-surface-variant">Prof. Adams • 3 Credits</p>
            </div>
            <div class="text-right shrink-0">
              <p class="font-headline-md text-headline-md text-on-surface font-bold">B+</p>
              <p class="font-label-sm text-label-sm text-on-surface-variant">87.5%</p>
            </div>
          </div>

          <!-- PHYS 201 -->
          <div class="p-5 flex items-center gap-4 hover:bg-surface-container-low transition-colors">
            <div class="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center shrink-0">
              <span class="material-symbols-outlined text-secondary text-[20px]">science</span>
            </div>
            <div class="flex-1 min-w-0">
              <h3 class="font-label-md text-label-md text-on-surface truncate">PHYS 201 — General Physics II</h3>
              <p class="font-label-sm text-label-sm text-on-surface-variant">Prof. Lee • 4 Credits</p>
            </div>
            <div class="text-right shrink-0">
              <p class="font-headline-md text-headline-md text-on-surface font-bold">A</p>
              <p class="font-label-sm text-label-sm text-on-surface-variant">94.1%</p>
            </div>
          </div>

          <!-- CS 310 -->
          <div class="p-5 flex items-center gap-4 hover:bg-surface-container-low transition-colors">
            <div class="w-10 h-10 rounded-lg bg-primary-container/10 flex items-center justify-center shrink-0">
              <span class="material-symbols-outlined text-primary-container text-[20px]">storage</span>
            </div>
            <div class="flex-1 min-w-0">
              <h3 class="font-label-md text-label-md text-on-surface truncate">CS 310 — Database Systems</h3>
              <p class="font-label-sm text-label-sm text-on-surface-variant">Prof. Nguyen • 3 Credits</p>
            </div>
            <div class="text-right shrink-0">
              <p class="font-headline-md text-headline-md text-on-surface font-bold">B+</p>
              <p class="font-label-sm text-label-sm text-on-surface-variant">88.3%</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Column -->
      <div class="flex flex-col gap-gutter">
        <!-- Degree Progress Ring -->
        <div class="bg-surface rounded-xl border border-outline-variant shadow-sm p-5 hover-lift">
          <h2 class="font-headline-md text-headline-md text-on-surface font-semibold text-[18px] mb-4">Degree Progress</h2>
          <div class="flex items-center justify-center mb-4">
            <!-- SVG Progress Ring -->
            <svg class="w-32 h-32" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="50" fill="none" stroke="#e8eaed" stroke-width="10"/>
              <circle cx="60" cy="60" r="50" fill="none" stroke="#0058bc" stroke-width="10" stroke-linecap="round"
                stroke-dasharray="${2 * Math.PI * 50}"
                stroke-dashoffset="${2 * Math.PI * 50 * (1 - 0.75)}"
                transform="rotate(-90 60 60)"
                class="transition-all duration-1000"/>
              <text x="60" y="56" text-anchor="middle" class="font-bold" font-size="22" fill="#1a1c1e">75%</text>
              <text x="60" y="72" text-anchor="middle" font-size="10" fill="#74777f">Complete</text>
            </svg>
          </div>
          <div class="space-y-2">
            <div class="flex justify-between font-label-sm text-label-sm text-on-surface-variant">
              <span>Core Requirements</span>
              <span class="text-on-surface font-medium">32/40 credits</span>
            </div>
            <div class="w-full h-1.5 bg-surface-container rounded-full overflow-hidden">
              <div class="h-full bg-secondary rounded-full" style="width: 80%"></div>
            </div>
            <div class="flex justify-between font-label-sm text-label-sm text-on-surface-variant">
              <span>Electives</span>
              <span class="text-on-surface font-medium">18/24 credits</span>
            </div>
            <div class="w-full h-1.5 bg-surface-container rounded-full overflow-hidden">
              <div class="h-full bg-primary-container rounded-full" style="width: 75%"></div>
            </div>
            <div class="flex justify-between font-label-sm text-label-sm text-on-surface-variant">
              <span>General Ed</span>
              <span class="text-on-surface font-medium">46/56 credits</span>
            </div>
            <div class="w-full h-1.5 bg-surface-container rounded-full overflow-hidden">
              <div class="h-full bg-surface-tint rounded-full" style="width: 82%"></div>
            </div>
          </div>
        </div>

        <!-- Upcoming Deadlines -->
        <div class="bg-surface rounded-xl border border-outline-variant shadow-sm p-5 hover-lift">
          <h2 class="font-headline-md text-headline-md text-on-surface font-semibold text-[18px] mb-4">Upcoming Deadlines</h2>
          <div class="space-y-3">
            <div class="flex items-start gap-3">
              <div class="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center shrink-0">
                <span class="material-symbols-outlined text-red-500 text-[18px]">assignment</span>
              </div>
              <div>
                <p class="font-label-md text-label-md text-on-surface">BST Assignment</p>
                <p class="font-label-sm text-label-sm text-red-500">Due Friday, 11:59 PM</p>
              </div>
            </div>
            <div class="flex items-start gap-3">
              <div class="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center shrink-0">
                <span class="material-symbols-outlined text-amber-600 text-[18px]">quiz</span>
              </div>
              <div>
                <p class="font-label-md text-label-md text-on-surface">Physics Lab Quiz</p>
                <p class="font-label-sm text-label-sm text-amber-600">Due Monday, 9:00 AM</p>
              </div>
            </div>
            <div class="flex items-start gap-3">
              <div class="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                <span class="material-symbols-outlined text-blue-500 text-[18px]">description</span>
              </div>
              <div>
                <p class="font-label-md text-label-md text-on-surface">Technical Report Draft</p>
                <p class="font-label-sm text-label-sm text-blue-500">Due next Wednesday</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>`;
}

export function initGrades() {
  // No special interactions needed beyond hover effects
}
