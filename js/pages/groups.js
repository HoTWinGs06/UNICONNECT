// ============================================
// UniConnect — Study Group Finder Page
// ============================================

export function renderGroups() {
  return `
  <main class="max-w-5xl mx-auto px-container-padding-mobile md:px-container-padding-desktop py-stack-lg">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
      <div>
        <h1 class="font-headline-lg text-headline-lg text-on-background mb-1">Study Groups</h1>
        <p class="font-body-md text-body-md text-on-surface-variant">Find study partners or create your own group</p>
      </div>
      <button class="inline-flex items-center gap-2 bg-secondary text-on-secondary px-5 py-3 rounded-lg font-label-md text-label-md hover:bg-secondary-container transition-colors shadow-sm press-scale">
        <span class="material-symbols-outlined text-[20px]">add</span>
        Create Study Group
      </button>
    </div>

    <!-- Filters -->
    <div class="flex flex-wrap gap-2 mb-6">
      <button class="px-4 py-2 rounded-full bg-secondary text-on-secondary font-label-md text-label-md transition-colors shadow-sm">All Groups</button>
      <button class="px-4 py-2 rounded-full bg-surface-container text-on-surface-variant font-label-md text-label-md hover:bg-surface-container-low transition-colors">Computer Science</button>
      <button class="px-4 py-2 rounded-full bg-surface-container text-on-surface-variant font-label-md text-label-md hover:bg-surface-container-low transition-colors">Engineering</button>
      <button class="px-4 py-2 rounded-full bg-surface-container text-on-surface-variant font-label-md text-label-md hover:bg-surface-container-low transition-colors">Business</button>
      <button class="px-4 py-2 rounded-full bg-surface-container text-on-surface-variant font-label-md text-label-md hover:bg-surface-container-low transition-colors">Sciences</button>
    </div>

    <!-- Group Cards Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">

      <!-- Card 1 -->
      <div class="bg-surface rounded-xl border border-outline-variant shadow-sm overflow-hidden hover-lift">
        <div class="h-2 bg-gradient-to-r from-secondary to-primary-container"></div>
        <div class="p-5">
          <div class="flex items-start justify-between mb-3">
            <div class="w-12 h-12 rounded-xl bg-surface-variant flex items-center justify-center">
              <span class="material-symbols-outlined text-secondary" style="font-variation-settings: 'FILL' 1;">computer</span>
            </div>
            <span class="bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-[11px] font-semibold flex items-center gap-1">
              <span class="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse-dot"></span> Active Now
            </span>
          </div>
          <h3 class="font-headline-md text-headline-md text-on-surface mb-1 text-[18px]">Algorithms Study Circle</h3>
          <p class="font-body-sm text-body-sm text-on-surface-variant mb-4 line-clamp-2">Weekly problem-solving sessions focusing on dynamic programming and graph algorithms for CS301.</p>
          <div class="flex items-center gap-2 mb-4">
            <div class="flex -space-x-2">
              <img alt="" class="w-7 h-7 rounded-full border-2 border-surface object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA4XGygvrT7G7LV6KJM69BKVnI9JsnuWJxghw36lB6MJ-frQHFgjvTzYfdRJmJbvS7AfN6RpO61skLFWHy8NZMs4wy5L6r5HSgc7Fxfks72pWrqBFdZXs2yBHYu3i5IAQhrAo4Br_fKLcAQigfcmvZZ3M7mRHXHEzRH-1i-H7rtgr620OzVEdQBuUeeQSLujBkq-v13LPL-rPYrVdh9nmGv-j4edSU-Iv9h17b53RQW2fWpnOnIEw40iEo0nuPT58qxNzpDQMLHOGQ"/>
              <img alt="" class="w-7 h-7 rounded-full border-2 border-surface object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCVhjM381ava6GDrigrKAGbdrcUXTFUmAADo8hHHnN7_DvyZBIXxW2lc3DjWyJPdatk38NduH66SSwgpRXExZvZnBLJqtPp8jpakl6bkDh5WuWm3SZ-dOF8flzUQyfmeY0-JZtQG8zhRsLZWEMCfiwq8l7VkSZXj9ZiCGZSk9kR5Yq__X349j6_0zJEMQGlZ8iXhmx0s6_Uy19MiIaJ88YGJHmJRXnoOQ3XbMa3nevpqZEJEOQzxtrwfVYkqCeR45dMZmwOXdwm8AM"/>
              <div class="w-7 h-7 rounded-full border-2 border-surface bg-surface-variant text-on-surface-variant flex items-center justify-center text-[10px] font-bold">+3</div>
            </div>
            <span class="font-label-sm text-label-sm text-on-surface-variant">5 members</span>
          </div>
          <div class="flex items-center gap-2 text-on-surface-variant font-label-sm text-label-sm mb-4">
            <span class="material-symbols-outlined text-[16px]">schedule</span>
            Wed & Fri, 3–5 PM
          </div>
          <button class="w-full py-2.5 bg-surface-container text-on-surface font-label-md text-label-md rounded-lg hover:bg-surface-container-low transition-colors press-scale">
            Request to Join
          </button>
        </div>
      </div>

      <!-- Card 2 -->
      <div class="bg-surface rounded-xl border border-outline-variant shadow-sm overflow-hidden hover-lift">
        <div class="h-2 bg-gradient-to-r from-primary-container to-surface-tint"></div>
        <div class="p-5">
          <div class="flex items-start justify-between mb-3">
            <div class="w-12 h-12 rounded-xl bg-surface-variant flex items-center justify-center">
              <span class="material-symbols-outlined text-primary-container" style="font-variation-settings: 'FILL' 1;">science</span>
            </div>
            <span class="bg-surface-container text-on-surface-variant px-2 py-0.5 rounded-full text-[11px] font-semibold">
              Starts Mon
            </span>
          </div>
          <h3 class="font-headline-md text-headline-md text-on-surface mb-1 text-[18px]">Organic Chemistry Lab Prep</h3>
          <p class="font-body-sm text-body-sm text-on-surface-variant mb-4 line-clamp-2">Pre-lab review sessions to discuss procedures, safety, and expected results before weekly labs.</p>
          <div class="flex items-center gap-2 mb-4">
            <div class="flex -space-x-2">
              <img alt="" class="w-7 h-7 rounded-full border-2 border-surface object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDsfUhEUaR28wYVTF9ZZGGatNYTBpLsmECoc0hhuS-BMViNORCBgymuQTyvKR0tTmXcrKhbHMjXl7M67NOtlv_FGnS4l7fv8OqEaoC89z6kcEFvn1ksCyjmM-D5Km14cQjglwFX8Vqu6E3VEujc-q_Z8rBgDjX4_hIyH6JnWS-_iLw_npyirIduyXxVepSwzt6t8WJLOu2_jYaYe629qLkFf-JP8rkVgGbIjlO4GL-CCY8OW1PiUFayezTShe1HkvJbqUAE1FBgyRA"/>
              <div class="w-7 h-7 rounded-full border-2 border-surface bg-surface-variant text-on-surface-variant flex items-center justify-center text-[10px] font-bold">+1</div>
            </div>
            <span class="font-label-sm text-label-sm text-on-surface-variant">2 members</span>
          </div>
          <div class="flex items-center gap-2 text-on-surface-variant font-label-sm text-label-sm mb-4">
            <span class="material-symbols-outlined text-[16px]">schedule</span>
            Mon, 1–2 PM
          </div>
          <button class="w-full py-2.5 bg-secondary text-on-secondary font-label-md text-label-md rounded-lg hover:bg-secondary-container transition-colors press-scale">
            Join Group
          </button>
        </div>
      </div>

      <!-- Card 3 -->
      <div class="bg-surface rounded-xl border border-outline-variant shadow-sm overflow-hidden hover-lift">
        <div class="h-2 bg-gradient-to-r from-surface-tint to-secondary"></div>
        <div class="p-5">
          <div class="flex items-start justify-between mb-3">
            <div class="w-12 h-12 rounded-xl bg-surface-variant flex items-center justify-center">
              <span class="material-symbols-outlined text-surface-tint" style="font-variation-settings: 'FILL' 1;">calculate</span>
            </div>
            <span class="bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-[11px] font-semibold flex items-center gap-1">
              <span class="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse-dot"></span> Active Now
            </span>
          </div>
          <h3 class="font-headline-md text-headline-md text-on-surface mb-1 text-[18px]">Calculus III Workshop</h3>
          <p class="font-body-sm text-body-sm text-on-surface-variant mb-4 line-clamp-2">Collaborative problem sets and exam prep for multivariable calculus. All skill levels welcome!</p>
          <div class="flex items-center gap-2 mb-4">
            <div class="flex -space-x-2">
              <img alt="" class="w-7 h-7 rounded-full border-2 border-surface object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCVhjM381ava6GDrigrKAGbdrcUXTFUmAADo8hHHnN7_DvyZBIXxW2lc3DjWyJPdatk38NduH66SSwgpRXExZvZnBLJqtPp8jpakl6bkDh5WuWm3SZ-dOF8flzUQyfmeY0-JZtQG8zhRsLZWEMCfiwq8l7VkSZXj9ZiCGZSk9kR5Yq__X349j6_0zJEMQGlZ8iXhmx0s6_Uy19MiIaJ88YGJHmJRXnoOQ3XbMa3nevpqZEJEOQzxtrwfVYkqCeR45dMZmwOXdwm8AM"/>
              <img alt="" class="w-7 h-7 rounded-full border-2 border-surface object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA4XGygvrT7G7LV6KJM69BKVnI9JsnuWJxghw36lB6MJ-frQHFgjvTzYfdRJmJbvS7AfN6RpO61skLFWHy8NZMs4wy5L6r5HSgc7Fxfks72pWrqBFdZXs2yBHYu3i5IAQhrAo4Br_fKLcAQigfcmvZZ3M7mRHXHEzRH-1i-H7rtgr620OzVEdQBuUeeQSLujBkq-v13LPL-rPYrVdh9nmGv-j4edSU-Iv9h17b53RQW2fWpnOnIEw40iEo0nuPT58qxNzpDQMLHOGQ"/>
              <img alt="" class="w-7 h-7 rounded-full border-2 border-surface object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDsfUhEUaR28wYVTF9ZZGGatNYTBpLsmECoc0hhuS-BMViNORCBgymuQTyvKR0tTmXcrKhbHMjXl7M67NOtlv_FGnS4l7fv8OqEaoC89z6kcEFvn1ksCyjmM-D5Km14cQjglwFX8Vqu6E3VEujc-q_Z8rBgDjX4_hIyH6JnWS-_iLw_npyirIduyXxVepSwzt6t8WJLOu2_jYaYe629qLkFf-JP8rkVgGbIjlO4GL-CCY8OW1PiUFayezTShe1HkvJbqUAE1FBgyRA"/>
              <div class="w-7 h-7 rounded-full border-2 border-surface bg-surface-variant text-on-surface-variant flex items-center justify-center text-[10px] font-bold">+4</div>
            </div>
            <span class="font-label-sm text-label-sm text-on-surface-variant">7 members</span>
          </div>
          <div class="flex items-center gap-2 text-on-surface-variant font-label-sm text-label-sm mb-4">
            <span class="material-symbols-outlined text-[16px]">schedule</span>
            Tue & Thu, 6–8 PM
          </div>
          <button class="w-full py-2.5 bg-surface-container text-on-surface font-label-md text-label-md rounded-lg hover:bg-surface-container-low transition-colors press-scale">
            Request to Join
          </button>
        </div>
      </div>

    </div>
  </main>`;
}

export function initGroups() {
  // Filter chip toggle
  const filterBtns = document.querySelectorAll('.flex.flex-wrap.gap-2.mb-6 button');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => {
        b.classList.remove('bg-secondary', 'text-on-secondary');
        b.classList.add('bg-surface-container', 'text-on-surface-variant');
      });
      btn.classList.remove('bg-surface-container', 'text-on-surface-variant');
      btn.classList.add('bg-secondary', 'text-on-secondary');
    });
  });
}
